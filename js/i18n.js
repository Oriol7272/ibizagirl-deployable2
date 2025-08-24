export const T={
  ES:{home:'Home',premium:'Premium',videos:'Vídeos',subs:'Suscripciones',lifetime:'Lifetime 100€ (sin anuncios)',welcome:'Bienvenido al paraíso para tu disfrute',new:'NUEVO',buy:'Comprar',unlock:'Desbloquear',price_img:'0,10€',price_vid:'0,30€',subscribe:'Suscribirse',monthly:'Mensual 14,99€',annual:'Anual 49,99€',lifetime2:'Lifetime 100€ (sin anuncios)'},
  EN:{home:'Home',premium:'Premium',videos:'Videos',subs:'Subscriptions',lifetime:'Lifetime €100 (no ads)',welcome:'Welcome to your paradise',new:'NEW',buy:'Buy',unlock:'Unlock',price_img:'€0.10',price_vid:'€0.30',subscribe:'Subscribe',monthly:'Monthly €14.99',annual:'Annual €49.99',lifetime2:'Lifetime €100 (no ads)'},
  FR:{home:'Accueil',premium:'Premium',videos:'Vidéos',subs:'Abonnements',lifetime:'À vie 100€ (sans pubs)',welcome:'Bienvenue au paradis',new:'NOUVEAU',buy:'Acheter',unlock:'Débloquer',price_img:'0,10€',price_vid:'0,30€',subscribe:'S’abonner',monthly:'Mensuel 14,99€',annual:'Annuel 49,99€',lifetime2:'À vie 100€ (sans pubs)'},
  DE:{home:'Start',premium:'Premium',videos:'Videos',subs:'Abos',lifetime:'Lifetime 100€ (ohne Werbung)',welcome:'Willkommen im Paradies',new:'NEU',buy:'Kaufen',unlock:'Freischalten',price_img:'0,10€',price_vid:'0,30€',subscribe:'Abonnieren',monthly:'Monatlich 14,99€',annual:'Jährlich 49,99€',lifetime2:'Lifetime 100€ (ohne Werbung)'},
  IT:{home:'Home',premium:'Premium',videos:'Video',subs:'Abbonamenti',lifetime:'Per sempre 100€ (senza ads)',welcome:'Benvenuto in paradiso',new:'NUOVO',buy:'Compra',unlock:'Sblocca',price_img:'0,10€',price_vid:'0,30€',subscribe:'Abbonati',monthly:'Mensile 14,99€',annual:'Annuale 49,99€',lifetime2:'Per sempre 100€ (senza ads)'}
};
export const lang=()=>localStorage.getItem('ibg_lang')||'ES';
export const setLang=l=>(localStorage.setItem('ibg_lang',l),location.reload());
export const t=k=>(T[lang()]||T.ES)[k]||k;
