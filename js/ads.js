/** Ads glue — tolerante a variables vacías, usando tus ENV reales */
import { ENV } from './env.js';

const injectHTML = (html, where = document.body) => {
  const c = document.createElement('div');
  c.className = 'ads-frag';
  c.innerHTML = html;
  where.appendChild(c);
  return c;
};

const decode = (b64) => {
  if (!b64) return '';
  try { return atob(b64); } catch { return ''; }
};

/** Redes (inserta snippet B64 si existe; si no, no rompe) */
export function mountJuicy(where) {
  const html = decode(ENV.JUICYADS_SNIPPET_B64);
  if (html) injectHTML(html, where);
}
export function mountExo(where) {
  const html = decode(ENV.EXOCLICK_SNIPPET_B64);
  if (html) injectHTML(html, where);
}
export function mountEroad(where) {
  const html = decode(ENV.EROADVERTISING_SNIPPET_B64);
  if (html) injectHTML(html, where);
}
/** PopAds solo si existe site id, pero nunca rompe si no está */
export function mountPopAds() {
  if (!ENV.POPADS_SITE_ID) return;
  try {
    (function(p,u,s,h){p._pop=p._pop||[];p._pop.push({sId:ENV.POPADS_SITE_ID});
      var x=u.createElement('script'); x.src=h; x.async=true;
      u.body.appendChild(x);
    })(window, document, null, 'https://c1.popads.net/pop.js');
  } catch(e){ console.warn('PopAds error', e); }
}

/** Para páginas con laterales: mete todas de forma segura */
export function mountSideAds(container) {
  const where = container || document.body;
  try { mountJuicy(where); } catch(e){}
  try { mountExo(where); } catch(e){}
  try { mountEroad(where); } catch(e){}
  try { mountPopAds(); } catch(e){}
}

/** Alias general para no romper imports existentes */
export const mountAds = mountSideAds;
export default { mountSideAds, mountAds, mountJuicy, mountExo, mountEroad, mountPopAds };
