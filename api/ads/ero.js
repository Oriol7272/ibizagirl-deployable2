export default async function handler(req, res) {
  try {
    const zone = (req.query.zone || '').toString().trim();
    const debug = (req.query.debug || '') === '1';
    if (!zone) { res.status(400).send('// missing zone'); return; }

    const upstream = `https://syndication.ero-advertising.com/splash.php?idzone=${encodeURIComponent(zone)}`;

    const r = await fetch(upstream, {
      method: 'GET',
      headers: {
        'Host': 'syndication.ero-advertising.com',
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
        'Accept': 'application/javascript,text/javascript;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://ibizagirl.pics/',
        'Origin': 'https://ibizagirl.pics',
        'Sec-Fetch-Dest': 'script',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
        // Opcional: pasar IP del cliente por si el upstream lo usa para filtrado
        'X-Forwarded-For': (req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '').toString()
      },
      redirect: 'follow',
    });

    const txt = await r.text();
    res.setHeader('content-type', 'application/javascript; charset=utf-8');
    res.setHeader('cache-control', 'public, max-age=300');

    if (debug) {
      res.status(200).send([
        `// debug upstreamStatus=${r.status}`,
        `// url=${upstream}`,
        txt
      ].join('\n'));
      return;
    }
    res.status(r.ok ? 200 : r.status).send(txt || '// empty');
  } catch (e) {
    console.error('ero proxy error', e);
    res.setHeader('content-type','application/javascript; charset=utf-8');
    res.status(502).send(`// proxy error: ${e.message || 'internal error'}`);
  }
}
