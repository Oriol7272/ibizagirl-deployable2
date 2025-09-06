document.addEventListener("DOMContentLoaded",()=>{
  const pool=UCAPI.getPremiumVideosPool().map(x=>({ ...x, type:"video" }));
  const items=UCAPI.pickN(UCAPI.dailyShuffle(pool,"videos"),20);
  const grid=document.getElementById("grid-videos"); grid.innerHTML="";
  items.forEach(it=>{
    const card=UCAPI.createCard({item:it,kind:"video",price:"0,30 €",showPaypalBtn:true});
    grid.appendChild(card);
  });
});
