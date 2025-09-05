(function(){
  if(window.__IBG_EXO_BOTTOM_MOUNTED){return;}
  window.__IBG_EXO_BOTTOM_MOUNTED=true;

  function pickZone(){
    var host=document.getElementById('ad-bottom');
    var fromData=host && host.getAttribute('data-zone');
    var fromBottom=window.__ENV && window.__ENV.EXOCLICK_BOTTOM_ZONE;
    var fromExo=window.__ENV && window.__ENV.EXOCLICK_ZONE;
    return fromData || fromBottom || fromExo || null;
  }

  function load(cb){
    if(window.AdProvider){cb&&cb();return;}
    var s=document.createElement('script');
    s.src='https://a.magsrv.com/ad-provider.js';
    s.async=true;
    s.onload=function(){cb&&cb();};
    (document.head||document.documentElement).appendChild(s);
  }

  function mount(zone){
    var host=document.getElementById('ad-bottom'); if(!host) return;
    host.innerHTML='';
    var ins=document.createElement('ins');
    ins.className='eas6a97888e17';
    ins.setAttribute('data-zoneid', String(zone));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display='block';
    ins.style.minHeight=(window.innerWidth<=768?'60px':'90px');
    host.appendChild(ins);
    (window.AdProvider=window.AdProvider||[]).push({serve:{}});
    console.log('IBG_ADS: EXO bottom mounted ->', zone);
    setTimeout(function(){
      if(!host.querySelector('iframe')){
        console.log('[ads-exo-bottom] reintento (no iframe tras 4s)');
        (window.AdProvider=window.AdProvider||[]).push({serve:{}});
      }
    },4000);
  }

  var t=Date.now();
  (function wait(){
    var z=pickZone();
    if(!z && Date.now()-t<2000){ return setTimeout(wait,100); }
    if(!z){ console.log('[ads-exo-bottom] sin zone -> abort'); return; }
    console.log('[ads-exo-bottom] zone chosen ->', z);
    load(function(){ mount(z); });
  })();
})();
