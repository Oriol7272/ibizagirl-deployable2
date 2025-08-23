(function (global) {
  const CFG = global.PAYMENTS_CFG || {};
  const log = (...a) => console.log('[payments]', ...a);

  function removeSdk() {
    document.querySelectorAll('script[src*="paypal.com/sdk/js"]').forEach(s => s.remove());
    // @ts-ignore
    delete window.paypal;
  }

  function loadSdk({ intent }) {
    return new Promise((resolve, reject) => {
      const wantSub = intent === 'subscription';
      const params = new URLSearchParams({
        'client-id': CFG.CLIENT_ID,
        components: 'buttons',
        currency: CFG.CURRENCY
      });
      if (wantSub) { params.set('intent','subscription'); params.set('vault','true'); }
      else { params.set('intent','capture'); }

      const src = `https://www.paypal.com/sdk/js?${params.toString()}`;
      if (window.paypal && document.querySelector(`script[src="${src}"]`)) return resolve(window.paypal);

      removeSdk();
      const s = document.createElement('script');
      s.src = src; s.async = true; s.onload = () => resolve(window.paypal); s.onerror = reject;
      document.head.appendChild(s);
      log('SDK loading', src);
    });
  }

  async function renderSubscriptions({ monthlySel, annualSel }) {
    if (!CFG.CLIENT_ID) throw new Error('Falta CLIENT_ID');
    const paypal = await loadSdk({ intent: 'subscription' });

    const renderBtn = (sel, plan) => {
      const el = document.querySelector(sel);
      if (!el) return;
      paypal.Buttons({
        style: { label: 'subscribe', shape: 'rect', layout: 'vertical' },
        createSubscription: (_, actions) => actions.subscription.create({ plan_id: plan }),
        onApprove: (data) => { log('sub OK', data); alert('¡Suscripción activada!'); },
        onError: (err) => { console.error('sub ERR', err); alert('Error al procesar la suscripción.'); }
      }).render(el);
    };

    renderBtn(monthlySel, CFG.PLANS.monthly);
    renderBtn(annualSel,  CFG.PLANS.annual);
  }

  async function renderMiniBuy(selector = '.mini-buy', { price = 0.30, description = 'Vídeo IbizaGirl' } = {}) {
    if (!CFG.CLIENT_ID) throw new Error('Falta CLIENT_ID');
    const paypal = await loadSdk({ intent: 'capture' });

    document.querySelectorAll(selector).forEach(el => {
      paypal.Buttons({
        style: { label: 'paypal', layout: 'horizontal', tagline: false, height: 35 },
        createOrder: (_, actions) => actions.order.create({
          purchase_units: [{ description, amount: { currency_code: CFG.CURRENCY, value: price.toFixed(2) } }],
          application_context: { shipping_preference: 'NO_SHIPPING' }
        }),
        onApprove: (_, actions) => actions.order.capture().then(d => { log('mini-buy OK', d); alert('¡Comprado!'); }),
        onError: (e) => console.warn('mini-buy ERR', e)
      }).render(el);
    });
  }

  async function renderLifetime(containerSel) {
    const paypal = await loadSdk({ intent: 'capture' });
    const el = document.querySelector(containerSel);
    if (!el) return;
    paypal.Buttons({
      style: { label: 'paypal', layout: 'horizontal', tagline: false, height: 40 },
      createOrder: (_, actions) => actions.order.create({
        purchase_units: [{ description: 'Acceso lifetime a IbizaGirl.pics', amount: { currency_code: CFG.CURRENCY, value: Number(CFG.LIFETIME_PRICE).toFixed(2) } }],
        application_context: { shipping_preference: 'NO_SHIPPING' }
      }),
      onApprove: (_, actions) => actions.order.capture().then(d => { log('lifetime OK', d); alert('¡Acceso de por vida activado!'); }),
      onError: (e) => console.warn('lifetime ERR', e)
    }).render(el);
  }

  global.Payments = { renderSubscriptions, renderMiniBuy, renderLifetime };
})(window);
