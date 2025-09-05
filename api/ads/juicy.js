export const config = { runtime: 'edge' };
export default async function handler() {
  const up = 'https://js.juicyads.com/jp.js';
  const r = await fetch(up, { headers: { 'user-agent':'Mozilla/5.0' } });
  const txt = await r.text();
  return new Response(txt, {
    headers: {
      'content-type':'application/javascript; charset=utf-8',
      'cache-control':'public, max-age=300'
    }
  });
}
