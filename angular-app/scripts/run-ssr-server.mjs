import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const serverDir = join(process.cwd(), 'dist', 'angularapp', 'server');

if (!existsSync(serverDir)) {
  console.error('SSR server bundle not found. Run `npm run build:ssr` first.');
  process.exit(1);
}

const packageJsonPath = join(serverDir, 'package.json');
if (!existsSync(packageJsonPath)) {
  writeFileSync(packageJsonPath, '{\n  "type": "commonjs"\n}\n', 'utf8');
}

const candidates = readdirSync(serverDir)
  .filter((file) => /^main(\.[a-f0-9]+)?\.js$/i.test(file))
  .sort((a, b) => (a === 'main.js' ? -1 : b === 'main.js' ? 1 : a.localeCompare(b)));

if (candidates.length === 0) {
  console.error('No SSR entrypoint found in dist/angularapp/server (expected main.js or main.<hash>.js).');
  process.exit(1);
}

const entrypoint = join(serverDir, candidates[0]);
console.log(`Starting SSR server with: ${entrypoint}`);

const child = spawn(process.execPath, [entrypoint], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
