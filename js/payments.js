// Carga dinámica del SDK de PayPal (LIVE). El client-id puede ser público.
// ¡NO pongas aquí el SECRET! (irá en las funciones serverless)
let paypalReady = false;
function loadPayPal(clientId) {
  return new Promise((resolve, reject) => {
    if (paypalReady) return resolve();
    const s = document.createElement('script');
    s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&components=buttons,subscriptions`;
    s.onload = () => { paypalReady = true; resolve(); };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// Render del botón para un item (imagen/video)
window.renderPayButton = async function(id, kind, src, amountEUR) {
  const clientId = window.PAYPAL_CLIENT_ID; // define esto en un <script> antes
  if (!clientId) return alert('Falta PAYPAL_CLIENT_ID en el front');
  await loadPayPal(clientId);

  const ctr = document.getElementById(`pp-${id}`);
  if (!ctr) return;
  ctr.classList.add('visible');
  ctr.innerHTML = ''; // limpiar si ya existía

  paypal.Buttons({
    style: { layout: 'vertical', shape: 'pill', label: 'pay' },
    createOrder: async () => {
      const r = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ amount: amountEUR, currency: 'EUR', resourceId: id })
      });
      const j = await r.json();
      if (!j.id) throw new Error('No se pudo crear el pedido');
      return j.id;
    },
    onApprove: async (data) => {
      const r = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ orderId: data.orderID, resourceId: id })
      });
      const j = await r.json();
      if (j.status !== 'COMPLETED') throw new Error('Captura no completada');
      // Cookie de acceso puesta por el backend; recargar para desbloquear
      location.reload();
    },
    onCancel: () => { ctr.classList.remove('visible'); },
    onError: (err) => { console.error(err); alert('Error en el pago'); ctr.classList.remove('visible'); }
  }).render(ctr);
};

// Botones de suscripción (requiere plan_id ya creado en PayPal)
window.renderSubscriptionButtons = async function({ monthlyPlanId, annualPlanId, lifetimePlanId }) {
  const clientId = window.PAYPAL_CLIENT_ID;
  await loadPayPal(clientId);

  const mount = (elId, planId, label) => {
    const el = document.getElementById(elId);
    if (!el) return;
    paypal.Buttons({
      style: { label: 'subscribe', shape: 'pill' },
      createSubscription: (data, actions) => actions.subscription.create({ plan_id: planId }),
      onApprove: async (data) => {
        // Marca cookie de suscriptor en backend
        await fetch('/api/session/subscribe', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ planId, subscriptionId: data.subscriptionID, label })
        });
        alert('Suscripción activa. ¡Gracias!');
        location.reload();
      }
    }).render(el);
  };

  mount('pp-sub-monthly',  monthlyPlanId,  'monthly');
  mount('pp-sub-annual',   annualPlanId,   'annual');
  mount('pp-sub-lifetime', lifetimePlanId, 'lifetime');
};

