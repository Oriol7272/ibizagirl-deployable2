const fs = require('fs');

const allowCSP = [
  "default-src 'self'",
  "script-src 'self' https: 'unsafe-inline' 'unsafe-eval'",
  "connect-src 'self' https: wss:",
  "img-src 'self' https: data: blob:",
  "media-src 'self' https: data: blob:",
  "style-src 'self' https: 'unsafe-inline'",
  "font-src 'self' https: data:",
  "frame-src https:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https:"
].join('; ');

let cfg = {};
if (fs.existsSync('vercel.json')) {
  try { cfg = JSON.parse(fs.readFileSync('vercel.json','utf8')); } catch(e) { cfg = {}; }
}
if (!Array.isArray(cfg.headers)) cfg.headers = [];

const idx = cfg.headers.findIndex(h => h && h.source === "/(.*)");
const headerObj = {
  source: "/(.*)",
  headers: [
    { key: "Content-Security-Policy", value: allowCSP }
  ]
};

if (idx >= 0) {
  // Reemplaza o fusiona
  const existing = cfg.headers[idx];
  const others = (existing.headers || []).filter(x => x.key.toLowerCase() !== "content-security-policy");
  headerObj.headers.push(...others);
  cfg.headers[idx] = headerObj;
} else {
  cfg.headers.push(headerObj);
}

fs.writeFileSync('vercel.json', JSON.stringify(cfg, null, 2));
console.log('✅ vercel.json actualizado (CSP ampliada)');
