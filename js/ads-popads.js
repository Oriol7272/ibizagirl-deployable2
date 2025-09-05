(function(){
  var E=(window.__ENV||{});
  if(String(E.POPADS_ENABLE)!=='1'){ return; }
  var SID=E.POPADS_SITE_ID;
  if(!SID){ console.log('[ads-popads] no POPADS_SITE_ID en __ENV'); return; }

  if(window.__IBG_POPADS_MOUNTED){ return; }
  window.__IBG_POPADS_MOUNTED = true;

  // Inyecta el snippet oficial con el siteId del entorno
  var code = "(function(){var x=window,u='e494ffb82839a29122608e933394c091',a=[['siteId',"+SID+"],['minBid',0],['popundersPerIP','0'],['delayBetween',0],['default',false],['defaultPerDay',0],['topmostLayer','auto']],d=['d3d3LnByZW1pdW12ZXJ0aXNpbmcuY29tL2Vmb3JjZS5taW4uY3Nz','ZDJqMDQyY2oxNDIxd2kuY2xvdWRmcm9udC5uZXQvcllYUi9sYWZyYW1lLWFyLm1pbi5qcw==','d3d3LmRkc3Z3dnBycXYuY29tL2Zmb3JjZS5taW4uY3Nz','d3d3LmZqdGVkdHhxYWd1YmphLmNvbS9pcFUvYWFmcmFtZS1hci5taW4uanM='],h=-1,w,t,f=function(){clearTimeout(t);h++;if(d[h]&&!(1782994233000<(new Date).getTime()&&1<h)){w=x.document.createElement('script');w.type='text/javascript';w.async=!0;var n=x.document.getElementsByTagName('script')[0];w.src='https://'+atob(d[h]);w.crossOrigin='anonymous';w.onerror=f;w.onload=function(){clearTimeout(t);x[u.slice(0,16)+u.slice(0,16)]||f()};t=setTimeout(f,5E3);n.parentNode.insertBefore(w,n)}};if(!x[u]){try{Object.freeze(x[u]=a)}catch(e){}f()}})();";
  var s=document.createElement('script');
  s.type='text/javascript';
  s.async=true;
  s.text = code;
  (document.head||document.documentElement).appendChild(s);
  console.log('IBG_ADS: POP mounted ->', SID);
})();
