#!/usr/bin/env python3
"""
---
Title: ZNS Workspace Metadata & Rule Validator
ID: SYS-002
Type: Script (Python)
Module: 05_Systems
BU: All
Status: Active
Version: 1.0
Created: 2026-07-28
Updated: 2026-07-28
Owner: AI Worker (worker_m2_1)
Related: RUL-001, RUL-002, RUL-003, RUL-004, SYS-001
---

ZNS Workspace Metadata & Rule Validator (validate_zns.py)
Automated validation of:
1. ZNS File Naming Convention (ZNS-NC)
2. Object ID Registry (ZNS-OID)
3. Metadata Header Rules (ZNS-MD)
4. Folder Depth & Module Structure (ZNS-STRUCT)
5. Markdown Links & Legacy Path Integrity
"""

import os
import sys
import re
import json
import argparse
import urllib.parse
from pathlib import Path
from typing import List, Dict, Set, Tuple, Optional

# Force UTF-8 encoding for stdout/stderr to prevent Windows cp1252 character map errors
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# --- ANSI Color Codes for Diagnostic Output ---
COLOR_RESET = "\033[0m"
COLOR_RED = "\033[91m"
COLOR_GREEN = "\033[92m"
COLOR_YELLOW = "\033[93m"
COLOR_CYAN = "\033[96m"
COLOR_BOLD = "\033[1m"

# Safe status symbols (ASCII friendly for Windows console)
SYM_FAIL = "[FAIL]"
SYM_PASS = "[PASS]"
SYM_WARN = "[WARN]"

# --- ZNS Standard Constants ---
ROOT_MODULES = [
    "00_Command Center",
    "01_Business",
    "02_Projects",
    "03_Knowledge",
    "04_Workforce",
    "05_Systems",
    "06_Resources",
    "07_Templates",
    "08_Logs",
    "99_Archive",
]

ACTIVE_MODULES = [
    "00_Command Center",
    "01_Business",
    "02_Projects",
    "03_Knowledge",
    "04_Workforce",
    "05_Systems",
    "06_Resources",
    "07_Templates",
    "08_Logs",
]

MANDATORY_METADATA_KEYS = [
    "Title",
    "ID",
    "Type",
    "Module",
    "BU",
    "Status",
    "Version",
    "Created",
    "Updated",
    "Owner",
]

PROHIBITED_FILENAME_TERMS = [
    "final",
    "updated",
    "latest",
    "v2",
    "v3",
    "new",
    "old",
    "draft",
]

VALID_STATUSES = [
    "Draft",
    "Review",
    "Active",
    "Archived",
    "Completed",
    "In Development",
    "Active Blueprint",
]

VALID_PREFIXES = [
    "RUL", "IDX", "AI", "BUS", "TMP", "PRJ", "KNB", "SOP", "SYS",
    "WFR", "RES", "LOG", "SEAT", "LEAD", "ZK-FND", "ZK-GOV", "ZK-STR",
    "ZK-PS", "ZK-SEAT", "DSR", "CAT"
]

MAX_FOLDER_DEPTH = 3  # Max 3 subfolder levels below any module root


class ValidationIssue:
    def __init__(self, file_path: str, category: str, rule_id: str, severity: str, message: str, line_no: Optional[int] = None):
        self.file_path = file_path
        self.category = category  # ZNS-NC, ZNS-OID, ZNS-MD, ZNS-STRUCT
        self.rule_id = rule_id
        self.severity = severity  # ERROR, WARNING
        self.message = message
        self.line_no = line_no

    def to_dict(self) -> Dict:
        return {
            "file_path": self.file_path,
            "category": self.category,
            "rule_id": self.rule_id,
            "severity": self.severity,
            "message": self.message,
            "line_no": self.line_no,
        }


