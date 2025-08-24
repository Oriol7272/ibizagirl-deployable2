/* Stub that maps unified pools for older references */
(function(){
  window.FULL_POOL = window.FULL_POOL || window.FULL_IMAGES_POOL || [];
  var p1 = window.PREMIUM_IMAGES_PART1 || [];
  var p2 = window.PREMIUM_IMAGES_PART2 || [];
  window.PREMIUM_POOL = window.PREMIUM_POOL || (p1.concat(p2));
  window.VIDEO_POOL = window.VIDEO_POOL || window.PREMIUM_VIDEOS_POOL || [];
})();
