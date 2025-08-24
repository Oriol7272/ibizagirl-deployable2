#!/usr/bin/env bash
set -euo pipefail

# 1) Genera /ibg-env.js (window.IBG = {...};) y deja de usar env.js
mkdir -p tools
cat > tools/gen-ibg-env.mjs <<'EON'
import { writeFileSync } from 'fs';
const v = process.env;
const IBG = {
  PAYPAL_CLIENT_ID: v.PAYPAL_CLIENT_ID || '',
  PAYPAL_SECRET: v.PAYPAL_SECRET || '',
  PAYPAL_PLAN_MONTHLY_1499: v.PAYPAL_PLAN_MONTHLY_1499 || '',
  PAYPAL_PLAN_ANNUAL_4999: v.PAYPAL_PLAN_ANNUAL_4999 || '',
  PAYPAL_WEBHOOK_ID: v.PAYPAL_WEBHOOK_ID || '',
  CRISP_WEBSITE_ID: v.CRISP_WEBSITE_ID || '',
  EXOCLICK_ZONE: v.EXOCLICK_ZONE || '',
  JUICYADS_ZONE: v.JUICYADS_ZONE || '',
  EROADVERTISING_ZONE: v.EROADVERTISING_ZONE || '',
  EXOCLICK_SNIPPET_B64: v.EXOCLICK_SNIPPET_B64 || '',
  JUICYADS_SNIPPET_B64: v.JUICYADS_SNIPPET_B64 || '',
  EROADVERTISING_SNIPPET_B64: v.EROADVERTISING_SNIPPET_B64 || '',
  POPADS_SITE_ID: v.POPADS_SITE_ID || '',
  POPADS_ENABLE: v.POPADS_ENABLE || '',
  IBG_ASSETS_BASE_URL: v.IBG_ASSETS_BASE_URL || '',
  CURRENCY: 'EUR'
};
writeFileSync('ibg-env.js', 'window.IBG = ' + JSON.stringify(IBG, null, 2) + ';');
EON
node tools/gen-ibg-env.mjs || true
[ -f env.js ] && mv -f env.js env.js.bak || true

# 2) Asegura que TODAS las páginas usan /ibg-env.js
for f in index.html premium.html videos.html subscription.html; do
  [ -f "$f" ] && sed -i "" -e 's#/env\.js#/ibg-env.js#g' "$f" || true
done

# 3) Arregla ad-loader: JuicyAds orden correcto y PopAds solo con ID numérico
mkdir -p js
cat > js/ad-loader.js <<'EON'
import { b64Decode, isSubscribed } from './utils.js';
function isInt(v){return /^\d+$/.test(String(v||'').trim());}
export function initAds(targets={}){
  if(isSubscribed()){ console.info('Ads disabled for subscriber/lifetime'); return; }
  const E = window.IBG || {};
  const mount = el => el || document.body;

  // ExoClick
  try{
    if(E.EXOCLICK_SNIPPET_B64){
      mount(targets.left).insertAdjacentHTML('beforeend', b64Decode(E.EXOCLICK_SNIPPET_B64));
    } else if (isInt(E.EXOCLICK_ZONE)){
      const s=document.createElement('script'); s.async=true; s.src='https://a.magsrv.com/ad-provider.js'; document.head.appendChild(s);
      const ins=document.createElement('ins'); ins.className='eas6a97888e2'; ins.setAttribute('data-zoneid',String(E.EXOCLICK_ZONE)); mount(targets.left).appendChild(ins);
      setTimeout(()=>{ (window.AdProvider=window.AdProvider||[]).push({serve:{}}); },800);
    }
  }catch(e){ console.warn('ExoClick error:', e); }

  // JuicyAds
  try{
    if(E.JUICYADS_SNIPPET_B64){
      mount(targets.right).insertAdjacentHTML('beforeend', b64Decode(E.JUICYADS_SNIPPET_B64));
    } else if (isInt(E.JUICYADS_ZONE)){
      window.adsbyjuicy = window.adsbyjuicy || [];
      const ins=document.createElement('ins'); ins.id=String(E.JUICYADS_ZONE); ins.setAttribute('data-width','160'); ins.setAttribute('data-height','600');
      mount(targets.right).appendChild(ins);
      const s=document.createElement('script'); s.async=true; s.src='https://poweredby.jads.co/js/jads.js';
      s.onload=()=>{ try{ (window.adsbyjuicy=window.adsbyjuicy||[]).push({adzone:Number(E.JUICYADS_ZONE)}); }catch(e){ console.warn('Juicy push error:', e); } };
      document.head.appendChild(s);
    }
  }catch(e){ console.warn('JuicyAds error:', e); }

  // EroAdvertising
  try{
    if(E.EROADVERTISING_SNIPPET_B64){
      mount(targets.right).insertAdjacentHTML('beforeend', b64Decode(E.EROADVERTISING_SNIPPET_B64));
    } else if (isInt(E.EROADVERTISING_ZONE)){
      const d=document.createElement('div'); d.id='sp_'+String(E.EROADVERTISING_ZONE)+'_node'; d.innerHTML='&nbsp;'; mount(targets.right).appendChild(d);
      const js=document.createElement('script'); js.src='//go.easrv.cl/loadeactrl.go?pid=152716&spaceid='+String(E.EROADVERTISING_ZONE)+'&ctrlid=798544'; document.head.appendChild(js);
      setTimeout(()=>{ try{ window.eaCtrl && eaCtrl.add({display:d.id,sid:Number(E.EROADVERTISING_ZONE),plugin:'banner'}); }catch(_){} },1000);
    }
  }catch(e){ console.warn('EroAdvertising error:', e); }

  // PopAds (solo si ID numérico y habilitado)
  try{
    if(isInt(E.POPADS_SITE_ID) && String(E.POPADS_ENABLE) !== '0'){
      const code='(function(){var p=window,j="e494ffb82839a29122608e933394c091",d=[["siteId",'+Number(E.POPADS_SITE_ID)+'],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],v=[],e=-1,a,y,m=function(){clearTimeout(y);e++;a=p.document.createElement("script");a.type="text/javascript";a.async=!0;var s=p.document.getElementsByTagName("script")[0];a.src="https://www.premiumvertising.com/zS/bwdvf/ttabletop.min.js";a.crossOrigin="anonymous";a.onerror=m;a.onload=function(){clearTimeout(y);p[j.slice(0,16)+j.slice(0,16)]||m()};y=setTimeout(m,5E3);s.parentNode.insertBefore(a,s)};if(!p[j]){try{Object.freeze(p[j]=d)}catch(e){}m()})();';
      const s=document.createElement('script'); s.text=code; mount(targets.right).appendChild(s);
    }
  }catch(e){ console.warn('PopAds error:', e); }
}
EON

# 4) i18n ya creado en pasos anteriores; aseguro import local
[ -f js/pages-common.js ] && sed -i "" -e 's#\.\./i18n\.js#\./i18n.js#g' js/pages-common.js || true

# 5) vercel.json aceptado por Vercel + build ibg-env.js
cat > vercel.json <<'EON'
{
  "framework": "vite",
  "buildCommand": "node tools/gen-ibg-env.mjs",
  "outputDirectory": "."
}
EON

# 6) commit + push + deploy
git add -A
git commit -m "IBG: ads loader robust (JuicyAds order, PopAds guard) + ibg-env.js + vercel framework=vite" || true
git push origin main || true

npx -y vercel --prod --yes
