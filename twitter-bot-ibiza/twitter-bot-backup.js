// =====================================================   
// twitter-bot.js - Bot promocional para IbizaGirl.pics
// VERSIÓN CORREGIDA CON DETECCIÓN AUTOMÁTICA DE IMÁGENES
// =====================================================
  
const { TwitterApi } = require('twitter-api-v2');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuración de Twitter API usando variables de entorno
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Templates de tweets promocionales
const TWEET_TEMPLATES = [
  "🌊 NEW DAILY UPDATE! 200+ fresh photos & 40+ videos just dropped at IbizaGirl.pics 🏝️ Paradise content updated every 24h! 🔥",
  "☀️ Today's exclusive Mediterranean content is LIVE! 🏖️ Discover 200 new paradise photos updated daily ✨ Join now: ibizagirl.pics",
  "🎬 FRESH DROP: 40 new 4K beach videos + 200 HD photos! 🌺 Updated daily at 3AM 🌅 Don't miss today's paradise collection!",
  "💎 VIP SPECIAL: Get lifetime access for €100 or monthly for just €15! 🌊 500+ photos, 80+ videos rotating daily! ibizagirl.pics",
  "🔥 TODAY ONLY: Mega Pack -70% OFF! 🎁 Unlock paradise content with huge savings 💰 Limited time offer at ibizagirl.pics",
  "🏝️ Experience Ibiza's hidden beaches! New exclusive content every morning 🌅 200 photos & 40 videos updated daily!",
  "✨ Just updated! Fresh Mediterranean paradise content 🌊 Daily rotation from 500+ photos & 80+ videos collection! Join the paradise: ibizagirl.pics",
  "🎯 Why choose us? ✅ Daily updates ✅ 200+ new photos ✅ 40+ new videos ✅ PayPal secure ✅ Instant access!",
  "🌺 Wake up to paradise! New Ibiza beach content waiting for you 🏖️ Updated every morning at 3AM! Don't miss today's selection 💕",
  "⚡ FLASH SALE: Bronze Pack only €15 (save 50%)! 🎁 Get 20 unlock credits now! Limited time at ibizagirl.pics",
  "🌴 Pure Ibiza paradise awaits! 🌊 Fresh daily content: 200+ photos & 40+ videos ✨ Your escape starts at ibizagirl.pics",
  "🏖️ Mediterranean magic updated! New exclusive beach content every day 🌅 Join the VIP experience: ibizagirl.pics",
  "💕 Daily dose of paradise! 🌺 200 new stunning photos + 40 new videos just added! Don't miss out: ibizagirl.pics",
  "🌊 Dive into Ibiza's secrets! 🏝️ Premium content updated 24/7 ✨ Lifetime access: €100 | Monthly: €15 | ibizagirl.pics",
  "🔥 WEEKEND VIBES! 🎉 New Ibiza content dropping now! 200+ photos, 40+ videos updated daily! Join at ibizagirl.pics"
];

// Sets de hashtags rotativos
const HASHTAG_POOLS = [
  ["#Ibiza", "#IbizaLife", "#IbizaBeach", "#IbizaParadise"],
  ["#BeachLife", "#BeachVibes", "#BeachParadise", "#OceanLife"],
  ["#Mediterranean", "#MediterraneanSea", "#Paradise", "#IslandLife"],
  ["#ExclusiveContent", "#Premium", "#VIPAccess", "#DailyUpdates"],
  ["#Spain", "#Balearic", "#Summer2025", "#TravelSpain"]
];

// FUNCIÓN CORREGIDA: Obtener imagen aleatoria real
function getRandomImage() {
    const imagesDir = './public/assets/full/';
    
    console.log(`🔍 Buscando imágenes en: ${path.resolve(imagesDir)}`);
    
    // Verificar si el directorio existe
    if (!fs.existsSync(imagesDir)) {
        console.log('❌ Directorio no existe:', imagesDir);
        return null;
    }
    
    try {
        // Leer todos los archivos del directorio
        const files = fs.readdirSync(imagesDir);
        console.log(`📋 Total de archivos encontrados: ${files.length}`);
        
        // Filtrar solo archivos JPG/JPEG
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ext === '.jpg' || ext === '.jpeg';
        });
        
        console.log(`📸 Archivos de imagen encontrados: ${imageFiles.length}`);
        
        if (imageFiles.length === 0) {
            console.log('❌ No se encontraron archivos de imagen');
            return null;
        }
        
        // Seleccionar imagen aleatoria
        const randomIndex = Math.floor(Math.random() * imageFiles.length);
        const selectedImage = imageFiles[randomIndex];
        const fullPath = path.join(imagesDir, selectedImage);
        
        console.log(`🎲 Imagen seleccionada: ${selectedImage}`);
        
        // Verificar que el archivo se puede leer
        try {
            const stats = fs.statSync(fullPath);
            console.log(`✅ Imagen verificada: ${Math.round(stats.size / 1024)}KB`);
            return fullPath;
        } catch (readError) {
            console.log(`❌ Error leyendo imagen: ${readError.message}`);
            return null;
        }
        
    } catch (error) {
        console.log(`❌ Error accediendo al directorio: ${error.message}`);
        return null;
    }
}

