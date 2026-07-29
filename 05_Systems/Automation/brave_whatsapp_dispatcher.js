/**
 * ZK Revenue Ops — Brave Browser WhatsApp Dispatcher
 * Directly launches Brave Browser (never Chrome) to handle WhatsApp Web Outreach
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const BRAVE_PATH = 'C:\\Users\\Dell\\AppData\\Local\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const PROSPECTS_FILE = path.join(__dirname, '../../01_Business/ZK-Revenue-Ops/Leads/ren_prospects_100.json');

function launchBraveWhatsApp() {
    console.log("================ BRAVE BROWSER EXCLUSIVE LAUNCHER ================");
    console.log("Launching Brave Browser binary at:", BRAVE_PATH);

    if (!fs.existsSync(BRAVE_PATH)) {
        console.error("ERROR: Brave Browser binary not found!");
        return;
    }

    const braveProcess = spawn(BRAVE_PATH, [
        '--remote-debugging-port=9222',
        'https://web.whatsapp.com/'
    ], {
        detached: true,
        stdio: 'ignore'
    });

    braveProcess.unref();
    console.log("SUCCESS: Brave Browser launched with WhatsApp Web on port 9222!");
}

launchBraveWhatsApp();
