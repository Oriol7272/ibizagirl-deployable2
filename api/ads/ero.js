export default async function handler(req, res) {
  try {
    const url = new URL(req.url || req.headers['x-forwarded-url'] || 'http://x');
    const zone = url.searchParams.get('zone') || (req.query && req.query.zone);
    if (!zone) {
      res.status(400).setHeader('content-type','text/plain; charset=utf-8');
      return res.end('// missing ?zone');
    }

    const upstream = `https://syndication.ero-advertising.com/splash.php?idzone=${encodeURIComponent(zone)}`;

    const r = await fetch(upstream, {
      // Pedimos como si fuéramos un navegador real
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36',
        'accept': 'application/javascript,text/javascript,*/*;q=0.1',
        'referer': 'https://ibizagirl.pics/',
        'accept-language': 'en-US,en;q=0.9,es;q=0.8'
      },
      // Evita compresión rara que a veces rompe en algunos proxys
      redirect: 'follow',
    });

    const body = await r.text();
    res.status(200);
    res.setHeader('content-type', 'application/javascript; charset=utf-8');
    res.setHeader('cache-control', 'public, max-age=180');
    return res.end(body);
  } catch (err) {
    res.status(502).setHeader('content-type','text/plain; charset=utf-8');
    return res.end(`// proxy error: ${err.message}`);
  }
}
