import fs from 'fs';
import path from 'path';

// Load portfolio data
const dataContent = fs.readFileSync('C:\\Projects\\portofolio web\\src\\data\\portfolioData.ts', 'utf8');
const projectIds = Array.from(dataContent.matchAll(/id:\s*["']([^"']+)["']/g)).map(m => m[1]);

console.log('=== AUDIT SEMUA GAMBAR PROYEK ===\n');

let totalChecked = 0;
let errors = 0;

function checkImage(relPath, context) {
  totalChecked++;
  const fullPath = path.join('C:\\Projects\\portofolio web\\public', relPath.replace(/^\//, ''));
  if (!fs.existsSync(fullPath)) {
    console.error(`[404 NOT FOUND] ${relPath} (Context: ${context})`);
    errors++;
    return false;
  }
  const stats = fs.statSync(fullPath);
  if (stats.size < 10000) {
    console.error(`[EMPTY / BLANK 404 SCREEN] ${relPath} (${stats.size} bytes - Context: ${context})`);
    errors++;
    return false;
  }
  console.log(`[OK - VALID] ${relPath.padEnd(35)} ${Math.round(stats.size / 1024)} KB (${context})`);
  return true;
}

// 1. Check Profile
checkImage('/syafik.jpg', 'Hero Profile Image');
checkImage('/projects/drift.png', 'Capabilities - Stack');
checkImage('/projects/swadaya-panen.png', 'Capabilities - Hardware');

console.log('\n--- Checking Project Covers & Galleries ---');
for (const id of projectIds) {
  checkImage(`/projects/${id}.png`, `Project Cover: ${id}`);
  for (let i = 1; i <= 4; i++) {
    checkImage(`/projects/${id}-${i}.png`, `Project Gallery ${i}: ${id}`);
  }
}

console.log(`\n========================================`);
console.log(`TOTAL IMAGES CHECKED: ${totalChecked}`);
console.log(`ERRORS / 404 / EMPTY: ${errors}`);
console.log(`STATUS: ${errors === 0 ? '✓ ALL 100% VALID & LOADABLE' : '✗ HAS ISSUES'}`);
console.log(`========================================\n`);
