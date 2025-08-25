const { plans } = require("./_client");
module.exports = async (req,res)=>{
  res.setHeader("Cache-Control","public, max-age=300, must-revalidate");
  res.status(200).json({ clientId: process.env.PAYPAL_CLIENT_ID || "", currency: "EUR", plans: plans() });
};
