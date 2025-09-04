(function(){
  function val(){ return {
    client:  (window.PAYPAL_CLIENT_ID) || (window.IBG_CANON && IBG_CANON.PAYPAL_CLIENT_ID) || "",
    monthly: (window.PAYPAL_PLAN_MONTHLY_1499) || "",
    yearly:  (window.PAYPAL_PLAN_ANNUAL_4999) || "",
    life:    (window.PAYPAL_PLAN_LIFETIME_100) || (window.PAYPAL_PLAN_LIFETIME_10000) || ""
  };}

  function loadPayPal(cb){
    var v=val();
    if(!v.client){ console.error("PAYPAL_CLIENT_ID vacío"); alert("Falta configurar PayPal."); return; }
    if(window.paypal){ cb(); return; }
    var s=document.createElement('script');
    s.src="https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(v.client)+"&currency=EUR&intent=capture&components=buttons,subscriptions";
    s.onload=function(){ cb(); };
    document.head.appendChild(s);
  }

  function ensureModal(){
    var m=document.getElementById('pp-modal'); if(m) return m;
    m=document.createElement('div'); m.id='pp-modal'; m.className='modal';
    m.innerHTML='<div class="box"><div id="pp-widget"></div><div style="margin-top:8px;text-align:right"><a href="#" class="btn" id="pp-close">Cerrar</a></div></div>';
    document.body.appendChild(m);
    m.addEventListener('click',function(e){ if(e.target.id==='pp-modal'||e.target.id==='pp-close'){ m.classList.remove('show'); document.getElementById("pp-widget").innerHTML=""; }});
    return m;
  }

  function openPurchase(kind,src,amount,onUnlock){
    var modal=ensureModal(); modal.classList.add('show');
    loadPayPal(function(){
      var el=document.getElementById('pp-widget'); el.innerHTML="";
      window.paypal.Buttons({
        createOrder:function(d,a){ return a.order.create({purchase_units:[{amount:{value:amount.toFixed(2)}}]}); },
        onApprove:function(d,a){ return a.order.capture().then(function(){ modal.classList.remove('show'); if(typeof onUnlock==='function') onUnlock(); });},
        onError:function(err){ console.error(err); alert("Pago no completado."); }
      }).render('#pp-widget');
    });
  }

  function mountSubs(){
    var v=val();
    var map=[["btn-monthly",v.monthly],["btn-yearly",v.yearly],["btn-lifetime",v.life]];
    map.forEach(function(x){
      var sel=x[0], plan=x[1]; var el=document.getElementById(sel); if(!el) return;
      if(!plan){ el.innerHTML='<div class="badge">Configura plan</div>'; return; }
      loadPayPal(function(){
        window.paypal.Buttons({
          createSubscription:function(d,a){ return a.subscription.create({plan_id:plan}); },
          onApprove:function(){ alert("Suscripción activada"); }
        }).render('#'+sel);
      });
    });
  }

  window.IBG_PAY={openPurchase:openPurchase,mountSubs:mountSubs};
})();
