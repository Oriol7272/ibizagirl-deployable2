(function(){
  var E = (window.__ENV||{});
  var Z = E.EXOCLICK_BOTTOM_ZONE;          // pega a tu var en Vercel
  if(!Z){ console.log('[exo-bottom] missing EXOCLICK_BOTTOM_ZONE'); return; }
  if(window.__IBG_EXO_BOTTOM_MOUNTED){ return; }
  window.__IBG_EXO_BOTTOM_MOUNTED = true;

  function loadMag(cb){
    if(window.AdProvider){ cb&&cb(); return; }
    var s=document.createElement('script');
    s.src='https://a.magsrv.com/ad-provider.js';
    s.async=true;
    s.onload=function(){ cb&&cb(); };
    (document.head||document.documentElement).appendChild(s);
  }

  function ensure(){
    var host=document.getElementById('ad-bottom');
    if(!host){ host=document.createElement('div'); host.id='ad-bottom'; document.body.appendChild(host); }
    host.innerHTML='';
    var slot=document.createElement('div'); slot.className='ibg-slot';
    var ins=document.createElement('ins');
    ins.className='eas6a97888e17';
    ins.setAttribute('data-zoneid', String(Z));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display='block';
    ins.style.minHeight=(window.innerWidth<=768?'60px':'90px');
    slot.appendChild(ins);
    host.appendChild(slot);
    return host;
  }

  function serve(){ (window.AdProvider=window.AdProvider||[]).push({serve:{}}); }

  function updatePadding(){
    var h=document.getElementById('ad-bottom')?.offsetHeight||0;
    document.documentElement.style.setProperty('--ibg-bottom-h', h ? (h+'px') : '0px');
  }

  function mount(){
    var host=ensure();
    serve();
    // si no hay fill, ocultamos el contenedor para evitar barra gris
    setTimeout(function(){
      if(!host.querySelector('iframe')){ 
        console.log('[exo-bottom] no fill → hide');
        host.style.display='none';
      }
      updatePadding();
    }, 2500);

    // re-calcular padding al cambiar el DOM / resize
    new MutationObserver(updatePadding).observe(host,{childList:true,subtree:true});
    window.addEventListener('resize', updatePadding, {passive:true});
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', function(){ loadMag(mount); });
  }else{
    loadMag(mount);
  }
})();
