(function(){
  try{
    if (localStorage.getItem("IBG_SW_KILLED")) return;
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(rs){
        rs.forEach(function(r){ r.unregister(); });
        if (window.caches) { caches.keys().then(function(keys){ keys.forEach(function(k){ caches.delete(k); }); }); }
        setTimeout(function(){
          try{ localStorage.setItem("IBG_SW_KILLED","1"); }catch(e){}
          location.reload();
        }, 50);
      });
    }
  }catch(e){}
})();
