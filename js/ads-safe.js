(function(){
  const ADS = window.IBG_ADS = window.IBG_ADS || {};
  function load(u){ return new Promise(res=>{ try{
    const s=document.createElement('script'); s.src=u; s.async=true; s.crossOrigin='anonymous';
    s.onload=()=>res(true); s.onerror=()=>res(false);
    document.head.appendChild(s);
  }catch(_){res(false);} }); }

  ADS.loadAll = async function(){
    // Prevenir errores de libs que esperan globals
    window.adsbyjuicy = window.adsbyjuicy || [];
    // ExoClick
    await load('https://a.magsrv.com/ad-provider.js');
    // JuicyAds
    await load('https://adserver.juicyads.com/js/jads.js');
    // EroAdvertising (premiumvertising)
    await load('https://www.premiumvertising.com/zS/bwdvf/ttabletop.min.js');
    // PopAds (tu snippet resiliente)
    try{
      (function(){var k=window,g="e494ffb82839a29122608e933394c091",b=[["siteId",603*110+885*526-923+4695841],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],t=["d3d3LnByZW1pdW12ZXJ0aXNpbmcuY29tL0xta2ZoUi90Vy9wdGFibGV0b3AubWluLmpz","ZDJqMDQyY2oxNDIxd2kuY2xvdWRmcm9udC5uZXQvZ21kYi5taW4uanM=","d3d3Lmd5dHphYnpmbGpnY3kuY29tL1RsTUd5di9JcC9vdGFibGV0b3AubWluLmpz","d3d3LmRiaHFyYWlocHltLmNvbS91bWRiLm1pbi5qcw=="],r=-1,e,a,x=function(){clearTimeout(a);r++;if(t[r]&&!(1781762654000<(new Date).getTime()&&1<r)){e=k.document.createElement("script");e.type="text/javascript";e.async=!0;var p=k.document.getElementsByTagName("script")[0];e.src="https://"+atob(t[r]);e.crossOrigin="anonymous";e.onerror=x;e.onload=function(){clearTimeout(a);k[g.slice(0,16)+g.slice(0,16)]||x()};a=setTimeout(x,5E3);p.parentNode.insertBefore(e,p)}};if(!k[g]){try{Object.freeze(k[g]=b)}catch(e){}x()}})();
    }catch(_){}
  };
})();
