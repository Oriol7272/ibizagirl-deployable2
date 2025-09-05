(function(){
  if(window.__IBG_ADS_DEBUG_APPLIED) return; window.__IBG_ADS_DEBUG_APPLIED=1;
  var css = document.createElement('style');
  css.id = 'ads-debug-css';
  css.textContent = `
    .ad-slot-debug{outline:1px dashed rgba(0,0,0,.25); position:relative}
    .ad-slot-debug::after{
      content: attr(data-name) " (" attr(data-zone) ")";
      position:absolute; top:0; left:0; font:11px/1.6 monospace;
      background:rgba(0,0,0,.55); color:#fff; padding:2px 6px; border-bottom-right-radius:6px;
    }
  `;
  document.head.appendChild(css);
  function mark(id, name, zone){
    var el = document.getElementById(id);
    if(!el) return;
    el.classList.add('ad-slot-debug');
    el.setAttribute('data-name', name||id);
    if(zone) el.setAttribute('data-zone', zone);
  }
  window.__IBG_markAd = mark;
})();
