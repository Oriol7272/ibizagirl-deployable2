(function(g){
  function appendHTMLWithScripts(container, html){
    var tmp=document.createElement('div'); tmp.innerHTML=html;
    Array.from(tmp.querySelectorAll('script')).forEach(function(sc){
      var s=document.createElement('script');
      if(sc.src){ s.src=sc.src; s.async=true; }
      else { s.textContent=sc.textContent; }
      sc.replaceWith(s);
    });
    container.appendChild(tmp);
  }
  function mountJuicyZone(el, zone){
    var s1=document.createElement('script'); s1.setAttribute('data-cfasync','false'); s1.async=true; s1.src='https://poweredby.jads.co/js/jads.js';
    var ins=document.createElement('ins'); ins.id=String(zone); ins.setAttribute('data-width','300'); ins.setAttribute('data-height','250');
    var s2=document.createElement('script'); s2.setAttribute('data-cfasync','false'); s2.async=true;
    s2.text = "(adsbyjuicy = window.adsbyjuicy || []).push({'adzone':"+JSON.stringify(Number(zone))+ "});";
    el.appendChild(s1); el.appendChild(ins); el.appendChild(s2);
  }
  function mountExoZone(el, zone){
    var s1=document.createElement('script'); s1.async=true; s1.src='https://a.magsrv.com/ad-provider.js';
    var ins=document.createElement('ins'); ins.className='eas6a97888e2'; ins.setAttribute('data-zoneid', String(zone));
    var s2=document.createElement('script'); s2.text='(AdProvider = window.AdProvider || []).push({"serve": {}});';
    el.appendChild(s1); el.appendChild(ins); el.appendChild(s2);
  }
  function mountEroZone(el, zone){
    var div=document.createElement('div'); div.id='sp_'+zone+'_node'; el.appendChild(div);
    var s=document.createElement('script'); s.charset='utf-8';
    s.text='if(typeof eaCtrl=="undefined"){var eaCtrlRecs=[];var eaCtrl={add:function(ag){eaCtrlRecs.push(ag)}};var js=document.createElement("script");js.setAttribute("src","//go.easrv.cl/loadeactrl.go?pid=152716&spaceid='+String(zone)+'&ctrlid=798544");document.head.appendChild(js);} eaCtrl.add({"display":"sp_'+String(zone)+'_node","sid":'+String(zone)+',"plugin":"banner"});';
    el.appendChild(s);
  }
  function mountPopAds(siteId){
    var s=document.createElement('script'); s.setAttribute('data-cfasync','false');
    s.text='(function(){var p=window,j="e494ffb82839a29122608e933394c091",d=[["siteId",'+String(siteId)+'],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],v=[],e=-1,a,y,m=function(){clearTimeout(y);e++;a=p.document.createElement("script");a.type="text/javascript";a.async=!0;var s=p.document.getElementsByTagName("script")[0];a.src="https://www.jsgf rzwtygf.com/jmdb.min.js".replace(/\\s/g,"");a.crossOrigin="anonymous";a.onerror=m;y=setTimeout(m,5E3);s.parentNode.insertBefore(a,s)};if(!p[j]){try{Object.freeze(p[j]=d)}catch(e){}m()}})();';
    document.head.appendChild(s);
  }
  function mountSideAds(){
    if(!(g.__ENV && String(g.__ENV.ADS_ENABLED)!=='false')) return;
    var env=g.__ENV||{};
    var left=document.querySelector('.aside-ads .ad-rail');
    var right=document.querySelectorAll('.aside-ads .ad-rail')[1]||null;
    [left,right].forEach(function(container){
      if(!container) return;
      var j=container.querySelector('[data-net="juicy"]');
      var e=container.querySelector('[data-net="exo"]');
      var r=container.querySelector('[data-net="ero"]');
      if(env.JUICYADS_SNIPPET_B64 && j){ appendHTMLWithScripts(j, atob(env.JUICYADS_SNIPPET_B64)); }
      else if(env.JUICYADS_ZONE && j){ mountJuicyZone(j, env.JUICYADS_ZONE); }
      if(env.EXOCLICK_SNIPPET_B64 && e){ appendHTMLWithScripts(e, atob(env.EXOCLICK_SNIPPET_B64)); }
      else if(env.EXOCLICK_ZONE && e){ mountExoZone(e, env.EXOCLICK_ZONE); }
      if(env.EROADVERTISING_SNIPPET_B64 && r){ appendHTMLWithScripts(r, atob(env.EROADVERTISING_SNIPPET_B64)); }
      else if(env.EROADVERTISING_ZONE && r){ mountEroZone(r, env.EROADVERTISING_ZONE); }
    });
    if(env.POPADS_SITE_ID){ mountPopAds(env.POPADS_SITE_ID); }
  }
  function mountAds(){ mountSideAds(); }
  g.ADS={ mountAds, mountSideAds };
})(window);
