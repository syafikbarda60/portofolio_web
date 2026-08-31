import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const OUT_DIR = path.join(ROOT_DIR, 'public', 'projects');

import { execSync } from 'child_process';

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function killPort(port) {
  try {
    execSync(`powershell -Command "Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"`);
  } catch (e) {
    // ignore
  }
}

async function startServer(cwd, command, args, port, readyRegex) {
  return new Promise((resolve, reject) => {
    console.log(`Starting server in ${cwd}...`);
    const server = spawn(command, args, { cwd, shell: true });
    
    const checkReady = (data) => {
      const msg = data.toString();
      if (readyRegex && readyRegex.test(msg)) {
        console.log(`Server on port ${port} is ready!`);
        resolve(server);
      }
    };
    server.stdout.on('data', checkReady);
    server.stderr.on('data', checkReady);

    server.on('error', (err) => {
      console.error(`Failed to start server in ${cwd}:`, err);
      reject(err);
    });

    server.on('close', (code) => {
      console.log(`Server in ${cwd} exited with code ${code}`);
    });

    // Always resolve after 15s to prevent hanging
    setTimeout(() => {
      console.log(`Safety timeout: Assuming server on port ${port} is ready...`);
      resolve(server);
    }, 15000);
  });
}

async function captureDrift(browser) {
  const page = await browser.newPage();
  page.on('console', msg => console.log('DRIFT LOG:', msg.text()));
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log('Capturing Drift landing page...');
  await page.goto('http://127.0.0.1:3011', { waitUntil: 'load' });
  await wait(3000);
  await page.screenshot({ path: path.join(OUT_DIR, 'drift.png') });
  
  console.log('Capturing Drift landing page (scrolled 800px)...');
  await page.evaluate(() => window.scrollTo(0, 800));
  await wait(500); // let animations settle
  await page.screenshot({ path: path.join(OUT_DIR, 'drift-1.png') });
  
  console.log('Capturing Drift landing page (scrolled 1600px)...');
  await page.evaluate(() => window.scrollTo(0, 1600));
  await wait(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'drift-2.png') });

  console.log('Capturing Drift editor page...');
  await page.goto('http://127.0.0.1:3011/editor', { waitUntil: 'load' });
  await wait(3000);
  await page.screenshot({ path: path.join(OUT_DIR, 'drift-3.png') });
  
  // Maybe try clicking a template if available to get a different editor state
  // But just scrolling slightly if it's scrollable or opening a modal would be cool
  await page.evaluate(() => window.scrollTo(0, 500));
  await wait(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'drift-4.png') });

  await page.close();
}

async function captureCreation(browser) {
  const page = await browser.newPage();
  page.on('console', msg => console.log('CREATION LOG:', msg.text()));
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log('Capturing Creation dashboard (default)...');
  
  await page.goto('http://localhost:3025/', { waitUntil: 'load' });
  await wait(4000);
  const title = await page.title();
  const text = await page.evaluate(() => document.body.innerText.substring(0, 100));
  console.log('CREATION TITLE:', title);
  console.log('CREATION TEXT:', text);
  await page.screenshot({ path: path.join(OUT_DIR, 'creation-exam.png') });

  await wait(1000);
  
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const startBtn = btns.find(b => b.textContent && (b.textContent.includes('SIMULASI EXAM') || b.textContent.includes('MULAI UJIAN') || b.textContent.includes('Masuk ke Dashboard')));
    if (startBtn) {
      startBtn.click();
      return true;
    }
    return false;
  });
  
  if (clicked) {
    console.log('Clicked start button, waiting for transition...');
    await wait(2000);
    await page.screenshot({ path: path.join(OUT_DIR, 'creation-exam-1.png') });
  } else {
    console.log('Could not find start button. Scrolling instead.');
    await page.evaluate(() => window.scrollTo(0, 800));
    await wait(500);
    await page.screenshot({ path: path.join(OUT_DIR, 'creation-exam-1.png') });
  }

  console.log('Capturing Creation Admin page...');
  await page.goto('http://localhost:3025/admin', { waitUntil: 'load' });
  await wait(4000);
  await page.screenshot({ path: path.join(OUT_DIR, 'creation-exam-2.png') });
  
  await page.evaluate(() => window.scrollTo(0, 500));
  await wait(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'creation-exam-3.png') });
  
  await page.close();
}

async function main() {
  console.log('Starting servers...');
  killPort(3011);
  killPort(3025);
  await wait(1000);
  // Drift
  const driftServer = await startServer('C:\\Projects\\Drift', 'npx', ['next', 'dev', '-p', '3011'], 3011, /Ready in/i);
  // Creation out
  const creationServer = await startServer('C:\\Projects\\Creation\\chamo-exam-app\\frontend\\out', 'npx', ['serve', '-p', '3025'], 3025, /Accepting connections/i);
  
  // Let servers breathe
  await wait(3000);

  const browser = await puppeteer.launch({ 
    headless: 'new',
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  
  try {
    await captureDrift(browser);
    await captureCreation(browser);
  } catch (err) {
    console.error('Error capturing:', err);
  } finally {
    await browser.close();
    driftServer.kill();
    creationServer.kill();
    console.log('Done!');
    process.exit(0);
  }
}

main();
