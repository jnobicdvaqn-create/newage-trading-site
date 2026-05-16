const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = 3210;
const DIR = '/var/www/newage-trading.com/submissions';
const TO_EMAIL = 'felipeche01manager@126.com';
const RESEND_API_KEY = 're_7czRFpaD_Mw6jjWjHQ11t5dUsWWXUxCyp';

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
  return new Promise((resolve) => {
    try {
      const name = data.name || 'N/A';
      const email = data.email || 'N/A';
      const phone = data.phone || 'N/A';
      const message = data.message || 'N/A';
      const subject = data._subject || 'New Contact Form — NewAge Trading';

      const emailData = JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [TO_EMAIL],
        subject: subject,
        html: `<h2>New Contact Form Submission</h2>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Phone:</strong> ${phone}</p>
               <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
               <hr/>
               <p style="color:#888;">IP: ${data.ip || 'unknown'} | Time: ${data.timestamp || new Date().toISOString()}</p>`
      });

      const options = {
        hostname: 'api.resend.com',
        path: '/emails',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('[Resend] Email sent successfully:', body);
            resolve(true);
          } else {
            console.error('[Resend] Failed:', res.statusCode, body);
            resolve(false);
          }
        });
      });

      req.on('error', (e) => {
        console.error('[Resend] Request error:', e.message);
        resolve(false);
      });

      req.setTimeout(10000, () => { req.destroy(); resolve(false); });
      req.write(emailData);
      req.end();
    } catch (e) {
      console.error('[Resend] Error:', e.message);
      resolve(false);
    }
  });
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

    // Send email notification (async, non-blocking)
    sendEmailNotification({...data, ip, timestamp: record.timestamp})
      .then(sent => console.log(`[${ts}] Email notification ${sent ? 'sent' : 'failed'}`))
      .catch(e => console.error(`[${ts}] Email error:`, e.message));

    console.log(`[${ts}] New submission from ${ip} saved to ${file}`);
    res.writeHead(200);
    res.end(JSON.stringify({success: true}));
  });
});

server.listen(PORT, '127.0.0.1', () => console.log('Contact form server running on port ' + PORT));
