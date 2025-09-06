#!/usr/bin/env bash
# ibg_audit_cleanup.sh — Audita el repo y propone qué eliminar con seguridad.
# NO borra nada. Genera:
#   - cleanup_report.txt   (informe)
#   - delete_candidates.sh (rm -rf de candidatos, NO se ejecuta)

set -euo pipefail

ROOT="$(pwd)"
REPORT="cleanup_report_$(date +%Y%m%d_%H%M%S).txt"
DEL="delete_candidates.sh"

echo "== IBG Audit Cleanup ==" | tee "$REPORT"
echo "Repo: $ROOT" | tee -a "$REPORT"
echo "Fecha: $(date)" | tee -a "$REPORT"
echo | tee -a "$REPORT"

# Helpers
exists() { [ -e "$1" ]; }
referenced_in_html() {
  local f="$1"
  # Busca nombre de archivo (base) en HTML (src/href/simple)
  local base="$(basename "$f" | sed 's/[].[^$*\/]/\\&/g')"
  grep -RIEq "(src=|href=|import |\"|')(.*$base)" --include='*.html' . 2>/dev/null
}

add_candidate() {
  local path="$1"
  echo "$path" >> .candidates.tmp
}

# 0) Escaneo base
echo "== Archivos de gran tamaño (>100MB) (solo aviso) ==" | tee -a "$REPORT"
BIG=0
while IFS= read -r -d '' f; do
  BIG=1
  echo "  • $(du -h "$f" | cut -f1)  $f" | tee -a "$REPORT"
done < <(find . -type f -size +100M -not -path "./.git/*" -print0 2>/dev/null || true)
[ "$BIG" -eq 0 ] && echo "  ✔ Ninguno o ya bajo LFS." | tee -a "$REPORT"
echo | tee -a "$REPORT"

# 1) Patrones típicos prescindibles / restos locales
echo "== Candidatos por patrón (backups/temporales/restos) ==" | tee -a "$REPORT"
> .candidates.tmp

# Backups/temporales comunes
find . -type f \( -name "*.bak" -o -name "*.bak.*" -o -name "*.__tmp" -o -name "*~" -o -name ".DS_Store" \) -print >> .candidates.tmp || true
# Backups locales que hemos visto en logs
find . -type f -name "backup_local_*.tar.gz" -print >> .candidates.tmp || true
# Auditorías/artefactos previos
find . -maxdepth 2 -type d -name "AUDIT_*" -print >> .candidates.tmp || true
# Directorios de Vercel locales
[ -d ".vercel" ] && add_candidate ".vercel"
[ -d "public/.vercel" ] && add_candidate "public/.vercel"
# Overrides antiguos de Vercel (si ya no los usas)
[ -f "vercel-build.sh" ] && add_candidate "vercel-build.sh"
if [ -f "vercel.json" ]; then
  # Si este proyecto es estático y ya funciona sin overrides, suele sobrar
  add_candidate "vercel.json"
fi
# Páginas de test de ads
if [ -d "ads" ]; then
  find ads -maxdepth 1 -type f -name "test-*.html" -print >> .candidates.tmp || true
fi
# Scripts de mantenimiento que no quieres en el repo
find . -maxdepth 1 -type f -name "ibg_*.sh" -print >> .candidates.tmp || true

# 2) Archivos 0 bytes o directorios vacíos
echo "== Archivos 0 bytes / directorios vacíos ==" | tee -a "$REPORT"
ZERO=0
while IFS= read -r -d '' f; do
  ZERO=1
  echo "  • 0 bytes -> $f" | tee -a "$REPORT"
  add_candidate "$f"
done < <(find . -type f -size 0 -not -path "./.git/*" -print0 2>/dev/null || true)
[ "$ZERO" -eq 0 ] && echo "  ✔ Ninguno." | tee -a "$REPORT"

EMPTYD=0
while IFS= read -r -d '' d; do
  EMPTYD=1
  echo "  • dir vacío -> $d" | tee -a "$REPORT"
  add_candidate "$d"
