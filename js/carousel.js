// Auto-rotación para #home-carousel (usa /full/)
function sample(arr,n){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]} return a.slice(0,n); }
function imgUrl(name){ return name.startsWith('/full/')? name : '/full/'+name; }

document.addEventListener('DOMContentLoaded', ()=>{
  const root=document.getElementById('home-carousel');
  if(!root) return;
  const row=document.createElement('div'); row.className='carousel-row'; root.appendChild(row);

  const pool = (window.FULL_IMAGES_POOL && Array.isArray(window.FULL_IMAGES_POOL)) ? window.FULL_IMAGES_POOL : [];
  const pick = sample(pool, 20);
  pick.forEach(name=>{
    const d=document.createElement('div'); d.className='carousel-item';
    const im=document.createElement('img'); im.loading='lazy'; im.src=imgUrl(name);
    d.appendChild(im); row.appendChild(d);
  });

  let idx=0;
  const tick=()=>{
    const first=row.querySelector('.carousel-item'); if(!first) return;
    const w=first.getBoundingClientRect().width + 8; // +gap
    row.scrollTo({left: ++idx*w, behavior:'smooth'});
    if(idx>=pick.length-3){ idx=0; setTimeout(()=>row.scrollTo({left:0,behavior:'instant'}), 950); }
  };
  setInterval(tick, 1000);
});
