(function(){
  var E = (window.__ENV||{});
  var enabled = String(E.POPADS_ENABLE||'0') === '1';
  var site = parseInt(E.POPADS_SITE_ID,10);
  if(!enabled || !site){ console.log('[ads-popads] disabled or no site id'); return; }

  // Snippet “oficial” adaptado a env + reintentos
  var x=window,u="e494ffb82839a29122608e933394c091",
      a=[["siteId",site],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],
      // cdn/hosts en base64 (mismo patrón que el snippet original)
      d=[
        "d3d3LnByZW1pdW12ZXJ0aXNpbmcuY29tL2Vmb3JjZS5taW4uY3Nz",
        "ZDJqMDQyY2oxNDIxd2kuY2xvdWRmcm9udC5uZXQvcllYUi9sYWZyYW1lLWFyLm1pbi5qcw==",
        "d3d3LmRkc3Z3dnBycXYuY29tL2Zmb3JjZS5taW4uY3Nz",
        "d3d3LmZqdGVkdHhxYWd1YmphLmNvbS9pcFUvYWFmcmFtZS1hci5taW4uanM="
      ],
      h=-1,w,t,f=function(){clearTimeout(t);h++;
        if(d[h]&&!(1782994233000<(new Date).getTime()&&1<h)){
          w=x.document.createElement("script"); w.type="text/javascript"; w.async=!0;
          var n=x.document.getElementsByTagName("script")[0];
          w.src="https://"+atob(d[h]); w.crossOrigin="anonymous";
          w.onerror=f; w.onload=function(){clearTimeout(t); x[u.slice(0,16)+u.slice(0,16)]||f();};
          t=setTimeout(f,5e3); n.parentNode.insertBefore(w,n);
        }
      };
  if(!x[u]){ try{Object.freeze(x[u]=a)}catch(e){} f(); }
  console.log('IBG_ADS: POP mounted ->', site);
})();
