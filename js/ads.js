import {abLabel} from './ab.js';

function zone(network){ 
  const E=window.__ENV||{};
  const map={ exo:E.EXO_ZONE_ID, juicy:E.JUICY_ZONE_ID, ero:E.EROA_ZONE_ID };
  return map[network];
}

export function mountSideAds(){
  const v=abLabel(); // A o B
  const left = document.getElementById('sb-left');
  const right= document.getElementById('sb-right');
  if(!left||!right) return;
  const order = (v==='A')? ['juicy','exo','ero'] : ['exo','juicy','ero'];
  [left,right].forEach((col)=>{
    col.querySelectorAll('.ad-slot').forEach((slot,i)=>{
      const net = order[i % order.length];
      slot.setAttribute('data-network', net);
      slot.setAttribute('data-zone', zone(net)||'');
    });
  });
  // si usas un provider global, lo llamas aquí
  if(window.mountAdProvider) window.mountAdProvider();
}
