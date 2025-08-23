(function(){
  const $ = (s, r=document)=>r.querySelector(s);
  function pickN(arr, n, seedStr){
    const seed = (seedStr||'x').split('').reduce((a,c)=>a+c.charCodeAt(0),0) ^ Date.now();
    const tmp = arr.slice();
    for(let i=tmp.length-1;i>0;i--){
      const j = Math.floor((Math.sin(seed+i)*10000)%1 * (i+1));
      [tmp[i],tmp[j]]=[tmp[j],tmp[i]];
    }
    return tmp.slice(0, n);
  }
  function cardHTML(item, isNew){
    const src = item.thumb || item.src || item.url;
    const price = (item.price || 0.30).toFixed(2);
    return `
      <figure class="card pay-card" data-item-id="${item.id||''}" data-item-price="${price}">
        <img loading="lazy" src="${src}" alt="${item.title||''}">
        ${isNew ? '<span class="badge-new">NEW</span>' : ''}
        <div class="pay-overlay">
          <span class="pp-icon" aria-hidden="true">PP</span>
          <span class="pp-price">€${price}</span>
          <div class="pp-btn" data-pp-mount></div>
        </div>
      </figure>`;
  }
  document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.querySelector('#premium-grid') || ( ()=>{ const g=document.createElement('section'); g.id='premium-grid'; document.body.appendChild(g); return g; })();
    let pool = [];
    if (window.ContentAPI?.getTodaysContent) {
      pool = (window.ContentAPI.getTodaysContent().premiumPhotos||[]);
    } else if (window.PREMIUM_IMAGES_POOL) {
      pool = window.PREMIUM_IMAGES_POOL;
    }
    const items = pickN(pool, 100, 'premium');
    const newCount = Math.floor(items.length * 0.30);
    const isNew = new Set(items.slice(0,newCount).map(x=>x));
    grid.innerHTML = items.map(x=>cardHTML(x, isNew.has(x))).join('');

    // Monta PayPal mini-buy en cada thumb (intent purchase)
    try {
      if (window.Payments?.init && window.Payments?.renderMiniBuy) {
        const cfg = window.PaymentsConfig || {};
        Payments.init({ clientId: cfg.clientId, currency: cfg.currency||'EUR' });
        document.querySelectorAll('[data-item-price] [data-pp-mount]').forEach((slot) => {
          const fig = slot.closest('[data-item-price]');
          const price = parseFloat(fig.getAttribute('data-item-price'));
          Payments.renderMiniBuy({
            el: slot,
            amount: price,
            currency: (cfg.currency||'EUR'),
            description: 'Compra foto premium IbizaGirl'
          });
        });
      }
    } catch(e){ console.warn('mini-buy skipped', e); }
  });
})();
