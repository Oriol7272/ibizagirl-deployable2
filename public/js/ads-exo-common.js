(function(g){
  g.IBG_ADS = g.IBG_ADS || {};
  function waitForEnv(keys, cb, tries, delay){
    tries=tries||120; delay=delay||100;
    let n=0, t=setInterval(()=>{ 
      const ok = g.__ENV && keys.every(k => (g.__ENV[k]!==undefined && String(g.__ENV[k]).trim()!==""));
      if(ok||++n>=tries){ clearInterval(t); cb(ok); }
    },delay);
  }
  function ensureProvider(cb){
    if(g.AdProvider){ return cb(true); }
    let s=document.querySelector('script[src*="a.magsrv.com/ad-provider.js"]');
    if(!s){ s=document.createElement('script'); s.async=true; s.src='https://a.magsrv.com/ad-provider.js'; document.head.appendChild(s); }
    let n=0,t=setInterval(()=>{ if(g.AdProvider||++n>150){ clearInterval(t); cb(!!g.AdProvider);} },100);
  }
  function serve(){ (g.AdProvider=g.AdProvider||[]).push({serve:{}}); }
  function mountExo(zone, host){
    host.innerHTML="";
    const ins=document.createElement('ins');
    ins.className='eas6a97888e17';
    ins.setAttribute('data-zoneid', String(zone));
    ins.setAttribute('data-block-ad-types','0');
    ins.style.display='block';
    host.appendChild(ins);
    serve();
  }
  g.IBG_ADS.waitForEnv=waitForEnv;
  g.IBG_ADS.ensureProvider=ensureProvider;
  g.IBG_ADS.mountExo=mountExo;
  g.IBG_ADS.serve=serve;
})(window);
