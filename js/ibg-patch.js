(function(){
  // -------- helpers env --------
  function envBase(){
    try{
      if (window.IBG_ENV && window.IBG_ENV.ASSETS_BASE_URL) return window.IBG_ENV.ASSETS_BASE_URL;
      if (window.IBG_ASSETS_BASE_URL) return window.IBG_ASSETS_BASE_URL;
      if (window.process && window.process.env && window.process.env.IBG_ASSETS_BASE_URL) return window.process.env.IBG_ASSETS_BASE_URL;
    }catch(_){}
    return "";
  }
  var BASE = (envBase()||"").replace(/\/$/,""); // p.ej. https://ibizagirl-assets.s3.eu-north-1.amazonaws.com

  // -------- 1) Inyectar HERO rotativo con decorative-manifest --------
  function ensureHero(){
    if(document.getElementById('ibg-hero')) return document.getElementById('ibg-hero');
    var h=document.createElement('section'); h.id='ibg-hero';
    var wrap=document.createElement('div'); wrap.className='t';
    wrap.innerHTML='<h1>IBIZAGIRL.PICS</h1><p>Bienvenido al paraiso</p>';
    h.appendChild(wrap);
    document.body.prepend(h);
    // slot de anuncio justo debajo
    var under=document.createElement('div'); under.id='ibg-under-hero'; under.innerHTML='<div id="ad-under-hero" class="ibg-ad">Ad Under Banner</div>';
    h.insertAdjacentElement('afterend', under);
    return h;
  }
  function startHero(){
    var hero=ensureHero();
    var pool=(window.DECORATIVE_IMAGES||[]).map(function(n){
      if(!n) return null;
      if(/^https?:\/\//i.test(n)) return n;
      return n.startsWith('/')?n:'/decorative-images/'+n;
    }).filter(Boolean);
    if(!pool.length) return;
    var i=0;
    function tick(){ hero.style.setProperty('background-image','url("'+pool[i%pool.length]+'")','important'); i++; }
    tick(); setInterval(tick,5000);
  }

  // -------- 2) Arreglar rutas /full/ -> S3 en cualquier <img> (y futuras) --------
  function fixSrc(url){
    if(!url) return url;
    if(/^https?:\/\//i.test(url)) return url;                 // ya absoluta
    if(url.startsWith('/full/')) return BASE? (BASE + url) : url; // /full/xxxx -> BASE/full/xxxx
    if(/\.(webp|jpe?g|png|gif)(\?.*)?$/i.test(url))           // nombre suelto -> BASE/full/nombre
      return BASE? (BASE + '/full/' + url.replace(/^\/+/,'')) : ('/full/' + url.replace(/^\/+/, ''));
    return url;
  }
  function patchAllImgs(root){
    root.querySelectorAll('img').forEach(function(img){
      var fixed=fixSrc(img.getAttribute('src'));
      if(fixed && fixed!==img.src) img.src=fixed;
    });
  }
  function observeNewImgs(){
    var mo=new MutationObserver(function(list){
      list.forEach(function(m){
        m.addedNodes && m.addedNodes.forEach(function(n){
          if(n.nodeType===1){
            if(n.tagName==='IMG') { n.src = fixSrc(n.getAttribute('src')); }
            else patchAllImgs(n);
          }
        });
      });
    });
    mo.observe(document.documentElement, {subtree:true, childList:true});
  }

  // -------- 3) Ads: montar y colapsar huecos --------
  function ensureExoLib(cb){
    if(window.__EXO_LOADED__) return cb();
    var s=document.createElement('script'); s.src='https://a.exdynsrv.com/ad-provider.js'; s.async=true;
    s.onload=function(){window.__EXO_LOADED__=true; cb();}; document.head.appendChild(s);
  }
  function mountExo(id, zone){
    var host=document.getElementById(id); if(!host||!zone) return;
    host.innerHTML=''; var ins=document.createElement('ins');
    ins.className='adsbyexoclick'; ins.setAttribute('data-zoneid', String(zone));
    host.appendChild(ins);
    (window.AdProvider=window.AdProvider||[]).push({"serve":{}});
  }
  function exo(){
    var A=window.IBG_ADS||{}, exo=A.exoclick||{}, Z=exo.zones||[];
    var left=Z[0]||exo.zone, right=Z[1]||Z[0]||exo.zone;
    var bottom=exo.bottomZone||exo.zone;
    var under=exo.stickyZone||exo.zone;
    ensureExoLib(function(){
      mountExo('ad-under-hero', under);
      mountExo('ad-left', left);
      mountExo('ad-right', right);
      mountExo('ad-bottom', bottom);
      mountExo('ad-bottom-2', right||left);
      // reubicar flotante top-left dentro de under-hero
      setTimeout(function(){
        var cand=[].slice.call(document.querySelectorAll('ins.adsbyexoclick,div[id*="exo"],div[class*="exo"]'));
        cand.forEach(function(n){
          var inSlot=n.closest('#ad-left,#ad-right,#ad-under-hero,#ad-bottom,#ad-bottom-2,#ad-bottom-ero,#ad-bottom-ero-2');
          if(!inSlot){
            var cs=getComputedStyle(n);
            if((cs.position==='fixed'||cs.position==='absolute') && cs.top==='0px' && cs.left==='0px'){
              var underBox=document.getElementById('ad-under-hero'); if(underBox){ underBox.innerHTML=''; underBox.appendChild(n); n.style.position='static'; }
            }
          }
        });
      },1200);
      // colapsar huecos sin fill
      setTimeout(function(){
        document.querySelectorAll('.ibg-ad').forEach(function(box){
          if(!box.querySelector('iframe,ins')) box.classList.add('ibg-hidden');
        });
      },5000);
    });
  }
  function ero(){
    var E=(window.IBG_ADS&&window.IBG_ADS.eroadvertising)||{};
    if(!E.zone||!E.space||!E.pid||!E.ctrl) return;
    function mount(id, spaceId){
      var host=document.getElementById(id); if(!host) return;
      host.innerHTML='';
      var s=document.createElement('script');
      s.src='https://go.ero-advertising.com/loadeactrl.go?pid='+encodeURIComponent(E.pid)+'&spaceid='+encodeURIComponent(spaceId||E.space)+'&ctrlid='+encodeURIComponent(E.ctrl);
      s.async=true; document.body.appendChild(s);
      setTimeout(function(){ if(!host.querySelector('iframe')) host.classList.add('ibg-hidden'); }, 5000);
    }
    mount('ad-bottom-ero', E.space);
    mount('ad-bottom-ero-2', E.zone);
  }
  function pop(){
    var p=(window.IBG_ADS&&window.IBG_ADS.popads)||{};
    if(!p.enabled||!p.siteId||!p.siteHash) return;
    if(window.__POP_LOADED__) return; window.__POP_LOADED__=true;
    window._pop={popunder:false,siteId:parseInt(p.siteId,10),hash:p.siteHash};
    var s=document.createElement('script'); s.async=true; s.src='//c2.popads.net/pop.js'; document.head.appendChild(s);
  }

  // -------- 4) Inyectar contenedores de anuncios inferiores (si no existen) --------
  function ensureBottomAds(){
    if(document.getElementById('ibg-bottom-ads')) return;
    var wrap=document.createElement('div');
    wrap.id='ibg-bottom-ads';
    wrap.className='ibg-grid-bottom';
    wrap.innerHTML=[
      '<div id="ad-bottom" class="ibg-ad">Ad Bottom (Exo)</div>',
      '<div id="ad-bottom-2" class="ibg-ad">Ad Bottom 2 (Exo)</div>',
      '<div id="ad-bottom-ero" class="ibg-ad">Ad Bottom (Ero)</div>',
      '<div id="ad-bottom-ero-2" class="ibg-ad">Ad Bottom 2 (Ero)</div>'
    ].join('');
    (document.querySelector('main .container')||document.body).appendChild(wrap);
  }

  // -------- 5) Arranque --------
  function start(){
    // CSS
    var link=document.createElement('link'); link.rel='stylesheet'; link.href='/css/ibg-patch.css'; document.head.appendChild(link);
    // Hero rotativo + anuncios
    startHero();
    ensureBottomAds();
    // Arreglar rutas de imágenes ya en DOM y futuras
    patchAllImgs(document);
    observeNewImgs();
    // Ads
    exo(); ero(); pop();
  }

  if(document.readyState!=='loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
