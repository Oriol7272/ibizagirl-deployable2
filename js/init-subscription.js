(function(){
  var plans=window.PAYPAL_PLANS||{};
  var m=document.querySelector("#paypal-monthly");
  var a=document.querySelector("#paypal-annual");
  var l=document.querySelector("#paypal-lifetime");
  if(m && plans.monthly){ Payments.renderSubscription(m, plans.monthly); }
  if(a && plans.annual){ Payments.renderSubscription(a, plans.annual); }
  if(l){ Payments.renderOrder(l, { value:100.00, description:"Acceso lifetime a IbizaGirl.pics" }); }
})();
