module.exports = (req, res) => {
  const {
    PAYPAL_CLIENT_ID = "",
    PAYPAL_PLAN_MONTHLY = "",
    PAYPAL_PLAN_ANNUAL = "",
    PAYPAL_PLAN_LIFETIME = "",
  } = process.env;

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).json({
    paypalClientId: PAYPAL_CLIENT_ID,
    paypalPlans: {
      monthly: PAYPAL_PLAN_MONTHLY,
      annual: PAYPAL_PLAN_ANNUAL,
      lifetime: PAYPAL_PLAN_LIFETIME,
    },
  });
};
