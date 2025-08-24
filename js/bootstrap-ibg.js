import { mountHeader } from './pages-common.js';
import { initHome } from './pages/home.js';
import { initAds } from './ad-loader.js';
import { initCrisp } from './integrations.js';
(async ()=>{
  await initHome();
  mountHeader();            // menú pegado al banner
  initCrisp();              // chatbot
  initAds({left:document.getElementById('ad-left'), right:document.getElementById('ad-right')}); // anuncios
})();
