document.addEventListener('DOMContentLoaded', function () {
  var cards = document.querySelectorAll('.card');
  cards.forEach(function (c) {
    if (!c.querySelector('.mini-buy')) {
      var d = document.createElement('div');
      d.className = 'mini-buy';
      c.appendChild(d);
    }
  });
  if (window.Payments && typeof window.Payments.renderMiniBuy === 'function') {
    window.Payments.renderMiniBuy({ selector: '.mini-buy', price: 0.30, description: 'Compra vídeo IbizaGirl' });
  }
});
