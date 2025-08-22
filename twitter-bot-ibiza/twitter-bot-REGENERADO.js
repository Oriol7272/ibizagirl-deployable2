// =====================================================   
// twitter-bot-REGENERADO.js - Bot para IbizaGirl.pics
// VERSIÓN REGENERADA CON NUEVAS CREDENCIALES 2025
// =====================================================
  
const { TwitterApi } = require('twitter-api-v2');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './twitter-NEW.env' });

// 🔑 CONFIGURACIÓN CON NUEVAS CREDENCIALES
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// 🛡️ CONFIGURACIÓN DE RATE LIMITING MEJORADA
const RATE_LIMITS = {
  TWEETS_PER_15_MIN: 8,     // Muy conservador
  MIN_DELAY_BETWEEN_TWEETS: 300000,  // 5 minutos entre tweets
  RETRY_DELAYS: [120000, 600000, 1200000], // 2min, 10min, 20min
  MAX_RETRIES: 3,
  DAILY_TWEET_LIMIT: 15     // Máximo 15 tweets por día
};

// 📊 TRACKING AVANZADO
let dailyTweetCount = 0;
let tweetCounter = 0;
let lastTweetTime = 0;
let errorCount = 0;
let lastResetTime = Date.now();

// 📝 TEMPLATES OPTIMIZADOS (más cortos para evitar límites)
const TWEET_TEMPLATES = [
  "🌊 FRESH UPDATE! New paradise content at ibizagirl.pics 🏝️",
  "☀️ Mediterranean beauty LIVE! 🏖️ Fresh photos ✨ ibizagirl.pics",
  "🎬 NEW: Beach videos + HD photos! 🌺 ibizagirl.pics",
  "💎 VIP Access: €100 lifetime | €15/month! 🌊 ibizagirl.pics",
  "🔥 Special Offer! Paradise content 🎁 ibizagirl.pics",
  "🏝️ Ibiza's secrets! Daily updates 🌅 ibizagirl.pics",
  "✨ Fresh paradise content! 🌊 Daily rotation! ibizagirl.pics",
  "🎯 200+ photos ✅ Secure PayPal ✅ ibizagirl.pics",
  "🌺 Paradise awaits! New Ibiza content 🏖️ ibizagirl.pics",
  "🌊 Dive into paradise! Fresh daily content ✨ ibizagirl.pics"
];

const HASHTAG_POOLS = [
  ["#Ibiza", "#Paradise", "#BeachLife"],
  ["#Mediterranean", "#IslandLife", "#Spain"],
  ["#Premium", "#VIPAccess", "#Beach"],
  ["#Paradise", "#Tropical", "#Summer2025"]
];

