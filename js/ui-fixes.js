(function(){
  const hidePlaceholders = () => {
    document.querySelectorAll('[style*="background-image"]').forEach(node => {
      if (node.classList.contains('thumb-ready')) return;
      node.classList.add('thumb-ready');
      for (const el of node.childNodes) {
        if (el.nodeType === 3 && /Cargando/i.test(el.textContent||'')) { el.textContent = ''; }
      }
      node.querySelectorAll('*').forEach(c=>{
        if (/Cargando/i.test((c.textContent||''))) c.textContent='';
      });
    });
  };
  hidePlaceholders();
  document.addEventListener('DOMContentLoaded', hidePlaceholders);
  const obs = new MutationObserver(hidePlaceholders);
  obs.observe(document.documentElement, { childList:true, subtree:true, attributes:true, attributeFilter:['style','class'] });
})();
