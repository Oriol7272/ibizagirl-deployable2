#!/usr/bin/env bash
set -euo pipefail
for f in index.html premium.html videos.html subscription.html; do
  [ -f "$f" ] || continue
  perl -0777 -pe "s#</head>#  <link rel=\"canonical\" href=\"https://ibizagirl.pics/${f}\">\n  <meta property=\"og:site_name\" content=\"IBIZAGIRL.PICS\">\n  <meta property=\"og:type\" content=\"website\">\n  <meta property=\"og:title\" content=\"IBIZAGIRL.PICS – Paraíso visual\">\n  <meta property=\"og:description\" content=\"Galería, premium y vídeos. Lifetime sin anuncios.\">\n  <meta property=\"og:image\" content=\"https://ibizagirl.pics/decorative-images/paradise-beach.png\">\n  <meta name=\"twitter:card\" content=\"summary_large_image\">\n</head>#s" -i "$f"
done
cat > sitemap.xml <<XML
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://ibizagirl.pics/index.html</loc></url>
  <url><loc>https://ibizagirl.pics/premium.html</loc></url>
  <url><loc>https://ibizagirl.pics/videos.html</loc></url>
  <url><loc>https://ibizagirl.pics/subscription.html</loc></url>
</urlset>
XML
cat > robots.txt <<TXT
User-agent: *
Allow: /
Sitemap: https://ibizagirl.pics/sitemap.xml
TXT
echo "SEO OK"
