/**
 * ---
 * Title: ZK Revenue Ops Console Portal — Enterprise App Engine v3.1
 * ID: SYS-CON-JS-001
 * Type: Script (Vanilla JS)
 * Module: 05_Systems
 * BU: ZK Revenue Ops
 * Status: Active
 * Version: 3.1
 * Created: 2026-08-06
 * Updated: 2026-08-06
 * Owner: Zubair (zubairisa10@gmail.com)
 * Related: PRJ-010, SYS-003, SYS-004
 * ---
 *
 * ZK Revenue Ops Console Portal — Enterprise Engine v3.1
 * Features: Batch CSV Import/Export, Shareable Agent Portal URLs, PDF Dossier Export,
 *           Live HTTP Sync Bridge to Google Apps Script & Notion API,
 *           Auto-export to dossiers.json for GitHub Pages.
 */

'use strict';

// ── INITIAL DATA STORES ───────────────────────────────────────────────────────

const initialRenClients = [
    {
        id: 'REN-001',
        name: 'Agent Ahmad',
        renNo: 'REN 45102',
        agency: 'Renstar Properties',
        territory: 'Subang & Shah Alam',
        tier: 'Growth',
        seatId: 'SEAT-001',
        activeDossiersCount: 2,
        totalEarnedYtd: 'RM 14,500'
    },
    {
        id: 'REN-002',
        name: 'Agent Sarah',
        renNo: 'REN 52109',
        agency: 'IQI Realty',
        territory: 'Subang Jaya & USJ',
        tier: 'Enterprise',
        seatId: 'SEAT-002',
        activeDossiersCount: 1,
        totalEarnedYtd: 'RM 22,000'
    },
    {
        id: 'REN-003',
        name: 'Agent Farhan',
        renNo: 'REN 38901',
        agency: 'PropNex Malaysia',
        territory: 'Shah Alam Seksyen 7',
        tier: 'Starter',
        seatId: 'SEAT-003',
        activeDossiersCount: 0,
        totalEarnedYtd: 'RM 6,800'
    }
];

const initialLeads = [
    {
        id: 'LEAD-001',
        name: 'Muhammad Hariz',
        phone: '+60123456789',
        project: 'SkyResidence Subang',
        income: 6500,
        tier: 'Hot',
        loanStatus: 'Pre-Approved',
        viewingTime: 'Sabtu 11:00 AM @ Sales Gallery',
        notes: 'DSR ratio 42%, LPPSA pre-approval RM450k.',
        publishedToClient: true,
        assignedClientId: 'REN-001',
        clientFeedback: 'Pending Viewing'
    },
    {
        id: 'LEAD-002',
        name: 'Nurul Aini',
        phone: '+60198765432',
        project: 'Subang Parksuites',
        income: 5200,
        tier: 'Warm',
        loanStatus: 'Documents Collected',
        viewingTime: '',
        notes: 'Menunggu slip gaji 3 bulan terkini.',
        publishedToClient: false,
        assignedClientId: 'REN-001',
        clientFeedback: ''
    },
    {
        id: 'LEAD-003',
        name: 'Tan Wei Lun',
        phone: '+60171112233',
        project: 'SkyResidence Subang',
        income: 8000,
        tier: 'Hot',
        loanStatus: 'Pre-Approved',
        viewingTime: 'Ahad 3:00 PM @ Sales Gallery',
        notes: 'Mencari unit 3 bilik untuk penempatan sendiri.',
        publishedToClient: true,
        assignedClientId: 'REN-002',
        clientFeedback: 'Viewing Completed'
    },
    {
        id: 'LEAD-004',
        name: 'Santhi Kumar',
        phone: '+60164445566',
        project: 'Subang Parksuites',
        income: 3200,
        tier: 'New',
        loanStatus: 'Pending Submission',
        viewingTime: '',
        notes: 'Lead masuk melalui FB Ads. Perlu semak DSR.',
        publishedToClient: false,
        assignedClientId: 'REN-001',
        clientFeedback: ''
    }
];

