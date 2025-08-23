/* i18n.js: ES/EN/FR/DE/IT */
(function(){
  const dict = {
    es: { home:"Home", premium:"Premium", videos:"Vídeos", subscription:"Suscripción", gallery:"Galería (20 aleatorias de FULL)", premiumGallery:"Imágenes premium (20 aleatorias)" },
    en: { home:"Home", premium:"Premium", videos:"Videos", subscription:"Subscription", gallery:"Gallery (20 random from FULL)", premiumGallery:"Premium images (20 random)" },
    fr: { home:"Accueil", premium:"Premium", videos:"Vidéos", subscription:"Abonnement", gallery:"Galerie (20 aléatoires de FULL)", premiumGallery:"Images premium (20 aléatoires)" },
    de: { home:"Start", premium:"Premium", videos:"Videos", subscription:"Abo", gallery:"Galerie (20 zufällig aus FULL)", premiumGallery:"Premium-Bilder (20 zufällig)" },
    it: { home:"Home", premium:"Premium", videos:"Video", subscription:"Abbonamento", gallery:"Galleria (20 casuali da FULL)", premiumGallery:"Immagini premium (20 casuali)" },
  };
  function apply(lang){
    const t = dict[lang] || dict.es;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n'); if(t[key]) el.textContent=t[key];
    });
  }
  // Detecta por URL ?lang=xx o por navigator
  const urlLang = new URLSearchParams(location.search).get('lang');
  const navLang = (navigator.language||'es').slice(0,2);
  apply(urlLang || navLang);
  window.setLang = apply;
})();
