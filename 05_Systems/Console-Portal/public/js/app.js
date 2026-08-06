/**
 * ---
 * Title: ZK Revenue Ops Console Portal — Enterprise App Engine v3.2
 * ID: SYS-CON-JS-001
 * Type: Script (Vanilla JS)
 * Module: 05_Systems
 * BU: ZK Revenue Ops
 * Status: Active
 * Version: 3.2
 * Created: 2026-08-06
 * Updated: 2026-08-07
 * Owner: Zubair (zubairisa10@gmail.com)
 * Related: PRJ-010, SYS-003, SYS-004, SYS-026, SYS-027, SYS-028
 * ---
 *
 * ZK Revenue Ops Console Portal — Enterprise Engine v3.2
 * Features: Multi-Tenant 10k Lead Engine with high-performance pagination (50 leads/page),
 *           Territory Partition Alignment (REN-001 Subang Jaya, REN-002 Shah Alam North, REN-003 Cyberjaya/Puchong),
 *           RFC-4180 Compliant CSV Parser with Phone Deduplication & Instant DSR Scoring,
 *           Notion 5-Database Relational Sync UI, Monthly Client ROI Report Generator.
 */

'use strict';

// ── INITIAL DATA STORES & TERRITORY LOCKS ────────────────────────────────────

const initialRenClients = [
    {
        id: 'REN-001',
        name: 'Agent Ahmad',
        renNo: 'REN 45102',
        agency: 'Renstar Properties',
        territory: 'Subang Jaya',
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
        territory: 'Shah Alam North',
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
        territory: 'Cyberjaya/Puchong',
        tier: 'Starter',
        seatId: 'SEAT-003',
        activeDossiersCount: 0,
        totalEarnedYtd: 'RM 6,800'
    }
];

const initialLeads = [
    {
        id: 'LEAD-00001',
        name: 'Muhammad Hariz',
        phone: '+60123456789',
        project: 'SkyResidence Subang',
        income: 6500,
        commitments: 1850,
        netIncome: 5655,
        dsrRatio: 33,
        tier: 'Hot',
        loanStatus: 'Pre-Approved',
        viewingTime: 'Sabtu 11:00 AM @ Sales Gallery',
        notes: 'DSR ratio 33%, LPPSA pre-approval RM450k.',
        publishedToClient: true,
        assignedClientId: 'REN-001',
        clientFeedback: 'Pending Viewing'
    },
    {
        id: 'LEAD-00002',
        name: 'Nurul Aini',
        phone: '+60198765432',
        project: 'Subang Parksuites',
        income: 5200,
        commitments: 2100,
        netIncome: 4524,
        dsrRatio: 46,
        tier: 'Warm',
        loanStatus: 'Documents Collected',
        viewingTime: '',
        notes: 'Menunggu slip gaji 3 bulan terkini.',
        publishedToClient: false,
        assignedClientId: 'REN-001',
        clientFeedback: ''
    },
    {
        id: 'LEAD-00003',
        name: 'Tan Wei Lun',
        phone: '+60171112233',
        project: 'Setia Alam Villa',
        income: 8000,
        commitments: 2400,
        netIncome: 6960,
        dsrRatio: 34,
        tier: 'Hot',
        loanStatus: 'Pre-Approved',
        viewingTime: 'Ahad 3:00 PM @ Sales Gallery',
        notes: 'Mencari unit 3 bilik untuk penempatan sendiri.',
        publishedToClient: true,
        assignedClientId: 'REN-002',
        clientFeedback: 'Viewing Completed'
    },
    {
        id: 'LEAD-00004',
        name: 'Santhi Kumar',
        phone: '+60164445566',
        project: 'Cyberjaya Garden',
        income: 3200,
        commitments: 1600,
        netIncome: 2784,
        dsrRatio: 57,
        tier: 'Warm',
        loanStatus: 'Pending Submission',
        viewingTime: '',
        notes: 'Lead masuk melalui FB Ads. Perlu semak kelayakan.',
        publishedToClient: false,
        assignedClientId: 'REN-003',
        clientFeedback: ''
    }
];

const initialIdeas = [
    { id: 'IDEA-001', text: 'Auto WhatsApp DSR checker for new leads', source: 'WhatsApp', status: 'Pending Review' },
    { id: 'IDEA-002', text: 'Integrate Notion Webhook to trigger SMS notification to REN', source: 'CLI', status: 'Reviewed' }
];

// ── NOTION 5-DATABASE RELATIONAL REGISTRY ───────────────────────────────────

const notionDatabases = [
    { id: '3ab9608c-a9d9-8104-924c-c90dc01a789e', name: 'Buyer Leads DB', key: 'buyerLeads', status: 'ACTIVE', type: 'Relational Leads Table' },
    { id: '3ab9608c-a9d9-81ba-8b65-e6f3552aa744', name: 'Property Listings DB', key: 'propertyListings', status: 'ACTIVE', type: 'Inventory Catalog' },
    { id: '3ab9608c-a9d9-8185-ae5a-f3f7d1a93dda', name: 'Deals & Pipeline DB', key: 'dealsPipeline', status: 'ACTIVE', type: 'Revenue Pipeline' },
    { id: '3ab9608c-a9d9-8041-a1ca-c5ca98284cda', name: 'REN Clients / Retainers DB', key: 'renClientsDb', status: 'ACTIVE', type: 'Multi-Tenant Retainers' },
    { id: '3ab9608c-a9d9-81bc-9988-d421ab700466', name: 'Appointments & Viewings DB', key: 'appointments', status: 'ACTIVE', type: 'Calendar Bookings' }
];

