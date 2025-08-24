function guessFullPool(){
  const vals=Object.values(window);
  for(const v of vals){ if(Array.isArray(v)&&v.length>10&&v.every(x=>typeof x==='string'&&x.includes('/full/'))) return v; }
  for(const v of vals){ if(v&&Array.isArray(v.items)&&v.items.every(x=>typeof x==='string'&&x.includes('/full/'))) return v.items; }
  return [];
}
function pickN(a,n){const x=a.slice(); for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [x[i],x[j]]=[x[j],x[i]]} return x.slice(0,Math.min(n,x.length));}
function mountCarousel(){
  const wrap=document.querySelector('#home-carousel .track'); if(!wrap) return;
  const pool=guessFullPool(); if(!pool.length){console.warn('No pool /full/'); return;}
  const imgs=pickN(pool,20); wrap.innerHTML='';
  imgs.forEach(src=>{const d=document.createElement('div'); d.className='slide'; const img=document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.src=src; d.appendChild(img); wrap.appendChild(d);});
  let idx=0; setInterval(()=>{const sl=wrap.children.length; if(!sl) return; idx=(idx+1)%sl; const w=wrap.children[0].getBoundingClientRect().width + parseFloat(getComputedStyle(wrap).gap||'16'); wrap.style.transform=`translateX(${-idx*w}px)`;},1000);
}
document.addEventListener('DOMContentLoaded',mountCarousel);