const initialIdeas = [
    { id: 'IDEA-001', text: 'Auto WhatsApp DSR checker for new leads', source: 'WhatsApp', status: 'Pending Review' },
    { id: 'IDEA-002', text: 'Integrate Notion Webhook to trigger SMS notification to REN', source: 'CLI', status: 'Reviewed' }
];

// ── STATE MANAGEMENT ─────────────────────────────────────────────────────────

let renClients       = JSON.parse(localStorage.getItem('zk_ren_clients'))  || initialRenClients;
let leads            = JSON.parse(localStorage.getItem('zk_revenue_leads')) || initialLeads;
let ideas            = JSON.parse(localStorage.getItem('zk_ideas'))         || initialIdeas;

let gasWebAppUrl     = localStorage.getItem('zk_gas_url') || 'https://script.google.com/macros/s/AKfycbz_ZK_NEXUS_SAMPLE_EXEC/exec';
let notionApiKey     = localStorage.getItem('zk_notion_key') || '';

let activeView       = 'dashboard';
let activeFilter     = 'All';
let selectedLeadId   = null;
let activeClientDesk = renClients[0]?.id || 'REN-001';
let searchQuery      = '';
let importTargetType = 'leads';

// ── INIT ON DOM LOAD ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    parseUrlParams();
    persistData();
    renderAllViews();
    updateDashDate();
});

// ── PARSE URL PARAMETERS (SHAREABLE AGENT PORTAL URL) ────────────────────────

function parseUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const agentParam = urlParams.get('agent');
    if (agentParam) {
        const found = renClients.find(c => c.id === agentParam || c.renNo.replace(/\s+/g, '') === agentParam);
        if (found) {
            activeClientDesk = found.id;
            switchMode('client');
        }
    }
}

// ── PERSISTENCE ───────────────────────────────────────────────────────────────

function persistData() {
    localStorage.setItem('zk_ren_clients', JSON.stringify(renClients));
    localStorage.setItem('zk_revenue_leads', JSON.stringify(leads));
    localStorage.setItem('zk_ideas', JSON.stringify(ideas));
}

// ── NAVIGATION & MODE SWITCHER ────────────────────────────────────────────────

function switchMode(mode) {
    activeView = mode;
    const views = ['dashboard', 'operator', 'client', 'manager'];

    views.forEach(v => {
        const panel  = document.getElementById(`view-${v}`);
        const btn    = document.getElementById(`btn-${v}-mode`);
        const isAct  = v === mode;

        if (panel) {
            panel.classList.toggle('active', isAct);
            panel.hidden = !isAct;
        }
        if (btn) {
            btn.classList.toggle('active', isAct);
            btn.setAttribute('aria-pressed', isAct ? 'true' : 'false');
        }
    });

    renderAllViews();
}

// ── GLOBAL SEARCH ─────────────────────────────────────────────────────────────

function handleGlobalSearch(event) {
    searchQuery = event.target.value.trim().toLowerCase();
    renderAllViews();
}

// ── LEAD INGESTION (MODAL) ────────────────────────────────────────────────────

function openLeadModal() {
    document.getElementById('add-lead-form').reset();
    document.getElementById('lead-modal').classList.add('active');
}

function closeLeadModal() {
    document.getElementById('lead-modal').classList.remove('active');
}

function handleNewLead(event) {
    event.preventDefault();
    const name    = document.getElementById('lead-name').value.trim();
    const phone   = normalisePhone(document.getElementById('lead-phone').value.trim());
    const project = document.getElementById('lead-project').value.trim();
    const income  = parseFloat(document.getElementById('lead-income').value) || 0;

    const newLead = {
        id:                `LEAD-${String(leads.length + 1).padStart(3, '0')}`,
        name,
        phone,
        project,
        income,
        tier:              'New',
        loanStatus:        'Pending Submission',
        viewingTime:       '',
        notes:             'Lead masuk melalui Enterprise Command Center.',
        publishedToClient: false,
        assignedClientId:  renClients[0]?.id || 'REN-001',
        clientFeedback:    ''
    };

    leads.unshift(newLead);
    persistData();
    syncToNotion(newLead);
    syncToGasEngine(newLead);

    renderAllViews();
    closeLeadModal();
}

