export function initCrisp(){
  const id = window.IBG?.CRISP_WEBSITE_ID;
  if(!id) return;
  window.$crisp=[]; window.CRISP_WEBSITE_ID=id;
  const s=document.createElement('script'); s.src='https://client.crisp.chat/l.js'; s.async=1; document.head.appendChild(s);
}
let paypalLoaded=false;
export async function loadPayPal(){
  if(paypalLoaded) return;
  const cid = window.IBG?.PAYPAL_CLIENT_ID;
  if(!cid){console.error('PAYPAL_CLIENT_ID vacío; no cargo SDK'); return;}
  await new Promise((res,rej)=>{const s=document.createElement('script'); s.src=`https://www.paypal.com/sdk/js?client-id=${cid}&components=buttons,hosted-fields&currency=EUR&intent=authorize`; s.onerror=rej; s.onload=res; document.head.appendChild(s);});
  paypalLoaded=true;
}
