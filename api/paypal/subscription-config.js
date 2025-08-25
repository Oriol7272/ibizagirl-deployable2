module.exports = async (req, res) => {
  try{
    const brand    = process.env.IBG_BRAND || 'IbizaGirl';
    const currency = process.env.IBG_DEFAULT_CURRENCY || 'EUR';
    const clientId = process.env.PAYPAL_CLIENT_ID || '';

    const monthly =
      process.env.PAYPAL_PLAN_MONTHLY ||
      process.env.PAYPAL_MONTHLY_PLAN_ID ||
      process.env.PAYPAL_PLAN_ID_MONTHLY ||
      process.env.PAYPAL_SUBS_MONTHLY_PLAN_ID ||
      '';

    const annual  =
      process.env.PAYPAL_PLAN_ANNUAL  ||
      process.env.PAYPAL_ANNUAL_PLAN_ID ||
      process.env.PAYPAL_PLAN_ID_ANNUAL  ||
      process.env.PAYPAL_SUBS_ANNUAL_PLAN_ID ||
      '';

    res.status(200).json({ ok:true, monthly, annual, brand, currency, clientId });
  }catch(e){
    res.status(500).json({ ok:false, error:String(e) });
  }
};
