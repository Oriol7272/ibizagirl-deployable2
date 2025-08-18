<?php
/**
 * Proxy Script for Ad Networks
 * Version: 4.1.0
 * Purpose: Safely proxy external ad scripts and resources
 */

// Configuración básica
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/proxy_errors.log');

// Headers de seguridad
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Iniciar sesión para rate limiting
session_start();

// Obtener IP del cliente
$client_ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? 
             $_SERVER['HTTP_X_FORWARDED_FOR'] ?? 
             $_SERVER['REMOTE_ADDR'] ?? 
             '0.0.0.0';

// Rate limiting mejorado
$rate_limit_key = 'rate_limit_' . md5($client_ip);
$rate_limit_key_heavy = 'rate_limit_heavy_' . md5($client_ip);
$current_time = time();

// Límite general: 100 requests por minuto
$rate_data = $_SESSION[$rate_limit_key] ?? ['count' => 0, 'reset_time' => $current_time + 60];

if ($current_time > $rate_data['reset_time']) {
    $rate_data = ['count' => 1, 'reset_time' => $current_time + 60];
} else {
    $rate_data['count']++;
    if ($rate_data['count'] > 100) {
        http_response_code(429);
        header('Retry-After: ' . ($rate_data['reset_time'] - $current_time));
        die('// Rate limit exceeded. Please try again later.');
    }
}

$_SESSION[$rate_limit_key] = $rate_data;

// Límite para requests pesados: 20 por minuto
$rate_data_heavy = $_SESSION[$rate_limit_key_heavy] ?? ['count' => 0, 'reset_time' => $current_time + 60];

if ($current_time > $rate_data_heavy['reset_time']) {
    $rate_data_heavy = ['count' => 0, 'reset_time' => $current_time + 60];
}

if ($rate_data_heavy['count'] > 20) {
    http_response_code(429);
    header('Retry-After: ' . ($rate_data_heavy['reset_time'] - $current_time));
    die('// Heavy rate limit exceeded. Please try again later.');
}

// Obtener y validar URL
$url = $_GET['url'] ?? '';

if (empty($url)) {
    http_response_code(400);
    die('// Error: No URL provided');
}

// Decodificar URL si es necesario
$url = urldecode($url);

// Validar URL
if (!filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    error_log("Proxy: Invalid URL attempted - $url from IP: $client_ip");
    die('// Error: Invalid URL');
}

// Parsear URL
$parsed_url = parse_url($url);
if (!$parsed_url || !isset($parsed_url['host'])) {
    http_response_code(400);
    die('// Error: Malformed URL');
}

// Obtener User-Agent del cliente
$user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Mozilla/5.0 (compatible; ProxyBot/1.0)';

// Lista blanca de dominios permitidos
$allowed_domains = [
    'poweredby.jads.co',
    'juicyads.com',
    'www.juicyads.com',
    'js.juicyads.com',
    'adserver.juicyads.com',
    'syndication.exoclick.com',
    'syndication.exosrv.com',
    'a.exoclick.com',
    'main.exoclick.com',
    'realsrv.com',
    'a.realsrv.com',
    'tsyndicate.com',
    'a.tsyndicate.com',
    'trafficstars.com',
    'a.trafficstars.com',
    'trafficjunky.com',
    'media.trafficjunky.com',
    'premiumvertising.com',
    'www.premiumvertising.com',
    'eroadvertising.com',
    'www.eroadvertising.com',
    'adskeeper.com',
    'jsc.adskeeper.com',
    'googletagmanager.com',
    'www.googletagmanager.com',
    'google-analytics.com',
    'www.google-analytics.com',
    'googleapis.com',
    'ajax.googleapis.com',
    'cloudflare.com',
    'cdnjs.cloudflare.com',
    'jsdelivr.net',
    'cdn.jsdelivr.net',
    'unpkg.com',
    'paypal.com',
    'www.paypal.com',
    'paypalobjects.com',
    'www.paypalobjects.com'
];

// Verificar si el dominio está permitido
$domain = strtolower($parsed_url['host']);
$domain_allowed = false;

foreach ($allowed_domains as $allowed) {
    if ($domain === $allowed || 
        ($allowed[0] === '.' && str_ends_with($domain, $allowed)) ||
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
        'verify_peer' => false,
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
            CURLOPT_ENCODING => '',
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_2_0,
            CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4
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
    if (function_exists('apcu_store') && strlen($content) < 1048576) {
        apcu_store($cache_key, $content, 3600);
    }
} elseif ($extension === 'json' || $extension === 'xml') {
    // Datos estructurados: cache por 5 minutos
    header('Cache-Control: public, max-age=300, must-revalidate');
    header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 300) . ' GMT');
} else {
    // Otros: no cachear
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
}

// CORS headers para compatibilidad
header('Access-Control-Allow-Origin: https://ibizagirl.pics');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Max-Age: 3600');
header('Timing-Allow-Origin: https://ibizagirl.pics');

// Logging exitoso para debugging
if ($rate_data['count'] % 10 === 0) {
    error_log("Proxy: Successful fetch - $url (Request #" . $rate_data['count'] . " from IP: $client_ip)");
}

// Enviar el contenido
echo $content;

// Limpiar variables para liberar memoria
unset($content);
unset($cached_content);

// Fin del script
exit;
