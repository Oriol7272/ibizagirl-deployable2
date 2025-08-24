export default function handler(req, res) {
  const cfg = {
    // PayPal
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "",
    PAYPAL_PLAN_MONTHLY_1499: process.env.PAYPAL_PLAN_MONTHLY_1499 || "",
    PAYPAL_PLAN_ANNUAL_4999:  process.env.PAYPAL_PLAN_ANNUAL_4999  || "",

    // Anuncios (si los usas por ENV)
    EXO_ZONE_LEFT:  process.env.EXO_ZONE_LEFT  || "",
    EXO_ZONE_RIGHT: process.env.EXO_ZONE_RIGHT || "",
    JUICY_ADZONE:   process.env.JUICY_ADZONE   || "",
    ERO_ZONEID:     process.env.ERO_ZONEID     || "",
    POPADS_SITEKEY: process.env.POPADS_SITEKEY || ""
  };

  res.setHeader('Content-Type','application/javascript; charset=utf-8');
  res.status(200).send('window.__ENV=' + JSON.stringify(cfg));
}
