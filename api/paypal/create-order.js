const { createOrder } = require("./_client");
async function readBody(req){
  if (req.body && typeof req.body === "object") return req.body;
  const raw = await new Promise(resolve=>{ let d=""; req.on("data",c=>d+=c); req.on("end",()=>resolve(d)); });
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}
module.exports = async (req,res)=>{
  try{
    const { sku, quantity=1, currency="EUR", brand="IBIZA GIRL" } = await readBody(req);
    if (!sku) return res.status(400).json({ok:false,error:"Missing sku"});
    const out = await createOrder({ sku, quantity, currency, brand });
    res.status(201).json({ ok:true, id: out.id });
  }catch(e){
    res.status(500).json({ ok:false, error:e.message, details:e.payload||null });
  }
};
