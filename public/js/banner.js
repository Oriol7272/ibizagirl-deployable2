(function(g){
  function qs(s){ return document.querySelector(s); }
  function mount(list){
    var root=qs('#top-banner'); if(!root||!list||!list.length) return;
    root.innerHTML='';
    var idx=0, slides=[];
    list.forEach(function(src,i){
      var div=document.createElement('div'); div.className='slide'+(i===0?' active':'');
      var img=document.createElement('img'); img.loading='eager'; img.src=src;
      var cap=document.createElement('div'); cap.className='caption'; cap.textContent='IbizaGirl.pics';
      div.appendChild(img); div.appendChild(cap); root.appendChild(div); slides.push(div);
    });
    setInterval(function(){
      slides[idx].classList.remove('active');
      idx=(idx+1)%slides.length;
      slides[idx].classList.add('active');
    }, 4500);
  }
  function init(){
    fetch('/assets/decoracion./list.json',{cache:'no-store'})
      .then(function(r){ return r.json(); })
      .then(function(arr){ if(Array.isArray(arr) && arr.length){ mount(arr); }})
      .catch(function(){});
  }
  document.addEventListener('DOMContentLoaded', init);
})(window);
