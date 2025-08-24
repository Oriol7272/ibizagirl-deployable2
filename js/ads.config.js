window.AdsConfig = window.AdsConfig || {
  exoclick: { zoneId: (window.__ENV && window.__ENV.EXOCLICK_ZONE) || "" },
  juicyads: { adzone: (window.__ENV && window.__ENV.JUICYADS_ZONE) || "" },
  eroad:    { zoneId: (window.__ENV && window.__ENV.EROADVERTISING_ZONE) || "" },
  popads:   { siteId: (window.__ENV && window.__ENV.POPADS_SITE_ID) || "" }
};
