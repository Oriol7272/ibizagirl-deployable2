// tools/inject-modal.js
import { readFileSync, writeFileSync } from "fs";

const buildTag = String(Date.now());
const files = ["index.html", "premium.html", "videos.html"];
const snippet = readFileSync("snippets/purchase-modal.html", "utf8").replace(/__BUILD__/g, buildTag);

for (const f of files) {
  let html = readFileSync(f, "utf8");

  if (!html.includes("id=\"purchase-modal\"")) {
    html = html.replace(/<\/body>/i, `\n${snippet}\n</body>`);
    console.log(`+ Modal insertado en ${f}`);
  } else {
    // actualizar cache bust de store.js si existe
    html = html.replace(/(\/js\/store\.js\?v=)[0-9]+/g, `$1${buildTag}`);
    console.log(`~ Modal ya existía en ${f}; actualizado v=${buildTag}`);
  }

  writeFileSync(f, html, "utf8");
}
console.log("OK");