// 🔄 DELAY CON LOGGING
async function delay(ms, reason = "Rate limiting") {
  console.log(`⏰ ${reason}: Esperando ${Math.round(ms/1000)}s...`);
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 🛡️ VERIFICACIÓN AVANZADA DE RATE LIMITS
function canTweet() {
  const now = Date.now();
  const timeSinceLastTweet = now - lastTweetTime;
  
  // Verificar límite diario
  if (dailyTweetCount >= RATE_LIMITS.DAILY_TWEET_LIMIT) {
    console.log(`🚫 Límite diario alcanzado: ${dailyTweetCount}/${RATE_LIMITS.DAILY_TWEET_LIMIT}`);
    return false;
  }
  
  // Verificar delay mínimo
  if (timeSinceLastTweet < RATE_LIMITS.MIN_DELAY_BETWEEN_TWEETS) {
    const waitTime = RATE_LIMITS.MIN_DELAY_BETWEEN_TWEETS - timeSinceLastTweet;
    console.log(`⏳ Muy pronto desde último tweet. Esperando ${Math.round(waitTime/1000)}s más...`);
    return false;
  }
  
  // Verificar contador de 15 minutos
  if (tweetCounter >= RATE_LIMITS.TWEETS_PER_15_MIN) {
    console.log(`⚠️ Límite de 15min alcanzado: ${tweetCounter}/${RATE_LIMITS.TWEETS_PER_15_MIN}`);
    return false;
  }
  
  return true;
}

// 🔍 BUSCAR IMÁGENES EN MÚLTIPLES UBICACIONES
function getRandomImage() {
  const possiblePaths = [
    '../full/',
    './full/',
    './images/',
    './public/assets/full/',
    '../assets/full/',
    path.join(__dirname, '../full/'),
    path.join(__dirname, '../../full/'),
    path.join(__dirname, '../../../full/'),
    '/Users/oriolcabre/Desktop/ibizagirl/full/',
    './assets/'
  ];
  
  console.log('🔍 Buscando imágenes en múltiples ubicaciones...');
  
  for (const imagesDir of possiblePaths) {
    const fullPath = path.resolve(imagesDir);
    console.log(`📁 Verificando: ${fullPath}`);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ No existe: ${fullPath}`);
      continue;
    }
    
    try {
      const files = fs.readdirSync(fullPath);
      
      if (files.length === 0) {
        console.log(`📂 Directorio vacío: ${fullPath}`);
        continue;
      }
      
      // Buscar archivos de imagen
      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.webp', '.jpg', '.jpeg', '.png', '.gif'].includes(ext);
      });
      
      console.log(`📸 Imágenes en ${fullPath}: ${imageFiles.length}`);
      
      if (imageFiles.length > 0) {
        const randomIndex = Math.floor(Math.random() * imageFiles.length);
        const selectedImage = imageFiles[randomIndex];
        const imagePath = path.join(fullPath, selectedImage);
        
        try {
          const stats = fs.statSync(imagePath);
          const sizeKB = Math.round(stats.size / 1024);
          
          // Verificar tamaño (Twitter límite: 5MB)
          if (stats.size > 5 * 1024 * 1024) {
            console.log(`⚠️ Imagen muy grande (${sizeKB}KB): ${selectedImage}`);
            continue;
          }
          
          console.log(`✅ Imagen seleccionada: ${selectedImage} (${sizeKB}KB)`);
          return imagePath;
          
        } catch (statError) {
          console.log(`❌ Error leyendo stats: ${statError.message}`);
          continue;
        }
      }
      
    } catch (readError) {
      console.log(`❌ Error leyendo directorio ${fullPath}: ${readError.message}`);
      continue;
    }
  }
  
  console.log('❌ No se encontraron imágenes válidas en ninguna ubicación');
  return null;
}

// 📝 GENERAR TWEET OPTIMIZADO
function generateTweet() {
  const template = TWEET_TEMPLATES[Math.floor(Math.random() * TWEET_TEMPLATES.length)];
  const hashtagSet = HASHTAG_POOLS[Math.floor(Math.random() * HASHTAG_POOLS.length)];
  
  const tweet = `${template}\n\n${hashtagSet.join(" ")}`;
  
  // Verificar longitud (límite Twitter: 280 caracteres)
  if (tweet.length > 280) {
    console.log(`⚠️ Tweet demasiado largo (${tweet.length} chars), recortando...`);
    return template; // Solo template sin hashtags si es muy largo
  }
  
  return tweet;
}

// 🔐 VERIFICAR CONEXIÓN CON NUEVAS CREDENCIALES
async function verifyTwitterConnection(retries = 3) {
  console.log('🔐 Verificando nuevas credenciales de Twitter...');
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔍 Intento ${attempt}/${retries}...`);
      
      // Delay antes de cada intento
      if (attempt > 1) {
        await delay(5000, "Reintento de conexión");
      }
      
      const user = await client.currentUser();
      console.log(`✅ ¡CONECTADO EXITOSAMENTE!`);
      console.log(`👤 Usuario: @${user.screen_name}`);
      console.log(`👥 Followers: ${user.followers_count}`);
      console.log(`📝 Tweets: ${user.statuses_count}`);
      return true;
      
    } catch (error) {
      console.error(`❌ Intento ${attempt} fallido:`, error.message);
      
      if (error.code === 401) {
        console.log('🚫 ERROR 401: Credenciales inválidas o expiradas');
        if (attempt === retries) {
          console.log('💡 Verifica que las credenciales sean correctas en twitter-NEW.env');
          return false;
        }
      } else if (error.code === 429) {
        console.log('⚠️ ERROR 429: Rate limit en verificación - esperando...');
        await delay(60000, "Rate limit de verificación");
      } else if (attempt < retries) {
        await delay(10000, "Error de conexión");
      }
    }
  }
  
  return false;
}

