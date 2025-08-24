(function(){
  function onReady(fn){ document.readyState==='loading' ? document.addEventListener('DOMContentLoaded', fn) : fn(); }
  onReady(()=>{
    if(document.getElementById('home-carousel') || /index\.html?$/.test(location.pathname)){
      window.IBGStore && window.IBGStore.renderHome();
    }
    if(document.getElementById('premium-grid')) window.IBGStore && window.IBGStore.renderPremium();
    if(document.getElementById('videos-grid'))  window.IBGStore && window.IBGStore.renderVideos();

    const btnM = document.getElementById('pp-monthly');
    const btnA = document.getElementById('pp-annual');
    const btnL = document.getElementById('pp-lifetime');
    if(btnM) btnM.addEventListener('click', ()=> window.IBGPay && window.IBGPay.subscribeMonthly());
    if(btnA) btnA.addEventListener('click', ()=> window.IBGPay && window.IBGPay.subscribeAnnual());
    if(btnL) btnL.addEventListener('click', ()=> window.IBGPay && window.IBGPay.buyLifetime());
  });
})();
