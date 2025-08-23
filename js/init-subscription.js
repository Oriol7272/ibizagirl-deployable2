(function () {
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      await (window.Payments && Payments.init());
      await Payments.renderSubscriptions({
        monthlyContainer: '#paypal-monthly',
        annualContainer:  '#paypal-annual'
      });
      Payments.renderCheckout({
        container: '#paypal-lifetime',
        amount: 100.00,
        description: 'Acceso lifetime a IbizaGirl.pics'
      });
    } catch(e) {
      console.warn('[subscription] init error', e);
    }
  });
})();