class ZNSValidator:
    def __init__(self, workspace_root: str, strict: bool = False, verbose: bool = True):
        self.workspace_root = os.path.abspath(workspace_root)
        self.strict = strict
        self.verbose = verbose
        self.issues: List[ValidationIssue] = []
        self.registered_ids: Set[str] = set()
        self.found_doc_ids: Dict[str, List[str]] = {}
        self.scanned_files_count = 0
        self.scanned_md_count = 0
        self.checked_links_count = 0

    def add_issue(self, file_path: str, category: str, rule_id: str, severity: str, message: str, line_no: Optional[int] = None):
        rel_path = os.path.relpath(file_path, self.workspace_root) if os.path.isabs(file_path) else file_path
        issue = ValidationIssue(rel_path, category, rule_id, severity, message, line_no)
        self.issues.append(issue)
        if self.verbose:
            sev_color = COLOR_RED if severity == "ERROR" else COLOR_YELLOW
            line_str = f":{line_no}" if line_no else ""
            print(f"  {sev_color}[{severity}] {category} ({rule_id}){COLOR_RESET} {rel_path}{line_str} -> {message}")

    def load_id_registry(self):
        """Loads and parses 00_Command Center/ID-Registry.md for registered Object IDs."""
        registry_path = os.path.join(self.workspace_root, "00_Command Center", "ID-Registry.md")
        if not os.path.exists(registry_path):
            self.add_issue("00_Command Center/ID-Registry.md", "ZNS-OID", "OID-001", "ERROR", "Master ID Registry missing!")
            return

        try:
            with open(registry_path, "r", encoding="utf-8-sig", errors="ignore") as f:
                content = f.read()

            # Extract IDs like RUL-001, SOP-003, ZK-FND-001, LOG-2025-07-16-001, etc.
            id_matches = re.findall(r"\b([A-Z0-9]+(?:-[A-Z0-9]+)*-\d{3,})\b", content)
            for m in id_matches:
                self.registered_ids.add(m)

            if self.verbose:
                print(f"{COLOR_CYAN}[ZNS-OID] Loaded {len(self.registered_ids)} registered IDs from ID-Registry.md{COLOR_RESET}")
        except Exception as e:
            self.add_issue(registry_path, "ZNS-OID", "OID-001", "ERROR", f"Failed to parse ID Registry: {str(e)}")

    def validate_file_naming(self, file_path: str):
        """Validates ZNS-NC File Naming Rules."""
        filename = os.path.basename(file_path)
        name_no_ext, ext = os.path.splitext(filename)

        # 1. Prohibited words check
        for term in PROHIBITED_FILENAME_TERMS:
            pattern = r"(^|[-_.\s])" + re.escape(term) + r"($|[-_.\s])"
            if re.search(pattern, name_no_ext, re.IGNORECASE):
                # Allow 'drafts' directory or draft in status, but filename prohibited word is violation
                if not ("drafts" in file_path.lower() and term == "draft"):
                    self.add_issue(
                        file_path,
                        "ZNS-NC",
                        "NC-001",
                        "ERROR",
                        f"Filename contains prohibited term '{term}'. Use metadata/versioning instead of filename tags.",
                    )

        # 2. File Naming Pattern Check for Markdown files
        if ext.lower() == ".md":
            valid_kebab = re.match(r"^[a-z0-9]+(-[a-z0-9]+)*\.md$", filename)
            valid_upper = re.match(r"^[A-Z0-9_-]+\.md$", filename)
            valid_numbered = re.match(r"^\d{3}_[A-Za-z0-9_-]+\.md$", filename)
            valid_oid = re.match(r"^[A-Z0-9]+(-[A-Z0-9]+)*(_[A-Za-z0-9_-]+|\.md)$", filename)
            valid_date = re.match(r"^\d{4}-\d{2}-\d{2}(_[A-Za-z0-9_-]+|\.md)$", filename)

            if not (valid_kebab or valid_upper or valid_numbered or valid_oid or valid_date):
                if " " in filename:
                    self.add_issue(file_path, "ZNS-NC", "NC-002", "ERROR", f"Filename contains spaces: '{filename}'. Use kebab-case with hyphens.")
                elif re.search(r"[A-Z]", name_no_ext) and not (valid_upper or valid_numbered or valid_oid):
                    self.add_issue(
                        file_path,
                        "ZNS-NC",
                        "NC-002",
                        "WARNING",
                        f"Filename '{filename}' uses mixed case without matching standard ID or numbered prefix pattern.",
                    )

    def validate_folder_structure(self, dir_path: str):
        """Validates ZNS-NC Folder Naming and Max Depth Constraints."""
        rel_path = os.path.relpath(dir_path, self.workspace_root)
        if rel_path == ".":
            return

        parts = Path(rel_path).parts
        root_module = parts[0]

        # Ensure top-level root module is recognized
        if root_module not in ROOT_MODULES:
            if not root_module.startswith("."):
                self.add_issue(dir_path, "ZNS-STRUCT", "STR-001", "WARNING", f"Unrecognized root directory '{root_module}'.")
            return

        # Check Folder Depth Constraint: Max 2 subfolder levels below module root
        subfolder_depth = len(parts) - 1
        if subfolder_depth > MAX_FOLDER_DEPTH:
            # Check if inside archive or drafts folder
            if not ("99_Archive" in parts or "drafts" in parts or "sandbox" in parts or ".agents" in parts):
                self.add_issue(
                    dir_path,
                    "ZNS-STRUCT",
                    "STR-002",
                    "ERROR",
                    f"Folder depth ({subfolder_depth} levels below '{root_module}') exceeds max allowed depth of {MAX_FOLDER_DEPTH} levels.",
                )

        # Check Directory Naming (No special characters)
        folder_name = os.path.basename(dir_path)
        if re.search(r"[&@$%#]", folder_name):
            self.add_issue(dir_path, "ZNS-NC", "NC-003", "ERROR", f"Directory name '{folder_name}' contains illegal special characters.")

    def parse_metadata_header(self, content: str) -> Tuple[Optional[Dict[str, str]], List[str]]:
        """Parses YAML frontmatter from Markdown content."""
        errors = []
        content = content.lstrip("\ufeff")
        if not content.startswith("---"):
            return None, ["Missing frontmatter starting delimiter '---' at line 1."]

        parts = content.split("---", 2)
        if len(parts) < 3:
            return None, ["Unclosed frontmatter header. Expected matching '---' delimiter."]

        fm_raw = parts[1].strip()
        metadata = {}
        for line in fm_raw.splitlines():
            line_str = line.strip()
            if not line_str or line_str.startswith("#"):
                continue
            if ":" in line_str:
                k, v = line_str.split(":", 1)
                metadata[k.strip()] = v.strip()

        return metadata, errors

    def validate_metadata_header(self, file_path: str, content: str):
        """Validates ZNS-MD Metadata Header Rules."""
        metadata, fm_errors = self.parse_metadata_header(content)

        if not metadata:
            self.add_issue(file_path, "ZNS-MD", "MD-001", "ERROR", f"Header block error: {', '.join(fm_errors)}", line_no=1)
            return

        # 1. Check Mandatory Fields
        missing_fields = [key for key in MANDATORY_METADATA_KEYS if key not in metadata or not metadata[key]]
        if missing_fields:
            self.add_issue(
                file_path,
                "ZNS-MD",
                "MD-002",
                "ERROR",
                f"Missing mandatory frontmatter metadata fields: {', '.join(missing_fields)}",
                line_no=1,
            )

        # 2. Field Specific Validations
        doc_id = metadata.get("ID", "")
        if doc_id:
            # Record document ID for ZNS-OID checks
            if doc_id not in self.found_doc_ids:
                self.found_doc_ids[doc_id] = []
            self.found_doc_ids[doc_id].append(file_path)

            # Validate ID format syntax
            if not (re.match(r"^[A-Z0-9]+(-[A-Z0-9]+)*-\d{3,}$", doc_id) or doc_id.startswith("LOG-")):
                if doc_id not in ["N/A", "TBD"] and not doc_id.startswith("("):
                    self.add_issue(
                        file_path,
                        "ZNS-OID",
                        "OID-002",
                        "WARNING",
                        f"Document ID '{doc_id}' does not follow standard {{PREFIX}}-{{NNN}} pattern.",
                    )

        # Status validation
        status = metadata.get("Status", "")
        if status and status not in VALID_STATUSES:
            self.add_issue(
                file_path,
                "ZNS-MD",
                "MD-003",
                "WARNING",
                f"Non-standard Status '{status}'. Expected one of: {', '.join(VALID_STATUSES)}",
            )

        # Date validations (Created, Updated)
        for date_field in ["Created", "Updated"]:
            d_val = metadata.get(date_field, "")
            if d_val and not re.match(r"^\d{4}-\d{2}-\d{2}$", d_val):
                self.add_issue(
                    file_path,
                    "ZNS-MD",
                    "MD-004",
                    "ERROR",
                    f"Invalid {date_field} date format '{d_val}'. Must be YYYY-MM-DD.",
                )

        # Version validation
        ver = metadata.get("Version", "")
        if ver and not (re.match(r"^\d+(\.\d+)?$", ver) or re.match(r"^v\d+(\.\d+)?$", ver, re.IGNORECASE)):
            self.add_issue(file_path, "ZNS-MD", "MD-005", "WARNING", f"Non-standard Version format '{ver}'. Use '1.0' or 'v1.0'.")

    def validate_markdown_links(self, file_path: str, content: str):
        """Scans for broken Markdown links and legacy path references."""
        # Check for legacy path references ("ZK Nexus/") in content
        if "ZK Nexus/" in content:
            self.add_issue(file_path, "ZNS-STRUCT", "STR-003", "WARNING", "Legacy path reference 'ZK Nexus/' found in file content.")

        # Extract links [text](target)
        links = re.findall(r"\[([^\]]+)\]\(([^)]+)\)", content)
        for text, target in links:
            target_clean = target.strip()
            if target_clean.startswith(("http://", "https://", "#", "mailto:")):
                continue

            self.checked_links_count += 1
            target_file = target_clean.split("#")[0]
            if not target_file:
                continue

            # Unquote URI encoding (e.g. %20 -> space)
            target_file_unquoted = urllib.parse.unquote(target_file)

            # Resolve link path relative to file
            if target_file_unquoted.startswith("file:///"):
                raw_path = target_file_unquoted.replace("file:///", "").replace("/", "\\")
                if re.match(r"^[a-zA-Z]:", raw_path):
                    resolved_path = raw_path
                else:
                    resolved_path = os.path.join(self.workspace_root, raw_path)
            else:
                current_dir = os.path.dirname(file_path)
                resolved_path = os.path.abspath(os.path.join(current_dir, target_file_unquoted))

            if not os.path.exists(resolved_path):
                self.add_issue(
                    file_path,
                    "ZNS-STRUCT",
                    "STR-004",
                    "ERROR",
                    f"Broken internal link: '[{text}]({target})' -> Target path '{resolved_path}' does not exist.",
                )

    def validate_object_id_registry_alignment(self):
        """Validates overall Object ID Registry consistency across the workspace."""
        # 1. Duplicate Object ID Check
        for doc_id, files in self.found_doc_ids.items():
            if len(files) > 1 and doc_id not in ["N/A", "TBD", "BUS-001 Asset"]:
                rel_files = [os.path.relpath(f, self.workspace_root) for f in files]
                self.add_issue(
                    files[0],
                    "ZNS-OID",
                    "OID-003",
                    "ERROR",
                    f"Duplicate Object ID '{doc_id}' assigned to multiple active files: {', '.join(rel_files)}",
                )

        # 2. Registry Alignment Check
        for doc_id, files in self.found_doc_ids.items():
            if doc_id and doc_id not in self.registered_ids and doc_id not in ["N/A", "TBD"]:
                rel_path = os.path.relpath(files[0], self.workspace_root)
                self.add_issue(
                    files[0],
                    "ZNS-OID",
                    "OID-004",
                    "WARNING",
                    f"Object ID '{doc_id}' used in '{rel_path}' is not registered in 00_Command Center/ID-Registry.md.",
                )

    def scan_workspace(self, target_module: Optional[str] = None):
        """Executes full workspace validation scan."""
        print(f"\n{COLOR_BOLD}{COLOR_CYAN}============================================={COLOR_RESET}")
        print(f"{COLOR_BOLD}{COLOR_CYAN}    ZNS WORKSPACE METADATA & RULE VALIDATOR   {COLOR_RESET}")
        print(f"{COLOR_BOLD}{COLOR_CYAN}============================================={COLOR_RESET}")
        print(f"Workspace Root: {self.workspace_root}\n")

        self.load_id_registry()

        modules_to_scan = [target_module] if target_module else ACTIVE_MODULES

        for mod in modules_to_scan:
            mod_path = os.path.join(self.workspace_root, mod)
            if not os.path.exists(mod_path):
                continue

            for root, dirs, files in os.walk(mod_path):
                dirs[:] = [d for d in dirs if d not in ['.git', '.agents', '.snapshots', 'node_modules']]
                # Validate folder structure
                self.validate_folder_structure(root)

                rel_root = os.path.relpath(root, self.workspace_root)
                if "99_Archive" in rel_root or "drafts" in rel_root:
                    continue

                for f in files:
                    file_path = os.path.join(root, f)
                    self.scanned_files_count += 1

                    # 1. File Naming Check
                    self.validate_file_naming(file_path)

                    # 2. Markdown File Content Checks
                    if f.endswith(".md"):
                        self.scanned_md_count += 1
                        try:
                            with open(file_path, "r", encoding="utf-8-sig", errors="ignore") as fp:
                                content = fp.read()

                            self.validate_metadata_header(file_path, content)
                            self.validate_markdown_links(file_path, content)
                        except Exception as ex:
                            self.add_issue(file_path, "ZNS-MD", "MD-000", "ERROR", f"Could not read file: {str(ex)}")

        # Post-scan Object ID cross-verification
        self.validate_object_id_registry_alignment()

    def generate_report(self, json_output_path: Optional[str] = None) -> int:
        """Prints diagnostic summary report and returns exit status code."""
        errors = [i for i in self.issues if i.severity == "ERROR"]
        warnings = [i for i in self.issues if i.severity == "WARNING"]

        cat_counts = {
            "ZNS-NC": len([i for i in self.issues if i.category == "ZNS-NC"]),
            "ZNS-OID": len([i for i in self.issues if i.category == "ZNS-OID"]),
            "ZNS-MD": len([i for i in self.issues if i.category == "ZNS-MD"]),
            "ZNS-STRUCT": len([i for i in self.issues if i.category == "ZNS-STRUCT"]),
        }

        print("\n" + "=" * 50)
        print(f"{COLOR_BOLD}ZNS VALIDATION SUMMARY REPORT{COLOR_RESET}")
        print("=" * 50)
        print(f"  Total Files Scanned:       {self.scanned_files_count}")
        print(f"  Total Markdown Files:      {self.scanned_md_count}")
        print(f"  Total Links Checked:       {self.checked_links_count}")
        print(f"  ZNS-NC (Naming) Issues:    {cat_counts['ZNS-NC']}")
        print(f"  ZNS-OID (ID Reg) Issues:   {cat_counts['ZNS-OID']}")
        print(f"  ZNS-MD (Metadata) Issues:  {cat_counts['ZNS-MD']}")
        print(f"  ZNS-STRUCT (Link/Dir):     {cat_counts['ZNS-STRUCT']}")
        print("-" * 50)

        err_color = COLOR_GREEN if len(errors) == 0 else COLOR_RED
        warn_color = COLOR_GREEN if len(warnings) == 0 else COLOR_YELLOW

        print(f"  {err_color}TOTAL ERRORS:   {len(errors)}{COLOR_RESET}")
        print(f"  {warn_color}TOTAL WARNINGS: {len(warnings)}{COLOR_RESET}")
        print("=" * 50)

        if json_output_path:
            report_data = {
                "scanned_files": self.scanned_files_count,
                "scanned_md": self.scanned_md_count,
                "checked_links": self.checked_links_count,
                "error_count": len(errors),
                "warning_count": len(warnings),
                "category_counts": cat_counts,
                "issues": [i.to_dict() for i in self.issues],
            }
            with open(json_output_path, "w", encoding="utf-8") as jf:
                json.dump(report_data, jf, indent=2)
            print(f"{COLOR_CYAN}JSON report saved to: {json_output_path}{COLOR_RESET}")

        failed = len(errors) > 0 or (self.strict and len(warnings) > 0)
        if failed:
            print(f"\n{COLOR_RED}{COLOR_BOLD}{SYM_FAIL} ZNS VALIDATION FAILED! {len(errors)} error(s) found.{COLOR_RESET}")
            return 1
        else:
            print(f"\n{COLOR_GREEN}{COLOR_BOLD}{SYM_PASS} ZNS VALIDATION PASSED! 0 critical errors found.{COLOR_RESET}")
            return 0


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    default_root = os.path.abspath(os.path.join(script_dir, "..", ".."))

    parser = argparse.ArgumentParser(description="ZNS Workspace Metadata & Rule Validator")
    parser.add_argument("--workspace-root", default=default_root, help="Root path of the workspace")
    parser.add_argument("--strict", action="store_true", help="Fail on warnings as well as errors")
    parser.add_argument("--module", help="Validate a specific module folder only")
    parser.add_argument("--json", help="Path to write JSON validation report")
    parser.add_argument("--quiet", action="store_true", help="Suppress individual issue output")

    args = parser.parse_args()

    validator = ZNSValidator(
        workspace_root=args.workspace_root,
        strict=args.strict,
        verbose=not args.quiet,
    )

    validator.scan_workspace(target_module=args.module)
    exit_code = validator.generate_report(json_output_path=args.json)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
