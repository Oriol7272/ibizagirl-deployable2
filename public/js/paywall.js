(function(g){
  const KEY_ACCESS="access"; const KEY_ITEMS="purchased"; const S=g.localStorage;
  function load(k,d){ try{return JSON.parse(S.getItem(k))??d;}catch(e){return d;} }
  function save(k,v){ try{S.setItem(k, JSON.stringify(v));}catch(e){} }
  const st={
    get access(){return load(KEY_ACCESS,{});},
    setAccess(p){ save(KEY_ACCESS,{...st.access,...p}); },
    hasSub(){ return !!st.access.subscription || !!st.access.lifetime; },
    isLifetime(){ return !!st.access.lifetime; },
    items(){ return new Set(load(KEY_ITEMS,[])); },
    addItem(id){ const s=st.items(); s.add(id); save(KEY_ITEMS,[...s]); },
    hasItem(id){ return st.items().has(id); }
  };
  g.Paywall=st;
})(window);