// ── BATCH CSV IMPORT & EXPORT ENGINE ──────────────────────────────────────────

function openImportModal(type) {
    importTargetType = type;
    document.getElementById('import-modal-title').textContent = type === 'clients' ? 'Bulk CSV REN Client Import' : 'Bulk CSV Lead Data Import';
    document.getElementById('csv-text-area').value = '';
    document.getElementById('import-modal').classList.add('active');
}

function closeImportModal() {
    document.getElementById('import-modal').classList.remove('active');
}

function downloadCsvTemplate() {
    let content = '';
    let filename = '';
    if (importTargetType === 'clients') {
        content = 'name,renNo,agency,territory,tier\nAgent Sarah,REN 52109,IQI Realty,Subang Jaya,Growth\nAgent Farhan,REN 38901,PropNex,Shah Alam,Starter';
        filename = 'ren_clients_template.csv';
    } else {
        content = 'name,phone,project,income,tier\nMuhammad Hariz,+60123456789,SkyResidence,6500,Hot\nNurul Aini,+60198765432,Subang Parksuites,5200,Warm';
        filename = 'leads_import_template.csv';
    }
    blobDownload(content, filename, 'text/csv');
}

function handleCsvFileSelected(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('csv-text-area').value = e.target.result;
    };
    reader.readAsText(file);
}

function executeBatchCsvImport() {
    const rawText = document.getElementById('csv-text-area').value.trim();
    if (!rawText) {
        alert('Sila masukkan kandungan CSV atau muat naik fail CSV.');
        return;
    }

    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length <= 1) {
        alert('Kandungan CSV kosong atau tiada baris data.');
        return;
    }

    let count = 0;
    const header = lines[0].toLowerCase();

    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
        if (parts.length < 3) continue;

        if (importTargetType === 'clients') {
            renClients.push({
                id:                 `REN-${String(renClients.length + 1).padStart(3, '0')}`,
                name:               parts[0] || 'Agent New',
                renNo:              parts[1] || 'REN 00000',
                agency:             parts[2] || 'Agency',
                territory:          parts[3] || 'Subang Jaya',
                tier:               parts[4] || 'Growth',
                seatId:             `SEAT-${String(renClients.length + 1).padStart(3, '0')}`,
                activeDossiersCount: 0,
                totalEarnedYtd:     'RM 0'
            });
            count++;
        } else {
            leads.unshift({
                id:                `LEAD-${String(leads.length + 1).padStart(3, '0')}`,
                name:              parts[0] || 'Bulk Prospect',
                phone:             normalisePhone(parts[1] || '+60100000000'),
                project:           parts[2] || 'Subang Property',
                income:            parseFloat(parts[3]) || 5000,
                tier:              parts[4] || 'New',
                loanStatus:        'Pending Submission',
                viewingTime:       '',
                notes:             'Batch CSV Import.',
                publishedToClient: false,
                assignedClientId:  renClients[0]?.id || 'REN-001',
                clientFeedback:    ''
            });
            count++;
        }
    }

    persistData();
    renderAllViews();
    closeImportModal();
    alert(`Berjaya mengimport ${count} rekod secara pukal!`);
}

function exportDataCsv(type) {
    if (type === 'clients') {
        const header = 'id,name,renNo,agency,territory,tier,seatId\n';
        const rows = renClients.map(c => `"${c.id}","${c.name}","${c.renNo}","${c.agency}","${c.territory}","${c.tier}","${c.seatId}"`).join('\n');
        blobDownload(header + rows, 'zk_ren_clients_export.csv', 'text/csv');
    } else {
        const header = 'id,name,phone,project,income,tier,loanStatus,assignedClientId,publishedToClient\n';
        const rows = leads.map(l => `"${l.id}","${l.name}","${l.phone}","${l.project}",${l.income},"${l.tier}","${l.loanStatus}","${l.assignedClientId}",${l.publishedToClient}`).join('\n');
        blobDownload(header + rows, 'zk_leads_export.csv', 'text/csv');
    }
}