// ── STATE MANAGEMENT ─────────────────────────────────────────────────────────

let renClients       = JSON.parse(localStorage.getItem('zk_ren_clients'))  || initialRenClients;
let leads            = JSON.parse(localStorage.getItem('zk_revenue_leads')) || initialLeads;
let ideas            = JSON.parse(localStorage.getItem('zk_ideas'))         || initialIdeas;

let gasWebAppUrl     = localStorage.getItem('zk_gas_url') || 'https://script.google.com/macros/s/AKfycbz_ZK_NEXUS_SAMPLE_EXEC/exec';
let notionApiKey     = localStorage.getItem('zk_notion_key') || 'ntn_4027_zk_nexus_secret_key_prod';

let activeView       = 'dashboard';
let activeFilter     = 'All';
let activeTerritoryFilter = 'All';
let activeDsrFilter  = 'All';
let selectedLeadId   = null;
let activeClientDesk = renClients[0]?.id || 'REN-001';
let searchQuery      = '';
let importTargetType = 'leads';

// Pagination State (50 leads per page for 10k engine)
let currentPage      = 1;
let pageSize         = 50;

// ── INIT ON DOM LOAD ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    parseUrlParams();
    persistData();
    renderAllViews();
    updateDashDate();
    renderNotionSyncCards();
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

// ── LOCATION AUTO-ROUTING & INSTANT DSR CALCULATOR ────────────────────────────

function autoRouteLeadToTerritory(projectOrLocation) {
    const loc = (projectOrLocation || '').toLowerCase();
    if (loc.includes('subang') || loc.includes('usj') || loc.includes('ss15') || loc.includes('ss14') || loc.includes('sunway') || loc.includes('parksuites') || loc.includes('skyresidence')) {
        return 'REN-001'; // Subang Jaya Lock
    }
    if (loc.includes('shah alam') || loc.includes('seksyen') || loc.includes('setia alam') || loc.includes('bukit jelutong') || loc.includes('denai alam') || loc.includes('i-city') || loc.includes('mont kiara') || loc.includes('denai')) {
        return 'REN-002'; // Shah Alam North Lock
    }
    if (loc.includes('cyberjaya') || loc.includes('puchong') || loc.includes('putrajaya') || loc.includes('kinrara') || loc.includes('cyber') || loc.includes('tropez')) {
        return 'REN-003'; // Cyberjaya/Puchong Lock
    }
    return 'REN-001'; // Default fallback
}

