console.log("[premium.js] cargando…");

// ====== IBG_Payments (PPV mínimo) ======
(() => {
  const log = (...a)=>console.log('[IBG][Pay]', ...a);

  const GrantStore = {
    key: 'IBG_GRANTS',
    list() {
      try { return JSON.parse(localStorage.getItem(this.key) || '[]'); }
      catch { return []; }
    },
    add(token) {
      const arr = this.list();
      arr.push(token);
      localStorage.setItem(this.key, JSON.stringify(arr));
      window.dispatchEvent(new CustomEvent('ibg:grant:new', { detail:{ token } }));
    },
    hasValidForItem(item) {
      // Decodifica payload del JWT sin verificar firma (solo exp e item)
      const arr = this.list();
      const now = Math.floor(Date.now()/1000);
      function b64uToStr(s){ s=s.replace(/-/g,'+').replace(/_/g,'/'); return atob(s); }
      for (const tok of arr) {
        const parts = String(tok).split('.');
        if (parts.length !== 3) continue;
        try {
          const payload = JSON.parse(b64uToStr(parts[1]));
          if (payload.typ === 'grant' && payload.exp > now) {
            if (payload.scope === 'all') return true;
            if (payload.scope === 'item' && payload.item === item) return true;
          }
        } catch {}
      }
      return false;
    }
  };

  const IBG_Payments = {
    _sdkLoaded: false,
    _currency: 'EUR',
    async loadSdk() {
      if (this._sdkLoaded && window.paypal) return window.paypal;
      const cfg = await fetch('/api/paypal/config').then(r=>r.json());
      if (!cfg.ok || !cfg.clientId) throw new Error('paypal config');
      this._currency = cfg.currency || 'EUR';
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cfg.clientId)}&currency=${this._currency}&intent=capture&components=buttons`;
        s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
      });
      this._sdkLoaded = true;
      return window.paypal;
    },

    // Lanza un flujo PPV para un item concreto
    async checkoutPpv(itemName) {
      const paypal = await this.loadSdk();
      // Modal mínimo
      let modal = document.getElementById('ibg-pay-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'ibg-pay-modal';
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:99999;';
        modal.innerHTML = '<div style="background:#111;padding:16px;border-radius:12px;max-width:420px;width:100%"><div id="ibg-paypal-buttons"></div><button id="ibg-pay-close" style="margin-top:12px;width:100%;padding:10px;border-radius:8px;background:#333;color:#fff;border:0">Cancelar</button></div>';
        document.body.appendChild(modal);
        modal.querySelector('#ibg-pay-close').onclick = ()=> modal.remove();
      } else {
        modal.style.display='flex';
        modal.querySelector('#ibg-paypal-buttons').innerHTML='';
      }

      paypal.Buttons({
        style: { layout:'horizontal', color:'black', shape:'rect', label:'pay' },
        createOrder: async () => {
          const r = await fetch('/api/paypal/create-order', {
            method:'POST',
            headers:{ 'content-type':'application/json' },
            body: JSON.stringify({ sku:'ppv_1' })
          });
          const j = await r.json();
          if (!j.ok) throw new Error('create-order failed');
          log('order CREATED', j.id);
          return j.id;
        },
        onApprove: async (data, actions) => {
          try {
            const r = await fetch('/api/paypal/capture', {
              method:'POST',
              headers:{ 'content-type':'application/json' },
              body: JSON.stringify({ orderId: data.orderID, sku:'ppv_1', item: itemName })
            });
            const j = await r.json();
            if (!j.ok) {
              console.error('capture error', j);
              alert('No se pudo capturar el pago. Revisa consola.');
              return;
            }
            log('capture COMPLETED', j);
            GrantStore.add(j.grant);
            // Quita overlay del item comprado (si existe)
            const el = document.querySelector(`[data-ibg-name="${CSS.escape(itemName)}"]`);
            if (el) el.classList.remove('ibg-locked');
            modal.remove();
            alert('¡Pago completado! Acceso concedido a este contenido durante 24h.');
          } catch (e) {
            console.error('onApprove error', e);
            alert('Error durante la confirmación.');
          }
        },
        onError: (err) => {
          console.error('PayPal Buttons error', err);
          alert('Error con PayPal.');
        }
      }).render('#ibg-paypal-buttons');
    },

    // Hook de UI: cualquier thumbnail con overlay
    enableThumbHandlers() {
      document.addEventListener('click', (ev) => {
        const btn = ev.target.closest('[data-ibg-ppv]');
        if (!btn) return;
        const item = btn.getAttribute('data-ibg-ppv');
        if (!item) return;
        ev.preventDefault();
        this.checkoutPpv(item);
      });
    },

    // Al cargar, marca locked si no hay grant
    markLockedThumbs() {
      document.querySelectorAll('[data-ibg-name]').forEach(el => {
        const name = el.getAttribute('data-ibg-name');
        if (!GrantStore.hasValidForItem(name)) el.classList.add('ibg-locked');
      });
    }
  };

  // Auto-init: marcar y activar handlers
  window.addEventListener('DOMContentLoaded', () => {
    IBG_Payments.enableThumbHandlers();
    IBG_Payments.markLockedThumbs();
    // no cargamos SDK aún; se carga on-demand al pulsar pagar
  });

  // Exponer para debug
  window.IBG_Payments = IBG_Payments;
})();
