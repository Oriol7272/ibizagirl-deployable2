export default function handler(req, res) {
  const cid = process.env.PAYPAL_CLIENT_ID || '';
  const env = process.env.PAYPAL_ENV || (cid.startsWith('A') ? 'live' : 'sandbox');
  res.status(200).json({
    ok: true,
    env,
    hasClientId: !!cid,
    hasSecret: !!process.env.PAYPAL_SECRET,
    hasMonthlyPlan: !!process.env.PAYPAL_PLAN_MONTHLY_1499,
    hasAnnualPlan: !!process.env.PAYPAL_PLAN_ANNUAL_4999
  });
}
