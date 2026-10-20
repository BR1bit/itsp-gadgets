#!/bin/bash
# Copia los gadgets aprobados de este repo al repo principal de la plataforma.
# Lo corre un DOCENTE/ADMIN tras mergear un PR; NUNCA un alumno (nadie toca el server por acá).
#
# Uso:  ./scripts/sync-a-produccion.sh /ruta/al/repo/InfraNuevaUI
#
# Después, en el repo principal: revisar el git diff, agregar el <script src> del gadget
# nuevo en templates/escritorio.html, y desplegar como siempre (push dev -> pull + restart).
set -euo pipefail

DESTINO_REPO="${1:-}"
if [ -z "$DESTINO_REPO" ] || [ ! -d "$DESTINO_REPO/static/js/gadgets" ]; then
  echo "Uso: $0 /ruta/al/repo/InfraNuevaUI"
  echo "(el destino debe tener static/js/gadgets/)"
  exit 1
fi

AQUI="$(cd "$(dirname "$0")/.." && pwd)"
DST="$DESTINO_REPO/static/js/gadgets"

echo "== Validando antes de copiar =="
node "$AQUI/validar.js"

echo "== Copiando gadgets/*.js -> $DST =="
nuevos=()
for f in "$AQUI"/gadgets/*.js; do
  base="$(basename "$f")"
  if [ ! -f "$DST/$base" ]; then nuevos+=("$base"); fi
  cp "$f" "$DST/$base"
  echo "  copiado $base"
done

echo
echo "== Listo. Pasos manuales en el repo principal =="
echo "1) Revisá:  git -C \"$DESTINO_REPO\" status  &&  git -C \"$DESTINO_REPO\" diff"
if [ "${#nuevos[@]}" -gt 0 ]; then
  echo "2) Agregá en templates/escritorio.html (junto a los otros gadgets) estas líneas:"
  for b in "${nuevos[@]}"; do
    id="${b%.js}"
    echo "     <script src=\"{{ url_for('static', filename='js/gadgets/$id.js') }}?v=1\"></script>"
  done
else
  echo "2) (No hay gadgets nuevos; solo se actualizaron existentes — no hace falta tocar escritorio.html)"
fi
echo "3) Commit + push dev, y en el server: git pull + systemctl restart flaskregistro"
