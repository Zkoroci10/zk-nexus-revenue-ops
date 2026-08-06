const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Dell\\.gemini\\antigravity\\brain';

function getAllFiles(dir) {
    let results = [];
    try {
        const list = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of list) {
            const fullPath = path.join(dir, item.name);
            if (item.isDirectory()) {
                results = results.concat(getAllFiles(fullPath));
            } else {
                results.push(fullPath);
            }
        }
    } catch(e) {}
    return results;
}

console.log('Scanning brain directory...');
const allFiles = getAllFiles(brainDir);

// 1. Find all markdown files (excluding .system_generated except key artifacts)
const mdFiles = allFiles.filter(f => f.endsWith('.md') && !f.includes('.system_generated'));
console.log(`Found ${mdFiles.length} markdown files in brain:`);
mdFiles.forEach(f => console.log('  -', f));

// 2. Find all transcript.jsonl files
const transcriptFiles = allFiles.filter(f => f.endsWith('transcript.jsonl'));
console.log(`Found ${transcriptFiles.length} transcript.jsonl files.`);

// Analyze transcript files for user messages or key keywords
const keywords = [
    'idea', 'framework', 'decision', 'architecture', 'ren', 'whatsapp',
    'pricing', 'revops', 'sdr', 'gemini spark', 'business', 'model',
    'strategy', 'blueprint', 'pilot', 'bot', 'real estate', 'agent'
];

const foundInsights = [];

transcriptFiles.forEach(tFile => {
    try {
        const stats = fs.statSync(tFile);
        if (stats.size === 0) return;

        const content = fs.readFileSync(tFile, 'utf8');
        const lines = content.split('\n');

        lines.forEach((line, idx) => {
            if (!line.trim()) return;
            try {
                const entry = JSON.parse(line);
                // check entry role / content
                let text = '';
                if (typeof entry === 'string') text = entry;
                else if (entry.message) text = JSON.stringify(entry.message);
                else if (entry.content) text = typeof entry.content === 'string' ? entry.content : JSON.stringify(entry.content);
                else text = JSON.stringify(entry);

                const lower = text.toLowerCase();
                const matchedKw = keywords.filter(kw => lower.includes(kw));

                // If user text or significant message
                if (matchedKw.length >= 2 && text.length > 50) {
                    const convId = path.basename(path.dirname(path.dirname(tFile)));
                    foundInsights.push({
                        convId,
                        file: tFile,
                        lineNum: idx + 1,
                        keywords: matchedKw,
                        snippet: text.substring(0, 300)
                    });
                }
            } catch(e) {}
        });
    } catch(e) {}
});

console.log(`\nFound ${foundInsights.length} candidate insight entries in transcripts.`);

// Write candidate summary to file for inspection
const outputPath = 'c:\\Users\\Dell\\Documents\\Projects ZK Nexus\\.agents\\explorer_m4\\extracted_candidates.json';
fs.writeFileSync(outputPath, JSON.stringify({ mdFiles, foundInsightsCount: foundInsights.length, candidates: foundInsights.slice(0, 100) }, null, 2));
console.log(`Saved candidates to ${outputPath}`);
