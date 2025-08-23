(function(){
  const k='ab_variant_v1';
  let v=localStorage.getItem(k);
  if(!v){ v=(Math.random()<.5?'A':'B'); localStorage.setItem(k,v); }
  window.AB_VARIANT=v;
  console.log('[AB]', v);
})();
export function abLabel(){ return window.AB_VARIANT||'A'; }
