(function(){
  const STR={es:{home:"Home",premium:"Premium",videos:"Videos",subs:"Suscripciones",title:"beachgirl.pics",tagline:"Bienvenido al paraíso",carousel:"Carrusel",gallery:"Galería"},
             en:{home:"Home",premium:"Premium",videos:"Videos",subs:"Subscriptions",title:"beachgirl.pics",tagline:"Welcome to paradise",carousel:"Carousel",gallery:"Gallery"},
             fr:{home:"Accueil",premium:"Premium",videos:"Vidéos",subs:"Abonnements",title:"beachgirl.pics",tagline:"Bienvenue au paradis",carousel:"Carrousel",gallery:"Galerie"},
             pt:{home:"Início",premium:"Premium",videos:"Vídeos",subs:"Assinaturas",title:"beachgirl.pics",tagline:"Bem-vindo ao paraíso",carousel:"Carrossel",gallery:"Galeria"},
             de:{home:"Start",premium:"Premium",videos:"Videos",subs:"Abos",title:"beachgirl.pics",tagline:"Willkommen im Paradies",carousel:"Karussell",gallery:"Galerie"},
             it:{home:"Home",premium:"Premium",videos:"Video",subs:"Abbonamenti",title:"beachgirl.pics",tagline:"Benvenuto in paradiso",carousel:"Carosello",gallery:"Galleria"}};
  const KEY="ibg_lang";
  const pick=()=>localStorage.getItem(KEY)||(((navigator.language||"es").slice(0,2) in STR)?(navigator.language||"es").slice(0,2):"es");
  const $=s=>document.querySelector(s);
  function apply(L){const t=STR[L]||STR.es;
    $('[data-i18n="home"]').textContent=t.home;
    $('[data-i18n="premium"]').textContent=t.premium;
    $('[data-i18n="videos"]').textContent=t.videos;
    $('[data-i18n="subs"]').textContent=t.subs;
    $('[data-i18n="title"]').textContent=t.title;
    $('[data-i18n="tagline"]').textContent=t.tagline;
    $('[data-i18n="carousel"]').textContent=t.carousel;
    $('[data-i18n="gallery"]').textContent=t.gallery;
    document.documentElement.lang=L;
  }
  function init(){const L=pick();apply(L);
    const sel=$('#lang'); if(sel){sel.value=L; sel.onchange=function(){localStorage.setItem(KEY,this.value); apply(this.value);};}
  }
  document.readyState!=='loading'?init():document.addEventListener('DOMContentLoaded',init);
})();
