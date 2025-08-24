(function(){
  function nukeLoadingText(root=document){
    root.querySelectorAll('.card,.item').forEach(card=>{
      const hasBg = card.matches('[style*="background-image"]') ||
                    !!card.querySelector('[style*="background-image"]');
      if(!hasBg) return;
      card.querySelectorAll('*').forEach(el=>{
        if (/(Cargando)|(Loading)/i.test(el.textContent||'')) el.textContent='';
      });
    });
  }
  nukeLoadingText();
  const mo=new MutationObserver(()=>nukeLoadingText());
  mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['style','class']});
})();