// 📤 TWEET SEGURO CON MANEJO COMPLETO DE ERRORES
async function safeTweet(tweetData, description = "Tweet") {
  if (!canTweet()) {
    console.log(`⏸️ ${description} cancelado por rate limiting`);
    return null;
  }
  
  console.log(`\n📤 Intentando publicar ${description}...`);
  
  for (let attempt = 1; attempt <= RATE_LIMITS.MAX_RETRIES; attempt++) {
    try {
      console.log(`🔄 Intento ${attempt}/${RATE_LIMITS.MAX_RETRIES}...`);
      
      // Delay preventivo
      await delay(3000, "Delay preventivo");
      
      const result = await client.v2.tweet(tweetData);
      
      // ✅ ÉXITO TOTAL
      console.log(`🎉 ¡${description} PUBLICADO EXITOSAMENTE!`);
      console.log(`🔗 URL: https://twitter.com/i/status/${result.data.id}`);
      console.log(`📊 Stats: Diarios ${dailyTweetCount + 1}/${RATE_LIMITS.DAILY_TWEET_LIMIT}, 15min ${tweetCounter + 1}/${RATE_LIMITS.TWEETS_PER_15_MIN}`);
      
      // Actualizar contadores
      lastTweetTime = Date.now();
      tweetCounter++;
      dailyTweetCount++;
      errorCount = 0;
      
      // Log exitoso
      logTweet(`✅ [ÉXITO] ${tweetData.text || tweetData}`);
      
      return result;
      
    } catch (error) {
      console.error(`❌ Error en intento ${attempt}:`, error.message);
      errorCount++;
      
      if (error.code === 429) {
        console.log('🚫 ERROR 429 - Rate limit excedido');
        const waitTime = RATE_LIMITS.RETRY_DELAYS[attempt - 1] || 1200000;
        console.log(`⏰ Esperando ${waitTime/1000/60} minutos antes del siguiente intento...`);
        await delay(waitTime, "Recuperación de rate limit");
        
      } else if (error.code === 403) {
        console.log('🚫 ERROR 403 - Contenido duplicado/prohibido');
        logTweet(`❌ [ERROR 403] ${tweetData.text || tweetData}`);
        break; // No reintentar contenido prohibido
        
      } else if (error.code === 401) {
        console.log('🚫 ERROR 401 - Credenciales inválidas');
        logTweet(`❌ [ERROR 401] Credenciales inválidas`);
        break; // No reintentar con credenciales malas
        
      } else if (attempt < RATE_LIMITS.MAX_RETRIES) {
        await delay(60000, "Error genérico - reintento");
      }
    }
  }
  
  console.log(`💥 ${description} FALLÓ después de ${RATE_LIMITS.MAX_RETRIES} intentos`);
  logTweet(`❌ [FALLO FINAL] ${tweetData.text || tweetData}`);
  return null;
}

// 📸 TWEET CON IMAGEN ULTRA SEGURO
async function tweetWithImageSafe() {
  console.log('\n📸 === TWEET CON IMAGEN ===');
  
  const imagePath = getRandomImage();
  
  if (!imagePath) {
    console.log('⚠️ Sin imágenes disponibles - cambiando a tweet de texto');
    return await tweetTextSafe();
  }
  
  try {
    console.log(`📤 Subiendo imagen: ${path.basename(imagePath)}`);
    await delay(3000, "Preparación de imagen");
    
    const mediaUpload = await client.v1.uploadMedia(imagePath);
    console.log(`✅ Imagen subida exitosamente: ${mediaUpload}`);
    
    const tweetText = generateTweet();
    console.log(`📝 Texto generado: "${tweetText}"`);
    
    const tweetData = {
      text: tweetText,
      media: { media_ids: [mediaUpload] }
    };
    
    return await safeTweet(tweetData, "Tweet con imagen");
    
  } catch (uploadError) {
    console.error('❌ Error subiendo imagen:', uploadError.message);
    console.log('🔄 Fallback: Intentando tweet de solo texto...');
    return await tweetTextSafe();
  }
}

