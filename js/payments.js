(function(W){
  function planIdFromEnv(prefix){
    var E=W.__ENV||{}; 
    // Usamos EXACTAMENTE los nombres que tienes:
    if(prefix==='monthly' && E.PAYPAL_PLAN_MONTHLY_1499) return E.PAYPAL_PLAN_MONTHLY_1499;
    if(prefix==='annual'  && E.PAYPAL_PLAN_ANNUAL_4999)  return E.PAYPAL_PLAN_ANNUAL_4999;
    // Fallback genérico por si cambias los sufijos:
    var k=Object.keys(E).find(function(x){return x.startsWith('PAYPAL_PLAN_'+(prefix==='monthly'?'MONTHLY':'ANNUAL'))});
    return k?E[k]:'';
  }
  function loadPayPal(){
    var C=(W.__ENV||{}).PAYPAL_CLIENT_ID||"";
    if(!C){console.warn("PAYPAL_CLIENT_ID vacío; no cargo SDK");return;}
    if(document.getElementById('paypal-sdk')) return;
    var s=document.createElement('script');
    s.id='paypal-sdk';
    s.src="https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(C)+"&components=buttons&vault=true&intent=subscription&currency=EUR";
    s.async=true; document.head.appendChild(s);
  }
  function mountSubButtons(){
    if(!W.paypal) return;
    var m=document.getElementById('paypal-monthly');
    var y=document.getElementById('paypal-yearly');
    var l=document.getElementById('paypal-lifetime');
    if(m){
      var pm=planIdFromEnv('monthly');
      if(pm){ paypal.Buttons({style:{shape:'pill',layout:'vertical'},createSubscription:function(_,a){return a.subscription.create({plan_id:pm})},onApprove:function(){localStorage.setItem('ibg_subscribed','1');alert("¡Mensual activada!")}}).render('#paypal-monthly'); }
    }
    if(y){
      var py=planIdFromEnv('annual');
      if(py){ paypal.Buttons({style:{shape:'pill',layout:'vertical'},createSubscription:function(_,a){return a.subscription.create({plan_id:py})},onApprove:function(){localStorage.setItem('ibg_subscribed','1');alert("¡Anual activada!")}}).render('#paypal-yearly'); }
    }
    if(l && (W.__ENV||{}).LIFETIME_PRICE_EUR){
      var price=(W.__ENV||{}).LIFETIME_PRICE_EUR;
      paypal.Buttons({style:{shape:'pill',layout:'vertical'},createOrder:function(_,a){return a.order.create({purchase_units:[{amount:{currency_code:'EUR',value:price}}]})},onApprove:function(_,a){return a.order.capture().then(function(){localStorage.setItem('ibg_lifetime','1');alert("¡Lifetime activado!")})}}).render('#paypal-lifetime');
    }
  }
  function initPaywallUnlockButton(){
    var b=document.getElementById('unlock-now'); if(b){ b.onclick=function(){if(W.IBG_UNLOCK) IBG_UNLOCK();}; }
  }
  W.IBG_PAYMENTS={loadPayPal,mountSubButtons,initPaywallUnlockButton};
})(window);
