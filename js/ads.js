// Ads system - fixed
window.BG_ADS = {
    ready: true,
    initAds: function() {
        console.log("Ads system initialized");
        return true;
    },
    loadAd: function(type) {
        console.log("Loading ad: " + type);
    }
};
