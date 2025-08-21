(function(){
  if (!window.CRISP_WEBSITE_ID) return;
  window.$crisp = [];
  window.CRISP_RUNTIME_CONFIG = { lock_maximized:true };
  (function(){
    const d=document,s=d.createElement("script");
    s.src="https://client.crisp.chat/l.js"; s.async=1;
    d.getElementsByTagName("head")[0].appendChild(s);
  })();
})();

