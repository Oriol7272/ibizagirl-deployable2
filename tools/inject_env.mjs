import fs from 'node:fs'; import path from 'node:path';
const outDir = path.resolve('public/js'); fs.mkdirSync(outDir,{recursive:true});
const envFile = path.join(outDir,'env-ads-inline.js');
const EXOCLICK_ZONES       = process.env.EXOCLICK_ZONES       || '5696328,5705186';
const EXOCLICK_ZONE        = process.env.EXOCLICK_ZONE        || '5696328';
const EXOCLICK_BOTTOM_ZONE = process.env.EXOCLICK_BOTTOM_ZONE || '5717078';
const POPADS_SITE_ID       = process.env.POPADS_SITE_ID       || '5226758';
const POPADS_ENABLE        = (process.env.POPADS_ENABLE ?? '1') === '1' ? 1 : 0;
const js = `// generated at build time
window.__IBG_ADS = window.__IBG_ADS || {};
Object.assign(window.__IBG_ADS,{
  EXOCLICK_ZONES:${JSON.stringify(EXOCLICK_ZONES)},
  EXOCLICK_ZONE:${JSON.stringify(EXOCLICK_ZONE)},
  EXOCLICK_BOTTOM_ZONE:${JSON.stringify(EXOCLICK_BOTTOM_ZONE)},
  POPADS_SITE_ID:${JSON.stringify(POPADS_SITE_ID)},
  POPADS_ENABLE:${JSON.stringify(POPADS_ENABLE)}
});
console.log('IBG_ADS ZONES ->', window.__IBG_ADS);`;
try { if (!fs.existsSync(envFile)) fs.writeFileSync(envFile, js); } catch {}
console.log('[inject_env] ready');
