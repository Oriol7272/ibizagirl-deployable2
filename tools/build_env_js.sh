#!/usr/bin/env bash
set -euo pipefail
node - <<'NODE'
const fs=require('fs');
const allow=/^(PAYPAL_|CRISP_WEBSITE_ID$|JUICYADS_ZONE$|EXOCLICK_ZONE$|EROADVERTISING_ZONE$|POPADS_SITE_ID$|FORMSPREE_ID$|PROMO_|IBG_ASSETS_BASE_URL$)/;
const env={};
for(const k in process.env){ if(allow.test(k)) env[k]=process.env[k]; }
fs.writeFileSync('js/env.js','window.__ENV = '+JSON.stringify(env,null,2)+';');
console.log('env keys:',Object.keys(env));
NODE
