(function(W){
  function fill(id, label){
    var el=document.getElementById(id); if(!el) return;
    var box=document.createElement('div'); box.className='box';
    box.innerHTML='<div style="text-align:center"><div style="font-weight:800;margin-bottom:6px">'+label+'</div><div style="font-size:12px;opacity:.8">Desactiva AdBlock para ver anuncios</div></div>';
    el.innerHTML=''; el.appendChild(box);
  }
  function initAds(){
    fill('ad-left','Publicidad');
    fill('ad-right','Publicidad');
    var b=document.getElementById('ad-bottom');
    if(b){ b.innerHTML='<div class="ad-bottom">Espacio publicitario</div>'; }
  }
  W.IBG_ADS={initAds};
})(window);
