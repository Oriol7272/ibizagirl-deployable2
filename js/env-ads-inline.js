(function(){
  // Valores inyectados desde documentación del proyecto (no secretos)
  var CONF = {
    PAYPAL_CLIENT_ID: "AfQEdiielw5fm3wF08p9pcxwqR3gPz82YRNUTKY4A8WNG9AktiGsDNyr2i7BsjVzSwwpeCwR7Tt7DPq5",
    PAYPAL_PLAN_MONTHLY_1499: "P-3WE8037612641383DNCUKNJI",
    PAYPAL_PLAN_ANNUAL_4999:  "P-43K261214Y571983RNCUKN7I",
    CRISP_WEBSITE_ID: "59e184b1-e679-4c93-b3ea-d60b63c1c04c",
    // Ads
    EXOCLICK_ZONE: "5696328",
    EXOCLICK_BOTTOM_ZONE: "5717078",
    EXOCLICK_ZONES: "5696328,5705186",
    JUICYADS_ZONE: "1099637",
    EROADVERTISING_ZONE: "8177575",
    EROADVERTISING_SPACE: "8182057",
    EROADVERTISING_PID: "152716",
    EROADVERTISING_CTRL: "798544",
    POPADS_ENABLE: "1",
    POPADS_SITE_ID: "5226758",
    POPADS_SITE_HASH: "e494ffb82839a29122608e933394c091"
  };
  // Exponer objetos globales
  window.IBG_CONF = {
    paypal: {
      clientId: CONF.PAYPAL_CLIENT_ID,
      planMonthly1499: CONF.PAYPAL_PLAN_MONTHLY_1499,
      planAnnual4999: CONF.PAYPAL_PLAN_ANNUAL_4999
    },
    crisp: { websiteId: CONF.CRISP_WEBSITE_ID }
  };
  window.IBG_ADS = {
    exoclick: {
      zone: CONF.EXOCLICK_ZONE,
      bottomZone: CONF.EXOCLICK_BOTTOM_ZONE,
      zones: (CONF.EXOCLICK_ZONES||"").split(',').map(s=>s.trim()).filter(Boolean)
    },
    juicyads: { zone: CONF.JUICYADS_ZONE },
    eroadvertising: {
      zone: CONF.EROADVERTISING_ZONE,
      space: CONF.EROADVERTISING_SPACE,
      pid: CONF.EROADVERTISING_PID,
      ctrl: CONF.EROADVERTISING_CTRL
    },
    popads: {
      enabled: CONF.POPADS_ENABLE==="1" || CONF.POPADS_ENABLE==="true",
      siteId: CONF.POPADS_SITE_ID,
      siteHash: CONF.POPADS_SITE_HASH
    }
  };
  try{ console.info("IBG_ADS ZONES ->", window.IBG_ADS.exoclick.zones); }catch(_){}
})();
