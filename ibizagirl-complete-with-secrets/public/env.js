// expose selected env vars to browser (safe ones only)
window.__env = {
  PUBLIC_GA_ID: (typeof PUBLIC_GA_ID!=='undefined'? PUBLIC_GA_ID : undefined),
  PUBLIC_ADS_NETWORK: (typeof PUBLIC_ADS_NETWORK!=='undefined'? PUBLIC_ADS_NETWORK : undefined),
  PUBLIC_ADS_ZONE_ID: (typeof PUBLIC_ADS_ZONE_ID!=='undefined'? PUBLIC_ADS_ZONE_ID : undefined)
};
