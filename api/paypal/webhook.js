export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok:false });
  }
  try {
    const body = await new Promise((resolve) => {
      let raw=''; req.on('data', c => raw+=c); req.on('end', () => resolve(raw || '{}'));
    });
    console.log('[PAYPAL WEBHOOK]', body);
    // TODO: validar firma con PAYPAL_WEBHOOK_ID + cabeceras (paso siguiente)
    return res.status(200).json({ ok:true });
  } catch (e) {
    console.error('[PAYPAL WEBHOOK] error', e);
    return res.status(500).json({ ok:false });
  }
}
