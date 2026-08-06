<#
---
Title: ZNS Validator Python Lite
ID: SYS-029
Type: Script (Python)
Module: 05_Systems
BU: ZK Revenue Ops
Status: Active
Version: 1.0
Created: 2026-08-05
Updated: 2026-08-05
Owner: Zubair (zubairisa10@gmail.com)
Related: PRJ-009
---
#>

#!/usr/bin/env python3
"""
ZNS Metadata & Naming Convention Validation Script (validate-zns.py)
Validates ZK Nexus files against ZNS Standard v1.0 (RUL-001)
"""

import os
import re
import sys

REQUIRED_METADATA_KEYS = ["Title:", "ID:", "Type:", "Module:", "Status:", "Version:"]
EXCLUDED_DIRS = [".git", ".snapshots", ".agents", "99_Archive"]

def validate_zns_header(file_path):
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # Check for frontmatter header starting with ---
    if not content.startswith("---"):
        return False, "Missing ZNS frontmatter header ('---' at top)"

    header_end = content.find("---", 3)
    if header_end == -1:
        return False, "Unclosed ZNS frontmatter header"

    header_text = content[3:header_end]
    missing_keys = [key for key in REQUIRED_METADATA_KEYS if key not in header_text]

    if missing_keys:
        return False, f"Missing required metadata keys: {', '.join(missing_keys)}"

    return True, "ZNS Header OK"

def scan_workspace(workspace_dir):
    print(f"🔍 Starting ZNS Validation Scan in: {workspace_dir}\n")
    valid_count = 0
    invalid_count = 0
    issues = []

    for root, dirs, files in os.walk(workspace_dir):
        # Skip excluded directories
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]

        for file in files:
            if not file.endswith(".md") or file in ["README.md", "AI-START-HERE.md"]:
                continue

            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, workspace_dir)

            is_valid, msg = validate_zns_header(file_path)
            if is_valid:
                valid_count += 1
            else:
                invalid_count += 1
                issues.append((rel_path, msg))

    print("================ ZNS VALIDATION REPORT ================")
    print(f"✅ Valid ZNS Files: {valid_count}")
    print(f"⚠️ Non-compliant Files: {invalid_count}\n")

    if issues:
        print("Issues Found:")
        for rel_path, msg in issues:
            print(f" - [{rel_path}]: {msg}")
    else:
        print("🎉 All workspace files pass ZNS validation standards!")

if __name__ == "__main__":
    target_dir = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    scan_workspace(target_dir)
