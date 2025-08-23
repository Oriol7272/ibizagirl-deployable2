(function(){
  const T = {
    es: { home:'Home', premium:'Premium', videos:'Vídeos', subscription:'Suscripción',
          gallery:'Galería (20 aleatorias de FULL)', premium_gallery:'Imágenes premium (20 aleatorias)', subs:'Suscripciones' },
    en: { home:'Home', premium:'Premium', videos:'Videos', subscription:'Subscription',
          gallery:'Gallery (20 random from FULL)', premium_gallery:'Premium images (20 random)', subs:'Subscriptions' },
    fr: { home:'Accueil', premium:'Premium', videos:'Vidéos', subscription:'Abonnement',
          gallery:'Galerie (20 aléatoires de FULL)', premium_gallery:'Images premium (20 aléatoires)', subs:'Abonnements' },
    de: { home:'Start', premium:'Premium', videos:'Videos', subscription:'Abo',
          gallery:'Galerie (20 zufällig aus FULL)', premium_gallery:'Premium-Bilder (20 zufällig)', subs:'Abonnements' },
    it: { home:'Home', premium:'Premium', videos:'Video', subscription:'Abbonamento',
          gallery:'Galleria (20 casuali da FULL)', premium_gallery:'Immagini premium (20 casuali)', subs:'Abbonamenti' },
  };
  const pick = (navLang) => (T[navLang] ? navLang : (T[navLang?.slice(0,2)]?navLang.slice(0,2):'es'));
  const lang = pick((new URL(location.href)).searchParams.get('lang') || navigator.language || 'es');
  const t = T[lang];

  const setText = (sel, text) => { const el=document.querySelector(sel); if(el) el.textContent=text; };
  setText('nav a[href="/"]', t.home);
  setText('nav a[href="/premium"]', t.premium);
  setText('nav a[href="/videos"]', t.videos);
  setText('nav a[href="/subscription"]', t.subscription);
  const h1 = document.querySelector('h1');
  if (h1) {
    if (/Suscrip/i.test(h1.textContent||'')) h1.textContent = t.subs;
    else if (/Premium/i.test(document.title)) h1.textContent = t.premium_gallery;
    else if (/Home|Galería/i.test(document.title)) h1.textContent = t.gallery;
  }
})();
