(function(){
  const dict = {
    es: { home:"Inicio", premium:"Premium", subs:"Suscripción", videos:"Vídeos",
          welcome:"Bienvenido a IbizaGirl", latest:"Últimas fotos", premiumTitle:"Fotos Premium", videosTitle:"Vídeos Premium" },
    en: { home:"Home", premium:"Premium", subs:"Subscription", videos:"Videos",
          welcome:"Welcome to IbizaGirl", latest:"Latest Photos", premiumTitle:"Premium Photos", videosTitle:"Premium Videos" },
    fr: { home:"Accueil", premium:"Premium", subs:"Abonnement", videos:"Vidéos",
          welcome:"Bienvenue à IbizaGirl", latest:"Dernières photos", premiumTitle:"Photos Premium", videosTitle:"Vidéos Premium" },
    de: { home:"Start", premium:"Premium", subs:"Abo", videos:"Videos",
          welcome:"Willkommen bei IbizaGirl", latest:"Neueste Fotos", premiumTitle:"Premium-Fotos", videosTitle:"Premium-Videos" },
    it: { home:"Home", premium:"Premium", subs:"Abbonamento", videos:"Video",
          welcome:"Benvenuto a IbizaGirl", latest:"Ultime foto", premiumTitle:"Foto Premium", videosTitle:"Video Premium" }
  };
  const lang = (navigator.language||'en').slice(0,2);
  const t = dict[lang] || dict.en;
  document.addEventListener('DOMContentLoaded', ()=>{
    const map = {
      '[data-i18n=home]': t.home, '[data-i18n=premium]': t.premium, '[data-i18n=subs]': t.subs, '[data-i18n=videos]': t.videos,
      '[data-i18n=welcome]': t.welcome, '[data-i18n=latest]': t.latest, '[data-i18n=premiumTitle]': t.premiumTitle, '[data-i18n=videosTitle]': t.videosTitle
    };
    Object.keys(map).forEach(sel=>{ const n=document.querySelector(sel); if(n) n.textContent = map[sel]; });
  });
})();
