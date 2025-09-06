(function(){
  var E = window.__ENV || {};
  var list = ((E.EXOCLICK_ZONES || E.EXOCLICK_ZONE || '').toString())
              .split(/\s*,\s*/).filter(Boolean);
  if(!list.length){ console.log('[ads-exo-sides] sin EXOCLICK_ZONES/ZONE'); return; }

  function load(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s=document.createElement('script');
    s.src='https://a.magsrv.com/ad-provider.js';
    s.async=true; s.onload=function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }
  function pick(){ return list[(Math.random()*list.length)|0]; }

  function mount(id){
    var host=document.getElementById(id);
    if(!host || host.__mounted) return;
    host.__mounted=true;
    host.innerHTML='';
    var zone=pick();
    var ins=document.createElement('ins');
    ins.className='eas6a97888e17';
    ins.setAttribute('data-zoneid', String(zone));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display='block';
    ins.style.width='300px';
    ins.style.height='250px';
    host.appendChild(ins);
    (window.AdProvider=window.AdProvider||[]).push({serve:{}});
    console.log('IBG_ADS: EXO/AP mounted (pure) ->', zone, 'on', id);
  }
  function start(){ load(function(){ mount('ad-left'); mount('ad-right'); }); }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', start); } else { start(); }
})();
