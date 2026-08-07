/**
 * ---
 * Title: High-Speed Node Localhost Dev Server (SYS-035)
 * ID: SYS-035
 * Type: Script (Node.js HTTP Server)
 * Module: 05_Systems/Scripts
 * BU: ZK Revenue Ops
 * Status: Active
 * Version: 2.0
 * Created: 2026-08-08
 * Updated: 2026-08-08
 * Owner: Zubair (zubairisa10@gmail.com)
 * ---
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = path.resolve(__dirname, '../../');

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css':  'text/css; charset=UTF-8',
    '.js':   'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.svg':  'image/svg+xml',
    '.csv':  'text/csv; charset=UTF-8',
};

const server = http.createServer((req, res) => {
    // Disable browser caching completely for dev mode
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';

    const filePath = path.join(ROOT, reqPath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`404 Not Found: ${reqPath}`);
            return;
        }

        const ext  = path.extname(filePath).toLowerCase();
        const mime = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': mime });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, () => {
    console.log('=' .repeat(60));
    console.log(`  🟢 ZK REVENUE OPS NODE DEV SERVER ACTIVE ON PORT ${PORT}`);
    console.log(`  👉 Master Console:  http://localhost:${PORT}/index.html`);
    console.log(`  👉 REN Portal:      http://localhost:${PORT}/portal.html?ren=REN-001`);
    console.log('=' .repeat(60));
});
