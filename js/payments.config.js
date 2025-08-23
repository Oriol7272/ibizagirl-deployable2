(function(w){
  w.PAYPAL_CONFIG = {
    mode: 'live',
    clientIdLive: 'REEMPLAZA_CON_TU_CLIENT_ID_LIVE',  // <— Pega aquí tu CLIENT ID LIVE
    currency: 'EUR',
    plans: {
      monthly: 'P-3WE8037612641383DNCUKNJI',          // Mensual 14,99€ (LIVE)
      annual:  'P-43K261214Y571983RNCUKN7I'           // Anual 49,99€ (LIVE)
    },
    lifetime: { price: 100.00, description: 'Acceso lifetime a IbizaGirl.pics' },
    itemPrices: { photo: 0.10, video: 0.30, pack10Photos: 0.80, pack5Videos: 1.00 }
  };
})(window);
