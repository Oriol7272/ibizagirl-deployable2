module.exports = async (req, res) => {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID || '';
    const currency = process.env.IBG_DEFAULT_CURRENCY || 'EUR';
    const brand = process.env.IBG_BRAND || 'IbizaGirl';
    res.status(200).json({ ok: true, clientId, currency, brand });
  } catch (e) {
    res.status(500).json({ ok:false, error:String(e) });
  }
};
