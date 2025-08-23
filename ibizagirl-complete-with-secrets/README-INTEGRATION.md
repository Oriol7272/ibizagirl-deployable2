# Pack de Integración — Ibizagirl

Incluye:
- Seguridad (CSP, headers), gating de contenido con JWT + URLs firmadas (S3/R2)
- Banner de cookies con bloqueo previo (analytics/ads)
- Inyección automática de snippets en TODAS tus páginas HTML (`npm run integrate`)
- Migración de media premium a S3/R2 (`npm run migrate:premium`)
- Páginas legales (ES), robots/sitemap, SW que ignora premium

## Pasos
1) Copia este pack a la raíz de tu repo.
2) `cp .env.example .env` y completa IDs/secretos (no los subas al repo).
3) Ejecuta **inserción de snippets**: `npm i && npm run integrate` (revisa los cambios git).
4) Sube tu media premium a S3/R2: `npm run migrate:premium` (requiere vars S3_*).
5) Despliega en Vercel. Verifica rutas protegidas y consentimiento de cookies.
6) Ajusta CSP en `vercel.json` si usas otros dominios (CDN/ads).

> Nota: No se incluyen credenciales reales. Rellena `.env` y siéntete libre de mover `public/snippets/ads-body.html` con tu código publicitario.
