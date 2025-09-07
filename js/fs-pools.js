(function(W,D){
  console.log("[fs-pools] start");
  var ev=new Event("IBG_POOLS_READY");
  try{ D.dispatchEvent(ev);}catch(e){}
})(window,document);
