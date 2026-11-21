import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
process.env.CHROME_PATH = CHROME_PATH;

const routes = [
  { name: 'Landing (/)', url: 'http://127.0.0.1:4173/' },
  { name: 'Login (/login)', url: 'http://127.0.0.1:4173/login' },
  { name: 'Overview (/app)', url: 'http://127.0.0.1:4173/app' },
  { name: 'Customers (/app/customers)', url: 'http://127.0.0.1:4173/app/customers' },
];

const NUM_RUNS = 3;
const outDir = path.resolve('test-results/audit-rigorous');
fs.mkdirSync(outDir, { recursive: true });

console.log('='.repeat(70));
console.log('🚀 RUNNING RIGOROUS AUDIT (SIMULATED MOBILE, 3 RUNS PER ROUTE)');
console.log('='.repeat(70));

const resultsByRoute = {};

for (const route of routes) {
  console.log(`\nAuditing: ${route.name} (${route.url}) ...`);
  const runs = [];

  for (let i = 1; i <= NUM_RUNS; i++) {
    const reportPath = path.join(outDir, `${route.name.replace(/[^a-zA-Z0-9]/g, '_')}_run${i}.json`);
    const cmd = `npx -y lighthouse "${route.url}" --preset=perf --formFactor=mobile --throttling-method=simulate --output=json --output-path="${reportPath}" --chrome-flags="--headless --no-sandbox --disable-gpu" --quiet`;

    try {
      execSync(cmd, { stdio: 'pipe', timeout: 120000 });
      const raw = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

      const score = Math.round((raw.categories.performance?.score || 0) * 100);
      const lcp = Math.round(raw.audits['largest-contentful-paint']?.numericValue || 0);
      const fcp = Math.round(raw.audits['first-contentful-paint']?.numericValue || 0);
      const tbt = Math.round(raw.audits['total-blocking-time']?.numericValue || 0);
      const cls = Number((raw.audits['cumulative-layout-shift']?.numericValue || 0).toFixed(3));
      const totalByteWeight = Math.round((raw.audits['total-byte-weight']?.numericValue || 0) / 1024);

      console.log(`  Run ${i}: Score = ${score}, LCP = ${lcp} ms, TBT = ${tbt} ms, CLS = ${cls}, Total = ${totalByteWeight} kB`);

      runs.push({ run: i, score, lcp, fcp, tbt, cls, totalByteWeight });
    } catch (err) {
      console.error(`  Run ${i} failed:`, err.message);
    }
  }

  // Sort by score to find median
  runs.sort((a, b) => a.score - b.score);
  const median = runs[Math.floor(runs.length / 2)];
  resultsByRoute[route.name] = { runs, median };
}

console.log('\n' + '='.repeat(70));
console.log('📊 MEDIAN RESULTS SUMMARY (SIMULATED MOBILE)');
console.log('='.repeat(70));
console.table(
  Object.entries(resultsByRoute).map(([name, { median }]) => ({
    Route: name,
    Score: median.score,
    'LCP (ms)': median.lcp,
    'FCP (ms)': median.fcp,
    'TBT (ms)': median.tbt,
    CLS: median.cls,
    'Total (kB)': median.totalByteWeight,
  }))
);

fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(resultsByRoute, null, 2));
console.log(`\nDetailed reports saved to ${outDir}`);