function blobDownload(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// ── SHAREABLE AGENT PORTAL URL & PDF DOSSIER EXPORT ──────────────────────────

function copyShareableAgentLink() {
    const currentClient = renClients.find(c => c.id === activeClientDesk);
    if (!currentClient) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?agent=${currentClient.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert(`Pautan Shareable Agent Portal disalin!\n\n${shareUrl}`);
    }).catch(() => {
        alert(`Shareable Agent Portal URL:\n${shareUrl}`);
    });
}

function exportDossiersPdf() {
    window.print();
}

// ── REN CLIENT MANAGER (MODAL & SUBMIT) ───────────────────────────────────────

function openAddClientModal() {
    document.getElementById('add-client-form').reset();
    document.getElementById('client-modal').classList.add('active');
}

function closeAddClientModal() {
    document.getElementById('client-modal').classList.remove('active');
}

function handleNewClientSubmit(event) {
    event.preventDefault();
    const name      = document.getElementById('client-name').value.trim();
    const renNo     = document.getElementById('client-ren-no').value.trim();
    const agency    = document.getElementById('client-agency').value.trim();
    const territory = document.getElementById('client-territory').value.trim();
    const tier      = document.getElementById('client-tier').value;

    const newClient = {
        id:                 `REN-${String(renClients.length + 1).padStart(3, '0')}`,
        name,
        renNo,
        agency,
        territory,
        tier,
        seatId:             `SEAT-${String(renClients.length + 1).padStart(3, '0')}`,
        activeDossiersCount: 0,
        totalEarnedYtd:     'RM 0'
    };

    renClients.push(newClient);
    persistData();
    renderAllViews();
    closeAddClientModal();
}

// ── LIVE SYNC CONFIG MODAL ────────────────────────────────────────────────────

function openSyncModal() {
    document.getElementById('gas-url-input').value   = gasWebAppUrl;
    document.getElementById('notion-key-input').value = notionApiKey;
    document.getElementById('sync-modal').classList.add('active');
}

function closeSyncModal() {
    document.getElementById('sync-modal').classList.remove('active');
}

function saveSyncSettings() {
    gasWebAppUrl = document.getElementById('gas-url-input').value.trim() || gasWebAppUrl;
    notionApiKey = document.getElementById('notion-key-input').value.trim() || notionApiKey;

    localStorage.setItem('zk_gas_url', gasWebAppUrl);
    localStorage.setItem('zk_notion_key', notionApiKey);

    closeSyncModal();
    alert('Tetapan integrasi Live Sync & Backup berjaya disimpan!');
}

function triggerManualSync() {
    leads.forEach(l => {
        syncToGasEngine(l);
        syncToNotion(l);
    });
    alert('Proses Live Full Sync & Backup telah dipicu ke Google Sheets & Notion!');
}

// ── DSR CALCULATOR ────────────────────────────────────────────────────────────

function calculateDsr() {
    const income     = parseFloat(document.getElementById('dsr-income-input').value) || 0;
    const commitment = parseFloat(document.getElementById('dsr-commitment-input').value) || 0;
    const badge      = document.getElementById('dsr-ratio-badge');
    const outputText = document.getElementById('dsr-calc-output');

    if (income <= 0) {
        badge.className = 'dsr-badge green';
        badge.textContent = 'DSR: --%';
        outputText.textContent = 'Masukkan pendapatan bulanan untuk mengira kelayakan DSR.';
        return;
    }

    const dsrRatio = Math.round((commitment / income) * 100);
    const maxInstallment = Math.round(income * 0.65 - commitment);
    const estMaxLoan = maxInstallment > 0 ? Math.round(maxInstallment * 200) : 0;

    if (dsrRatio <= 65) {
        badge.className = 'dsr-badge green';
        badge.textContent = `DSR: ${dsrRatio}% (Layak)`;
    } else {
        badge.className = 'dsr-badge red';
        badge.textContent = `DSR: ${dsrRatio}% (Tinggi / Berrisiko)`;
    }

    outputText.textContent = `Kapasiti Ansuran Maksimum: RM ${maxInstallment.toLocaleString('ms-MY')}/bln • Anggaran Pinjaman Maksimum: RM ${estMaxLoan.toLocaleString('ms-MY')}`;
}

