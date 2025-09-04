(function(){
  const log = (...a)=>console.log("[PUBLIC-SCAN]", ...a);
  async function scan(){
    try{
      const res = await fetch("content-data2.js", {cache:"no-store"});
      const txt = await res.text();
      // Extrae "/full/xxxx.(jpg|jpeg|png|webp|gif)" entre comillas simples, dobles o backticks
      const rx = /["'`](\/[^"'`]*\/full\/[^"'`]+\.(?:jpg|jpeg|png|webp|gif))["'`]/ig;
      const set = new Set(); let m;
      while((m = rx.exec(txt))){ set.add(m[1]); }
      const arr = Array.from(set);
      if(arr.length){
        window.CONTENT_PUBLIC = arr;
        window.CONTENT_PUBLIC_IMAGES = arr;
        log("extraidas", arr.length, "rutas desde content-data2.js");
      }else{
        log("no se encontraron rutas /full/ en content-data2.js");
      }
    }catch(e){ console.warn("[PUBLIC-SCAN] error", e); }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", scan);
  else scan();
})();
