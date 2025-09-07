console.log("[gallery] render (stub) 40");
(function(W){
  function pickN(a,n){ return Array.isArray(a)?a.slice(0,n):[]; }
  function draw(){
    var pool=W.__IBG_PUBLIC_POOL||[]; var list=pickN(pool,40);
    var root=document.getElementById("gallery"); if(!root) return;
    root.innerHTML=""; list.forEach(function(nm){ var d=document.createElement("div"); d.className="item";
      var img=document.createElement("img"); img.loading="lazy"; img.src="/full/"+nm; d.appendChild(img); root.appendChild(d); });
  }
  document.addEventListener('DOMContentLoaded',draw);
})(window);
