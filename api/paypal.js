export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).end();

    res.setHeader("Cache-Control","public, max-age=60");
    res.status(200).json({
      clientId: process.env.PAYPAL_CLIENT_ID || "",
      currency: "EUR",
      // nuevos planes
      planMonthly1499: process.env.PAYPAL_PLAN_MONTHLY_1499 || "",
      planAnnual4999:  process.env.PAYPAL_PLAN_ANNUAL_4999  || "",
    });
  } catch (e) {
    res.status(200).json({
      clientId: "",
      currency: "EUR",
      planMonthly1499: "",
      planAnnual4999:  "",
    });
  }
}
