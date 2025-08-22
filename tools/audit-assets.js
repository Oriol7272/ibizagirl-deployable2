const fs = require('fs');

const BASE = process.env.IBG_ASSETS_BASE_URL || 'https://ibizagirl-assets.s3.eu-north-1.amazonaws.com';

function extractAll(regex, text){
  const out = new Set();
  let m;
  while((m = regex.exec(text)) !== null){
    out.add(m[0]);
  }
  return Array.from(out);
}

function readFileSafe(p){
  try { return fs.readFileSync(p, 'utf8'); }
  catch(e){ return ''; }
}

async function head(url){
  try{
    const res = await fetch(url, { method: 'HEAD' });
    return res.status;
  }catch(e){
    return 0;
  }
}

(async()=>{
  const c3 = readFileSafe('content-data3.js');
  const c4 = readFileSafe('content-data4.js');
  const c5 = readFileSafe('content-data5.js');

  const imgs = new Set([
    ...extractAll(/[A-Za-z0-9._-]+\.(?:webp|jpg|jpeg|png)/g, c3),
    ...extractAll(/[A-Za-z0-9._-]+\.(?:webp|jpg|jpeg|png)/g, c4),
  ]);
  const vids = new Set([
    ...extractAll(/[A-Za-z0-9._-]+\.(?:mp4|webm)/g, c5),
  ]);

  const missingImgs = [];
  const missingVids = [];

  let i=0;
  for(const f of imgs){
    i++;
    const url = `${BASE}/uncensored/${encodeURIComponent(f)}`;
    const code = await head(url);
    if(!(code===200 || code===206)) missingImgs.push(f);
    if(i%100===0) console.log(`· Checked images: ${i}/${imgs.size}`);
  }

  let j=0;
  for(const f of vids){
    j++;
    const url = `${BASE}/uncensored-videos/${encodeURIComponent(f)}`;
    const code = await head(url);
    if(!(code===200 || code===206)) missingVids.push(f);
    if(j%40===0) console.log(`· Checked videos: ${j}/${vids.size}`);
  }

  console.log('==== SUMMARY ====');
  console.log(`Images total: ${imgs.size} | missing: ${missingImgs.length}`);
  console.log(`Videos total: ${vids.size} | missing: ${missingVids.length}`);

  if(missingImgs.length){
    fs.writeFileSync('tools/missing-uncensored.txt', missingImgs.join('\n'));
    console.log('→ tools/missing-uncensored.txt (primeras 30):');
    console.log(missingImgs.slice(0,30).join('\n'));
  }
  if(missingVids.length){
    fs.writeFileSync('tools/missing-videos.txt', missingVids.join('\n'));
    console.log('→ tools/missing-videos.txt (primeros 30):');
    console.log(missingVids.slice(0,30).join('\n'));
  }
})();
