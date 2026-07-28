
    let allLeads = [];
    let allProspects = [];
    let activeLeadId = null; 
    let activeProspectWa = null;
    let broadcastQueue = [];

    function setupMockRunner() {
      console.warn("Running in local preview mode. Simulating Apps Script APIs.");
      window.google = {
        script: {
          run: {
            withSuccessHandler: function(callback) {
              this.successHandler = callback;
              return this;
            },
            withFailureHandler: function(callback) {
              this.failureHandler = callback;
              return this;
            },
            getDashboardStats: function() {
              setTimeout(() => {
                if (this.successHandler) {
                  this.successHandler({
                    totalLeads: 42,
                    hotLeads: 12,
                    appointments: 5,
                    revivedLeads: 8,
                    pipelineValue: 2450000,
                    estCommission: 73500,
                    funnel: [
                      { label: 'Cold', count: 15 },
                      { label: 'Warm', count: 10 },
                      { label: 'Hot', count: 12 },
                      { label: 'Appointment', count: 5 },
                      { label: 'Closing', count: 2 },
                      { label: 'Ghost', count: 8 }
                    ]
                  });
                }
              }, 400);
              return this;
            },
            getTomorrowAppointments: function() {
              setTimeout(() => {
                if (this.successHandler) {
                  this.successHandler([
                    { leadId: 'ZK-1001', name: 'Ali bin Ahmad', client: 'Ahmad PJ', property: 'Elmina Valley 3', time: '10:00 AM', date: new Date().toISOString(), valid: true, url: '#' },
                    { leadId: 'ZK-1002', name: 'Siti Aminah', client: 'Ahmad PJ', property: 'Eco Grandeur', time: '3:00 PM', date: new Date().toISOString(), valid: true, url: '#' }
                  ]);
                }
              }, 400);
              return this;
            },
            getAppointmentsByClient: function(client) {
              this.getTomorrowAppointments();
              return this;
            },
            getAllLeads: function() {
              setTimeout(() => {
                if (this.successHandler) {
                  this.successHandler([
                    { rowIndex: 2, client: 'Ahmad PJ', leadId: 'ZK-1001', name: 'Ali bin Ahmad', wa: '0123456789', property: 'Elmina Valley 3', price: 680000, status: 'Hot', priority: 55, commission: 20400, touch: 3, lastContact: new Date().toISOString(), daysStale: 0, nextAction: 'Viewing set', dsr: 'Strong', notes: 'Very interested buyer.' },
                    { rowIndex: 3, client: 'Ahmad PJ', leadId: 'ZK-1002', name: 'Siti Aminah', wa: '0112345678', property: 'Eco Grandeur', price: 520000, status: 'Warm', priority: 35, commission: 15600, touch: 2, lastContact: new Date().toISOString(), daysStale: 2, nextAction: 'Waiting for payslip', dsr: 'Borderline', notes: 'Joint applicant.' }
                  ]);
                }
              }, 400);
              return this;
            },
            getLeadsByClient: function(client) {
              this.getAllLeads();
              return this;
            },
            getAllProspects: function() {
              setTimeout(() => {
                if (this.successHandler) {
                  this.successHandler([
                    { rowIndex: 4, name: 'Abu Negotiator', area: 'Subang', state: 'Selangor', agency: 'PropNex', wa: '0198887766', channel: 'Facebook', status: 'Warm', needs: 'Wants lead screening helper', touch: 2, lastContact: new Date().toISOString(), nextFollowUp: new Date().toISOString(), notes: 'Agreed to try portal.' }
                  ]);
                }
              }, 400);
              return this;
            },
            listClients: function() {
              setTimeout(() => {
                if (this.successHandler) {
                  this.successHandler([
                    { name: 'Ahmad PJ', leadCount: 12, url: 'https://script.google.com/macros/s/XXX/exec?client=Ahmad%20PJ&token=123' }
                  ]);
                }
              }, 400);
              return this;
            },
            getEngineLog: function() {
              setTimeout(() => {
                if (this.successHandler) {
                  this.successHandler([
                    { timestamp: new Date().toISOString(), name: 'Ali bin Ahmad', channel: 'WhatsApp', response: 'Replied', touch: 3, status: 'Hot', notes: 'Broadcast sent' }
                  ]);
                }
              }, 400);
              return this;
            },
            getGhostLeads: function() {
              setTimeout(() => {
                if (this.successHandler) {
                  this.successHandler([
                    { rowIndex: 2, leadId: 'ZK-1003', name: 'John Doe', wa: '0172223344', property: 'Ara Damansara', ghostedSince: new Date().toISOString(), daysCold: 9, stage: 1, script: '', outcome: 'Pending' }
                  ]);
                }
              }, 400);
              return this;
            },
            buildBroadcastQueue: function() {
              setTimeout(() => {
                if (this.successHandler) {
                  this.successHandler({
                    count: 1,
                    queue: [
                      { rowIndex: 2, leadId: 'ZK-1001', name: 'Ali bin Ahmad', wa: '0123456789', property: 'Elmina Valley 3', status: 'Hot', touch: 3, daysStale: 0, script: 'Follow-up script', url: '#', valid: true }
                    ]
                  });
                }
              }, 400);
              return this;
            }
          }
        }
      };
    }

    function safeInit() {
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        console.log("Google Apps Script context ready.");
        loadDashboard();
      } else if (typeof google !== 'undefined' && (!google.script || !google.script.run)) {
        console.log("Waiting for Google Apps Script context to load...");
        setTimeout(safeInit, 100);
      } else {
        setupMockRunner();
        loadDashboard();
      }
    }

    function showToast(msg, type) {
      const toast = document.getElementById('toast');
      document.getElementById('toast-msg').textContent = msg;
      toast.className = 'toast show ' + (type || 'success');
      setTimeout(() => toast.classList.remove('show'), 3500);
    }

    // TAB NAVIGATION
    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      
      const targetTab = document.getElementById('tab-' + tabId);
      const targetBtn = document.querySelector('[data-tab="' + tabId + '"]');
      
      if (targetTab) targetTab.classList.add('active');
      if (targetBtn) targetBtn.classList.add('active');
      
      if (tabId === 'dashboard') loadDashboard();
      if (tabId === 'prospects') loadProspects();
      if (tabId === 'warroom') loadWarRoom();
      if (tabId === 'broadcast') loadBroadcastTab();
      if (tabId === 'ghost') loadGhost();
      if (tabId === 'engine') loadEngine();
      if (tabId === 'settings') { loadClients(); updateClientOptions(); }
    }

    function switchPanelTab(ptabId) {
      document.querySelectorAll('#side-panel-lead .panel-tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('#side-panel-lead .panel-tab-content').forEach(c => c.classList.remove('active'));
      
      const targetBtn = document.querySelector('#side-panel-lead [data-ptab="' + ptabId + '"]');
      const targetContent = document.getElementById(ptabId);
      
      if (targetBtn) targetBtn.classList.add('active');
      if (targetContent) targetContent.classList.add('active');
    }

    function switchProsTab(ptabId) {
      document.querySelectorAll('#side-panel-prospect .panel-tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('#side-panel-prospect .panel-tab-content').forEach(c => c.classList.remove('active'));
      
      const targetBtn = document.querySelector('#side-panel-prospect [data-ptab="' + ptabId + '"]');
      const targetContent = document.getElementById(ptabId);
      
      if (targetBtn) targetBtn.classList.add('active');
      if (targetContent) targetContent.classList.add('active');
    }

    // --- DASHBOARD LOADER ---
    function loadDashboard() {
      google.script.run
        .withSuccessHandler(data => {
          if (!data) return;
          document.getElementById('dash-total').textContent = data.totalLeads || 0; // Prospects counts loaded dynamically in sheet KPI formulas
          document.getElementById('dash-hot').textContent = data.hotLeads || 0;
          document.getElementById('dash-appt').textContent = data.appointments || 0;
          document.getElementById('dash-revived').textContent = data.revivedLeads || 0;
          document.getElementById('dash-pipeline').textContent = 'RM ' + (data.pipelineValue || 0).toLocaleString();
          document.getElementById('dash-commission').textContent = 'RM ' + (data.estCommission || 0).toLocaleString();
          
          if (data.funnel) {
            const total = data.totalLeads || 1;
            const colors = { Cold: 'var(--cold)', Warm: 'var(--warm)', Hot: 'var(--hot)', Appointment: 'var(--appt)', Closing: 'var(--closing)', Ghost: 'var(--ghost)' };
            document.getElementById('dash-funnel').innerHTML = data.funnel.map(f => {
              const pct = Math.round((f.count / total) * 100);
              return `<div class="funnel-item">
                <div class="funnel-label"><div class="funnel-dot" style="background:${colors[f.label] || 'var(--text-muted)'};"></div>${f.label}</div>
                <div class="funnel-count" style="color:${colors[f.label] || 'var(--text-muted)'};">${f.count}</div>
                <div class="funnel-bar-wrap"><div class="funnel-bar-fill" style="width:${pct}%; background:${colors[f.label] || 'var(--text-muted)'};"></div></div>
                <div class="funnel-pct">${pct}%</div>
              </div>`;
            }).join('');
          }
        })
        .withFailureHandler(err => showToast(err.message, 'error'))
        .getDashboardStats();
        
      loadAppointments();
    }

    function loadAppointments() {
      google.script.run
        .withSuccessHandler(data => {
          const container = document.getElementById('dash-appts');
          if (!container) return;
          if (!data || data.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-dim);">No viewings scheduled this week.</div>';
            return;
          }
          container.innerHTML = data.map(a => {
            const d = a.date ? new Date(a.date) : null;
            const day = d ? d.getDate() : '-';
            const month = d ? d.toLocaleDateString('en-MY', {month:'short'}) : '';
            return `<div class="appt-item">
              <div class="appt-date"><div class="appt-day">${day}</div><div class="appt-month">${month}</div></div>
              <div class="appt-details"><strong>${a.name}</strong> <span style="color:var(--text-muted); font-size:11px;">(${a.client})</span><br><span style="color:var(--text-dim);">${a.property} â€” ${a.time}</span></div>
            </div>`;
          }).join('');
        })
        .withFailureHandler(err => showToast(err.message, 'error'))
        .getTomorrowAppointments();
    }

    // --- SDR PROSPECTS MANAGEMENT (TAB 2) ---
    function loadProspects() {
      const tbody = document.getElementById('pros-tbody');
      tbody.innerHTML = '<tr><td colspan="9">Loading Prospects Directory...</td></tr>';
      google.script.run
        .withSuccessHandler(data => {
          allProspects = data || [];
          renderProspects(allProspects);
        })
        .withFailureHandler(err => {
          showToast(err.message, 'error');
          tbody.innerHTML = '<tr><td colspan="9">Failed to load prospects.</td></tr>';
        })
        .getAllProspects();
    }

    function renderProspects(prospects) {
      const tbody = document.getElementById('pros-tbody');
      if (!tbody) return;
      if (!prospects || prospects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state">No agent prospects found. Click add to begin.</div></td></tr>';
        return;
      }
      tbody.innerHTML = prospects.map(p => {
        const last = p.lastContact ? new Date(p.lastContact).toLocaleDateString('en-MY', {day:'numeric', month:'short'}) : '-';
        return `<tr>
          <td><strong>${p.name}</strong></td>
          <td>${p.area || '-'}</td>
          <td>${p.state || '-'}</td>
          <td>${p.agency || '-'}</td>
          <td>${p.wa}</td>
          <td><span class="status-pill sp-${(p.status || '').toLowerCase()}">${p.status}</span></td>
          <td>${p.touch || 0}</td>
          <td>${last}</td>
          <td><div class="row-actions">
            <button class="row-btn row-btn-wa" onclick="sendWAProspectDirect('${p.wa}', '${p.name}')">Outreach</button>
            <button class="row-btn row-btn-edit" onclick="openProspectPanel('${p.wa}')">Workpanel</button>
            <button class="row-btn row-btn-delete" onclick="deleteProspect('${p.wa}')">Del</button>
          </div></td>
        </tr>`;
      }).join('');
    }

    function filterProspects() {
      const search = document.getElementById('pros-search').value.toLowerCase();
      const status = document.getElementById('filter-pros-status').value;
      let filtered = allProspects;
      
      if (search) {
        filtered = filtered.filter(p => (p.name || '').toLowerCase().includes(search) || (p.area || '').toLowerCase().includes(search) || (p.agency || '').toLowerCase().includes(search));
      }
      if (status) {
        filtered = filtered.filter(p => p.status === status);
      }
      renderProspects(filtered);
    }

    function openAddProspect() { openProspectPanel(null); }

    function openProspectPanel(wa) {
      activeProspectWa = wa;
      switchProsTab('pros-details');
      document.getElementById('side-panel-prospect').classList.add('active');
      
      if (!wa) {
        document.getElementById('panel-pros-title').textContent = 'New Agent Prospect';
        document.getElementById('pros-name').value = '';
        document.getElementById('pros-area').value = '';
        document.getElementById('pros-state').value = '';
        document.getElementById('pros-agency').value = '';
        document.getElementById('pros-wa').value = '';
        document.getElementById('pros-status').value = 'Cold';
        document.getElementById('pros-touch').value = 0;
        document.getElementById('pros-last').value = '';
        document.getElementById('pros-next').value = '';
        document.getElementById('pros-needs').value = '';
        document.getElementById('pros-notes').value = '';
        document.getElementById('pros-outreach-script').value = 'Select listing segment to generate outreach pitch script.';
        return;
      }
      
      document.getElementById('panel-pros-title').textContent = 'Prospect Workpanel';
      const pros = allProspects.find(p => p.wa === wa);
      if (!pros) return;
      
      document.getElementById('pros-name').value = pros.name || '';
      document.getElementById('pros-area').value = pros.area || '';
      document.getElementById('pros-state').value = pros.state || '';
      document.getElementById('pros-agency').value = pros.agency || '';
      document.getElementById('pros-wa').value = pros.wa || '';
      document.getElementById('pros-status').value = pros.status || 'Cold';
      document.getElementById('pros-touch').value = pros.touch || 0;
      document.getElementById('pros-last').value = pros.lastContact ? new Date(pros.lastContact).toISOString().split('T')[0] : '';
      document.getElementById('pros-next').value = pros.nextFollowUp ? new Date(pros.nextFollowUp).toISOString().split('T')[0] : '';
      document.getElementById('pros-needs').value = pros.needs || '';
      document.getElementById('pros-notes').value = pros.notes || '';
      
      generateABMOutreachText();
    }

    function closeProspectPanel() {
      document.getElementById('side-panel-prospect').classList.remove('active');
      activeProspectWa = null;
    }

    function generateABMOutreachText() {
      const segment = document.getElementById('abm-segment-select').value;
      const name = document.getElementById('pros-name').value.trim() || 'Ejen';
      const area = document.getElementById('pros-area').value.trim() || 'Kawasan anda';
      const agency = document.getElementById('pros-agency').value.trim() || 'Agency';
      const needs = document.getElementById('pros-needs').value.trim();
      
      let script = '';
      
      if (segment === 'luxury') {
        script = `Hi ${name},\n\nSaya nampak listing hartanah premium anda di ${area} dekat iProperty. Cantik unit tu.\n\nSaja nak tanya, untuk unit premium macam ni, selalu tak anda jumpa buyer yang berminat tapi sangkut kelayakan bank (DSR) sebab komitmen bulanan sedia ada tinggi?\n\nSDR team kami di ZK Revenue Ops ada bantu ejen tapis DSR gaji & komitmen pembeli awal-awal sebelum set viewing slot. Minat nak tengok contoh portal kelayakan DSR helper kami secara free?`;
      } else if (segment === 'newlaunch') {
        script = `Hi ${name},\n\nNampak anda aktif promosikan projek baru di ${area} kat FB Ads. Cantik kempen tu.\n\nBila lead masuk mencurah-curah dari ads, sempat tak anda follow-up semua dalam masa 5 minit sebelum lead pergi tanya ejen lain?\n\nSDR team kami bantu ejen uruskan Speed-to-Lead respon pantas 24/7 dan tapis kelayakan mereka secara automatik. Boleh saya share case study ringkas macam mana kami bantu ejen dapatkan confirmed viewing slot?`;
      } else {
        script = `Hi ${name},\n\nSaya nampak unit subsale di ${area} yang anda iklankan baru-baru ini.\n\nKebanyakan ejen ada banyak database lead lama dari iklan bulan-bulan lepas yang tersimpan dalam telefon begitu sahaja. Sayang kalau dibiar sejuk.\n\nKami boleh tolong jalankan kempen Lead Revival (WhatsApp follow-up bertingkat) ke atas database lama anda untuk tapis semula buyer yang aktif berminat. Anda hanya bayar RM199 flat rate. Boleh saya hantar draf proposal pilot kami?`;
      }
      
      document.getElementById('pros-outreach-script').value = script;
    }

    function fireWhatsAppProspect() {
      const wa = document.getElementById('pros-wa').value.trim();
      const script = document.getElementById('pros-outreach-script').value;
      if (!wa) return;
      
      let cleaned = wa.replace(/\D/g, '');
      if (cleaned.startsWith('0')) cleaned = '60' + cleaned.substring(1);
      else if (cleaned.startsWith('1')) cleaned = '60' + cleaned;
      
      const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(script)}`;
      window.open(url, '_blank');
      showToast('Outreach WhatsApp link opened');
      
      // Update touch count and date
      const touch = Number(document.getElementById('pros-touch').value) || 0;
      document.getElementById('pros-touch').value = touch + 1;
      document.getElementById('pros-last').value = new Date().toISOString().split('T')[0];
    }

    function sendWAProspectDirect(wa, name) {
      const script = `Hi ${name},\n\nSaya daripada ZK Revenue Ops. Kami menyediakan perkhidmatan follow-up dan appointment setting untuk REN. Boleh kita berbual sebentar?`;
      let cleaned = wa.replace(/\D/g, '');
      if (cleaned.startsWith('0')) cleaned = '60' + cleaned.substring(1);
      const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(script)}`;
      window.open(url, '_blank');
      showToast('Outreach opened');
    }

    function saveProspect() {
      const data = {
        name: document.getElementById('pros-name').value.trim(),
        wa: document.getElementById('pros-wa').value.trim(),
        area: document.getElementById('pros-area').value.trim(),
        state: document.getElementById('pros-state').value.trim(),
        agency: document.getElementById('pros-agency').value.trim(),
        status: document.getElementById('pros-status').value,
        touch: Number(document.getElementById('pros-touch').value) || 0,
        lastContact: document.getElementById('pros-last').value,
        nextFollowUp: document.getElementById('pros-next').value,
        needs: document.getElementById('pros-needs').value.trim(),
        notes: document.getElementById('pros-notes').value.trim()
      };
      
      if (!data.name || !data.wa) {
        showToast('Name and WhatsApp number are required', 'error');
        return;
      }
      
      const isEdit = allProspects.some(p => p.wa === data.wa);
      
      if (isEdit) {
        google.script.run
          .withSuccessHandler(() => {
            showToast('Prospect profile updated');
            closeProspectPanel();
            loadProspects();
          })
          .withFailureHandler(err => showToast(err.message, 'error'))
          .updateProspect(data);
      } else {
        google.script.run
          .withSuccessHandler(() => {
            showToast('Prospect successfully registered');
            closeProspectPanel();
            loadProspects();
          })
          .withFailureHandler(err => showToast(err.message, 'error'))
          .addProspect(data);
      }
    }

    function deleteProspect(wa) {
      if (!confirm('Are you sure you want to delete this prospect agent?')) return;
      google.script.run
        .withSuccessHandler(() => {
          showToast('Prospect deleted');
          loadProspects();
        })
        .withFailureHandler(err => showToast(err.message, 'error'))
        .deleteProspect(wa);
    }

    // --- BUYER LEADS WAR ROOM (TAB 3) ---
    function loadWarRoom() {
      const tbody = document.getElementById('war-tbody');
      tbody.innerHTML = '<tr><td colspan="9">Loading Buyer Database...</td></tr>';
      google.script.run
        .withSuccessHandler(data => {
          allLeads = data || [];
          renderWarRoom(allLeads);
          updateClientOptions();
        })
        .withFailureHandler(err => {
          showToast(err.message, 'error');
          tbody.innerHTML = '<tr><td colspan="9">Error loading war room leads.</td></tr>';
        })
        .getAllLeads();
    }

    function renderWarRoom(leads) {
      const tbody = document.getElementById('war-tbody');
      if (!tbody) return;
      if (!leads || leads.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state">No buyer leads in database.</div></td></tr>';
        return;
      }
      tbody.innerHTML = leads.map(l => {
        const last = l.lastContact ? new Date(l.lastContact).toLocaleDateString('en-MY', {day:'numeric', month:'short'}) : '-';
        const isRevived = l.notes && l.notes.includes('[REVIVED]');
        const revivedBadge = isRevived ? `<span class="ghost-timeline-badge" style="background: rgba(16,185,129,0.1); color: var(--success); border-color: rgba(16,185,129,0.2);">Revived</span>` : '';
        return `<tr>
          <td><strong>${l.client}</strong></td>
          <td class="hide-mobile">${l.priority || '-'}</td>
          <td class="td-name">${l.name} ${revivedBadge}<br><span class="td-wa">${l.wa}</span></td>
          <td class="hide-mobile">${l.property || '-'}</td>
          <td style="color: var(--accent); font-weight:700;">RM ${(Number(l.price) || 0).toLocaleString()}</td>
          <td><span class="status-pill sp-${(l.status || '').toLowerCase()}">${l.status}</span></td>
          <td class="hide-mobile">${l.touch || 0}</td>
          <td class="hide-mobile">${last}</td>
          <td><div class="row-actions">
            <button class="row-btn row-btn-wa" onclick="sendWA('${l.leadId}')">WA</button>
            <button class="row-btn row-btn-edit" onclick="openSidePanel('${l.leadId}')">Workpanel</button>
            <button class="row-btn row-btn-delete" onclick="deleteLead('${l.leadId}')">Del</button>
          </div></td>
        </tr>`;
      }).join('');
    }

    function filterWarRoom() {
      const search = document.getElementById('war-search').value.toLowerCase();
      const status = document.getElementById('filter-status').value;
      const client = document.getElementById('client-filter').value;
      let filtered = allLeads;
      if (search) filtered = filtered.filter(l => (l.name || '').toLowerCase().includes(search) || (l.property || '').toLowerCase().includes(search));
      if (status) filtered = filtered.filter(l => l.status === status);
      if (client) filtered = filtered.filter(l => (l.client || '').toString().trim().toLowerCase() === client.trim().toLowerCase());
      renderWarRoom(filtered);
    }
    function filterByClient() { filterWarRoom(); }

    function openAddLead() { openSidePanel(null); }

    function openSidePanel(leadId) {
      activeLeadId = leadId;
      switchPanelTab('p-details');
      document.getElementById('side-panel-lead').classList.add('active');
      document.getElementById('dsr-panel-result').style.display = 'none';
      updateClientOptions();
      
      if (!leadId) {
        document.getElementById('panel-lead-title').textContent = 'New Buyer Lead';
        document.getElementById('lead-client').value = '';
        document.getElementById('lead-name').value = '';
        document.getElementById('lead-wa').value = '';
        document.getElementById('lead-property').value = '';
        document.getElementById('lead-price').value = '';
        document.getElementById('lead-status').value = 'Cold';
        document.getElementById('lead-touch').value = 1;
        document.getElementById('lead-last').value = new Date().toISOString().split('T')[0];
        document.getElementById('lead-next').value = '';
        document.getElementById('lead-dsr').value = '-';
        document.getElementById('lead-notes').value = '';
        return;
      }
      
      document.getElementById('panel-lead-title').textContent = 'Lead Workpanel';
      const lead = allLeads.find(l => l.leadId === leadId);
      if (!lead) return;
      
      document.getElementById('lead-client').value = lead.client || '';
      document.getElementById('lead-name').value = lead.name || '';
      document.getElementById('lead-wa').value = lead.wa || '';
      document.getElementById('lead-property').value = lead.property || '';
      document.getElementById('lead-price').value = lead.price || '';
      document.getElementById('lead-status').value = lead.status || 'Cold';
      document.getElementById('lead-touch').value = lead.touch || 0;
      document.getElementById('lead-last').value = lead.lastContact ? new Date(lead.lastContact).toISOString().split('T')[0] : '';
      document.getElementById('lead-next').value = lead.nextAction || '';
      document.getElementById('lead-dsr').value = lead.dsr || '-';
      document.getElementById('lead-notes').value = lead.notes || '';
    }

    function closeSidePanel() {
      document.getElementById('side-panel-lead').classList.remove('active');
      activeLeadId = null;
    }

    function saveLead() {
      const data = {
        leadId: activeLeadId,
        client: document.getElementById('lead-client').value,
        name: document.getElementById('lead-name').value.trim(),
        wa: document.getElementById('lead-wa').value.trim(),
        property: document.getElementById('lead-property').value.trim(),
        price: Number(document.getElementById('lead-price').value) || 0,
        status: document.getElementById('lead-status').value,
        touch: Number(document.getElementById('lead-touch').value) || 1,
        lastContact: document.getElementById('lead-last').value,
        nextAction: document.getElementById('lead-next').value.trim(),
        dsr: document.getElementById('lead-dsr').value,
        notes: document.getElementById('lead-notes').value.trim()
      };

      if (!data.name || !data.wa || !data.client) {
        showToast('Name, WA, and Client (REN) are required', 'error');
        return;
      }

      if (activeLeadId) {
        google.script.run
          .withSuccessHandler(() => {
            showToast('Profile successfully saved');
            closeSidePanel();
            loadWarRoom();
          })
          .withFailureHandler(err => showToast(err.message, 'error'))
          .updateLead(data);
      } else {
        google.script.run
          .withSuccessHandler(() => {
            showToast('Lead intake successfully captured');
            closeSidePanel();
            loadWarRoom();
          })
          .withFailureHandler(err => showToast(err.message, 'error'))
          .addLead(data);
      }
    }

    function deleteLead(leadId) {
      if (!confirm('Are you sure you want to delete this lead? This cannot be undone.')) return;
      google.script.run
        .withSuccessHandler(() => {
          showToast('Lead deleted');
          loadWarRoom();
        })
        .withFailureHandler(err => showToast(err.message, 'error'))
        .deleteLead(leadId);
    }

    function sendWA(leadId) {
      google.script.run
        .withSuccessHandler(res => {
          if (res.success) {
            window.open(res.url, '_blank');
            showToast('WhatsApp conversation opened');
          } else {
            showToast(res.error, 'error');
          }
        })
        .withFailureHandler(err => showToast(err.message, 'error'))
        .generateWALink({ leadId: leadId });
    }

    function calculateDSRLocal() {
      const data = {
        income: Number(document.getElementById('dsr-calc-income').value) || 0,
        commitments: Number(document.getElementById('dsr-calc-commit').value) || 0,
        loan: Number(document.getElementById('dsr-calc-loan').value) || 0,
        tenure: Number(document.getElementById('dsr-calc-tenure').value) || 35
      };
      
      google.script.run
        .withSuccessHandler(res => {
          if (!res) return;
          document.getElementById('p-dsr-inst').textContent = 'RM ' + Math.round(res.installment).toLocaleString();
          document.getElementById('p-dsr-pct').textContent = res.dsr + '%';
          const v = document.getElementById('p-dsr-verdict');
          v.textContent = res.verdict === 'Strong' ? 'STRONG â€” Pre-approval recommended' : res.verdict === 'Borderline' ? 'BORDERLINE â€” Joint applicant advised' : 'OVER LIMIT â€” Co-borrower mandatory';
          v.className = 'dsr-verdict dsr-' + res.verdict.toLowerCase();
          
          document.getElementById('lead-dsr').value = res.verdict;
          document.getElementById('dsr-panel-result').style.display = 'block';
        })
        .withFailureHandler(err => showToast(err.message, 'error'))
        .calculateDSR(data);
    }

    // --- BROADCAST TAB QUEUES ---
    function loadBroadcastTab() {
      loadReminderQueue();
      updateClientOptions();
    }

    function loadReminderQueue() {
      const container = document.getElementById('reminder-queue-list');
      container.innerHTML = '<div class="loading">Scanning appointments...</div>';
      google.script.run
        .withSuccessHandler(appts => {
          if (!appts || appts.length === 0) {
            container.innerHTML = '<div class="empty-state">No viewings set for tomorrow.</div>';
            return;
          }
          container.innerHTML = appts.map(a => {
            const invalid = !a.valid ? '<span class="broadcast-invalid">Invalid WhatsApp number</span>' : '';
            return `<div class="broadcast-item" id="reminder-item-${a.leadId}">
              <div class="broadcast-item-body">
                <div class="broadcast-item-name">${a.name} <span style="color:var(--text-muted); font-weight:400;">(${a.client})</span></div>
                <div class="broadcast-item-meta">${a.property} â€” ${a.time || 'TBA'} â€” ${a.wa}</div>
                <div class="broadcast-item-script">${a.script}</div>
                ${invalid}
              </div>
              <div class="broadcast-item-actions">
                ${a.valid ? `<button class="btn btn-success btn-sm" onclick="sendReminder('${a.leadId}', '${encodeURIComponent(a.url)}')">Send WA</button>` : ''}
              </div>
            </div>`;
          }).join('');
        })
        .withFailureHandler(err => {
          showToast(err.message, 'error');
          container.innerHTML = '<div class="empty-state">Error scanning schedule.</div>';
        })
        .getTomorrowAppointments();
    }

    function sendReminder(leadId, encodedUrl) {
      const url = decodeURIComponent(encodedUrl);
      window.open(url, '_blank');
      google.script.run
        .withSuccessHandler(() => {
          showToast('Reminder marked as sent');
          const item = document.getElementById('reminder-item-' + leadId);
          if (item) item.classList.add('sent');
        })
        .withFailureHandler(err => showToast(err.message, 'error'))
        .markReminderSent(leadId);
    }

    function buildBroadcast() {
      const filters = {
        client: document.getElementById('broadcast-client-filter').value,
        status: '', 
        minDaysStale: 0
      };
      const list = document.getElementById('broadcast-list');
      list.innerHTML = '<div class="loading">Building Queue...</div>';
      
      google.script.run
        .withSuccessHandler(res => {
          broadcastQueue = res.queue || [];
          if (broadcastQueue.length === 0) {
            list.innerHTML = '<div class="empty-state">No leads match criteria for outreach.</div>';
            return;
          }
          list.innerHTML = broadcastQueue.map(item => {
            const invalid = !item.valid ? '<span class="broadcast-invalid">Invalid WhatsApp number</span>' : '';
            return `<div class="broadcast-item" id="broadcast-item-${item.leadId}">
              <div class="broadcast-item-body">
                <div class="broadcast-item-name">${item.name} <span class="status-pill sp-${(item.status || '').toLowerCase()}" style="font-size:9px;">${item.status}</span></div>
                <div class="broadcast-item-meta">${item.property || 'No project'} â€” ${item.daysStale || 0}d stale â€” ${item.wa}</div>
                <div class="broadcast-item-script">${item.script}</div>
                ${invalid}
              </div>
              <div class="broadcast-item-actions">
                ${item.valid ? `<button class="btn btn-success btn-sm" onclick="sendBroadcastItem('${item.leadId}', '${encodeURIComponent(item.url)}')">Send WA</button>` : ''}
              </div>
            </div>`;
          }).join('');
        })
        .withFailureHandler(err => {
          showToast(err.message, 'error');
          list.innerHTML = '<div class="empty-state">Error building outreach queue.</div>';
        })
        .buildBroadcastQueue(filters);
    }

    function sendBroadcastItem(leadId, encodedUrl) {
      const url = decodeURIComponent(encodedUrl);
      window.open(url, '_blank');
      google.script.run
        .withSuccessHandler(() => {
          showToast('Outreach marked as sent');
          const item = document.getElementById('broadcast-item-' + leadId);
          if (item) item.classList.add('sent');
        })
        .withFailureHandler(err => showToast(err.message, 'error'))
        .markBroadcastSent(leadId);
    }

    // --- TAB GHOST REVIVAL ---
    function loadGhost() {
      const tbody = document.getElementById('ghost-tbody');
      if (!tbody) return;
      tbody.innerHTML = '<tr><td colspan="8">Scanning pipeline for inactive accounts...</td></tr>';
      google.script.run
        .withSuccessHandler(data => {
          if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state">No dormant or ghost leads found! All accounts are active.</div></td></tr>';
            return;
          }
          tbody.innerHTML = data.map(g => {
            const since = g.ghostedSince ? new Date(g.ghostedSince).toLocaleDateString('en-MY', {day:'numeric', month:'short'}) : '-';
            return `<tr>
              <td><strong>${g.name}</strong><br><span class="td-wa">${g.wa}</span></td>
              <td class="hide-mobile">${g.property || '-'}</td>
              <td>${since}</td>
              <td style="color: var(--danger); font-weight:700;">${g.daysCold} days</td>
              <td>Stage ${g.stage}</td>
              <td class="hide-mobile" style="font-size:11px; color: var(--text-muted);">${g.script ? g.script.substring(0, 45) + '...' : 'Default template'}</td>
              <td><span class="status-pill sp-ghost">Pending</span></td>
              <td><div class="row-actions">
                <button class="row-btn row-btn-wa" onclick="sendWA('${g.leadId}')">Outreach</button>
                <button class="row-btn row-btn-edit" onclick="openSidePanel('${g.leadId}')">Workspace</button>
              </div></td>
            </tr>`;
          }).join('');
        })
        .withFailureHandler(err => {
          showToast(err.message, 'error');
          tbody.innerHTML = '<tr><td colspan="8">Error loading ghost data.</td></tr>';
        })
        .getGhostLeads();
    }

    function runGhostCheck() {
      showToast('Running background ghost scanner...', 'warn');
      google.script.run
        .withSuccessHandler(res => {
          showToast(`Scan complete. ${res.flagged} ghost leads identified.`);
          loadGhost();
        })
        .withFailureHandler(err => showToast(err.message, 'error'))
        .runGhostCheck();
    }

    // --- TAB ENGINE LOG ---
    function loadEngine() {
      const tbody = document.getElementById('engine-tbody');
      if (!tbody) return;
      tbody.innerHTML = '<tr><td colspan="7">Loading logs...</td></tr>';
      google.script.run
        .withSuccessHandler(data => {
          if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state">Log is empty. Send outreach to log activity.</div></td></tr>';
            return;
          }
          tbody.innerHTML = data.map(e => {
            const t = e.timestamp ? new Date(e.timestamp).toLocaleDateString('en-MY', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'}) : '-';
            return `<tr>
              <td>${t}</td>
              <td><strong>${e.name}</strong></td>
              <td>${e.channel}</td>
              <td><span class="status-pill sp-appointment">${e.response}</span></td>
              <td>${e.touch}</td>
              <td><span class="status-pill sp-cold">${e.status}</span></td>
              <td style="font-size:11px; color: var(--text-muted);">${e.notes || ''}</td>
            </tr>`;
          }).join('');
        })
        .withFailureHandler(err => {
          showToast(err.message, 'error');
          tbody.innerHTML = '<tr><td colspan="7">Error loading logs.</td></tr>';
        })
        .getEngineLog();
    }

    // --- TAB SETTINGS & CLIENT DIRECTORY ---
    function loadClients() {
      const tbody = document.getElementById('clients-tbody');
      if (!tbody) return;
      tbody.innerHTML = '<tr><td colspan="4">Loading clients directory...</td></tr>';
      google.script.run
        .withSuccessHandler(clients => {
          if (!clients || clients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4"><div class="empty-state">No clients found. Click Add Client to create a portal.</div></td></tr>';
            return;
          }
          tbody.innerHTML = clients.map(c => `<tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.leadCount} active leads</td>
            <td><input type="text" class="form-input" value="${c.url}" readonly onclick="this.select()" style="width:100%; max-width:320px; font-family:Consolas,monospace; font-size:11px; padding: 4px 8px;"></td>
            <td><button class="row-btn row-btn-delete" onclick="deleteClient('${c.name}')">Delete</button></td>
          </tr>`).join('');
        })
        .withFailureHandler(err => {
          showToast(err.message, 'error');
          tbody.innerHTML = '<tr><td colspan="4">Error loading clients.</td></tr>';
        })
        .listClients();
    }

    function openAddClient() {
      document.getElementById('client-name-input').value = '';
      document.getElementById('modal-client').classList.add('active');
    }

    function saveClient() {
      const name = document.getElementById('client-name-input').value.trim();
      if (!name) return;
      google.script.run
        .withSuccessHandler(() => {
          closeModal('modal-client');
          showToast('Client portal generated successfully');
          loadClients();
        })
        .withFailureHandler(err => showToast(err.message, 'error'))
        .generateClientToken(name);
    }

    function deleteClient(name) {
      if (!confirm('Are you sure you want to delete this client? Their portal URL will stop working.')) return;
      google.script.run
        .withSuccessHandler(() => {
          showToast('Client deleted');
          loadClients();
        })
        .withFailureHandler(err => showToast(err.message, 'error'))
        .revokeClientToken(name);
    }

    function updateClientOptions() {
      google.script.run
        .withSuccessHandler(clients => {
          if (!clients) return;
          const names = clients.map(c => c.name);
          const optionsHTML = names.map(c => '<option value="' + c + '">' + c + '</option>').join('');
          
          const filter = document.getElementById('client-filter');
          if (filter) filter.innerHTML = '<option value="">All Clients</option>' + optionsHTML;
          
          const lead = document.getElementById('lead-client');
          if (lead) lead.innerHTML = '<option value="">Select Client</option>' + optionsHTML;
          
          const imp = document.getElementById('import-client');
          if (imp) imp.innerHTML = '<option value="">Select Client</option>' + optionsHTML;

          const bcast = document.getElementById('broadcast-client-filter');
          if (bcast) bcast.innerHTML = '<option value="">All Clients</option>' + optionsHTML;
        })
        .listClients();
    }

    function importCSV() {
      const raw = document.getElementById('import-data').value.trim();
      const client = document.getElementById('import-client').value;
      if (!raw || !client) {
        showToast('Select Client and paste data to begin', 'error');
        return;
      }
      google.script.run
        .withSuccessHandler(res => {
          showToast(`${res.imported} leads successfully imported to pipeline.`);
          document.getElementById('import-data').value = '';
          loadWarRoom();
        })
        .withFailureHandler(err => showToast(err.message, 'error'))
        .importLeadsFromCSV(raw, client);
    }

    function syncScripts() {
      showToast('Connecting to Master Google Doc...', 'warn');
      google.script.run
        .withSuccessHandler(res => {
          if (res.success) showToast(res.message);
          else showToast(res.error, 'error');
        })
        .withFailureHandler(err => showToast('Error: ' + err.message, 'error'))
        .syncToolkitFromDoc();
    }

    function closeModal(id) { document.getElementById(id).classList.remove('active'); }

    // INITIALIZATION
    document.addEventListener('DOMContentLoaded', safeInit);
  
