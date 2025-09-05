export const config = { runtime: 'edge' };

/**
 * Loader para EroAdvertising (eaCtrl).
 * Acepta por query: space (spaceid), pid, ctrl (ctrlid), display (id del div destino).
 * Si no pasas query, intenta leer de variables de entorno:
 *   EROADVERTISING_SPACE, EROADVERTISING_PID, EROADVERTISING_CTRL
 */
export default async function handler(req) {
  const { searchParams } = new URL(req.url);

  const space = searchParams.get('space') || (globalThis.process?.env?.EROADVERTISING_SPACE || '');
  const pid   = searchParams.get('pid')   || (globalThis.process?.env?.EROADVERTISING_PID   || '');
  const ctrl  = searchParams.get('ctrl')  || (globalThis.process?.env?.EROADVERTISING_CTRL  || '');

  if (!space || !pid || !ctrl) {
    const msg = `// missing params. Need space,pid,ctrl. got space=${space} pid=${pid} ctrl=${ctrl}`;
    return new Response(msg, { headers: { 'content-type': 'application/javascript; charset=utf-8' }, status: 400 });
  }

  // id del DIV donde pintará el banner (por defecto, estilo original "sp_<space>_node")
  const display = searchParams.get('display') || `sp_${space}_node`;

  // script oficial de Ero (eaCtrl):
  const upstream = `https://go.easrv.cl/loadeactrl.go?pid=${encodeURIComponent(pid)}&spaceid=${encodeURIComponent(space)}&ctrlid=${encodeURIComponent(ctrl)}`;

  const js = `// loader eaCtrl (via ibizagirl.pics) - space=${space}
(function(){
  try{
    var d=${JSON.stringify(display)};
    if(!window.eaCtrl){
      window.eaCtrlRecs=[];
      window.eaCtrl={add:function(ag){window.eaCtrlRecs.push(ag)}};
      var js=document.createElement('script');
      js.src=${JSON.stringify(upstream)};
      js.async=true;
      js.referrerPolicy='unsafe-url';
      document.head.appendChild(js);
    }
    // registra el slot
    window.eaCtrl.add({"display":d,"sid":${JSON.stringify(space)},"plugin":"banner"});
  }catch(e){}
})();`;

  return new Response(js, {
    headers: {
      'content-type': 'application/javascript; charset=utf-8',
      'cache-control': 'public, max-age=300'
    }
  });
}
