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
  function cardHTML(item){
    const thumb = item.thumb || item.poster || item.src || item.url;
    const price = (item.price || 0.50).toFixed(2);
    return `
      <article class="video-card" data-item-id="${item.id||''}" data-item-price="${price}">
        <img class="video-thumb" loading="lazy" src="${thumb}" alt="${item.title||''}">
        <div class="pay-overlay">
          <span class="pp-icon">PP</span><span class="pp-price">€${price}</span>
          <div class="pp-btn" data-pp-mount></div>
        </div>
      </article>`;
  }
  document.addEventListener('DOMContentLoaded', async () => {
    const grid = $('#videos-grid') || ( ()=>{ const g=document.createElement('section'); g.id='videos-grid'; document.body.appendChild(g); return g; })();
    let pool = [];
    if (window.ContentAPI?.getTodaysContent) {
      pool = (window.ContentAPI.getTodaysContent().premiumVideos||[]);
    } else if (window.VIDEO_POOL || window.FULL_VIDEOS_POOL) {
      pool = window.VIDEO_POOL || window.FULL_VIDEOS_POOL;
    }
    const items = pickN(pool, 20, 'videos');
    grid.innerHTML = items.map(cardHTML).join('');
    try {
      const cfg = window.PaymentsConfig || {};
      if (window.Payments?.init && window.Payments?.renderMiniBuy) {
        Payments.init({ clientId: cfg.clientId, currency: cfg.currency||'EUR' });
        document.querySelectorAll('[data-item-price] [data-pp-mount]').forEach((slot) => {
          const host = slot.closest('[data-item-price]');
          const price = parseFloat(host.getAttribute('data-item-price'));
          Payments.renderMiniBuy({
            el: slot,
            amount: price,
            currency: (cfg.currency||'EUR'),
            description: 'Compra vídeo IbizaGirl'
          });
        });
      }
    } catch(e){ console.warn('mini-buy skipped', e); }
  });
})();
