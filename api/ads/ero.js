export default async function handler(req, res) {
  try {
    const zone = (req.query.zone || '').toString().trim();
    if (!zone) { res.status(400).send('// missing zone'); return; }

    const upstream = `https://syndication.ero-advertising.com/splash.php?idzone=${encodeURIComponent(zone)}`;

    const r = await fetch(upstream, {
      method: 'GET',
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'Referer': 'https://ibizagirl.pics/',
        'Accept': 'application/javascript,text/javascript;q=0.9,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      redirect: 'follow',
    });

    const txt = await r.text();
    res.setHeader('content-type', 'application/javascript; charset=utf-8');
    res.setHeader('cache-control', 'public, max-age=300');
    res.status(r.ok ? 200 : r.status).send(txt || '// empty');
  } catch (e) {
    console.error('ero proxy error', e);
    res.setHeader('content-type','application/javascript; charset=utf-8');
    res.status(502).send(`// proxy error: ${e.message || 'internal error'}`);
  }
}
