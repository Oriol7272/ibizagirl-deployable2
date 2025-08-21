function setCookie(res, name, val, days=30){
  const max = days*24*60*60;
  res.setHeader('Set-Cookie', `${name}=${encodeURIComponent(val)}; Path=/; Max-Age=${max}; SameSite=Lax; HttpOnly; Secure`);
}
module.exports = async (req,res)=>{
  try{
    const tier = (req.query.tier||'').toString();
    if(!tier){ res.status(400).end('Missing tier'); return; }
    setCookie(res,'ibg_sub', tier, 30);
    res.status(302).setHeader('Location','/index.html?sub=ok');
    res.end();
  }catch(e){
    res.status(500).end('Server error');
  }
};
