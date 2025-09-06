(function(g){
  g.IBG_ADS = g.IBG_ADS || {};
  function waitForEnv(keys, cb, tries, delay){
    tries=tries||80; delay=delay||125;
    var n=0, t=setInterval(function(){
      var ok = g.__ENV && keys.every(function(k){
        return (g.__ENV[k]!==undefined && g.__ENV[k]!==null && String(g.__ENV[k]).trim()!=="");
      });
      if(ok || ++n>=tries){ clearInterval(t); cb(ok); }
    },delay);
  }
  function ensureProvider(cb){
    if(g.AdProvider){ return cb(true); }
    var s=document.querySelector('script[src*="a.magsrv.com/ad-provider.js"]');
    if(!s){ s=document.createElement('script'); s.async=true; s.src='https://a.magsrv.com/ad-provider.js'; document.head.appendChild(s); }
    var n=0,t=setInterval(function(){ if(g.AdProvider || ++n>80){ clearInterval(t); cb(!!g.AdProvider); } },125);
  }
  function mountExo(zone, host){
    host.innerHTML="";
    var ins=document.createElement('ins');
    ins.className='eas6a97888e17';
    ins.setAttribute('data-zoneid', String(zone));
    ins.setAttribute('data-block-ad-types','0');
    host.appendChild(ins);
    (g.AdProvider=g.AdProvider||[]).push({serve:{}});
  }
  g.IBG_ADS.waitForEnv=waitForEnv;
  g.IBG_ADS.ensureProvider=ensureProvider;
  g.IBG_ADS.mountExo=mountExo;
})(window);
