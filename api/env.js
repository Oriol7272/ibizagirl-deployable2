export const config = { runtime: 'nodejs' };

export default function handler(req, res) {
  const payload = `// env bootstrap (ads)
(function(w){
  w.__ENV = Object.assign(w.__ENV||{}, {
    EXOCLICK_ZONE: ${JSON.stringify(process.env.EXOCLICK_ZONE || '')},
    POPADS_SITE_ID: ${JSON.stringify(process.env.POPADS_SITE_ID || '')}
  });
  console.log && console.log('IBG_ADS ZONES ->', w.__ENV);
})(window);`;
  res.setHeader('content-type','application/javascript; charset=utf-8');
  res.status(200).send(payload);
}