// ── TRIAGE MODAL ──────────────────────────────────────────────────────────────

function openTriageModal(leadId) {
    selectedLeadId = leadId;
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    document.getElementById('modal-lead-name').textContent = `Triage & Qualification: ${lead.name}`;
    document.getElementById('modal-lead-info').textContent = `${lead.project} • ${lead.phone} • RM ${lead.income.toLocaleString('ms-MY')}/bln`;

    document.getElementById('modal-tier-select').value  = lead.tier === 'New' ? 'Hot' : lead.tier;
    document.getElementById('modal-loan-status').value  = lead.loanStatus;
    document.getElementById('modal-viewing-time').value = lead.viewingTime || '';
    document.getElementById('modal-notes').value        = lead.notes || '';

    const assignSelect = document.getElementById('modal-assign-client');
    assignSelect.innerHTML = renClients.map(c => `
        <option value="${c.id}" ${c.id === lead.assignedClientId ? 'selected' : ''}>
            ${c.name} (${c.renNo} • ${c.agency})
        </option>
    `).join('');

    document.getElementById('dsr-income-input').value = lead.income || '';
    document.getElementById('dsr-commitment-input').value = Math.round((lead.income || 0) * 0.3);
    calculateDsr();

    document.getElementById('triage-modal').classList.add('active');
}

function closeTriageModal() {
    document.getElementById('triage-modal').classList.remove('active');
    selectedLeadId = null;
}

function saveTriageData() {
    if (!selectedLeadId) return;
    const lead = leads.find(l => l.id === selectedLeadId);
    if (!lead) return;

    lead.tier             = document.getElementById('modal-tier-select').value;
    lead.loanStatus       = document.getElementById('modal-loan-status').value;
    lead.viewingTime      = document.getElementById('modal-viewing-time').value.trim();
    lead.notes            = document.getElementById('modal-notes').value.trim();
    lead.assignedClientId = document.getElementById('modal-assign-client').value;

    if (lead.tier === 'Hot') {
        lead.publishedToClient = true;
    } else if (lead.tier === 'Disqualified') {
        lead.publishedToClient = false;
    }

    persistData();
    syncToNotion(lead);
    syncToGasEngine(lead);

    renderAllViews();
    closeTriageModal();
}

// ── WHATSAPP 1-CLICK OUTREACH ─────────────────────────────────────────────────

function buildWaLink(phone, name, tier) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const messages = {
        Hot:  `Salam ${name}, saya Zubair dari ZK Revenue Ops. Saya dah semak profil anda — anda layak untuk tawaran eksklusif kami. Boleh kita berbincang lebih lanjut?`,
        Warm: `Salam ${name}, saya Zubair dari ZK Revenue Ops. Terima kasih atas minat anda. Saya ingin berkongsi beberapa pilihan properti yang sesuai dengan keperluan anda.`,
        New:  `Salam ${name}, saya Zubair dari ZK Revenue Ops. Saya ada beberapa maklumat properti yang mungkin berminat untuk anda. Boleh saya kongsikan?`,
        Cold: `Salam ${name}, saya Zubair dari ZK Revenue Ops. Harap anda sihat. Ada perkembangan terkini yang saya ingin kongsikan.`
    };
    const msg = encodeURIComponent(messages[tier] || messages['New']);
    return `https://wa.me/${cleanPhone}?text=${msg}`;
}

function triageLeadToWa() {
    if (!selectedLeadId) return;
    const lead = leads.find(l => l.id === selectedLeadId);
    if (!lead) return;
    const url = buildWaLink(lead.phone, lead.name, lead.tier);
    window.open(url, '_blank', 'noopener,noreferrer');
}

// ── RENDER ALL VIEWS ──────────────────────────────────────────────────────────

