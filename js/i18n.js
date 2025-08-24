export const T={
  ES:{home:'Home',premium:'Premium',videos:'Vídeos',subs:'Suscripciones',lifetime:'Lifetime 100€ (sin anuncios)',welcome:'Bienvenido al paraíso para tu disfrute',new:'NUEVO',buy:'Comprar',unlock:'Desbloquear'},
  EN:{home:'Home',premium:'Premium',videos:'Videos',subs:'Subscriptions',lifetime:'Lifetime €100 (no ads)',welcome:'Welcome to your paradise',new:'NEW',buy:'Buy',unlock:'Unlock'},
  FR:{home:'Accueil',premium:'Premium',videos:'Vidéos',subs:'Abonnements',lifetime:'À vie 100€ (sans pubs)',welcome:'Bienvenue au paradis',new:'NOUVEAU',buy:'Acheter',unlock:'Débloquer'},
  DE:{home:'Start',premium:'Premium',videos:'Videos',subs:'Abos',lifetime:'Lifetime 100€ (ohne Werbung)',welcome:'Willkommen im Paradies',new:'NEU',buy:'Kaufen',unlock:'Freischalten'},
  IT:{home:'Home',premium:'Premium',videos:'Video',subs:'Abbonamenti',lifetime:'Per sempre 100€ (senza ads)',welcome:'Benvenuto in paradiso',new:'NUOVO',buy:'Compra',unlock:'Sblocca'},
};
export function lang(){return (localStorage.getItem('ibg_lang')||'ES')}
export function setLang(l){localStorage.setItem('ibg_lang',l);location.reload()}
export function t(k){return (T[lang()]||T.ES)[k]||k}
