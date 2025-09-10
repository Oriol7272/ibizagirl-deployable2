#!/bin/bash

# Añadir meta tags SEO a todas las páginas
for file in *.html; do
    sed -i '' '/<title>/a\
    <meta name="description" content="BeachGirl Premium - Exclusive beach photography and videos. Special discount for new members!">\
    <meta name="keywords" content="beach girls, summer photos, bikini content, beach photography, exclusive content, premium beach photos">\
    <meta name="robots" content="index, follow">\
    <meta property="og:title" content="BeachGirl Premium Content">\
    <meta property="og:description" content="Exclusive beach photography and videos">\
    <meta property="og:image" content="/decorative-images/paradise-beach.png">\
    <meta property="og:url" content="https://beachgirl.me">\
    <link rel="canonical" href="https://beachgirl.me">
' "$file"
done

# Añadir banner de descuento primera compra
for file in *.html; do
    sed -i '' '/<body>/a\
    <div id="first-time-discount" style="background: linear-gradient(90deg, #001f3f, #0074D9); color: white; text-align: center; padding: 10px; display: none;">\
        🎁 Primera compra: 20% DESCUENTO - Código: BEACH20\
        <button onclick="this.parentElement.style.display='"'"'none'"'"'" style="margin-left: 20px; background: #7FDBFF; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">✕</button>\
    </div>\
    <script>\
        if (!localStorage.getItem("visited")) {\
            document.getElementById("first-time-discount").style.display = "block";\
            localStorage.setItem("visited", "true");\
        }\
    </script>
' "$file"
done
