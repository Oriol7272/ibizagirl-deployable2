console.log("[carousel] shim loaded");
(function(W){
  function start(){
    var pool=W.__IBG_PUBLIC_POOL||[];
    if(!pool.length) return;
    var idx=0, root=document.getElementById("carousel");
    if(!root) return;
    root.innerHTML = '<div class="frame"><img id="carimg" alt=""></div><div class="nav"><button class="btn" id="prev">‹</button><button class="btn" id="next">›</button></div>';
    var img = root.querySelector("#carimg");
    function show(){ img.src="/full/"+pool[idx]; }
    root.querySelector("#prev").onclick = function(){ idx=(idx-1+pool.length)%pool.length; show(); };
    root.querySelector("#next").onclick = function(){ idx=(idx+1)%pool.length; show(); };
    show();
  }
  document.addEventListener('DOMContentLoaded', start);
  document.addEventListener('ibg:public-ready', start, {once:true});
})(window);
