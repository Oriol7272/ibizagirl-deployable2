(() => {
  const log=(...a)=>console.log('[IBG-Pay]',...a);

  // === GrantStore simple (24h) ===
  const GrantStore = {
    key:'ibg_grants',
    get(){ try{ return JSON.parse(localStorage.getItem(this.key)||'[]'); }catch{ return []; } },
    set(arr){ localStorage.setItem(this.key, JSON.stringify(arr)); },
    add(grant){ if(!grant) return; const arr=this.get().filter(g=>g.exp> Date.now()/1000); arr.push(grant); this.set(arr); },
    hasValidForItem(item){
      const now=Math.floor(Date.now()/1000);
      const b64uToStr=s=>atob(s.replace(/-/g,'+').replace(/_/g,'/'));
      for(const tok of this.get()){
        const p=String(tok).split('.');
        if(p.length!==3) continue;
        try {
          const pl=JSON.parse(b64uToStr(p[1]));
          if(pl.typ==='grant' && pl.exp>now && (pl.scope==='all' || (pl.scope==='item' && pl.item===item))) return true;
        } catch {}
      }
      return false;
    }
  };

  const IBG_Payments = {
    _sdkLoaded:false, _currency:'EUR',
    async loadSdk(){
      if(this._sdkLoaded && window.paypal) return window.paypal;
      const cfg = await fetch('/api/paypal/config').then(r=>r.json()).catch(()=>({ok:false}));
      if(!cfg?.ok || !cfg.clientId) throw new Error('paypal config');
      this._currency = cfg.currency || 'EUR';
      await new Promise((res,rej)=>{
        const s=document.createElement('script');
        s.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cfg.clientId)}&currency=${this._currency}&intent=capture&components=buttons`;
        s.onload=res; s.onerror=rej; document.head.appendChild(s);
      });
      this._sdkLoaded = true; return window.paypal;
    },

    async checkoutPpv(itemName){
      const paypal = await this.loadSdk();
      let modal=document.getElementById('ibg-pay-modal');
      if(!modal){
        modal=document.createElement('div'); modal.id='ibg-pay-modal';
        modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:99999;';
        modal.innerHTML='<div style="background:#111;padding:16px;border-radius:12px;max-width:420px;width:100%"><div id="ibg-paypal-buttons"></div><button id="ibg-pay-close" style="margin-top:12px;width:100%;padding:10px;border-radius:8px;background:#333;color:#fff;border:0">Cancelar</button></div>';
        document.body.appendChild(modal);
        modal.querySelector('#ibg-pay-close').onclick=()=>modal.remove();
      } else {
        modal.style.display='flex';
        modal.querySelector('#ibg-paypal-buttons').innerHTML='';
      }

      paypal.Buttons({
        style:{layout:'horizontal',color:'black',shape:'rect',label:'pay'},
        createOrder: async ()=>{
          const r=await fetch('/api/paypal/create-order',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sku:'ppv_1'})});
          const j=await r.json(); if(!j.ok) throw new Error('create-order failed');
          log('order CREATED', j.id); return j.id;
        },
        onApprove: async ({orderID})=>{
          try{
            const r=await fetch('/api/paypal/capture',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({orderId:orderID,sku:'ppv_1',item:itemName})});
            const j=await r.json(); if(!j.ok){ console.error('capture error', j); alert('No se pudo capturar el pago.'); return; }
            log('capture COMPLETED', j); GrantStore.add(j.grant);
            document.querySelector(`[data-ibg-name="${CSS.escape(itemName)}"]`)?.classList.remove('ibg-locked');
            modal.remove();
            alert('¡Pago completado! Acceso concedido durante 24h.');
          }catch(e){ console.error('onApprove error',e); alert('Error durante la confirmación.'); }
        },
        onError:(err)=>{ console.error('PayPal Buttons error',err); alert('Error con PayPal.'); }
      }).render('#ibg-paypal-buttons');
    },

    enableThumbHandlers(){
      document.addEventListener('click',ev=>{
        let btn=ev.target.closest('[data-ibg-ppv]');
        let item=btn?.getAttribute('data-ibg-ppv')||null;
        if(!item){
          const fb=ev.target.closest('.ibg-ppv-btn,[data-ppv="1"]');
          if(fb){ const wrap=fb.closest('[data-ibg-name]'); item=wrap?.getAttribute('data-ibg-name')||null; btn=fb; }
        }
        if(!item) return; ev.preventDefault(); this.checkoutPpv(item);
      });
    },

    markLockedThumbs(){
      document.querySelectorAll('[data-ibg-name]').forEach(el=>{
        const name=el.getAttribute('data-ibg-name');
        if(!GrantStore.hasValidForItem(name)) el.classList.add('ibg-locked');
      });
    }
  };

  window.addEventListener('DOMContentLoaded',()=>{ IBG_Payments.enableThumbHandlers(); IBG_Payments.markLockedThumbs(); });
  window.IBG_Payments = IBG_Payments;
})();
