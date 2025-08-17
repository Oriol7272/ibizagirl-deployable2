<?php
/**
 * PROXY PARA CARGAR SCRIPTS DE ANUNCIOS BLOQUEADOS v2.0
 * IbizaGirl.pics - FIXED VERSION
 * 
 * Este script actúa como proxy para cargar scripts de terceros
 * que pueden estar bloqueados por CORS o protección contra rastreo
 */

// Configuración de headers más permisiva
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Credentials: true');
header('X-Frame-Options: ALLOWALL');
header('Referrer-Policy: unsafe-url');
header('X-Content-Type-Options: nosniff');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// FIXED: Lista actualizada de dominios permitidos
$allowed_domains = [
    // JuicyAds
    'poweredby.jads.co',
    'www.juicyads.com',
    'content.juicyads.com',
    'ads.juicyads.com',
    
    // ExoClick
    'syndication.exoclick.com',
    'a.realsrv.com',
    'main.exoclick.com',
    'www.exoclick.com',
    
    // PopAds
    'www.premiumvertising.com',
    'cdn.premiumvertising.com',
    
    // CDNs permitidos
    'adsco.re',
    'cdn.jsdelivr.net',
    'cdnjs.cloudflare.com',
    'unpkg.com',
    
    // Otros dominios de ads
    'static.ads-twitter.com',
    'googleads.g.doubleclick.net'
];

// Obtener la URL solicitada
$url = isset($_GET['url']) ? $_GET['url'] : '';

// Validar URL
if (empty($url)) {
    http_response_code(400);
    die('// Error: No URL provided');
}

// Validar que la URL sea válida
if (!filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    die('// Error: Invalid URL format');
}

// Extraer el dominio de la URL
$parsed_url = parse_url($url);
if (!$parsed_url || !isset($parsed_url['host'])) {
    http_response_code(400);
    die('// Error: Invalid URL structure');
}

$domain = $parsed_url['host'];

// Verificar que el dominio esté en la lista blanca
$domain_allowed = false;
foreach ($allowed_domains as $allowed) {
    if (strpos($domain, $allowed) !== false || strpos($allowed, $domain) !== false) {
        $domain_allowed = true;
        break;
    }
}

if (!$domain_allowed) {
    http_response_code(403);
    die('// Error: Domain not allowed: ' . $domain);
}

// Determinar el tipo de contenido basado en la extensión
$extension = pathinfo($parsed_url['path'], PATHINFO_EXTENSION);
$content_types = [
    'js' => 'application/javascript; charset=utf-8',
    'css' => 'text/css; charset=utf-8',
    'json' => 'application/json; charset=utf-8',
    'html' => 'text/html; charset=utf-8',
    'xml' => 'application/xml; charset=utf-8'
];

$content_type = isset($content_types[$extension]) ? $content_types[$extension] : 'text/plain; charset=utf-8';

// FIXED: Configuración mejorada del contexto de la petición
$context_options = [
    'http' => [
        'method' => 'GET',
        'header' => [
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept: */*',
            'Accept-Language: es-ES,es;q=0.9,en;q=0.8',
            'Accept-Encoding: gzip, deflate, br',
            'Connection: keep-alive',
            'Referer: https://ibizagirl.pics/',
            'Origin: https://ibizagirl.pics',
            'Sec-Fetch-Dest: script',
            'Sec-Fetch-Mode: cors',
            'Sec-Fetch-Site: cross-site',
            'Cache-Control: no-cache',
            'Pragma: no-cache'
        ],
        'timeout' => 30,
        'follow_location' => true,
        'max_redirects' => 5,
        'ignore_errors' => true
    ],
    'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true,
        'ciphers' => 'DEFAULT:!DH'
    ]
];

$context = stream_context_create($context_options);

// Intentar obtener el contenido
$content = @file_get_contents($url, false, $context);
$response_headers = $http_response_header ?? [];

// FIXED: Verificar si se obtuvo el contenido
if ($content === false) {
    // Intentar con cURL como fallback mejorado
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        CURLOPT_HTTPHEADER => [
            'Accept: */*',
            'Accept-Language: es-ES,es;q=0.9,en;q=0.8',
            'Accept-Encoding: gzip, deflate, br',
            'Referer: https://ibizagirl.pics/',
            'Origin: https://ibizagirl.pics',
            'Sec-Fetch-Dest: script',
            'Sec-Fetch-Mode: cors',
            'Sec-Fetch-Site: cross-site',
            'Cache-Control: no-cache'
        ],
        CURLOPT_ENCODING => '', // Habilitar compresión automática
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4
    ]);
    
    $content = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);
    
    if ($content === false || $http_code >= 400) {
        http_response_code($http_code ?: 500);
        if ($curl_error) {
            die('// Error: cURL failed - ' . $curl_error);
        }
        die('// Error: Failed to fetch content (HTTP ' . $http_code . ')');
    }
}

// FIXED: Validar que el contenido no esté vacío
if (empty($content)) {
    http_response_code(204);
    die('// Error: Empty content received');
}

// Establecer el tipo de contenido correcto
header('Content-Type: ' . $content_type);

// FIXED: Cache headers mejorados
$cache_time = 3600; // 1 hora
header('Cache-Control: public, max-age=' . $cache_time . ', s-maxage=' . $cache_time);
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $cache_time) . ' GMT');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s', time()) . ' GMT');
header('ETag: "' . md5($content) . '"');

// FIXED: Procesar contenido según tipo
if ($extension === 'js') {
    // Limpiar el contenido JavaScript
    $content = trim($content);
    
    // Agregar wrapper para manejo de errores mejorado
    $output = "/* Proxied from: $url */\n";
    $output .= "/* Proxy timestamp: " . date('Y-m-d H:i:s') . " */\n";
    $output .= "try {\n";
    
    // FIXED: Verificar si el contenido ya tiene un wrapper try-catch
    if (strpos($content, 'try {') === false) {
        $output .= $content;
        $output .= "\n} catch(proxyError) { ";
        $output .= "console.warn('Proxy script error for $url:', proxyError); ";
        $output .= "}";
    } else {
        // Si ya tiene try-catch, solo agregarlo tal como está
        $output .= $content;
        $output .= "\n} catch(outerProxyError) { ";
        $output .= "console.warn('Outer proxy error for $url:', outerProxyError); ";
        $output .= "}";
    }
    
    echo $output;
} else {
    // Para otros tipos de archivo, enviar tal como está
    echo $content;
}

// FIXED: Log de éxito mejorado
$log_entry = sprintf(
    "[%s] Proxy success: %s (Size: %d bytes, Type: %s)",
    date('Y-m-d H:i:s'),
    $url,
    strlen($content),
    $content_type
);

error_log($log_entry);

// FIXED: Headers adicionales para debugging (solo en desarrollo)
if (isset($_GET['debug']) && $_GET['debug'] === '1') {
    header('X-Proxy-URL: ' . $url);
    header('X-Proxy-Domain: ' . $domain);
    header('X-Proxy-Size: ' . strlen($content));
    header('X-Proxy-Type: ' . $content_type);
    header('X-Proxy-Timestamp: ' . time());
}

// Finalizar respuesta
exit();
?>
