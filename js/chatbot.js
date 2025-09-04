(function(W){
  function initCrisp(){
    var id=(W.__ENV||{}).CRISP_WEBSITE_ID||""; 
    if(!id){ console.warn("CRISP_WEBSITE_ID vacío; no cargo Crisp"); return; }
    W.$crisp=[]; W.CRISP_WEBSITE_ID=id;
    var s=document.createElement("script"); s.src="https://client.crisp.chat/l.js"; s.async=1; document.head.appendChild(s);
  }
  W.IBG_CHAT={initCrisp};
})(window);
