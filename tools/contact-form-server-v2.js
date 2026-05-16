const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = process.env.PORT || 3889;
const DIR = '/var/www/newage-trading.com/submissions';

// Ensure submissions directory exists
if (!fs.existsSync(DIR)) {
  try { fs.mkdirSync(DIR, { recursive: true }); } catch(e) { /* ignore */ }
}

const rateLimit = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const limit = rateLimit.get(ip);
  if (!limit) { rateLimit.set(ip, [now]); return true; }
  const recent = limit.filter(t => now - t < 60000);
  if (recent.length >= 5) return false;
  recent.push(now);
  rateLimit.set(ip, recent);
  return true;
}

function sendEmailNotification(data) {
  // Run in separate process - never affect client response
  // Send to both enterprise (primary) and 126 (backup)
  const TO_EMAIL = process.env.NOTIFY_EMAIL || 'felipeche01manager@YUNBSAOtrade.onmicrosoft.com';
  const CC_EMAIL = 'felipeche01manager@126.com';
  const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_7czRFpaD_Mw6jjWjHQ11t5dUsWWXUxCyp';

  const name = data.name || 'N/A';
  const email = data.email || 'N/A';
  const phone = data.phone || 'N/A';
  const message = (data.message || 'N/A').replace(/\n/g, '<br/>');
  const subject = data._subject || 'New Contact Form — NewAge Trading';

  const emailData = JSON.stringify({
    from: 'onboarding@resend.dev',
    to: [TO_EMAIL, CC_EMAIL],
    subject: subject,
    html: `<h2>New Contact Form Submission</h2>
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Phone:</strong> ${phone}</p>
           <p><strong>Message:</strong><br/>${message}</p>
           <hr/>
           <p style="color:#888;">IP: ${data.ip || 'unknown'} | Time: ${data.timestamp || new Date().toISOString()}</p>`
  });

  const options = {
    hostname: 'api.resend.com',
    path: '/emails',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Length': Buffer.byteLength(emailData)
    }
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('[Resend] Email sent OK');
      } else {
        console.error('[Resend] Failed:', res.statusCode, body);
      }
    });
  });

  req.on('error', (e) => {
    console.error('[Resend] Error:', e.message);
  });

  // 15s timeout for email only - does NOT affect client response
  req.setTimeout(15000, () => {
    req.destroy();
    console.error('[Resend] Timeout');
  });

  req.write(emailData);
  req.end();
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    res.writeHead(405);
    return res.end(JSON.stringify({error: 'Method not allowed'}));
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (!checkRateLimit(ip)) {
    res.writeHead(429);
    return res.end(JSON.stringify({error: 'Too many requests'}));
  }

  // Collect body
  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    let data;
    try { data = JSON.parse(body); } catch(e) { data = {raw: body}; }

    // 1. Save to file (synchronous - fast)
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const file = path.join(DIR, `contact-${ts}.json`);
    const record = {ip, timestamp: new Date().toISOString(), ...data};

    try {
      fs.writeFileSync(file, JSON.stringify(record, null, 2));
    } catch(e) {
      console.error('[FS] Write error:', e.message);
      // Still return success to client - email/fs errors should not affect UX
    }

    // 2. Send email notification (async, completely detached from client response)
    try {
      sendEmailNotification({...data, ip, timestamp: record.timestamp});
    } catch(e) {
      console.error('[Email] Error:', e.message);
    }

    // 3. Respond immediately - do NOT wait for email
    console.log(`[${ts}] Submission saved from ${ip}`);
    res.writeHead(200);
    res.end(JSON.stringify({success: true}));
  });

  // Handle request errors (client disconnect, etc.)
  req.on('error', (e) => {
    console.error('[Req] Error:', e.message);
  });
});

// Listen
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Contact form server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down...');
  server.close(() => process.exit(0));
});