// 📝 TWEET DE TEXTO ULTRA SEGURO
async function tweetTextSafe() {
  console.log('\n📝 === TWEET DE TEXTO ===');
  
  const tweetText = generateTweet();
  console.log(`📝 Texto generado: "${tweetText}"`);
  
  return await safeTweet(tweetText, "Tweet de texto");
}

// 🔄 RESET DE CONTADORES
function resetRateLimitCounters() {
  tweetCounter = 0;
  console.log(`🔄 Contadores 15min reseteados. Tweets diarios: ${dailyTweetCount}`);
}

function resetDailyCounters() {
  dailyTweetCount = 0;
  tweetCounter = 0;
  console.log('🌅 Contadores diarios reseteados - nuevo día comenzado');
}

// 📋 LOGGING DETALLADO
function logTweet(content) {
  const timestamp = new Date().toISOString();
  const stats = `Daily: ${dailyTweetCount}/${RATE_LIMITS.DAILY_TWEET_LIMIT} | 15min: ${tweetCounter}/${RATE_LIMITS.TWEETS_PER_15_MIN} | Errores: ${errorCount}`;
  const logEntry = `[${timestamp}] ${content}\n📊 ${stats}\n${'='.repeat(60)}\n`;
  
  try {
    // Crear directorio de logs si no existe
    if (!fs.existsSync('./logs')) {
      fs.mkdirSync('./logs');
    }
    
    fs.appendFileSync('./logs/twitter-bot.log', logEntry);
  } catch (error) {
    console.error('❌ Error escribiendo log:', error.message);
  }
}

// 📊 ESTADÍSTICAS COMPLETAS
function showBotStats() {
  const now = new Date();
  console.log('\n📊 === ESTADÍSTICAS DEL BOT REGENERADO ===');
  console.log('='.repeat(45));
  console.log(`🕐 Fecha/Hora: ${now.toLocaleString('es-ES')}`);
  console.log(`🐦 Tweets hoy: ${dailyTweetCount}/${RATE_LIMITS.DAILY_TWEET_LIMIT}`);
  console.log(`📈 Tweets (15min): ${tweetCounter}/${RATE_LIMITS.TWEETS_PER_15_MIN}`);
  console.log(`❌ Errores consecutivos: ${errorCount}`);
  console.log(`📝 Templates: ${TWEET_TEMPLATES.length} disponibles`);
  console.log(`#️⃣ Hashtag sets: ${HASHTAG_POOLS.length} rotativos`);
  
  console.log('\n🔒 CONFIGURACIÓN DE SEGURIDAD:');
  console.log(`• Límite diario: ${RATE_LIMITS.DAILY_TWEET_LIMIT} tweets`);
  console.log(`• Límite 15min: ${RATE_LIMITS.TWEETS_PER_15_MIN} tweets`);
  console.log(`• Delay mínimo: ${RATE_LIMITS.MIN_DELAY_BETWEEN_TWEETS/1000}s`);
  console.log(`• Reintentos máx: ${RATE_LIMITS.MAX_RETRIES}`);
  
  console.log('\n📅 PROGRAMACIÓN CONSERVADORA:');
  console.log('• Tweet con imagen: cada 12 horas');
  console.log('• Tweet de texto: cada 16 horas');
  console.log('• Tweet especial: 1 vez al día');
  console.log('='.repeat(45));
}

