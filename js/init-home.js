document.addEventListener("DOMContentLoaded",()=>{
  const pool=UCAPI.getFullPool();
  const shuffled=UCAPI.dailyShuffle(pool,"home");
  const items=UCAPI.pickN(shuffled,20);
  UCAPI.renderCards({container:"#grid-home",items, type="image", markNew:0, price:"", paypalBadge:false});
  console.log("Home FULL:", "pool", pool.length, "| render", items.length);
});
