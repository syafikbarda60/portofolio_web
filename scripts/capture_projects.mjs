import { spawn, execSync } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = "C:\\Projects\\portofolio web\\public\\projects";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function checkUrl(url, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      http.get(url, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 500) {
          clearInterval(interval);
          resolve(true);
        }
      }).on('error', () => {
        if (Date.now() - start > timeoutMs) {
          clearInterval(interval);
          reject(new Error(`Timeout waiting for ${url}`));
        }
      });
    }, 1000);
  });
}

function takeScreenshot(url, outputPath, width = 1440, height = 900) {
  console.log(`[Capture] Taking screenshot of ${url} -> ${outputPath}`);
  const cmd = `"${CHROME_PATH}" --headless=old --disable-gpu --screenshot="${outputPath}" --window-size=${width},${height} --hide-scrollbars --virtual-time-budget=3000 "${url}"`;
  execSync(cmd, { stdio: 'ignore' });
  console.log(`[Capture] Saved: ${outputPath} (${fs.existsSync(outputPath) ? 'SUCCESS' : 'FAILED'})`);
}

async function captureNextProject({ name, cwd, port, captures }) {
  console.log(`\n========================================`);
  console.log(`Starting project: ${name} on port ${port}...`);
  console.log(`Cwd: ${cwd}`);

  const child = spawn('cmd.exe', ['/c', `npx next dev -p ${port}`], {
    cwd,
    stdio: 'ignore',
    detached: true,
  });

  try {
    const url = `http://localhost:${port}`;
    console.log(`Waiting for ${url} to be ready...`);
    await checkUrl(url, 45000);
    console.log(`Server is ready! Waiting 3s for animations/hydration...`);
    await wait(3000);

    for (const cap of captures) {
      const targetUrl = `${url}${cap.route || ''}`;
      const outFile = path.join(OUTPUT_DIR, cap.filename);
      takeScreenshot(targetUrl, outFile, cap.width || 1440, cap.height || 900);
    }
  } catch (err) {
    console.error(`Error during capture of ${name}:`, err.message);
  } finally {
    console.log(`Stopping server on port ${port}...`);
    try {
      execSync(`powershell -Command "Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"`);
    } catch (e) {
      // ignore
    }
  }
}

async function run() {
  // 1. Drift
  await captureNextProject({
    name: 'Drift',
    cwd: 'C:\\Projects\\Drift',
    port: 3011,
    captures: [
      { route: '/', filename: 'drift.png' },
      { route: '/', filename: 'drift-1.png' },
      { route: '/pricing', filename: 'drift-2.png' },
      { route: '/login', filename: 'drift-3.png' },
    ],
  });

  console.log('\n--- Capture finished ---');
}

run();
