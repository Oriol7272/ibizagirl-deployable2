export function initCrisp(){
  const id = window.IBG?.CRISP_WEBSITE_ID; if(!id) return;
  window.$crisp=[]; window.CRISP_WEBSITE_ID=id;
  const s=document.createElement('script'); s.src='https://client.crisp.chat/l.js'; s.async=1; document.head.appendChild(s);
}
