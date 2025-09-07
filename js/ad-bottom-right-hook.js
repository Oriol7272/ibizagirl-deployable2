(function(){
  var target=document.getElementById('ad-bottom-right')||document.querySelector('#ad-bottom-right, .ad-bottom-right');
  var wrap=document.getElementById('ibg-fixed-bottom-right');
  if(!wrap||!target) return;
  if(target.parentElement!==wrap){ wrap.appendChild(target); }
  var s=wrap.style; s.position='fixed'; s.right='0'; s.bottom='0'; s.zIndex='2147483000'; s.pointerEvents='none';
  Array.from(wrap.children).forEach(function(el){ el.style.pointerEvents='auto'; });
})();
