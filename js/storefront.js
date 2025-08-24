(function(){
  function makeDailyRNG(seedStr){ let h=0; for(let i=0;i<seedStr.length;i++) h = Math.imul(31,h)+seedStr.charCodeAt(i)|0; return ()=> (h = Math.imul(48271,h) % 0x7fffffff) / 0x7fffffff; }
  function todaySeed(){ const d=new Date(); return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`; }
  function pickN(arr,n,seed=todaySeed()){ const rng = makeDailyRNG(seed), a=arr.slice(), out=[]; for(let i=0;i<a.length && out.length<n;i++){ const j = Math.floor(rng()*a.length); out.push(a.splice(j,1)[0]); } return out; }

  function findUrls(regex){
    const out = new Set();
    document.querySelectorAll('img[src],source[src],video[src]').forEach(el=>{ const u = el.getAttribute('src'); if(u && regex.test(u)) out.add(u); });
    for (const k in window){
      const v = window[k];
      if(Array.isArray(v)){
        v.forEach(x=>{
          if(typeof x==='string' && regex.test(x)) out.add(x);
          else if(x && typeof x==='object'){
            const u = x.src||x.url||x.path; if(u && regex.test(u)) out.add(u);
          }
        });
      }
    }
    return Array.from(out);
  }

  const Pools = {
    full:    ()=> findUrls(/\/full\/.+\.(?:jpe?g|png|webp)$/i),
    premium: ()=> findUrls(/\/uncensored\/.+\.(?:jpe?g|png|webp)$/i),
    videos:  ()=> findUrls(/\/uncensored-videos\/.+\.(?:mp4|webm)$/i),
  };

  function hasGlobalAccess(){
    return localStorage.getItem('IBG_LIFETIME')==='1'
        || localStorage.getItem('IBG_SUB_MONTHLY')==='1'
        || localStorage.getItem('IBG_SUB_ANNUAL')==='1';
  }
  function hasItemAccess(kind, ref){
    if(hasGlobalAccess()) return true;
    const key = `IBG_UNLOCK_${kind}_${btoa(unescape(encodeURIComponent(ref))).replace(/=+$/,'')}`;
    return localStorage.getItem(key)==='1';
  }

  function cardHTML(kind, url, isNew, locked){
    const price = (kind==='video') ? '0,' : '0,';1030
    const buyCall = (kind==='video') ? `IBGPay.buySingle('video','${url}')` : `IBGPay.buySingle('image','${url}')`;
    const btn = locked ? `<button class="buy-btn" onclick="${buyCall}"><img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal"> Comprar ${price}</button>` : '';
    const badge = isNew ? `<span class="badge">NUEVO</span>` : '';
    const cls = locked ? 'locked' : 'unlocked';
    const media = (kind==='video')
      ? `<video class="thumb-media" src="${url}" muted playsinline preload="metadata"></video>`
      : `<img class="thumb-media" src="${url}" loading="lazy" />`;
    return `
      <div class="tile ${cls}" style="position:relative">
        ${badge}
        ${media}
        <div class="paywall">
          <span class="price-pill">${price}</span>
          ${btn}
        </div>
      </div>`;
  }

  function renderGrid(el, kind, urls, newCount){
    if(!el) return;
    const setNew = new Set(urls.slice(0,newCount));
    el.innerHTML = urls.map(u => cardHTML(kind, u, setNew.has(u), !hasItemAccess(kind,u))).join('');
  }

  function renderHome(){
    const host = document.getElementById('gallery') || document.querySelector('#main-section .gallery') || document.getElementById('page-main');
    if(!host) return;
    const urls = pickN(Pools.full(), 20);
    host.innerHTML = urls.map(u => `<div class="tile" style="position:relative"><img class="thumb-media" src="${u}" loading="lazy" /></div>`).join('');
  }

  function renderPremium(){
    const host = document.getElementById('premium-grid') || document.querySelector('#premium-grid') || document.getElementById('page-main');
    if(!host) return;
    const urls = pickN(Pools.premium(), 100);
    const news = Math.floor(urls.length * 0.30);
    renderGrid(host, 'image', urls, news);
  }

  function renderVideos(){
    const host = document.getElementById('videos-grid') || document.querySelector('#videos-grid') || document.getElementById('page-main');
    if(!host) return;
    const urls = pickN(Pools.videos(), 20);
    const news = Math.floor(urls.length * 0.30);
    renderGrid(host, 'video', urls, news);
  }

  document.addEventListener('ibg:access-granted', ()=>{ renderPremium(); renderVideos(); });
  document.addEventListener('ibg:item-unlocked', (e)=>{ const k=e.detail?.kind; if(k==='image') renderPremium(); if(k==='video') renderVideos(); });

  window.IBGStore = { renderHome, renderPremium, renderVideos };
})();
