/**
 * Config pública de PayPal para el frontend.
 * 👉 Rellena clientId con TU CLIENT_ID LIVE de PayPal (string completo).
 */
window.PAYPAL_CONFIG = {
  clientId: 'PEGA_AQUI_TU_CLIENT_ID_LIVE',   // <-- 👈👈👈 CAMBIA ESTO
  currency: 'EUR',
  // Suscripciones (IDs reales que me pasaste)
  subscriptions: {
    monthly: 'P-3WE8037612641383DNCUKNJI',
    annual:  'P-43K261214Y571983RNCUKN7I'
  },
  // Pagos únicos
  onetime: {
    lifetime: { amount: '100.00', name: 'Lifetime Access' },
    photo:    { amount: '0.10',  name: '1 photo' },
    video:    { amount: '0.30',  name: '1 video' },
    pack10:   { amount: '0.80',  name: '10 photos pack' },
    pack5v:   { amount: '1.00',  name: '5 videos pack' }
  }
};
