const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, '..', '..', '06_Assets', 'Banners');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function buildLandscapeCoverSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#006680"/>
      <stop offset="100%" stop-color="#003847"/>
    </linearGradient>
    
    <linearGradient id="darkOverlay" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#09101C" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="#0B1A28" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#060E17" stop-opacity="0.4"/>
    </linearGradient>

    <linearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0099B8"/>
      <stop offset="100%" stop-color="#00D0F5"/>
    </linearGradient>

    <style>
      .bold-title { font-family: 'Segoe UI', -apple-system, system-ui, sans-serif; font-weight: 800; }
      .sans-body { font-family: 'Segoe UI', -apple-system, system-ui, sans-serif; font-weight: 400; }
      .mono-text { font-family: 'SFMono-Regular', Consolas, monospace; font-weight: 700; }
    </style>
  </defs>

  <!-- Background Base (Dark Teal Blue) -->
  <rect width="1920" height="1080" fill="#040A12"/>

  <!-- Right Side Background City Skyline & Tech Grid Pattern -->
  <g opacity="0.25">
    <path d="M 1200 600 L 1200 1080 L 1280 1080 L 1280 450 L 1340 450 L 1340 1080 L 1420 1080 L 1420 350 L 1480 350 L 1480 1080 L 1560 1080 L 1560 500 L 1650 500 L 1650 1080 L 1750 1080 L 1750 400 L 1850 400 L 1850 1080 Z" fill="#0080A8"/>
    <circle cx="1500" cy="300" r="250" fill="#00D0F5" opacity="0.15"/>
  </g>

  <!-- Curved Diagonal Geometric Waves (Teal & Dark Ribbon Overlay) -->
  <path d="M 0 0 L 1150 0 C 1050 350 900 700 1200 1080 L 0 1080 Z" fill="url(#tealGrad)"/>
  <path d="M 0 0 L 1050 0 C 920 380 780 720 1080 1080 L 0 1080 Z" fill="url(#darkOverlay)"/>

  <!-- Right Side Founder Profile Feature Card -->
  <g transform="translate(1320, 220)">
    <!-- Outer Glass Card -->
    <rect width="520" height="680" rx="24" fill="#071320" stroke="#0080A8" stroke-width="2" opacity="0.9"/>
    
    <!-- Founder Image Frame / Silhouette Avatar -->
    <circle cx="260" cy="220" r="130" fill="#091C2E" stroke="#00D0F5" stroke-width="4"/>
    <circle cx="260" cy="220" r="118" fill="#004D66"/>
    <text x="260" y="245" fill="#FFFFFF" class="bold-title" font-size="75" text-anchor="middle">ZA</text>
    
    <!-- Verified Badge -->
    <circle cx="350" cy="310" r="24" fill="#00D0F5"/>
    <path d="M 338 310 L 346 318 L 362 302" fill="none" stroke="#000" stroke-width="4" stroke-linecap="round"/>

    <!-- Founder Info -->
    <text x="260" y="410" fill="#FFFFFF" class="bold-title" font-size="34" text-anchor="middle">Zubair Ariff</text>
    <text x="260" y="448" fill="#00D0F5" class="mono-text" font-size="16" letter-spacing="3" text-anchor="middle">FOUNDER &amp; CHIEF ARCHITECT</text>
    <text x="260" y="480" fill="#8BA4C4" class="sans-body" font-size="16" text-anchor="middle">ZK Nexus Real Estate RevOps Platform</text>

    <!-- Trust Badge Pill -->
    <rect x="110" y="530" width="300" height="46" rx="23" fill="#092033" stroke="#0080A8" stroke-width="1.5"/>
    <text x="260" y="559" fill="#00D0F5" class="mono-text" font-size="14" text-anchor="middle" letter-spacing="1">100% AUTHENTIC FOUNDER</text>
  </g>

  <!-- Left Content Column -->
  <!-- Top Brand Ribbon -->
  <g transform="translate(100, 110)">
    <rect width="360" height="44" rx="22" fill="#052436" stroke="#0080A8" stroke-width="1.5"/>
    <circle cx="26" cy="22" r="6" fill="#00D0F5"/>
    <text x="44" y="28" fill="#00D0F5" class="mono-text" font-size="14" letter-spacing="2">ZK REVENUE OPS · B2B REVOPS</text>
  </g>

  <!-- Big Bold Main Headline (Matching User Reference Banner) -->
  <g transform="translate(100, 240)">
    <text x="0" y="45" fill="#8BA4C4" class="bold-title" font-size="36" letter-spacing="2">WE ARE REAL ESTATE</text>
    <text x="0" y="145" fill="#FFFFFF" class="bold-title" font-size="92" letter-spacing="1">DIGITAL SALES</text>
    <text x="0" y="235" fill="#00D0F5" class="bold-title" font-size="92" letter-spacing="1">REVENUE OPS</text>
  </g>

  <!-- Concise Description Subtext -->
  <text x="100" y="540" fill="#D0E1F9" class="sans-body" font-size="24">
    <tspan x="100" dy="0">Automated DSR Loan Qualification, AI WhatsApp Intake, and</tspan>
    <tspan x="100" dy="38">White-Label Client Portal for Top REN Negotiators in Malaysia.</tspan>
  </text>

  <!-- Key Value Pills -->
  <g transform="translate(100, 640)">
    <!-- Pill 1 -->
    <rect x="0" y="0" width="290" height="50" rx="10" fill="#082236" stroke="#0080A8" stroke-width="1"/>
    <text x="25" y="32" fill="#00D0F5" class="mono-text" font-size="15">✓ 100k+ LEAD SCALE DB</text>

    <!-- Pill 2 -->
    <rect x="310" y="0" width="290" height="50" rx="10" fill="#082236" stroke="#0080A8" stroke-width="1"/>
    <text x="335" y="32" fill="#00D0F5" class="mono-text" font-size="15">✓ PDPA 2010 ALIGNED</text>

    <!-- Pill 3 -->
    <rect x="620" y="0" width="290" height="50" rx="10" fill="#082236" stroke="#0080A8" stroke-width="1"/>
    <text x="645" y="32" fill="#00D0F5" class="mono-text" font-size="15">✓ 1 REN 1 SUB-MARKET</text>
  </g>

  <!-- CTA Section Bottom Left -->
  <g transform="translate(100, 750)">
    <rect x="0" y="0" width="340" height="70" rx="14" fill="url(#btnGrad)"/>
    <text x="170" y="43" fill="#000000" class="bold-title" font-size="20" text-anchor="middle" letter-spacing="1">START FREE 30-DAY PILOT</text>
    
    <!-- Web Link Text -->
    <text x="370" y="43" fill="#8BA4C4" class="mono-text" font-size="16">https://zkoroci10.github.io/zk-nexus-revenue-ops/</text>
  </g>
