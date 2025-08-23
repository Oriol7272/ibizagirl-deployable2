/* Gestión local (demo) de compras/suscripciones. En producción se valida por backend/webhook */
(function(g){
  const KEY_ACCESS="access"; // { subscription:true, lifetime:true }
  const KEY_ITEMS="purchased"; // set de itemIds
  const S=g.localStorage;

  function load(k,def){ try{ return JSON.parse(S.getItem(k)) ?? def; }catch(e){ return def; } }
  function save(k,v){ S.setItem(k, JSON.stringify(v)); }

  const st={
    get access(){ return load(KEY_ACCESS,{}); },
    setAccess(p){ save(KEY_ACCESS, {...st.access, ...p}); },
    hasSub(){ return !!st.access.subscription || !!st.access.lifetime; },
    isLifetime(){ return !!st.access.lifetime; },
    items(){ return new Set(load(KEY_ITEMS,[])); },
    addItem(id){ const s=st.items(); s.add(id); save(KEY_ITEMS,[...s]); },
    hasItem(id){ return st.items().has(id); },
    reset(){ S.removeItem(KEY_ACCESS); S.removeItem(KEY_ITEMS); }
  };
  g.Paywall=st;
})(window);