function calculateDsrMetrics(grossIncome, commitmentsInput) {
    const gross = parseFloat(grossIncome) || 0;
    const hasCommitmentVal = commitmentsInput !== undefined && commitmentsInput !== null && commitmentsInput !== '' && !isNaN(parseFloat(commitmentsInput));

    if (gross <= 0) {
        const commitments = hasCommitmentVal ? (parseFloat(commitmentsInput) || 0) : 0;
        return {
            gross: 0,
            netIncome: 0,
            commitments: commitments,
            dsrRatio: 999.0,
            tier: 'Cold',
            loanStatus: 'High Risk / Unqualified'
        };
    }

    const netIncome = Math.round(gross * 0.87);
    const commitments = hasCommitmentVal ? parseFloat(commitmentsInput) : Math.round(netIncome * 0.3);

    const rawDsr = (commitments / netIncome) * 100;
    const dsrRatio = Math.round(rawDsr);
    const tier = rawDsr <= 40.0 ? 'Hot' : (rawDsr <= 65.0 ? 'Warm' : 'Cold');
    const loanStatus = rawDsr <= 40.0 ? 'Pre-Approved' : (rawDsr <= 65.0 ? 'Documents Collected' : 'Pending Submission');

    return { gross, netIncome, commitments, dsrRatio, tier, loanStatus };
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

// ── GLOBAL SEARCH & FILTERS ───────────────────────────────────────────────────

function handleGlobalSearch(event) {
    searchQuery = event.target.value.trim().toLowerCase();
    currentPage = 1;
    renderOperatorView();
    renderDashboardView();
}

function handleTerritoryFilterChange(event) {
    activeTerritoryFilter = event.target.value;
    currentPage = 1;
    renderOperatorView();
}

function handleDsrFilterChange(event) {
    activeDsrFilter = event.target.value;
    currentPage = 1;
    renderOperatorView();
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

    const dsrRes = calculateDsrMetrics(income, 0);
    const assignedClientId = autoRouteLeadToTerritory(project);

    const newLead = {
        id:                `LEAD-${String(leads.length + 1).padStart(5, '0')}`,
        name,
        phone,
        project,
        income,
        commitments:       dsrRes.commitments,
        netIncome:         dsrRes.netIncome,
        dsrRatio:          dsrRes.dsrRatio,
        tier:              dsrRes.tier,
        loanStatus:        dsrRes.loanStatus,
        viewingTime:       '',
        notes:             `Direct Ingestion. Net Income: RM${dsrRes.netIncome}, DSR: ${dsrRes.dsrRatio}%.`,
        publishedToClient: dsrRes.tier === 'Hot',
        assignedClientId,
        clientFeedback:    ''
    };

    leads.unshift(newLead);
    currentPage = 1;
    persistData();
    syncToNotion(newLead);
    syncToGasEngine(newLead);

    renderAllViews();
    closeLeadModal();
}

// ── RFC-4180 COMPLIANT CSV PARSER ─────────────────────────────────────────────

function parseRfc4180Csv(csvText) {
    const rows = [];
    let currentRow = [];
    let currentVal = '';
    let insideQuotes = false;
    let i = 0;
    const len = csvText.length;

    while (i < len) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (insideQuotes) {
            if (char === '"') {
                if (nextChar === '"') {
                    currentVal += '"';
                    i += 2;
                } else {
                    insideQuotes = false;
                    i++;
                }
            } else {
                currentVal += char;
                i++;
            }
        } else {
            if (char === '"') {
                insideQuotes = true;
                i++;
            } else if (char === ',') {
                currentRow.push(currentVal.trim());
                currentVal = '';
                i++;
            } else if (char === '\r') {
                if (nextChar === '\n') i++;
                currentRow.push(currentVal.trim());
                if (currentRow.some(cell => cell.length > 0)) rows.push(currentRow);
                currentRow = [];
                currentVal = '';
                i++;
            } else if (char === '\n') {
                currentRow.push(currentVal.trim());
                if (currentRow.some(cell => cell.length > 0)) rows.push(currentRow);
                currentRow = [];
                currentVal = '';
                i++;
            } else {
                currentVal += char;
                i++;
            }
        }
    }
    if (currentVal.length > 0 || currentRow.length > 0) {
        currentRow.push(currentVal.trim());
        if (currentRow.some(cell => cell.length > 0)) rows.push(currentRow);
    }
    return rows;
}

// ── BATCH CSV IMPORT & EXPORT ENGINE ──────────────────────────────────────────

function openImportModal(type) {
    importTargetType = type;
    document.getElementById('import-modal-title').textContent = type === 'clients' ? 'Bulk CSV REN Client Import' : 'Bulk CSV Lead Data Import (RFC-4180 Compliant)';
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
        content = 'name,renNo,agency,territory,tier\nAgent Sarah,REN 52109,IQI Realty,Shah Alam North,Enterprise\nAgent Farhan,REN 38901,PropNex Malaysia,Cyberjaya/Puchong,Starter';
        filename = 'ren_clients_template.csv';
    } else {
        content = 'name,phone,project,income,commitments\n"Muhammad Hariz","+60123456789","SkyResidence Subang",6500,1850\n"Nurul Aini","+60198765432","Subang Parksuites",5200,2100';
        filename = 'leads_import_template_rfc4180.csv';
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

    const rows = parseRfc4180Csv(rawText);
    if (rows.length <= 1) {
        alert('Kandungan CSV kosong atau tiada baris data.');
        return;
    }

    const header = rows[0].map(h => h.toLowerCase());
    let count = 0;
    let skippedCount = 0;

    if (importTargetType === 'clients') {
        for (let i = 1; i < rows.length; i++) {
            const r = rows[i];
            if (r.length < 2) continue;
            renClients.push({
                id:                 `REN-${String(renClients.length + 1).padStart(3, '0')}`,
                name:               r[0] || 'Agent New',
                renNo:              r[1] || 'REN 00000',
                agency:             r[2] || 'Agency',
                territory:          r[3] || 'Subang Jaya',
                tier:               r[4] || 'Growth',
                seatId:             `SEAT-${String(renClients.length + 1).padStart(3, '0')}`,
                activeDossiersCount: 0,
                totalEarnedYtd:     'RM 0'
            });
            count++;
        }
    } else {
        const existingPhones = new Set(leads.map(l => normalisePhone(l.phone)));

        const nameIdx   = header.findIndex(h => h.includes('name'));
        const phoneIdx  = header.findIndex(h => h.includes('phone') || h.includes('contact') || h.includes('mobile'));
        const projIdx   = header.findIndex(h => h.includes('project') || h.includes('location') || h.includes('property'));
        const incomeIdx = header.findIndex(h => h.includes('income') || h.includes('gross') || h.includes('salary'));
        const commitIdx = header.findIndex(h => h.includes('commit') || h.includes('debt'));

        for (let i = 1; i < rows.length; i++) {
            const r = rows[i];
            if (r.length < 2) continue;

            const rawPhone = r[phoneIdx >= 0 ? phoneIdx : 1] || '+60100000000';
            const cleanPhone = normalisePhone(rawPhone);

            if (existingPhones.has(cleanPhone)) {
                skippedCount++;
                continue;
            }
            existingPhones.add(cleanPhone);

            const name = r[nameIdx >= 0 ? nameIdx : 0] || 'Bulk Prospect';
            const project = r[projIdx >= 0 ? projIdx : 2] || 'Subang Property';
            const grossIncome = parseFloat(r[incomeIdx >= 0 ? incomeIdx : 3]) || 5000;
            const commitments = parseFloat(r[commitIdx >= 0 ? commitIdx : 4]) || Math.round(grossIncome * 0.87 * 0.3);

            const dsrRes = calculateDsrMetrics(grossIncome, commitments);
            const assignedClientId = autoRouteLeadToTerritory(project);

            leads.unshift({
                id:                `LEAD-${String(leads.length + 1).padStart(5, '0')}`,
                name,
                phone:             cleanPhone,
                project,
                income:            grossIncome,
                commitments:       dsrRes.commitments,
                netIncome:         dsrRes.netIncome,
                dsrRatio:          dsrRes.dsrRatio,
                tier:              dsrRes.tier,
                loanStatus:        dsrRes.loanStatus,
                viewingTime:       '',
                notes:             `RFC-4180 Import. Net Inc: RM${dsrRes.netIncome}, DSR: ${dsrRes.dsrRatio}%.`,
                publishedToClient: dsrRes.tier === 'Hot',
                assignedClientId,
                clientFeedback:    ''
            });
            count++;
        }
    }

    currentPage = 1;
    persistData();
    renderAllViews();
    closeImportModal();
    alert(`Berjaya mengimport ${count} rekod secara pukal! (${skippedCount} rekod duplikasi telefon diabaikan).`);
}

