(function(g){
  function dailyShuffle(arr,salt){ if(!Array.isArray(arr)) return []; const today=(new Date()).toISOString().slice(0,10)+String(salt||""); let seed=0; for(const c of today) seed=(seed*33 ^ c.charCodeAt(0))>>>0; const a=[...arr]; for(let i=a.length-1;i>0;i--){ seed=(seed*1664525+1013904223)|0; const r=Math.abs(seed)%(i+1); [a[i],a[r]]=[a[r],a[i]]; } return a; }
  function ensureObj(x){ if(typeof x==="string") return {url:x,thumb:x,type:"image"}; return x||{}; }
  function getFromGlobal(name){ try{ return g[name] || []; }catch(e){ return []; } }
  function getFullPool(){ return (g.ContentAPI && g.ContentAPI.getAllPublicImages) ? g.ContentAPI.getAllPublicImages() : getFromGlobal('FULL_POOL') }
  function getPremiumImagesPool(){ return (g.ContentAPI && g.ContentAPI.getAllPremiumImages) ? g.ContentAPI.getAllPremiumImages() : getFromGlobal('PREMIUM_IMAGES') }
  function getPremiumVideosPool(){ return (g.ContentAPI && g.ContentAPI.getAllVideos) ? g.ContentAPI.getAllVideos() : getFromGlobal('PREMIUM_VIDEOS') }
  function createCard(item,opt){
    item=ensureObj(item); opt=opt||{};
    var card=document.createElement('div'); card.className='card is-locked';
    var a=document.createElement('a'); a.href='#';
    var fig=document.createElement('div'); fig.className='thumb';
    if((opt.type||item.type)==='video'){ var v=document.createElement('video'); v.muted=true; v.playsInline=true; v.src=item.thumb||item.url; v.className='blur'; fig.appendChild(v); }
    else{ var img=document.createElement('img'); img.loading='lazy'; img.src=item.thumb||item.url; img.className='blur'; fig.appendChild(img); }
    a.appendChild(fig); card.appendChild(a);
    return card;
  }
  g.UCAPI={ dailyShuffle, getFullPool, getPremiumImagesPool, getPremiumVideosPool, createCard };
})(window);
