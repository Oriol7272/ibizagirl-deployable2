<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content Management System - Modular</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header h1 {
            color: white;
            margin-bottom: 10px;
            font-size: 2.5rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .header p {
            color: rgba(255, 255, 255, 0.8);
            font-size: 1.1rem;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            color: #fff;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .stat-label {
            color: rgba(255, 255, 255, 0.8);
            margin-top: 5px;
            font-size: 0.9rem;
        }

        .content-section {
            margin-bottom: 40px;
        }

        .section-title {
            color: white;
            font-size: 1.8rem;
            margin-bottom: 20px;
            text-align: center;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .image-item {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            overflow: hidden;
            transition: transform 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .image-item:hover {
            transform: scale(1.05);
        }

        .image-placeholder {
            width: 100%;
            height: 120px;
            background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }

        .controls {
            text-align: center;
            margin-bottom: 30px;
        }

        .btn {
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            margin: 0 10px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        .btn.secondary {
            background: linear-gradient(45deg, #3742fa, #2f3542);
        }

        .status {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .status-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            color: white;
        }

        .status-indicator {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: bold;
        }

        .status-ok {
            background: rgba(39, 174, 96, 0.8);
        }

        .status-warning {
            background: rgba(241, 196, 15, 0.8);
        }

        .status-error {
            background: rgba(231, 76, 60, 0.8);
        }

        .loading {
            text-align: center;
            color: white;
            font-size: 1.2rem;
            margin: 40px 0;
        }

        .spinner {
            display: inline-block;
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin-right: 10px;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .video-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
        }

        .video-item {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 15px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .video-placeholder {
            width: 100%;
            height: 100px;
            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2rem;
            margin-bottom: 10px;
        }

        .video-title {
            color: white;
            font-size: 0.9rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .image-grid {
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🎬 Content Management System</h1>
            <p>Sistema modular de gestión de contenido multimedia v4.1.0</p>
        </div>

        <!-- Loading indicator -->
        <div id="loading" class="loading">
            <div class="spinner"></div>
            Cargando sistema modular...
        </div>

        <!-- Main content (hidden initially) -->
        <div id="main-content" style="display: none;">
            <!-- System Status -->
            <div class="status" id="system-status">
                <h3 style="color: white; margin-bottom: 15px;">📊 Estado del Sistema</h3>
                <div id="status-items"></div>
            </div>

            <!-- Statistics -->
            <div class="stats-grid" id="stats-grid">
                <!-- Stats will be populated by JavaScript -->
            </div>

            <!-- Controls -->
            <div class="controls">
                <button class="btn" onclick="rotateContent()">🔄 Rotar Contenido</button>
                <button class="btn secondary" onclick="refreshStats()">📊 Actualizar Stats</button>
                <button class="btn secondary" onclick="simulatePremium()">🎉 Simular Premium</button>
                <button class="btn secondary" onclick="testSystem()">🧪 Test Sistema</button>
            </div>

            <!-- Banners Section -->
            <div class="content-section">
                <h2 class="section-title">🎯 Banners Dinámicos</h2>
                <div class="image-grid" id="banners-grid"></div>
            </div>

            <!-- Teasers Section -->
            <div class="content-section">
                <h2 class="section-title">🔥 Teasers</h2>
                <div class="image-grid" id="teasers-grid"></div>
            </div>

            <!-- Public Images Section -->
            <div class="content-section">
                <h2 class="section-title">🖼️ Imágenes Públicas</h2>
                <div class="image-grid" id="public-images-grid"></div>
            </div>

            <!-- Premium Images Section -->
            <div class="content-section">
                <h2 class="section-title">💎 Imágenes Premium</h2>
                <div class="image-grid" id="premium-images-grid"></div>
            </div>

            <!-- Videos Section -->
            <div class="content-section">
                <h2 class="section-title">🎬 Videos Premium</h2>
                <div class="video-grid" id="videos-grid"></div>
            </div>
        </div>
    </div>

    <!-- Scripts - Load in correct order -->
    <script src="content-data1.js"></script> <!-- Configuración y utilidades -->
    <script src="content-data2.js"></script> <!-- Imágenes públicas -->
    <script src="content-data3.js"></script> <!-- Imágenes premium parte 1 -->
    <script src="content-data4.js"></script> <!-- Imágenes premium parte 2 -->
    <script src="content-data5.js"></script> <!-- Videos premium -->
    <script src="content-data6.js"></script> <!-- API unificada -->

    <script>
        // ============================
        // FUNCIONES PRINCIPALES DE LA UI
        // ============================
        
        let systemInitialized = false;

        // Inicializar la aplicación
        async function initializeApp() {
            console.log('🚀 Iniciando aplicación...');
            
            try {
                // Esperar a que la API unificada esté lista
                if (window.UnifiedContentAPI) {
                    await window.UnifiedContentAPI.initialize();
                    systemInitialized = true;
                    
                    // Ocultar loading y mostrar contenido
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('main-content').style.display = 'block';
                    
                    // Cargar contenido inicial
                    await loadAllContent();
                    
                    console.log('✅ Aplicación inicializada correctamente');
                } else {
                    throw new Error('UnifiedContentAPI no disponible');
                }
            } catch (error) {
                console.error('❌ Error al inicializar:', error);
                document.getElementById('loading').innerHTML = 
                    '<div style="color: #ff4757;">❌ Error al cargar el sistema</div>';
            }
        }

        // Cargar todo el contenido
        async function loadAllContent() {
            updateSystemStatus();
            updateStats();
            loadBanners();
            loadTeasers();
            loadPublicImages();
            loadPremiumImages();
            loadVideos();
        }

        // Actualizar estado del sistema
        function updateSystemStatus() {
            if (!window.ContentAPI) return;
            
            const health = window.ContentAPI.getHealth();
            const statusDiv = document.getElementById('status-items');
            
            statusDiv.innerHTML = `
                <div class="status-item">
                    <span>Estado General:</span>
                    <span class="status-indicator ${health.healthy ? 'status-ok' : 'status-warning'}">
                        ${health.healthy ? '✅ Saludable' : '⚠️ Problemas'}
                    </span>
                </div>
                <div class="status-item">
                    <span>Puntuación:</span>
                    <span class="status-indicator ${health.score > 80 ? 'status-ok' : health.score > 50 ? 'status-warning' : 'status-error'}">
                        ${health.score}/100
                    </span>
                </div>
                <div class="status-item">
                    <span>Sistema Inicializado:</span>
                    <span class="status-indicator ${systemInitialized ? 'status-ok' : 'status-error'}">
                        ${systemInitialized ? '✅ Sí' : '❌ No'}
                    </span>
                </div>
            `;
        }

        // Actualizar estadísticas
        function updateStats() {
            if (!window.ContentAPI) return;
            
            const stats = window.ContentAPI.getStats();
            const statsGrid = document.getElementById('stats-grid');
            
            statsGrid.innerHTML = `
                <div class="stat-card">
                    <div class="stat-number">${stats.content.publicImages}</div>
                    <div class="stat-label">Imágenes Públicas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.content.premiumImages}</div>
                    <div class="stat-label">Imágenes Premium</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.content.videos}</div>
                    <div class="stat-label">Videos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.content.banners}</div>
                    <div class="stat-label">Banners</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.content.teasers}</div>
                    <div class="stat-label">Teasers</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.access.videoAccess}</div>
                    <div class="stat-label">Nivel Acceso</div>
                </div>
            `;
        }

        // Cargar banners
        function loadBanners() {
            if (!window.ContentAPI) return;
            
            const banners = window.ContentAPI.getBanners();
            const bannersGrid = document.getElementById('banners-grid');
            
            bannersGrid.innerHTML = banners.map((banner, index) => `
                <div class="image-item">
                    <div class="image-placeholder">Banner ${index + 1}</div>
                </div>
            `).join('');
        }

        // Cargar teasers
        function loadTeasers() {
            if (!window.ContentAPI) return;
            
            const teasers = window.ContentAPI.getTeasers();
            const teasersGrid = document.getElementById('teasers-grid');
            
            teasersGrid.innerHTML = teasers.map((teaser, index) => `
                <div class="image-item">
                    <div class="image-placeholder">Teaser ${index + 1}</div>
                </div>
            `).join('');
        }

        // Cargar imágenes públicas
        function loadPublicImages() {
            if (!window.ContentAPI) return;
            
            const images = window.ContentAPI.getPublicImages(12);
            const imagesGrid = document.getElementById('public-images-grid');
            
            imagesGrid.innerHTML = images.map((image, index) => `
                <div class="image-item">
                    <div class="image-placeholder">Img ${index + 1}</div>
                </div>
            `).join('');
        }

        // Cargar imágenes premium
        function loadPremiumImages() {
            if (!window.ContentAPI) return;
            
            const images = window.ContentAPI.getPremiumImages(8);
            const imagesGrid = document.getElementById('premium-images-grid');
            
            imagesGrid.innerHTML = images.map((image, index) => `
                <div class="image-item">
                    <div class="image-placeholder">Premium ${index + 1}</div>
                </div>
            `).join('');
        }

        // Cargar videos
        function loadVideos() {
            if (!window.ContentAPI) return;
            
            const videos = window.ContentAPI.getVideos(6);
            const videosGrid = document.getElementById('videos-grid');
            
            videosGrid.innerHTML = videos.map((video, index) => `
                <div class="video-item">
                    <div class="video-placeholder">▶️</div>
                    <div class="video-title">Video ${index + 1}</div>
                </div>
            `).join('');
        }

        // ============================
        // FUNCIONES DE CONTROL
        // ============================

        // Rotar contenido
        function rotateContent() {
            if (!window.ContentAPI) return;
            
            console.log('🔄 Rotando contenido...');
            window.ContentAPI.rotate();
            
            setTimeout(() => {
                loadBanners();
                loadTeasers();
                updateStats();
            }, 100);
            
            alert('✅ Contenido rotado exitosamente');
        }

        // Actualizar estadísticas
        function refreshStats() {
            console.log('📊 Actualizando estadísticas...');
            updateStats();
            updateSystemStatus();
            alert('✅ Estadísticas actualizadas');
        }

        // Simular premium
        function simulatePremium() {
            if (window.VideoContentManager) {
                window.VideoContentManager.upgradeToPremium();
                setTimeout(() => {
                    loadVideos();
                    updateStats();
                }, 100);
                alert('🎉 Acceso premium simulado');
            } else {
                alert('⚠️ VideoContentManager no disponible');
            }
        }

        // Test del sistema
        function testSystem() {
            if (!window.ContentAPI) {
                alert('❌ Sistema no inicializado');
                return;
            }
            
            const health = window.ContentAPI.getHealth();
            const stats = window.ContentAPI.getStats();
            
            console.log('🧪 Test del sistema:');
            console.table(stats);
            console.log('Health:', health);
            
            alert(`🧪 Test completado. Puntuación: ${health.score}/100`);
        }

        // ============================
        // EVENT LISTENERS
        // ============================

        // Escuchar rotación de contenido
        window.addEventListener('contentRotated', (event) => {
            console.log('🔄 Contenido rotado automáticamente:', event.detail);
            loadBanners();
            loadTeasers();
        });

        // Escuchar upgrade premium
        window.addEventListener('premiumUpgrade', (event) => {
            console.log('🎉 Premium upgrade detectado:', event.detail);
            loadVideos();
            updateStats();
        });

        // ============================
        // INICIALIZACIÓN
        // ============================

        // Inicializar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            initializeApp();
        }

        // Debugging en consola
        if (window.location.hostname === 'localhost') {
            console.log('🐛 Modo desarrollo - Comandos disponibles:');
            console.log('- window.ContentAPI: API simplificada');
            console.log('- window.UnifiedContentAPI: API completa');
            console.log('- window.ContentDebug: Herramientas de debug');
        }
    </script>
</body>
</html>
