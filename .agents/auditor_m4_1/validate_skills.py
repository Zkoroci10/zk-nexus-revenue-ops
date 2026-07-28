import os
import json
import re
import sys

skills_dir = r"C:\Users\Dell\Documents\Projects ZK Nexus\.agents\skills"
audit_results = []

def log_result(check_name, status, details):
    audit_results.append({
        "check": check_name,
        "status": status,
        "details": details
    })
    print(f"[{status}] {check_name}: {details}")

print("=== Starting Skill Package Integrity Verification ===")

# Discover skills
skills = [d for d in os.listdir(skills_dir) if os.path.isdir(os.path.join(skills_dir, d))]
print(f"Found {len(skills)} skill packages: {skills}")

if len(skills) != 5:
    log_result("Skill Package Count Check", "FAIL", f"Expected 5 skill packages, found {len(skills)}")
else:
    log_result("Skill Package Count Check", "PASS", f"Found exactly 5 skill packages: {skills}")

expected_skills = ["antigravity-agent-manager", "apify-lead-generation", "brain-to-docs", "cold-email", "ui-ux-pro-max-skill"]
missing_skills = [s for s in expected_skills if s not in skills]
if missing_skills:
    log_result("Required Skills Check", "FAIL", f"Missing expected skills: {missing_skills}")
else:
    log_result("Required Skills Check", "PASS", "All required skill packages exist.")

# Audit each skill package
for skill in skills:
    skill_path = os.path.join(skills_dir, skill)
    skill_md = os.path.join(skill_path, "SKILL.md")
    
    # Check SKILL.md existence
    if not os.path.exists(skill_md):
        log_result(f"{skill} SKILL.md Existence", "FAIL", "SKILL.md missing")
        continue
    
    with open(skill_md, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Frontmatter check
    if not content.startswith("---"):
        log_result(f"{skill} YAML Frontmatter Header", "FAIL", "SKILL.md does not start with ---")
    else:
        parts = content.split("---", 2)
        if len(parts) < 3:
            log_result(f"{skill} YAML Frontmatter Structure", "FAIL", "SKILL.md frontmatter closing --- not found")
        else:
            frontmatter_text = parts[1].strip()
            # Simple YAML parsing check
            name_match = re.search(r"^name:\s*(.+)$", frontmatter_text, re.MULTILINE)
            desc_match = re.search(r"^description:\s*(.+)$", frontmatter_text, re.MULTILINE)
            
            if not name_match:
                log_result(f"{skill} Frontmatter 'name'", "FAIL", "Missing 'name' field in frontmatter")
            elif name_match.group(1).strip() != skill:
                log_result(f"{skill} Frontmatter 'name'", "FAIL", f"Name mismatch: expected '{skill}', got '{name_match.group(1).strip()}'")
            else:
                log_result(f"{skill} Frontmatter 'name'", "PASS", f"Name correctly matches '{skill}'")
                
            if not desc_match:
                log_result(f"{skill} Frontmatter 'description'", "FAIL", "Missing 'description' field in frontmatter")
            elif len(desc_match.group(1).strip()) < 20:
                log_result(f"{skill} Frontmatter 'description'", "FAIL", "Description is too short (< 20 chars)")
            else:
                log_result(f"{skill} Frontmatter 'description'", "PASS", f"Description valid ({len(desc_match.group(1).strip())} chars)")

    # 2. Instruction depth & quality check
    lines = content.splitlines()
    words = content.split()
    if len(words) < 200:
        log_result(f"{skill} Content Depth", "FAIL", f"Content depth insufficient ({len(words)} words)")
    else:
        log_result(f"{skill} Content Depth", "PASS", f"Sufficient content depth ({len(words)} words, {len(lines)} lines)")

    # 3. Dummy / Stub / Fake text check
    suspicious_patterns = [r"\bTODO\b", r"\bFIXME\b", r"Lorem ipsum", r"placeholder", r"dummy", r"stub", r"fake"]
    found_suspicious = []
    for pattern in suspicious_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            found_suspicious.append(f"{pattern} ({len(matches)} matches)")
            
    if found_suspicious:
        log_result(f"{skill} Authenticity Check", "FAIL", f"Found prohibited/suspicious patterns: {', '.join(found_suspicious)}")
    else:
        log_result(f"{skill} Authenticity Check", "PASS", "No dummy/stub/placeholder patterns found in SKILL.md.")

    # 4. JSON Config / Template Files Validation
    json_files = []
    for root, _, files in os.walk(skill_path):
        for file in files:
            if file.endswith(".json"):
                json_files.append(os.path.join(root, file))
                
    if not json_files:
        log_result(f"{skill} Config/Template Files", "WARN", "No JSON config or template files found.")
    else:
        for jf in json_files:
            rel_j_path = os.path.relpath(jf, skill_path)
            try:
                with open(jf, "r", encoding="utf-8") as jf_in:
                    j_data = json.load(jf_in)
                
                # Check for suspicious text in json
                j_str = json.dumps(j_data)
                found_j_suspicious = []
                for pattern in suspicious_patterns:
                    matches = re.findall(pattern, j_str, re.IGNORECASE)
                    if matches:
                        found_j_suspicious.append(f"{pattern} ({len(matches)} matches)")
                
                if found_j_suspicious:
                    log_result(f"{skill} Config {rel_j_path} Authenticity", "FAIL", f"Prohibited text in JSON: {', '.join(found_j_suspicious)}")
                else:
                    log_result(f"{skill} Config {rel_j_path} Syntax & Authenticity", "PASS", f"Valid JSON syntax and authentic content in {rel_j_path}")
            except Exception as e:
                log_result(f"{skill} Config {rel_j_path} JSON Syntax", "FAIL", f"Invalid JSON syntax: {e}")

# Summary report
print("\n=== VERDICT SUMMARY ===")
fails = [r for r in audit_results if r["status"] == "FAIL"]
if fails:
    print(f"VERDICT: INTEGRITY VIOLATION ({len(fails)} failures)")
else:
    print("VERDICT: CLEAN (All integrity and syntax checks passed)")
