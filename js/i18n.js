window.I18N=(function(){
  const dict={
    es:{home:"Home",premium:"Premium",videos:"Vídeos",subscription:"Suscripción",
        gallery_full:"Galería (20 aleatorias de FULL)",
        premium_images:"Imágenes premium (20 aleatorias)",
        videos_title:"Vídeos (20 aleatorios)",
        subscriptions_title:"Suscripciones",
        monthly:"Mensual 14,99 €",annual:"Anual 49,99 €",lifetime:"Lifetime 100 €",
        loading:"Cargando...", new:"Nuevo", pay_with_paypal:"Pagar con PayPal",
        subscribe_with_paypal:"Suscribirse"},
    en:{home:"Home",premium:"Premium",videos:"Videos",subscription:"Subscription",
        gallery_full:"Gallery (20 random from FULL)",
        premium_images:"Premium images (20 random)",
        videos_title:"Videos (20 random)",
        subscriptions_title:"Subscriptions",
        monthly:"Monthly €14.99",annual:"Annual €49.99",lifetime:"Lifetime €100",
        loading:"Loading...", new:"New", pay_with_paypal:"Pay with PayPal",
        subscribe_with_paypal:"Subscribe"},
    fr:{home:"Accueil",premium:"Premium",videos:"Vidéos",subscription:"Abonnement",
        gallery_full:"Galerie (20 aléatoires de FULL)",
        premium_images:"Images premium (20 aléatoires)",
        videos_title:"Vidéos (20 aléatoires)",
        subscriptions_title:"Abonnements",
        monthly:"Mensuel 14,99 €",annual:"Annuel 49,99 €",lifetime:"À vie 100 €",
        loading:"Chargement...", new:"Nouveau", pay_with_paypal:"Payer avec PayPal",
        subscribe_with_paypal:"S’abonner"},
    de:{home:"Start",premium:"Premium",videos:"Videos",subscription:"Abo",
        gallery_full:"Galerie (20 zufällig aus FULL)",
        premium_images:"Premium-Bilder (20 zufällig)",
        videos_title:"Videos (20 zufällig)",
        subscriptions_title:"Abos",
        monthly:"Monatlich 14,99 €",annual:"Jährlich 49,99 €",lifetime:"Lifetime 100 €",
        loading:"Lädt...", new:"Neu", pay_with_paypal:"Mit PayPal zahlen",
        subscribe_with_paypal:"Abonnieren"},
    it:{home:"Home",premium:"Premium",videos:"Video",subscription:"Abbonamento",
        gallery_full:"Galleria (20 casuali da FULL)",
        premium_images:"Immagini premium (20 casuali)",
        videos_title:"Video (20 casuali)",
        subscriptions_title:"Abbonamenti",
        monthly:"Mensile 14,99 €",annual:"Annuale 49,99 €",lifetime:"Lifetime 100 €",
        loading:"Caricamento...", new:"Nuovo", pay_with_paypal:"Paga con PayPal",
        subscribe_with_paypal:"Abbonati"}
  };
  function resolveLang(){
    const saved=localStorage.getItem("lang");
    if(saved && dict[saved]) return saved;
    const nav=(navigator.language||"es").slice(0,2);
    return dict[nav]?nav:"es";
  }
  function t(key){return dict[resolveLang()][key]||key;}
  function apply(){
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const k=el.getAttribute("data-i18n");
      el.textContent=t(k);
    });
  }
  return {t,apply,resolveLang};
})();
document.addEventListener("DOMContentLoaded",()=>I18N.apply());
