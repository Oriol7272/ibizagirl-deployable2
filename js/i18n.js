(function(){
  const STRINGS = {
    es: {
      home:"Home", premium:"Premium", videos:"Videos", subs:"Suscripciones",
      title:"beachgirl.pics", tagline:"Bienvenido al paraíso",
      carousel:"Carrusel", gallery:"Galería"
    },
    en: {
      home:"Home", premium:"Premium", videos:"Videos", subs:"Subscriptions",
      title:"beachgirl.pics", tagline:"Welcome to paradise",
      carousel:"Carousel", gallery:"Gallery"
    }
  };
  const LS_KEY="ibg_lang";
  function getLang(){
    const s = localStorage.getItem(LS_KEY);
    if(s) return s;
    const n = (navigator.language||"es").slice(0,2);
    return (n==="en")?"en":"es";
  }
  function apply(lang){
    const t = STRINGS[lang]||STRINGS.es;
    const $ = (sel)=>document.querySelector(sel);
    $('[data-i18n="home"]').textContent = t.home;
    $('[data-i18n="premium"]').textContent = t.premium;
    $('[data-i18n="videos"]').textContent = t.videos;
    $('[data-i18n="subs"]').textContent = t.subs;
    $('[data-i18n="title"]').textContent = t.title;
    $('[data-i18n="tagline"]').textContent = t.tagline;
    $('[data-i18n="carousel"]').textContent = t.carousel;
    $('[data-i18n="gallery"]').textContent = t.gallery;
    const sel = document.getElementById('lang');
    if(sel && sel.value!==lang) sel.value=lang;
  }
  function init(){
    const lang = getLang();
    apply(lang);
    const sel = document.getElementById('lang');
    if(sel){
      sel.addEventListener('change', function(){
        const v=this.value==="en"?"en":"es";
        localStorage.setItem(LS_KEY, v);
        apply(v);
      });
    }
    document.documentElement.lang = (localStorage.getItem(LS_KEY)||"es");
  }
  if(document.readyState!=='loading') init();
  else document.addEventListener('DOMContentLoaded', init);
  window.__IBG_I18N_APPLY__ = apply;
})();
