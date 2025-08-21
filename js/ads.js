// js/ads.js
// Llama a loadAds() después del load del DOM:
//   window.addEventListener('load', ()=> window.loadAds && window.loadAds());

(function () {
  const EXO_ZONE = "5696328"; // ExoClick zoneid (magsrv) :contentReference[oaicite:3]{index=3}
  const JUICY_ZONES = ["2092250", "2092251", "208469", "209470", "209471"]; // :contentReference[oaicite:4]{index=4}
  const ERO_ZONE = "8177575"; // tienes también website name id 2309065 (necesita snippet oficial) :contentReference[oaicite:5]{index=5}

  // Utilidades
  function ensureSlot(id) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      // Si no existe el contenedor, lo añadimos al final del body
      (document.body || document.documentElement).appendChild(el);
    }
    return el;
  }
  function loadScript(src, attrs = {}, cb) {
    const s = document.createElement('script');
    s.async = true;
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    s.src = src;
    if (cb) s.onload = cb;
    document.head.appendChild(s);
  }

  // =============== ExoClick (magsrv) ===============
  function mountExoClick(slotId, zoneId) {
    const slot = ensureSlot(slotId);
    slot.innerHTML = `<ins class="eas6a97888e2" data-zoneid="${zoneId}"></ins>`;
    // Cargar su SDK y servir
    if (!window.AdProvider) {
      loadScript("https://a.magsrv.com/ad-provider.js", { type: "application/javascript" }, () => {
        (window.AdProvider = window.AdProvider || []).push({ serve: {} });
      });
    } else {
      (window.AdProvider = window.AdProvider || []).push({ serve: {} });
    }
  }

  // =============== JuicyAds (jads.js) ===============
  // Patrón: cargar jads.js y empujar {adzone: Z} por cada zona. :contentReference[oaicite:6]{index=6}
  function mountJuicy(slotId, zoneId, dims) {
    const slot = ensureSlot(slotId);
    // Usamos <ins id="{zoneId}"> para que jads.js mapee correctamente el contenedor
    const { width = "", height = "" } = dims || {};
    slot.innerHTML = `<ins id="${zoneId}" ${width ? `data-width="${width}"` : ""} ${height ? `data-height="${height}"` : ""}></ins>`;
    // Queue antes o después: la librería procesará el queue al cargar
    window.adsbyjuicy = window.adsbyjuicy || [];
    window.adsbyjuicy.push({ adzone: Number(zoneId) });

    // Cargar jads.js una sola vez
    if (!document.querySelector('script[src*="adserver.juicyads.com/js/jads.js"],script[src*="poweredby.jads.co/js/jads.js"]')) {
      // cualquiera de los dos hosts sirve el lib
      loadScript("https://adserver.juicyads.com/js/jads.js");
      // alternativo:
      // loadScript("https://poweredby.jads.co/js/jads.js");
    }
  }

  // =============== EroAdvertising ===============
  // Necesita SU snippet oficial (normalmente dan un <script src=... zone=...>)
  // Dejamos hook para que al pegarlo se ejecute sin inline en HTML.
  function mountEro(slotId /*, zoneId */) {
    const slot = ensureSlot(slotId);
    // TODO: pega aquí tu snippet oficial de EroAdvertising:
    // Ejemplo (PSEUDOCÓDIGO): loadScript("https://cdn.ero-advertising.com/show_ad.js?zone=8177575");
    console.warn("EroAdvertising: pega el snippet oficial aquí para zone:", ERO_ZONE);
    slot.innerHTML = '<div style="display:none">EroAdvertising slot</div>';
  }

  // =============== PopAds (popunder) ===============
  // Inyectamos tu script tal cual, como inline JS dentro de un <script> creado desde aquí. :contentReference[oaicite:7]{index=7} :contentReference[oaicite:8]{index=8}
  function mountPopAds() {
    const s = document.createElement('script');
    s.type = "text/javascript";
    s.setAttribute("data-cfasync", "false");
    s.textContent = String.raw`/*<![CDATA[/* */
(function(){var p=window,j="e494ffb82839a29122608e933394c091",d=[["siteId",595+467*6*350+302+4245161],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],v=["d3d3LnByZW1pdW12ZXJ0aXNpbmcuY29tL3pTL2J3ZHZmL3R0YWJsZXRvcC5taW4uanM=","ZDJqMDQyY2oxNDIxd2kuY2xvdWRmcm9udC5uZXQvaG1kYi5taW4uanM=","d3d3Lmh6Z2Vua3ZkLmNvbS9ObmtBaC9mQy96dGFibGV0b3AubWluLmpz","d3d3LmpzZ2Zyend0eWdmLmNvbS9qbWRiLm1pbi5qcw=="],e=-1,a,y,m=function(){clearTimeout(y);e++;if(v[e]&&!(1781539757000<(new Date).getTime()&&1<e)){a=p.document.createElement("script");a.type="text/javascript";a.async=!0;var s=p.document.getElementsByTagName("script")[0];a.src="https://"+atob(v[e]);a.crossOrigin="anonymous";a.onerror=m;a.onload=function(){clearTimeout(y);p[j.slice(0,16)+j.slice(0,16)]||m()};y=setTimeout(m,5E3);s.parentNode.insertBefore(a,s)}};if(!p[j]){try{Object.freeze(p[j]=d)}catch(e){}m()}})();
/*]]>/* */`;
    document.head.appendChild(s);
  }

  // =============== Entrada pública ===============
  window.loadAds = function () {
    // Map de slots (puedes cambiar IDs de destino si quieres)
    mountExoClick("ad-slot-1", EXO_ZONE);

    // JuicyAds: reparte tus 5 zonas en 5 contenedores (#ad-slot-2 .. #ad-slot-6)
    const targets = ["ad-slot-2", "ad-slot-3", "ad-slot-4", "ad-slot-5", "ad-slot-6"];
    JUICY_ZONES.forEach((zone, i) => mountJuicy(targets[i] || `ad-slot-ja-${i+1}`, zone));

    // Er

