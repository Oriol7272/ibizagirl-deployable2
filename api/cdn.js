export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const reqPath = url.searchParams.get('path') || url.pathname.replace(/^\/api\/cdn/, '') || '';
    if (!reqPath || !/^\/(full|uncensored|uncensored-videos)\//.test(reqPath)) {
      res.status(400).json({ error: 'bad path' }); return;
    }
    const baseRaw = (process.env.IBG_ASSETS_BASE_URL || 'https://ibizagirl-assets.s3.eu-north-1.amazonaws.com').replace(/\/+$/,'');
    const target = baseRaw + reqPath;
    res.status(302).setHeader('Location', target);
    res.setHeader('Cache-Control','public, max-age=3600, s-maxage=3600, stale-while-revalidate=600');
    res.end();
  } catch (e) {
    res.status(500).json({ error: 'cdn redirect failed', message: String(e) });
  }
}
