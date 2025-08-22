export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60');

  const clientId = process.env.PAYPAL_CLIENT_ID || '';
  const planMonthly = process.env.PAYPAL_PLAN_MONTHLY_1499 || '';
  const planAnnual  = process.env.PAYPAL_PLAN_ANNUAL_4999  || '';

  res.status(200).json({
    ok: Boolean(clientId && (planMonthly || planAnnual)),
    paypalClientId: clientId,
    paypalPlanMonthly1499: planMonthly,
    paypalPlanAnnual4999: planAnnual,
    prices: {
      monthly: 14.99,
      annual: 49.99,
      lifetime: 100.00
    }
  });
}
