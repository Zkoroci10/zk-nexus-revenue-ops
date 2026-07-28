// ZK Revenue Ops Dual Interface Engine (Minimalist Clean JS)

const initialLeads = [
    {
        id: "LEAD-001",
        name: "Muhammad Hariz",
        phone: "+60123456789",
        project: "SkyResidence Subang",
        income: 6500,
        tier: "Hot",
        loanStatus: "Pre-Approved",
        viewingTime: "Saturday 11:00 AM @ Sales Gallery",
        notes: "DSR ratio clean, pre-approved LPPSA loan RM450k.",
        publishedToClient: true,
        clientFeedback: "Pending Viewing"
    },
    {
        id: "LEAD-002",
        name: "Nurul Aini",
        phone: "+60198765432",
        project: "Subang Parksuites",
        income: 5200,
        tier: "Warm",
        loanStatus: "Documents Collected",
        viewingTime: "",
        notes: "Waiting for latest 3-month payslip.",
        publishedToClient: false,
        clientFeedback: ""
    },
    {
        id: "LEAD-003",
        name: "Tan Wei Lun",
        phone: "+60171112233",
        project: "SkyResidence Subang",
        income: 8000,
        tier: "Hot",
        loanStatus: "Pre-Approved",
        viewingTime: "Sunday 3:00 PM @ Sales Gallery",
        notes: "Looking for 3-bedroom unit for own stay.",
        publishedToClient: true,
        clientFeedback: "Viewing Completed"
    },
    {
        id: "LEAD-004",
        name: "Santhi Kumar",
        phone: "+60164445566",
        project: "Subang Parksuites",
        income: 3200,
        tier: "New",
        loanStatus: "Pending Submission",
        viewingTime: "",
        notes: "Lead ingested via FB Ads. Needs DSR check.",
        publishedToClient: false,
        clientFeedback: ""
    }
];

let leads = JSON.parse(localStorage.getItem("zk_revenue_leads")) || initialLeads;
let selectedLeadId = null;

document.addEventListener("DOMContentLoaded", () => {
    saveLeadsToStorage();
    renderAllViews();
});

function saveLeadsToStorage() {
    localStorage.setItem("zk_revenue_leads", JSON.stringify(leads));
}

function switchMode(mode) {
    document.getElementById("btn-operator-mode").classList.toggle("active", mode === "operator");
    document.getElementById("btn-client-mode").classList.toggle("active", mode === "client");

    document.getElementById("view-operator").classList.toggle("active", mode === "operator");
    document.getElementById("view-client").classList.toggle("active", mode === "client");

    renderAllViews();
}

function handleNewLead(event) {
    event.preventDefault();
    const name = document.getElementById("lead-name").value.trim();
    const phone = document.getElementById("lead-phone").value.trim();
    const project = document.getElementById("lead-project").value.trim();
    const income = parseFloat(document.getElementById("lead-income").value) || 0;

    const newLead = {
        id: `LEAD-${String(leads.length + 1).padStart(3, '0')}`,
        name: name,
        phone: formatPhone(phone),
        project: project,
        income: income,
        tier: "New",
        loanStatus: "Pending Submission",
        viewingTime: "",
        notes: "Raw lead ingested into Console Operator Hub.",
        publishedToClient: false,
        clientFeedback: ""
    };

    leads.unshift(newLead);
    saveLeadsToStorage();
    renderAllViews();

    document.getElementById("add-lead-form").reset();
}

function formatPhone(phone) {
    let clean = phone.replace(/[^0-9+]/g, '');
    if (clean.startsWith('01')) {
        clean = '+60' + clean.substring(1);
    }
    return clean;
}

function renderAllViews() {
    renderOperatorView();
    renderClientView();
    updateMetrics();
}

function updateMetrics() {
    document.getElementById("metric-raw").textContent = leads.filter(l => l.tier === "New").length;
    document.getElementById("metric-hot").textContent = leads.filter(l => l.tier === "Hot").length;
    document.getElementById("metric-warm").textContent = leads.filter(l => l.tier === "Warm").length;
    document.getElementById("metric-published").textContent = leads.filter(l => l.publishedToClient).length;

    document.getElementById("count-new").textContent = leads.filter(l => l.tier === "New").length;
    document.getElementById("count-hot").textContent = leads.filter(l => l.tier === "Hot").length;
    document.getElementById("count-warm").textContent = leads.filter(l => l.tier === "Warm").length;
    document.getElementById("count-disqualified").textContent = leads.filter(l => l.tier === "Disqualified").length;

    document.getElementById("client-dossier-count").textContent = leads.filter(l => l.publishedToClient).length;
}

