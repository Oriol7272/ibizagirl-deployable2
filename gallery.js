console.log("[gallery] render (shim)");
(function(W){
  function pickN(arr,n){ return arr.slice(0, n); }
  function draw(){
    var pool = W.__IBG_PUBLIC_POOL || [];
    var list = pickN(pool, 40);
    var root = document.getElementById("gallery");
    if(!root){ return; }
    root.innerHTML = "";
    list.forEach(function(name){
      var it = document.createElement("div");
      it.className = "item";
      var img = document.createElement("img");
      img.loading = "lazy";
      img.src = "/full/" + name;
      it.appendChild(img);
      root.appendChild(it);
    });
    console.log("[gallery] render", list.length);
  }
  document.addEventListener('DOMContentLoaded', draw);
  document.addEventListener('ibg:public-ready', draw, {once:true});
})(window);
