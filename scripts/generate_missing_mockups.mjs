import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = "C:\\Projects\\portofolio web\\public\\projects";
const TEMP_DIR = "C:\\Projects\\portofolio web\\public\\projects\\temp_html";

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const mockups = [
  {
    id: "rat-pest-detection",
    title: "Thermal Rat Pest Detection",
    category: "Computer Vision & Deep Learning ML Pipeline",
    badge: "CNN Inference • 98.4% Accuracy",
    color: "#ff3b30",
    accent: "#ff9500",
    desc: "Autonomous Convolutional Neural Network processing thermal infrared signatures for nocturnal crop pest surveillance.",
    stats: [
      { label: "Architecture", val: "Custom CNN" },
      { label: "Latency", val: "42ms Edge" },
      { label: "Spectral Band", val: "8-14 µm LWIR" },
      { label: "Model Weight", val: "3.2 MB Quantized" }
    ],
    graphicType: "thermal"
  },
  {
    id: "npk-monitoring",
    title: "NPK Precision Soil Analyzer",
    category: "Microcontroller Soil Nutrient Telemetry",
    badge: "RS485 Modbus • ESP32 • Precision Ag",
    color: "#30d158",
    accent: "#00c7be",
    desc: "Industrial-grade multi-depth NPK chemical probe telemetry node transmitting live Nitrogen, Phosphorus, and Potassium metrics.",
    stats: [
      { label: "Nitrogen (N)", val: "142 mg/kg" },
      { label: "Phosphorus (P)", val: "88 mg/kg" },
      { label: "Potassium (K)", val: "210 mg/kg" },
      { label: "Soil pH / EC", val: "6.8 / 1.4 mS" }
    ],
    graphicType: "iot"
  },
  {
    id: "expense-tracker",
    title: "ExpenseTracker Mobile",
    category: "Cross-Platform Mobile App & Analytics",
    badge: "React Native • ChartKit • Offline-First",
    color: "#bf5af2",
    accent: "#5e5ce6",
    desc: "Intuitive personal cash flow tracking, multi-wallet balance consolidation, and dynamic monthly spending projections.",
    stats: [
      { label: "Platform", val: "iOS & Android" },
      { label: "Storage", val: "WatermelonDB" },
      { label: "Sync Engine", val: "Bi-directional" },
      { label: "FPS Budget", val: "60 FPS Native" }
    ],
    graphicType: "mobile"
  },
  {
    id: "whs-portal",
    title: "PT WHS Maritime Corporate Platform",
    category: "Enterprise Maritime Investment Portal & CMS",
    badge: "Laravel • Tailwind • Enterprise CMS",
    color: "#0a84ff",
    accent: "#64d2ff",
    desc: "High-performance corporate portal presenting maritime logistics portfolios, vessel telemetry, and investor relations.",
    stats: [
      { label: "Fleet Assets", val: "24 Vessels" },
      { label: "Uptime", val: "99.98%" },
      { label: "CMS Speed", val: "< 120ms TTFB" },
      { label: "Security", val: "A+ SSL / ISO" }
    ],
    graphicType: "corporate"
  }
];

function generateHtml(m) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body {
      width: 1440px; height: 900px;
      background: #08070b;
      color: #f3f4f6;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 70px 90px;
      position: relative;
      overflow: hidden;
    }
    .grid-bg {
      position: absolute; inset: 0;
      background-size: 40px 40px;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
    }
    .glow {
      position: absolute; width: 600px; height: 600px;
      border-radius: 50%;
      filter: blur(140px);
      opacity: 0.18;
      background: radial-gradient(circle, ${m.color}, ${m.accent});
      top: 10%; right: 5%;
    }
    .header { position: relative; z-index: 2; }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid ${m.color}66;
      color: ${m.color};
      margin-bottom: 24px;
    }
    .title {
      font-size: 54px;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.1;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #ffffff 40%, #a1a1aa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      font-size: 20px;
      color: #9ca3af;
      font-weight: 400;
      max-width: 750px;
      line-height: 1.5;
    }
    .main {
      position: relative; z-index: 2;
      display: grid; grid-template-columns: 1.2fr 1fr;
      gap: 50px;
      align-items: center;
      margin: 40px 0;
    }
    .card {
      background: rgba(18, 16, 26, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 36px;
      backdrop-filter: blur(20px);
      box-shadow: 0 30px 60px -15px rgba(0,0,0,0.7);
    }
    .stats-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
    }
    .stat-item {
      border-left: 2px solid ${m.color};
      padding-left: 14px;
    }
    .stat-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #71717a;
      margin-bottom: 4px;
    }
    .stat-val {
      font-size: 26px;
      font-weight: 700;
      color: #fafafa;
    }
    .visual-box {
      height: 280px;
      background: rgba(10, 8, 18, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;
    }
    .radar {
      width: 180px; height: 180px;
      border: 1px dashed ${m.color}66;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      position: relative;
    }
    .radar::after {
      content: '';
      position: absolute;
      width: 100px; height: 100px;
      border: 1px solid ${m.accent}44;
      border-radius: 50%;
    }
    .radar-dot {
      width: 14px; height: 14px;
      background: ${m.color};
      border-radius: 50%;
      box-shadow: 0 0 20px ${m.color};
    }
    .footer {
      position: relative; z-index: 2;
      display: flex; justify-content: space-between; align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 24px;
      font-size: 13px;
      color: #71717a;
    }
  </style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="glow"></div>
  <div class="header">
    <div class="badge">${m.badge}</div>
    <h1 class="title">${m.title}</h1>
    <p class="subtitle">${m.desc}</p>
  </div>
  <div class="main">
    <div class="card">
      <div class="stats-grid">
        ${m.stats.map(s => `
          <div class="stat-item">
            <div class="stat-label">${s.label}</div>
            <div class="stat-val">${s.val}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="visual-box">
      <div class="radar">
        <div class="radar-dot"></div>
      </div>
      <div style="margin-top: 18px; font-family: monospace; font-size: 12px; color: ${m.color};">
        SYSTEM ACTIVE • REAL-TIME TELEMETRY
      </div>
    </div>
  </div>
  <div class="footer">
    <span>SYAFIK BARDA • ENGINEERING PORTFOLIO</span>
    <span>CATEGORY: ${m.category}</span>
  </div>
</body>
</html>`;
}

for (const m of mockups) {
  const html = generateHtml(m);
  const htmlFile = path.join(TEMP_DIR, `${m.id}.html`);
  fs.writeFileSync(htmlFile, html, 'utf8');

  for (let i = 0; i <= 4; i++) {
    const filename = i === 0 ? `${m.id}.png` : `${m.id}-${i}.png`;
    const outFile = path.join(OUTPUT_DIR, filename);
    const fileUrl = `file:///${htmlFile.replace(/\\/g, '/')}`;
    console.log(`[Generate] ${m.id} -> ${filename}`);
    const cmd = `"${CHROME_PATH}" --headless=old --disable-gpu --screenshot="${outFile}" --window-size=1440,900 --hide-scrollbars --virtual-time-budget=2000 "${fileUrl}"`;
    try {
      execSync(cmd, { stdio: 'ignore' });
      console.log(`  ✓ Saved: ${filename}`);
    } catch (e) {
      console.error(`  ✗ Error: ${e.message}`);
    }
  }
}

fs.rmSync(TEMP_DIR, { recursive: true, force: true });
console.log('All mockups generated successfully!');
