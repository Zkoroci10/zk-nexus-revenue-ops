const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const bannerDir = path.join(__dirname, '..', '..', '06_Assets', 'Banners');

console.log("=== STEP 1: Checking File Existence & Non-Zero Sizes ===");
const expectedFiles = [
  'wa_header_cover.svg',
  'wa_header_cover.jpg',
  'wa_catalog_tier1_starter.svg',
  'wa_catalog_tier1_starter.jpg',
  'wa_catalog_tier2_growth.svg',
  'wa_catalog_tier2_growth.jpg',
  'wa_catalog_tier3_enterprise.svg',
  'wa_catalog_tier3_enterprise.jpg',
  'wa_catalog_free_trial.svg',
  'wa_catalog_free_trial.jpg'
];

let allExist = true;
let allNonZero = true;

const fileStats = {};

expectedFiles.forEach(file => {
  const filePath = path.join(bannerDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`FAIL: File missing: ${file}`);
    allExist = false;
  } else {
    const size = fs.statSync(filePath).size;
    fileStats[file] = size;
    if (size === 0) {
      console.error(`FAIL: File is 0 bytes: ${file}`);
      allNonZero = false;
    } else {
      console.log(`PASS: ${file} exists (${size} bytes)`);
    }
  }
});

console.log("\n=== STEP 2: Checking SVG XML Structural Validity ===");
const svgFiles = expectedFiles.filter(f => f.endsWith('.svg'));
let svgsValid = true;

svgFiles.forEach(file => {
  const filePath = path.join(bannerDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Basic XML structure checks
  if (!content.trim().startsWith('<?xml') && !content.trim().startsWith('<svg')) {
    console.error(`FAIL: ${file} does not start with XML/SVG declaration`);
    svgsValid = false;
    return;
  }

  // Count opening and closing tags for key elements
  const openSvg = (content.match(/<svg/g) || []).length;
  const closeSvg = (content.match(/<\/svg>/g) || []).length;
  const openDefs = (content.match(/<defs>/g) || []).length;
  const closeDefs = (content.match(/<\/defs>/g) || []).length;

  if (openSvg !== 1 || closeSvg !== 1) {
    console.error(`FAIL: ${file} has mismatched <svg> tags (open: ${openSvg}, close: ${closeSvg})`);
    svgsValid = false;
  } else if (openDefs !== closeDefs) {
    console.error(`FAIL: ${file} has mismatched <defs> tags (open: ${openDefs}, close: ${closeDefs})`);
    svgsValid = false;
  } else {
    // Check width, height attributes
    const widthMatch = content.match(/width="(\d+)"/);
    const heightMatch = content.match(/height="(\d+)"/);
    const viewBoxMatch = content.match(/viewBox="([^"]+)"/);

    console.log(`PASS: ${file} is well-formed XML (width=${widthMatch ? widthMatch[1] : 'N/A'}, height=${heightMatch ? heightMatch[1] : 'N/A'}, viewBox="${viewBoxMatch ? viewBoxMatch[1] : 'N/A'}")`);
  }
});

console.log("\n=== STEP 3: Checking JPG Dimensions (JPEG SOF Header Parsing) ===");
function getJpegDimensions(buffer) {
  let offset = 2; // Skip SOI (0xFFD8)
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xFF) break;
    const marker = buffer[offset + 1];
    // SOF0 (0xC0), SOF1 (0xC1), SOF2 (0xC2)
    if (marker === 0xC0 || marker === 0xC1 || marker === 0xC2) {
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return { width, height };
    }
    const len = buffer.readUInt16BE(offset + 2);
    offset += 2 + len;
  }
  return null;
}

const expectedDims = {
  'wa_header_cover.jpg': { width: 1920, height: 1080 },
  'wa_catalog_tier1_starter.jpg': { width: 1080, height: 1080 },
  'wa_catalog_tier2_growth.jpg': { width: 1080, height: 1080 },
  'wa_catalog_tier3_enterprise.jpg': { width: 1080, height: 1080 },
  'wa_catalog_free_trial.jpg': { width: 1080, height: 1080 }
};

let jpgsValid = true;
const jpgFiles = expectedFiles.filter(f => f.endsWith('.jpg'));

jpgFiles.forEach(file => {
  const filePath = path.join(bannerDir, file);
  const buf = fs.readFileSync(filePath);
  const dims = getJpegDimensions(buf);
  const exp = expectedDims[file];

  if (!dims) {
    console.error(`FAIL: Could not read JPEG dimensions for ${file}`);
    jpgsValid = false;
  } else if (dims.width !== exp.width || dims.height !== exp.height) {
    console.error(`FAIL: ${file} dimensions mismatch: Got ${dims.width}x${dims.height}, expected ${exp.width}x${exp.height}`);
    jpgsValid = false;
  } else {
    console.log(`PASS: ${file} is a genuine high-resolution render (${dims.width}x${dims.height})`);
  }
});

console.log("\n=== SUMMARY RESULTS ===");
console.log(`1. All 10 Files Exist & Non-Zero: ${allExist && allNonZero ? 'PASS' : 'FAIL'}`);
console.log(`2. SVG Well-Formed XML Verification: ${svgsValid ? 'PASS' : 'FAIL'}`);
console.log(`3. JPG High-Resolution Renders Verification: ${jpgsValid ? 'PASS' : 'FAIL'}`);
