const fs = require('fs');
const https = require('https');

const listFromFile = (file) => {
  const txt = fs.readFileSync(file,'utf8');
  const m = txt.match(/[A-Za-z0-9._/+-]+\.(webp|jpg|jpeg|png)/g) || [];
  const norm = m.map(s => s.split('?')[0].split('/').pop());
  return [...new Set(norm)];
};

const names = listFromFile('content-data2.js');
const host = 'ibizagirl.pics';
const outMissing = 'tools/out/missing-full.txt';
fs.writeFileSync(outMissing,'');

let ok=0, bad=0, i=0;

function head(name){
  return new Promise(res=>{
    const req = https.request({method:'HEAD', host, path:`/full/${name}`}, r=>{
      res(r.statusCode===200 || r.statusCode===206);
    });
    req.on('error', ()=>res(false));
    req.end();
  });
}

(async()=>{
  for(const n of names){
    i++;
    const good = await head(n);
    if(good) ok++; else { bad++; fs.appendFileSync(outMissing, n+'\n'); }
    if(i%50===0) console.log(`· ${i}/${names.length} comprobadas…`);
  }
  console.log('==== FULL AUDIT ====');
  console.log('Declaradas:', names.length, '| OK:', ok, '| Faltan:', bad);
  if(bad) console.log('→ tools/out/missing-full.txt');
})();
