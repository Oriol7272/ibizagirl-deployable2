export default function handler(req, res) {
  const env = (process.env.PAYPAL_ENV || 'live').toLowerCase();
  const clientId = process.env.PAYPAL_CLIENT_ID || null;
  const currency = process.env.PAYPAL_CURRENCY || 'EUR';

  // IDs de plan se pueden exponer en cliente según PayPal
  const monthlyPlanId = process.env.PAYPAL_PLAN_MONTHLY || null;
  const annualPlanId  = process.env.PAYPAL_PLAN_ANNUAL  || null;

  res.status(200).json({
    ok: true,
    env,
    clientId,
    currency,
    monthlyPlanId: monthlyPlanId ? String(monthlyPlanId) : null,
    annualPlanId:  annualPlanId  ? String(annualPlanId)  : null
  });
}
