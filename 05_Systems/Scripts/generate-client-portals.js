/**
 * ---
 * Title: Standalone REN Client Portal Generator (SYS-036)
 * ID: SYS-036
 * Type: Script (Node.js Generator)
 * Module: 05_Systems/Scripts
 * BU: ZK Revenue Ops
 * Status: Active
 * Version: 1.0
 * Created: 2026-08-08
 * Updated: 2026-08-08
 * Owner: Zubair (zubairisa10@gmail.com)
 * ---
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../');

const CLIENTS = [
    {
        id: 'REN-001',
        name: 'Ahmad Razif',
        agency: 'Subang Jaya Property Hub',
        territory: 'Subang Jaya & USJ',
        color: '#6366f1',
        fee: 1500,
        statusText: 'Tier 1 Premium Retainer — Active 🟢',
        buyers: [
            { name: "Muhammad Hariz", phone: "+60123456789", project: "SkyResidence Subang", income: "RM 7,500 / mo", dsr: "38.5%", tier: "Tier 1 Pre-Approved", viewing: "Sabtu ini, 11:00 AM" },
            { name: "Tan Wei Lun", phone: "+60171112233", project: "Subang Parksuites", income: "RM 8,200 / mo", dsr: "39.1%", tier: "Tier 1 Pre-Approved", viewing: "Ahad ini, 3:00 PM" },
            { name: "Siti Nurhaliza", phone: "+60193334455", project: "USJ Heights", income: "RM 6,200 / mo", dsr: "44.0%", tier: "Tier 2 Docs Needed", viewing: "Pending Date" }
        ]
    },
    {
        id: 'REN-002',
        name: 'Sarah Tan',
        agency: 'Shah Alam Real Estate',
        territory: 'Shah Alam North & Setia Alam',
        color: '#10b981',
        fee: 1000,
        statusText: 'Tier 2 Growth Retainer — Active 🟢',
        buyers: [
            { name: "Farhan Zulkifli", phone: "+60138889900", project: "Setia Eco Park", income: "RM 9,500 / mo", dsr: "35.2%", tier: "Tier 1 Pre-Approved", viewing: "Sabtu ini, 2:30 PM" },
            { name: "Devi Subramaniam", phone: "+60162223344", project: "Shah Alam North Villa", income: "RM 7,100 / mo", dsr: "38.0%", tier: "Tier 1 Pre-Approved", viewing: "Ahad ini, 11:00 AM" }
        ]
    },
    {
        id: 'REN-003',
        name: 'Kevon Lee',
        agency: 'Cyberjaya Prime Property',
        territory: 'Cyberjaya & Puchong',
        color: '#f59e0b',
        fee: 800,
        statusText: 'Tier 3 Starter Retainer — Active 🟢',
        buyers: [
            { name: "Kevin Goh", phone: "+60115556677", project: "Cyberjaya CyberResidence", income: "RM 6,800 / mo", dsr: "37.5%", tier: "Tier 1 Pre-Approved", viewing: "Sabtu ini, 4:00 PM" }
        ]
    }
];

function generatePortalHTML(client) {
    const jsonStr = JSON.stringify(client, null, 4);

    return `<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${client.name} (${client.id}) — Dedicated REN Client Portal</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-canvas: #0f172a;
            --bg-surface: #1e293b;
            --bg-card: #1e293b;
            --border-subtle: #334155;
            --text-primary: #f8fafc;
            --text-secondary: #cbd5e1;
            --text-muted: #94a3b8;
            --accent-blue: #38bdf8;
            --accent-emerald: #10b981;
            --accent-amber: #f59e0b;
            --accent-rose: #ef4444;
            --accent-indigo: ${client.color || '#6366f1'};
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background-color: var(--bg-canvas);
            color: var(--text-primary);
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            -webkit-font-smoothing: antialiased;
        }

        .icon {
            width: 18px; height: 18px;
            stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
            fill: none; display: inline-block; vertical-align: middle;
        }

        /* Top Header */
        .header {
            background: #0f172a;
            border-bottom: 1px solid var(--border-subtle);
            padding: 18px 36px;
            display: flex; justify-content: space-between; align-items: center;
            position: sticky; top: 0; z-index: 50;
            box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        }

        .brand-container { display: flex; align-items: center; gap: 14px; }

        .brand-logo {
            width: 42px; height: 42px;
            background: linear-gradient(135deg, var(--accent-indigo), var(--accent-blue));
            border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            color: #ffffff; font-weight: 800; font-size: 18px;
            box-shadow: 0 4px 12px rgba(99,102,241,0.4);
        }

        .brand-title { display: flex; flex-direction: column; gap: 2px; }
        .brand-title span:first-child { font-size: 16px; font-weight: 800; color: #ffffff; }

        .brand-badge {
            background: rgba(99, 102, 241, 0.15);
            color: var(--accent-indigo);
            border: 1px solid rgba(99, 102, 241, 0.3);
            font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 4px;
            text-transform: uppercase; width: fit-content;
        }

        .header-actions { display: flex; align-items: center; gap: 16px; }

        .client-profile-tag {
            display: flex; align-items: center; gap: 10px;
            background: var(--bg-surface); border: 1px solid var(--border-subtle);
            padding: 8px 16px; border-radius: 8px;
        }

        .client-name-bold { font-size: 13px; font-weight: 800; color: var(--text-primary); }
        .client-agency-sub { font-size: 11px; color: var(--text-muted); }

        .btn-export {
            display: flex; align-items: center; gap: 8px;
            background: var(--accent-indigo); color: #ffffff;
            border: none; padding: 10px 20px; border-radius: 8px;
            font-size: 13px; font-weight: 700; cursor: pointer;
            transition: all 0.15s ease;
        }
        .btn-export:hover { opacity: 0.9; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4); }

        .container {
            max-width: 1320px; margin: 28px auto; padding: 0 24px;
            width: 100%; flex: 1;
        }

        /* Metrics */
        .metrics-grid {
            display: grid; grid-template-columns: repeat(4, 1fr);
            gap: 18px; margin-bottom: 28px;
        }

        .metric-card {
            background: var(--bg-surface); border: 1px solid var(--border-subtle);
            border-radius: 12px; padding: 22px;
            display: flex; flex-direction: column; justify-content: space-between;
            position: relative; overflow: hidden;
        }

        .metric-card::before {
            content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%;
            background: var(--accent-indigo);
        }

        .metric-label  { color: var(--text-muted); font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
        .metric-value  { font-size: 32px; font-weight: 800; line-height: 1.1; color: var(--text-primary); margin-bottom: 4px; }
        .metric-sub    { font-size: 12px; color: var(--text-secondary); }

        /* Tabs */
        .tab-bar {
            display: flex; align-items: center; justify-content: space-between;
            background: var(--bg-surface); border: 1px solid var(--border-subtle);
            border-radius: 12px; padding: 6px; margin-bottom: 28px;
        }

        .tab-group { display: flex; gap: 6px; }

        .tab-btn {
            display: flex; align-items: center; gap: 8px;
            background: transparent; border: none; color: var(--text-muted);
            padding: 11px 20px; border-radius: 8px; font-size: 13px; font-weight: 800;
            cursor: pointer; transition: all 0.15s ease; font-family: inherit;
        }

        .tab-btn:hover { color: var(--text-primary); background: rgba(255, 255, 255, 0.04); }
        .tab-btn.active {
            background: var(--bg-canvas); color: var(--accent-blue);
            border: 1px solid var(--border-subtle); box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        .tab-panel { display: none; }
        .tab-panel.active { display: block; }

        /* Cards Grid */
        .cards-grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
            gap: 22px;
        }

        .dossier-card {
            background: var(--bg-surface); border: 1px solid var(--border-subtle);
            border-radius: 12px; padding: 22px; position: relative;
            display: flex; flex-direction: column; justify-content: space-between;
        }

        .buyer-name { font-size: 18px; font-weight: 800; color: var(--text-primary); }
        .buyer-contact { font-size: 13px; color: var(--text-muted); margin-top: 2px; }

        .tier-badge {
            font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px;
            text-transform: uppercase; letter-spacing: 0.03em;
        }
        .tier-1 { background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.3); }
        .tier-2 { background: rgba(245, 158, 11, 0.15); color: var(--accent-amber); border: 1px solid rgba(245, 158, 11, 0.3); }

        .info-matrix {
            background: #0f172a; border: 1px solid var(--border-subtle);
            border-radius: 10px; padding: 16px; margin: 16px 0;
            display: flex; flex-direction: column; gap: 10px;
        }

        .info-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
        .info-label { color: var(--text-muted); font-weight: 500; }
        .info-val   { font-weight: 800; color: var(--text-primary); }

        .btn-wa-action {
            display: flex; align-items: center; gap: 8px; justify-content: center;
            background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald);
            border: 1px solid rgba(16, 185, 129, 0.3); padding: 9px 16px; border-radius: 8px;
            font-size: 13px; font-weight: 800; text-decoration: none; transition: all 0.15s ease;
            width: 100%; margin-top: 12px;
        }
        .btn-wa-action:hover { background: rgba(16, 185, 129, 0.25); }

        /* Print */
        @media print {
            body { background: #ffffff !important; color: #0f172a !important; }
            .header, .tab-bar, .btn-export, .btn-wa-action { display: none !important; }
            .dossier-card { background: #ffffff !important; border: 1px solid #cbd5e1 !important; color: #0f172a !important; }
        }
    </style>
</head>
<body>

    <!-- Header -->
    <header class="header">
        <div class="brand-container">
            <div class="brand-logo">ZK</div>
            <div class="brand-title">
                <span>ZK REVENUE OPS</span>
                <span class="brand-badge">${client.id} DEDICATED PORTAL</span>
            </div>
        </div>

        <div class="header-actions">
            <div class="client-profile-tag">
                <svg class="icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <div>
                    <div class="client-name-bold">${client.name} (${client.id})</div>
                    <div class="client-agency-sub">${client.agency} | ${client.territory}</div>
                </div>
            </div>

            <button class="btn-export" onclick="window.print()">
                <svg class="icon" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                <span>Export PDF</span>
            </button>
        </div>
    </header>

    <!-- Container -->
    <div class="container">

        <!-- Metrics Grid -->
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-label">Assigned Buyer Leads</div>
                <div class="metric-value">${client.buyers.length}</div>
                <div class="metric-sub">Dedicated to ${client.name}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Tier 1 Pre-Approved</div>
                <div class="metric-value">${client.buyers.filter(b => b.tier.includes('Tier 1')).length}</div>
                <div class="metric-sub">DSR ≤ 40% (LPPSA/Bank Approved)</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Confirmed Viewings</div>
                <div class="metric-value">${client.buyers.filter(b => !b.viewing.includes('Pending')).length}</div>
                <div class="metric-sub">Confirmed sales gallery viewings</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Delivered Pipeline Loan</div>
                <div class="metric-value">RM 14.5M</div>
                <div class="metric-sub">Total pre-approved housing loan capacity</div>
            </div>
        </div>

        <!-- Tab Bar -->
        <div class="tab-bar">
            <div class="tab-group">
                <button class="tab-btn active">
                    <svg class="icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span>Verified Buyer Dossiers for ${client.name}</span>
                </button>
            </div>
        </div>

        <!-- Cards Grid -->
        <div class="cards-grid">
            ${client.buyers.map(b => {
                const waMsg = encodeURIComponent(`Salam ${b.name}, saya ${client.name} dari ${client.agency}. Saya ingin mengesahkan maklumat kelayakan DSR anda (${b.dsr}) bagi projek ${b.project}. Boleh kita tetapkan masa berjumpa di Sales Gallery?`);
                const waUrl = `https://wa.me/${b.phone.replace('+','')}?text=${waMsg}`;
                return `
                    <div class="dossier-card">
                        <div>
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                                <div>
                                    <div class="buyer-name">${b.name}</div>
                                    <div class="buyer-contact">${b.phone}</div>
                                </div>
                                <span class="tier-badge ${b.tier.includes('Tier 1') ? 'tier-1' : 'tier-2'}">${b.tier}</span>
                            </div>

                            <div class="info-matrix">
                                <div class="info-row"><span class="info-label">Projek Pilihan</span><span class="info-val">${b.project}</span></div>
                                <div class="info-row"><span class="info-label">Anggaran Pendapatan</span><span class="info-val" style="color:var(--accent-emerald);">${b.income}</span></div>
                                <div class="info-row"><span class="info-label">Nisbah DSR Disemak</span><span class="info-val" style="color:var(--accent-blue);">${b.dsr}</span></div>
                                <div class="info-row"><span class="info-label">Viewing Gallery</span><span class="info-val" style="color:var(--accent-amber);">${b.viewing}</span></div>
                            </div>
                        </div>

                        <a href="${waUrl}" target="_blank" class="btn-wa-action">
                            <svg class="icon" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            <span>1-Click WhatsApp Contact ${b.name}</span>
                        </a>
                    </div>
                `;
            }).join('')}
        </div>

    </div>

</body>
</html>`;
}

// Generate files for all clients
CLIENTS.forEach(client => {
    const filename = `${client.id}_portal.html`;
    const targetPath = path.join(ROOT, filename);
    const htmlContent = generatePortalHTML(client);
    fs.writeFileSync(targetPath, htmlContent, 'utf8');
    console.log(`✅ Generated standalone portal: ${filename}`);

    // Also copy to Console-Portal/public/
    const publicPath = path.join(ROOT, '05_Systems/Console-Portal/public', filename);
    fs.writeFileSync(publicPath, htmlContent, 'utf8');
});

console.log('🎉 ALL STANDALONE CLIENT PORTALS GENERATED SUCCESSFULLY!');
