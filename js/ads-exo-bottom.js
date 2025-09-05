(function(){
  var E = window.__ENV || {};
  function log(){ if(E.DEBUG_ADS) try{ console.log.apply(console, arguments); }catch(_){ } }

  var host = document.getElementById('ad-bottom');
  if(!host){ return; }

  var zone = host.getAttribute('data-zone') || E.EXOCLICK_BOTTOM_ZONE || E.EXOCLICK_ZONE || '5717078';

  host.innerHTML = '';
  var ifr = document.createElement('iframe');
  ifr.setAttribute('sandbox','allow-scripts allow-popups');
  ifr.setAttribute('referrerpolicy','unsafe-url');
  ifr.style.cssText = 'border:0;width:100%;display:block;height:'+(window.innerWidth<=768?'60px;':'90px;');
  host.appendChild(ifr);

  var h = '<!doctype html><html><head><meta charset="utf-8">'
        + '<style>html,body{margin:0;padding:0}ins{display:block;min-height:'+(window.innerWidth<=768?'60px':'90px')+';width:100%}</style>'
        + '</head><body>'
        + '<ins class="eas6a97888e17" data-zoneid="'+ zone +'" data-block-ad-types="0"></ins>'
        + '<script>!function(){var ok=false;try{var mo=new MutationObserver(function(m){for(var i=0;i<m.length;i++){var a=m[i].addedNodes||[];for(var j=0;j<a.length;j++){var n=a[j];if(n&&((n.tagName&&(n.tagName.toLowerCase()==="iframe"||n.tagName.toLowerCase()==="img"))||(n.querySelector&&n.querySelector("iframe,img")))){ok=true;try{parent.postMessage({type:"IBG_EXO_OK"},"*");}catch(e){}try{mo.disconnect();}catch(e){}return;}}}});mo.observe(document.body,{childList:true,subtree:true});setTimeout(function(){if(!ok){try{parent.postMessage({type:"IBG_EXO_NOAD"},"*");}catch(e){}} ,3500);}catch(e){}}();<\/script>'
        + '<script src="https://a.magsrv.com/ad-provider.js" async></'+'script>'
        + '<script>(window.AdProvider=window.AdProvider||[]).push({serve:{}});<\/script>'
        + '</body></html>';

  if('srcdoc' in ifr){ ifr.srcdoc = h; }
  else {
    var d = ifr.contentWindow && ifr.contentWindow.document;
    if(d){ d.open(); d.write(h); d.close(); }
  }

  window.addEventListener('message', function(ev){
    var d = ev && ev.data;
    if(d && d.type==='IBG_EXO_OK'){ log('IBG_ADS: EXO bottom OK ->', zone); }
    if(d && d.type==='IBG_EXO_NOAD'){ log('IBG_ADS: EXO bottom NOAD ->', zone); }
  });

  log('IBG_ADS: EXO bottom mounted ->', zone);
})();
