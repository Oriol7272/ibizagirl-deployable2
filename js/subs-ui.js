import {subscribe,buyLifetime} from './payments.js';

function ppMark(){
  const img=document.createElement('img');
  img.src='https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg';
  img.alt='PayPal'; img.style.height='18px';
  return img;
}
document.addEventListener('DOMContentLoaded',()=>{
  const m=document.getElementById('btn-monthly');
  const y=document.getElementById('btn-yearly');
  const l=document.getElementById('btn-lifetime');
  if(m){ m.innerHTML='&nbsp;'; m.appendChild(ppMark()); m.onclick=()=>subscribe('monthly'); }
  if(y){ y.innerHTML='&nbsp;'; y.appendChild(ppMark()); y.onclick=()=>subscribe('yearly'); }
  if(l){ l.innerHTML='Comprar'; l.onclick=()=>buyLifetime(); }
});