// 🚀 INICIALIZAR BOT REGENERADO
async function startBot() {
  console.log('═'.repeat(60));
  console.log('  🔥 IBIZAGIRL.PICS TWITTER BOT - REGENERADO 2025 🔥  ');
  console.log('  🔑 Con nuevas credenciales y protección máxima 🔑  ');
  console.log('═'.repeat(60));
  
  // Crear logs
  if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
    console.log('📁 Directorio de logs creado');
  }
  
  // Verificar conexión con nuevas credenciales
  console.log('\n🔐 Probando nuevas credenciales...');
  const connected = await verifyTwitterConnection();
  
  if (!connected) {
    console.error('💥 ERROR CRÍTICO: No se pudo conectar con las nuevas credenciales');
    console.log('💡 Verifica twitter-NEW.env y que las credenciales sean correctas');
    process.exit(1);
  }
  
  // Mostrar estadísticas
  showBotStats();
  
  // Configurar resets automáticos
  console.log('\n⚙️ Configurando resets automáticos...');
  
  // Reset cada 15 minutos
  setInterval(resetRateLimitCounters, 15 * 60 * 1000);
  
  // Reset diario a medianoche
  cron.schedule('0 0 * * *', resetDailyCounters);
  
  console.log('\n📅 Configurando trabajos ULTRA CONSERVADORES...');
  
  // ⏰ PROGRAMACIÓN SÚPER CONSERVADORA
  
  // Tweet con imagen cada 12 horas (2 tweets/día máximo)
  cron.schedule('0 */12 * * *', () => {
    console.log('\n🎬 === TRABAJO PROGRAMADO: IMAGEN ===');
    tweetWithImageSafe();
  });
  
  // Tweet de texto cada 16 horas (1-2 tweets/día)
  cron.schedule('0 */16 * * *', () => {
    console.log('\n📰 === TRABAJO PROGRAMADO: TEXTO ===');
    tweetTextSafe();
  });
  
  // Tweet especial diario a las 14:30
  cron.schedule('30 14 * * *', async () => {
    console.log('\n🌟 === TRABAJO PROGRAMADO: ESPECIAL DIARIO ===');
    const specialTweet = `🎉 Paradise Update! 🎉\n\n✨ Fresh Ibiza content daily\n🏖️ 200+ photos & 40+ videos\n🔥 VIP access available\n\nibizagirl.pics\n\n#DailyUpdate #Ibiza #Paradise`;
    await safeTweet(specialTweet, "Tweet especial diario");
  });
  
  console.log('\n🎯 Ejecutando tweet inicial en 15 segundos...');
  setTimeout(async () => {
    console.log('\n🚀 === TWEET INICIAL DE ARRANQUE ===');
    await tweetWithImageSafe();
  }, 15000);
  
  console.log('\n✅ BOT REGENERADO FUNCIONANDO - Modo Ultra Seguro Activado');
  console.log('🛡️ Protección máxima contra errores 429');
  console.log('🔥 Presiona Ctrl+C para detener\n');
  
  // Log de inicio
  logTweet('🚀 Bot regenerado iniciado con nuevas credenciales');
}

// 🛑 MANEJO DE CIERRE ELEGANTE
process.on('SIGINT', () => {
  console.log('\n\n🛑 Cerrando bot regenerado...');
  console.log(`📊 Estadísticas de sesión:`);
  console.log(`  • Tweets enviados hoy: ${dailyTweetCount}`);
  console.log(`  • Errores totales: ${errorCount}`);
  console.log(`  • Tiempo activo: ${Math.round((Date.now() - lastResetTime) / 1000 / 60)} minutos`);
  
  logTweet('🛑 Bot detenido por usuario');
  console.log('✅ ¡Hasta la próxima! Bot cerrado correctamente.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Bot terminado por el sistema');
  logTweet('🛑 Bot terminado por sistema');
  process.exit(0);
});

// 🚀 INICIAR EL BOT REGENERADO
console.log('🔄 Iniciando bot regenerado...');
startBot().catch(error => {
  console.error('💥 ERROR FATAL AL INICIAR BOT:', error);
  logTweet(`💥 ERROR FATAL: ${error.message}`);
  process.exit(1);
});