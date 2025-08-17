<?php
/**
 * PROXY PARA CARGAR SCRIPTS DE ANUNCIOS BLOQUEADOS
 * IbizaGirl.pics - v1.0
 * 
 * Este script actúa como proxy para cargar scripts de terceros
 * que pueden estar bloqueados por CORS o protección contra rastreo
 */

// Configuración de headers permisivos
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: *');
header('X-Frame-Options: ALLOWALL');
header('Referrer-Policy: unsafe-url');

// Lista blanca de dominios permitidos
$allowed_domains = [
    'poweredby.jads.co',
    'www.juicyads.com',
    'syndication.exoclick.com',
    'a.realsrv.com',
    'main.exoclick.com',
    'www.premiumvertising.com',
    'adsco.re',
    'cdn.jsdelivr.net',
    'cdnjs.cloudflare.com'
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
$domain = $parsed_url['host'];

// Verificar que el dominio esté en la lista blanca
$domain_allowed = false;
foreach ($allowed_domains as $allowed) {
    if (strpos($domain, $allowed) !== false) {
        $domain_allowed = true;
        break;
    }
}

if (!$domain_allowed) {
    http_response_code(403);
    die('// Error: Domain not allowed');
}

// Determinar el tipo de contenido basado en la extensión
$extension = pathinfo($parsed_url['path'], PATHINFO_EXTENSION);
$content_types = [
    'js' => 'application/javascript',
    'css' => 'text/css',
    'json' => 'application/json',
    'html' => 'text/html',
    'xml' => 'application/xml'
];

$content_type = isset($content_types[$extension]) ? $content_types[$extension] : 'text/plain';

// Configurar el contexto de la petición
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
            'Origin: https://ibizagirl.pics'
        ],
        'timeout' => 30,
        'follow_location' => true,
        'max_redirects' => 5
    ],
    'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    ]
];

$context = stream_context_create($context_options);

// Intentar obtener el contenido
$content = @file_get_contents($url, false, $context);

// Verificar si se obtuvo el contenido
if ($content === false) {
    // Intentar con cURL como fallback
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: */*',
        'Accept-Language: es-ES,es;q=0.9,en;q=0.8',
        'Referer: https://ibizagirl.pics/',
        'Origin: https://ibizagirl.pics'
    ]);
    
    $content = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($content === false || $http_code >= 400) {
        http_response_code($http_code ?: 500);
        die('// Error: Failed to fetch content');
    }
}

// Establecer el tipo de contenido correcto
header('Content-Type: ' . $content_type);

// Cache headers para mejorar el rendimiento
header('Cache-Control: public, max-age=3600');
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 3600) . ' GMT');

// Si es JavaScript, agregar wrapper para manejo de errores
if ($extension === 'js') {
    echo "/* Proxied from: $url */\n";
    echo "try {\n";
    echo $content;
    echo "\n} catch(e) { console.error('Proxy script error:', e); }";
} else {
    echo $content;
}

// Log de éxito (opcional)
error_log("Proxy success: $url");
?>
