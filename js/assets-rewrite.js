(function(){
  const BASE=(window.__ENV && window.__ENV.IBG_ASSETS_BASE_URL) || "";
  if(!BASE) return;

  function needsFix(v){
    return typeof v==="string" && (
      v.startsWith("/full/") ||
      v.startsWith("/uncensored/") ||
      v.startsWith("/uncensored-videos/") ||
      v.startsWith("full/") ||
      v.startsWith("uncensored/") ||
      v.startsWith("uncensored-videos/")
    );
  }
  function normalize(v){
    if(!v) return v;
    if(v[0]!=="/" && (v.startsWith("full/") || v.startsWith("uncensored"))) v="/"+v;
    return BASE.replace(/\/$/,"")+v;
  }
  function fixEl(el){
    ["src","srcset","poster"].forEach(attr=>{
      const v=el.getAttribute(attr);
      if(needsFix(v)) el.setAttribute(attr, normalize(v));
    });
  }
  function sweep(root){
    root.querySelectorAll("img,video,source").forEach(fixEl);
  }

  // 1ª pasada
  document.addEventListener("DOMContentLoaded", ()=>sweep(document));

  // Observar mutaciones (cards que se inyectan después)
  const obs=new MutationObserver(muts=>{
    muts.forEach(m=>{
      m.addedNodes.forEach(n=>{
        if(n.nodeType===1){ fixEl(n); sweep(n); }
      });
    });
  });
  obs.observe(document.documentElement,{childList:true,subtree:true});
})();
