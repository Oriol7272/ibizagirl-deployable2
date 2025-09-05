(function(){
  try{
    var E = window.__ENV||{};
    var Z = E.EXOCLICK_ZONE;
    if(!Z) return;
    function ensureCss(){
      if(document.getElementById('ads-sides-css')) return;
      var st=document.createElement('style'); st.id='ads-sides-css';
      st.textContent='#ad-left,#ad-right{position:sticky;top:12px;display:block;width:300px;min-height:250px} @media(max-width:1200px){#ad-left,#ad-right{display:none}}';
      document.head.appendChild(st);
    }
    function loadProvider(cb){
      if(window.AdProvider) return cb();
      var s=document.createElement('script'); s.src='https://a.magsrv.com/ad-provider.js'; s.async=true; s.onload=function(){cb()};
      (document.head||document.documentElement).appendChild(s);
    }
    function mountOne(id){
      var host=document.getElementById(id); if(!host) return;
      host.innerHTML='';
      var ins=document.createElement('ins');
      ins.className='eas6a97888e17';
      ins.setAttribute('data-zoneid', String(Z));
      ins.setAttribute('data-block-ad-types','0');
      ins.style.display='block'; ins.style.minHeight='250px'; ins.style.width='300px';
      host.appendChild(ins);
      (window.AdProvider = window.AdProvider || []).push({serve:{}});
      setTimeout(function(){
        if(!host.querySelector('iframe')){
          host.innerHTML = '<a href="/" target="_top" rel="nofollow" style="display:block;width:300px;min-height:250px;background:#222;color:#fff;text-decoration:none;text-align:center;line-height:250px;font:600 14px system-ui">Patrocinado</a>';
        }
      }, 4500);
      if(window.__IBG_markAd) window.__IBG_markAd(id,'exo-side', String(Z));
    }
    function go(){ ensureCss(); mountOne('ad-left'); mountOne('ad-right'); }
    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', function(){ loadProvider(go); }); }
    else { loadProvider(go); }
  }catch(e){}
})();
