const fs = require('fs');
const path = require('path');

const skillsDir = 'C:\\Users\\Dell\\Documents\\Projects ZK Nexus\\.agents\\skills';
const results = [];

function log(check, status, details) {
  results.push({ check, status, details });
  console.log(`[${status}] ${check}: ${details}`);
}

console.log('=== SKILL PACKAGE FORENSIC INTEGRITY AUDIT ===');

const skills = fs.readdirSync(skillsDir).filter(f => fs.statSync(path.join(skillsDir, f)).isDirectory());
console.log(`Found ${skills.length} skill package folders: ${skills.join(', ')}`);

if (skills.length !== 5) {
  log('Skill Package Count', 'FAIL', `Expected 5 skills, found ${skills.length}`);
} else {
  log('Skill Package Count', 'PASS', 'Found exactly 5 skill packages');
}

const expectedSkills = ['antigravity-agent-manager', 'apify-lead-generation', 'brain-to-docs', 'cold-email', 'ui-ux-pro-max-skill'];
const missing = expectedSkills.filter(s => !skills.includes(s));
if (missing.length > 0) {
  log('Required Skills Presence', 'FAIL', `Missing skills: ${missing.join(', ')}`);
} else {
  log('Required Skills Presence', 'PASS', 'All 5 expected skill packages are present');
}

const prohibitedPatterns = [
  /\bTODO\b/i,
  /\bFIXME\b/i,
  /Lorem ipsum/i,
  /\bplaceholder\b/i,
  /\bdummy\b/i,
  /\bstub\b/i,
  /\bfake\b/i
];

for (const skill of skills) {
  const skillPath = path.join(skillsDir, skill);
  const skillMdPath = path.join(skillPath, 'SKILL.md');

  if (!fs.existsSync(skillMdPath)) {
    log(`${skill} - SKILL.md Existence`, 'FAIL', 'SKILL.md missing');
    continue;
  }

  const content = fs.readFileSync(skillMdPath, 'utf8');

  // 1. YAML Frontmatter Check
  if (!content.startsWith('---')) {
    log(`${skill} - YAML Frontmatter Start`, 'FAIL', 'SKILL.md does not start with ---');
  } else {
    const parts = content.split('---');
    if (parts.length < 3) {
      log(`${skill} - YAML Frontmatter Closure`, 'FAIL', 'Frontmatter closing --- not found');
    } else {
      const frontmatter = parts[1].trim();
      const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
      const descMatch = frontmatter.match(/^description:\s*(.+)$/m);

      if (!nameMatch) {
        log(`${skill} - Frontmatter Name Field`, 'FAIL', 'name field missing in frontmatter');
      } else if (nameMatch[1].trim() !== skill) {
        log(`${skill} - Frontmatter Name Field`, 'FAIL', `Name mismatch: expected '${skill}', found '${nameMatch[1].trim()}'`);
      } else {
        log(`${skill} - Frontmatter Name Field`, 'PASS', `Name matches '${skill}'`);
      }

      if (!descMatch) {
        log(`${skill} - Frontmatter Description Field`, 'FAIL', 'description field missing');
      } else if (descMatch[1].trim().length < 20) {
        log(`${skill} - Frontmatter Description Field`, 'FAIL', `Description too short (${descMatch[1].trim().length} chars)`);
      } else {
        log(`${skill} - Frontmatter Description Field`, 'PASS', `Description valid (${descMatch[1].trim().length} chars)`);
      }
    }
  }

  // 2. Instruction Depth Check
  const words = content.split(/\s+/).filter(Boolean);
  const lines = content.split(/\r?\n/);
  if (words.length < 200) {
    log(`${skill} - Instruction Depth`, 'FAIL', `Word count too low (${words.length} words)`);
  } else {
    log(`${skill} - Instruction Depth`, 'PASS', `Substantial depth (${words.length} words, ${lines.length} lines)`);
  }

  // 3. Prohibited / Dummy / Stub Pattern Check
  const foundProhibited = [];
  for (const pat of prohibitedPatterns) {
    const match = content.match(pat);
    if (match) {
      foundProhibited.push(match[0]);
    }
  }
  if (foundProhibited.length > 0) {
    log(`${skill} - Authenticity Check`, 'FAIL', `Prohibited terms found: ${foundProhibited.join(', ')}`);
  } else {
    log(`${skill} - Authenticity Check`, 'PASS', 'No dummy, stub, or placeholder terms found');
  }

  // 4. JSON Config / Template Validation
  function scanDir(dir) {
    let jsonFiles = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        jsonFiles = jsonFiles.concat(scanDir(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        jsonFiles.push(fullPath);
      }
    }
    return jsonFiles;
  }

  const jsonFiles = scanDir(skillPath);
  if (jsonFiles.length === 0) {
    log(`${skill} - Config Files`, 'WARN', 'No JSON config files found');
  } else {
    for (const jFile of jsonFiles) {
      const relPath = path.relative(skillPath, jFile);
      try {
        const jRaw = fs.readFileSync(jFile, 'utf8');
        const jParsed = JSON.parse(jRaw);
        
        // Authenticity check on JSON
        const jProhibited = [];
        for (const pat of prohibitedPatterns) {
          const match = jRaw.match(pat);
          if (match) jProhibited.push(match[0]);
        }

        if (jProhibited.length > 0) {
          log(`${skill} - ${relPath} Authenticity`, 'FAIL', `Prohibited terms in JSON: ${jProhibited.join(', ')}`);
        } else {
          log(`${skill} - ${relPath} JSON Validity & Authenticity`, 'PASS', `Valid JSON syntax and authentic content`);
        }
      } catch (err) {
        log(`${skill} - ${relPath} JSON Syntax`, 'FAIL', `JSON parse error: ${err.message}`);
      }
    }
  }
}

console.log('\n=======================================');
const failures = results.filter(r => r.status === 'FAIL');
if (failures.length > 0) {
  console.log(`FINAL AUDIT VERDICT: INTEGRITY VIOLATION (${failures.length} check failures)`);
  process.exit(1);
} else {
  console.log('FINAL AUDIT VERDICT: CLEAN (All integrity, syntax, and depth checks passed)');
  process.exit(0);
}
