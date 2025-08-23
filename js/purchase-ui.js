export function wirePurchases(){
  // Cierra modal
  const close = document.getElementById('paypal-modal-close');
  if(close){ close.onclick = ()=>{ const m=document.getElementById('paypal-modal'); if(m) m.classList.add('hidden'); }; }

  // Delegación para tarjetas (foto/video)
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.buy-btn');
    if(!btn) return;
    e.preventDefault();
    const m=document.getElementById('paypal-modal'); if(m) m.classList.remove('hidden');
    const id=btn.dataset.id, kind=btn.dataset.kind||'photo';
    import('./payments.js').then(p=>p.buyItem(id, kind)).catch(console.error);
  });

  // Suscripciones en página subscription
  const month=document.getElementById('buy-monthly');
  if(month){ month.addEventListener('click', ()=>{ const m=document.getElementById('paypal-modal'); if(m) m.classList.remove('hidden'); import('./payments.js').then(p=>p.subscribe('monthly')); }); }
  const year=document.getElementById('buy-yearly');
  if(year){ year.addEventListener('click', ()=>{ const m=document.getElementById('paypal-modal'); if(m) m.classList.remove('hidden'); import('./payments.js').then(p=>p.subscribe('yearly')); }); }
}
