document.addEventListener('DOMContentLoaded', function(){
  if (!window.Payments) return;
  Payments.renderSubscriptions({});
  Payments.renderLifetime({});
});
