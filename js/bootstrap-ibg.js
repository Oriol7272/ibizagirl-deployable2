import { mountHeader } from './pages-common.js';
import { initHome } from './pages/home.js';
import { initPremium } from './pages/premium.js';
import { initVideos } from './pages/videos.js';
import { initSubscription } from './pages/subscription.js';
import { initAds } from './ad-loader.js';
import { initCrisp } from './integrations.js';
mountHeader(); initCrisp(); initAds();
const path=location.pathname.replace(/\/+$/,'')||'/index.html';
if(path.endsWith('/index.html')){initHome()}
else if(path.endsWith('/premium.html')){initPremium()}
else if(path.endsWith('/videos.html')){initVideos()}
else if(path.endsWith('/subscription.html')){initSubscription()}
