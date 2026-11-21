// Copies the authoritative templates from ../01_plan into ./templates so they ship with a Vercel deployment
// (files outside the deployment folder are not uploaded). Run before every deploy: npm run bundle-templates
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.resolve(root, '../01_plan');
const dest = path.resolve(root, 'templates');
const files = ['00_TestPlan/test-plan-template.md', '02_TestStrategy/test-strategy-template.md', '01_TestCases/test-case-template.md'];

for (const f of files) {
  const from = path.join(src, f);
  if (!fs.existsSync(from)) {
    console.error(`Missing template: ${from}`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(path.join(dest, f)), { recursive: true });
  fs.copyFileSync(from, path.join(dest, f));
  console.log(`bundled ${f}`);
}
