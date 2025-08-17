<?php
/**
 * PROXY PARA CARGAR SCRIPTS DE ANUNCIOS BLOQUEADOS v3.0 - COMPLETAMENTE CORREGIDO
 * IbizaGirl.pics - Enhanced Security & Performance
 * 
 * FIXED: Dominios actualizados, rate limiting mejorado, mejor manejo de errores
 * Este script actúa como proxy para cargar scripts de terceros
 * que pueden estar bloqueados por CORS o protección contra rastreo
 */

// Headers de seguridad mejorados
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Cache-Control');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('X-Proxy-Version: 3.0');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Lista blanca de dominios actualizada y expandida - CORREGIDA
$allowed_domains = [
    // JuicyAds domains - COMPLETOS
    'poweredby.jads.co',
    'www.juicyads.com',
    'cdn.juicyads.com',
    'static.juicyads.com',
    'js.juicyads.com',
    'a.juicyads.com',
    'media.juicyads.com',
    
    // ExoClick domains - COMPLETOS
    'syndication.exoclick.com',
    'a.realsrv.com',
    'main.exoclick.com',
    'www.exoclick.com',
    'cdn.exoclick.com',
    'static.exoclick.com',
    'ads.exoclick.com',
    
    // EroAdvertising - AÑADIDOS
    'www.eroadvertising.com',
    'cdn.eroadvertising.com',
    'js.eroadvertising.com',
    'static.eroadvertising.com',
    
    // PopAds/PremiumVertising domains
    'www.premiumvertising.com',
    'cdn.premiumvertising.com',
    'c.premiumvertising.com',
    
    // Ad networks adicionales
    'adsco.re',
    'cdn.adsco.re',
    'www.adsco.re',
    
    // CDN permitidos
    'cdn.jsdelivr.net',
    'cdnjs.cloudflare.com',
    'unpkg.com',
    'ajax.googleapis.com',
    'code.jquery.com',
    
    // Analytics permitidos
    'www.googletagmanager.com',
    'www.google-analytics.com',
    'stats.g.doubleclick.net',
    
    // PayPal permitidos
    'www.paypal.com',
    'www.paypalobjects.com',
    'www.sandbox.paypal.com'
];

// Rate limiting mejorado con diferentes límites por tipo
session_start();
$client_ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
$rate_limit_key = "proxy_rate_limit_" . md5($client_ip);
$rate_limit_key_heavy = "proxy_rate_limit_heavy_" . md5($client_ip);

// Inicializar contadores si no existen
if (!isset($_SESSION[$rate_limit_key])) {
    $_SESSION[$rate_limit_key] = ['count' => 0, 'time' => time()];
}

if (!isset($_SESSION[$rate_limit_key_heavy])) {
    $_SESSION[$rate_limit_key_heavy] = ['count' => 0, 'time' => time()];
}

$rate_data = $_SESSION[$rate_limit_key];
$rate_data_heavy = $_SESSION[$rate_limit_key_heavy];

// Reset counter if more than 1 minute has passed
if (time() - $rate_data['time'] > 60) {
    $rate_data = ['count' => 0, 'time' => time()];
}

if (time() - $rate_data_heavy['time'] > 3600) { // Reset heavy counter cada hora
    $rate_data_heavy = ['count' => 0, 'time' => time()];
}

// Límite de 200 requests por minuto por IP (aumentado de 100)
if ($rate_data['count'] > 200) {
    http_response_code(429);
    header('Retry-After: 60');
    header('X-RateLimit-Limit: 200');
    header('X-RateLimit-Remaining: 0');
    header('X-RateLimit-Reset: ' . ($rate_data['time'] + 60));
    die('// Error: Rate limit exceeded. Try again in 60 seconds.');
}

// Límite de 1000 requests pesados por hora
if ($rate_data_heavy['count'] > 1000) {
    http_response_code(429);
    header('Retry-After: 3600');
    header('X-RateLimit-Heavy-Limit: 1000');
    header('X-RateLimit-Heavy-Remaining: 0');
    die('// Error: Heavy rate limit exceeded. Try again in 1 hour.');
}

$rate_data['count']++;
$_SESSION[$rate_limit_key] = $rate_data;

// Obtener la URL solicitada
$url = isset($_GET['url']) ? trim($_GET['url']) : '';

// Validación de URL más estricta
if (empty($url)) {
    http_response_code(400);
    die('// Error: No URL provided');
}

