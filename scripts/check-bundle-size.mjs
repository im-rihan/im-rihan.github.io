// Guards against silent bundle-size regressions on the homepage's critical path.
//
// Parses the exported homepage HTML for the <script> chunks the browser actually
// requests on first load (shared runtime + route chunk — NOT the lazily-imported
// 3D scene / Supabase client, which only load on demand), sums their gzip size,
// and fails the build if that total exceeds the budget below.
//
// Run after `npm run build` (static export must exist at ./out).

import { readFileSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";

const OUT_DIR = "out";
const HOMEPAGE = path.join(OUT_DIR, "index.html");

// Calibrated against the measured baseline (~353 KB gzip, since "/" renders every
// homepage section in one route) plus headroom for legitimate growth — this exists
// to catch accidental regressions (e.g. an eagerly imported heavy dependency),
// not to block every kilobyte of change.
// Tightened from 400 KB after server-component section split.
// Measured baseline ~335 KB gzip; 340 KB allows chunk-split variance without
// blocking CI on sub-KB drift (still catches accidental heavy imports).
const BUDGET_GZIP_KB = 340;

function fail(message) {
    console.error(`\n✖ Bundle size check failed: ${message}\n`);
    process.exit(1);
}

if (!existsSync(HOMEPAGE)) {
    fail(`${HOMEPAGE} not found — run "npm run build" first.`);
}

const html = readFileSync(HOMEPAGE, "utf8");
const scriptSrcs = [...html.matchAll(/<script[^>]+src="(\/_next\/static\/[^"]+\.js)"/g)].map(
    (m) => m[1]
);

if (scriptSrcs.length === 0) {
    fail("No <script> tags found in the exported homepage — parser may be out of date.");
}

let totalRaw = 0;
let totalGzip = 0;
const rows = [];

for (const src of scriptSrcs) {
    const filePath = path.join(OUT_DIR, src.replace(/^\//, ""));
    if (!existsSync(filePath)) continue;
    const buf = readFileSync(filePath);
    const gzip = gzipSync(buf, { level: 9 });
    totalRaw += buf.length;
    totalGzip += gzip.length;
    rows.push({ src, raw: buf.length, gzip: gzip.length });
}

rows.sort((a, b) => b.gzip - a.gzip);

console.log("Homepage first-load JS (gzip):\n");
for (const row of rows) {
    console.log(`  ${(row.gzip / 1024).toFixed(1).padStart(7)} KB  ${row.src}`);
}
console.log(`\n  Total: ${(totalGzip / 1024).toFixed(1)} KB gzip (${(totalRaw / 1024).toFixed(1)} KB raw) across ${rows.length} chunk(s)`);
console.log(`  Budget: ${BUDGET_GZIP_KB} KB gzip\n`);

const totalGzipKb = totalGzip / 1024;
if (totalGzipKb > BUDGET_GZIP_KB) {
    fail(
        `Homepage first-load JS is ${totalGzipKb.toFixed(1)} KB gzip, over the ${BUDGET_GZIP_KB} KB budget. ` +
            `If this growth is intentional, raise BUDGET_GZIP_KB in scripts/check-bundle-size.mjs.`
    );
}

console.log("✓ Bundle size within budget.\n");
