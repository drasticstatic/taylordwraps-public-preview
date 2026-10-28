#!/usr/bin/env node
// Fails (exit 1) if the assembled Car Show references a local file that isn't in it.
// Checks src/href/poster/srcset in every .html, url() in every .css, and asset-path string
// literals in every .js. No dependencies.   node scripts/check-site.mjs site
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(process.argv[2] || "site");
if (!existsSync(root)) { console.error(`usage: check-site.mjs <assembled dir> (${root} not found)`); process.exit(2); }

// http:, mailto:, data:, javascript:, //cdn, #anchor, and %23 (an encoded # inside inline SVG data URIs)
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|%23)/i;
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p); else files.push(p);
  }
})(root);

const missing = new Map(); // target -> Set(of referrers)
function check(ref, fromDir, referrer) {
  if (!ref || EXTERNAL.test(ref) || ref.includes("${")) return;
  const clean = ref.split(/[?#]/)[0];
  if (!clean) return;
  let target = clean.startsWith("/") ? join(root, clean) : join(fromDir, clean);
  if (clean.endsWith("/") || (existsSync(target) && statSync(target).isDirectory())) target = join(target, "index.html");
  if (!existsSync(target)) {
    const key = relative(root, target);
    if (!missing.has(key)) missing.set(key, new Set());
    missing.get(key).add(relative(root, referrer));
  }
}

for (const f of files) {
  const text = /\.(html?|css|m?js)$/i.test(f) ? readFileSync(f, "utf8") : null;
  if (text === null) continue;
  if (/\.html?$/i.test(f)) {
    for (const m of text.matchAll(/\s(?:src|href|poster)\s*=\s*["']([^"']+)["']/gi)) check(m[1].trim(), dirname(f), f);
    for (const m of text.matchAll(/\ssrcset\s*=\s*["']([^"']+)["']/gi))
      for (const part of m[1].split(",")) check(part.trim().split(/\s+/)[0], dirname(f), f);
  } else if (/\.css$/i.test(f)) {
    for (const m of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) check(m[1].trim(), dirname(f), f);
  } else {
    // Scripts run in the page at the site root, so their paths resolve from there.
    for (const m of text.matchAll(/["'`]((?:\.\/)?(?:assets|fonts|archive|shared)\/[^"'`\s?#]+)["'`]/g)) check(m[1], root, f);
  }
}

if (missing.size) {
  console.error(`✗ check-site: ${missing.size} referenced file(s) missing from ${relative(process.cwd(), root) || "."}`);
  for (const [target, from] of missing) console.error(`  - ${target}  (from ${[...from].join(", ")})`);
  process.exit(1);
}
console.log(`✓ check-site: every local reference in ${files.length} files resolves`);
