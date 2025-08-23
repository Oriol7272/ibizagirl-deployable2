document.addEventListener('DOMContentLoaded', function(){
  if (!window.Payments) return;
  document.querySelectorAll('.video-card').forEach(function(card){
    if(!card.querySelector('.mini-buy')){
      var div = document.createElement('div'); div.className='mini-buy';
      card.appendChild(div);
    }
  });
  Payments.renderMiniBuy({});
});
