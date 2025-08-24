(function(g,d){
  function safe(fn){ try{ fn&&fn(); }catch(e){ console.warn('ads error', e); } }
  function mountJuicy(container, zone){
    if(!container||!zone) return;
    var s1=d.createElement('script'); s1.setAttribute('data-cfasync','false'); s1.async=true; s1.src='https://poweredby.jads.co/js/jads.js';
    var ins=d.createElement('ins'); ins.id=String(zone); ins.setAttribute('data-width','300'); ins.setAttribute('data-height','250');
    var s2=d.createElement('script'); s2.setAttribute('data-cfasync','false'); s2.async=true;
    s2.text="(adsbyjuicy=window.adsbyjuicy||[]).push({adzone:"+Number(zone)+"});";
    container.appendChild(s1); container.appendChild(ins); container.appendChild(s2);
  }
  function mountExo(container, zone){
    if(!container||!zone) return;
    var s1=d.createElement('script'); s1.async=true; s1.src='https://a.magsrv.com/ad-provider.js';
    var ins=d.createElement('ins'); ins.className='eas6a97888e2'; ins.setAttribute('data-zoneid', String(zone));
    var s2=d.createElement('script'); s2.text='(AdProvider=window.AdProvider||[]).push({"serve":{}});';
    container.appendChild(s1); container.appendChild(ins); container.appendChild(s2);
  }
  function mountEro(container, spaceId){ if(!container||!spaceId) return; /* tu snippet si hace falta */ }
  function mountSideAds(){
    var env=g.__ENV||{};
    d.querySelectorAll('.aside-ads .ad-rail').forEach(function(el){
      safe(()=>mountJuicy(el.querySelector('[data-net="juicy"]'), env.JUICYADS_ZONE));
      safe(()=>mountExo(el.querySelector('[data-net="exo"]'),   env.EXOCLICK_ZONE));
      safe(()=>mountEro(el.querySelector('[data-net="ero"]'),   env.EROADVERTISING_ZONE));
    });
  }
  g.ADS={ mountSideAds, mountAds: mountSideAds };
})(window,document);