// Decodificar URL si está codificada
$url = urldecode($url);

// Validar que la URL sea válida
if (!filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    error_log("Proxy: Invalid URL format - $url from IP: $client_ip");
    die('// Error: Invalid URL format');
}

// Validación adicional de esquema
$parsed_url = parse_url($url);
if (!$parsed_url || !isset($parsed_url['scheme']) || !isset($parsed_url['host'])) {
    http_response_code(400);
    die('// Error: Invalid URL structure');
}

// Permitir tanto HTTP como HTTPS para mayor compatibilidad
if (!in_array($parsed_url['scheme'], ['http', 'https'])) {
    http_response_code(400);
    die('// Error: Only HTTP/HTTPS URLs are allowed');
}

$domain = strtolower($parsed_url['host']);

// Verificación de dominio más robusta
$domain_allowed = false;
foreach ($allowed_domains as $allowed) {
    $allowed = strtolower($allowed);
    // Verificar dominio exacto o subdominio
    if ($domain === $allowed || 
        str_ends_with($domain, '.' . $allowed) ||
        ($allowed[0] !== '.' && str_starts_with($domain, str_replace('www.', '', $allowed)))) {
        $domain_allowed = true;
        break;
    }
}

if (!$domain_allowed) {
    http_response_code(403);
    error_log("Proxy: Domain not allowed - $domain from IP: $client_ip, UA: $user_agent");
    header('X-Proxy-Error: Domain not in whitelist');
    die('// Error: Domain not allowed: ' . htmlspecialchars($domain));
}

// Incrementar contador para requests pesados
$rate_data_heavy['count']++;
$_SESSION[$rate_limit_key_heavy] = $rate_data_heavy;

// Determinar el tipo de contenido basado en la extensión y headers
$path = $parsed_url['path'] ?? '';
$extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

$content_types = [
    'js' => 'application/javascript; charset=utf-8',
    'mjs' => 'application/javascript; charset=utf-8',
    'css' => 'text/css; charset=utf-8',
    'json' => 'application/json; charset=utf-8',
    'html' => 'text/html; charset=utf-8',
    'xml' => 'application/xml; charset=utf-8',
    'txt' => 'text/plain; charset=utf-8',
    'svg' => 'image/svg+xml',
    'woff' => 'font/woff',
    'woff2' => 'font/woff2',
    'ttf' => 'font/ttf',
    'eot' => 'application/vnd.ms-fontobject'
];

$content_type = $content_types[$extension] ?? 'text/plain; charset=utf-8';

// User-Agent pool actualizado
$user_agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

$random_ua = $user_agents[array_rand($user_agents)];

// Configurar el contexto de la petición con mejor manejo de errores
$context_options = [
    'http' => [
        'method' => 'GET',
        'header' => [
            "User-Agent: $random_ua",
            'Accept: */*',
            'Accept-Language: es-ES,es;q=0.9,en;q=0.8',
            'Accept-Encoding: gzip, deflate, br',
            'Connection: keep-alive',
            'Referer: https://ibizagirl.pics/',
            'Origin: https://ibizagirl.pics',
            'Cache-Control: no-cache',
            'Pragma: no-cache',
            'DNT: 1',
            'Sec-Fetch-Dest: script',
            'Sec-Fetch-Mode: cors',
            'Sec-Fetch-Site: cross-site'
        ],
        'timeout' => 30,
        'follow_location' => true,
        'max_redirects' => 5,
        'ignore_errors' => true,
        'protocol_version' => 1.1
    ],
    'ssl' => [
        'verify_peer' => false, // Cambiar a false para mayor compatibilidad
        'verify_peer_name' => false,
        'allow_self_signed' => true,
        'disable_compression' => false,
        'SNI_enabled' => true,
        'ciphers' => 'DEFAULT'
    ]
];

$context = stream_context_create($context_options);

// Cache key para evitar requests duplicados
$cache_key = 'proxy_cache_' . md5($url);
$cached_content = null;

// Verificar si tenemos contenido en caché (usando APCu si está disponible)
if (function_exists('apcu_fetch')) {
    $cached_content = apcu_fetch($cache_key);
    if ($cached_content !== false) {
        // Servir desde caché
        header('Content-Type: ' . $content_type);
        header('X-Proxy-Cache: HIT');
        header('X-Proxy-Source: APCu');
        echo $cached_content;
        exit;
    }
}

