(function(){
  document.addEventListener('DOMContentLoaded',function(){
    if(!window.CRISP_WEBSITE_ID) return;
    window.$crisp=[]; window.CRISP_WEBSITE_ID=String(window.CRISP_WEBSITE_ID);
    var d=document.createElement("script"); d.src="https://client.crisp.chat/l.js"; d.async=1; document.getElementsByTagName("head")[0].appendChild(d);
  });
})();
