---
Title: BROWSER_CONFIG
ID: SYS-005
Type: Configuration
Module: Automation & Infrastructure
BU: Real Estate AI Infrastructure
Status: Approved
Version: 1.0.0
Created: 2026-07-29
Updated: 2026-07-29
Owner: CEO / ZK Nexus Team
Related: SYS-002, SYS-004
---

# ZK Nexus — System Browser Configuration Standard

## Executive Rule

All browser automation, scraping, Puppeteer instances, DevTools MCP interactions, and user preview tasks MUST exclusively execute using **Brave Browser**.

- **Default Browser Binary**: `C:\Users\Dell\AppData\Local\BraveSoftware\Brave-Browser\Application\brave.exe`
- **Remote Debugging Port**: `9222`
- **Google Chrome Usage**: STRICTLY FORBIDDEN / REMOVED FROM SELECTION.

---

## Technical Integration Standard

1. **Puppeteer Scripts**:
   ```javascript
   const browser = await puppeteer.launch({
       executablePath: 'C:\\Users\\Dell\\AppData\\Local\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
       headless: false
   });
   ```

2. **Chrome DevTools MCP / Chrome Remote Interface**:
   Must attach to existing Brave instance on `http://127.0.0.1:9222`.

---

## Verification & ZNS Compliance

This document complies 100% with ZNS frontmatter metadata standards.
