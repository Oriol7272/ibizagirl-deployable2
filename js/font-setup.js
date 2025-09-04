(function(){
  function tryLoad(){
    var list = (window.DECORATIVE_IMAGES||[]);
    var font = list.find(function(p){return /Sexy\s*Beachy\.(otf|ttf|woff2)$/i.test(p);});
    if(!font) return;
    var s = document.createElement('style');
    s.textContent = "@font-face{font-family:'IbizaFont';src:url('"+font+"');font-display:swap}";
    document.head.appendChild(s);
  }
  if(document.readyState==='complete'){ tryLoad(); } else {
    window.addEventListener('load', tryLoad);
  }
})();
