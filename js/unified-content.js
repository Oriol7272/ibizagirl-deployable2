(function(g){
  const API = g.UCAPI || {};
  const hash=(s)=>{s=String(s||'');let h=0;for(let i=0;i<s.length;i++)h=((h<<5)-h)+s.charCodeAt(i)|0;return 'id'+Math.abs(h)};
  API.normalize=(raw,type)=>{
    if(typeof raw==='string'){ return {id:hash(raw),url:raw,thumb:raw,type:type||'image'}; }
    const o=Object.assign({type:type||raw?.type||'image'},raw||{});
    if(!o.id) o.id=hash(o.url||o.src||o.thumb||Math.random());
    if(!o.thumb) o.thumb=o.url||o.src||'';
    return o;
  };
  API.createCard=(raw,opts={})=>{
    const it=API.normalize(raw,opts.type);
    const card=document.createElement('div'); card.className='card';
    const t=document.createElement('div'); t.className='thumb';
    const img=document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.src=it.thumb;
    t.appendChild(img); card.appendChild(t);
    return card;
  };
  g.UCAPI = API;
})(window);
