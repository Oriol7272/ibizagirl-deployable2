#!/usr/bin/env bash
set -euo pipefail
node - <<'NODE'
const fs=require('fs');
const keys=[
  "PAYPAL_CLIENT_ID",
  "PRICE_IMAGE_EUR",
  "SUB_MONTHLY_EUR",
  "SUB_YEARLY_EUR",
  "SUB_LIFETIME_EUR",
  "AD_LEFT_CODE",
  "AD_RIGHT_CODE"
];
const env={};
keys.forEach(k=>env[k]=process.key[k]||"");
const b64 = Buffer.from(JSON.stringify(env)).toString('base64');
fs.mkdirSync('js',{recursive:true});
fs.writeFileSync('js/env-inline.js', `window.__ENV__=JSON.parse(atob("${b64}"));`);
NODE
