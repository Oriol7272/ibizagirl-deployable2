(function(){
  var E = (window.__ENV||{});
  var SID = E.POPADS_SITE_ID;
  var DIS = String(E.POPADS_DISABLED||'0')==='1';
  if(DIS || !SID){ console.log('[ads-popads] disabled or no site id'); return; }

  // Carga el snippet oficial (dominios rotatorios obfuscados suelen resolver a cdn.popads.net)
  try{
    var cfg = [["siteId", Number(SID)],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]];
    var key = "e494ffb82839a29122608e933394c091";
    var ZZ = window;
    if(!ZZ[key]){ Object.freeze(ZZ[key]=cfg); }
    var domains = [
      "ZDJuMDQyY2oxNDIxd2kuY2xvdWRmcm9udC5uZXQvcllYUi9sYWZyYW1lLWFyLm1pbi5qcw==",
      "d3d3LnByZW1pdW12ZXJ0aXNpbmcuY29tL2Vmb3JjZS5taW4uY3Nz",
      "d3d3LmZqdGVkdHhxYWd1YmphLmNvbS9pcFUvYWFmcmFtZS1hci5taW4uanM="
    ];
    var i=-1, timer; (function next(){
      clearTimeout(timer); i++;
      if(!domains[i]){ console.log('[ads-popads] no domains resolved'); return; }
      var s=document.createElement('script');
      s.src="https://"+atob(domains[i]);
      s.async=true;
      s.crossOrigin="anonymous";
      s.onerror=next;
      s.onload=function(){ clearTimeout(timer); };
      timer=setTimeout(next,5000);
      (document.head||document.documentElement).appendChild(s);
    })();
    console.log('IBG_ADS: POP mounted ->', SID);
  }catch(e){ console.log('[ads-popads] error', e); }
})();
