import fs from 'fs/promises';

const MAP = {
  'full': ['content-data2.js'],
  'uncensored': ['content-data3.js', 'content-data4.js'],
  'uncensored-videos': ['content-data5.js'],
};

function uniq(arr){ return [...new Set(arr)]; }
function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]} return a; }

export default async function handler(req, res) {
  try{
    let { prefix = '', limit = '20', shuffle: doShuffle = '0' } = req.query || {};
    prefix = String(prefix).replace(/^\/+|\/+$/g,''); // quitar / al inicio/fin
    if (!(prefix in MAP)) return res.status(400).json({ error: 'invalid_prefix' });

    const isVideo = prefix === 'uncensored-videos';
    const re = isVideo ? /[A-Za-z0-9._-]+\.(?:mp4|webm)/g
                       : /[A-Za-z0-9._-]+\.(?:webp|jpe?g|png)/g;

    const sources = MAP[prefix];
    let files = [];
    for (const f of sources){
      const txt = await fs.readFile(f, 'utf8');
      const m = txt.match(re) || [];
      files.push(...m);
    }
    files = uniq(files);
    const n = Math.max(1, Math.min(200, parseInt(limit, 10) || 20));
    if (doShuffle === '1' || doShuffle === 'true') shuffle(files);

    res.setHeader('Cache-Control', 'public, max-age=60');
    return res.json({ prefix, files: files.slice(0, n) });
  }catch(e){
    res.status(500).json({ error: 'server_error', message: e.message });
  }
}