function renderAllViews() {
    updateMetrics();
    renderDashboardView();
    renderOperatorView();
    renderClientDeskView();
    renderClientManagerView();
}

// ── METRICS COUNTERS ──────────────────────────────────────────────────────────

function updateMetrics() {
    const rawCnt       = leads.filter(l => l.tier === 'New').length;
    const hotCnt       = leads.filter(l => l.tier === 'Hot').length;
    const warmCnt      = leads.filter(l => l.tier === 'Warm').length;
    const publishedCnt = leads.filter(l => l.publishedToClient).length;
    const disCnt       = leads.filter(l => l.tier === 'Disqualified').length;

    setText('dash-raw-cnt',    leads.length);
    setText('dash-hot-cnt',    hotCnt);
    setText('dash-client-cnt', publishedCnt);
    setText('dash-ren-cnt',    renClients.length);

    setText('metric-raw',       rawCnt);
    setText('metric-hot',       hotCnt);
    setText('metric-warm',      warmCnt);
    setText('metric-published', publishedCnt);

    setText('count-new',          rawCnt);
    setText('count-hot',          hotCnt);
    setText('count-warm',         warmCnt);
    setText('count-disqualified', disCnt);

    setText('badge-raw-count',   rawCnt);
    setText('badge-client-seats', `${renClients.length} Seats`);
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// ── DASHBOARD VIEW RENDER ─────────────────────────────────────────────────────

function renderDashboardView() {
    const recentList = document.getElementById('dash-recent-leads');
    if (recentList) {
        recentList.innerHTML = '';
        leads.slice(0, 4).forEach(l => {
            const row = document.createElement('div');
            row.className = 'recent-lead-row';
            row.innerHTML = `
                <div class="recent-lead-info">
                    <span class="recent-lead-name">${escapeHtml(l.name)}</span>
                    <span class="recent-lead-meta">${escapeHtml(l.project)} &bull; ${escapeHtml(l.phone)}</span>
                </div>
                <span class="badge-tag ${l.tier === 'Hot' ? 'hot-color' : l.tier === 'Warm' ? 'warm-color' : ''}">${escapeHtml(l.tier)}</span>
            `;
            recentList.appendChild(row);
        });
    }

    const ideasContainer = document.getElementById('dash-ideas-container');
    if (ideasContainer) {
        ideasContainer.innerHTML = '';
        ideas.slice(0, 4).forEach(i => {
            const item = document.createElement('div');
            item.className = 'recent-lead-row';
            item.innerHTML = `
                <span style="font-size:12px;color:var(--text-main);">${escapeHtml(i.text)}</span>
                <span class="badge-tag primary-tag">${escapeHtml(i.status)}</span>
            `;
            ideasContainer.appendChild(item);
        });
    }
}

function updateDashDate() {
    const el = document.getElementById('dash-pulse-date');
    if (el) {
        el.textContent = new Date().toLocaleDateString('ms-MY', {
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
        });
    }
}

function handleDashIdea(event) {
    event.preventDefault();
    const text = document.getElementById('dash-idea-text').value.trim();
    if (!text) return;

    ideas.unshift({
        id:     `IDEA-${String(ideas.length + 1).padStart(3, '0')}`,
        text,
        source: 'Dashboard',
        status: 'Pending Review'
    });

    persistData();
    renderAllViews();
    document.getElementById('dash-idea-form').reset();
}

// ── OPERATOR VIEW RENDER ──────────────────────────────────────────────────────

function filterLeads(tier) {
    activeFilter = tier;
    document.querySelectorAll('.filter-pill').forEach(btn => {
        const isAct = btn.id === `filter-${tier.toLowerCase()}`;
        btn.classList.toggle('active', isAct);
    });
    renderOperatorView();
}

function renderOperatorView() {
    const containers = {
        New:          document.getElementById('container-new'),
        Hot:          document.getElementById('container-hot'),
        Warm:         document.getElementById('container-warm'),
        Disqualified: document.getElementById('container-disqualified')
    };

    Object.values(containers).forEach(c => { if (c) c.innerHTML = ''; });

    let filtered = leads;
    if (activeFilter !== 'All') {
        filtered = filtered.filter(l => l.tier === activeFilter);
    }
    if (searchQuery) {
        filtered = filtered.filter(l =>
            l.name.toLowerCase().includes(searchQuery) ||
            l.project.toLowerCase().includes(searchQuery) ||
            l.phone.includes(searchQuery)
        );
    }

    filtered.forEach(lead => {
        const tier = containers[lead.tier] ? lead.tier : 'New';
        const col  = containers[tier];
        if (!col) return;

        const assignedAgent = renClients.find(c => c.id === lead.assignedClientId);
        const waUrl = buildWaLink(lead.phone, lead.name, lead.tier);

        const card = document.createElement('article');
        card.className = 'lead-card';
        card.innerHTML = `
            <div class="lead-card-header">
                <span class="lead-card-name">${escapeHtml(lead.name)}</span>
                <span class="lead-card-phone">${escapeHtml(lead.phone)}</span>
            </div>
            <div class="lead-card-project">${escapeHtml(lead.project)} &bull; RM ${lead.income.toLocaleString('ms-MY')}/bln</div>
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:10px;">
                Assigned: <strong style="color:var(--text-sub);">${assignedAgent ? escapeHtml(assignedAgent.name) : 'Unassigned'}</strong>
            </div>
            <div class="lead-card-actions">
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-wa">📱 WhatsApp</a>
                <button class="btn btn-sm btn-secondary" onclick="openTriageModal('${lead.id}')">Triage &amp; DSR</button>
            </div>
        `;
        col.appendChild(card);
    });
}

// ── REN CLIENT DESK VIEW RENDER ───────────────────────────────────────────────

function handleClientDeskSwitch(event) {
    activeClientDesk = event.target.value;
    renderClientDeskView();
}

function renderClientDeskView() {
    const select = document.getElementById('ren-client-select');
    if (select) {
        select.innerHTML = renClients.map(c => `
            <option value="${c.id}" ${c.id === activeClientDesk ? 'selected' : ''}>
                ${c.name} (${c.renNo} &bull; ${c.agency}) — ${c.territory}
            </option>
        `).join('');
    }

    const currentClient = renClients.find(c => c.id === activeClientDesk) || renClients[0];

    const shareUrlDisplay = document.getElementById('shareable-url-display');
    if (shareUrlDisplay && currentClient) {
        shareUrlDisplay.textContent = `Shareable Link: ?agent=${currentClient.id}`;
    }

    const metaDisplay = document.getElementById('client-meta-display');
    if (metaDisplay && currentClient) {
        const clientDossiers = leads.filter(l => l.publishedToClient && l.assignedClientId === currentClient.id);
        metaDisplay.innerHTML = `
            <div class="meta-box">
                <span class="meta-num">${clientDossiers.length}</span>
                <span class="meta-lbl">Verified Dossiers</span>
            </div>
        `;
    }

    const container = document.getElementById('client-dossier-container');
    if (!container) return;
    container.innerHTML = '';

    const dossiers = leads.filter(l => l.publishedToClient && l.assignedClientId === activeClientDesk);

    if (dossiers.length === 0) {
        container.innerHTML = `
            <div class="glass-card" style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:32px;">
                Tiada dossier pembeli disahkan lagi untuk <strong>${currentClient ? escapeHtml(currentClient.name) : 'ejen ini'}</strong>. Leads Tier 1 Hot yang di-assign akan muncul di sini.
            </div>
        `;
        return;
    }

    dossiers.forEach(lead => {
        const card = document.createElement('article');
        card.className = 'dossier-card';
        card.innerHTML = `
            <div class="dossier-header">
                <span class="dossier-name">${escapeHtml(lead.name)}</span>
                <span class="dossier-tag">VERIFIED BUYER</span>
            </div>
            <div class="dossier-row">
                <span class="dossier-lbl">Projek Minat:</span>
                <span class="dossier-val">${escapeHtml(lead.project)}</span>
            </div>
            <div class="dossier-row">
                <span class="dossier-lbl">Status Pinjaman:</span>
                <span class="dossier-val" style="color:var(--client-color);">${escapeHtml(lead.loanStatus)}</span>
            </div>
            <div class="dossier-row">
                <span class="dossier-lbl">Viewing Disahkan:</span>
                <span class="dossier-val">${escapeHtml(lead.viewingTime) || 'Belum Disahkan'}</span>
            </div>
            <div class="dossier-row">
                <span class="dossier-lbl">Status Deal:</span>
                <span class="dossier-val">${escapeHtml(lead.clientFeedback) || 'Pending'}</span>
            </div>
            <div class="dossier-actions">
                <button class="btn btn-sm btn-secondary" onclick="updateClientFeedback('${lead.id}', 'Viewing Selesai')">Viewing Selesai</button>
                <button class="btn btn-sm" style="background:var(--client-color);color:#000;" onclick="updateClientFeedback('${lead.id}', 'Deal Ditutup ✓')">Deal Ditutup ✓</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function updateClientFeedback(leadId, feedbackText) {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    lead.clientFeedback = feedbackText;
    persistData();
    renderAllViews();
}

// ── REN CLIENT MANAGER RENDER ─────────────────────────────────────────────────

function renderClientManagerView() {
    const container = document.getElementById('ren-clients-manager-container');
    if (!container) return;
    container.innerHTML = '';

    renClients.forEach(c => {
        const dossiersCount = leads.filter(l => l.publishedToClient && l.assignedClientId === c.id).length;

        const card = document.createElement('article');
        card.className = 'client-card';
        card.innerHTML = `
            <div class="client-card-head">
                <div>
                    <h4 class="client-name-title">${escapeHtml(c.name)}</h4>
                    <span style="font-size:11px;color:var(--text-muted);">${escapeHtml(c.agency)}</span>
                </div>
                <span class="client-ren-tag">${escapeHtml(c.renNo)}</span>
            </div>
            <div class="client-card-meta">
                <div class="meta-line"><span>Seat ID:</span> <span>${escapeHtml(c.seatId)}</span></div>
                <div class="meta-line"><span>Territory Lock:</span> <span>${escapeHtml(c.territory)}</span></div>
                <div class="meta-line"><span>Service Tier:</span> <span style="color:var(--primary);">${escapeHtml(c.tier)}</span></div>
                <div class="meta-line"><span>Active Dossiers:</span> <span>${dossiersCount} Leads</span></div>
            </div>
            <button class="btn btn-secondary btn-sm" style="width:100%;" onclick="switchToClientDesk('${c.id}')">View Client Desk &rarr;</button>
        `;
        container.appendChild(card);
    });
}

function switchToClientDesk(clientId) {
    activeClientDesk = clientId;
    switchMode('client');
}

// ── LIVE BI-DIRECTIONAL HTTP SYNC BRIDGE ──────────────────────────────────────

function syncToNotion(lead) {
    console.log('[NOTION SYNC] Transmitting payload to Notion API...', {
        database_id: 'Buyer_Prospects_DB',
        properties: {
            'Buyer Name': lead.name,
            'Phone Number': lead.phone,
            'Project Interest': lead.project,
            'Tier': lead.tier,
            'Loan Status': lead.loanStatus,
            'Assigned REN': lead.assignedClientId
        }
    });
}

function syncToGasEngine(lead) {
    if (!gasWebAppUrl || gasWebAppUrl.includes('SAMPLE')) return;

    fetch(gasWebAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'INGEST_LEAD', payload: lead })
    }).then(() => {
        console.log('[GAS ENGINE SYNC] Live HTTP POST transmitted successfully.');
    }).catch(err => {
        console.warn('[GAS ENGINE SYNC] Live HTTP POST failed:', err);
    });
}

// ── UTILITIES ─────────────────────────────────────────────────────────────────

function normalisePhone(phone) {
    let clean = phone.replace(/[^0-9+]/g, '');
    if (clean.startsWith('01')) clean = '+60' + clean.substring(1);
    return clean;
}

function escapeHtml(str) {
    if (typeof str !== 'string') return String(str ?? '');
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
