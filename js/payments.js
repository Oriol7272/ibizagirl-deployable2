/**
 * IbizaGirl.pics - PayPal unified helpers
 * - One-time purchases (images/videos)
 * - Packs
 * - Subscriptions (monthly / annual)
 *
 * Requiere tener cargado el SDK de PayPal en la página (components=buttons,subscriptions).
 * Este módulo es "idempotente": lo puedes cargar en varias páginas.
 */
(function () {
  const IBG = window.IBG || (window.IBG = {});
  const log = (...a) => console.log("[payments]", ...a);

  // === CONFIG ===
  const CONFIG = {
    currency: "EUR",
    prices: {
      imageSingle: "0.10",
      imagePack10: "0.80",
      videoSingle: "0.30",
      videoPack5: "1.00",
      lifetime: "100.00",
    },
    // Plan IDs reales (los que me pasaste):
    plans: {
      monthly: "P-3WE8037612641383DNCUKNJI",
      annual:  "P-43K261214Y571983RNCUKN7I",
    },
    // Selectores heurísticos para detectar cards de video
    videoGridSelectors: [
      "#videos-grid", "#grid-videos", "#grid", ".videos-grid", ".grid",
    ],
    videoCardSelectors: [
      ".card", ".video-card", ".item", ".thumb", "a[href*='/uncensored-videos/']",
    ],
  };

  // Exponer config por si otras páginas lo leen
  IBG.PaymentsConfig = CONFIG;

  // === UTILS ===
  function onPayPalReady(cb) {
    if (window.paypal && typeof window.paypal.Buttons === "function") {
      return cb();
    }
    let waited = 0;
    const t = setInterval(() => {
      waited += 150;
      if (window.paypal && typeof window.paypal.Buttons === "function") {
        clearInterval(t);
        cb();
      } else if (waited > 20000) {
        clearInterval(t);
        console.warn("[payments] PayPal SDK no llegó a cargar.");
      }
    }, 150);
  }

  function markPremiumAndToast(kind, meta = {}) {
    try {
      localStorage.setItem("ibg:isPremium", "true");
      localStorage.setItem("ibg:lastPurchase", JSON.stringify({kind, when: Date.now(), ...meta}));
    } catch {}
    alert("✅ Pago completado. Si no ves todo desbloqueado al instante, refresca la página.");
  }

  // === RENDERERS ===
  function renderBuyButton({ mount, amount, description }) {
    if (!mount) return;
    const node = typeof mount === "string" ? document.querySelector(mount) : mount;
    if (!node) return;

    onPayPalReady(() => {
      window.paypal.Buttons({
        style: { layout: "horizontal", height: 35, label: "paypal" },
        fundingSource: window.paypal.FUNDING.PAYPAL,
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: { value: amount, currency_code: CONFIG.currency },
              description: description || "Compra digital IbizaGirl.pics",
            }],
            application_context: { shipping_preference: "NO_SHIPPING" },
          });
        },
        onApprove: function (data, actions) {
          return actions.order.capture().then(function (details) {
            log("capture ok", details);
            markPremiumAndToast("one-time", { amount, description });
          });
        },
        onError: function (err) {
          console.error("[payments] onError", err);
          alert("No se pudo completar el pago. Intenta de nuevo.");
        }
      }).render(node);
    });
  }

  function renderSubscriptionButton({ mount, planId, label }) {
    if (!planId || !mount) return;
    const node = typeof mount === "string" ? document.querySelector(mount) : mount;
    if (!node) return;

    onPayPalReady(() => {
      window.paypal.Buttons({
        style: { layout: "horizontal", height: 35, label: "subscribe" },
        createSubscription: function (data, actions) {
          return actions.subscription.create({ plan_id: planId });
        },
        onApprove: function (data, actions) {
          log("subscription ok", data);
          markPremiumAndToast("subscription", { planId, label });
        },
        onError: function (err) {
          console.error("[payments] sub onError", err);
          alert("No se pudo completar la suscripción. Intenta de nuevo.");
        }
      }).render(node);
    });
  }

  // === PÁGINA DE SUSCRIPCIÓN ===
  function hydrateSubscriptionPageIfPresent() {
    // IDs esperados en subscription.html
    const m = document.getElementById("pp-sub-monthly");
    const a = document.getElementById("pp-sub-annual");
    const lifetime = document.getElementById("pp-buy-lifetime");
    if (!m && !a && !lifetime) return; // no estamos en esa página

    if (m) renderSubscriptionButton({ mount: m, planId: CONFIG.plans.monthly, label: "monthly" });
    if (a) renderSubscriptionButton({ mount: a, planId: CONFIG.plans.annual,  label: "annual"  });
    if (lifetime) {
      renderBuyButton({ mount: lifetime, amount: CONFIG.prices.lifetime, description: "Premium de por vida" });
    }
  }

  // === PÁGINA DE VÍDEOS ===
  function tryFindVideosGrid() {
    for (const sel of CONFIG.videoGridSelectors) {
      const n = document.querySelector(sel);
      if (n) return n;
    }
    // fallback: el primer grid visible
    return document.querySelector(".grid, [class*='grid']");
  }

  function findCandidateCardsIn(grid) {
    if (!grid) return [];
    for (const sel of CONFIG.videoCardSelectors) {
      const list = grid.querySelectorAll(sel);
      if (list && list.length) return Array.from(list);
    }
    return [];
  }

  function injectMiniButtonContainer(cardEl) {
    // evita inyectar dos veces
    if (cardEl.querySelector(".pp-mini")) return null;

    const wrap = document.createElement("div");
    wrap.className = "pp-mini";
    wrap.innerHTML = `
      <div class="pp-mini-price">0,30 €</div>
      <div class="pp-mini-slot"></div>
    `;
    // posición: esquina inferior derecha
    wrap.style.position = "absolute";
    wrap.style.right = "8px";
    wrap.style.bottom = "8px";
    wrap.style.zIndex = "5";
    wrap.style.display = "flex";
    wrap.style.flexDirection = "column";
    wrap.style.gap = "6px";
    wrap.style.alignItems = "flex-end";

    const price = wrap.querySelector(".pp-mini-price");
    price.style.background = "rgba(0,0,0,.65)";
    price.style.color = "#fff";
    price.style.fontSize = "12px";
    price.style.padding = "2px 6px";
    price.style.borderRadius = "8px";

    const slot = wrap.querySelector(".pp-mini-slot");
    slot.style.transform = "scale(.85)"; // botón pequeño
    slot.style.transformOrigin = "right bottom";

    // El card debe ser posicionable
    const s = getComputedStyle(cardEl);
    if (s.position === "static") cardEl.style.position = "relative";

    cardEl.appendChild(wrap);
    return slot;
  }

  function hydrateVideosPageIfPresent() {
    const grid = tryFindVideosGrid();
    if (!grid) return;

    // Bloque “suscríbete” si existe en vídeos (opcional)
    const m = document.getElementById("pp-videos-sub-monthly");
    const a = document.getElementById("pp-videos-sub-annual");
    if (m) renderSubscriptionButton({ mount: m, planId: CONFIG.plans.monthly, label: "monthly" });
    if (a) renderSubscriptionButton({ mount: a, planId: CONFIG.plans.annual,  label: "annual"  });

    // Inyectar mini-botón en hasta 20 cards
    const cards = findCandidateCardsIn(grid).slice(0, 20);
    let rendered = 0;
    cards.forEach((card) => {
      const slot = injectMiniButtonContainer(card);
      if (!slot) return;
      renderBuyButton({
        mount: slot,
        amount: CONFIG.prices.videoSingle,
        description: "Vídeo individual 0,30 €",
      });
      rendered++;
    });
    log(`vídeos: mini-botones renderizados = ${rendered}`);
  }

  // === PÚBLICO ===
  IBG.Payments = {
    renderBuyButton,
    renderSubscriptionButton,
    hydrateSubscriptionPageIfPresent,
    hydrateVideosPageIfPresent,
    config: CONFIG,
  };

  // Auto-arranque en cada página
  document.addEventListener("DOMContentLoaded", () => {
    hydrateSubscriptionPageIfPresent();
    hydrateVideosPageIfPresent();
  });
})();
