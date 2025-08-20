// =====================================================   
// twitter-bot-FIXED.js - Bot promocional para IbizaGirl.pics
// VERSIÓN CORREGIDA CON RATE LIMITING Y MANEJO DE ERRORES 429
// =====================================================
  
const { TwitterApi } = require('twitter-api-v2');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './twitter.env' });

// ⚠️ CONFIGURACIÓN CON RATE LIMITING
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// 🛡️ CONFIGURACIÓN DE RATE LIMITING
const RATE_LIMITS = {
  TWEETS_PER_15_MIN: 10,    // Límite conservador (real es 17)
  MIN_DELAY_BETWEEN_TWEETS: 180000,  // 3 minutos entre tweets
  RETRY_DELAYS: [60000, 300000, 600000], // 1min, 5min, 10min
  MAX_RETRIES: 3
};

// 📊 TRACKING DE RATE LIMITS
let tweetCounter = 0;
let lastTweetTime = 0;
let errorCount = 0;

// Templates más cortos (para evitar límites de caracteres)
const TWEET_TEMPLATES = [
  "🌊 NEW UPDATE! 200+ fresh photos at ibizagirl.pics 🏝️ Daily paradise content! 🔥",
  "☀️ Today's Mediterranean content is LIVE! 🏖️ Fresh paradise photos ✨ ibizagirl.pics",
  "🎬 FRESH DROP: 40 new beach videos + 200 HD photos! 🌺 ibizagirl.pics",
  "💎 VIP SPECIAL: €100 lifetime or €15/month! 🌊 500+ photos daily! ibizagirl.pics",
  "🔥 MEGA PACK -70% OFF! 🎁 Huge savings 💰 ibizagirl.pics",
  "🏝️ Ibiza's hidden beaches! New content every morning 🌅 ibizagirl.pics",
  "✨ Fresh Mediterranean paradise! 🌊 Daily rotation! ibizagirl.pics",
  "🎯 Daily updates ✅ 200+ photos ✅ PayPal secure ✅ ibizagirl.pics",
  "🌺 Wake up to paradise! New Ibiza content 🏖️ ibizagirl.pics"
];

const HASHTAG_POOLS = [
  ["#Ibiza", "#IbizaLife", "#Paradise"],
  ["#BeachLife", "#BeachVibes", "#OceanLife"],
  ["#Mediterranean", "#IslandLife", "#Spain"],
  ["#Premium", "#VIPAccess", "#DailyUpdates"]
];

