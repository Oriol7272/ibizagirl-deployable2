(function(W,D){
  // Espera a que decorative-manifest.js defina window.DECORATIVE_IMAGES
  function start(){
    const list = (W.DECORATIVE_IMAGES||[]).filter(Boolean);
    if(!list.length) return console.warn('Sin imágenes decorativas para rotar');
    const el = D.getElementById('banner');
    let i=0;
    function tick(){
      el.style.backgroundImage = `url(${list[i%list.length]})`;
      i++;
      setTimeout(tick, 4000);
    }
    tick();
  }
  if(document.readyState==='complete' || document.readyState==='interactive') start();
  else D.addEventListener('DOMContentLoaded', start);
})(window,document);
