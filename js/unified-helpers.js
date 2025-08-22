(function () {
  const w = window;

  function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

  function getAPI(){
    if (w.UnifiedContentAPI) return w.UnifiedContentAPI;
    if (w.ContentAPI) return w.ContentAPI;
    return null;
  }

  function norm(item, folder){
    if (!item) return null;
    if (typeof item === 'string') {
      const name = item.replace(/^\/+/, '');
      const abs = /^https?:\/\//i.test(name);
      return { url: abs ? name : `/${folder}/${name}` };
    }
    if (typeof item === 'object') {
      const cand = item.url || item.src || item.file || item.filename || item.name;
      if (!cand) return null;
      const name = String(cand).replace(/^\/+/, '');
      const abs = /^https?:\/\//i.test(name);
      return { url: abs ? name : `/${folder}/${name}`, ...item };
    }
    return null;
  }

  function readPool(kind){
    const api = getAPI();
    let arr = [];
    try {
      const meth = api && api[`get${cap(kind)}`];
      if (typeof meth === 'function') {
        arr = meth(); // puede devolver strings u objetos (archivo real)
      } else if (w[`CONTENT_${kind.toUpperCase()}`]) {
        arr = w[`CONTENT_${kind.toUpperCase()}`];
      }
    } catch(e){}
    const folder =
      kind === 'videos' ? 'uncensored-videos' :
      (kind === 'full' ? 'full' : 'uncensored');
    return (arr || []).map(x => norm(x, folder)).filter(Boolean);
  }

  function daySeed(){
    const d = new Date();
    return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
  }
  function mulberry32(a){ return function(){ let t = a += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hash(s){ let h=2166136261>>>0; for(let i=0;i<s.length;i++){h^=s.charCodeAt(i); h = Math.imul(h,16777619);} return h>>>0; }

  function pickStable(arr, count, mode){
    if (!Array.isArray(arr) || !arr.length) return [];
    const seedStr = mode==="daily" ? daySeed() : (mode==="reload" ? Math.random().toString() : (mode || daySeed()));
    const rnd = mulberry32(hash(seedStr));
    const idx = arr.map((_,i)=>i);
    for (let i = idx.length-1; i>0; i--) {
      const j = Math.floor(rnd()*(i+1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx.slice(0, Math.min(count, arr.length)).map(i => arr[i]);
  }

  const U = {
    mode: 'daily',
    pools: { full: null, uncensored: null, videos: null },
    setMode(m){ this.mode = m; },
    loadPools(){
      this.pools.full = readPool('full');
      this.pools.uncensored = readPool('uncensored');
      this.pools.videos = readPool('videos');
      console.log('🔎 unified-helpers: pools', {
        full: this.pools.full.length,
        uncensored: this.pools.uncensored.length,
        videos: this.pools.videos.length,
        mode: this.mode
      });
    },
    getFull(n=20){ if (!this.pools.full) this.loadPools(); return pickStable(this.pools.full, n, this.mode); },
    getUncensored(n=100){ if (!this.pools.uncensored) this.loadPools(); return pickStable(this.pools.uncensored, n, this.mode); },
    getVideos(n=20){ if (!this.pools.videos) this.loadPools(); return pickStable(this.pools.videos, n, this.mode); }
  };

  w.U = U;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ()=> { if (!U.pools.full) U.loadPools(); });
  } else {
    if (!U.pools.full) U.loadPools();
  }
})();
