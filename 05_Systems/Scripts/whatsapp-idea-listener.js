/**
 * ---
 * Title: WhatsApp Idea Listener
 * ID: SYS-023
 * Type: Script (Node.js)
 * Module: 05_Systems
 * BU: ZK Revenue Ops
 * Status: Active
 * Version: 1.0
 * Created: 2026-08-05
 * Updated: 2026-08-05
 * Owner: Zubair (zubairisa10@gmail.com)
 * Related: PRJ-009
 * ---
 */

// ZK Nexus WhatsApp Idea Capture Webhook Listener
// Port: 3001
// Purpose: Listens for incoming WhatsApp self-chat idea payloads and appends to 02_Projects/Idea-Catcher.md

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const WORKSPACE_ROOT = "c:\\Users\\Dell\\Documents\\Projects ZK Nexus";
const IDEA_FILE = path.join(WORKSPACE_ROOT, "02_Projects", "Idea-Catcher.md");

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/api/whatsapp-idea') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const ideaText = data.idea || data.text || data.message || '';
                
                if (!ideaText) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'error', message: 'Empty idea text' }));
                    return;
                }

                const today = new Date().toISOString().split('T')[0];
                const time = new Date().toTimeString().split(' ')[0].substring(0, 5);

                let content = fs.readFileSync(IDEA_FILE, 'utf8');

                const todayHeader = `## ${today}`;
                const newEntry = `### Idea (${time} via WhatsApp): ${ideaText}\n`;

                if (content.includes(todayHeader)) {
                    content = content.replace(todayHeader, `${todayHeader}\n\n${newEntry}`);
                } else {
                    content = content.replace("---\n\n## ", `---\n\n## ${today}\n\n${newEntry}\n\n## `);
                }

                const tableRow = `| ${today} | ${ideaText} | Pending Review |\n`;
                if (content.includes('| Tarikh | Idea | Status |')) {
                    content = content.replace('| Tarikh | Idea | Status |\n|--------|------|--------|', `| Tarikh | Idea | Status |\n|--------|------|--------|\n${tableRow}`);
                }

                fs.writeFileSync(IDEA_FILE, content, 'utf8');

                console.log(`[WHATSAPP CAPTURE] Idea saved: "${ideaText}"`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'success', message: 'Idea captured in Idea-Catcher.md' }));
            } catch (err) {
                console.error('[ERROR]', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: err.message }));
            }
        });
    } else if (req.method === 'GET' && req.url === '/wa-shortcut') {
        // Direct WhatsApp Click-to-Chat Quick Page
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>WhatsApp Idea Quick Link</title>
            <style>
                body { font-family: -apple-system, sans-serif; background: #0b0f19; color: #fff; text-align: center; padding: 40px 20px; }
                .card { background: #161f31; border-radius: 12px; padding: 30px; max-width: 400px; margin: 0 auto; border: 1px solid #1e293b; }
                .btn { display: inline-block; background: #25d366; color: #000; font-weight: bold; padding: 14px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="card">
                <h2>ZK Nexus WhatsApp Idea Capture</h2>
                <p>Tap below to open WhatsApp Self-Chat pre-filled with IDEA:</p>
                <a href="https://api.whatsapp.com/send?text=IDEA%3A%20" class="btn">💬 Open WhatsApp Self-Chat</a>
            </div>
        </body>
        </html>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`[WHATSAPP IDEA LISTENER] Active on http://localhost:${PORT}`);
});
