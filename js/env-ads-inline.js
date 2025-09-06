(function(){
  var base = (window.__ENV || {});
  window.__ENV = Object.assign({}, base, {
    EXOCLICK_ZONE: "5696328",
    EXOCLICK_BOTTOM_ZONE: "5717078",
    POPADS_SITE_ID: "5226758",
    ERO_SPACE_ID: "8182057",
    ERO_PID: "152716",
    ERO_CTRL_ID: "798544",
    EROADVERTISING_ENABLE: "1"
  });
  // Debug corto:
  console.log("IBG_ADS ZONES ->", {
    EXO: window.__ENV.EXOCLICK_ZONE,
    POP: window.__ENV.POPADS_SITE_ID,
    BOTTOM: window.__ENV.EXOCLICK_BOTTOM_ZONE,
    ERO: {space: window.__ENV.ERO_SPACE_ID, pid: window.__ENV.ERO_PID, ctrl: window.__ENV.ERO_CTRL_ID, en: window.__ENV.EROADVERTISING_ENABLE}
  });
})();
