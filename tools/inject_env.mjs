import {writeFile} from 'fs/promises';
const env=(k)=>process.env[k]??'';
const data=`window.__ENV={
  PAYPAL_CLIENT_ID:"${env('PAYPAL_CLIENT_ID')}",
  PAYPAL_PLAN_MONTHLY:"${env('PAYPAL_PLAN_MONTHLY')}",
  PAYPAL_PLAN_YEARLY:"${env('PAYPAL_PLAN_YEARLY')}",
  CRISP_WEBSITE_ID:"${env('CRISP_WEBSITE_ID')}",
  JUICYADS_ZONE:"${env('JUICYADS_ZONE')}",
  EXOCLICK_ZONE:"${env('EXOCLICK_ZONE')}",
  EROADVERTISING_ZONE:"${env('EROADVERTISING_ZONE')}",
  ERO_PID:"${env('ERO_PID')||''}",
  ERO_CTRLID:"${env('ERO_CTRLID')||''}",
  POPADS_SITE_ID:"${env('POPADS_SITE_ID')}",
  ADS_ENABLED:"${env('ADS_ENABLED')||'true'}"
};\n`;
await writeFile('js/env.js', data);
console.log('ok env.js');
