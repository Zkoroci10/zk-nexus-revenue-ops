const fs = require('fs');
const path = require('path');

const skillsDir = 'C:\\Users\\Dell\\Documents\\Projects ZK Nexus\\.agents\\skills';
const expectedSkills = [
    'ui-ux-pro-max-skill',
    'cold-email',
    'apify-lead-generation',
    'brain-to-docs',
    'antigravity-agent-manager'
];

console.log('=== SKILL VERIFICATION NODE SCRIPT ===');
let allPassed = true;

for (const skill of expectedSkills) {
    const sdir = path.join(skillsDir, skill);
    console.log('\nChecking skill: ' + skill);
    if (!fs.existsSync(sdir) || !fs.statSync(sdir).isDirectory()) {
        console.log('  [FAIL] Directory missing: ' + sdir);
        allPassed = false;
        continue;
    }

    const skillMd = path.join(sdir, 'SKILL.md');
    if (!fs.existsSync(skillMd)) {
        console.log('  [FAIL] SKILL.md missing in ' + sdir);
        allPassed = false;
        continue;
    }

    const content = fs.readFileSync(skillMd, 'utf8');
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    if (!fmMatch) {
        console.log('  [FAIL] YAML frontmatter missing or malformed in ' + skill);
        allPassed = false;
    } else {
        const fmText = fmMatch[1];
        const nameMatch = fmText.match(/name:\s*(.+)/);
        const descMatch = fmText.match(/description:\s*(.+)/);
        const name = nameMatch ? nameMatch[1].trim() : null;
        const desc = descMatch ? descMatch[1].trim() : null;

        if (!name) {
            console.log('  [FAIL] Frontmatter missing name');
            allPassed = false;
        } else if (name !== skill) {
            console.log('  [FAIL] Frontmatter name ' + name + ' != folder name ' + skill);
            allPassed = false;
        }

        if (!desc || desc.length < 20) {
            console.log('  [FAIL] Frontmatter missing or short description');
            allPassed = false;
        } else {
            console.log('  [PASS] Frontmatter valid (name: ' + name + ')');
        }
    }

    // Check sections
    const hasInstructions = content.length > 500;
    const hasExamples = content.includes('Invocation') || content.includes('Usage') || content.includes('Blueprint');
    console.log('  [INFO] Length: ' + content.length + ' chars. Instructions ok: ' + hasInstructions + ', Examples ok: ' + hasExamples);

    // Find all JSON files in sdir
    function getJsonFiles(dir) {
        let results = [];
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                results = results.concat(getJsonFiles(filePath));
            } else if (file.endsWith('.json')) {
                results.push(filePath);
            }
        });
        return results;
    }

    const jsonFiles = getJsonFiles(sdir);
    if (jsonFiles.length === 0) {
        console.log('  [FAIL] No JSON files found in ' + skill);
        allPassed = false;
    } else {
        for (const jf of jsonFiles) {
            const relPath = path.relative(sdir, jf);
            try {
                const jContent = fs.readFileSync(jf, 'utf8');
                JSON.parse(jContent);
                console.log('  [PASS] JSON syntax valid: ' + relPath);
            } catch (err) {
                console.log('  [FAIL] JSON syntax invalid in ' + relPath + ': ' + err.message);
                allPassed = false;
            }
        }
    }
}

console.log('\nOVERALL VERIFICATION RESULT: ' + (allPassed ? 'PASS' : 'FAIL'));
