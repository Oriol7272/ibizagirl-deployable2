(function(w,d){
  const cfg = w.SITE_CONFIG || {};
  // ExoClick
  if (cfg.ADS && cfg.ADS.exoclickZoneId) {
    const s=d.createElement('script'); s.async=true;
    s.src='https://a.exoclick.com/tag.php?zoneid='+encodeURIComponent(cfg.ADS.exoclickZoneId);
    d.body.appendChild(s);
  }
  // JuicyAds
  if (cfg.ADS && cfg.ADS.juicyadsSiteId) {
    const s=d.createElement('script'); s.async=true;
    s.src='https://js.juicyads.com/jp.php?site='+encodeURIComponent(cfg.ADS.juicyadsSiteId);
    d.body.appendChild(s);
  }
  // EroAdvertising
  if (cfg.ADS && cfg.ADS.eroPubId) {
    const s=d.createElement('script'); s.async=true;
    s.src='https://ero-advertising.com/banner.php?pub='+encodeURIComponent(cfg.ADS.eroPubId);
    d.body.appendChild(s);
  }
  // PopAds
  if (cfg.ADS && cfg.ADS.popadsSiteId) {
    const s=d.createElement('script'); s.async=true;
    s.src='//c.popads.net/pop.js';
    s.onload = function(){ try{ popns(cfg.ADS.popadsSiteId); }catch(_){} };
    d.body.appendChild(s);
  }
  // CRISP
  if (cfg.CRISP_WEBSITE_ID) {
    w.$crisp=[]; w.CRISP_WEBSITE_ID=cfg.CRISP_WEBSITE_ID;
    const s=d.createElement('script'); s.src='https://client.crisp.chat/l.js'; s.async=1; d.head.appendChild(s);
  }
})(window,document);
