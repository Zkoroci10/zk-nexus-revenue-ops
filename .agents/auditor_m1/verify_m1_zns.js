const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\Dell\\Documents\\Projects ZK Nexus';
const excludeDirs = ['.git', '.snapshots', '.agents'];
const requiredKeys = ['Title:', 'ID:', 'Type:', 'Module:', 'Status:', 'Version:'];

function getAllMdFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        results = results.concat(getAllMdFiles(fullPath));
      }
    } else {
      if (file.endsWith('.md')) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const mdFiles = getAllMdFiles(rootDir);
console.log(`Found ${mdFiles.length} markdown files to validate.`);

let validCount = 0;
let invalidCount = 0;
const issues = [];
const versionCounts = {};

mdFiles.forEach(filePath => {
  const relPath = path.relative(rootDir, filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  if (!content || content.trim().length === 0) {
    invalidCount++;
    issues.push({ file: relPath, issue: 'File is empty' });
    return;
  }

  const trimmed = content.trimStart();
  if (!trimmed.startsWith('---')) {
    invalidCount++;
    issues.push({ file: relPath, issue: 'Missing opening frontmatter delimiter (---)' });
    return;
  }

  const secondDash = trimmed.indexOf('---', 3);
  if (secondDash < 0) {
    invalidCount++;
    issues.push({ file: relPath, issue: 'Unclosed frontmatter block (missing second ---)' });
    return;
  }

  const headerText = trimmed.substring(0, secondDash + 3);
  const missing = [];

  requiredKeys.forEach(key => {
    if (!headerText.includes(key)) {
      missing.push(key);
    }
  });

  // Check version value
  const versionMatch = headerText.match(/Version:\s*(.+)/i);
  if (versionMatch) {
    const ver = versionMatch[1].trim();
    versionCounts[ver] = (versionCounts[ver] || 0) + 1;
  }

  if (missing.length > 0) {
    invalidCount++;
    issues.push({ file: relPath, issue: `Missing required keys: ${missing.join(', ')}` });
  } else {
    validCount++;
  }
});

console.log('\n================ INDEPENDENT AUDIT SUMMARY ================');
console.log(`Total MD Files Scanned: ${mdFiles.length}`);
console.log(`Valid ZNS Compliant:    ${validCount}`);
console.log(`Non-Compliant Files:    ${invalidCount}`);

console.log('\n--- Version Distribution ---');
console.log(JSON.stringify(versionCounts, null, 2));

if (issues.length > 0) {
  console.log('\n--- Issues List ---');
  issues.forEach(i => console.log(`[${i.file}]: ${i.issue}`));
  process.exit(1);
} else {
  console.log('\n100% ZNS Frontmatter Validation PASSED.');
  process.exit(0);
}
