document.addEventListener('DOMContentLoaded', () => {
  if (!window.Payments) return;
  window.Payments.renderSubscriptions({
    monthlyContainer: '#paypal-monthly',
    annualContainer:  '#paypal-annual',
    lifetimeContainer:'#paypal-lifetime',
    lifetimePrice: 100.00,
    lifetimeDescription: 'Acceso lifetime a IbizaGirl.pics'
  });
});