function renderOperatorView() {
    const containers = {
        "New": document.getElementById("container-new"),
        "Hot": document.getElementById("container-hot"),
        "Warm": document.getElementById("container-warm"),
        "Disqualified": document.getElementById("container-disqualified")
    };

    Object.values(containers).forEach(c => c.innerHTML = "");

    leads.forEach(lead => {
        const card = document.createElement("div");
        card.className = "lead-card";

        const cleanWaPhone = lead.phone.replace(/[^0-9]/g, '');
        const waText = encodeURIComponent(`Salam ${lead.name}, saya wakil dari ZK Revenue Ops berkenaan projek ${lead.project}. Boleh saya bantu semak kelayakan awal?`);
        const waUrl = `https://wa.me/${cleanWaPhone}?text=${waText}`;

        card.innerHTML = `
            <div class="lead-header">
                <span class="lead-name">${lead.name}</span>
                <span class="lead-phone">${lead.phone}</span>
            </div>
            <div class="lead-project">${lead.project} • RM ${lead.income.toLocaleString()}/mo</div>
            <div class="lead-actions">
                <a href="${waUrl}" target="_blank" class="btn btn-sm btn-wa">WhatsApp</a>
                <button class="btn btn-sm btn-secondary" onclick="openTriageModal('${lead.id}')">Triage & Notes</button>
            </div>
        `;

        if (containers[lead.tier]) {
            containers[lead.tier].appendChild(card);
        } else {
            containers["New"].appendChild(card);
        }
    });
}

function renderClientView() {
    const container = document.getElementById("client-dossier-container");
    container.innerHTML = "";

    const publishedLeads = leads.filter(l => l.publishedToClient);

    if (publishedLeads.length === 0) {
        container.innerHTML = `
            <div class="glass-card" style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">
                No verified buyer dossiers published yet. Qualified Tier 1 leads will appear here.
            </div>
        `;
        return;
    }

    publishedLeads.forEach(lead => {
        const card = document.createElement("div");
        card.className = "dossier-card";

        card.innerHTML = `
            <div class="dossier-header">
                <span class="dossier-name">${lead.name}</span>
                <span class="dossier-status-tag">VERIFIED BUYER</span>
            </div>
            <div class="dossier-field">
                <span class="dossier-label">Project Interest:</span>
                <span class="dossier-value">${lead.project}</span>
            </div>
            <div class="dossier-field">
                <span class="dossier-label">Loan Pre-Approval:</span>
                <span class="dossier-value" style="color: var(--client-color);">${lead.loanStatus}</span>
            </div>
            <div class="dossier-field">
                <span class="dossier-label">Confirmed Viewing:</span>
                <span class="dossier-value">${lead.viewingTime || 'To Be Confirmed'}</span>
            </div>
            <div class="dossier-field">
                <span class="dossier-label">Feedback Status:</span>
                <span class="dossier-value">${lead.clientFeedback || 'Pending'}</span>
            </div>
            <div class="feedback-buttons">
                <button class="btn btn-sm btn-primary" onclick="updateClientFeedback('${lead.id}', 'Viewing Completed')">Viewing Completed</button>
                <button class="btn btn-sm btn-primary" style="background: var(--client-color);" onclick="updateClientFeedback('${lead.id}', 'Closed Deal')">Closed Deal</button>
            </div>
        `;

        container.appendChild(card);
    });
}

function openTriageModal(leadId) {
    selectedLeadId = leadId;
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    document.getElementById("modal-lead-name").textContent = `Triage: ${lead.name}`;
    document.getElementById("modal-lead-info").textContent = `${lead.project} • ${lead.phone}`;
    document.getElementById("modal-tier-select").value = lead.tier === "New" ? "Hot" : lead.tier;
    document.getElementById("modal-loan-status").value = lead.loanStatus;
    document.getElementById("modal-viewing-time").value = lead.viewingTime || "";
    document.getElementById("modal-notes").value = lead.notes || "";

    document.getElementById("triage-modal").classList.add("active");
}

function closeTriageModal() {
    document.getElementById("triage-modal").classList.remove("active");
    selectedLeadId = null;
}

function saveTriageData() {
    if (!selectedLeadId) return;
    const lead = leads.find(l => l.id === selectedLeadId);
    if (!lead) return;

    lead.tier = document.getElementById("modal-tier-select").value;
    lead.loanStatus = document.getElementById("modal-loan-status").value;
    lead.viewingTime = document.getElementById("modal-viewing-time").value.trim();
    lead.notes = document.getElementById("modal-notes").value.trim();

    if (lead.tier === "Hot") {
        lead.publishedToClient = true;
    } else if (lead.tier === "Disqualified") {
        lead.publishedToClient = false;
    }

    saveLeadsToStorage();
    renderAllViews();
    closeTriageModal();
}

function updateClientFeedback(leadId, feedbackText) {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
        lead.clientFeedback = feedbackText;
        saveLeadsToStorage();
        renderAllViews();
    }
}
