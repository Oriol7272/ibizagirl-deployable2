(function(){
  function ensureButton(node, price, desc){
    var host=node.querySelector(".mini-buy");
    if(!host){ host=document.createElement("div"); host.className="mini-buy"; node.appendChild(host); }
    Payments.renderOrder(host,{ value:price, description:desc });
  }
  function detectType(node){
    if(node.querySelector("video")) return "video";
    return "image";
  }
  document.addEventListener("DOMContentLoaded", function(){
    var cards=document.querySelectorAll('[data-item-id]');
    cards.forEach(function(card){
      var t=detectType(card);
      if(t==="video"){ ensureButton(card, 0.30, "Compra vídeo IbizaGirl"); }
      else{ ensureButton(card, 0.10, "Compra imagen IbizaGirl"); }
    });
  });
})();
