(function(){
  var E = (window.__ENV||{});
  var Z = E.EXOCLICK_ZONE || (E.EXOCLICK_ZONES && String(E.EXOCLICK_ZONES).split(',')[0].trim());
  if(!Z){ console.log('[ads-exo-sides] no EXO zone id'); return; }

  var left  = document.getElementById('ad-left');
  var right = document.getElementById('ad-right');
  if(!left || !right){ return; }

  function ensureProvider(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s=document.createElement('script');
    s.src='https://a.magsrv.com/ad-provider.js';
    s.async=true; s.onload=function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }
  function mount(slot){
    slot.innerHTML='';
    var ins=document.createElement('ins');
    ins.className='eas6a97888e17';
    ins.setAttribute('data-zoneid', String(Z));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display='block';
    slot.appendChild(ins);
    (window.AdProvider = window.AdProvider || []).push({serve:{}});
  }
  ensureProvider(function(){
    mount(left); mount(right);
    console.log('IBG_ADS: EXO/AP mounted ->', Z, 'on ad-left & ad-right');
  });
})();
