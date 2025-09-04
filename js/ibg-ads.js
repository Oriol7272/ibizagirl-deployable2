(function(){
  function inject(id, html){
    var el=document.getElementById(id); if(el && html){ el.innerHTML = html; }
  }
  document.addEventListener('DOMContentLoaded',function(){
    try{
      var exo = window.EXOCLICK_SNIPPET_B64 ? atob(window.EXOCLICK_SNIPPET_B64) : "";
      var juicy = window.JUICYADS_SNIPPET_B64 ? atob(window.JUICYADS_SNIPPET_B64) : "";
      var ero = window.EROADVERTISING_SNIPPET_B64 ? atob(window.EROADVERTISING_SNIPPET_B64) : "";
      var left = [exo,juicy,ero].filter(Boolean).join('');
      var right = [juicy,exo,ero].filter(Boolean).join('');
      inject('ad-left', left);
      inject('ad-right', right);
      if(String(window.POPADS_ENABLE||'').toLowerCase()==='true' && window.POPADS_SITE_ID){
        var s=document.createElement('script');
        s.src='//cdn.popads.net/pop.js'; s.setAttribute('data-site', String(window.POPADS_SITE_ID)); s.async=true; document.body.appendChild(s);
      }
    }catch(e){ console.warn('Ads inject error', e); }
  });
})();
