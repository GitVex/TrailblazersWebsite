#!/usr/bin/env node
// Stamps a builder run with the next content version.
//
// State lives in the /output volume so it survives container restarts and image
// rebuilds; the checked-in contentVersion.json only seeds the very first run.
// The bumped value is written to APP_FILE, which PageTitle bundles in at build
// time, and to NEXT_FILE, which the entrypoint promotes over STATE_FILE once the
// build it stamped has actually succeeded.

import fs from "fs"
import path from "path"

const stateFile = process.env.STATE_FILE ?? "/output/contentVersion.json"
const seedFile = process.env.SEED_FILE ?? "./contentVersion.json"
const appFile = process.env.APP_FILE ?? "./contentVersion.json"
const nextFile = process.env.NEXT_FILE ?? "/output/.contentVersion.next.json"

const readJson = (fp) => {
  try {
    return JSON.parse(fs.readFileSync(fp, "utf8"))
  } catch {
    return undefined
  }
}

const now = new Date()
const previous = readJson(stateFile) ?? readJson(seedFile)
const base = previous?.version ?? { year: now.getFullYear(), major: 1, minor: 0 }

// minor counts published builds and never resets; year and major are set by hand
const version = {
  year: now.getFullYear(),
  major: base.major,
  minor: base.minor + 1,
}

const pad = (n, width) => String(n).padStart(width, "0")
const stamp = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1, 2)}-${pad(d.getDate(), 2)} ` +
  `${pad(d.getHours(), 2)}:${pad(d.getMinutes(), 2)}`

const contentVersion = {
  version,
  lastUpdated: now.toISOString(),
  versionString:
    `v${pad(version.year % 100, 2)}.${pad(version.major, 2)}.${pad(version.minor, 3)}` +
    ` | ${stamp(now)}`,
}

for (const fp of [appFile, nextFile]) {
  fs.mkdirSync(path.dirname(path.resolve(fp)), { recursive: true })
  fs.writeFileSync(fp, JSON.stringify(contentVersion, null, 2) + "\n")
}

console.log(contentVersion.versionString)
