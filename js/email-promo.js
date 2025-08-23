(function(){
  const E=window.__ENV||{};
  const FP=E.FORMSPREE_ID||'';
  const PROMO_ON = (E.PROMO_ACTIVE||'').toString()==='1';
  const PROMO_TXT = E.PROMO_MESSAGE_ES || 'Lifetime - desbloquea todo por 100€ · Sin anuncios';
  const PROMO_END = E.PROMO_END_UTC || '';

  function el(tag,attrs,html){ const e=document.createElement(tag); if(attrs) Object.assign(e,attrs); if(html!==undefined) e.innerHTML=html; return e; }

  function emailBox(){
    const wrap=el('div',{id:'email-box',className:'section'});
    wrap.innerHTML='<div class="card" style="padding:12px;display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;background:#0b1f33"><strong>Recibe novedades</strong><input id="email-input" type="email" placeholder="tu@email" style="padding:6px 10px;border-radius:6px;border:1px solid #234;min-width:240px"><button id="email-send" class="btn">Apuntarme</button><span id="email-ok" style="display:none">¡Gracias!</span></div>';
    document.querySelector('.page')?.prepend(wrap);
    document.getElementById('email-send').onclick=()=>{
      const v=document.getElementById('email-input').value.trim();
      if(!/^[^@]+@[^@]+\.[^@]+$/.test(v)) return alert('Email no válido');
      if(FP){
        fetch('https://formspree.io/f/'+FP,{method:'POST',headers:{'Accept':'application/json'},body:new FormData(Object.assign(document.createElement('form'),{innerHTML:`<input name="email" value="${v}">`}))})
          .then(()=>{ localStorage.setItem('email',v); document.getElementById('email-ok').style.display='inline'; });
      }else{
        localStorage.setItem('email',v); document.getElementById('email-ok').style.display='inline';
      }
    };
  }

  function promo(){
    if(!PROMO_ON) return;
    const bar=el('div',{id:'promo-bar'});
    bar.style.cssText='position:sticky;top:0;z-index:11;background:#0e3d63;color:#fff;padding:.5rem 1rem;text-align:center';
    const cnt=el('span',{id:'promo-count'});
    bar.append(el('span',null,PROMO_TXT+' · '),cnt);
    document.querySelector('header.site')?.after(bar);
    function tick(){
      if(!PROMO_END){ cnt.textContent=''; return; }
      const t=Date.parse(PROMO_END)-Date.now();
      if(t<=0){ bar.remove(); return; }
      const h=Math.floor(t/3.6e6), m=Math.floor((t%3.6e6)/6e4), s=Math.floor((t%6e4)/1e3);
      cnt.textContent=h+'h '+m+'m '+s+'s';
    }
    tick(); setInterval(tick,1000);
  }

  document.addEventListener('DOMContentLoaded',()=>{ emailBox(); promo(); });
})();
