export default function handler(req, res) {
  // Variables de entorno en Vercel:
  // PAYPAL_CLIENT_ID (OBLIGATORIA)
  // PAYPAL_PLAN_MONTHLY (OPCIONAL - plan_id real de PayPal)
  // PAYPAL_PLAN_ANNUAL  (OPCIONAL - plan_id real de PayPal)
  const clientId    = process.env.PAYPAL_CLIENT_ID || "";
  const planMonthly = process.env.PAYPAL_PLAN_MONTHLY || "";
  const planAnnual  = process.env.PAYPAL_PLAN_ANNUAL  || "";
  const currency    = "EUR";

  // No exponemos secretos, sólo el clientId público y los plan_id si existen.
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
  res.status(200).json({
    clientId,
    currency,
    planMonthly: planMonthly || null,
    planAnnual:  planAnnual  || null,
  });
}
