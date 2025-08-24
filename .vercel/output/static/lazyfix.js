(function(){ document.addEventListener('DOMContentLoaded', ()=> {
  document.querySelectorAll('img:not([loading])').forEach(img=> img.setAttribute('loading','lazy'));
});})();
