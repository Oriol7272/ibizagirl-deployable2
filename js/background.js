import {seedToday} from './utils.js';
(function(){
  const imgs=(window.DECOR_IMAGES||[]).filter(x=>/\.(png|jpe?g|webp|svg)$/i.test(x));
  if(!imgs.length) return;
  const seed=seedToday(); let i=seed%imgs.length;
  const apply=()=>{ document.body.style.backgroundImage='url("'+imgs[i%imgs.length]+'")'; i++; };
  apply(); setInterval(apply, 12000);
})();
