document.addEventListener("DOMContentLoaded",()=>{
  const pool=UCAPI.getPremiumVideosPool();
  const shuffled=UCAPI.dailyShuffle(pool,"videos");
  const items=UCAPI.pickN(shuffled,20);
  UCAPI.renderCards({container:"#grid-videos",items, type="video", markNew:0.15, price:"0,30 €", paypalBadge:true});
  console.log("Videos:", "pool", pool.length, "| render", items.length);
});
