(function(){
  var K='lang_v1';
  var D={
    es:{gallery:'Galeria',premium:'Premium',videos:'Videos',subscribe:'Suscripcion',lifetime:'Lifetime',prices:'Precios',noads:'Sin anuncios con Lifetime',buy:'Comprar',allvisible:'Todo el contenido visible mientras este activo.'},
    en:{gallery:'Gallery',premium:'Premium',videos:'Videos',subscribe:'Subscription',lifetime:'Lifetime',prices:'Prices',noads:'No ads with Lifetime',buy:'Buy',allvisible:'All content visible while active.'},
    fr:{gallery:'Galerie',premium:'Premium',videos:'Videos',subscribe:'Abonnement',lifetime:'A vie',prices:'Tarifs',noads:'Sans pub avec Lifetime',buy:'Acheter',allvisible:'Tout le contenu visible tant actif.'},
    de:{gallery:'Galerie',premium:'Premium',videos:'Videos',subscribe:'Abo',lifetime:'Lebenslang',prices:'Preise',noads:'Keine Werbung mit Lifetime',buy:'Kaufen',allvisible:'Alle Inhalte sichtbar solange aktiv.'},
    it:{gallery:'Galleria',premium:'Premium',videos:'Video',subscribe:'Abbonamento',lifetime:'A vita',prices:'Prezzi',noads:'Niente ads con Lifetime',buy:'Compra',allvisible:'Tutti i contenuti visibili finche attivo.'}
  };
  function getLang(){ try{return localStorage.getItem(K)||'es';}catch(e){return 'es';} }
  function setLang(l){ try{localStorage.setItem(K,l);}catch(e){} translate(); }
  function text(k){ var t=D[getLang()]||D.es; return t[k]||k; }
  function translate(){
    var t=D[getLang()]||D.es;
    Array.from(document.querySelectorAll('[data-i18n]')).forEach(function(el){
      var k=el.getAttribute('data-i18n'); if(t[k]) el.textContent=t[k];
    });
    Array.from(document.querySelectorAll('.buy-btn .buy-label')).forEach(function(el){ el.textContent=t.buy; });
    var sel=document.getElementById('lang-select'); if(sel) sel.value=getLang();
  }
  window.I18N={ getLang:getLang, setLang:setLang, t:text, translate:translate };
  document.addEventListener('DOMContentLoaded', function(){
    var sel=document.getElementById('lang-select');
    if(sel){ sel.value=getLang(); sel.addEventListener('change', function(e){ setLang(e.target.value); }); }
    translate();
  });
})();