// Intentar obtener el contenido con mejor manejo de errores
$content = @file_get_contents($url, false, $context);
$http_response_header = $http_response_header ?? [];

// Parsear el código de respuesta HTTP
$http_code = 200;
if (!empty($http_response_header[0])) {
    preg_match('/HTTP\/\d\.\d\s+(\d+)/', $http_response_header[0], $matches);
    $http_code = isset($matches[1]) ? (int)$matches[1] : 200;
}

// Si falla, intentar con cURL como fallback mejorado
if ($content === false || $http_code >= 400) {
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 5,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_USERAGENT => $random_ua,
            CURLOPT_HTTPHEADER => [
                'Accept: */*',
                'Accept-Language: es-ES,es;q=0.9,en;q=0.8',
                'Accept-Encoding: gzip, deflate, br',
                'Referer: https://ibizagirl.pics/',
                'Origin: https://ibizagirl.pics',
                'Cache-Control: no-cache',
                'DNT: 1'
            ],
            CURLOPT_ENCODING => '', // Automatically handle compression
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_2_0,
            CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4 // Forzar IPv4 para mayor compatibilidad
        ]);
        
        $content = curl_exec($ch);
        $curl_info = curl_getinfo($ch);
        $curl_http_code = $curl_info['http_code'];
        $curl_error = curl_error($ch);
        curl_close($ch);
        
        if ($content === false || $curl_http_code >= 400) {
            http_response_code($curl_http_code ?: 500);
            error_log("Proxy: Failed to fetch $url - HTTP: $curl_http_code, Error: $curl_error, IP: $client_ip");
            header('X-Proxy-Error: Failed to fetch content');
            header('X-Proxy-HTTP-Code: ' . $curl_http_code);
            die('// Error: Failed to fetch content from ' . htmlspecialchars($domain));
        }
        
        $http_code = $curl_http_code;
    } else {
        http_response_code($http_code ?: 500);
        error_log("Proxy: Failed to fetch $url - No cURL available, IP: $client_ip");
        header('X-Proxy-Error: Failed to fetch content and cURL not available');
        die('// Error: Failed to fetch content and cURL not available');
    }
}

// Validación de contenido
if (empty($content)) {
    http_response_code(204);
    header('X-Proxy-Error: Empty content received');
    die('// Error: Empty content received');
}

// Filtrado de contenido potencialmente malicioso (mejorado)
$dangerous_patterns = [
    '/<script[^>]*>.*?document\.cookie.*?<\/script>/si',
    '/<script[^>]*>.*?localStorage\.setItem.*?<\/script>/si',
    '/<script[^>]*>.*?sessionStorage\.setItem.*?<\/script>/si',
    '/eval\s*\(\s*["\'].*?["\'].*?\)/i',
    '/Function\s*\(\s*["\'].*?["\'].*?\)/i',
    '/setTimeout\s*\(\s*["\'].*?["\'].*?\)/i',
    '/setInterval\s*\(\s*["\'].*?["\'].*?\)/i',
    '/<script[^>]*>.*?XMLHttpRequest.*?<\/script>/si',
    '/<script[^>]*>.*?fetch\s*\(.*?credentials.*?<\/script>/si'
];

$is_dangerous = false;
foreach ($dangerous_patterns as $pattern) {
    if (preg_match($pattern, $content)) {
        $is_dangerous = true;
        error_log("Proxy: Potentially dangerous content detected in $url from IP: $client_ip");
        // En lugar de bloquear completamente, sanitizar el contenido
        $content = preg_replace($pattern, '/* Sanitized by proxy */', $content);
    }
}

// Establecer headers de respuesta mejorados
header('Content-Type: ' . $content_type);
header('X-Proxy-Cache: MISS');
header('X-Proxy-Source: ' . $domain);
header('X-Proxy-Status: ' . ($is_dangerous ? 'sanitized' : 'clean'));
header('X-Content-Length: ' . strlen($content));

