/* IbizaGirl.pics – payments.js (carga única del SDK + suscripciones y lifetime) */
(function (w, d) {
  const log = (...a) => console.log('[payments]', ...a);

  const Payments = {
    config: {
      clientId: 'AfQdeileIw5m3wF08p9pcxqR3gpZBVRUNtK', // tu LIVE client-id
      currency: 'EUR',
      monthlyPlanId: 'P-3WE8037612641383DNCUKNJI',       // Mensual 14,99 €
      annualPlanId:  'P-43K261214Y571983RNCUKN7I',       // Anual 49,99 €
      lifetimePrice: '100.00',
      lifetimeDesc: 'IbizaGirl.pics Lifetime',
      sdkParams: {
        components: 'buttons',
        intent: 'subscription',
        vault: 'true'
      }
    },
    _sdkPromise: null,

    _buildSdkUrl () {
      const { clientId, currency, sdkParams } = this.config;
      const q = new URLSearchParams({
        'client-id': clientId,
        'components': sdkParams.components,
        'intent': sdkParams.intent,
        'vault': sdkParams.vault,
        'currency': currency
      });
      return `https://www.paypal.com/sdk/js?${q.toString()}`;
    },

    loadSdkOnce () {
      if (this._sdkPromise) return this._sdkPromise;
      const url = this._buildSdkUrl();
      log('loading SDK:', url);
      this._sdkPromise = new Promise((resolve, reject) => {
        const s = d.createElement('script');
        s.src = url;
        s.async = true;
        s.onload = () => {
          if (w.paypal) {
            log('SDK loaded');
            resolve(w.paypal);
          } else {
            reject(new Error('paypal SDK not found after load'));
          }
        };
        s.onerror = (e) => {
          console.warn('[paypal] sdk load error', e);
          reject(e);
        };
        d.head.appendChild(s);
      });
      return this._sdkPromise;
    },

    async renderSubscriptions () {
      const paypal = await this.loadSdkOnce();
      const mount = (sel, planId) => {
        const el = d.querySelector(sel);
        if (!el || !planId) return;
        paypal.Buttons({
          style: { layout: 'horizontal', label: 'subscribe', shape: 'pill', height: 40 },
          createSubscription: (data, actions) => actions.subscription.create({ plan_id: planId }),
          onApprove: (data) => {
            log('subscription approved', data);
            location.href = '/premium';
          },
          onError: (err) => console.error('[paypal] subscription error', err)
        }).render(el);
      };
      mount('#pp-monthly', this.config.monthlyPlanId);
      mount('#pp-annual',  this.config.annualPlanId);
    },

    async renderLifetime () {
      const paypal = await this.loadSdkOnce();
      const el = d.querySelector('#pp-lifetime');
      if (!el) return;
      paypal.Buttons({
        style: { label: 'checkout', shape: 'pill', height: 40, color: 'blue' },
        createOrder: (data, actions) => actions.order.create({
          purchase_units: [{
            description: this.config.lifetimeDesc,
            amount: { currency_code: this.config.currency, value: this.config.lifetimePrice }
          }]
        }),
        onApprove: (data, actions) => actions.order.capture().then(() => {
          log('lifetime paid', data);
          location.href = '/premium';
        }),
        onError: (err) => console.error('[paypal] lifetime error', err)
      }).render(el);
    },

    async renderMiniBuyButton (mountEl, { title = 'Vídeo', price = '0.30' } = {}) {
      const paypal = await this.loadSdkOnce();
      if (!mountEl) return;
      paypal.Buttons({
        style: { layout: 'horizontal', label: 'buynow', shape: 'pill', height: 30, color: 'gold' },
        createOrder: (data, actions) => actions.order.create({
          purchase_units: [{
            description: `${title} • IbizaGirl.pics`,
            amount: { currency_code: this.config.currency, value: price }
          }]
        }),
        onApprove: (data, actions) => actions.order.capture().then(() => {
          mountEl.innerHTML = '<span class="text-green-400">Comprado ✅</span>';
        }),
        onError: (err) => console.error('[paypal] mini-buy error', err)
      }).render(mountEl);
    }
  };

  w.Payments = Payments;
})(window, document);

