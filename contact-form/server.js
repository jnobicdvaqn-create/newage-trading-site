import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3210;

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['https://newagetrading.com', 'http://localhost:4321', 'http://localhost:3000'],
  methods: ['POST'],
}));

// --- Rate Limiting (in-memory) ---
const rateLimitMap = new Map(); // ip -> { count, firstRequestTime }
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX = 3;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || (now - entry.firstRequestTime) > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstRequestTime: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// Periodically clean up expired entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if ((now - entry.firstRequestTime) > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 60 * 1000);

// --- SMTP Transporter ---
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

// --- Data Storage ---
const DATA_FILE = join(__dirname, 'data', 'form-submissions.json');

async function loadSubmissions() {
  try {
    const raw = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveSubmission(entry) {
  const submissions = await loadSubmissions();
  submissions.push(entry);
  await mkdir(dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), 'utf-8');
}

// --- Routes ---
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, _gotcha } = req.body;

    // Honeypot check
    if (_gotcha) {
      // Silently accept but don't process (bot trap)
      return res.json({ success: true, message: 'Thank you for your message!' });
    }

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (name, email, message).',
      });
    }

    // Rate limit check
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again in a few minutes.',
      });
    }

    // Build submission record
    const submission = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      timestamp: new Date().toISOString(),
      ip: clientIp,
      name,
      email,
      phone: phone || '',
      message,
    };

    // Save to local JSON
    await saveSubmission(submission);
    console.log(`[${submission.timestamp}] New submission from ${name} <${email}>`);

    // Send email (non-blocking — don't fail the response if SMTP is not configured)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await transporter.sendMail({
          from: `"NewAge Trading Website" <${process.env.SMTP_USER}>`,
          to: 'felipeche01manager@YUNBSAOtrade.onmicrosoft.com',
          subject: `[Website Contact] New inquiry from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <table style="border-collapse:collapse;width:100%;max-width:600px;">
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Name</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(name)}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Phone</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(phone || 'N/A')}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Message</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(message)}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Time</td><td style="padding:8px;border:1px solid #ddd;">${submission.timestamp}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">IP</td><td style="padding:8px;border:1px solid #ddd;">${submission.ip}</td></tr>
            </table>
          `,
        });
        console.log(`  ✉ Email sent successfully`);
      } catch (emailErr) {
        console.error(`  ✉ Email failed:`, emailErr.message);
        // Don't fail the response — submission is saved locally
      }
    } else {
      console.log(`  ⚠ SMTP not configured, skipping email. Set SMTP_USER and SMTP_PASS env vars.`);
    }

    return res.json({ success: true, message: 'Thank you for your message! We will get back to you soon.' });
  } catch (err) {
    console.error('Error processing contact form:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// --- Helpers ---
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`✅ Contact form server running on http://localhost:${PORT}`);
  console.log(`   POST /api/contact`);
  console.log(`   GET  /api/health`);
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`   ⚠ SMTP credentials not set. Emails will be skipped.`);
    console.log(`   Set SMTP_USER and SMTP_PASS environment variables to enable email.`);
  }
});
