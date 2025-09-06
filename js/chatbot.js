(function(){
  const id = window.CrispConfig?.websiteId;
  if(!id) return;
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = id;
  (function(){ var d=document,s=d.createElement("script"); s.src="https://client.crisp.chat/l.js"; s.async=1; d.getElementsByTagName("head")[0].appendChild(s); })();
})();
