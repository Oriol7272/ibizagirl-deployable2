(function(g){
  // ---- utilidades ----
  function pickN(arr,n){ const a=[...arr]; const out=[]; n=Math.min(n,a.length);
    for(let i=0;i<n;i++){ out.push(a.splice(Math.floor(Math.random()*a.length),1)[0]); } return out; }
  function dailyShuffle(arr,salt=""){ const today=(new Date()).toISOString().slice(0,10);
    let seed=(today+salt).split("").reduce((a,c)=>(a*33^c.charCodeAt(0))>>>0,5381);
    const copy=[...arr]; for(let i=copy.length-1;i>0;i--){ seed=(seed*1664525+1013904223)|0; const r=Math.abs(seed)%(i+1);
      [copy[i],copy[r]]=[copy[r],copy[i]]; } return copy; }
  function ensureObj(item){
    if(typeof item==="string") return { id:item, url:item, thumb:item, type:"image" };
    const id=item.id || item.url || item.src || item.thumb || Math.random().toString(36).slice(2);
    return {...item, id};
  }

  // ---- pools desde tus módulos content-data*.js ----
  function getFullPool(){
    return g.UnifiedContentAPI?.FULL_IMAGES_POOL || g.FULL_IMAGES_POOL || g.ContentData?.public_full || [];
  }
  function getPremiumImagesPool(){
    const p1=g.UnifiedContentAPI?.PREMIUM_IMAGES_PART1 || g.PREMIUM_IMAGES_PART1 || [];
    const p2=g.UnifiedContentAPI?.PREMIUM_IMAGES_PART2 || g.PREMIUM_IMAGES_PART2 || [];
    return [...p1,...p2];
  }
  function getPremiumVideosPool(){
    return g.UnifiedContentAPI?.PREMIUM_VIDEOS_POOL || g.PREMIUM_VIDEOS_POOL || g.ContentData?.videos || [];
  }

  // ---- Render genérico de cards con blur y paywall ----
  function createCard({item,kind,price,showPaypalBtn}){
    item=ensureObj(item);
    const locked=!Paywall.hasSub() && !Paywall.hasItem(item.id);

    const card=document.createElement("article");
    card.className="card"+(locked?" is-locked":"");

    const a=document.createElement("a");
    a.href=item.url||item.src||"#";
    a.target="_blank"; a.rel="noopener";

    const fig=document.createElement("figure"); fig.className="thumb";
    const media=document.createElement(kind==="video"?"video":"img");
    media.loading="lazy";
    if(kind==="video"){ media.muted=true; media.loop=true; media.preload="none"; }
    media.src=item.thumb||item.url||item.src;
    fig.appendChild(media);

    const meta=document.createElement("div"); meta.className="thumb-meta";
    if(price){
      const priceTag=document.createElement("span");
      priceTag.className="price"; priceTag.textContent=price;
      meta.appendChild(priceTag);
    }
    if(showPaypalBtn){
      const b=document.createElement("button");
      b.type="button"; b.className="paypal-badge"; b.textContent="PayPal";
      b.onclick=(ev)=>{ ev.preventDefault(); openPayModal(item,kind); };
      meta.appendChild(b);
    }
    fig.appendChild(meta);

    if(item.newTag){
      const rb=document.createElement("span");
      rb.className="ribbon"; rb.textContent=I18N.t("new");
      card.appendChild(rb);
    }

    const ttl=document.createElement("div"); ttl.className="thumb-title";
    ttl.textContent=locked?I18N.t("locked"):I18N.t("unlocked");

    a.appendChild(fig);
    if(!locked){ a.addEventListener("click",()=>{}); } else { a.href="#"; }
    card.appendChild(a);
    card.appendChild(ttl);

    // desbloqueo visual si el usuario compra/ya tiene acceso
    if(!locked) card.classList.remove("is-locked");
    return card;
  }

  // ---- Mini modal de pago por elemento (PayPal capture) ----
  function ensurePayPalLoaded(){
    return new Promise((res,rej)=>{
      if(window.paypal) return res();
      const s=document.createElement("script");
      s.src="https://www.paypal.com/sdk/js?client-id=AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5&components=buttons&intent=capture&currency=EUR";
      s.onload=res; s.onerror=()=>rej(new Error("PayPal SDK error"));
      document.head.appendChild(s);
    });
  }
  function mountPayModal(){
    if(document.getElementById("pay-modal")) return;
    const wrap=document.createElement("div"); wrap.id="pay-modal"; wrap.className="modal hidden";
    wrap.innerHTML=`
      <div class="modal-backdrop"></div>
      <div class="modal-card">
        <h3 id="pm-title">PayPal</h3>
        <div id="paypal-mini"></div>
        <button id="pm-close" class="btn-close">×</button>
      </div>`;
    document.body.appendChild(wrap);
    wrap.querySelector("#pm-close").onclick=()=>wrap.classList.add("hidden");
    wrap.querySelector(".modal-backdrop").onclick=()=>wrap.classList.add("hidden");
  }
  async function openPayModal(item,kind){
    mountPayModal(); await ensurePayPalLoaded();
    const wrap=document.getElementById("pay-modal"); wrap.classList.remove("hidden");
    const mount=document.getElementById("paypal-mini"); mount.innerHTML="";
    const amount = kind==="video" ? "0.30" : "0.10";
    document.getElementById("pm-title").textContent = `${I18N.t("pay_with_paypal")} • ${amount} €`;

    // Re-render seguro para evitar listeners duplicados
    paypal.Buttons({
      style:{shape:'rect',color:'gold',layout:'vertical',label:'pay'},
      createOrder:(_,actions)=>actions.order.create({
        purchase_units:[{ amount:{value:amount, currency_code:'EUR'}, custom_id:item.id }]
      }),
      onApprove: async (data,actions)=>{
        await actions.order.capture();
        Paywall.addItem(item.id);
        // feedback y refresco rápido del estado visual
        document.querySelectorAll(".card.is-locked").forEach(c=>{
          const link=c.querySelector("a");
          if(link && (link.href.includes(item.id) || link.href===item.url)) c.classList.remove("is-locked");
        });
        alert(I18N.t("unlocked"));
        document.getElementById("pay-modal").classList.add("hidden");
      }
    }).render(mount);
  }

  // ---- API pública ----
  g.UCAPI={
    pickN, dailyShuffle,
    getFullPool, getPremiumImagesPool, getPremiumVideosPool,
    createCard
  };
})(window);
