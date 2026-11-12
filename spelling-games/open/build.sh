#!/bin/sh
# Rebuilds the open-play copy of every game from the live game next door
# (spelling-games/<game>/index.html -> spelling-games/open/<game>/index.html).
# Run it after a live game changes, bump VERSION (and OPEN_VERSION in open.js
# and the footer of open/index.html), then commit.
#
# The only changes to each game:
#   ../roster.js           -> ../open.js  (no roster, no PIN, no API, no saving)
#   ../play/index.html     -> ../index.html (the open-play menu)
#   shared data and audio  -> ../../  (one folder deeper)
#   footer version         -> VERSION
set -e
VERSION="WFA-12.11.26a"
cd "$(dirname "$0")"
GAMES="contraction-clinic dictionary-dash fill-the-gap grapheme-sort letter-detective look-write-check memory-pairs phoneme-frames spelling-bee spelling-pop spot-the-mistake suffix-builder syllable-split volcano-escape word-chomper word-jumble word-maze word-search patterns"
for g in $GAMES; do
  mkdir -p "$g"
  sed -E \
    -e 's#"\.\./play/index\.html#"../index.html#g' \
    -e 's#"\.\./roster\.js"#"../open.js"#' \
    -e 's#(["`])\.\./(lessons-data\.js|spelling-pool\.js|spelling-patterns-data\.js|homophones-data\.js|audio/|audio-syllables/|audio-phonemes/)#\1../../\2#g' \
    -e "s#&middot; v[0-9]{2}\.[0-9]{2}\.[0-9]{2}[a-z]?#\&middot; $VERSION#" \
    "../$g/index.html" > "$g/index.html"
  if grep -q '"\.\./roster\.js"\|api\.wallscourt-farm-academy' "$g/index.html"; then
    echo "STOP: $g still points at the roster or the API" >&2; exit 1
  fi
done
echo "Built $(echo $GAMES | wc -w | tr -d ' ') open-play pages at $VERSION"
