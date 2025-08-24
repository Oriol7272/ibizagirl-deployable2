import { t } from '../i18n.js';
import { mountSubscriptions, mountLifetime } from '../paypal.js';
export async function initSubscription(){
  const root=document.getElementById('app');
  root.innerHTML = `
    <h2 style="padding:10px 12px">${t('subs')}</h2>
    <div style="padding:12px;display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
      <div style="background:#0a1320;border-radius:18px;padding:16px">
        <h3>${t('monthly')}</h3>
        <div id="paypal-monthly"></div>
      </div>
      <div style="background:#0a1320;border-radius:18px;padding:16px">
        <h3>${t('annual')}</h3>
        <div id="paypal-annual"></div>
      </div>
      <div style="background:#0a1320;border-radius:18px;padding:16px">
        <h3>${t('lifetime2')}</h3>
        <div id="paypal-lifetime"></div>
        <p class="small">Acceso total + sin anuncios.</p>
      </div>
    </div>
  `;
  mountSubscriptions('#paypal-monthly','#paypal-annual');
  mountLifetime('#paypal-lifetime');
}
