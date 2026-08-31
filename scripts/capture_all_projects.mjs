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

function killPort(port) {
  try {
    execSync(`powershell -Command "Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"`);
  } catch (e) {
    // ignore
  }
}

function checkUrl(url, timeoutMs = 45000) {
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
  console.log(`  [Capture] ${url} -> ${path.basename(outputPath)} (${width}x${height})`);
  const cmd = `"${CHROME_PATH}" --headless=old --disable-gpu --screenshot="${outputPath}" --window-size=${width},${height} --hide-scrollbars --virtual-time-budget=4000 "${url}"`;
  try {
    execSync(cmd, { stdio: 'ignore' });
    const stats = fs.statSync(outputPath);
    console.log(`    Status: ✓ SAVED (${stats.size} bytes)`);
  } catch (e) {
    console.error(`    Error capturing ${url}: ${e.message}`);
  }
}

async function runAndCapture({ name, cwd, port, captures }) {
  console.log(`\n========================================`);
  console.log(`[START] ${name} on port ${port}`);
  console.log(`Directory: ${cwd}`);

  killPort(port);
  await wait(1000);

  const child = spawn('cmd.exe', ['/c', `npx next dev -p ${port}`], {
    cwd,
    stdio: 'ignore',
    detached: true,
  });

  try {
    const url = `http://localhost:${port}`;
    console.log(`Waiting for ${url} to be available...`);
    await checkUrl(url, 45000);
    console.log(`Server responded! Waiting 4s for initial hydration & rendering...`);
    await wait(4000);

    for (const cap of captures) {
      const targetUrl = `${url}${cap.route || ''}`;
      const outFile = path.join(OUTPUT_DIR, cap.filename);
      takeScreenshot(targetUrl, outFile, cap.width || 1440, cap.height || 900);
    }
  } catch (err) {
    console.error(`[ERROR] Failed processing ${name}:`, err.message);
  } finally {
    console.log(`Stopping server on port ${port}...`);
    killPort(port);
    await wait(1500);
  }
}

async function main() {
  const projects = [
    {
      name: 'Drift',
      cwd: 'C:\\Projects\\Drift',
      port: 3011,
      captures: [
        { route: '/', filename: 'drift.png' },
        { route: '/', filename: 'drift-1.png' },
        { route: '/pricing', filename: 'drift-2.png' },
        { route: '/login', filename: 'drift-3.png' },
        { route: '/register', filename: 'drift-4.png' },
      ],
    },
    {
      name: 'HIMASKOM Official Web Portal',
      cwd: 'C:\\Projects\\Himaskom_comprof',
      port: 3012,
      captures: [
        { route: '/', filename: 'himaskom-profile.png' },
        { route: '/', filename: 'himaskom-profile-1.png' },
        { route: '/profil', filename: 'himaskom-profile-2.png' },
        { route: '/profil/filosofi', filename: 'himaskom-profile-3.png' },
        { route: '/store', filename: 'himaskom-profile-4.png' },
      ],
    },
    {
      name: 'Swadaya Panen (PPKO Web)',
      cwd: 'C:\\Projects\\ppko-web',
      port: 3013,
      captures: [
        { route: '/', filename: 'swadaya-panen.png' },
        { route: '/', filename: 'swadaya-panen-1.png' },
        { route: '/alat', filename: 'swadaya-panen-2.png' },
        { route: '/peta', filename: 'swadaya-panen-3.png' },
        { route: '/statistik', filename: 'swadaya-panen-4.png' },
      ],
    },
    {
      name: 'CREATION 2026 Exam (Chamo Exam App)',
      cwd: 'C:\\Projects\\Creation\\chamo-exam-app\\frontend',
      port: 3014,
      captures: [
        { route: '/', filename: 'creation-exam.png' },
        { route: '/', filename: 'creation-exam-1.png' },
        { route: '/admin', filename: 'creation-exam-2.png' },
        { route: '/admin', filename: 'creation-exam-3.png' },
        { route: '/', filename: 'creation-exam-4.png' },
      ],
    },
    {
      name: 'TumbuhKita',
      cwd: 'C:\\Projects\\tumbuhkita\\frontend_nextjs',
      port: 3015,
      captures: [
        { route: '/', filename: 'tumbuhkita.png' },
        { route: '/', filename: 'tumbuhkita-1.png' },
        { route: '/', filename: 'tumbuhkita-2.png' },
        { route: '/', filename: 'tumbuhkita-3.png' },
        { route: '/', filename: 'tumbuhkita-4.png' },
      ],
    },
    {
      name: 'Lottie Dashboard',
      cwd: 'C:\\Projects\\lottie-dashboard',
      port: 3016,
      captures: [
        { route: '/', filename: 'lottie-dashboard.png' },
        { route: '/', filename: 'lottie-dashboard-1.png' },
        { route: '/', filename: 'lottie-dashboard-2.png' },
        { route: '/', filename: 'lottie-dashboard-3.png' },
        { route: '/', filename: 'lottie-dashboard-4.png' },
      ],
    },
  ];

  for (const proj of projects) {
    if (fs.existsSync(proj.cwd)) {
      await runAndCapture(proj);
    } else {
      console.log(`[SKIP] Directory not found: ${proj.cwd}`);
    }
  }

  console.log(`\n========================================`);
  console.log(`ALL CAPTURES COMPLETED!`);
  console.log(`Output files in: ${OUTPUT_DIR}`);
  console.log(`========================================\n`);
}

main();
