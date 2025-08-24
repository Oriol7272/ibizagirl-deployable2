(function(){
  var KEY='cookie_consent_v1';
  function loadScript(src){ var s=document.createElement('script'); s.async=true; s.src=src; document.head.appendChild(s); }
  function allow(category){ var c = JSON.parse(localStorage.getItem(KEY) || '{}'); return !!c[category]; }
  function save(consent){ localStorage.setItem(KEY, JSON.stringify(consent)); }
  function initAnalytics(){
    if(!allow('analytics')) return;
    var GA_ID = window.GA_ID || (window.__env && window.__env.PUBLIC_GA_ID);
    if(!GA_ID) return;
    if(!window.dataLayer){ window.dataLayer=[]; function gtag(){dataLayer.push(arguments)}; window.gtag=gtag; gtag('js', new Date()); }
    gtag('config', GA_ID, { 'anonymize_ip': true, 'allow_ad_personalization_signals': false });
    loadScript('https://www.googletagmanager.com/gtag/js?id='+GA_ID);
  }
  function initAds(){
    if(!allow('ads')) return;
    var net = (window.__env && window.__env.PUBLIC_ADS_NETWORK) || 'generic';
    var zone = (window.__env && window.__env.PUBLIC_ADS_ZONE_ID) || '';
    // Placeholder: switch among networks. Replace with your network's script.
    if(net==='generic'){
      console.log('Ads enabled (generic). Insert your ad tags in public/snippets/ads-body.html');
    }
    // Example hooks for other networks can be added here.
  }
  function renderBanner(){
    if(localStorage.getItem(KEY)) { initAnalytics(); initAds(); return; }
    var bar=document.createElement('div');
    bar.id='cookie-banner'; bar.style.cssText='position:fixed;bottom:0;left:0;right:0;padding:12px;border-top:1px solid #ddd;background:#fff;z-index:9999;font:14px system-ui;display:flex;gap:12px;align-items:center;justify-content:space-between;';
    bar.innerHTML = '<div><strong>Cookies</strong>: Usamos cookies para analítica y publicidad.</div>' +
      '<div style="display:flex;gap:8px;align-items:center;">' +
      '<label><input type="checkbox" id="consent-analytics" checked> Analíticas</label>' +
      '<label><input type="checkbox" id="consent-ads"> Publicidad</label>' +
      '<button id="consent-accept">Aceptar</button>' +
      '<button id="consent-decline">Rechazar</button>' +
      '</div>';
    document.body.appendChild(bar);
    document.getElementById('consent-accept').onclick=function(){
      var consent={ necessary:true, analytics:document.getElementById("consent-analytics").checked, ads:document.getElementById("consent-ads").checked };
      save(consent); document.getElementById('cookie-banner').remove(); initAnalytics(); initAds();
    };
    document.getElementById('consent-decline').onclick=function(){
      save({ necessary:true, analytics:false, ads:false }); document.getElementById('cookie-banner').remove();
    };
  }
  document.addEventListener('DOMContentLoaded', renderBanner);
})();
