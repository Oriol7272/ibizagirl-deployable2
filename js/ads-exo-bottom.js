(function(){
  try{
    var E = window.__ENV||{};
    var Z = E.EXOCLICK_BOTTOM_ZONE || E.EXOCLICK_ZONE;
    if(!Z){ return; }
    if(window.__IBG_EXO_BOTTOM_MOUNTED) return;
    window.__IBG_EXO_BOTTOM_MOUNTED = true;

    function ensureCss(){
      if(document.getElementById('ads-bottom-css')) return;
      var st=document.createElement('style'); st.id='ads-bottom-css';
      st.textContent='#ad-bottom{position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;justify-content:center;pointer-events:auto;background:rgba(0,0,0,.02);backdrop-filter:blur(2px)}#ad-bottom ins{display:block;min-height:90px;width:min(100%,980px)}@media(max-width:768px){#ad-bottom ins{min-height:60px}}body{padding-bottom:90px}@media(max-width:768px){body{padding-bottom:60px}}';
      document.head.appendChild(st);
    }
    function loadProvider(cb){
      if(window.AdProvider) return cb();
      var s=document.createElement('script');
      s.src='https://a.magsrv.com/ad-provider.js'; s.async=true; s.onload=function(){cb()};
      (document.head||document.documentElement).appendChild(s);
    }
    function passback(host){
      // House ad simple
      host.innerHTML = '<a href="/" target="_top" rel="nofollow" style="display:block;width:min(100%,980px);min-height:90px;background:linear-gradient(90deg,#111,#444);color:#fff;text-decoration:none;text-align:center;line-height:90px;font:600 16px system-ui">Patrocinado · ibizagirl.pics</a>';
    }
    function mount(){
      var host=document.getElementById('ad-bottom'); if(!host) return;
      ensureCss();
      host.innerHTML='';
      var ins=document.createElement('ins');
      ins.className='eas6a97888e17';
      ins.setAttribute('data-zoneid', String(Z));
      ins.setAttribute('data-block-ad-types','0');
      ins.style.display='block';
      ins.style.minHeight=(window.innerWidth<=768?'60px':'90px');
      ins.style.width='min(100%,980px)';
      host.appendChild(ins);
      (window.AdProvider = window.AdProvider || []).push({serve:{}});
      // fallback si no aparece iframe
      setTimeout(function(){
        if(!host.querySelector('iframe')){ passback(host); }
      }, 4500);
      // debug mark
      if(window.__IBG_markAd) window.__IBG_markAd('ad-bottom','exo-bottom', String(Z));
    }
    if(document.readyState==='loading'){
      document.addEventListener('DOMContentLoaded', function(){ loadProvider(mount); });
    } else { loadProvider(mount); }
  }catch(e){}
})();