done < <(find . -type d -empty -not -path "./.git*" -not -path "." -print0 2>/dev/null || true)
[ "$EMPTYD" -eq 0 ] && echo "  ✔ Ninguno." | tee -a "$REPORT"
echo | tee -a "$REPORT"

# 3) JS/CSS/HTML huérfanos (no referenciados por ningún HTML)
echo "== Posibles huérfanos (no referenciados por *.html) ==" | tee -a "$REPORT"
ORPH=0
while IFS= read -r -d '' f; do
  # No marcar cosas obvias que sí usamos
  base="$(basename "$f")"
  case "$base" in
    # Conserva los conocidos que usa tu home
    "env-ads-inline.js"|"ads-exo-sides.js"|"ads-exo-bottom.js"|"ads-ero-ctrl.js"|"ads-popads.js"|"content-data1.js"|"content-data2.js"|"content-data3.js"|"content-data4.js"|"content-data5.js"|"content-data6.js"|"banner-rotator.js"|"gallery.js")
      continue
    ;;
  esac

  if ! referenced_in_html "$f"; then
    ORPH=1
    echo "  • (huérfano) $f" | tee -a "$REPORT"
    add_candidate "$f"
  fi
done < <(find . -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) -not -path "./.git/*" -print0)

[ "$ORPH" -eq 0 ] && echo "  ✔ No se detectaron huérfanos evidentes (o están incluidos dinámicamente)." | tee -a "$REPORT"
echo | tee -a "$REPORT"

# 4) Elementos concretos que han dado guerra en logs: ibg-ads-env-patch.js / ibg-home-fixes.js
echo "== Comprobación de ficheros polémicos ==" | tee -a "$REPORT"
for f in "public/js/ibg-ads-env-patch.js" "public/js/ibg-home-fixes.js"; do
  if exists "$f"; then
    if referenced_in_html "$f"; then
      echo "  • $f EXISTE y está referenciado -> conservar." | tee -a "$REPORT"
    else
      echo "  • $f EXISTE pero NO está referenciado -> candidato a borrar." | tee -a "$REPORT"
      add_candidate "$f"
    fi
  else
    # Si no existen pero hay referencia en HTML, lo avisamos
    base="$(basename "$f")"
    if grep -RIl "$base" --include='*.html' . >/dev/null 2>&1; then
      echo "  • $f NO existe pero aparece referenciado en HTML -> revisa referencias (posible eliminación de la etiqueta <script>)."
      # No añadimos al delete, porque no existe; será un fix manual de HTML
    fi
  fi
done
echo | tee -a "$REPORT"

# 5) Depuración final y salida ordenada
sort -u .candidates.tmp > .candidates.sorted || true
rm -f .candidates.tmp

echo "== RESUMEN DE CANDIDATOS A BORRAR (revisa antes) ==" | tee -a "$REPORT"
if [ -s .candidates.sorted ]; then
  cat .candidates.sorted | tee -a "$REPORT"
else
  echo "  (Vacío) — No se detectaron candidatos claros." | tee -a "$REPORT"
fi
echo | tee -a "$REPORT"

# 6) Genera script de borrado (NO se ejecuta)
echo "#!/usr/bin/env bash" > "$DEL"
echo "set -euo pipefail" >> "$DEL"
echo >> "$DEL"
if [ -s .candidates.sorted ]; then
  while IFS= read -r line; do
    # Protección mínima: evita . y .git
    [ "$line" = "." ] && continue
    [[ "$line" == .git/* ]] && continue
    echo "rm -rf \"$line\"" >> "$DEL"
  done < .candidates.sorted
  chmod +x "$DEL"
  echo "Se generó '$DEL'. REVÍSALO antes de ejecutarlo." | tee -a "$REPORT"
else
  echo "No hay nada que borrar; no se genera $DEL." | tee -a "$REPORT"
fi

echo | tee -a "$REPORT"
echo "Informe: $REPORT"
echo "✅ Auditoría terminada."
