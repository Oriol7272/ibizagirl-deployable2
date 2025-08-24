import { SignJWT } from 'jose'
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')
  const { userId, status='active' } = req.body || {}
  if (!userId) return res.status(400).send('userId required')
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const token = await new SignJWT({ status })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(userId))
    .setIssuer(process.env.JWT_ISSUER || 'ibizagirl')
    .setAudience(process.env.JWT_AUDIENCE || 'premium-users')
    .setExpirationTime('30d').sign(secret)
  res.setHeader('Set-Cookie', `ibiza_token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Secure`)
  res.json({ token })
}
