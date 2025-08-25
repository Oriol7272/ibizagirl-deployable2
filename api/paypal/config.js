module.exports = async (req, res) => {
  try {
    const env      = process.env.PAYPAL_ENV || 'live';
    const clientId = process.env.PAYPAL_CLIENT_ID || '';
    const currency = process.env.IBG_DEFAULT_CURRENCY || 'EUR';
    const brand    = process.env.IBG_BRAND || 'IbizaGirl';
    // Usa los mismos nombres que tu health
    const monthlyPlanId = process.env.PAYPAL_PLAN_MONTHLY || null;
    const annualPlanId  = process.env.PAYPAL_PLAN_ANNUAL  || null;
    res.status(200).json({ ok:true, env, clientId, currency, brand, monthlyPlanId, annualPlanId });
  } catch (e) {
    res.status(500).json({ ok:false, error:String(e) });
  }
};
