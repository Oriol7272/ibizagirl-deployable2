import {TwitterApi} from 'twitter-api-v2';

const cfg = {
  appKey:     process.env.TW_API_KEY,
  appSecret:  process.env.TW_API_SECRET,
  accessToken:process.env.TW_ACCESS_TOKEN,
  accessSecret:process.env.TW_ACCESS_SECRET
};
for (const [k,v] of Object.entries(cfg)) {
  if (!v) { console.error('Falta la env:', k); process.exit(1); }
}

const client = new TwitterApi(cfg).readWrite;

// Mensajes base (añade los tuyos)
const lines = [
  "☀️ Ibiza vibes y nuevas fotos: https://ibizagirl.pics",
  "💙 Galería renovada a diario. Lifetime = sin anuncios 👉 ibizagirl.pics",
  "🌊 Premium + Vídeos con updates diarios en ibizagirl.pics"
];

const pick = (arr)=> arr[Math.floor(Math.random()*arr.length)];
const text = pick(lines);

// Envía tweet
await client.v2.tweet(text);
console.log('Tweet enviado:', text);
