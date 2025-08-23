const STORE_KEY='lang_v1';
const DICT={
  es:{gallery:'Galeria',premium:'Premium',videos:'Videos',subscribe:'Suscripciones',lifetime:'Lifetime',prices:'Precios',noads:'Sin anuncios con Lifetime',buy:'Comprar',allvisible:'Todo el contenido visible mientras este activo.',welcome:'Bienvenido al paraiso para tu disfrute'},
  en:{gallery:'Gallery',premium:'Premium',videos:'Videos',subscribe:'Subscriptions',lifetime:'Lifetime',prices:'Prices',noads:'No ads with Lifetime',buy:'Buy',allvisible:'All content visible while active.',welcome:'Welcome to paradise for your pleasure'}
};
function currentLang(){ try{return localStorage.getItem(STORE_KEY)||'es';}catch(e){return 'es';} }
function setLang(l){ try{localStorage.setItem(STORE_KEY,l);}catch(e){} translate(); }
function t(k){ const d=DICT[currentLang()]||DICT.es; return d[k]||k; }
function translate(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{ const k=el.getAttribute('data-i18n'); const v=t(k); if(v) el.textContent=v; });
  document.querySelectorAll('.buy-btn .buy-label').forEach(el=>{ el.textContent=t('buy'); });
  const sel=document.getElementById('lang-select'); if(sel) sel.value=currentLang();
}
window.I18N={ currentLang, setLang, t, translate };
export { currentLang, setLang, t, translate };