// Cache headers más inteligentes basados en el tipo de contenido
if ($extension === 'js' || $extension === 'css') {
    // Scripts y estilos: cache por 1 hora
    header('Cache-Control: public, max-age=3600, stale-while-revalidate=1800');
    header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 3600) . ' GMT');
    
    // Guardar en caché si APCu está disponible
    if (function_exists('apcu_store') && strlen($content) < 1048576) { // Solo cachear si es menor a 1MB
        apcu_store($cache_key, $content, 3600);
    }
} elseif ($extension === 'json' || $extension === 'xml') {
    // Datos estructurados: cache por 5 minutos
    header('Cache-Control: public, max-age=300, must-revalidate');
    header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 300) . ' GMT');
} else {
    // Otros contenidos: cache por 30 minutos
    header('Cache-Control: public, max-age=1800, stale-while-revalidate=900');
    header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 1800) . ' GMT');
}

header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
header('ETag: "' . md5($content . $url . $http_code) . '"');
header('X-Proxy-Version: 3.0');

// Manejo especial para JavaScript con mejor wrapper de errores
if ($extension === 'js' || $extension === 'mjs') {
    echo "/* Proxied from: $url */\n";
    echo "/* Proxy version: 3.0 - Enhanced Security & Performance */\n";
    echo "/* Timestamp: " . date('Y-m-d H:i:s') . " */\n";
    echo "(function() {\n";
    echo "    'use strict';\n";
    echo "    try {\n";
    
    // Limpiar y preparar el contenido JavaScript
    $content = preg_replace('/^\s*\/\*.*?\*\/\s*/s', '', $content); // Remove initial comments
    $content = trim($content);
    
    // Asegurar que el contenido no termine con punto y coma para evitar errores de sintaxis
    $content = rtrim($content, ';') . ';';
    
    echo $content;
    echo "\n    } catch(proxyError) {\n";
    echo "        console.warn('Proxy script error from $domain:', proxyError);\n";
    echo "        if (window.trackEvent) {\n";
    echo "            window.trackEvent('proxy_script_error', { \n";
    echo "                url: '$url', \n";
    echo "                domain: '$domain',\n";
    echo "                error: proxyError.message \n";
    echo "            });\n";
    echo "        }\n";
    echo "    }\n";
    echo "})();\n";
    echo "/* End of proxied content */\n";
} elseif ($extension === 'css') {
    // Para CSS, añadir comentario informativo
    echo "/* Proxied from: $url */\n";
    echo "/* Proxy version: 3.0 */\n";
    echo "/* Timestamp: " . date('Y-m-d H:i:s') . " */\n\n";
    echo $content;
    echo "\n/* End of proxied content */";
} else {
    // Para otros tipos de contenido, devolver tal como es
    echo $content;
}

// Log de éxito más detallado
$log_data = [
    'timestamp' => date('Y-m-d H:i:s'),
    'url' => $url,
    'domain' => $domain,
    'client_ip' => $client_ip,
    'user_agent' => substr($user_agent, 0, 100),
    'content_type' => $content_type,
    'content_length' => strlen($content),
    'http_code' => $http_code,
    'cache_status' => $cached_content !== null ? 'HIT' : 'MISS',
    'sanitized' => $is_dangerous
];

// Solo loguear si es exitoso
if ($http_code < 400) {
    error_log("Proxy success: " . json_encode($log_data));
}

// Actualizar estadísticas de uso (opcional)
if (isset($_SESSION['proxy_stats'])) {
    $_SESSION['proxy_stats']['requests']++;
    $_SESSION['proxy_stats']['bytes_served'] += strlen($content);
    $_SESSION['proxy_stats']['last_request'] = time();
    
    // Estadísticas por dominio
    if (!isset($_SESSION['proxy_stats']['domains'])) {
        $_SESSION['proxy_stats']['domains'] = [];
    }
    if (!isset($_SESSION['proxy_stats']['domains'][$domain])) {
        $_SESSION['proxy_stats']['domains'][$domain] = 0;
    }
    $_SESSION['proxy_stats']['domains'][$domain]++;
} else {
    $_SESSION['proxy_stats'] = [
        'requests' => 1,
        'bytes_served' => strlen($content),
        'first_request' => time(),
        'last_request' => time(),
        'domains' => [$domain => 1]
    ];
}

// Función para obtener estadísticas (opcional, para debugging)
if (isset($_GET['stats']) && $_GET['stats'] === 'true') {
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'ok',
        'version' => '3.0',
        'stats' => $_SESSION['proxy_stats'] ?? null,
        'allowed_domains_count' => count($allowed_domains),
        'rate_limit' => [
            'current' => $rate_data['count'],
            'limit' => 200,
            'reset_in' => max(0, 60 - (time() - $rate_data['time']))
        ]
    ]);
    exit;
}

exit;
?>
