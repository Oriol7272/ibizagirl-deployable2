<?php
/**
 * PROXY PARA CARGAR SCRIPTS DE ANUNCIOS BLOQUEADOS v2.0 - FIXED
 * IbizaGirl.pics - Enhanced Security & Performance
 * 
 * FIXED: Actualizado con dominios correctos y mejor seguridad
 * Este script actúa como proxy para cargar scripts de terceros
 * que pueden estar bloqueados por CORS o protección contra rastreo
 */

// FIXED: Headers de seguridad mejorados
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');

// FIXED: Lista blanca de dominios actualizada y expandida
$allowed_domains = [
    // JuicyAds domains
    'poweredby.jads.co',
    'www.juicyads.com',
    'cdn.juicyads.com',
    'static.juicyads.com',
    
    // ExoClick domains  
    'syndication.exoclick.com',
    'a.realsrv.com',
    'main.exoclick.com',
    'www.exoclick.com',
    'cdn.exoclick.com',
    
    // PopAds domains
    'www.premiumvertising.com',
    'cdn.premiumvertising.com',
    
    // Ad networks adicionales
    'adsco.re',
    'cdn.adsco.re',
    
    // CDN permitidos
    'cdn.jsdelivr.net',
    'cdnjs.cloudflare.com',
    'unpkg.com',
    
    // Analytics permitidos
    'www.googletagmanager.com',
    'www.google-analytics.com',
    
    // PayPal permitidos
    'www.paypal.com',
    'www.paypalobjects.com'
];

// FIXED: Rate limiting básico
session_start();
$client_ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rate_limit_key = "proxy_rate_limit_" . md5($client_ip);

if (!isset($_SESSION[$rate_limit_key])) {
    $_SESSION[$rate_limit_key] = ['count' => 0, 'time' => time()];
}

$rate_data = $_SESSION[$rate_limit_key];

// Reset counter if more than 1 minute has passed
if (time() - $rate_data['time'] > 60) {
    $rate_data = ['count' => 0, 'time' => time()];
}

// FIXED: Límite de 100 requests por minuto por IP
if ($rate_data['count'] > 100) {
    http_response_code(429);
    header('Retry-After: 60');
    die('// Error: Rate limit exceeded. Try again later.');
}

$rate_data['count']++;
$_SESSION[$rate_limit_key] = $rate_data;

// Obtener la URL solicitada
$url = isset($_GET['url']) ? trim($_GET['url']) : '';

// FIXED: Validación de URL más estricta
if (empty($url)) {
    http_response_code(400);
    die('// Error: No URL provided');
}

// Validar que la URL sea válida
if (!filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    die('// Error: Invalid URL format');
}

// FIXED: Validación adicional de esquema
$parsed_url = parse_url($url);
if (!$parsed_url || !isset($parsed_url['scheme']) || !isset($parsed_url['host'])) {
    http_response_code(400);
    die('// Error: Invalid URL structure');
}

// Solo permitir HTTPS para mayor seguridad
if ($parsed_url['scheme'] !== 'https') {
    http_response_code(400);
    die('// Error: Only HTTPS URLs are allowed');
}

$domain = strtolower($parsed_url['host']);

// FIXED: Verificación de dominio más robusta
$domain_allowed = false;
foreach ($allowed_domains as $allowed) {
    $allowed = strtolower($allowed);
    if ($domain === $allowed || str_ends_with($domain, '.' . $allowed)) {
        $domain_allowed = true;
        break;
    }
}

if (!$domain_allowed) {
    http_response_code(403);
    error_log("Proxy: Domain not allowed - $domain from IP: $client_ip");
    die('// Error: Domain not allowed');
}

// FIXED: Determinar el tipo de contenido basado en la extensión
$path = $parsed_url['path'] ?? '';
$extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

$content_types = [
    'js' => 'application/javascript; charset=utf-8',
    'css' => 'text/css; charset=utf-8',
    'json' => 'application/json; charset=utf-8',
    'html' => 'text/html; charset=utf-8',
    'xml' => 'application/xml; charset=utf-8',
    'txt' => 'text/plain; charset=utf-8'
];

$content_type = $content_types[$extension] ?? 'text/plain; charset=utf-8';

// FIXED: User-Agent más realista y actualizado
$user_agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
];

$random_ua = $user_agents[array_rand($user_agents)];

// FIXED: Configurar el contexto de la petición con mejor manejo de errores
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
            'Pragma: no-cache'
        ],
        'timeout' => 30,
        'follow_location' => true,
        'max_redirects' => 3,
        'ignore_errors' => true
    ],
    'ssl' => [
        'verify_peer' => true,
        'verify_peer_name' => true,
        'allow_self_signed' => false,
        'cafile' => '/etc/ssl/certs/ca-certificates.crt', // Adjust path as needed
        'disable_compression' => true,
        'SNI_enabled' => true,
        'ciphers' => 'ECDHE+AESGCM:ECDHE+AES256:ECDHE+AES128:!aNULL:!MD5:!DSS'
    ]
];

$context = stream_context_create($context_options);