// Generar tweet con variación
function generateTweet() {
    const template = TWEET_TEMPLATES[Math.floor(Math.random() * TWEET_TEMPLATES.length)];
    const hashtagSet = HASHTAG_POOLS[Math.floor(Math.random() * HASHTAG_POOLS.length)];
    
    // Añadir emoji aleatorio
    const emojis = ["🌊", "🏝️", "☀️", "🌺", "🏖️", "💕", "✨", "🔥", "💎", "🌅"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    return `${randomEmoji} ${template}\n\n🔗 ibizagirl.pics\n${hashtagSet.join(" ")}`;
}

// Verificar conexión a Twitter
async function verifyTwitterConnection() {
    try {
        const user = await client.currentUser();
        console.log(`✅ Bot conectado como: ${user.screen_name}`);
        return true;
    } catch (error) {
        console.error('❌ Error de conexión a Twitter:', error.message);
        return false;
    }
}

// FUNCIÓN CORREGIDA: Publicar tweet con imagen
async function tweetWithImage() {
    console.log('📸 Ejecutando tweet programado con imagen...');
    
    try {
        // Intentar obtener imagen aleatoria
        const imagePath = getRandomImage();
        
        if (!imagePath) {
            console.log('⚠️ No se encontraron imágenes, publicando solo texto');
            return await tweetText();
        }
        
        console.log(`📤 Subiendo imagen: ${imagePath}`);
        
        // Subir imagen a Twitter
        const mediaUpload = await client.v1.uploadMedia(imagePath);
        console.log(`✅ Imagen subida con ID: ${mediaUpload}`);
        
        // Generar texto del tweet
        const tweetText = generateTweet();
        
        // Publicar tweet con imagen
        const tweet = await client.v2.tweet({
            text: tweetText,
            media: { media_ids: [mediaUpload] }
        });
        
        console.log(`✅ Tweet con imagen publicado: ${tweet.data.created_at}`);
        console.log(`🔗 https://twitter.com/user/status/${tweet.data.id}`);
        
        // Log del tweet
        logTweet(`[IMAGEN] ${tweetText}`);
        
        return tweet;
        
    } catch (error) {
        console.error('❌ Error al publicar tweet con imagen:', error.message);
        console.log('🔄 Intentando publicar solo texto como respaldo...');
        return await tweetText();
    }
}

// Publicar tweet de solo texto
async function tweetText() {
    try {
        const tweetContent = generateTweet();
        
        const tweet = await client.v2.tweet(tweetContent);
        
        console.log(`✅ Tweet de texto publicado: ${tweet.data.created_at}`);
        console.log(`🔗 https://twitter.com/user/status/${tweet.data.id}`);
        
        logTweet(`[TEXTO] ${tweetContent}`);
        
        return tweet;
        
    } catch (error) {
        console.error('❌ Error al publicar tweet de texto:', error.message);
        throw error;
    }
}

// Log de tweets
function logTweet(content) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${content}\n${'='.repeat(50)}\n`;
    
    try {
        fs.appendFileSync('twitter-bot.log', logEntry);
    } catch (error) {
        console.error('❌ Error escribiendo log:', error.message);
    }
}

// Mostrar estadísticas del bot
function showBotStats() {
    const templates = TWEET_TEMPLATES.length;
    const hashtagSets = HASHTAG_POOLS.length;
    
    console.log('\n📊 ESTADÍSTICAS DEL BOT');
    console.log('='.repeat(25));
    console.log(`⏰ Hora actual: ${new Date().toLocaleString('es-ES')}`);
    console.log(`📝 Total de templates: ${templates}`);
    console.log(`#️⃣ Sets de hashtags: ${hashtagSets}`);
    
    console.log('\n📅 PROGRAMACIÓN:');
    console.log('• Tweets con imagen: Cada 6 horas (4/día)');
    console.log('• Tweets de texto: Cada 4 horas (6/día)');
    console.log('• Update diario: 3:05 AM');
    console.log('• Promo especial: 12:00 PM y 8:00 PM');
    console.log('='.repeat(25));
}

