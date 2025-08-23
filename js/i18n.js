import {storage,qsa,qs} from './utils.js';
const K='lang_v1';
const D={
 es:{gallery:'Galería',premium:'Premium',videos:'Vídeos',subscribe:'Suscripción',lifetime:'De por vida',prices:'Precios',noads:'Sin anuncios con Lifetime',buy:'Comprar'},
 en:{gallery:'Gallery',premium:'Premium',videos:'Videos',subscribe:'Subscription',lifetime:'Lifetime',prices:'Prices',noads:'No ads with Lifetime',buy:'Buy'},
 fr:{gallery:'Galerie',premium:'Premium',videos:'Vidéos',subscribe:'Abonnement',lifetime:'À vie',prices:'Tarifs',noads:'Sans pub avec Lifetime',buy:'Acheter'},
 de:{gallery:'Galerie',premium:'Premium',videos:'Videos',subscribe:'Abo',lifetime:'Lebenslang',prices:'Preise',noads:'Keine Werbung mit Lifetime',buy:'Kaufen'},
 it:{gallery:'Galleria',premium:'Premium',videos:'Video',subscribe:'Abbonamento',lifetime:'A vita',prices:'Prezzi',noads:'Niente ads con Lifetime',buy:'Compra'}
};
export function currentLang(){return storage.get(K,'es');}
export function setLang(l){storage.set(K,l);translate();}
export function translate(){
  const l=currentLang(); const t=D[l]||D.es;
  qsa('[data-i18n]').forEach(el=>{ const k=el.getAttribute('data-i18n'); if(t[k]) el.textContent=t[k]; });
  const sel=qs('#lang-select'); if(sel) sel.value=l;
  qsa('.buy-btn .buy-label').forEach(el=>el.textContent=t.buy);
}
window.addEventListener('DOMContentLoaded', translate);
