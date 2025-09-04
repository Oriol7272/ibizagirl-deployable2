import { mountHeader } from './pages-common.js_DISABLED;
import { initHome } from './pages/home.js_DISABLED;
import { initPremium } from './pages/premium.js_DISABLED?v=1756068653;
import { initVideos } from './pages/videos.js_DISABLED;
import { initSubscription } from './pages/subscription.js_DISABLED;
import { initAds } from './ad-loader.js_DISABLED;
import { initCrisp } from './integrations.js_DISABLED;

(async ()=>{
  const path = location.pathname.replace(/\/+$/,'') || '/index.html';
  mountHeader();
  if(path.endsWith('/index.html')) await initHome();
  else if(path.endsWith('/premium.html')) await initPremium();
  else if(path.endsWith('/videos.html')) await initVideos();
  else if(path.endsWith('/subscription.html')) await initSubscription();

  initCrisp();
  initAds({
    left: document.getElementById('ad-left'),
    right: document.getElementById('ad-right'),
    inline: document.getElementById('ad-inline')
  });
})();
