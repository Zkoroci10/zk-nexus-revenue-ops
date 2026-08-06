/**
 * ---
 * Title: Empire References Search Tool
 * ID: SYS-014
 * Type: Script (Node.js)
 * Module: 05_Systems
 * BU: ZK Revenue Ops
 * Status: Active
 * Version: 1.0
 * Created: 2026-08-05
 * Updated: 2026-08-05
 * Owner: Zubair (zubairisa10@gmail.com)
 * Related: PRJ-009
 * ---
 */

const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\Dell\\Documents\\Projects ZK Nexus';
const results = [];

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === '.git' || file === 'node_modules' || file === '.snapshots') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      if (['.md', '.txt', '.json', '.js', '.html', '.css', '.gs'].includes(ext)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (/empire/i.test(content)) {
            const matches = content.split('\n').filter(line => /empire/i.test(line));
            results.push({
              file: fullPath.replace(rootDir, ''),
              matches: matches.slice(0, 5)
            });
          }
        } catch (e) {}
      }
    }
  }
}

scanDir(rootDir);
console.log(`Found ${results.length} files referencing 'Empire':\n`);
console.log(JSON.stringify(results, null, 2));
