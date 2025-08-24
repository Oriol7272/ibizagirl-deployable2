(function(){
  window.IBG_ENV = window.IBG_ENV || {
    VERSION: '5.0.0',
    ENVIRONMENT: 'production',
    CURRENCY: 'EUR',
    PAYPAL_CLIENT_ID: '', // <-- PON AQUÍ TU CLIENT ID REAL
    ADS: {
      ENABLED: true,
      JUICY: { enabled: true, adzone: 1099637 },   // ya lo usabas
      EXO:   { enabled: false, zones: {} },        // desactivado si no tienes ids
      ERO:   { enabled: false, pid: 152716, spaceid: 8177575, ctrlid: 798544, domain: '' } // desactiva hasta tener dominio: evita "https://go./..."
    }
  };
})();
