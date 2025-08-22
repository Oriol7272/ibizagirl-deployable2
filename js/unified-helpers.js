/* Unifica acceso a datos desde content-data*.js y evita fallos si cambian nombres */
(function () {
  const A = window.UnifiedContentAPI || {};
  const C = window.ContentAPI || {};
  const S = window.ContentSystemManager || {};

  function firstFn(obj, names) {
    for (const n of names) {
      if (typeof obj[n] === 'function') return obj[n].bind(obj);
    }
    return null;
  }

  // Fallbacks muy tolerantes: intentan múltiples nombres comunes
  const getFullImpl =
    firstFn(A, ['getFull', 'getFullDaily', 'selectFull', 'getGalleryFull', 'pickFull']) ||
    firstFn(C, ['getFull', 'selectFull']) ||
    function (n = 20) { return (S.fullPool || []).slice(0, n); };

  const getUncensoredImpl =
    firstFn(A, ['getUncensored', 'getUncensoredDaily', 'selectUncensored']) ||
    firstFn(C, ['getUncensored', 'selectUncensored']) ||
    function (n = 100) { return (S.uncensoredPool || []).slice(0, n); };

  const getVideosImpl =
    firstFn(A, ['getVideos', 'getVideosDaily', 'selectVideos']) ||
    firstFn(C, ['getVideos', 'selectVideos']) ||
    function (n = 20) { return (S.videoPool || []).slice(0, n); };

  // Marcar "nuevos" en un % si la API no lo provee
  function markNewRandom(arr, ratio = 0.3) {
    if (!Array.isArray(arr)) return [];
    const totalNew = Math.max(0, Math.round(arr.length * ratio));
    const idxs = [...arr.keys()];
    for (let i = idxs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
    }
    const newSet = new Set(idxs.slice(0, totalNew));
    return arr.map((it, i) => ({ ...it, isNew: it.isNew || newSet.has(i) }));
  }

  window.U = {
    getFull: (n = 20) => getFullImpl(n) || [],
    getUncensored: (n = 100, ratioNew = 0.3) => markNewRandom(getUncensoredImpl(n) || [], ratioNew),
    getVideos: (n = 20, ratioNew = 0.3) => markNewRandom(getVideosImpl(n) || [], ratioNew)
  };
})();
