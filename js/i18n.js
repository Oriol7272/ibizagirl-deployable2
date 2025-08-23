(function(){
  var STORE_KEY='lang_v1';
  var DICT={
    es:{gallery:'Galeria',premium:'Premium',videos:'Videos',subscribe:'Suscripciones',lifetime:'Lifetime',prices:'Precios',noads:'Sin anuncios con Lifetime',buy:'Comprar',allvisible:'Todo el contenido visible mientras este activo.',welcome:'Bienvenido al paraiso para tu disfrute'},
    en:{gallery:'Gallery',premium:'Premium',videos:'Videos',subscribe:'Subscriptions',lifetime:'Lifetime',prices:'Prices',noads:'No ads with Lifetime',buy:'Buy',allvisible:'All content visible while active.',welcome:'Welcome to paradise for your pleasure'}
  };
  function currentLang(){ try{return localStorage.getItem(STORE_KEY)||'es';}catch(e){return 'es';} }
  function setLang(l){ try{localStorage.setItem(STORE_KEY,l);}catch(e){} translate(); }
  function t(k){ var d=DICT[currentLang()]||DICT.es; return d[k]||k; }
  function translate(){
    Array.from(document.querySelectorAll('[data-i18n]')).forEach(function(el){ var k=el.getAttribute('data-i18n'); var v=t(k); if(v) el.textContent=v; });
    Array.from(document.querySelectorAll('.buy-btn .buy-label')).forEach(function(el){ el.textContent=t('buy'); });
    var sel=document.getElementById('lang-select'); if(sel) sel.value=currentLang();
  }
  window.I18N={ currentLang:currentLang, setLang:setLang, t:t, translate:translate };
  document.addEventListener('DOMContentLoaded', translate);
})();
