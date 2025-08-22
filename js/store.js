// js/store.js
(function () {
  const EUR = "EUR";
  const PRICES = {
    photo: "0.10",
    video: "0.30",
    pack10photos: "0.80",
    pack5videos: "1.00",
  };

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const once = (id, fn) => { if (!window[id]) { window[id] = true; fn(); } };

  // --- Modal UI ---
  function openModal({ kind, title, subtitle, items }) {
    const modal = qs("#purchase-modal");
    if (!modal) return alert("Modal no encontrado");
    qs(".pm-title", modal).textContent = title || "Compra";
    qs(".pm-sub", modal).textContent = subtitle || "";
    qs(".pm-price", modal).textContent = precioLabel(kind);
    const mount = qs("#paypal-oneoff", modal);
    mount.innerHTML = "";
    modal.classList.remove("hidden");

    loadPayPalSDK().then(() => {
      window.paypal.Buttons({
        style: { layout: "vertical", shape: "rect", height: 45 },
        createOrder: async () => {
          const r = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kind, items: items || [] }),
          });
          const j = await r.json();
          if (!r.ok) throw new Error(j.error || "createOrder failed");
          return j.id;
        },
        onApprove: async (data) => {
          const r = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID: data.orderID }),
          });
          const j = await r.json();
          if (!r.ok) throw new Error(j.error || "capture failed");
          closeModal();
          toast("✅ Pago completado");
        },
        onCancel: () => {
          closeModal();
          toast("⏹️ Pago cancelado");
        },
        onError: (err) => {
          console.warn(err);
          toast("⚠️ Error en el pago");
        },
      }).render(mount);
    });
  }

  function closeModal() {
    const modal = qs("#purchase-modal");
    if (modal) modal.classList.add("hidden");
    const mount = qs("#paypal-oneoff", modal || document);
    if (mount) mount.innerHTML = "";
  }

  function precioLabel(kind) {
    switch (kind) {
      case "photo": return "0,10 €";
      case "video": return "0,30 €";
      case "pack10photos": return "0,80 € (10 fotos)";
      case "pack5videos": return "1,00 € (5 vídeos)";
      default: return "";
    }
  }

  // --- SDK PayPal ---
  async function loadPayPalSDK() {
    if (window.paypal && window.paypal.Buttons) return;
    // Usa tu API local que ya expone el clientId
    const r = await fetch("/api/config");
    const j = await r.json();
    if (!j?.paypalClientId) throw new Error("No paypalClientId in /api/config");

    return new Promise((resolve, reject) => {
      if (qs("#paypal-sdk-oneoff")) return resolve();
      const s = document.createElement("script");
      s.id = "paypal-sdk-oneoff";
      s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
        j.paypalClientId
      )}&currency=${EUR}&components=buttons&intent=capture`;
      s.onload = resolve;
      s.onerror = () => reject(new Error("PayPal SDK load failed"));
      document.head.appendChild(s);
    });
  }

  // --- Badges y overlays ---
  function hashInt(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return (h >>> 0);
  }

  function isNew(name) {
    const d = new Date();
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
    return (hashInt(`${key}:${name}`) % 10) < 3; // 30%
  }

  function ensureOverlay(aEl, kind) {
    aEl.style.position = "relative";
    aEl.classList.add("buyable");

    // price badge
    if (!qs(".price-badge", aEl)) {
      const b = document.createElement("div");
      b.className = "price-badge";
      b.textContent = (kind === "photo" ? "0,10€" : "0,30€");
      aEl.appendChild(b);
    }

    // new badge (solo premium)
    const name = (aEl.getAttribute("href") || "").split("/").pop() || "";
    if (!qs(".new-badge", aEl) && isNew(name)) {
      const n = document.createElement("div");
      n.className = "new-badge";
      n.textContent = "NEW";
      aEl.appendChild(n);
    }
  }

  function attachBuyHandlers() {
    // PREMIUM (fotos)
    qsa('a[href*="/uncensored/"]').forEach((a) => {
      ensureOverlay(a, "photo");
      a.addEventListener("click", (ev) => {
        ev.preventDefault();
        const file = (a.getAttribute("href") || "").split("/").pop();
        openModal({
          kind: "photo",
          title: "Comprar foto",
          subtitle: file,
          items: [file]
        });
      }, { passive: false });
    });

    // VIDEOS
    qsa('a[href*="/uncensored-videos/"]').forEach((a) => {
      ensureOverlay(a, "video");
      a.addEventListener("click", (ev) => {
        ev.preventDefault();
        const file = (a.getAttribute("href") || "").split("/").pop();
        openModal({
          kind: "video",
          title: "Comprar vídeo",
          subtitle: file,
          items: [file]
        });
      }, { passive: false });
    });
  }

  function injectPackButtons() {
    // barra superior simple para packs
    once("__packs_bar__", () => {
      const bar = document.createElement("div");
      bar.className = "packs-bar";
      bar.innerHTML = `
        <button class="btn-pack" data-kind="pack10photos">Comprar 10 fotos (0,80€)</button>
        <button class="btn-pack" data-kind="pack5videos">Comprar 5 vídeos (1,00€)</button>
      `;
      document.body.insertBefore(bar, document.body.firstChild);

      bar.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-pack");
        if (!btn) return;
        const kind = btn.getAttribute("data-kind");
        const title = kind === "pack10photos" ? "Pack 10 fotos" : "Pack 5 vídeos";
        openModal({ kind, title, subtitle: "", items: [] });
      });
    });
  }

  // --- Toast sencillo ---
  function toast(msg) {
    let t = qs("#toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.className = "show";
    setTimeout(() => { t.className = ""; }, 2000);
  }

  // --- listeners ---
  document.addEventListener("DOMContentLoaded", () => {
    attachBuyHandlers();
    injectPackButtons();
    const closeEls = qsa(".pm-close");
    closeEls.forEach(el => el.addEventListener("click", closeModal));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  });
})();