// Inicializar y arrancar el bot
async function startBot() {
    console.log('═'.repeat(40));
    console.log('   🐦 IBIZAGIRL.PICS TWITTER BOT 🐦   ');
    console.log('═'.repeat(40));
    
    console.log('\n🔐 Verificando credenciales de Twitter...');
    
    // Verificar conexión
    const connected = await verifyTwitterConnection();
    if (!connected) {
        console.error('❌ No se pudo conectar a Twitter. Verifica tus credenciales.');
        process.exit(1);
    }
    
    console.log(`🤖 Bot de Twitter iniciado para IbizaGirl.pics`);
    console.log(`📅 Fecha/Hora: ${new Date().toLocaleString('es-ES')}`);
    
    // Mostrar estadísticas
    showBotStats();
    
    console.log('\n✅ Todos los trabajos programados están activos\n');
    
    // Programar tweets con imagen cada 6 horas (00:00, 06:00, 12:00, 18:00)
    cron.schedule('0 */6 * * *', () => {
        console.log('\n📸 Ejecutando tweet programado con imagen...');
        tweetWithImage();
    });
    
    // Programar tweets de texto cada 4 horas (02:00, 06:00, 10:00, 14:00, 18:00, 22:00)
    cron.schedule('0 */4 * * *', () => {
        console.log('\n📝 Ejecutando tweet programado de texto...');
        tweetText();
    });
    
    // Tweet especial de actualización diaria a las 3:05 AM
    cron.schedule('5 3 * * *', async () => {
        console.log('\n🌅 Publicando tweet de actualización diaria...');
        const updateTweet = `🎉 DAILY UPDATE COMPLETE! 🎉\n\n✨ 200 new photos\n🎬 40 new videos\n🌊 Fresh paradise content\n\nUpdated NOW at ibizagirl.pics\n\n#DailyUpdate #NewContent #Ibiza #Paradise`;
        
        try {
            await client.v2.tweet(updateTweet);
            console.log('✅ Tweet de actualización diaria publicado');
        } catch (error) {
            console.error('❌ Error en tweet de actualización:', error.message);
        }
    });
    
    // Tweet promocional especial al mediodía
    cron.schedule('0 12 * * *', async () => {
        console.log('\n🔥 Publicando tweet promocional del mediodía...');
        const promoTweet = `🔥 MIDDAY SPECIAL! 🔥\n\n💎 VIP Access Options:\n• Monthly: €15/month\n• Lifetime: €100 (one time)\n\n🏖️ 500+ photos, 80+ videos!\n🌊 Updated daily at 3AM\n\nibizagirl.pics\n\n#VIPAccess #Premium #Ibiza`;
        
        try {
            await client.v2.tweet(promoTweet);
            console.log('✅ Tweet promocional del mediodía publicado');
        } catch (error) {
            console.error('❌ Error en tweet promocional:', error.message);
        }
    });
    
    // Tweet promocional de la noche
    cron.schedule('0 20 * * *', async () => {
        console.log('\n🌙 Publicando tweet promocional de la noche...');
        const nightTweet = `🌙 EVENING PARADISE! 🌙\n\n🌺 End your day with beauty\n🏝️ Fresh Ibiza content daily\n✨ 200+ new photos today\n🎬 40+ new videos added\n\nDive in: ibizagirl.pics\n\n#EveningVibes #Paradise #Ibiza`;
        
        try {
            await client.v2.tweet(nightTweet);
            console.log('✅ Tweet promocional de la noche publicado');
        } catch (error) {
            console.error('❌ Error en tweet promocional nocturno:', error.message);
        }
    });
    
    console.log('\n🚀 Publicando tweet inicial...');
    
    // Tweet inicial al arrancar
    await tweetWithImage();
    
    console.log('\n✅ Bot funcionando. Presiona Ctrl+C para detener.\n');
}

// Manejar cierre del bot
process.on('SIGINT', () => {
    console.log('\n\n🛑 Deteniendo bot de Twitter...');
    console.log('✅ Bot detenido correctamente');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n🛑 Bot terminado por el sistema...');
    process.exit(0);
});

// Iniciar el bot
startBot().catch(error => {
    console.error('❌ Error fatal al iniciar el bot:', error);
    process.exit(1);
});
