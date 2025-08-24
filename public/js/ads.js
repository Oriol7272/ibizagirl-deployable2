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
    if(!(g.__ENV && g.__ENV.ERO_PID && g.__ENV.ERO_CTRLID && zone)) return;
    var div=document.createElement('div'); div.id='sp_'+zone+'_node'; el.appendChild(div);
    var s=document.createElement('script'); s.charset='utf-8';
    // Fuerza dominio correcto y usa tus variables REALES
    var pid=String(g.__ENV.ERO_PID), ctrl=String(g.__ENV.ERO_CTRLID);
    s.text='if(typeof eaCtrl=="undefined"){var eaCtrlRecs=[];var eaCtrl={add:function(ag){eaCtrlRecs.push(ag)}};var js=document.createElement("script");js.setAttribute("src","https://go.easrv.cl/loadeactrl.go?pid='+pid+'&spaceid='+String(zone)+'&ctrlid='+ctrl+'");document.head.appendChild(js);} eaCtrl.add({"display":"sp_'+String(zone)+'_node","sid":'+String(zone)+',"plugin":"banner"});';
    el.appendChild(s);
  }
  // PopAds: desactivado por defecto a menos que POPADS_ENABLE === "true" y haya siteId
  function mountPopAds(siteId){
    if(!(g.__ENV && String(g.__ENV.POPADS_ENABLE)==="true" && siteId)) return;
    var s=document.createElement('script'); s.async=true; s.src='https://serve.popads.net/pop.js';
    document.head.appendChild(s);
  }
  function mountSideAds(){
    if(!(g.__ENV && String(g.__ENV.ADS_ENABLED)!=='false')) return;
    var env=g.__ENV||{};
    var rails=document.querySelectorAll('.aside-ads .ad-rail');
    rails.forEach(function(container){
      var j=container.querySelector('[data-net="juicy"]');
      var e=container.querySelector('[data-net="exo"]');
      var r=container.querySelector('[data-net="ero"]');
      if(env.JUICYADS_ZONE && j){ mountJuicyZone(j, env.JUICYADS_ZONE); }
      if(env.EXOCLICK_ZONE && e){ mountExoZone(e, env.EXOCLICK_ZONE); }
      if(env.EROADVERTISING_ZONE && r){ mountEroZone(r, env.EROADVERTISING_ZONE); }
    });
    if(env.POPADS_SITE_ID){ mountPopAds(env.POPADS_SITE_ID); }
  }
  function mountAds(){ mountSideAds(); }
  g.ADS={ mountAds, mountSideAds };
})(window);
