(function(){
  var E = window.__ENV || {};
  var Z = String(E.EXOCLICK_ZONE || '5696328'); // fallback estable
  function ensureProvider(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://a.magsrv.com/ad-provider.js';
    s.async = true;
    s.onload = function(){ cb&&cb(); };
    s.onerror = function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }
  function mount(id){
    var host = document.getElementById(id);
    if(!host){ return; }
    if(host.__exoMounted) return; host.__exoMounted = true;
    host.innerHTML = '';
    var ins = document.createElement('ins');
    ins.className = 'eas6a97888e17';
    ins.setAttribute('data-zoneid', Z);
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display = 'block';
    host.appendChild(ins);
    (window.AdProvider = window.AdProvider || []).push({serve:{}});
  }
  function start(){
    ensureProvider(function(){
      mount('ad-left');
      mount('ad-right');
      console.log('IBG_ADS: EXO/AP mounted (ins) ->', Z, 'on ad-left & ad-right');
    });
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', start); } else { start(); }
})();
