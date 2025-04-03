#!/bin/bash

# This script allows to re-encode a video for proper streaming.
INPUT_DIR="./" # or your absolute path
OUTPUT_SUFFIX="-safari"
EXT="mp4"

for file in "$INPUT_DIR"/*.$EXT; do
  filename=$(basename "$file" .${EXT})
  output="${INPUT_DIR}/${filename}${OUTPUT_SUFFIX}.${EXT}"

  echo "Re-encoding $file → $output"

  ffmpeg -i "$file" \
    -c:v libx264 -profile:v main -pix_fmt yuv420p \
    -movflags +faststart \
    -c:a copy \
    "$output"
done