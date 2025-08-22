(function () {
  const log = (...a) => console.log("💳 paypal:", ...a);
  const warn = (...a) => console.warn("⚠️ paypal:", ...a);
  const err = (...a) => console.error("❌ paypal:", ...a);

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
      { sel: "#pp-monthly",  price: "3.99",  type: "subscription", plan: cfg.planMonthly },
      { sel: "#pp-annual",   price: "24.99", type: "subscription", plan: cfg.planAnnual  },
      { sel: "#pp-lifetime", price: "49.99", type: "one-time" }
    ];

    map.forEach((m) => {
      const el = document.querySelector(m.sel);
      if (!el) return;

      const opts = {
        style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },
        onError: (e) => err("render error", m.sel, e),
      };

      // Suscripción real si hay plan_id, si no pago único fallback
      if (m.type === "subscription" && m.plan) {
        opts.createSubscription = function (data, actions) {
          return actions.subscription.create({ plan_id: m.plan });
        };
        opts.onApprove = function (data, actions) {
          log("subscription approved", data);
          try { localStorage.setItem("ibg_sub_active", "1"); } catch (e) {}
          alert("¡Gracias! Suscripción activada.");
        };
      } else {
        // Pago único (abre PayPal siempre)
        opts.createOrder = function (data, actions) {
          return actions.order.create({
            purchase_units: [
              {
                amount: { value: m.price, currency_code: cfg.currency || "EUR" },
                description: `IbizaGirl ${m.sel.replace("#pp-","")}`,
              },
            ],
            application_context: { shipping_preference: "NO_SHIPPING" },
          });
        };
        opts.onApprove = function (data, actions) {
          return actions.order.capture().then(function (details) {
            log("order captured", details);
            try { localStorage.setItem("ibg_unlock_all", "1"); } catch (e) {}
            alert("¡Gracias! Pago completado.");
          });
        };
      }
      try {
        paypal.Buttons(opts).render(el);
      } catch (e) {
        err("buttons render fail", m.sel, e);
      }
    });
  }

  (async function start() {
    const cfg = await fetchConfig();
    if (!cfg || !cfg.clientId) {
      warn("clientId no disponible. Revisa /api/paypal y las env vars en Vercel.");
      return;
    }
    try {
      const paypal = await loadSdk(cfg.clientId, cfg.currency || "EUR");
      renderButtons(paypal, cfg);
    } catch (e) {
      err("sdk fail", e);
    }
  })();
})();
