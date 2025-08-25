module.exports = async (req, res) => {
  const live = (process.env.PAYPAL_ENV||"live").toLowerCase()!=="sandbox";
  res.setHeader("Cache-Control","no-store");
  res.status(200).json({
    ok:true,
    env: live ? "live" : "sandbox",
    hasClientId: !!process.env.PAYPAL_CLIENT_ID,
    hasSecret: !!process.env.PAYPAL_SECRET,
    hasMonthlyPlan: !!process.env.PAYPAL_PLAN_MONTHLY_1499,
    hasAnnualPlan: !!process.env.PAYPAL_PLAN_ANNUAL_4999
  });
};
