(function(){
  if(!window.DECORATIVE_IMAGES || !DECORATIVE_IMAGES.length) return;
  var font = DECORATIVE_IMAGES.find(function(p){return /\.(woff2|otf|ttf)$/i.test(p);});
  if(!font) return;
  var s = document.createElement('style');
  s.textContent = "@font-face{font-family:'IbizaFont';src:url('"+font+"');font-display:swap}";
  document.head.appendChild(s);
})();
