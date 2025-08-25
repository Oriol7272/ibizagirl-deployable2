module.exports = async (req, res) => {
  try {
    const env       = process.env.PAYPAL_ENV || 'live';
    const clientId  = process.env.PAYPAL_CLIENT_ID || '';
    const currency  = process.env.IBG_DEFAULT_CURRENCY || 'EUR';
    const brand     = process.env.IBG_BRAND || 'IbizaGirl';

    // Soporta varios nombres posibles para evitar null:
    const monthlyPlanId =
      process.env.PAYPAL_PLAN_MONTHLY ||
      process.env.PAYPAL_MONTHLY_PLAN_ID ||
      process.env.PAYPAL_PLAN_ID_MONTHLY ||
      process.env.PAYPAL_SUBS_MONTHLY_PLAN_ID ||
      null;

    const annualPlanId  =
      process.env.PAYPAL_PLAN_ANNUAL  ||
      process.env.PAYPAL_ANNUAL_PLAN_ID ||
      process.env.PAYPAL_PLAN_ID_ANNUAL  ||
      process.env.PAYPAL_SUBS_ANNUAL_PLAN_ID ||
      null;

    res.status(200).json({ ok:true, env, clientId, currency, brand, monthlyPlanId, annualPlanId });
  } catch (e) {
    res.status(500).json({ ok:false, error:String(e) });
  }
};
