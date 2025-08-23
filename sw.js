self.addEventListener('install', e=>{
  e.waitUntil((async()=>{
    const cache=await caches.open('ibiza-v1');
    await cache.addAll(['/','/index.html','/premium.html','/videos.html','/subscription.html','/css/site.css','/manifest.webmanifest']);
  })());
  self.skipWaiting();
});
self.addEventListener('activate', e=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e=>{
  e.respondWith((async()=>{
    try{ return await fetch(e.request); }
    catch(_){ const c=await caches.open('ibiza-v1'); const r=await c.match(e.request,{ignoreSearch:true}); return r||Response.error(); }
  })());
});
