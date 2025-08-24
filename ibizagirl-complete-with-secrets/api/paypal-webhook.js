import { request } from 'undici'
export const config = { api: { bodyParser: false } }
function buffer(req){ return new Promise((resolve,reject)=>{const c=[];req.on('data',d=>c.push(d));req.on('end',()=>resolve(Buffer.concat(c)));req.on('error',reject)}) }
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).send('Method not allowed')
  const raw = await buffer(req); const event = JSON.parse(raw.toString('utf8'))
  // TODO: Verify PayPal signature (Webhook ID etc.).
  const payer = event?.resource?.payer?.payer_id || event?.resource?.subscriber?.payer_id || 'anon'
  const site = process.env.SITE_URL || ''
  await request(`${site}/api/issue-token`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ userId: payer, status:'active' }) })
  res.status(200).json({ ok:true })
}
