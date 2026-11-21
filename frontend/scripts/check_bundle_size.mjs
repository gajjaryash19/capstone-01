import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locate dist/assets directory
const candidateDirs = [
  path.resolve(__dirname, '../dist/assets'),
  path.resolve(__dirname, '../frontend/dist/assets'),
  path.resolve(process.cwd(), 'frontend/dist/assets'),
  path.resolve(process.cwd(), 'dist/assets'),
];

let assetsDir = null;
for (const dir of candidateDirs) {
  if (fs.existsSync(dir)) {
    assetsDir = dir;
    break;
  }
}

if (!assetsDir) {
  console.error('❌ Error: Could not find build assets directory (dist/assets).');
  console.error('   Please run `npm run build` in /frontend first.');
  process.exit(1);
}

// Find entry chunk (index-*.js)
const files = fs.readdirSync(assetsDir);
const entryFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));

if (!entryFile) {
  console.error(`❌ Error: Could not locate entry bundle (index-*.js) in ${assetsDir}.`);
  console.error('   Files found:', files);
  process.exit(1);
}

const filePath = path.join(assetsDir, entryFile);
const rawBuffer = fs.readFileSync(filePath);
const gzipBuffer = zlib.gzipSync(rawBuffer, { level: 9 });

const rawBytes = rawBuffer.length;
const gzipBytes = gzipBuffer.length;
const rawKb = (rawBytes / 1024).toFixed(2);
const gzipKb = (gzipBytes / 1024).toFixed(2);

// Phase 1 achieved baseline: 74.84 kB gzip
// Budget constraint: Phase 1 number + 10%
const PHASE_1_GZIP_KB = 74.84;
const MAX_ALLOWED_GZIP_KB = Number((PHASE_1_GZIP_KB * 1.10).toFixed(2)); // 82.32 kB
const MAX_ALLOWED_GZIP_BYTES = Math.floor(MAX_ALLOWED_GZIP_KB * 1024); // 84,295 bytes

console.log('='.repeat(70));
console.log('📦 BUNDLE SIZE BUDGET VERIFICATION (Phase 6)');
console.log('='.repeat(70));
console.log(`Asset Path:          ${path.relative(process.cwd(), filePath)}`);
console.log(`Raw Size:            ${rawBytes.toLocaleString()} bytes (${rawKb} kB)`);
console.log(`Gzip Size:           ${gzipBytes.toLocaleString()} bytes (${gzipKb} kB)`);
console.log(`Phase 1 Baseline:    ${PHASE_1_GZIP_KB} kB gzip`);
console.log(`Budget Limit (+10%): ${MAX_ALLOWED_GZIP_KB} kB gzip (${MAX_ALLOWED_GZIP_BYTES.toLocaleString()} bytes)`);

const diffKb = (gzipBytes / 1024 - MAX_ALLOWED_GZIP_KB).toFixed(2);

if (gzipBytes > MAX_ALLOWED_GZIP_BYTES) {
  console.error('\n❌ BUDGET CHECK FAILED: Entry JS exceeds the allowed budget!');
  console.error(`   Exceeded by: +${diffKb} kB gzip`);
  console.log('='.repeat(70));
  process.exit(1);
} else {
  const marginKb = (MAX_ALLOWED_GZIP_KB - gzipBytes / 1024).toFixed(2);
  console.log(`\n✅ BUDGET CHECK PASSED: Entry JS is within budget (${marginKb} kB headroom).`);
  console.log('='.repeat(70));
  process.exit(0);
}
