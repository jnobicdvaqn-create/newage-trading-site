const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 3889;
const DIR = '/var/www/newage-trading.com/submissions';
const TO_EMAIL = 'felipeche01manager@YUNBSAOtrade.onmicrosoft.com';

if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

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
  try {
    const name = (data.name || '').replace(/'/g, "\\'");
    const email = (data.email || '').replace(/'/g, "\\'");
    const phone = (data.phone || '').replace(/'/g, "\\'");
    const message = (data.message || '').replace(/'/g, "\\'").replace(/\n/g, '\\n');
    const subject = (data._subject || 'New Contact Form — NewAge Trading').replace(/'/g, "\\'");

    const phpCode = `<?php
$to = '${TO_EMAIL}';
$subject = '${subject}';
$message = "Name: ${name}\\nEmail: ${email}\\nPhone: ${phone}\\n\\nMessage:\\n${message}";
$headers = "From: noreply@newage-trading.com\\r\\n";
$headers .= "Reply-To: ${email}\\r\\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\\r\\n";
mail($to, $subject, $message, $headers);
?>`;
    const phpFile = '/tmp/contact_send_' + Date.now() + '.php';
    fs.writeFileSync(phpFile, phpCode);
    execSync('php ' + phpFile, { timeout: 10000 });
    fs.unlinkSync(phpFile);
    return true;
  } catch (e) {
    console.error('Email notification failed:', e.message);
    return false;
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.method !== 'POST') { res.writeHead(405); return res.end(JSON.stringify({error:'Method not allowed'})); }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (!checkRateLimit(ip)) { res.writeHead(429); return res.end(JSON.stringify({error:'Too many requests'})); }

  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    let data;
    try { data = JSON.parse(body); } catch(e) { data = {raw: body}; }

    // Save to file
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const file = path.join(DIR, `contact-${ts}.json`);
    const record = {ip, timestamp: new Date().toISOString(), ...data};
    fs.writeFileSync(file, JSON.stringify(record, null, 2));

    // Send email notification
    sendEmailNotification(data);

    console.log(`[${ts}] New submission from ${ip} saved to ${file}`);
    res.writeHead(200);
    res.end(JSON.stringify({success: true}));
  });
});

server.listen(PORT, '127.0.0.1', () => console.log('Contact form server running on port ' + PORT));
