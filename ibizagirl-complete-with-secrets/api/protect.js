import { SignJWT, jwtVerify } from 'jose'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

function env(n, fb=''){ const v = process.env[n]; return v ?? fb }

const JWT_SECRET = new TextEncoder().encode(env('JWT_SECRET', 'CHANGE_ME'))
const JWT_ISSUER = env('JWT_ISSUER', 'ibizagirl')
const JWT_AUDIENCE = env('JWT_AUDIENCE', 'premium-users')

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { issuer: JWT_ISSUER, audience: JWT_AUDIENCE })
    return payload
  } catch { return null }
}

function getTokenFromReq(req) {
  const auth = req.headers['authorization'] || ''
  if (auth.startsWith('Bearer ')) return auth.slice(7)
  const cookie = (req.headers['cookie'] || '').split(/;\s*/).find(c => c.startsWith('ibiza_token='))
  if (cookie) return decodeURIComponent(cookie.split('=')[1])
  return null
}

function s3Client() {
  const region = env('S3_REGION')
  const endpoint = env('S3_ENDPOINT') || undefined
  const cfg = {
    region,
    ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
    credentials: { accessKeyId: env('S3_ACCESS_KEY_ID'), secretAccessKey: env('S3_SECRET_ACCESS_KEY') }
  }
  return new S3Client(cfg)
}

export default async function handler(req, res) {
  const { path = '' } = req.query
  const token = getTokenFromReq(req)
  const payload = token ? await verifyToken(token) : null

  if (!payload || payload.status !== 'active') {
    res.status(302).setHeader('Location', `/subscribe.html?next=/premium/${encodeURIComponent(path)}`)
    return res.end()
  }

  const bucket = process.env.S3_BUCKET
  const key = path
  try {
    const client = s3Client()
    const cmd = new GetObjectCommand({ Bucket: bucket, Key: key })
    const url = await getSignedUrl(client, cmd, { expiresIn: 60 })
    res.status(302).setHeader('Location', url)
    return res.end()
  } catch (e) {
    console.error(e)
    res.status(404).send('Not found')
  }
}
