(function (global) {
  'use strict';
  var cfg = global.PAYMENTS_CONFIG || {};
  var CLIENT_ID = cfg.CLIENT_ID;
  var CURRENCY  = cfg.CURRENCY || 'EUR';
  var _sdkPromise = null;
  var _loadedIntent = null;

  function loadSdk(intent) {
    if (!CLIENT_ID) throw new Error('[payments] Falta CLIENT_ID');
    if (_sdkPromise && _loadedIntent === intent) return _sdkPromise;
    var url = new URL('https://www.paypal.com/sdk/js');
    url.searchParams.set('client-id', CLIENT_ID);
    url.searchParams.set('currency', CURRENCY);
    url.searchParams.set('components', 'buttons');
    if (intent === 'subscription') {
      url.searchParams.set('intent', 'subscription');
      url.searchParams.set('vault', 'true');
      url.searchParams.set('commit', 'true');
    } else {
      url.searchParams.set('intent', 'capture');
      url.searchParams.set('commit', 'true');
    }
    _loadedIntent = intent;
    _sdkPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = url.toString();
      s.async = true;
      s.onload = function () { resolve(global.paypal); };
      s.onerror = function () { reject(new Error('[payments] SDK load error')); };
      document.head.appendChild(s);
    });
    return _sdkPromise;
  }

  function renderSubscriptions(opts) {
    opts = opts || {};
    var monthlyId = opts.monthly || cfg.MONTHLY_PLAN_ID;
    var annualId  = opts.annual  || cfg.ANNUAL_PLAN_ID;
    var mSel = opts.monthlyContainer || '#paypal-monthly';
    var aSel = opts.annualContainer  || '#paypal-annual';

    return loadSdk('subscription').then(function (paypal) {
      if (monthlyId && document.querySelector(mSel)) {
        paypal.Buttons({
          style: { label: 'subscribe', layout: 'horizontal', tagline: false },
          createSubscription: function (_d, actions) {
            return actions.subscription.create({ plan_id: monthlyId });
          },
          onApprove: function (data) {
            console.log('[payments] monthly ok', data);
            localStorage.setItem('subscribed', '1');
            location.reload();
          }
        }).render(mSel);
      }
      if (annualId && document.querySelector(aSel)) {
        paypal.Buttons({
          style: { label: 'subscribe', layout: 'horizontal', tagline: false },
          createSubscription: function (_d, actions) {
            return actions.subscription.create({ plan_id: annualId });
          },
          onApprove: function (data) {
            console.log('[payments] annual ok', data);
            localStorage.setItem('subscribed', '1');
            location.reload();
          }
        }).render(aSel);
      }
    });
  }

  function renderMiniBuy(opts) {
    opts = opts || {};
    var selector = opts.selector || '[data-item-id] .mini-buy';
    var price = Number(opts.price || 0.30);
    var description = opts.description || 'Compra de vídeo';

    return loadSdk('capture').then(function (paypal) {
      document.querySelectorAll(selector).forEach(function (node) {
        if (node.__ppRendered) return;
        node.__ppRendered = true;
        paypal.Buttons({
          style: { layout: 'horizontal', height: 35, label: 'pay', tagline: false },
          createOrder: function (_d, actions) {
            return actions.order.create({
              purchase_units: [{
                description: description,
                amount: { currency_code: CURRENCY, value: price.toFixed(2) }
              }],
              application_context: { shipping_preference: 'NO_SHIPPING' }
            });
          },
          onApprove: function (data, actions) {
            return actions.order.capture().then(function (order) {
              console.log('[payments] mini-buy ok', order);
              node.closest('[data-item-id]')?.classList.add('unlocked');
            });
          }
        }).render(node);
      });
    });
  }

  function init(kind) {
    if (kind === 'subscription') return renderSubscriptions({});
    if (kind === 'capture')       return renderMiniBuy({});
    return Promise.resolve();
  }

  global.Payments = {
    init: init,
    renderSubscriptions: renderSubscriptions,
    renderMiniBuy: renderMiniBuy
  };
})(window);
