(function () {
  function ready(fn){/in/.test(document.readyState)?setTimeout(function(){ready(fn)},9):fn()}
  function renderFallback(sel){
    var grid = document.querySelector(sel);
    if (!grid) return;
    // Si la API propia expone un render, úsalo.
    if (window.UnifiedContentAPI && typeof UnifiedContentAPI.renderHome === 'function') {
      try { UnifiedContentAPI.renderHome(); return; } catch(e){}
    }
    // Fallback: intenta pools conocidos.
    var pool = (window.PUBLIC_IMAGES && Array.isArray(PUBLIC_IMAGES)) ? PUBLIC_IMAGES.slice() : [];
    if (!pool.length && window.full && Array.isArray(window.full)) pool = window.full.slice();
    if (!pool.length) return;
    for (var i=0; i<20 && pool.length; i++){
      var ix = Math.floor(Math.random()*pool.length);
      var src = pool.splice(ix,1)[0];
      var fig = document.createElement('figure');
      fig.className = 'card';
      var img = document.createElement('img');
      img.loading = 'lazy';
      img.src = src;
      fig.appendChild(img);
      grid.appendChild(fig);
    }
  }
  ready(function(){ renderFallback('#gallery, .media-grid, .cards'); });
})();
