const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Dell\\.gemini\\antigravity\\brain';

function scan(dir) {
    let files = [];
    try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            if (item.isDirectory()) {
                files = files.concat(scan(fullPath));
            } else {
                files.push({
                    path: fullPath,
                    size: fs.statSync(fullPath).size,
                    ext: path.extname(item.name).toLowerCase(),
                    name: item.name,
                    mtime: fs.statSync(fullPath).mtimeMs
                });
            }
        }
    } catch (e) {}
    return files;
}

const allFiles = scan(brainDir);
console.log('Total brain files found:', allFiles.length);

// Group by extension
const byExt = {};
allFiles.forEach(f => {
    byExt[f.ext] = (byExt[f.ext] || 0) + 1;
});
console.log('Files by extension:', JSON.stringify(byExt, null, 2));

// Filter interesting files (.md, .json, .txt, or without extension) excluding .system_generated
const nonSys = allFiles.filter(f => !f.path.includes('.system_generated'));
console.log('Non-system files count:', nonSys.length);

// Sort by mtime descending
nonSys.sort((a, b) => b.mtime - a.mtime);

console.log('\n--- Top 60 Most Recent Non-System Brain Files ---');
nonSys.slice(0, 60).forEach(f => {
    const rel = f.path.replace(brainDir, '');
    console.log(`${new Date(f.mtime).toISOString()} | ${f.size.toString().padStart(8)} bytes | ${rel}`);
});
