function setCookie(res, name, val, days=30, {httpOnly=true} = {}){
  const max = days*24*60*60;
  const parts = [
    `${name}=${encodeURIComponent(val)}`,
    'Path=/',
    `Max-Age=${max}`,
    'SameSite=Lax',
    'Secure'
  ];
  if (httpOnly) parts.push('HttpOnly');
  res.setHeader('Set-Cookie', [...(res.getHeader('Set-Cookie')||[]), parts.join('; ')]);
}

module.exports = async (req,res)=>{
  try{
    const tier = (req.query.tier||'').toString();
    if(!tier){ res.status(400).end('Missing tier'); return; }

    // Server (HttpOnly) para gate
    setCookie(res,'ibg_sub', tier, 30, { httpOnly:true });
    // UI (no HttpOnly) para quitar blur en el front
    setCookie(res,'ibg_sub_ui', tier, 30, { httpOnly:false });

    res.status(302).setHeader('Location','/index.html?sub=ok');
    res.end();
  }catch(e){
    res.status(500).end('Server error');
  }
};
