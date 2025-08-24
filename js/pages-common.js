import { t, lang, setLang } from './i18n.js';
export function header(){
  return `
  <div class="header">
    <div class="brand">ibizagirl.pics</div>
    <nav>
      <a href="/index.html">${t('home')}</a>
      <a href="/premium.html">${t('premium')}</a>
      <a href="/videos.html">${t('videos')}</a>
      <a href="/subscription.html">${t('subs')}</a>
      <a href="/subscription.html" class="btn">${t('lifetime')}</a>
    </nav>
    <select class="lang">
      <option value="ES">ES</option><option value="EN">EN</option><option value="FR">FR</option><option value="DE">DE</option><option value="IT">IT</option>
    </select>
  </div>`;
}
export function mountHeader(){
  document.body.insertAdjacentHTML('afterbegin', header());
  const sel=document.querySelector('.lang'); sel.value=lang(); sel.addEventListener('change',e=>setLang(e.target.value));
}