// FIXED: Intentar obtener el contenido con mejor manejo de errores
$content = @file_get_contents($url, false, $context);
$http_response_header = $http_response_header ?? [];

// Parsear el código de respuesta HTTP
$http_code = 200;
if (!empty($http_response_header[0])) {
    preg_match('/HTTP\/\d\.\d\s+(\d+)/', $http_response_header[0], $matches);
    $http_code = isset($matches[1]) ? (int)$matches[1] : 200;
}

// FIXED: Si falla, intentar con cURL como fallback mejorado
if ($content === false || $http_code >= 400) {
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 3,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_USERAGENT => $random_ua,
            CURLOPT_HTTPHEADER => [
                'Accept: */*',
                'Accept-Language: es-ES,es;q=0.9,en;q=0.8',
                'Accept-Encoding: gzip, deflate, br',
                'Referer: https://ibizagirl.pics/',
                'Origin: https://ibizagirl.pics',
                'Cache-Control: no-cache'
            ],
            CURLOPT_ENCODING => '', // Automatically handle compression
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_2_0
        ]);
        
        $content = curl_exec($ch);
        $curl_http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curl_error = curl_error($ch);
        curl_close($ch);
        
        if ($content === false || $curl_http_code >= 400) {
            http_response_code($curl_http_code ?: 500);
            error_log("Proxy: Failed to fetch $url - HTTP: $curl_http_code, Error: $curl_error");
            die('// Error: Failed to fetch content');
        }
        
        $http_code = $curl_http_code;
    } else {
        http_response_code($http_code ?: 500);
        error_log("Proxy: Failed to fetch $url - No cURL available");
        die('// Error: Failed to fetch content and cURL not available');
    }
}

// FIXED: Validación de contenido
if (empty($content)) {
    http_response_code(204);
    die('// Error: Empty content received');
}

// FIXED: Filtrado de contenido potencialmente malicioso
$dangerous_patterns = [
    '/<script[^>]*>.*?document\.cookie.*?<\/script>/si',
    '/<script[^>]*>.*?localStorage.*?<\/script>/si',
    '/<script[^>]*>.*?sessionStorage.*?<\/script>/si',
    '/eval\s*\(/i',
    '/Function\s*\(/i',
    '/setTimeout\s*\(\s*["\'].*?["\'].*?\)/i',
    '/setInterval\s*\(\s*["\'].*?["\'].*?\)/i'
];

foreach ($dangerous_patterns as $pattern) {
    if (preg_match($pattern, $content)) {
        error_log("Proxy: Dangerous content detected in $url");
        http_response_code(403);
        die('// Error: Potentially malicious content detected');
    }
}

// FIXED: Establecer headers de respuesta mejorados
header('Content-Type: ' . $content_type);
header('X-Proxy-Cache: MISS');
header('X-Proxy-Source: ' . $domain);

// FIXED: Cache headers más inteligentes
if ($extension === 'js' || $extension === 'css') {
    // Scripts y estilos: cache por 1 hora
    header('Cache-Control: public, max-age=3600, stale-while-revalidate=1800');
    header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 3600) . ' GMT');
} else {
    // Otros contenidos: cache por 30 minutos
    header('Cache-Control: public, max-age=1800, stale-while-revalidate=900');
    header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 1800) . ' GMT');
}

header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
header('ETag: "' . md5($content . $url) . '"');

// FIXED: Manejo especial para JavaScript con mejor wrapper de errores
if ($extension === 'js') {
    echo "/* Proxied from: $url */\n";
    echo "/* Proxy version: 2.0 - Enhanced Security */\n";
    echo "(function() {\n";
    echo "    'use strict';\n";
    echo "    try {\n";
    
    // FIXED: Limpiar y preparar el contenido JavaScript
    $content = preg_replace('/^\s*\/\*.*?\*\/\s*/s', '', $content); // Remove initial comments
    $content = trim($content);
    
    echo $content;
    echo "\n    } catch(proxyError) {\n";
    echo "        console.warn('Proxy script error from $domain:', proxyError);\n";
    echo "        if (window.trackEvent) {\n";
    echo "            window.trackEvent('proxy_script_error', { url: '$url', error: proxyError.message });\n";
    echo "        }\n";
    echo "    }\n";
    echo "})();\n";
} else {
    // Para otros tipos de contenido, devolver tal como es
    echo $content;
}

// FIXED: Log de éxito más detallado
$log_data = [
    'timestamp' => date('Y-m-d H:i:s'),
    'url' => $url,
    'domain' => $domain,
    'client_ip' => $client_ip,
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
    'content_type' => $content_type,
    'content_length' => strlen($content),
    'http_code' => $http_code
];

error_log("Proxy success: " . json_encode($log_data));

// FIXED: Actualizar estadísticas de uso (opcional)
if (isset($_SESSION['proxy_stats'])) {
    $_SESSION['proxy_stats']['requests']++;
    $_SESSION['proxy_stats']['bytes_served'] += strlen($content);
} else {
    $_SESSION['proxy_stats'] = [
        'requests' => 1,
        'bytes_served' => strlen($content),
        'first_request' => time()
    ];
}

exit;
?>
