module.exports = async (req, res) => {
  try {
    const env = (process.env.PAYPAL_ENV || 'live').toLowerCase();
    const clientId = process.env.PAYPAL_CLIENT_ID || '';
    const currency = process.env.IBG_DEFAULT_CURRENCY || 'EUR';
    const brand = process.env.IBG_BRAND || 'IbizaGirl';
    // lee tus variables de Vercel (las que me mostraste en la captura)
    const monthlyPlanId = process.env.PAYPAL_PLAN_MONTHLY_1499 || null;
    const annualPlanId  = process.env.PAYPAL_PLAN_ANNUAL_4999  || null;

    res.status(200).json({
      ok: true, env, clientId, currency, brand,
      monthlyPlanId, annualPlanId
    });
  } catch (e) {
    res.status(500).json({ ok:false, error:String(e) });
  }
};
