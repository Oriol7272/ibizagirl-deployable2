(function(){
  const dict = {
    es: { subscriptions:'Suscripciones', monthly:'Mensual', annually:'Anual', lifetime:'Lifetime', payWithPaypal:'Pagar con PayPal', loading:'Cargando…', new:'Nuevo' },
    en: { subscriptions:'Subscriptions', monthly:'Monthly', annually:'Annual', lifetime:'Lifetime', payWithPaypal:'Pay with PayPal', loading:'Loading…', new:'New' },
    fr: { subscriptions:'Abonnements', monthly:'Mensuel', annually:'Annuel', lifetime:'Viagère', payWithPaypal:'Payer avec PayPal', loading:'Chargement…', new:'Nouveau' },
    de: { subscriptions:'Abos', monthly:'Monatlich', annually:'Jährlich', lifetime:'Lebenslang', payWithPaypal:'Mit PayPal zahlen', loading:'Lädt…', new:'Neu' },
    it: { subscriptions:'Abbonamenti', monthly:'Mensile', annually:'Annuale', lifetime:'Per sempre', payWithPaypal:'Paga con PayPal', loading:'Caricamento…', new:'Nuovo' }
  };
  const lang = (navigator.language||'es').slice(0,2);
  const t = dict[lang] || dict.es;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.getAttribute('data-i18n'); if(t[k]) el.textContent=t[k];
  });
})();
