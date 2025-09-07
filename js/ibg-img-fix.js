(function(){
  var BASE="https://ibizagirl-assets.s3.eu-north-1.amazonaws.com";
  function fix(u){
    if(!u) return u;
    if(/^https?:\/\//i.test(u)) return u;
    if(u.startsWith('/full/')) return BASE+u;
    if(/\.(webp|jpe?g|png|gif)(\?.*)?$/i.test(u)) return BASE+'/full/'+u.replace(/^\/+/,'');
    return u;
  }
  function patch(n){ n.querySelectorAll && n.querySelectorAll('img').forEach(function(img){ var f=fix(img.getAttribute('src')); if(f && f!==img.src) img.src=f; }); }
  var mo=new MutationObserver(function(m){ m.forEach(function(rec){ rec.addedNodes && rec.addedNodes.forEach(patch); }); });
  if(document.readyState!=='loading'){ patch(document); mo.observe(document.documentElement,{subtree:true,childList:true}); }
  else document.addEventListener('DOMContentLoaded', function(){ patch(document); mo.observe(document.documentElement,{subtree:true,childList:true}); });
})();
