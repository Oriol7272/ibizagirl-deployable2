export const config = { runtime: 'nodejs' };

function sendJS(code, body, extraHeaders={}) {
  return new Response(body, {
    status: code,
    headers: {
      'content-type': 'application/javascript; charset=utf-8',
      'cache-control': 'public, max-age=60',
      ...extraHeaders
    }
  });
}

export default async function handler(req) {
  // Kill-switch definitivo del legacy splash
  return sendJS(200, '// ERO legacy splash disabled');
}
