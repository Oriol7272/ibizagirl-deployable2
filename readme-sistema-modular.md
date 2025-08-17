# 🌊 IbizaGirl.pics - Sistema Modular v4.1.0

## 📋 Descripción General

Este sistema modular divide el contenido multimedia de IbizaGirl.pics en módulos especializados para mejorar la organización, rendimiento y mantenimiento del código.

## 🗂️ Estructura de Archivos

### 📁 Módulos de Contenido (Orden de Carga Crítico)

```
1️⃣ content-data1.js          - Configuración y utilidades base
2️⃣ content-data2.js          - Imágenes públicas (127 archivos)
3️⃣ content-data3.js          - Imágenes premium parte 1 (186 archivos)
4️⃣ content-data4.js          - Imágenes premium parte 2 (204 archivos)
5️⃣ content-data5.js          - Videos premium (67 archivos)
6️⃣ content-data6.js          - API unificada y funciones principales
7️⃣ content-data-integration.js - Integrador con main-script.js
8️⃣ main-script-updated.js    - Script principal actualizado
```

### 📁 Archivos Principales

```
├── index.html                    - Página de verificación de edad
├── main-html-updated.html        - Página principal (actualizada)
├── styles.css                    - Estilos CSS
├── sw.js                         - Service Worker
├── manifest.json                 - PWA Manifest
├── robots.txt                    - SEO robots
└── proxy.php                     - Proxy para anuncios
```

## 🔧 Instalación y Configuración

### 1. Reemplazar Archivos Existentes

```bash
# Reemplazar archivos principales
cp main-html-updated.html main.html
cp main-script-updated.js main-script.js

# Mantener otros archivos existentes
# (styles.css, sw.js, manifest.json, etc.)
```

### 2. Añadir Nuevos Módulos

```bash
# Crear los módulos de contenido
touch content-data1.js
touch content-data2.js
touch content-data3.js
touch content-data4.js
touch content-data5.js
touch content-data6.js
touch content-data-integration.js
```

### 3. Integrar Contenido de `index-MODULAR.js`

El archivo `index-MODULAR.js` contiene el sistema modular completo. Divídelo en los archivos individuales según las secciones marcadas.

## ⚙️ Configuración del Contenido

### 📸 Imágenes Públicas (content-data2.js)

- **Total**: 127 archivos
- **Ubicación**: `/full/`
- **Formato**: `.webp`
- **Uso**: Banners, teasers, vista previa

### 💎 Imágenes Premium

#### Parte 1 (content-data3.js)
- **Total**: 186 archivos
- **Ubicación**: `/uncensored/`
- **Formato**: `.webp`

#### Parte 2 (content-data4.js)
- **Total**: 204 archivos
- **Ubicación**: `/uncensored/`
- **Formato**: `.webp`

### 🎬 Videos Premium (content-data5.js)

- **Total**: 67 archivos
- **Ubicación**: `/uncensored-videos/`
- **Formato**: `.mp4`
- **Acceso**: Solo VIP

## 🔌 APIs Disponibles

### ContentAPI (Simplificada)

```javascript
// API simple para uso en UI
window.ContentAPI = {
    getPublicImages: (count) => [...],
    getPremiumImages: (count) => [...],
    getVideos: (count) => [...],
    getBanners: () => [...],
    getTeasers: () => [...],
    search: (query) => {...},
    getStats: () => {...},
    rotate: () => boolean
};
```

### UnifiedContentAPI (Completa)

```javascript
// API completa con todas las funciones
window.UnifiedContentAPI = {
    getAllPublicImages: () => [...],
    getAllPremiumImages: () => [...],
    getAllVideos: () => [...],
    searchAll: (query) => {...},
    getSystemStats: () => {...},
    getTodaysContent: () => {...},
    // ... más funciones
};
```

## 🎯 Funciones de Integración

### Para main-script.js

```javascript
// Función para obtener contenido aleatorio
getRandomContentForMainScript()

// Función para generar rotación diaria
generateDailyRotationForMainScript()

// Estadísticas del contenido
getContentStats()
```

## 🚀 Inicialización

### Secuencia de Carga

1. **DOM Ready** → Cargar módulos base
2. **Módulos 1-6** → Inicializar sistemas de contenido
3. **API Unificada** → Consolidar todo el contenido
4. **Integración** → Exponer APIs para main-script
5. **Main Script** → Renderizar interfaz

### Event System

```javascript
// Eventos del sistema
window.addEventListener('contentSystemReady', (event) => {
    console.log('Sistema listo:', event.detail);
});

window.addEventListener('contentSystemFallback', (event) => {
    console.log('Modo fallback activado:', event.detail);
});
```

