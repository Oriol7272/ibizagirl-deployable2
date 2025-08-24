(function(){
  try{
    if('caches' in window && caches.keys){caches.keys().then(keys=>keys.forEach(k=>caches.delete(k)))}
    if('serviceWorker' in navigator){
      navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister()))
    }
  }catch(e){}
})();
