const fs = require('fs');
const path = require('path');

function parseCookies(req){
  const h = req.headers.cookie || '';
  const out = {};
  h.split(';').forEach(p=>{
    const [k,...v]=p.trim().split('=');
    if(!k) return;
    out[decodeURIComponent(k)] = decodeURIComponent(v.join('=')||'');
  });
  return out;
}
function allowedByCookie(cookies, reqPath) {
  if (cookies.ibg_sub && /^(monthly|annual|lifetime)$/.test(cookies.ibg_sub)) return true;
  const base = path.basename(reqPath);
  const list = (cookies.ibg_items || '').split(',').map(s=>s.trim()).filter(Boolean);
  return list.includes(base);
}
function mimeFor(p){
  const ext = p.split('.').pop().toLowerCase();
  if (['jpg','jpeg'].includes(ext)) return 'image/jpeg';
  if (ext==='webp') return 'image/webp';
  if (ext==='png') return 'image/png';
  if (['mp4','m4v'].includes(ext)) return 'video/mp4';
  if (['webm'].includes(ext)) return 'video/webm';
  return 'application/octet-stream';
}

module.exports = async (req, res) => {
  try {
    const reqPath = (req.query.path||'').toString();
    if (!/^\/(uncensored|uncensored-videos)\//.test(reqPath)) {
      res.status(400).json({error:'invalid path'}); return;
    }
    const cookies = parseCookies(req);
    if (!allowedByCookie(cookies, reqPath)) {
      res.status(302).setHeader('Location', '/premium.html');
      res.end(); return;
    }

    const base = (process.env.IBG_ASSETS_BASE_URL || '').replace(/\/+$/,'');
    if (base) {
      const target = base + reqPath;
      res.status(302).setHeader('Location', target);
      res.end(); return;
    }

    // Fallback local (dev)
    const abs = path.join(process.cwd(), '.' + reqPath);
    const buf = fs.readFileSync(abs);
    res.setHeader('Content-Type', mimeFor(abs));
    res.setHeader('Cache-Control','private, max-age=3600');
    res.status(200).end(buf);
  } catch(e){
    res.status(404).json({error:'not found'});
  }
};
