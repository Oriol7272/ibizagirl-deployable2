document.addEventListener("DOMContentLoaded",function(){
  var exo = window.ENV && window.ENV.EXOCLICK_ZONE;
  var jzy = window.ENV && window.ENV.JUICYADS_ZONE;
  var ero = window.ENV && window.ENV.EROADVERTISING_ZONE;
  var pop = window.ENV && window.ENV.POPADS_SITE_ID;

  if (exo && document.getElementById("ads-exoclick")) {
    document.getElementById("ads-exoclick").innerHTML =
      '<script src="https://a.exoclick.com/tag.php?zoneid='+exo+'"></'+'script>';
  }
  if (jzy && document.getElementById("ads-juicyads")) {
    document.getElementById("ads-juicyads").innerHTML =
      '<iframe border="0" frameborder="0" marginheight="0" marginwidth="0" scrolling="no" width="300" height="250" src="https://adserver.juicyads.com/adshow.php?adzone='+jzy+'"></iframe>';
  }
  if (ero && document.getElementById("ads-ero")) {
    document.getElementById("ads-ero").innerHTML =
      '<script src="https://ads.ero-advertising.com/'+ero+'/invoke.js"></'+'script>';
  }
  if (pop && document.getElementById("ads-popads")) {
    document.getElementById("ads-popads").innerHTML =
      '<script src="https://www.popads.net/pop.js"></'+'script>';
  }
});
