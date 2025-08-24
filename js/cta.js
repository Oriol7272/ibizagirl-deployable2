(function(){
  if(document.getElementById('ibg-cta')) return;
  const bar = document.createElement('div');
  bar.id='ibg-cta';
  bar.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:14px;z-index:6;background:#0b5ed7;color:#fff;padding:10px 14px;border-radius:999px;box-shadow:0 8px 22px rgba(0,0,0,.25);font-weight:600;display:flex;gap:10px;align-items:center';
  bar.innerHTML = '<span>Acceso premium sin anuncios</span><button id="ibg-cta-btn" style="background:#fff;color:#0b5ed7;border:0;border-radius:999px;padding:8px 12px;font-weight:700;cursor:pointer">Ver opciones</button>';
  document.body.appendChild(bar);
  document.getElementById('ibg-cta-btn')?.addEventListener('click',()=>location.href="/subscription.html");
})();
