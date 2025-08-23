(function (global) {
  var cfg = global.PAYMENTS_CONFIG || {};
  var _sdk, _sdkParams;

  function loadSdk(extra) {
    if (!cfg.clientId) {
      console.error('[payments] Falta clientId (PAYMENTS_CONFIG.clientId).');
      return Promise.reject(new Error('missing clientId'));
    }
    var params = Object.assign({
      'client-id': cfg.clientId,
      components: 'buttons',
      currency: cfg.currency || 'EUR'
    }, extra || {});
    var qs = new URLSearchParams(params).toString();
    if (_sdk && JSON.stringify(extra||{}) === JSON.stringify(_sdkParams||{})) return _sdk;
    _sdkParams = extra || {};
    _sdk = new Promise(function (resolve, reject) {
      if (global.paypal) return resolve(global.paypal);
      var s = document.createElement('script');
      s.src = 'https://www.paypal.com/sdk/js?' + qs;
      s.async = true;
      s.onload = function () { resolve(global.paypal); };
      s.onerror = function (e) { console.warn('[paypal] sdk load error', e); reject(e); };
      document.head.appendChild(s);
    });
    return _sdk;
  }

  function renderSubscriptions(opts) {
    opts = opts || {};
    var monthly = opts.monthly || cfg.monthly;
    var annual  = opts.annual  || cfg.annual;
    var mSel    = opts.monthlyContainer || '#paypal-monthly';
    var aSel    = opts.annualContainer  || '#paypal-annual';
    return loadSdk({intent:'subscription', vault:'true'}).then(function (paypal) {
      if (monthly && document.querySelector(mSel)) {
        paypal.Buttons({
          style:{ layout:'vertical', label:'subscribe' },
          createSubscription: function (data, actions) {
            return actions.subscription.create({ plan_id: monthly });
          },
          onApprove: function (data) { console.log('[payments] monthly approved', data); },
          onError: function (err) { console.warn('[payments] monthly error', err); }
        }).render(mSel);
      }
      if (annual && document.querySelector(aSel)) {
        paypal.Buttons({
          style:{ layout:'vertical', label:'subscribe' },
          createSubscription: function (data, actions) {
            return actions.subscription.create({ plan_id: annual });
          },
          onApprove: function (data) { console.log('[payments] annual approved', data); },
          onError: function (err) { console.warn('[payments] annual error', err); }
        }).render(aSel);
      }
    });
  }

  function renderMiniBuy(o) {
    o = o || {};
    var selector = o.selector || '.mini-buy';
    var price = Number(o.price || 0.30);
    var description = o.description || 'Compra vídeo IbizaGirl';
    return loadSdk({intent:'capture', vault:'false'}).then(function (paypal) {
      var nodes = document.querySelectorAll(selector);
      nodes.forEach(function (node) {
        paypal.Buttons({
          style:{ layout:'horizontal', tagline:false, label:'pay' },
          createOrder: function (_data, actions) {
            return actions.order.create({
              purchase_units: [{ amount: { currency_code: cfg.currency || 'EUR', value: price.toFixed(2) }, description: description }],
              application_context: { shipping_preference: 'NO_SHIPPING' }
            });
          },
          onApprove: function (_data, actions) {
            return actions.order.capture().then(function (order) {
              console.log('[payments] mini-buy ok', order);
              var wrap = node.closest('[data-item-id]');
              if (wrap) wrap.classList.add('unlocked');
            });
          },
          onError: function (err) { console.warn('[payments] mini-buy error', err); }
        }).render(node);
      });
    });
  }

  function init() {
    if (document.querySelector('#paypal-monthly') || document.querySelector('#paypal-annual')) {
      renderSubscriptions();
    }
    if (document.querySelector('#paypal-lifetime')) {
      renderMiniBuy({ selector:'#paypal-lifetime', price: Number(cfg.lifetimePrice || 100), description: 'Acceso lifetime a IbizaGirl.pics' });
    }
  }

  global.Payments = { init: init, renderSubscriptions: renderSubscriptions, renderMiniBuy: renderMiniBuy };
})(window);
