const { verifyWebhookSignature } = require("./_client");
async function readBody(req){
  if (req.body && typeof req.body === "object") return req.body;
  const raw = await new Promise(resolve=>{ let d=""; req.on("data",c=>d+=c); req.on("end",()=>resolve(d)); });
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}
module.exports = async (req,res)=>{
  try{
    const headers = Object.fromEntries(Object.entries(req.headers).map(([k,v])=>[k.toLowerCase(),v]));
    const body = await readBody(req);
    const valid = await verifyWebhookSignature(headers, body);
    if (!valid) return res.status(400).json({ ok:false, error:"Invalid signature" });
    console.log("[PAYPAL WEBHOOK]", body?.event_type);
    res.status(200).json({ ok:true });
  }catch(e){
    console.error("webhook error", e);
    res.status(500).json({ ok:false, error:e.message });
  }
};
