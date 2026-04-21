#!/usr/bin/env bash
# Hero-Video auf Web-freundliche Groesse komprimieren.
#
# Voraussetzung: ffmpeg (brew install ffmpeg)
#
# Erzeugt zwei Varianten:
#   - H.264/MP4  (universeller Fallback, Safari/iOS zwingend)
#   - VP9/WebM   (Chrome/Firefox, ~30-40% kleiner bei gleicher Qualitaet)
#
# Die vorhandene Hero-Quelle wird nicht ueberschrieben, sondern in
# "<name>-web.mp4" / "<name>.webm" gespiegelt. Nach dem Test koennen die
# Originale verworfen und die -web.mp4 als neue Hero-Quelle umbenannt werden.

set -euo pipefail

SRC="public/es-gebaeudereinigung-hero-section-video.mp4"
BASENAME="${SRC%.*}"

if [ ! -f "$SRC" ]; then
  echo "Quell-Video nicht gefunden: $SRC" >&2
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg nicht installiert. Mit 'brew install ffmpeg' installieren." >&2
  exit 1
fi

# Zielaufloesung: 1280 Breite reicht fuer Hintergrundvideo auch auf 4K-Screens,
# weil das Video immer stark weichgezeichnet/overlayed wird.
SCALE="scale='min(1280,iw)':-2"

echo "==> H.264/MP4 (CRF 30, tonlos, faststart)"
ffmpeg -y -i "$SRC" \
  -vf "$SCALE" \
  -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p \
  -profile:v main -level 4.0 \
  -movflags +faststart \
  -an \
  "${BASENAME}-web.mp4"

echo "==> VP9/WebM (CRF 34, tonlos)"
ffmpeg -y -i "$SRC" \
  -vf "$SCALE" \
  -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -threads 4 \
  -tile-columns 2 -frame-parallel 1 \
  -auto-alt-ref 1 -lag-in-frames 25 \
  -an \
  "${BASENAME}.webm"

echo ""
echo "Fertig. Groessen:"
ls -lh "$SRC" "${BASENAME}-web.mp4" "${BASENAME}.webm"

echo ""
echo "Nach dem Sichtcheck:"
echo "  mv ${BASENAME}-web.mp4 ${BASENAME}.mp4"
echo "  (die .webm bleibt als zusaetzliche Source in HeroV2.tsx)"
