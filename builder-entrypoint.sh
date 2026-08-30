#!/bin/sh
set -eu

CONTENT=/content
OUTPUT=/output
KEEP=${KEEP_BUILDS:-5}
INTERVAL=${POLL_INTERVAL:-60}

hash_tree() {
  find "$CONTENT" -type f -not -name '*.partial' -not -name '.*' \
    -exec stat -c '%n %s %Y' {} + 2>/dev/null | sort | sha256sum | cut -d' ' -f1
}

built=""
prev=""

while :; do
  cur=$(hash_tree)

  # build only when the tree has settled (unchanged since last poll)
  # and differs from what we last published
  if [ "$cur" = "$prev" ] && [ "$cur" != "$built" ]; then
    ts=$(date -u +%Y%m%dT%H%M%SZ)
    dest="$OUTPUT/build-$ts"

    # stamp the version before quartz runs — PageTitle bundles it in at build time
    version=$(node ./bump-content-version.mjs) || version=""

    if [ -z "$version" ]; then
      echo "[builder] VERSION BUMP FAILED — skipping this cycle"
    else
      echo "[builder] content settled, building $version -> $dest"

      if node ./quartz/bootstrap-cli.mjs build -d "$CONTENT" -o "$dest"; then
        # only advance the counter once the build it stamped has succeeded
        mv -f "$OUTPUT/.contentVersion.next.json" "$OUTPUT/contentVersion.json"
        ln -sfn "build-$ts" "$OUTPUT/.current.tmp"
        mv -Tf "$OUTPUT/.current.tmp" "$OUTPUT/current"
        built="$cur"
        echo "[builder] published build-$ts as $version"
        ls -1d "$OUTPUT"/build-* 2>/dev/null | sort -r | tail -n +$((KEEP+1)) | xargs -r rm -rf
      else
        echo "[builder] BUILD FAILED — keeping previous"
        rm -rf "$dest"
      fi
    fi
  fi

  prev="$cur"
  sleep "$INTERVAL"
done
