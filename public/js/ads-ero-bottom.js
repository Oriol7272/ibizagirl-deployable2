(function(){
  function ensureHost(){
    let h=document.getElementById("ad-ero-bottom");
    if(!h){
      h=document.createElement("div");
      h.id="ad-ero-bottom";
      h.style.cssText="width:300px;height:250px;margin:24px auto;display:none";
      document.body.appendChild(h);
    }
    return h;
  }
  function mount(){
    const E=window.__ENV||{};
    const space=(E.EROADVERTISING_SPACE||"").toString().trim();
    const pid  =(E.EROADVERTISING_PID  ||"").toString().trim();
    const ctrl =(E.EROADVERTISING_CTRL ||"").toString().trim();
    if(!(space&&pid&&ctrl)){ console.log("[ads-ero-bottom] faltan vars, skip"); return; }
    const host=ensureHost(); host.innerHTML="";
    const ifr=document.createElement("iframe");
    ifr.src="/ads/eroframe_ctrl.html?space="+encodeURIComponent(space)+"&pid="+encodeURIComponent(pid)+"&ctrl="+encodeURIComponent(ctrl);
    ifr.setAttribute("sandbox","allow-scripts allow-same-origin allow-popups");
    ifr.loading="lazy"; ifr.referrerPolicy="unsafe-url";
    ifr.style.cssText="border:0;display:block;margin:0 auto;width:300px;height:250px";
    ifr.onload=function(){ host.style.display="block"; };
    host.appendChild(ifr);
    console.log("[ads-ero-bottom] mounted →", ifr.src);
  }
  (document.readyState==="complete")?mount():addEventListener("load", mount, {once:true});
})();
