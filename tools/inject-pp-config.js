const fs = require('fs');

const files = ['index.html','premium.html','videos.html','subscription.html'];
const tag = '<script src="js/pp-config.js?v=__TS__"></script>';

const ts = Date.now().toString().slice(0,10);
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let html = fs.readFileSync(f, 'utf8');
  if (html.includes('js/pp-config.js')) {
    console.log(`✓ ${f}: ya contiene pp-config.js`);
    continue;
    }
  html = html.replace(
    /(<script[^>]+src="[^"]*payments\.js[^"]*"[^>]*>\s*<\/script>)/i,
    `${tag.replace('__TS__', ts)}\n$1`
  );
  fs.writeFileSync(f, html);
  console.log(`+ ${f}: inyectado pp-config.js`);
}
