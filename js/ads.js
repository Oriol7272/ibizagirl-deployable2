/**
 * IbizaGirl.pics - Ads bootstrap (ExoClick + JuicyAds + PopAds)
 * Carga segura (idempotente), soporta adblock (no rompe), y registra eventos en consola.
 * Requiere: CSP con script-src https:, y 'unsafe-inline' para los tags de los proveedores.
 */
(() => {
  if (window.__ADS_BOOTSTRAP__) return; // idempotencia
  window.__ADS_BOOTSTRAP__ = true;

  const LOG = (...a) => console.log("🧩 ads:", ...a);
  const ERR = (...a) => console.warn("⚠️ ads:", ...a);

  // === CONFIG REAL (tus IDs) ===
  const EXO = {
    zoneId: 5696328,                                   // ExoClick
    script: "https://a.magsrv.com/ad-provider.js",
    className: "eas6a97888e2"
  };

  const JUICY = {
    script: "https://adserver.juicyads.com/js/jads.js",
    zones: {
      // elige 2–3 ubicaciones por página; tenemos 5 zonas disponibles
      rightRail: 2092250,
      inContent: 2092251,
      footer:   209470,   // extra
      spare:    209471,   // extra
      legacy:   208469    // extra
    }
  };

  // PopAds (tu snippet dado – respetado tal cual)
  const POPADS = {
    snippet: () => {
      try {
        /* PopAds code (según tu DOC) */
        (function(){var p=window,j="e494ffb82839a29122608e933394c091",d=[["siteId",595+467*6*350+302+4245161],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],v=["d3d3LnByZW1pdW12ZXJ0aXNpbmcuY29tL3pTL2J3ZHZmL3R0YWJsZXRvcC5taW4uanM=","ZDJqMDQyY2oxNDIxd2kuY2xvdWRmcm9udC5uZXQvaG1kYi5taW4uanM=","d3d3Lmh6Z2Vua3ZkLmNvbS9ObmtBaC9mQy96dGFibGV0b3AubWluLmpz","d3d3LmpzZ2Zyend0eWdmLmNvbS9qbWRiLm1pbi5qcw=="],e=-1,a,y,m=function(){clearTimeout(y);e++;if(v[e]&&!(1781539757000<(new Date).getTime()&&1<e)){a=p.document.createElement("script");a.type="text/javascript";a.async=!0;var s=p.document.getElementsByTagName("script")[0];a.src="https://"+atob(v[e]);a.crossOrigin="anonymous";a.onerror=m;a.onload=function(){clearTimeout(y);p[j.slice(0,16)+j.slice(0,16)]||m()};y=setTimeout(m,5E3);s.parentNode.insertBefore(a,s)}};if(!p[j]){try{Object.freeze(p[j]=d)}catch(e){}m()}})();
      } catch (e) { ERR("PopAds error", e); }
    }
  };

  // === helpers ===
  const loadScript = (src, {async=true,defer=true,attrs={}} = {}) =>
    new Promise((resolve,reject) => {
      if ([...document.scripts].some(s => s.src === src)) return resolve("already");
      const el = document.createElement("script");
      el.src = src; el.async = async; el.defer = defer;
      Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k, v));
      el.onload = () => resolve("loaded");
      el.onerror = (e) => reject(new Error(`script load failed: ${src}`));
      document.head.appendChild(el);
    });

  const ensureContainer = (id, parent = document.body, pos = "afterbegin") => {
    let c = document.getElementById(id);
    if (!c) {
      c = document.createElement("div");
      c.id = id;
      parent.insertAdjacentElement(pos === "afterbegin" ? "afterbegin" : "beforeend", c);
    }
    return c;
  };

  const cssOnce = () => {
    if (document.getElementById("ads-style")) return;
    const s = document.createElement("style");
    s.id = "ads-style";
    s.textContent = `
      .ad-slot{display:block;margin:12px auto;max-width:100%}
      .ad-slot--strip{min-height:90px}
      .ad-slot--box{min-height:250px}
      .ad-rail{position:sticky; top:12px; max-width:320px; margin-left:auto}
      @media (max-width: 1023px){ .ad-rail{display:none} }
    `;
    document.head.appendChild(s);
  };

  // === ExoClick ===
  const mountExo = async (container) => {
    try {
      await loadScript(EXO.script, {async:true,defer:true});
      const ins = document.createElement("ins");
      ins.className = `${EXO.className} ad-slot ad-slot--strip`;
      ins.setAttribute("data-zoneid", String(EXO.zoneId));
      container.appendChild(ins);
      (window.AdProvider = window.AdProvider || []).push({ serve: {} });
      LOG("ExoClick colocado (zone)", EXO.zoneId);
    } catch (e) {
      ERR("ExoClick", e);
    }
  };

  // === JuicyAds ===
  let juicyLoaded = false;
  const mountJuicy = async (container, zoneId) => {
    try {
      if (!juicyLoaded) {
        await loadScript(JUICY.script, {async:true,defer:false});
        juicyLoaded = true;
      }
      // patrón oficial
      const ins = document.createElement("ins");
      ins.id = `ja${zoneId}`;
      ins.className = "ad-slot ad-slot--box";
      container.appendChild(ins);

      window.adsbyjuicy = window.adsbyjuicy || [];
      window.adsbyjuicy.push({ adzone: zoneId });
      LOG("JuicyAds colocado (zone)", zoneId);
    } catch (e) {
      ERR("JuicyAds", e);
    }
  };

  // === Layout: creamos contenedores sin tocar tus HTMLs ===
  document.addEventListener("DOMContentLoaded", async () => {
    cssOnce();

    // tiras superior e inferior
    const topStrip    = ensureContainer("ad-top-strip",    document.body, "afterbegin");
    const footerStrip = ensureContainer("ad-footer-strip", document.body, "beforeend");

    // rail derecho en desktop
    const rail = ensureContainer("ad-right-rail", document.body, "beforeend");
    rail.classList.add("ad-rail");

    // Montaje (mezcla de proveedores para repartir impresiones)
    await mountExo(topStrip);                                    // ExoClick arriba
    await mountJuicy(rail, JUICY.zones.rightRail);               // Juicy en rail
    await mountJuicy(footerStrip, JUICY.zones.inContent);        // Juicy en footer

    // PopAds (popunder / tabunder)
    POPADS.snippet();

    LOG("inicializado");
  });
})();
