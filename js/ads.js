(function(g){
  const ENV = g.ENV || {};
  const decode = (b64)=>{ try{return b64?atob(b64):''}catch(_){return ''} };
  const inject = (html, into) => { if(!html) return;
    const c=document.createElement('div'); c.className='ads-frag';
    c.innerHTML=html; (into||document.body).appendChild(c);
  };
  function mountJuicy(where){ inject(decode(ENV.JUICYADS_SNIPPET_B64), where); }
  function mountExo(where){ inject(decode(ENV.EXOCLICK_SNIPPET_B64), where); }
  function mountEroad(where){ inject(decode(ENV.EROADVERTISING_SNIPPET_B64), where); }
  function mountPopAds(){
    if(!ENV.POPADS_SITE_ID) return;
    try{var s=document.createElement('script'); s.async=1; s.src='https://c1.popads.net/pop.js';
      document.body.appendChild(s);}catch(e){console.warn('PopAds',e)}
  }
  function mountSideAds(where){ where=where||document.body;
    try{mountJuicy(where)}catch(e){}
    try{mountExo(where)}catch(e){}
    try{mountEroad(where)}catch(e){}
    try{mountPopAds()}catch(e){}
  }
  g.Ads = { mountJuicy, mountExo, mountEroad, mountPopAds, mountSideAds, mountAds: mountSideAds };
})(window);
