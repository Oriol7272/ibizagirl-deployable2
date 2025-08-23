(function(w,d){
  var SDK_ID="paypal-sdk", sdkPromise=null;
  function loadSDK(){
    if(w.paypal && w.paypal.Buttons) return Promise.resolve(w.paypal);
    if(!sdkPromise){
      var s=d.getElementById(SDK_ID);
      if(!s){
        var q=new URLSearchParams();
        q.set("client-id", w.PAYPAL_CLIENT_ID||"");
        q.set("components","buttons");
        q.set("currency","EUR");
        q.set("vault","true");
        s=d.createElement("script");
        s.id=SDK_ID;
        s.src="https://www.paypal.com/sdk/js?"+q.toString();
        s.async=true;
        sdkPromise=new Promise(function(res,rej){
          s.onload=function(){ if(w.paypal && w.paypal.Buttons){ res(w.paypal); } else { rej(new Error("paypal sdk loaded without Buttons")); } };
          s.onerror=function(){ rej(new Error("paypal sdk load failed")); };
        });
        d.head.appendChild(s);
      }else{
        sdkPromise=new Promise(function(res,rej){
          if(w.paypal && w.paypal.Buttons){ res(w.paypal); return; }
          s.addEventListener("load",function(){ res(w.paypal); });
          s.addEventListener("error",function(){ rej(new Error("paypal sdk load failed (existing)")); });
        });
      }
    }
    return sdkPromise;
  }

  function renderSubscription(el, planId, onApprove){
    return loadSDK().then(function(paypal){
      return paypal.Buttons({
        style:{layout:"horizontal",tagline:false},
        createSubscription:function(_d,actions){ return actions.subscription.create({plan_id:planId}); },
        onApprove:function(data){ try{ if(typeof onApprove==="function") onApprove(data); }catch(e){} },
        onError:function(err){ console.warn("[paypal] sub error", err); }
      }).render(el);
    });
  }

  function renderOrder(el, opts){
    var v=Number(opts&&opts.value||0);
    var desc=(opts&&opts.description)||"";
    return loadSDK().then(function(paypal){
      return paypal.Buttons({
        style:{layout:"horizontal",tagline:false,label:"pay"},
        createOrder:function(_d,actions){
          return actions.order.create({
            purchase_units:[{ amount:{ currency_code:"EUR", value:v.toFixed(2) }, description:desc }]
          });
        },
        onApprove:function(_d,actions){
          return actions.order.capture().then(function(order){
            try{ el.closest("[data-item-id]") && el.closest("[data-item-id]").classList.add("unlocked"); }catch(e){}
            console.log("[paypal] order ok", order);
          });
        },
        onError:function(err){ console.warn("[paypal] order error", err); }
      }).render(el);
    });
  }

  w.Payments={ renderSubscription:renderSubscription, renderOrder:renderOrder };
})(window,document);
