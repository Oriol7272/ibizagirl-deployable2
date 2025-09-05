(function(){
  try{
    var E = window.__ENV||{};
    var Z = E.EXOCLICK_BOTTOM_ZONE || E.EXOCLICK_ZONE;
    if(!Z){ if(window.__IBG_DEBUG_ADS) console.warn('[ads-exo-bottom] sin zone id'); return; }
    if(window.__IBG_EXO_BOTTOM_MOUNTED) return;
    window.__IBG_EXO_BOTTOM_MOUNTED = true;

    // Asegura CSS por si falta
    if(!document.getElementById('ads-bottom-css')){
      var st=document.createElement('style'); st.id='ads-bottom-css';
      st.textContent='#ad-bottom{position:fixed;left:0;right:0;bottom:0;z-index:99999;display:flex;justify-content:center;pointer-events:auto;background:rgba(0,0,0,.02);backdrop-filter:blur(2px)}#ad-bottom ins{display:block;min-height:90px;width:min(100%,980px)}@media(max-width:768px){#ad-bottom ins{min-height:60px}}';
      document.head.appendChild(st);
      document.body.style.paddingBottom='90px';
    }

    function load(cb){
      if(window.AdProvider) return cb();
      var s=document.createElement('script');
      s.src='https://a.magsrv.com/ad-provider.js';
      s.async=true;
      s.onload=function(){ cb(); };
      (document.head||document.documentElement).appendChild(s);
    }

    function mount(){
      var host=document.getElementById('ad-bottom');
      if(!host){ if(window.__IBG_DEBUG_ADS) console.warn('[ads-exo-bottom] no #ad-bottom'); return; }
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
      if(window.__IBG_DEBUG_ADS) console.log('IBG_ADS: EXO bottom mounted ->', Z);

      // Reintento único si no aparece iframe
      setTimeout(function(){
        if(!host.querySelector('iframe')){
          if(window.__IBG_DEBUG_ADS) console.log('[ads-exo-bottom] reintento (no iframe tras 4s)');
          (window.AdProvider = window.AdProvider || []).push({serve:{}});
        }
      }, 4000);
    }

    if(document.readyState==='loading'){
      document.addEventListener('DOMContentLoaded', function(){ load(mount); });
    } else {
      load(mount);
    }
  }catch(e){
    console && console.warn && console.warn('[ads-exo-bottom] error:', e);
  }
})();
