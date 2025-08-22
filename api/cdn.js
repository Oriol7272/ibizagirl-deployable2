export default async function handler(req, res) {
  try {
    const reqPath = (req.query.path || '').toString();
    if (!reqPath || !/^\/(uncensored|uncensored-videos)\//.test(reqPath)) {
      res.status(400).json({ error: 'bad request' });
      return;
    }
    const base = (process.env.IBG_ASSETS_BASE_URL || '').replace(/\/+$/, '');
    if (!base) {
      res.status(500).json({ error: 'IBG_ASSETS_BASE_URL not configured' });
      return;
    }
    const target = base + reqPath;
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.status(302).setHeader('Location', target);
    res.end();
  } catch (e) {
    res.status(500).json({ error: 'server error' });
  }
}
