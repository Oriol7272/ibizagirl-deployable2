(function(){
  var E = (window.__ENV||{});
  var Z = E.EXOCLICK_ZONE;
  if(!Z){ return; }
  if(window.__IBG_EXO_SIDES_MOUNTED){ return; }
  window.__IBG_EXO_SIDES_MOUNTED = true;

  function loadProv(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://a.magsrv.com/ad-provider.js';
    s.async = true;
    s.onload = function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }

  function place(hostId){
    var host = document.getElementById(hostId);
    if(!host) return;
    host.innerHTML='';
    var ins = document.createElement('ins');
    ins.className = 'eas6a97888e17';
    ins.setAttribute('data-zoneid', String(Z));
    ins.setAttribute('data-block-ad-types', '0');
    ins.style.display='block';
    ins.style.minHeight='250px';
    ins.style.width='300px';
    host.appendChild(ins);
  }

  function mount(){
    place('ad-left');
    place('ad-right');
    (window.AdProvider = window.AdProvider || []).push({serve:{}});
    console.log('IBG_ADS: EXO/AP mounted ->', Z, 'on ad-left & ad-right');
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', function(){ loadProv(mount); });
  } else {
    loadProv(mount);
  }
})();
