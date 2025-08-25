const { captureOrder } = require("./_client");
async function readBody(req){
  if (req.body && typeof req.body === "object") return req.body;
  const raw = await new Promise(resolve=>{ let d=""; req.on("data",c=>d+=c); req.on("end",()=>resolve(d)); });
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}
module.exports = async (req,res)=>{
  try{
    const { orderID } = await readBody(req);
    if (!orderID) return res.status(400).json({ok:false,error:"Missing orderID"});
    const out = await captureOrder(orderID);
    res.status(200).json({ ok:true, result: out });
  }catch(e){
    res.status(500).json({ ok:false, error:e.message, details:e.payload||null });
  }
};
