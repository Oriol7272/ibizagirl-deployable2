(function(){
  var KEY='lang_v1';
  var D={
    es:{gallery:'Galeria',premium:'Premium',videos:'Videos',subscribe:'Suscripciones',lifetime:'Lifetime',prices:'Precios',noads:'Sin anuncios con Lifetime',buy:'Comprar',allvisible:'Todo el contenido visible mientras este activo.',welcome:'Bienvenido al paraiso para tu disfrute'},
    en:{gallery:'Gallery',premium:'Premium',videos:'Videos',subscribe:'Subscriptions',lifetime:'Lifetime',prices:'Prices',noads:'No ads with Lifetime',buy:'Buy',allvisible:'All content visible while active.',welcome:'Welcome to paradise for your pleasure'}
  };
  function get(){ try{return localStorage.getItem(KEY)||'es';}catch(e){return 'es';} }
  function set(l){ try{localStorage.setItem(KEY,l);}catch(e){} tr(); }
  function t(k){ var d=D[get()]||D.es; return d[k]||k; }
  function tr(){
    Array.from(document.querySelectorAll('[data-i18n]')).forEach(function(el){ var k=el.getAttribute('data-i18n'); var v=t(k); if(v) el.textContent=v; });
    Array.from(document.querySelectorAll('.buy-btn .buy-label')).forEach(function(el){ el.textContent=t('buy'); });
    var sel=document.getElementById('lang-select'); if(sel) sel.value=get();
  }
  window.I18N={ currentLang:get, setLang:set, t:t, translate:tr };
  document.addEventListener('DOMContentLoaded', tr);
})();
