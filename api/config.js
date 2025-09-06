module.exports = async (req, res) => {
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.status(200).end(JSON.stringify({ paypalClientId: process.env.PAYPAL_CLIENT_ID || "" }));
};