</svg>`;
}

const targetFileSvg = path.join(targetDir, 'cover_banner_16_9_landscape.svg');
const targetFileJpg = path.join(targetDir, 'cover_banner_16_9_landscape.jpg');
const htmlPath = path.join(targetDir, 'cover_banner_16_9_render.html');

fs.writeFileSync(targetFileSvg, buildLandscapeCoverSvg());
console.log(`Saved 16:9 Landscape Cover SVG: ${targetFileSvg}`);

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<style>
  html, body { margin: 0; padding: 0; width: 1920px; height: 1080px; overflow: hidden; background: #000; }
  img { width: 1920px; height: 1080px; display: block; }
</style>
</head>
<body>
  <img src="file:///${targetFileSvg.replace(/\\/g, '/')}" />
</body>
</html>
`;
fs.writeFileSync(htmlPath, htmlContent);

const edgePath = `C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe`;
const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --screenshot="${targetFileJpg}" --window-size=1920,1080 "file:///${htmlPath.replace(/\\/g, '/')}"`;

try {
  execSync(cmd);
  console.log(`Rendered 16:9 Landscape Cover JPG: ${targetFileJpg} (${fs.statSync(targetFileJpg).size} bytes)`);
} catch (err) {
  console.error("Failed rendering 16:9 Landscape Cover JPG:", err);
} finally {
  if (fs.existsSync(htmlPath)) {
    fs.unlinkSync(htmlPath);
  }
}

console.log("✅ 16:9 Landscape Cover Banner Generated Successfully!");