// 🔄 FUNCIÓN DE DELAY CON EXPONENTIAL BACKOFF
async function delay(ms) {
  console.log(`⏰ Esperando ${Math.round(ms/1000)}s antes del siguiente request...`);
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 🛡️ VERIFICAR RATE LIMITS ANTES DE TWEET
function canTweet() {
  const now = Date.now();
  const timeSinceLastTweet = now - lastTweetTime;
  
  if (timeSinceLastTweet < RATE_LIMITS.MIN_DELAY_BETWEEN_TWEETS) {
    const waitTime = RATE_LIMITS.MIN_DELAY_BETWEEN_TWEETS - timeSinceLastTweet;
    console.log(`⏳ Esperando ${Math.round(waitTime/1000)}s por rate limiting...`);
    return false;
  }
  
  if (tweetCounter >= RATE_LIMITS.TWEETS_PER_15_MIN) {
    console.log('⚠️ Límite de tweets alcanzado. Esperando reset...');
    return false;
  }
  
  return true;
}

// 🔍 OBTENER IMAGEN CORREGIDA (busca en el directorio correcto)
function getRandomImage() {
  // Buscar en el directorio correcto de la web
  const possiblePaths = [
    '../full/',
    './public/assets/full/',
    '../public/assets/full/',
    './full/',
    path.join(__dirname, '../full/'),
    path.join(__dirname, '../../../full/')
  ];
  
  for (const imagesDir of possiblePaths) {
    console.log(`🔍 Buscando en: ${path.resolve(imagesDir)}`);
    
    if (!fs.existsSync(imagesDir)) {
      continue;
    }
    
    try {
      const files = fs.readdirSync(imagesDir);
      console.log(`📋 Archivos encontrados: ${files.length}`);
      
      // Buscar archivos de imagen (webp, jpg, jpeg, png)
      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.webp', '.jpg', '.jpeg', '.png'].includes(ext);
      });
      
      console.log(`📸 Imágenes encontradas: ${imageFiles.length}`);
      
      if (imageFiles.length > 0) {
        const randomIndex = Math.floor(Math.random() * imageFiles.length);
        const selectedImage = imageFiles[randomIndex];
        const fullPath = path.join(imagesDir, selectedImage);
        
        try {
          const stats = fs.statSync(fullPath);
          console.log(`✅ Imagen seleccionada: ${selectedImage} (${Math.round(stats.size / 1024)}KB)`);
          return fullPath;
        } catch (error) {
          console.log(`❌ Error leyendo imagen: ${error.message}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Error en directorio: ${error.message}`);
    }
  }
  
  console.log('❌ No se encontraron imágenes en ningún directorio');
  return null;
}

// 📝 GENERAR TWEET MÁS CORTO
function generateTweet() {
  const template = TWEET_TEMPLATES[Math.floor(Math.random() * TWEET_TEMPLATES.length)];
  const hashtagSet = HASHTAG_POOLS[Math.floor(Math.random() * HASHTAG_POOLS.length)];
  
  return `${template}\n\n${hashtagSet.join(" ")}`;
}

// 🔐 VERIFICAR CONEXIÓN CON RETRY
async function verifyTwitterConnection(retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔍 Intento de conexión ${attempt}/${retries}...`);
      await delay(2000); // 2 segundos entre intentos
      
      const user = await client.currentUser();
      console.log(`✅ Conectado como: @${user.screen_name}`);
      return true;
      
    } catch (error) {
      console.error(`❌ Intento ${attempt} fallido:`, error.message);
      
      if (error.code === 429) {
        console.log('⚠️ Error 429 en verificación - esperando 15 minutos...');
        await delay(900000); // 15 minutos
      } else if (attempt < retries) {
        await delay(5000); // 5 segundos antes del siguiente intento
      }
    }
  }
  
  return false;
}

// 📤 PUBLICAR TWEET CON MANEJO COMPLETO DE ERRORES
async function safeTweet(tweetData, description = "Tweet") {
  if (!canTweet()) {
    console.log('⏸️ Tweet cancelado por rate limiting');
    return null;
  }
  
  for (let attempt = 1; attempt <= RATE_LIMITS.MAX_RETRIES; attempt++) {
    try {
      console.log(`📤 Publicando ${description} (intento ${attempt})...`);
      
      // Rate limiting preventivo
      await delay(3000);
      
      const result = await client.v2.tweet(tweetData);
      
      // ✅ ÉXITO
      console.log(`✅ ${description} publicado exitosamente!`);
      console.log(`🔗 https://twitter.com/i/status/${result.data.id}`);
      
      // Actualizar contadores
      lastTweetTime = Date.now();
      tweetCounter++;
      errorCount = 0;
      
      // Log
      logTweet(`[ÉXITO] ${tweetData.text || tweetData}`);
      
      return result;
      
    } catch (error) {
      console.error(`❌ Error en intento ${attempt}:`, error.message);
      
      if (error.code === 429) {
        console.log('🚫 ERROR 429 - Rate limit excedido');
        const waitTime = RATE_LIMITS.RETRY_DELAYS[attempt - 1] || 600000;
        console.log(`⏰ Esperando ${waitTime/1000/60} minutos...`);
        await delay(waitTime);
        
      } else if (error.code === 403) {
        console.log('🚫 ERROR 403 - Contenido duplicado o prohibido');
        break; // No reintentar
        
      } else if (attempt < RATE_LIMITS.MAX_RETRIES) {
        await delay(30000); // 30 segundos
      }
      
      errorCount++;
    }
  }
  
  console.log(`❌ ${description} falló después de ${RATE_LIMITS.MAX_RETRIES} intentos`);
  return null;
}

// 📸 TWEET CON IMAGEN SEGURO
async function tweetWithImageSafe() {
  console.log('\n📸 Preparando tweet con imagen...');
  
  const imagePath = getRandomImage();
  
  if (!imagePath) {
    console.log('⚠️ Sin imágenes disponibles, publicando solo texto');
    return await tweetTextSafe();
  }
  
  try {
    // Subir imagen con retry
    console.log('📤 Subiendo imagen a Twitter...');
    await delay(2000);
    
    const mediaUpload = await client.v1.uploadMedia(imagePath);
    console.log(`✅ Imagen subida: ${mediaUpload}`);
    
    const tweetText = generateTweet();
    
    const tweetData = {
      text: tweetText,
      media: { media_ids: [mediaUpload] }
    };
    
    return await safeTweet(tweetData, "Tweet con imagen");
    
  } catch (error) {
    console.error('❌ Error subiendo imagen:', error.message);
    console.log('🔄 Intentando tweet de texto...');
    return await tweetTextSafe();
  }
}

