(function(W){
  function daySeed(){var d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate()}
  function mulberry32(a){return function(){var t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
  function seededShuffle(arr,seed){var r=mulberry32(seed>>>0),a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function pickN(arr,n,seed){return seededShuffle(arr,seed).slice(0,n)}
  function asItem(base,it){
    if(typeof it==='string'){return {src:(base||'')+it,title:it}}
    if(it&&typeof it==='object'){
      var s=it.src||it.path||it.url||it.file||it.filename||it.name||""; 
      if(s && !/^https?:\/\//.test(s) && !s.startsWith('/')) s=(base||'')+s;
      return {src:s,title:it.title||it.name||s.split('/').pop()}
    }
    return null
  }
  W.IBG_UTILS={daySeed,seededShuffle,pickN,asItem};
})(window);
