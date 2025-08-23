document.addEventListener("DOMContentLoaded",()=>{
  const pool=UCAPI.getPremiumImagesPool().map(x=>({ ...x, type:"image" }));
  // marca ~30% como nuevos
  const shuffled=UCAPI.dailyShuffle(pool,"premium");
  const take=shuffled.slice(0,100).map((it,i)=>({...it,newTag:Math.random()<0.30}));
  const grid=document.getElementById("grid-premium"); grid.innerHTML="";
  take.forEach(it=>{
    const card=UCAPI.createCard({item:it,kind:"image",price:"0,10 €",showPaypalBtn:true});
    grid.appendChild(card);
  });
});
