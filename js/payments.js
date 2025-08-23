(function(g){
  var C = g.PAYPAL_CONFIG || {};
  var LOADED = false, Q = null;

  function loadSdk(params){
    if (LOADED && g.paypal) return Promise.resolve(g.paypal);
    if (Q) return Q;

    var clientId = C.clientIdLive || 'sb';
    var comps  = (params && params.components) || 'buttons';
    var intent = (params && params.intent)     || 'capture';
    var vault  = (params && params.vault) ? '&vault=true' : '';

    var s = document.createElement('script');
    s.src = 'https://www.paypal.com/sdk/js?client-id=' + encodeURIComponent(clientId)
          + '&components=' + encodeURIComponent(comps)
          + '&intent=' + encodeURIComponent(intent)
          + '&currency=' + (C.currency || 'EUR') + vault;
    s.async = true;

    Q = new Promise(function(res, rej){
      s.onload  = function(){ LOADED = true; res(g.paypal); };
      s.onerror = function(){ rej(new Error('PayPal SDK load error')); };
    });
    document.head.appendChild(s);
    return Q;
  }

  function renderSubscriptions(opts){
    var monthlyId = (opts && opts.monthly) || (C.plans && C.plans.monthly);
    var annualId  = (opts && opts.annual)  || (C.plans && C.plans.annual);
    var mSel = (opts && opts.monthlyContainer) || '#paypal-monthly';
    var aSel = (opts && opts.annualContainer)  || '#paypal-annual';
    if (!monthlyId || !annualId) return console.warn('[payments] faltan plan IDs');

    return loadSdk({components:'buttons', intent:'subscription', vault:true}).then(function(pp){
      var mEl = document.querySelector(mSel);
      var aEl = document.querySelector(aSel);
      if (mEl) pp.Buttons({
        style:{layout:'vertical',color:'gold',label:'subscribe'},
        createSubscription: function(_, actions){ return actions.subscription.create({ plan_id: monthlyId }); },
        onApprove: function(data){ console.log('[payments] monthly ok', data); }
      }).render(mEl);
      if (aEl) pp.Buttons({
        style:{layout:'vertical',color:'gold',label:'subscribe'},
        createSubscription: function(_, actions){ return actions.subscription.create({ plan_id: annualId }); },
        onApprove: function(data){ console.log('[payments] annual ok', data); }
      }).render(aEl);
    });
  }

  function renderLifetime(opts){
    var price = (opts && opts.price) || (C.lifetime && C.lifetime.price) || 100.00;
    var desc  = (opts && opts.description) || (C.lifetime && C.lifetime.description) || 'Acceso lifetime';
    var sel   = (opts && opts.container) || '#paypal-lifetime';

    return loadSdk({components:'buttons', intent:'capture'}).then(function(pp){
      var el = document.querySelector(sel); if(!el) return;
      pp.Buttons({
        style:{layout:'vertical',label:'buynow'},
        createOrder: function(_, actions){
          return actions.order.create({
            purchase_units:[{ description: desc, amount:{ currency_code:(C.currency||'EUR'), value: price.toFixed(2) } }]
          });
        },
        onApprove: function(data, actions){
          return actions.order.capture().then(function(order){ console.log('[payments] lifetime ok', order); });
        },
        onError: function(err){ console.warn('[payments] lifetime error', err); }
      }).render(el);
    });
  }

  function renderMiniBuy(o){
    var price = (o && o.price) || (C.itemPrices && C.itemPrices.video) || 0.30;
    var sel   = (o && o.selector) || '.mini-buy';

    return loadSdk({components:'buttons', intent:'capture'}).then(function(pp){
      document.querySelectorAll(sel).forEach(function(node){
        if (node._ppRendered) return; node._ppRendered = true;
        pp.Buttons({
          style:{layout:'horizontal',tagline:false,label:'pay'},
          createOrder: function(_, actions){
            return actions.order.create({
              purchase_units:[{ amount:{ currency_code:(C.currency||'EUR'), value: price.toFixed(2) } }]
            });
          },
          onApprove: function(_, actions){
            return actions.order.capture().then(function(order){
              console.log('[payments] item ok', order);
              var host = node.closest('[data-item-id]'); if (host) host.classList.add('unlocked');
            });
          },
          onError: function(err){ console.warn('[payments] item error', err); }
        }).render(node);
      });
    });
  }

  g.Payments = { loadSdk, renderSubscriptions, renderLifetime, renderMiniBuy };
})(window);
