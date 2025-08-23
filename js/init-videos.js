(function(){
  // Inserta botón PayPal bajo cada tarjeta de vídeo
  document.querySelectorAll('.video-card, .card, .item').forEach(card=>{
    if (card.querySelector('.mini-buy')) return;
    const holder = document.createElement('div');
    holder.className = 'mini-buy';
    card.appendChild(holder);
  });
  window.Payments.renderMiniBuy('.mini-buy', { price: 0.30, description: 'Vídeo IbizaGirl' });
})();
