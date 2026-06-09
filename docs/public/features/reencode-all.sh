#!/bin/bash
#
# Optimizes every feature video in this directory for fast web delivery and
# generates a matching poster image for each one.
#
# For each .mp4/.mov source it:
#   - downscales the long edge to at most MAX_LONG_EDGE (keeps aspect ratio)
#   - caps the frame rate at 30fps
#   - encodes H.264 (high profile, yuv420p) at CRF 28
#   - drops the audio track (feature videos play muted)
#   - moves the moov atom to the front (+faststart) for progressive streaming
#   - exports the first frame to ./posters/<name>.jpg as a lightweight poster
#
# .mov sources are converted to .mp4 and the original .mov is removed.
# Re-encoding is idempotent enough to re-run; outputs replace the originals.

set -euo pipefail

INPUT_DIR="$(cd "$(dirname "$0")" && pwd)"
POSTER_DIR="${INPUT_DIR}/posters"
MAX_LONG_EDGE=1440
CRF=28

# Cap the long edge (width for landscape, height for portrait) at
# MAX_LONG_EDGE while preserving the aspect ratio. `-2` keeps the other
# dimension even, which H.264 (yuv420p) requires.
SCALE_FILTER="scale='if(gt(iw,ih),min(${MAX_LONG_EDGE},iw),-2)':'if(gt(iw,ih),-2,min(${MAX_LONG_EDGE},ih))'"

mkdir -p "$POSTER_DIR"

shopt -s nullglob
for file in "$INPUT_DIR"/*.mp4 "$INPUT_DIR"/*.mov; do
  filename="$(basename "$file")"
  name="${filename%.*}"
  tmp="${INPUT_DIR}/${name}.tmp.mp4"
  output="${INPUT_DIR}/${name}.mp4"
  poster="${POSTER_DIR}/${name}.jpg"

  echo "Optimizing $filename → $(basename "$output")"

  ffmpeg -y -i "$file" \
    -vf "$SCALE_FILTER" \
    -r 30 \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf "$CRF" \
    -movflags +faststart \
    -an \
    "$tmp"

  # Replace the original (also removes the .mov when converting from .mov).
  mv -f "$tmp" "$output"
  if [ "$file" != "$output" ]; then
    rm -f "$file"
  fi

  echo "  Poster → posters/$(basename "$poster")"
  ffmpeg -y -i "$output" -vf "$SCALE_FILTER" \
    -frames:v 1 -update 1 -q:v 4 "$poster"
done

echo "Done. Remember to update any .md asset paths if a .mov became .mp4."
