document.addEventListener("DOMContentLoaded",()=>{
  const pool=UCAPI.getFullPool().map(x=>({ ...x, type:"image" }));
  const items=UCAPI.pickN(UCAPI.dailyShuffle(pool,"home"),20);
  // Carrusel horizontal
  const track=document.getElementById("carousel-track");
  track.innerHTML="";
  items.forEach(it=>{
    const card=UCAPI.createCard({item:it,kind:"image",price:"",showPaypalBtn:false});
    const slide=document.createElement("div"); slide.className="slide"; slide.appendChild(card);
    track.appendChild(slide);
  });
});
