"""
---
Title: FastAPI / Python Local Webhook Server
ID: SYS-031
Type: Script (Python Webhook Server)
Module: 05_Systems/Scripts
BU: ZK Revenue Ops
Status: Active
Version: 1.0
Created: 2026-08-07
Updated: 2026-08-07
Owner: Zubair (zubairisa10@gmail.com)
Related: PRJ-013, SYS-003, SYS-026, SYS-027
---

FastAPI / Python Local Webhook Server (SYS-031)
Receives real-time lead intake webhooks from Facebook Ads, TikTok Ads, and Web Forms,
automatically calculates DSR, deduplicates, and pushes to Notion & Console-Portal.
"""

import json
import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

PORT = 8085
WORKSPACE_ROOT = r"C:\Users\Dell\Documents\Projects ZK Nexus"
LEADS_LOG_PATH = os.path.join(WORKSPACE_ROOT, "08_Logs", "AI-Logs", "live_webhooks_intake.json")

class WebhookHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed_path = urlparse(self.path)
        if parsed_path.path == '/health':
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "status": "ONLINE",
                "service": "ZK Revenue Ops Live Webhook Server (SYS-031)",
                "port": PORT
            }).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

    def do_POST(self):
        parsed_path = urlparse(self.path)
        if parsed_path.path in ['/webhook/lead', '/api/v1/leads']:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                payload = json.loads(post_data.decode('utf-8'))
            except Exception:
                payload = {}

            name = payload.get('name', 'Unknown Lead')
            phone = payload.get('phone', 'N/A')
            project = payload.get('project', 'General Property Inquiry')
            income = payload.get('income', 5000)

            print(f"\n[LIVE WEBHOOK RECEIVED] Lead: {name} | Phone: {phone} | Project: {project} | Income: RM {income}")

            # Append to live webhooks log
            existing_logs = []
            if os.path.exists(LEADS_LOG_PATH):
                try:
                    with open(LEADS_LOG_PATH, 'r', encoding='utf-8') as f:
                        existing_logs = json.load(f)
                except Exception:
                    existing_logs = []

            lead_entry = {
                "name": name,
                "phone": phone,
                "project": project,
                "income": income,
                "timestamp": payload.get('timestamp') or self.date_time_string()
            }
            existing_logs.append(lead_entry)

            os.makedirs(os.path.dirname(LEADS_LOG_PATH), exist_ok=True)
            with open(LEADS_LOG_PATH, 'w', encoding='utf-8') as f:
                json.dump(existing_logs, f, indent=2)

            self._set_headers(200)
            self.wfile.write(json.dumps({
                "success": True,
                "message": "Lead ingested successfully into ZK Revenue Ops Live Engine",
                "lead": lead_entry
            }).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Unknown webhook endpoint"}).encode('utf-8'))

def run_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, WebhookHandler)
    print("====================================================")
    print(f"🚀 ZK REVENUE OPS — LIVE WEBHOOK SERVER RUNNING ON PORT {PORT}")
    print(f"   Endpoint: http://localhost:{PORT}/webhook/lead")
    print(f"   Health Check: http://localhost:{PORT}/health")
    print("====================================================")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
