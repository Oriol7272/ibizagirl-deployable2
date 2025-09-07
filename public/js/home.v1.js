(() => {
  const W = window, D = document;

  // ---------- i18n ----------
  const I18N = {
    es: { home:"Home", premium:"Premium", videos:"Vídeos", subs:"Suscripciones", title:"beachgirl.pics", sub:"Bienvenido al paraíso" },
    en: { home:"Home", premium:"Premium", videos:"Videos", subs:"Subscriptions", title:"beachgirl.pics", sub:"Welcome to paradise" },
    fr: { home:"Accueil", premium:"Premium", videos:"Vidéos", subs:"Abonnements", title:"beachgirl.pics", sub:"Bienvenue au paradis" },
    de: { home:"Start", premium:"Premium", videos:"Videos", subs:"Abos", title:"beachgirl.pics", sub:"Willkommen im Paradies" },
    it: { home:"Home", premium:"Premium", videos:"Video", subs:"Abbonamenti", title:"beachgirl.pics", sub:"Benvenuto in paradiso" },
  };
  const getLang = () => (localStorage.getItem("ibg_lang") || "es").toLowerCase();
  const setLang = (lang) => { localStorage.setItem("ibg_lang", lang); paintTexts(); highlightLang(lang); };

  function ensureLangSwitch() {
    let sw = D.getElementById("lang-switch");
    if (!sw) {
      const nav = D.querySelector(".navbar nav") || D.querySelector("nav");
      if (!nav) return;
      sw = D.createElement("div");
      sw.id = "lang-switch";
      ["ES","EN","FR","DE","IT"].forEach(code => {
        const btn = D.createElement("button");
        btn.textContent = code;
        btn.addEventListener("click", () => setLang(code.toLowerCase()));
        sw.appendChild(btn);
      });
      nav.appendChild(sw);
    } else {
      // limpia duplicados (solo uno)
      const dups = D.querySelectorAll('#lang-switch');
      dups.forEach((el, i) => { if (i > 0 && el.parentElement) el.parentElement.removeChild(el); });
    }
    highlightLang(getLang());
  }

  function highlightLang(lang){
    D.querySelectorAll('#lang-switch button').forEach(b=>{
      b.classList.toggle('active', b.textContent.toLowerCase()===lang);
    });
  }

  function paintTexts() {
    const L = I18N[getLang()] || I18N.es;
    const map = {
      '#nav-home': L.home, '#nav-premium': L.premium, '#nav-videos': L.videos, '#nav-subs': L.subs,
      '.hero-title': L.title, '.hero-sub': L.sub
    };
    for (const sel in map) {
      const el = D.querySelector(sel);
      if (el) el.textContent = map[sel];
    }
  }

  // ---------- Banner / fondo rotatorio ----------
  const decoList =
    (W.DECORATIVE_MANIFEST && (W.DECORATIVE_MANIFEST.images || W.DECORATIVE_MANIFEST)) ||
    ["paradise-beach.png"]; // fallback

  let decoIndex = 0;
  function rotateBackground(){
    if (!decoList || decoList.length===0) return;
    decoIndex = (decoIndex+1) % decoList.length;
    const name = (typeof decoList[decoIndex]==="string") ? decoList[decoIndex] : (decoList[decoIndex].url || decoList[decoIndex].src || "paradise-beach.png");
    D.body.style.backgroundImage = `url("/decorative-images/${name}")`;
  }

  // ---------- Pool de imágenes públicas ----------
  function getPublicPool(){
    // intenta múltiples fuentes ya presentes en tus módulos
    const candidates = [
      W.FULL_IMAGES_POOL,
      (W.PUBLIC_IMAGES && W.PUBLIC_IMAGES.full),
      (W.IBG_CONTENT && W.IBG_CONTENT.public && W.IBG_CONTENT.public.full),
      (W.ContentAPI && W.ContentAPI.public && W.ContentAPI.public.full),
      (W.UnifiedContentAPI && W.UnifiedContentAPI.public && W.UnifiedContentAPI.public.full),
    ].filter(Boolean)[0];

    if (Array.isArray(candidates) && candidates.length) return candidates;
    // fallback vacío (no rompe)
    return [];
  }

  function pickRandom(arr, n){
    const out = [];
    const used = new Set();
    const max = Math.min(n, arr.length);
    while(out.length < max){
      const i = Math.floor(Math.random()*arr.length);
      if (used.has(i)) continue;
      used.add(i);
      out.push(arr[i]);
    }
    return out;
  }

  // ---------- Render carrusel ----------
  function renderCarousel(list){
    const track = D.querySelector('#carousel .carousel-track');
    if (!track) return;
    track.innerHTML = '';
    list.forEach(src=>{
      const img = new Image();
      img.loading = "lazy";
      img.decoding = "async";
      img.src = `/full/${src}`;
      img.alt = "carousel";
      track.appendChild(img);
    });
    // auto scroll simple
    let x = 0;
    const step = () => {
      x += 0.5;
      track.scrollLeft = x;
      if (x >= track.scrollWidth - track.clientWidth) x = 0;
      req = W.requestAnimationFrame(step);
    };
    let req = W.requestAnimationFrame(step);
    // pausa al hover
    track.addEventListener("mouseenter", ()=>{ W.cancelAnimationFrame(req); });
    track.addEventListener("mouseleave", ()=>{ req = W.requestAnimationFrame(step); });
  }

  // ---------- Render galería ----------
  function renderGallery(list){
    const grid = D.querySelector('#gallery .grid');
    if (!grid) return;
    grid.innerHTML = '';
    list.forEach(src=>{
      const img = new Image();
      img.loading = "lazy";
      img.decoding = "async";
      img.src = `/full/${src}`;
      img.alt = "gallery";
      grid.appendChild(img);
    });
  }

  // lazy fade-in
  function hookLazyFade(){
    if (!('IntersectionObserver' in W)) return;
    const io = new IntersectionObserver((entries)=>{
      for(const e of entries){
        if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
      }
    }, {rootMargin:"100px"});
    D.querySelectorAll('img[loading="lazy"]').forEach(img=>io.observe(img));
  }

  // ---------- Boot ----------
  document.addEventListener('DOMContentLoaded', ()=>{
    ensureLangSwitch();
    paintTexts();

    // anula posibles menús de idioma duplicados
    const dup = Array.from(document.querySelectorAll('#lang-switch')).slice(1);
    dup.forEach(el=>el.remove());

    // Fondo rotatorio cada 15s
    setInterval(rotateBackground, 15000);

    const pool = getPublicPool().filter(p=>/\.webp$/i.test(p));
    const chosen1 = pickRandom(pool, 40);
    const chosen2 = pickRandom(pool, 40);

    renderCarousel(chosen1);
    renderGallery(chosen2);

    hookLazyFade();
  });
})();
