document.addEventListener('DOMContentLoaded', function () {
  if (window.Payments && typeof window.Payments.init === 'function') {
    window.Payments.init();
  }
});
