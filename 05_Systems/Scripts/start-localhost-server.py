"""
---
Title: Localhost Dev Server (SYS-035)
ID: SYS-035
Type: Script (Python HTTP Server)
Module: 05_Systems/Scripts
BU: ZK Revenue Ops
Status: Active
Version: 1.0
Created: 2026-08-08
Updated: 2026-08-08
Owner: Zubair (zubairisa10@gmail.com)
---
"""

import http.server
import socketserver
import os
import sys

# Force UTF-8 output on Windows
if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

PORT = 8080
DIRECTORY = r"C:\Users\Dell\Documents\Projects ZK Nexus"

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Quiet clean logging
        print(f"[LOCALHOST :{PORT}] {args[0]}")

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print("="*60)
        print(f"  ZK REVENUE OPS LOCALHOST DEV SERVER IS ACTIVE!")
        print(f"  Master Console:  http://localhost:{PORT}/index.html")
        print(f"  Client Portal:   http://localhost:{PORT}/portal.html")
        print("="*60)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            sys.exit(0)
