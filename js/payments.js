(function () {
  const log  = (...a) => console.log("💳 paypal:", ...a);
  const warn = (...a) => console.warn("⚠️ paypal:", ...a);
  const err  = (...a) => console.error("❌ paypal:", ...a);

  async function fetchConfig() {
    try {
      const r = await fetch("/api/paypal");
      if (!r.ok) throw new Error("http " + r.status);
      return await r.json();
    } catch (e) {
      err("config fail", e);
      return null;
    }
  }

  function loadSdk(clientId, currency) {
    return new Promise((resolve, reject) => {
      if (!clientId) return reject(new Error("missing clientId"));
      if (window.paypal) return resolve(window.paypal);
      const s = document.createElement("script");
      s.src =
        "https://www.paypal.com/sdk/js" +
        `?client-id=${encodeURIComponent(clientId)}` +
        `&currency=${encodeURIComponent(currency || "EUR")}` +
        `&intent=capture&enable-funding=card,venmo&components=buttons`;
      s.async = true;
      s.onload = () => resolve(window.paypal);
      s.onerror = () => reject(new Error("sdk load error"));
      document.head.appendChild(s);
    });
  }

  function renderButtons(paypal, cfg) {
    const map = [
      { sel: "#pp-monthly1499", kind: "sub",  price: "14.99", planId: cfg.planMonthly1499, label: "Mensual 14,99" },
      { sel: "#pp-annual4999",  kind: "sub",  price: "49.99", planId: cfg.planAnnual4999,  label: "Anual 49,99"   },
      { sel: "#pp-lifetime100", kind: "once", price: "100.00",                              label: "Lifetime 100" },
    ];

    map.forEach((m) => {
      const el = document.querySelector(m.sel);
      if (!el) return;

      const opts = {
        style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },
        onError: (e) => err("render error", m.sel, e),
      };

      if (m.kind === "sub" && m.planId) {
        // Suscripción real con plan_id
        opts.createSubscription = (data, actions) =>
          actions.subscription.create({ plan_id: m.planId });
        opts.onApprove = (data) => {
          log("subscription approved", m.label, data);
          alert("¡Gracias! Suscripción activada.");
        };
      } else {
        // Pago único (fallback si falta planId o lifetime)
        const value = m.price;
        opts.createOrder = (data, actions) =>
          actions.order.create({
            purchase_units: [
              { amount: { value, currency_code: cfg.currency || "EUR" },
                description: `IbizaGirl ${m.label}` }
            ],
            application_context: { shipping_preference: "NO_SHIPPING" },
          });
        opts.onApprove = (data, actions) =>
          actions.order.capture().then((details) => {
            log("order captured", m.label, details);
            alert("¡Gracias! Pago completado.");
          });
        if (m.kind === "sub" && !m.planId) {
          warn(`Falta plan_id para ${m.label}. Mostrando pago único temporalmente.`);
        }
      }

      try { paypal.Buttons(opts).render(el); } catch (e) { err("buttons fail", m.sel, e); }
    });
  }

  (async function start() {
    try {
      const cfg = await fetchConfig();
      if (!cfg || !cfg.clientId) {
        warn("Sin PAYPAL_CLIENT_ID configurado");
        return;
      }
      const paypal = await loadSdk(cfg.clientId, cfg.currency || "EUR");
      renderButtons(paypal, cfg);
    } catch (e) {
      err("init fail", e);
    }
  })();
})();
