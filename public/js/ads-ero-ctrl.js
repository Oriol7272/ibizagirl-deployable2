(function(){
  function mount(){
    var E=window.__ENV||{};
    var space=String(E.EROADVERTISING_SPACE||"").trim(),
        pid  =String(E.EROADVERTISING_PID  ||"").trim(),
        ctrl =String(E.EROADVERTISING_CTRL ||"").trim();
    var host=document.getElementById("ad-ero");
    if(!host){ console.log("[ads-ero-ctrl] no #ad-ero, skip"); return; }
    if(!(space&&pid&&ctrl)){ console.log("[ads-ero-ctrl] faltan ERO vars, skip"); return; }
    host.innerHTML="";
    var ifr=document.createElement("iframe");
    ifr.src="/ads/eroframe_ctrl.html?space="+encodeURIComponent(space)+"&pid="+encodeURIComponent(pid)+"&ctrl="+encodeURIComponent(ctrl);
    ifr.loading="lazy";
    ifr.referrerPolicy="unsafe-url";
    ifr.setAttribute("sandbox","allow-scripts allow-same-origin allow-popups");
    ifr.style.cssText="border:0;display:block;margin:0 auto;width:300px;height:250px";
    host.appendChild(ifr);
    console.log("[ads-ero-ctrl] mounted ->", ifr.src);
  }
  if(document.readyState==="complete") mount(); else addEventListener("load", mount, {once:true});
})();
