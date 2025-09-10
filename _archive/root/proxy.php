<?php
/**
 * beachgirl.pics - Advanced Proxy v3.0.0
 * Enhanced security, performance and reliability
 */

// Configuración de errores para producción
error_reporting(0);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/proxy_errors.log');

// Headers de seguridad tempranos
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Configuración
$ALLOWED_DOMAINS = [
    'juicyads.com',
    'www.juicyads.com',
    'ads.juicyads.com',
    'cdn.juicyads.com',
    'exoclick.com',
    'www.exoclick.com',
    'syndication.exoclick.com',
    'main.exoclick.com',
    'eroadvertising.com',
    'www.eroadvertising.com',
    'popads.net',
    'www.popads.net',
    'c1.popads.net',
    'c2.popads.net',
    'serve.popads.net',
    'chaturbate.com',
    'www.chaturbate.com',
    'mmcdn.com',
    'jsdelivr.net',
    'cdn.jsdelivr.net'
];

$BLOCKED_PATTERNS = [
    '/eval\s*\(/i',
    '/document\.write/i',
    '/innerHTML\s*=/i',
    '/\.cookie\s*=/i',
    '/localStorage\./i',
    '/sessionStorage\./i'
];

// Rate limiting mejorado
session_start();
$client_ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$rate_limit_key = 'rate_limit_' . md5($client_ip);
$rate_data = $_SESSION[$rate_limit_key] ?? ['count' => 0, 'reset_time' => time() + 3600];

if (time() > $rate_data['reset_time']) {
    $rate_data = ['count' => 0, 'reset_time' => time() + 3600];
}

$rate_data['count']++;
$_SESSION[$rate_limit_key] = $rate_data;

// Aplicar límites más estrictos por IP
$max_requests = 1000; // Por hora
if ($rate_data['count'] > $max_requests) {
    http_response_code(429);
    header('Retry-After: ' . ($rate_data['reset_time'] - time()));
    die('// Rate limit exceeded. Please try again later.');
}

// Validación de entrada mejorada
$url = filter_input(INPUT_GET, 'url', FILTER_SANITIZE_URL);

if (!$url) {
    http_response_code(400);
    header('Content-Type: application/javascript');
    die('// Error: Invalid or missing URL parameter');
}

// Decodificar y validar URL
$url = urldecode($url);
if (!filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    header('Content-Type: application/javascript');
    die('// Error: Invalid URL format');
}

// Extraer y validar dominio
$parsed_url = parse_url($url);
$domain = $parsed_url['host'] ?? '';

if (!$domain || !in_array($domain, $ALLOWED_DOMAINS)) {
    http_response_code(403);
    error_log("Proxy: Blocked request to unauthorized domain: $domain from IP: $client_ip");
    header('Content-Type: application/javascript');
    die('// Error: Unauthorized domain');
}

// Determinar tipo de contenido basado en la extensión y el dominio
$path = $parsed_url['path'] ?? '';
$extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

// Tipo de contenido más específico
$content_type = match($extension) {
    'js' => 'application/javascript',
    'json' => 'application/json',
    'css' => 'text/css',
    'html', 'htm' => 'text/html',
    'xml' => 'application/xml',
    'jpg', 'jpeg' => 'image/jpeg',
    'png' => 'image/png',
    'gif' => 'image/gif',
    'webp' => 'image/webp',
    'svg' => 'image/svg+xml',
    default => 'text/plain; charset=utf-8'
};

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
            'Referer: https://beachgirl.pics/',
            'Origin: https://beachgirl.pics',
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
                'Referer: https://beachgirl.pics/',
                'Origin: https://beachgirl.pics',
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

// Filtrado de contenido potencialmente malicioso (CORREGIDO)
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
header('Access-Control-Allow-Origin: https://beachgirl.pics');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Max-Age: 3600');
header('Timing-Allow-Origin: https://beachgirl.pics');

// Logging exitoso para debugging
if ($rate_data['count'] % 10 === 0) {
    error_log("Proxy: Successful fetch - $url (Request #" . $rate_data['count'] . " from IP: $client_ip)");
}

// Output final del contenido
echo $content;

// Cleanup y optimización de memoria
unset($content);
if (function_exists('gc_collect_cycles')) {
    gc_collect_cycles();
}
?>
