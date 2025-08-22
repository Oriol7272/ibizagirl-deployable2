const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO COMPLETO DE IMÁGENES');
console.log('='.repeat(50));

// 1. Verificar directorio actual
console.log('📁 Directorio actual:', process.cwd());

// 2. Verificar diferentes rutas posibles
const possiblePaths = [
    './public/assets/full/',
    'public/assets/full/',
    '/public/assets/full/',
    './public/assets/full',
    'public/assets/full'
];

console.log('\n🔍 Probando diferentes rutas:');
possiblePaths.forEach(testPath => {
    console.log(`\n📂 Probando: "${testPath}"`);
    console.log(`   Ruta absoluta: ${path.resolve(testPath)}`);
    
    if (fs.existsSync(testPath)) {
        console.log('   ✅ Directorio EXISTE');
        
        try {
            const files = fs.readdirSync(testPath);
            console.log(`   📋 Total archivos: ${files.length}`);
            
            const jpgFiles = files.filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ext === '.jpg' || ext === '.jpeg';
            });
            
            console.log(`   🖼️  Archivos JPG: ${jpgFiles.length}`);
            
            if (jpgFiles.length > 0) {
                console.log(`   📸 Primeras 3 imágenes encontradas:`);
                jpgFiles.slice(0, 3).forEach((file, index) => {
                    console.log(`      ${index + 1}. ${file}`);
                });
            }
            
        } catch (error) {
            console.log(`   ❌ Error leyendo directorio: ${error.message}`);
        }
    } else {
        console.log('   ❌ Directorio NO EXISTE');
    }
});

// 3. Simular la función que debería usar el bot
console.log('\n\n🤖 SIMULANDO FUNCIÓN DEL BOT:');
console.log('='.repeat(50));

function getRandomImage() {
    const imagesDir = './public/assets/full/';
    
    console.log(`🔍 Buscando en: ${imagesDir}`);
    console.log(`📍 Ruta absoluta: ${path.resolve(imagesDir)}`);
    
    // Verificar si existe
    if (!fs.existsSync(imagesDir)) {
        console.log('❌ El directorio NO existe');
        return null;
    }
    
    console.log('✅ Directorio existe');
    
    try {
        // Leer archivos
        const files = fs.readdirSync(imagesDir);
        console.log(`📋 Archivos encontrados: ${files.length}`);
        
        // Filtrar solo imágenes
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ext === '.jpg' || ext === '.jpeg';
        });
        
        console.log(`🖼️  Archivos de imagen: ${imageFiles.length}`);
        
        if (imageFiles.length === 0) {
            console.log('❌ No hay archivos de imagen');
            return null;
        }
        
        // Seleccionar imagen aleatoria
        const randomIndex = Math.floor(Math.random() * imageFiles.length);
        const selectedImage = imageFiles[randomIndex];
        const fullPath = path.join(imagesDir, selectedImage);
        
        console.log(`🎲 Imagen seleccionada: ${selectedImage}`);
        console.log(`📍 Ruta completa: ${fullPath}`);
        
        // Verificar que se puede leer
        try {
            const buffer = fs.readFileSync(fullPath);
            console.log(`✅ Imagen leída exitosamente: ${buffer.length} bytes`);
            return fullPath;
        } catch (readError) {
            console.log(`❌ Error leyendo imagen: ${readError.message}`);
            return null;
        }
        
    } catch (error) {
        console.log(`❌ Error listando archivos: ${error.message}`);
        return null;
    }
}

// Ejecutar simulación
const result = getRandomImage();
console.log('\n🏁 RESULTADO FINAL:');
if (result) {
    console.log(`✅ Función devuelve: ${result}`);
} else {
    console.log('❌ Función devuelve: null');
}

// 4. Información adicional para debug
console.log('\n\n🔧 INFORMACIÓN ADICIONAL:');
console.log('='.repeat(50));
console.log('Node.js versión:', process.version);
console.log('Plataforma:', process.platform);
console.log('Arquitectura:', process.arch);

// 5. Contenido real del directorio
console.log('\n📁 CONTENIDO REAL DEL DIRECTORIO:');
const realPath = './public/assets/full/';
if (fs.existsSync(realPath)) {
    const allFiles = fs.readdirSync(realPath);
    console.log(`Total de archivos: ${allFiles.length}`);
    console.log('Primeros 10 archivos:');
    allFiles.slice(0, 10).forEach((file, index) => {
        const stats = fs.statSync(path.join(realPath, file));
        console.log(`  ${index + 1}. ${file} (${Math.round(stats.size / 1024)}KB)`);
    });
}
