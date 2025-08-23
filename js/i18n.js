/* i18n + selector de idioma (ES/EN/FR/DE/IT) */
window.I18N=(function(){
  const dict={
    es:{home:"Home",premium:"Premium",videos:"Vídeos",subscription:"Suscripción",
        gallery_full:"Galería (20 aleatorias de FULL)",
        premium_images:"Imágenes premium (100 aleatorias)",
        videos_title:"Vídeos (20 aleatorios)",
        subscriptions_title:"Suscripciones",
        monthly:"Mensual 14,99 €",annual:"Anual 49,99 €",lifetime:"Lifetime 100 €",
        loading:"Cargando...", new:"Nuevo",
        pay_with_paypal:"Pagar con PayPal", subscribe_with_paypal:"Suscribirse",
        unlocked:"Desbloqueado", locked:"Contenido premium",
        lifetime_note:"Con Lifetime eliminas anuncios y desbloqueas todo para siempre."},
    en:{home:"Home",premium:"Premium",videos:"Videos",subscription:"Subscription",
        gallery_full:"Gallery (20 random from FULL)",
        premium_images:"Premium images (100 random)",
        videos_title:"Videos (20 random)",
        subscriptions_title:"Subscriptions",
        monthly:"Monthly €14.99",annual:"Annual €49.99",lifetime:"Lifetime €100",
        loading:"Loading...", new:"New",
        pay_with_paypal:"Pay with PayPal", subscribe_with_paypal:"Subscribe",
        unlocked:"Unlocked", locked:"Premium content",
        lifetime_note:"With Lifetime you remove ads and unlock everything forever."},
    fr:{home:"Accueil",premium:"Premium",videos:"Vidéos",subscription:"Abonnement",
        gallery_full:"Galerie (20 aléatoires de FULL)",
        premium_images:"Images premium (100 aléatoires)",
        videos_title:"Vidéos (20 aléatoires)",
        subscriptions_title:"Abonnements",
        monthly:"Mensuel 14,99 €",annual:"Annuel 49,99 €",lifetime:"À vie 100 €",
        loading:"Chargement...", new:"Nouveau",
        pay_with_paypal:"Payer avec PayPal", subscribe_with_paypal:"S’abonner",
        unlocked:"Déverrouillé", locked:"Contenu premium",
        lifetime_note:"Avec Lifetime, vous supprimez les pubs et tout est débloqué à vie."},
    de:{home:"Start",premium:"Premium",videos:"Videos",subscription:"Abo",
        gallery_full:"Galerie (20 zufällig aus FULL)",
        premium_images:"Premium-Bilder (100 zufällig)",
        videos_title:"Videos (20 zufällig)",
        subscriptions_title:"Abos",
        monthly:"Monatlich 14,99 €",annual:"Jährlich 49,99 €",lifetime:"Lifetime 100 €",
        loading:"Lädt...", new:"Neu",
        pay_with_paypal:"Mit PayPal zahlen", subscribe_with_paypal:"Abonnieren",
        unlocked:"Freigeschaltet", locked:"Premium-Inhalt",
        lifetime_note:"Mit Lifetime entfernen Sie Werbung und schalten alles frei."},
    it:{home:"Home",premium:"Premium",videos:"Video",subscription:"Abbonamento",
        gallery_full:"Galleria (20 casuali da FULL)",
        premium_images:"Immagini premium (100 casuali)",
        videos_title:"Video (20 casuali)",
        subscriptions_title:"Abbonamenti",
        monthly:"Mensile 14,99 €",annual:"Annuale 49,99 €",lifetime:"Lifetime 100 €",
        loading:"Caricamento...", new:"Nuovo",
        pay_with_paypal:"Paga con PayPal", subscribe_with_paypal:"Abbonati",
        unlocked:"Sbloccato", locked:"Contenuto premium",
        lifetime_note:"Con Lifetime rimuovi gli annunci e sblocchi tutto per sempre."}
  };
  function lang(){ const s=localStorage.getItem("lang"); if(s && dict[s]) return s;
    const nav=(navigator.language||"es").slice(0,2); return dict[nav]?nav:"es"; }
  function t(k){ return (dict[lang()]||{})[k]||k; }
  function apply(){
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const k=el.getAttribute("data-i18n"); el.textContent=t(k);
    });
  }
  function mountPicker(){
    const sel=document.getElementById("lang-picker");
    if(!sel) return;
    const cur=lang();
    sel.value=cur;
    sel.onchange=()=>{ localStorage.setItem("lang", sel.value); location.reload(); };
  }
  return {t,apply,lang,mountPicker};
})();
document.addEventListener("DOMContentLoaded",()=>{ I18N.apply(); I18N.mountPicker(); });
