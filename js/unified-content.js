// Capa de compatibilidad sobre tus módulos content-data*.js / UnifiedContentAPI
(function(){
  const g=window;
  // Helpers
  function pickN(arr,n){
    const a=[...arr]; const out=[];
    n=Math.min(n,a.length);
    for(let i=0;i<n;i++){
      const idx=Math.floor(Math.random()*a.length);
      out.push(a.splice(idx,1)[0]);
    }
    return out;
  }
  function dailyShuffle(arr,key="__seed__", salt=""){
    const today=(new Date()).toISOString().slice(0,10);
    const seed=(today+salt).split("").reduce((a,c)=>(a*33^c.charCodeAt(0))>>>0,5381);
    const copy=[...arr];
    for(let i=copy.length-1;i>0;i--){
      const r=(seed+i*2654435761) % (i+1);
      [copy[i],copy[r]]=[copy[r],copy[i]];
    }
    return copy;
  }
  function onImgLoad(img,card){
    img.addEventListener("load",()=>{ card.classList.remove("is-loading"); });
    img.addEventListener("error",()=>{ card.classList.add("is-error"); card.querySelector(".thumb-title").textContent="×"; });
  }

  // Exposición simple:
  g.UCAPI={
    getFullPool(){
      // Intenta fuentes conocidas
      if(g.UnifiedContentAPI?.FULL_IMAGES_POOL) return g.UnifiedContentAPI.FULL_IMAGES_POOL;
      if(g.ContentData?.public_full) return g.ContentData.public_full;
      // Fallback: busca en content_data2
      return g.FULL_IMAGES_POOL||[];
    },
    getPremiumImagesPool(){
      const p1=g.UnifiedContentAPI?.PREMIUM_IMAGES_PART1 || g.PREMIUM_IMAGES_PART1 || [];
      const p2=g.UnifiedContentAPI?.PREMIUM_IMAGES_PART2 || g.PREMIUM_IMAGES_PART2 || [];
      return [...p1,...p2];
    },
    getPremiumVideosPool(){
      return g.UnifiedContentAPI?.PREMIUM_VIDEOS_POOL || g.PREMIUM_VIDEOS_POOL || [];
    },
    renderCards({container,items,type="image",markNew=0,price="0,30 €",paypalBadge=false}){
      const el=document.querySelector(container);
      if(!el) return;
      el.innerHTML="";
      items.forEach((item,idx)=>{
        const card=document.createElement("article");
        card.className="card is-loading";
        const a=document.createElement("a");
        a.href=item.url||item.src||item;
        a.target="_blank"; a.rel="noopener";
        const fig=document.createElement("figure");
        fig.className="thumb";
        const img=document.createElement(type==="video"?"video":"img");
        if(type==="video"){ img.controls=false; img.muted=true; img.loop=true; img.preload="none";}
        img.loading="lazy";
        img.src=item.thumb||item.url||item.src||item;
        onImgLoad(img,card);
        fig.appendChild(img);
        const meta=document.createElement("div");
        meta.className="thumb-meta";
        const priceTag=document.createElement("span");
        priceTag.className="price";
        priceTag.textContent=price;
        meta.appendChild(priceTag);
        if(paypalBadge){
          const badge=document.createElement("a");
          badge.className="paypal-badge";
          badge.href="/subscription";
          badge.title=I18N.t("subscribe_with_paypal");
          badge.textContent="PayPal";
          meta.appendChild(badge);
        }
        fig.appendChild(meta);

        if(markNew>0 && Math.random()<markNew){
          const ribbon=document.createElement("span");
          ribbon.className="ribbon";
          ribbon.textContent=I18N.t("new");
          card.appendChild(ribbon);
        }
        const title=document.createElement("div");
        title.className="thumb-title";
        title.setAttribute("data-i18n","loading");
        title.textContent=I18N.t("loading");

        a.appendChild(fig);
        card.appendChild(a);
        card.appendChild(title);
        el.appendChild(card);
      });
    },
    pickN, dailyShuffle
  };
})();
