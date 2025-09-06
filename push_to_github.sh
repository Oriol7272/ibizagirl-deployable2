#!/bin/bash
# Script para subir a GitHub con LFS

# Configurar Git LFS
git lfs install

# Track archivos grandes
git lfs track "*.mp4" "*.webm" "*.mov"
git lfs track "uncensored/*"
git lfs track "uncensored-videos/*"

# Añadir .gitattributes
git add .gitattributes

# Configurar remote si no existe
git remote add origin https://github.com/Oriol7272/beachgirl.pics.git 2>/dev/null || true

# Añadir todos los archivos
git add -A

# Commit
git commit -m "Sync content from ibizagirl to beachgirl"

# Push
git push origin main --force
