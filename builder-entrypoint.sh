#!/bin/sh
set -eu

CONTENT=/content
OUTPUT=/output
KEEP=${KEEP_BUILDS:-5}
INTERVAL=${POLL_INTERVAL:-60}
STATE="$OUTPUT/.builder-state"

# content churns and can be large, so stat metadata is enough to spot edits
hash_content() {
  find "$CONTENT" -type f -not -name '*.partial' -not -name '.*' \
    -exec stat -c '%n %s %Y' {} + 2>/dev/null | sort | sha256sum | cut -d' ' -f1
}

# code is hashed by content, so a redeploy that reclones identical sources
# (fresh mtimes, same bytes) is correctly seen as unchanged
hash_code() {
  find ./quartz ./package.json ./package-lock.json ./quartz.config.ts ./quartz.layout.ts \
    ./globals.d.ts ./index.d.ts ./tsconfig.json -type f \
    -not -path './quartz/.quartz-cache/*' \
    -exec sha256sum {} + 2>/dev/null | sort | sha256sum | cut -d' ' -f1
}

code=$(hash_code)
published=$(cat "$STATE" 2>/dev/null || echo "")
prev=""

echo "[builder] code $code, last published '${published:-none}'"

while :; do
  cur=$(hash_content)
  want="$cur $code"
  should_build=""

  if [ "$want" != "$published" ]; then
    # content matching the last publish is settled by definition, so a code-only
    # change can rebuild at once; otherwise wait for the tree to stop moving
    if [ "$cur" = "${published% *}" ] || [ "$cur" = "$prev" ]; then
      should_build=1
    fi
  fi

  if [ -n "$should_build" ]; then
    ts=$(date -u +%Y%m%dT%H%M%SZ)
    dest="$OUTPUT/build-$ts"

    # stamp the version before quartz runs — PageTitle bundles it in at build time
    version=$(node ./bump-content-version.mjs) || version=""

    if [ -z "$version" ]; then
      echo "[builder] VERSION BUMP FAILED — skipping this cycle"
    else
      echo "[builder] building $version -> $dest"

      if node ./quartz/bootstrap-cli.mjs build -d "$CONTENT" -o "$dest"; then
        # only advance the counter once the build it stamped has succeeded
        mv -f "$OUTPUT/.contentVersion.next.json" "$OUTPUT/contentVersion.json"
        ln -sfn "build-$ts" "$OUTPUT/.current.tmp"
        mv -Tf "$OUTPUT/.current.tmp" "$OUTPUT/current"
        published="$want"
        printf '%s\n' "$want" > "$STATE"
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
