/**
 * unified-helpers.js
 * Descubre listas (imagenes/videos) mirando todas las propiedades globales.
 * Soporta cualquier "shape" si contiene rutas /full/, /uncensored/, /uncensored-videos/.
 * Ofrece U.getFull(n), U.getUncensored(n, ratioNew), U.getVideos(n, ratioNew).
 * Rotación: modo 'daily' (fijo por día) o 'reload' (aleatorio cada carga).
 */
(function () {
  const MODE = 'daily'; // 'daily' | 'reload'
  const todayKey = (() => {
    const d = new Date();
    // YYYY-MM-DD → semilla reproducible por día
    return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
  })();

  function hash32(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function rng(seed) {
    // xorshift32 simple
    let s = seed >>> 0;
    if (!s) s = 0x9e3779b9;
    return () => {
      s ^= s << 13; s >>>= 0;
      s ^= s >>> 17; s >>>= 0;
      s ^= s << 5;  s >>>= 0;
      // [0,1)
      return (s >>> 0) / 4294967296;
    };
  }

  function makeRngFor(key) {
    if (MODE === 'daily') return rng(hash32(`${todayKey}:${key}`));
    return rng((Math.random() * 2**32) >>> 0);
  }

  function shuffleStable(arr, key) {
    const rand = makeRngFor(key);
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const IMG_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;
  const VID_EXT = /\.(mp4|m3u8|webm|mov)$/i;

  function asURL(x) {
    if (typeof x === 'string') return x;
    if (x && typeof x === 'object') {
      for (const k of ['src','url','path','file','thumb','preview','poster','image']) {
        if (typeof x[k] === 'string') return x[k];
      }
    }
    return '';
  }

  function isImageLike(x) {
    const u = asURL(x);
    return !!u && (IMG_EXT.test(u) || u.includes('/full/') || u.includes('/uncensored/'));
  }

  function isVideoLike(x) {
    const u = asURL(x);
    return !!u && (VID_EXT.test(u) || u.includes('/uncensored-videos/'));
  }

  function flattenArrayish(value, out) {
    if (!value) return;
    if (Array.isArray(value)) {
      for (const v of value) flattenArrayish(v, out);
    } else if (typeof value === 'object') {
      // evita objetos DOM, funciones, etc.
      if (value && value.constructor === Object) {
        // si el objeto en sí parece item multimedia, empuja
        const u = asURL(value);
        if (u) { out.push(value); return; }
        // si no, escanea campos que sean arrays o items
        for (const k in value) {
          try { flattenArrayish(value[k], out); } catch {}
        }
      }
    } else if (typeof value === 'string') {
      out.push(value);
    }
  }

  function collectByPath(prefixFilter) {
    // Busca en window y recoge cualquier item cuyo URL contenga el prefijo.
    const pool = [];
    const visited = new WeakSet();
    const keys = Object.getOwnPropertyNames(window);

    for (const key of keys) {
      if (key === 'document' || key === 'window') continue;
      let val;
      try { val = window[key]; } catch { continue; }
      if (!val) continue;

      const tmp = [];
      // Evita recorrer enormes estructuras repetidas través de referencias
      if (typeof val === 'object') {
        if (visited.has(val)) continue;
        visited.add(val);
      }
      try { flattenArrayish(val, tmp); } catch {}

      for (const item of tmp) {
        const u = asURL(item);
        if (u && u.includes(prefixFilter)) pool.push(item);
      }
    }
    // Dedup por URL
    const seen = new Set();
    const dedup = [];
    for (const it of pool) {
      const u = asURL(it);
      if (!u || seen.has(u)) continue;
      seen.add(u);
      dedup.push(it);
    }
    return dedup;
  }

  // Pools por descubrimiento
  let fullPool = collectByPath('/full/');
  let uncPool  = collectByPath('/uncensored/');
  let vidPool  = collectByPath('/uncensored-videos/');

  // Como fallback adicional, si no encontramos nada por path, intenta heurística por extensión
  if (fullPool.length === 0 || uncPool.length === 0 || vidPool.length === 0) {
    const all = [];
    const keys = Object.getOwnPropertyNames(window);
    for (const k of keys) {
      try { flattenArrayish(window[k], all); } catch {}
    }
    if (fullPool.length === 0) fullPool = all.filter(isImageLike);
    if (uncPool.length === 0)  uncPool  = all.filter(isImageLike);
    if (vidPool.length === 0)  vidPool  = all.filter(isVideoLike);
  }

  function pickN(arr, n, key) {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    return shuffleStable(arr, key).slice(0, n);
  }

  function markNew(arr, ratio = 0.3, key = 'new') {
    const a = arr.slice();
    const total = Math.max(0, Math.round(a.length * ratio));
    const order = shuffleStable([...a.keys()], `flag:${key}`);
    const set = new Set(order.slice(0, total));
    return a.map((it, i) => {
      if (typeof it === 'string') return { src: it, isNew: set.has(i) };
      return { ...it, isNew: (it.isNew || set.has(i)) };
    });
  }

  function normalizeItem(it) {
    if (typeof it === 'string') return { src: it, title: '' };
    const src = asURL(it);
    const title = it.title || it.name || '';
    const poster = it.poster || it.thumb || it.preview || '';
    return { ...it, src, title, poster };
  }

  window.U = {
    getFull: (n = 20) => pickN(fullPool, n, 'full').map(normalizeItem),
    getUncensored: (n = 100, ratioNew = 0.3) =>
      markNew(pickN(uncPool, n, 'unc'), ratioNew, 'unc').map(normalizeItem),
    getVideos: (n = 20, ratioNew = 0.3) =>
      markNew(pickN(vidPool, n, 'vid'), ratioNew, 'vid').map(normalizeItem)
  };

  // DEBUG útil
  console.log('🔎 unified-helpers: pools', {
    full: fullPool.length, uncensored: uncPool.length, videos: vidPool.length, mode: MODE
  });
})();
