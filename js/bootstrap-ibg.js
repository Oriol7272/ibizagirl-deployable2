import { mountHeader } from './pages-common.js';
import { initHome } from './pages/home.js';
import { initPremium } from './pages/premium.js';
import { initVideos } from './pages/videos.js';
import { initSubscription } from './pages/subscription.js';
import { initAds } from './ad-loader.js';
import { initCrisp } from './integrations.js';

(async ()=>{
  const path = (location.pathname.replace(/\/+$/,'') || '/index.html');

  if(path.endsWith('/index.html')){
    await initHome();
    mountHeader();
  } else {
    mountHeader();
    if(path.endsWith('/premium.html')){ await initPremium(); }
    else if(path.endsWith('/videos.html')){ await initVideos(); }
    else if(path.endsWith('/subscription.html')){ await initSubscription(); }
  }

  initCrisp();
  initAds({ left: document.getElementById('ad-left'), right: document.getElementById('ad-right') });
})();
