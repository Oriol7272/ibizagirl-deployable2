(function () {
  function injectPlaceholders() {
    document.querySelectorAll('[data-item-id]').forEach(function (card) {
      if (card.querySelector('.mini-buy')) return;
      var box = document.createElement('div');
      box.className = 'mini-buy';
      card.appendChild(box);
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    injectPlaceholders();
    Payments.init('capture');
  });
})();
