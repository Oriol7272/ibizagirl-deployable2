/* Página de suscripción: mensual/anual (solo subscription/vault) */
document.addEventListener('DOMContentLoaded', async () => {
  // IMPORTANTE: aquí no se monta ningún capture (lifetime). Lifetime se mueve a lifetime.html
  const buttons = [
    { container: '#sub-monthly', planId: 'P-XXXX-MENSUAL' },
    { container: '#sub-yearly',  planId: 'P-XXXX-ANUAL' }
  ];
  try { await Payments.renderSubscriptions(buttons); }
  catch(e){ console.error(e); }
});
