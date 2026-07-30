const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const testSvg = `
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0D1117"/>
  <rect x="100" y="100" width="1720" height="880" fill="#161B22" rx="20" stroke="#30363D" stroke-width="2"/>
  <text x="960" y="540" fill="#2EA043" font-family="Segoe UI, sans-serif" font-size="64" text-anchor="middle" font-weight="bold">ZK NEXUS REVOPS</text>
</svg>
`;

const testSvgPath = path.join(__dirname, 'test_input.svg');
const testJpgPath = path.join(__dirname, 'test_output.jpg');
const testHtmlPath = path.join(__dirname, 'test_render.html');

fs.writeFileSync(testSvgPath, testSvg);

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<style>
  html, body { margin: 0; padding: 0; width: 1920px; height: 1080px; overflow: hidden; background: #0D1117; }
  img { width: 1920px; height: 1080px; display: block; }
</style>
</head>
<body>
  <img src="file:///${testSvgPath.replace(/\\/g, '/')}" />
</body>
</html>
`;
fs.writeFileSync(testHtmlPath, htmlContent);

const edgePath = `C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe`;
const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --screenshot="${testJpgPath}" --window-size=1920,1080 "file:///${testHtmlPath.replace(/\\/g, '/')}"`;

console.log("Executing:", cmd);
try {
  execSync(cmd);
  console.log("Success! File size:", fs.statSync(testJpgPath).size);
} catch (e) {
  console.error("Error executing edge:", e);
}