## 🛠️ Debugging

### Funciones de Debug (Desarrollo)

```javascript
// Estado del sistema modular
debugModularSystem()

// Probar contenido
testModularContent()

// Forzar recarga
forceReloadContent()

// Estado de módulos
debugContentSystem()

// Inspeccionar dependencias
window.ContentDebug.inspectDependencies()
```

### Console Logs

```javascript
// Verificar carga de módulos
console.log('Módulos:', window.ContentModuleLoader);

// Verificar APIs
console.log('ContentAPI:', window.ContentAPI);
console.log('UnifiedAPI:', window.UnifiedContentAPI);

// Verificar arrays
console.log('Photos:', window.ALL_PHOTOS_POOL?.length);
console.log('Videos:', window.ALL_VIDEOS_POOL?.length);
```

## 📊 Estadísticas del Sistema

### Contenido Total

- **Fotos Públicas**: 127 archivos
- **Fotos Premium**: 390 archivos (186 + 204)
- **Videos Premium**: 67 archivos
- **Total**: 584 archivos multimedia

### Rendimiento

- **Carga Modular**: Reduce tiempo inicial
- **Lazy Loading**: Solo carga módulos necesarios
- **Caché Inteligente**: Optimiza acceso a contenido
- **Error Recovery**: Sistema robusto de fallbacks

## 🔄 Rotación Diaria

### Sistema de Seeds

```javascript
// Seed basado en fecha
const dateSeed = year * 10000 + month * 100 + day;

// Contenido determinístico por día
const todayContent = shuffleWithSeed(content, dateSeed);
```

### Nuevo Contenido

- **30%** del contenido marcado como "nuevo" diariamente
- **Banners**: Rotan cada hora
- **Teasers**: Rotan con banners
- **Estadísticas**: Actualizan automáticamente

## 🔐 Sistema de Acceso

### Niveles de Usuario

1. **Guest**: Solo preview (borroso)
2. **Pack Credits**: Desbloqueo por créditos
3. **VIP**: Acceso ilimitado

### PayPal Integration

- **Mensual**: €15/mes
- **Lifetime**: €100 (una vez)
- **Packs**: €10-50 (créditos)
- **PPV**: €0.10-0.30 (por item)

## 🎨 Personalización

### Modificar Contenido

```javascript
// Añadir nuevas imágenes
FULL_IMAGES_POOL.push('nueva-imagen.webp');

// Añadir videos
PREMIUM_VIDEOS_POOL.push('nuevo-video.mp4');

// Regenerar rotación
window.ContentAPI.rotate();
```

### Configurar Rotación

```javascript
// En content-data1.js
const ContentConfig = {
    rotation: {
        enabled: true,
        intervalHours: 1,
        bannersCount: 6,
        teasersCount: 9
    }
};
```

## 🚨 Solución de Problemas

### Problemas Comunes

1. **Módulos no cargan**
   ```javascript
   // Verificar orden de scripts en HTML
   // Verificar console para errores de red
   debugModularSystem()
   ```

2. **Contenido no aparece**
   ```javascript
   // Verificar arrays
   console.log(window.ALL_PHOTOS_POOL);
   // Forzar recarga
   forceReloadContent()
   ```

3. **Error en rotación**
   ```javascript
   // Verificar TimeUtils y ArrayUtils
   console.log(window.TimeUtils, window.ArrayUtils);
   ```

### Modo Fallback

Si el sistema modular falla, automáticamente activa:
- Contenido de emergencia (6 imágenes básicas)
- APIs simplificadas
- Event listeners de recuperación

## 📱 Compatibilidad

### Navegadores Soportados

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Móviles (iOS/Android)

### Progressive Web App

- 📱 Instalable
- 🔄 Service Worker
- 💾 Caché inteligente
- 📶 Funciona offline

## 🔄 Actualizaciones

### Versioning

```
v4.1.0 - Sistema modular completo
v4.0.x - Módulos individuales
v3.x.x - Sistema monolítico anterior
```

### Migration Path

1. Backup del sistema actual
2. Implementar módulos uno por uno
3. Verificar funcionamiento
4. Activar sistema completo

## 📞 Soporte

Para problemas o preguntas:

1. **Verificar console logs**
2. **Usar funciones de debug**
3. **Comprobar orden de carga**
4. **Revisar dependencias**

---

🌊 **IbizaGirl.pics** - Paradise Gallery con Sistema Modular v4.1.0