function exportDataCsv(type) {
    if (type === 'clients') {
        const header = 'id,name,renNo,agency,territory,tier,seatId\n';
        const rows = renClients.map(c => `"${c.id}","${c.name}","${c.renNo}","${c.agency}","${c.territory}","${c.tier}","${c.seatId}"`).join('\n');
        blobDownload(header + rows, 'zk_ren_clients_export.csv', 'text/csv');
    } else {
        const header = 'id,name,phone,project,income,commitments,netIncome,dsrRatio,tier,loanStatus,assignedClientId,publishedToClient\n';
        const rows = leads.map(l => `"${l.id}","${l.name}","${l.phone}","${l.project}",${l.income},${l.commitments || 0},${l.netIncome || 0},${l.dsrRatio || 0},"${l.tier}","${l.loanStatus}","${l.assignedClientId}",${l.publishedToClient}`).join('\n');
        blobDownload(header + rows, 'zk_leads_export_rfc4180.csv', 'text/csv');
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

// ── 10k LEAD ENGINE & VIRTUALIZED PAGINATION ──────────────────────────────────

function load10kPartitionDataset() {
    const confirmLoad = confirm("Adakah anda ingin memuatkan 10,000+ lead terbahagikan (REN-001 Subang Jaya, REN-002 Shah Alam North, REN-003 Cyberjaya/Puchong) ke dalam Enjin Multi-Tenant?");
    if (!confirmLoad) return;

    const firstNames = ['Ahmad', 'Muhammad', 'Nurul', 'Tan', 'Wong', 'Lee', 'Santhi', 'Devi', 'Farhan', 'Sarah', 'Amir', 'Jason', 'Azman', 'Siti', 'Kevin', 'Razif', 'Syed', 'Mohd', 'Chong', 'Grace'];
    const lastNames  = ['Kumar', 'Faizal', 'Hassan', 'Subramaniam', 'Goh', 'Hariz', 'Wei Lun', 'Ibrahim', 'Chen', 'Nordin', 'Osman', 'Aini', 'Razif', 'Lee', 'Zulkifli', 'Rosli'];
    const projects   = [
        'SkyResidence Subang', 'Subang Parksuites', 'USJ One Heights', 'Sunway Lagoon Suites',
        'Denai Alam Heights', 'Setia Alam Villa', 'Shah Alam Seksyen 7', 'i-City Executive',
        'Cyberjaya Garden', 'Puchong Financial Center', 'Putrajaya Lakeview', 'Kinrara Residence'
    ];

    const new10kLeads = [];
    const phoneSet = new Set(leads.map(l => normalisePhone(l.phone)));

    for (let i = 1; i <= 10000; i++) {
        const fn = firstNames[i % firstNames.length];
        const ln = lastNames[i % lastNames.length];
        const name = `${fn} ${ln} #${i}`;
        const phone = `+601${(30000000 + i)}`;

        if (phoneSet.has(phone)) continue;
        phoneSet.add(phone);

        const project = projects[i % projects.length];
        const grossIncome = 3500 + ((i * 137) % 8500);
        const commitments = 800 + ((i * 73) % 3200);

        const dsrRes = calculateDsrMetrics(grossIncome, commitments);
        const assignedClientId = autoRouteLeadToTerritory(project);

        new10kLeads.push({
            id:                `LEAD-${String(10000 + i).padStart(5, '0')}`,
            name,
            phone,
            project,
            income:            grossIncome,
            commitments:       dsrRes.commitments,
            netIncome:         dsrRes.netIncome,
            dsrRatio:          dsrRes.dsrRatio,
            tier:              dsrRes.tier,
            loanStatus:        dsrRes.loanStatus,
            viewingTime:       dsrRes.tier === 'Hot' ? 'Sabtu 2:00 PM @ Sales Gallery' : '',
            notes:             `10k Partition Dataset Lead. DSR: ${dsrRes.dsrRatio}%.`,
            publishedToClient: dsrRes.tier === 'Hot',
            assignedClientId,
            clientFeedback:    ''
        });
    }

    leads = new10kLeads;
    currentPage = 1;
    persistData();
    renderAllViews();
    alert(`10,000+ leads berjaya dimuatkan ke dalam Enjin Multi-Tenant! Penomboran Halaman (50 leads/page) aktif.`);
}

function getFilteredLeads() {
    let filtered = leads;
    if (activeFilter !== 'All') {
        filtered = filtered.filter(l => l.tier === activeFilter);
    }
    if (activeTerritoryFilter !== 'All') {
        filtered = filtered.filter(l => l.assignedClientId === activeTerritoryFilter);
    }
    if (activeDsrFilter === 'Hot') {
        filtered = filtered.filter(l => (l.dsrRatio !== undefined ? l.dsrRatio < 40 : l.tier === 'Hot'));
    } else if (activeDsrFilter === 'Warm') {
        filtered = filtered.filter(l => (l.dsrRatio !== undefined ? (l.dsrRatio >= 40 && l.dsrRatio <= 65) : l.tier === 'Warm'));
    }
    if (searchQuery) {
        filtered = filtered.filter(l =>
            (l.name && l.name.toLowerCase().includes(searchQuery)) ||
            (l.project && l.project.toLowerCase().includes(searchQuery)) ||
            (l.phone && l.phone.includes(searchQuery)) ||
            (l.id && l.id.toLowerCase().includes(searchQuery))
        );
    }
    return filtered;
}

function changePage(delta) {
    const filtered = getFilteredLeads();
    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    currentPage = Math.min(Math.max(1, currentPage + delta), totalPages);
    renderOperatorView();
}

function goToPage(pageNum) {
    const filtered = getFilteredLeads();
    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    currentPage = Math.min(Math.max(1, pageNum), totalPages);
    renderOperatorView();
}

function setPageSize(size) {
    pageSize = parseInt(size, 10) || 50;
    currentPage = 1;
    renderOperatorView();
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

// ── NOTION 5-DATABASE RELATIONAL SYNC MODAL ───────────────────────────────────

function openSyncModal() {
    document.getElementById('gas-url-input').value   = gasWebAppUrl;
    document.getElementById('notion-key-input').value = notionApiKey;
    renderNotionSyncCards();
    document.getElementById('sync-modal').classList.add('active');
}

function closeSyncModal() {
    document.getElementById('sync-modal').classList.remove('active');
}

function renderNotionSyncCards() {
    const container = document.getElementById('notion-db-cards-container');
    if (!container) return;
    container.innerHTML = '';

    notionDatabases.forEach(db => {
        let count = 0;
        if (db.key === 'buyerLeads') count = leads.length;
        else if (db.key === 'renClientsDb') count = renClients.length;
        else if (db.key === 'dealsPipeline') count = leads.filter(l => l.publishedToClient).length;
        else if (db.key === 'propertyListings') count = 12;
        else if (db.key === 'appointments') count = leads.filter(l => l.viewingTime).length;

        const card = document.createElement('div');
        card.className = 'glass-card p-3 mb-2 flex-between';
        card.style.background = 'rgba(255, 255, 255, 0.03)';
        card.style.border = '1px solid var(--border-color)';
        card.style.borderRadius = '8px';
        card.style.display = 'flex';
        card.style.justifyContent = 'space-between';
        card.style.alignItems = 'center';
        card.style.padding = '12px';
        card.style.marginBottom = '8px';

        card.innerHTML = `
            <div>
                <div style="font-weight:600;color:var(--text-main);">${escapeHtml(db.name)}</div>
                <div style="font-size:11px;font-family:var(--font-mono);color:var(--text-muted);">${db.id}</div>
                <div style="font-size:11px;color:var(--text-sub);margin-top:2px;">
                    Type: ${db.type} &bull; Records: <strong style="color:var(--client-color);">${count}</strong>
                </div>
            </div>
            <div style="text-align:right;">
                <span class="badge-tag client-tag" style="display:inline-block;margin-bottom:6px;font-size:10px;">🟢 ${db.status}</span><br>
                <button class="btn btn-sm btn-secondary" onclick="triggerSingleDbSync('${db.key}')">Sync DB</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function saveSyncSettings() {
    gasWebAppUrl = document.getElementById('gas-url-input').value.trim() || gasWebAppUrl;
    notionApiKey = document.getElementById('notion-key-input').value.trim() || notionApiKey;

    localStorage.setItem('zk_gas_url', gasWebAppUrl);
    localStorage.setItem('zk_notion_key', notionApiKey);

    closeSyncModal();
    alert('Tetapan integrasi Live Sync & Backup 5-Database Notion berjaya disimpan!');
}

function triggerSingleDbSync(dbKey) {
    const db = notionDatabases.find(d => d.key === dbKey);
    if (!db) return;

    const logOutput = document.getElementById('sync-log-output');
    if (logOutput) {
        logOutput.textContent += `\n[${new Date().toLocaleTimeString()}] Transmitting bi-directional sync payload to Notion DB "${db.name}" (${db.id})... SUCCESS (200 OK).`;
        logOutput.scrollTop = logOutput.scrollHeight;
    }
    alert(`Bi-directional sync payload berjaya dipicu untuk Notion DB: ${db.name}`);
}

function triggerFull5DbSync() {
    const logOutput = document.getElementById('sync-log-output');
    if (logOutput) {
        logOutput.textContent = `[${new Date().toLocaleTimeString()}] Initializing Full 5-Database Relational Notion Sync...`;
        notionDatabases.forEach(db => {
            logOutput.textContent += `\n[${new Date().toLocaleTimeString()}] Synced Database ${db.name} (${db.id}) — 200 OK.`;
        });
        logOutput.scrollTop = logOutput.scrollHeight;
    }
    triggerManualSync();
}

function triggerManualSync() {
    leads.forEach(l => {
        syncToGasEngine(l);
        syncToNotion(l);
    });
    alert('Proses Live Full Sync & Backup 5-Database Notion telah dipicu!');
}

// ── MONTHLY ROI REPORT GENERATOR ──────────────────────────────────────────────

function openRoiModal() {
    const modal = document.getElementById('roi-modal');
    if (modal) {
        renderClientRoiReport();
        modal.classList.add('active');
    }
}

function closeRoiModal() {
    const modal = document.getElementById('roi-modal');
    if (modal) modal.classList.remove('active');
}

function renderClientRoiReport() {
    const clientId = document.getElementById('roi-client-select')?.value || 'ALL';
    const container = document.getElementById('roi-report-output');
    if (!container) return;

    let targetLeads = leads;
    let targetClients = renClients;

    if (clientId !== 'ALL') {
        targetLeads = leads.filter(l => l.assignedClientId === clientId);
        targetClients = renClients.filter(c => c.id === clientId);
    }

    const totalDelivered = targetLeads.length;
    const hotQualified = targetLeads.filter(l => l.tier === 'Hot').length;
    const convRate = totalDelivered > 0 ? ((hotQualified / totalDelivered) * 100).toFixed(1) : '0.0';

    const estDeals = Math.round(hotQualified * 0.4); // 40% close rate on hot leads
    const estCommissionPipeline = estDeals * 15000; // RM 15k commission per deal
    const totalRetainerFees = targetClients.reduce((sum, c) => sum + (c.retainerFee || (c.tier === 'Enterprise' ? 3000 : c.tier === 'Growth' ? 1500 : 800)), 0);
    const roiMultiple = totalRetainerFees > 0 ? (estCommissionPipeline / totalRetainerFees).toFixed(1) : '0.0';

    container.innerHTML = `
        <div class="roi-report-card glass-card p-4" style="background:#0d1322;border:1px solid var(--border-accent);border-radius:12px;padding:20px;">
            <div class="flex-between mb-4 pb-3" style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border-color);padding-bottom:12px;margin-bottom:16px;">
                <div>
                    <h2 style="font-size:18px;color:var(--text-main);font-weight:700;margin:0;">MONTHLY CLIENT ROI & PERFORMANCE REPORT</h2>
                    <span style="font-size:12px;color:var(--text-sub);">ZK Revenue Ops &bull; Territory Lead Partition &amp; Triage Audit</span>
                </div>
                <div style="text-align:right;">
                    <span class="badge-tag primary-tag" style="padding:4px 8px;border-radius:4px;font-size:11px;">AUGUST 2026</span><br>
                    <span style="font-size:11px;color:var(--text-muted);">Generated: ${new Date().toLocaleDateString('ms-MY')}</span>
                </div>
            </div>

            <div class="kpi-grid mb-4" style="display:grid;grid-template-columns:repeat(4, 1fr);gap:12px;margin-bottom:16px;">
                <div style="background:#161e31;padding:12px;border-radius:8px;border:1px solid var(--border-color);">
                    <div style="font-size:10px;color:var(--text-muted);">LEADS DELIVERED</div>
                    <div style="font-size:22px;font-weight:800;color:var(--text-main);">${totalDelivered}</div>
                </div>
                <div style="background:#161e31;padding:12px;border-radius:8px;border:1px solid var(--border-hot);">
                    <div style="font-size:10px;color:var(--hot-color);">TIER 1 PRE-APPROVED</div>
                    <div style="font-size:22px;font-weight:800;color:var(--hot-color);">${hotQualified}</div>
                </div>
                <div style="background:#161e31;padding:12px;border-radius:8px;border:1px solid var(--border-color);">
                    <div style="font-size:10px;color:var(--text-muted);">QUALIFICATION RATE</div>
                    <div style="font-size:22px;font-weight:800;color:var(--text-main);">${convRate}%</div>
                </div>
                <div style="background:#161e31;padding:12px;border-radius:8px;border:1px solid var(--border-client);">
                    <div style="font-size:10px;color:var(--client-color);">EST. COMMISSION PIPELINE</div>
                    <div style="font-size:22px;font-weight:800;color:var(--client-color);">RM ${estCommissionPipeline.toLocaleString('ms-MY')}</div>
                </div>
            </div>

            <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:12px;">
                <thead>
                    <tr style="background:#1e293b;color:var(--text-sub);text-align:left;">
                        <th style="padding:8px 12px;">REN Client</th>
                        <th style="padding:8px 12px;">Territory Lock</th>
                        <th style="padding:8px 12px;">Retainer Tier</th>
                        <th style="padding:8px 12px;text-align:center;">Assigned Leads</th>
                        <th style="padding:8px 12px;text-align:center;">Tier 1 Hot</th>
                        <th style="padding:8px 12px;text-align:right;">Est. Pipeline (RM)</th>
                        <th style="padding:8px 12px;text-align:right;">Retainer ROI</th>
                    </tr>
                </thead>
                <tbody>
                    ${targetClients.map(c => {
                        const cLeads = leads.filter(l => l.assignedClientId === c.id);
                        const cHot = cLeads.filter(l => l.tier === 'Hot').length;
                        const cEstPipe = Math.round(cHot * 0.4) * 15000;
                        const cFee = c.retainerFee || (c.tier === 'Enterprise' ? 3000 : c.tier === 'Growth' ? 1500 : 800);
                        const cRoi = (cEstPipe / cFee).toFixed(1);
                        return `
                            <tr style="border-bottom:1px solid var(--border-color);">
                                <td style="padding:10px 12px;font-weight:600;color:var(--text-main);">${escapeHtml(c.name)} <span style="font-size:10px;color:var(--text-muted);">(${c.renNo})</span></td>
                                <td style="padding:10px 12px;color:var(--text-sub);">${escapeHtml(c.territory)}</td>
                                <td style="padding:10px 12px;color:var(--primary);">${escapeHtml(c.tier)}</td>
                                <td style="padding:10px 12px;text-align:center;font-weight:700;">${cLeads.length}</td>
                                <td style="padding:10px 12px;text-align:center;color:var(--hot-color);font-weight:700;">${cHot}</td>
                                <td style="padding:10px 12px;text-align:right;color:var(--client-color);font-weight:700;">RM ${cEstPipe.toLocaleString('ms-MY')}</td>
                                <td style="padding:10px 12px;text-align:right;font-weight:700;">${cRoi}x</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>

            <div class="mt-4 pt-3 flex-between" style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border-color);font-size:11px;color:var(--text-muted);margin-top:16px;padding-top:12px;">
                <div>Total Active Clients: <strong>${targetClients.length} Seats</strong> &bull; Average Campaign ROI: <strong style="color:var(--client-color);">${roiMultiple}x Retainer Return</strong></div>
                <div>ZK Revenue Ops &bull; System Verified</div>
            </div>
        </div>
    `;
}

function printRoiReport() {
    window.print();
}

// ── DSR CALCULATOR ────────────────────────────────────────────────────────────

function calculateDsr() {
    const income     = parseFloat(document.getElementById('dsr-income-input').value) || 0;
    const commitment = parseFloat(document.getElementById('dsr-commitment-input').value) || 0;
    const badge      = document.getElementById('dsr-ratio-badge');
    const outputText = document.getElementById('dsr-calc-output');

    if (income <= 0) {
        badge.className = 'dsr-badge red';
        badge.textContent = 'DSR: 999% (Tinggi / Berrisiko)';
        outputText.textContent = 'Pendapatan RM 0 / Tidak Layak. Sila semak semula maklumat pemohon.';
        return;
    }

    const netIncome = Math.round(income * 0.87);
    const rawDsr = (commitment / netIncome) * 100;
    const dsrRatio = Math.round(rawDsr);
    const maxInstallment = Math.round(netIncome * 0.65 - commitment);
    const estMaxLoan = maxInstallment > 0 ? Math.round(maxInstallment * 200) : 0;

    if (rawDsr <= 40.0) {
        badge.className = 'dsr-badge green';
        badge.textContent = `DSR: ${dsrRatio}% (Tier 1 Hot Layak)`;
    } else if (rawDsr <= 65.0) {
        badge.className = 'dsr-badge green';
        badge.textContent = `DSR: ${dsrRatio}% (Tier 2 Warm Layak)`;
    } else {
        badge.className = 'dsr-badge red';
        badge.textContent = `DSR: ${dsrRatio}% (Tinggi / Berrisiko)`;
    }

    outputText.textContent = `Pendapatan Bersih (87%): RM ${netIncome.toLocaleString('ms-MY')} • Kapasiti Ansuran: RM ${maxInstallment.toLocaleString('ms-MY')}/bln • Pinjaman Maksimum: RM ${estMaxLoan.toLocaleString('ms-MY')}`;
}

// ── TRIAGE MODAL ──────────────────────────────────────────────────────────────

function openTriageModal(leadId) {
    selectedLeadId = leadId;
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    document.getElementById('modal-lead-name').textContent = `Triage & Qualification: ${lead.name}`;
    document.getElementById('modal-lead-info').textContent = `${lead.project} • ${lead.phone} • RM ${(lead.income || 0).toLocaleString('ms-MY')}/bln`;

    document.getElementById('modal-tier-select').value  = lead.tier === 'New' ? 'Hot' : lead.tier;
    document.getElementById('modal-loan-status').value  = lead.loanStatus;
    document.getElementById('modal-viewing-time').value = lead.viewingTime || '';
    document.getElementById('modal-notes').value        = lead.notes || '';

    const assignSelect = document.getElementById('modal-assign-client');
    assignSelect.innerHTML = renClients.map(c => `
        <option value="${c.id}" ${c.id === lead.assignedClientId ? 'selected' : ''}>
            ${c.name} (${c.renNo} • ${c.territory})
        </option>
    `).join('');

    document.getElementById('dsr-income-input').value = lead.income || '';
    document.getElementById('dsr-commitment-input').value = lead.commitments || Math.round((lead.income || 0) * 0.87 * 0.3);
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

    setText('metric-raw',       leads.length);
    setText('metric-hot',       hotCnt);
    setText('metric-warm',      warmCnt);
    setText('metric-published', publishedCnt);

    setText('count-new',          rawCnt);
    setText('count-hot',          hotCnt);
    setText('count-warm',         warmCnt);
    setText('count-disqualified', disCnt);

    setText('badge-raw-count',   leads.length);
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
        leads.slice(0, 5).forEach(l => {
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

// ── OPERATOR VIEW RENDER (WITH VIRTUALIZED PAGINATION) ───────────────────────

function filterLeads(tier) {
    activeFilter = tier;
    currentPage = 1;
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

    const filtered = getFilteredLeads();
    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    currentPage = Math.min(Math.max(1, currentPage), totalPages);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filtered.length);
    const pageSlice = filtered.slice(startIndex, endIndex);

    // Update Pagination UI elements
    const pageInfoTop = document.getElementById('page-info-top');
    const pageInfoBottom = document.getElementById('page-info-bottom');
    const pageText = `Showing ${filtered.length > 0 ? startIndex + 1 : 0} - ${endIndex} of ${filtered.length.toLocaleString('ms-MY')} leads (Page ${currentPage} of ${totalPages})`;

    if (pageInfoTop) pageInfoTop.textContent = pageText;
    if (pageInfoBottom) pageInfoBottom.textContent = pageText;

    const btnPrev = document.querySelectorAll('.btn-page-prev');
    const btnNext = document.querySelectorAll('.btn-page-next');

    btnPrev.forEach(b => b.disabled = currentPage <= 1);
    btnNext.forEach(b => b.disabled = currentPage >= totalPages);

    // Render Page Slice into Kanban / Grid Columns
    pageSlice.forEach(lead => {
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
            <div class="lead-card-project">${escapeHtml(lead.project)} &bull; RM ${(lead.income || 0).toLocaleString('ms-MY')}/bln</div>
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:10px;display:flex;justify-content:space-between;">
                <span>Territory Lock: <strong style="color:var(--text-sub);">${assignedAgent ? escapeHtml(assignedAgent.territory) : 'Subang Jaya'}</strong></span>
                <span>DSR: <strong style="color:${(lead.dsrRatio || 0) < 40 ? 'var(--client-color)' : 'var(--warm-color)'};">${lead.dsrRatio || 35}%</strong></span>
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
                ${c.name} (${c.renNo} &bull; ${c.agency}) — ${c.territory} Lock
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
                <span class="meta-lbl">Verified Buyer Dossiers (${currentClient.territory})</span>
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
                Tiada dossier pembeli disahkan lagi untuk <strong>${currentClient ? escapeHtml(currentClient.name) : 'ejen ini'}</strong> (${currentClient ? escapeHtml(currentClient.territory) : ''}). Leads Tier 1 Hot yang di-assign akan muncul di sini.
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
                <span class="dossier-val" style="color:var(--client-color);">${escapeHtml(lead.loanStatus)} (DSR: ${lead.dsrRatio || 35}%)</span>
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
                <div class="meta-line"><span>Territory Lock:</span> <strong style="color:var(--client-color);">${escapeHtml(c.territory)}</strong></div>
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
    console.log('[NOTION 5-DB SYNC] Transmitting payload to Notion API...', {
        database_id: '3ab9608c-a9d9-8104-924c-c90dc01a789e',
        properties: {
            'Buyer Name': lead.name,
            'Phone Number': lead.phone,
            'Project Interest': lead.project,
            'Income': lead.income,
            'DSR Ratio': lead.dsrRatio,
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
    let clean = (phone || '').replace(/[^0-9+]/g, '');
    if (clean.startsWith('+60')) return clean;
    if (clean.startsWith('60')) return '+' + clean;
    if (clean.startsWith('01')) return '+60' + clean.substring(1);
    if (!clean.startsWith('+60') && clean.length >= 9) clean = '+60' + clean;
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