// 📝 TWEET DE TEXTO SEGURO
async function tweetTextSafe() {
  console.log('\n📝 Preparando tweet de texto...');
  
  const tweetText = generateTweet();
  return await safeTweet(tweetText, "Tweet de texto");
}

// 📊 RESETEAR CONTADORES CADA 15 MINUTOS
function resetRateLimitCounters() {
  tweetCounter = 0;
  console.log('🔄 Contadores de rate limit reseteados');
}

// 📋 LOG MEJORADO
function logTweet(content) {
  const timestamp = new Date().toISOString();
  const stats = `Tweets: ${tweetCounter}/${RATE_LIMITS.TWEETS_PER_15_MIN}, Errores: ${errorCount}`;
  const logEntry = `[${timestamp}] ${content}\nEstats: ${stats}\n${'='.repeat(50)}\n`;
  
  try {
    fs.appendFileSync('./logs/twitter-bot.log', logEntry);
  } catch (error) {
    console.error('❌ Error escribiendo log:', error.message);
  }
}

// 📊 ESTADÍSTICAS MEJORADAS
function showBotStats() {
  console.log('\n📊 ESTADÍSTICAS DEL BOT');
  console.log('='.repeat(30));
  console.log(`⏰ Hora actual: ${new Date().toLocaleString('es-ES')}`);
  console.log(`🐦 Tweets publicados: ${tweetCounter}/${RATE_LIMITS.TWEETS_PER_15_MIN}`);
  console.log(`❌ Errores consecutivos: ${errorCount}`);
  console.log(`📝 Templates disponibles: ${TWEET_TEMPLATES.length}`);
  console.log(`#️⃣ Sets de hashtags: ${HASHTAG_POOLS.length}`);
  console.log('\n🔒 PROTECCIÓN ANTI-429:');
  console.log(`• Límite: ${RATE_LIMITS.TWEETS_PER_15_MIN} tweets/15min`);
  console.log(`• Delay mínimo: ${RATE_LIMITS.MIN_DELAY_BETWEEN_TWEETS/1000}s`);
  console.log(`• Reintentos: ${RATE_LIMITS.MAX_RETRIES}`);
  console.log('='.repeat(30));
}

// 🚀 INICIAR BOT CON PROTECCIONES
async function startBot() {
  console.log('═'.repeat(50));
  console.log('  🛡️ IBIZAGIRL.PICS TWITTER BOT (SAFE MODE) 🛡️  ');
  console.log('═'.repeat(50));
  
  // Crear directorio de logs
  if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
  }
  
  console.log('\n🔐 Verificando conexión a Twitter...');
  const connected = await verifyTwitterConnection();
  if (!connected) {
    console.error('❌ Error de conexión. Verifica credenciales.');
    process.exit(1);
  }
  
  showBotStats();
  
  // Reset de contadores cada 15 minutos
  setInterval(resetRateLimitCounters, 15 * 60 * 1000);
  
  console.log('\n✅ Configurando trabajos SEGUROS...\n');
  
  // ⏰ PROGRAMACIÓN MENOS AGRESIVA
  
  // Tweet con imagen cada 8 horas (3 tweets/día)
  cron.schedule('0 */8 * * *', () => {
    console.log('\n📸 Ejecutando tweet programado con imagen...');
    tweetWithImageSafe();
  });
  
  // Tweet de texto cada 12 horas (2 tweets/día)  
  cron.schedule('0 */12 * * *', () => {
    console.log('\n📝 Ejecutando tweet de texto programado...');
    tweetTextSafe();
  });
  
  // Tweet de actualización diaria a las 3:30 AM
  cron.schedule('30 3 * * *', async () => {
    console.log('\n🌅 Tweet de actualización diaria...');
    const updateTweet = `🎉 DAILY UPDATE COMPLETE! 🎉\n\n✨ 200 new photos\n🎬 40 new videos\n🌊 Fresh paradise content\n\nibizagirl.pics\n\n#DailyUpdate #Ibiza #Paradise`;
    await safeTweet(updateTweet, "Actualización diaria");
  });
  
  console.log('\n🚀 Publicando tweet inicial (después de 10 segundos)...');
  setTimeout(async () => {
    await tweetWithImageSafe();
  }, 10000);
  
  console.log('\n✅ Bot SEGURO funcionando. Presiona Ctrl+C para detener.\n');
}

// 🛑 MANEJO DE CIERRE
process.on('SIGINT', () => {
  console.log('\n\n🛑 Deteniendo bot seguramente...');
  console.log(`📊 Stats finales: ${tweetCounter} tweets publicados, ${errorCount} errores`);
  console.log('✅ Bot detenido');
  process.exit(0);
});

// 🚀 INICIAR
startBot().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});