(function(){
  var KEY='lang_v1';
  var D={
    es:{gallery:'Galería',premium:'Premium',videos:'Vídeos',subscribe:'Suscripción',buy:'Comprar',welcome:'Bienvenido al paraíso para tu disfrute',todayGallery:'Galería del día',premiumPhotos:'Premium — Imágenes',premiumVideos:'Premium — Vídeos',premiumNote:'Bloqueadas con blur. Desbloquea por 0,10€ cada una o suscríbete.',premiumNoteVideos:'Bloqueados con blur. Desbloquea por 0,30€ cada uno o suscríbete.',new:'Nuevo',locked:'Bloqueado',unlocked:'Desbloqueado',lifetime:'Lifetime'},
    en:{gallery:'Gallery',premium:'Premium',videos:'Videos',subscribe:'Subscription',buy:'Buy',welcome:'Welcome to paradise for your pleasure',todayGallery:'Daily gallery',premiumPhotos:'Premium — Photos',premiumVideos:'Premium — Videos',premiumNote:'Blurred. Unlock for €0.10 each or subscribe.',premiumNoteVideos:'Blurred. Unlock for €0.30 each or subscribe.',new:'NEW',locked:'Locked',unlocked:'Unlocked',lifetime:'Lifetime'},
    fr:{gallery:'Galerie',premium:'Premium',videos:'Vidéos',subscribe:'Abonnement',buy:'Acheter',welcome:'Bienvenue au paradis du plaisir',todayGallery:'Galerie du jour',premiumPhotos:'Premium — Images',premiumVideos:'Premium — Vidéos',premiumNote:'Floutées. Débloquez à 0,10€ ou abonnez‑vous.',premiumNoteVideos:'Floutés. Débloquez à 0,30€ ou abonnez‑vous.',new:'NOUVEAU',locked:'Bloqué',unlocked:'Débloqué',lifetime:'À vie'},
    de:{gallery:'Galerie',premium:'Premium',videos:'Videos',subscribe:'Abo',buy:'Kaufen',welcome:'Willkommen im Paradies',todayGallery:'Galerie des Tages',premiumPhotos:'Premium — Bilder',premiumVideos:'Premium — Videos',premiumNote:'Unscharf. Für 0,10€ freischalten oder abonnieren.',premiumNoteVideos:'Unscharf. Für 0,30€ freischalten oder abonnieren.',new:'NEU',locked:'Gesperrt',unlocked:'Freigeschaltet',lifetime:'Lifetime'},
    it:{gallery:'Galleria',premium:'Premium',videos:'Video',subscribe:'Abbonamento',buy:'Acquista',welcome:'Benvenuto nel paradiso del piacere',todayGallery:'Galleria del giorno',premiumPhotos:'Premium — Immagini',premiumVideos:'Premium — Video',premiumNote:'Sfocate. Sblocca a 0,10€ o abbonati.',premiumNoteVideos:'Sfocati. Sblocca a 0,30€ o abbonati.',new:'NUOVO',locked:'Bloccato',unlocked:'Sbloccato',lifetime:'Lifetime'}
  };
  function get(){ try{return localStorage.getItem(KEY)||'es';}catch(e){return 'es';} }
  function set(l){ try{localStorage.setItem(KEY,l);}catch(e){} tr(); }
  function t(k){ var d=D[get()]||D.es; return d[k]||k; }
  function tr(){
    Array.from(document.querySelectorAll('[data-i18n]')).forEach(function(el){ var k=el.getAttribute('data-i18n'); var v=t(k); if(v) el.textContent=v; });
    Array.from(document.querySelectorAll('.buy-btn .buy-label')).forEach(function(el){ el.textContent=t('buy'); });
    var sel=document.getElementById('lang-select'); if(sel){ sel.value=get(); sel.onchange=function(){ set(sel.value); }; }
  }
  window.I18N={ currentLang:get, setLang:set, t:t, translate:tr };
  document.addEventListener('DOMContentLoaded', tr);
})();
