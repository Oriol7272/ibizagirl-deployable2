export const T={
  ES:{home:'Home',premium:'Premium',videos:'Vídeos',subs:'Suscripciones',lifetime:'Lifetime 100€ (sin anuncios)',welcome:'Bienvenido al paraíso para tu disfrute'},
  EN:{home:'Home',premium:'Premium',videos:'Videos',subs:'Subscriptions',lifetime:'Lifetime €100 (no ads)',welcome:'Welcome to your paradise'},
  FR:{home:'Accueil',premium:'Premium',videos:'Vidéos',subs:'Abonnements',lifetime:'À vie 100€ (sans pubs)',welcome:'Bienvenue au paradis'},
  DE:{home:'Start',premium:'Premium',videos:'Videos',subs:'Abos',lifetime:'Lifetime 100€ (ohne Werbung)',welcome:'Willkommen im Paradies'},
  IT:{home:'Home',premium:'Premium',videos:'Video',subs:'Abbonamenti',lifetime:'Per sempre 100€ (senza ads)',welcome:'Benvenuto in paradiso'}
};
export const lang=()=>localStorage.getItem('ibg_lang')||'ES';
export const setLang=l=>(localStorage.setItem('ibg_lang',l),location.reload());
export const t=k=>(T[lang()]||T.ES)[k]||k;
