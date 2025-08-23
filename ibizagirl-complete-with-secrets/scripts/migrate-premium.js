import fs from 'fs'
import path from 'path'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

function env(n, fb=''){ const v = process.env[n]; return v ?? fb }
const BUCKET = env('S3_BUCKET')
if(!BUCKET){ console.error('S3_BUCKET is required'); process.exit(1) }
const client = new S3Client({
  region: env('S3_REGION'),
  endpoint: env('S3_ENDPOINT') || undefined,
  forcePathStyle: !!env('S3_ENDPOINT'),
  credentials: { accessKeyId: env('S3_ACCESS_KEY_ID'), secretAccessKey: env('S3_SECRET_ACCESS_KEY') }
})

const roots = ['public/uncensored', 'public/uncensored-videos', 'premium']
for (const root of roots) {
  if (!fs.existsSync(root)) continue
  const stack = [root]
  while (stack.length) {
    const dir = stack.pop()
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name)
      const stat = fs.statSync(full)
      if (stat.isDirectory()) { stack.push(full); continue }
      const key = full.replace(/^public\//,'').replace(/^premium\//,'')
      const Body = fs.readFileSync(full)
      client.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body })).then(()=>{
        console.log('Uploaded', key)
      }).catch(err => console.error('Failed', key, err))
    }
  }
}
