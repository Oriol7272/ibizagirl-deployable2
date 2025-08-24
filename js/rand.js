(function(g){
  function xorshift32(seed){ let x=seed|0; return ()=>{ x^=x<<13; x^=x>>>17; x^=x<<5; return (x>>>0)/4294967296; }; }
  function seedFrom(dateStr){ let h=0; for(const c of dateStr) h=(h*31 + c.charCodeAt(0))|0; return Math.abs(h)||123456; }
  function pickN(arr,n,rand){ const a=[...arr]; const out=[]; for(let i=0;i<n && a.length;i++){ const idx=Math.floor(rand()*a.length); out.push(a.splice(idx,1)[0]); } return out; }
  g.RNG = { xorshift32, seedFrom, pickN };
})(window);
