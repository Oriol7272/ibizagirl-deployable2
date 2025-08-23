(async function(){
  try {
    await window.Payments.renderSubscriptions({ monthlySel:'#paypal-monthly', annualSel:'#paypal-annual' });
    await window.Payments.renderLifetime('#paypal-lifetime');
  } catch(e){ console.error(e); }
})();
