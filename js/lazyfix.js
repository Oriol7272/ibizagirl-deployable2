(function(){
  function markLoaded(img){
    try{ img.classList.add("loaded"); var c=img.closest(".card, .item, .thumb"); if(c) c.classList.add("loaded"); }catch(e){}
  }
  document.addEventListener("DOMContentLoaded", function(){
    var imgs=document.querySelectorAll("img[data-src], img.lazy, img");
    imgs.forEach(function(img){
      if(img.complete){ markLoaded(img); }
      img.addEventListener("load", function(){ markLoaded(img); });
      img.addEventListener("error", function(){ img.classList.add("error"); });
    });
  });
})();
