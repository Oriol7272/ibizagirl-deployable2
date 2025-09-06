#!/usr/bin/env bash
# Sube TODO el contenido del repo local a GitHub (origin/main),
# habilitando Git LFS para archivos pesados.

set -euo pipefail

# === Ajustes básicos ===
REPO_EXPECTED="ibizagirl-deployable2"
BRANCH="main"
REMOTE="origin"
REPO_URL_DEFAULT="https://github.com/Oriol7272/ibizagirl-deployable2.git"

echo "== 0) Comprobaciones previas =="
# 0.1 Asegúrate de estar en la raíz del repo correcto
if [ ! -d ".git" ]; then
  echo "❌ Aquí no hay un repo Git (.git no existe). Entra en la carpeta del repo y reintenta."
  exit 1
fi

NAME="$(basename "$(pwd)")"
if [ "$NAME" != "$REPO_EXPECTED" ]; then
  echo "⚠️  Estás en '$NAME', no en '$REPO_EXPECTED'. Sigo igualmente (solo aviso)."
fi

# 0.2 Asegura el remote origin
if git remote get-url "$REMOTE" >/dev/null 2>&1; then
  CUR_URL="$(git remote get-url "$REMOTE")"
  echo "→ remote '$REMOTE': $CUR_URL"
else
  echo "→ Configurando remote '$REMOTE' → $REPO_URL_DEFAULT"
  git remote add "$REMOTE" "$REPO_URL_DEFAULT"
fi

# 0.3 Cambia a main y actualiza
echo "→ Checkout $BRANCH"
git checkout "$BRANCH"
echo "→ Pull --rebase de $REMOTE/$BRANCH"
git pull --rebase "$REMOTE" "$BRANCH" || true

# === Git LFS para archivos grandes ===
echo "== 1) Configurar Git LFS para archivos grandes =="
if ! command -v git-lfs >/dev/null 2>&1; then
  echo "⚠️  git-lfs no encontrado. Si falla el push de archivos >100MB, instala Git LFS:"
  echo "    macOS (brew): brew install git-lfs && git lfs install"
  echo "    Debian/Ubuntu: sudo apt-get install git-lfs && git lfs install"
else
  git lfs install --force
fi

# Patrones típicos de ficheros grandes (vídeos/archivos). Añade/quita si quieres.
# NOTA: imágenes suelen ir sin LFS, pero si tienes imágenes gigantes puedes añadir *.jpg/*.png también.
echo "== 2) Activar seguimiento LFS para tipos pesados (si aplica) =="
touch .gitattributes
git lfs track "*.mp4" "*.webm" "*.mov" "*.mkv" "*.avi" \
               "*.zip" "*.tar.gz" "*.7z" "*.rar" \
               "public/uncensored-videos/*" \
               "public/**/videos/*" \
               "assets/videos/*" || true

# Guarda .gitattributes por si se actualizó
git add .gitattributes || true

# === Aviso de ficheros gigantes (para evitar rechazos de GitHub) ===
echo "== 3) Explorando ficheros > 100MB (solo aviso) =="
FOUND_BIG=0
while IFS= read -r -d '' f; do
  FOUND_BIG=1
  echo "  • $(du -h "$f" | cut -f1)  $f"
done < <(find . -type f -size +100M -not -path "./.git/*" -print0 || true)

if [ "$FOUND_BIG" -eq 1 ]; then
  echo "⚠️  Hay ficheros >100MB. GitHub los rechazará si NO están bajo LFS."
  echo "    Si alguno no entra en los patrones LFS, añade un patrón adecuado y reintenta."
else
  echo "✔ No se detectaron ficheros >100MB (o todos quedarán en LFS)."
fi

# === Añadir TODO, commit y push ===
echo "== 4) Añadir todos los cambios y commit =="
git add -A
git status --short || true

# Mensaje de commit
MSG="content: sync local full content to repo (with LFS where needed)"
git commit -m "$MSG" || echo "ℹ️  Nada que commitear (quizá ya estaba todo igual)."

echo "== 5) Push a $REMOTE/$BRANCH =="
git push "$REMOTE" "$BRANCH"

echo
echo "✅ Listo: origin/$BRANCH actualizado con TODO el contenido local."
echo "   Si el push falló por ficheros >100MB, instala/configura Git LFS y repite."
