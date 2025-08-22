export default async function handler(req, res) {
  try {
    const { path = "" } = req.query;
    const base = (process.env.IBG_ASSETS_BASE_URL || "").replace(/\/+$/, "");
    if (!base || !path) {
      res.status(500).json({ error: "IBG_ASSETS_BASE_URL no está configurado o falta ?path=" });
      return;
    }
    const target = base + path;
    res.status(302).setHeader("Location", target);
    res.setHeader("Cache-Control", "public, max-age=60");
    res.end();
  } catch (e) {
    res.status(500).json({ error: "cdn redirect error", details: String(e) });
  }
}
