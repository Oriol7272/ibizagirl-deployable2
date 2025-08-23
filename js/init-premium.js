document.addEventListener("DOMContentLoaded",()=>{
  const pool=UCAPI.getPremiumImagesPool();
  const shuffled=UCAPI.dailyShuffle(pool,"premium");
  const items=UCAPI.pickN(shuffled,20);
  UCAPI.renderCards({container:"#grid-premium",items, type="image", markNew:0.3, price:"", paypalBadge:false});
  console.log("Premium IMGs:", "pool", pool.length, "| render", items.length);
});
