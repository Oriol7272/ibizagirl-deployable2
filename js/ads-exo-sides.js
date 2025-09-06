(function(){
  var E = window.__ENV || {};
  var Z = String(E.EXOCLICK_ZONE || '5696328'); // zone principal

  function ensureProvider(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://a.magsrv.com/ad-provider.js';
    s.async = true;
    s.onload = function(){ cb&&cb(); };
    s.onerror = function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }

  function serveInto(host){
    // limpia el contenedor
    host.innerHTML = '';
    host.style.background = 'transparent';

    // crea la etiqueta del proveedor
    var ins = document.createElement('ins');
    ins.className = 'eas6a97888e17';
    ins.setAttribute('data-zoneid', Z);
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display = 'block';
    host.appendChild(ins);

    // hasta 2 reintentos si no aparece un iframe
    var tries = 0, maxTries = 2;

    function tryServe(){
      (window.AdProvider = window.AdProvider || []).push({serve:{}});
      tries++;
      setTimeout(function(){
        if (ins.querySelector('iframe')) return;              // ya hay anuncio
        if (tries <= maxTries) { tryServe(); return; }         // reintenta
        // fallback de casa
        host.innerHTML = '';
        var a = document.createElement('a');
        a.href = '/premium';
        a.className = 'house-ad';
        a.innerHTML = '<strong>Premium</strong><span>Sin anuncios · Acceso completo</span>';
        host.appendChild(a);
        console.log('[ads-exo-sides] fallback house ad en', host.id);
      }, 2500);
    }

    tryServe();
  }

  function mount(id){
    var host = document.getElementById(id);
    if(!host || host.__exoMounted) return;
    host.__exoMounted = true;
    ensureProvider(function(){ serveInto(host); });
  }

  function start(){
    mount('ad-left');
    mount('ad-right');
    console.log('IBG_ADS: EXO/AP mounted (iframes/fallback) ->', Z, 'on ad-left & ad-right');
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', start); } else { start(); }
})();
