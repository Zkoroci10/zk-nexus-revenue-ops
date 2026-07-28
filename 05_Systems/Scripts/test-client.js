
    let clientName = "<?= clientName ?>";
    if (clientName.includes("?=")) clientName = "Ahmad PJ (Demo)";

    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function safeInit() {
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        loadVault();
      } else {
        setTimeout(safeInit, 100);
      }
    }

    function loadVault() {
      google.script.run.withSuccessHandler(data => {
        renderBriefing(data);
        renderLeads(data);
        loadAppointments();
      }).getLeadsByClient(clientName);
    }

    function renderBriefing(leads) {
      if(!leads) leads = [];
      const now = new Date();
      const hour = now.getHours();
      
      // Filter out 'Closing' and 'Ghost'
      const activeLeads = leads.filter(l => l.status !== 'Closing' && l.status !== 'Ghost');
      const pendingAction = activeLeads.filter(l => !(l.notes && l.notes.includes('[CLIENT FEEDBACK:')));
      const processedToday = activeLeads.length - pendingAction.length;
      
      const firstName = clientName.split(' ')[0];
      let greeting = '';
      let msg = '';
      
      if (hour >= 5 && hour < 12) {
        greeting = `Good morning, ${firstName}.`;
        if (pendingAction.length > 0) {
          msg = `You have <span class="briefing-highlight">${pendingAction.length} high-priority prospects</span> waiting in the vault today. Review their dossiers below.`;
        } else {
          msg = `Your vault is perfectly cleared. The SDR team is sourcing new prospects for you.`;
        }
      } else if (hour >= 12 && hour < 18) {
        greeting = `Good afternoon, ${firstName}.`;
        if (pendingAction.length > 0) {
          msg = `You have completed <span class="briefing-highlight">${processedToday} reviews</span> today. There are still ${pendingAction.length} prospects requiring your verdict.`;
        } else {
          msg = `Excellent pace. You've cleared all pending tasks for this afternoon.`;
        }
      } else {
        greeting = `Good evening, ${firstName}.`;
        if (pendingAction.length > 0) {
          msg = `Today you cleared ${processedToday} prospects. However, <span class="briefing-highlight">${pendingAction.length} dossiers</span> still remain open. Please finalize them or get some rest and continue tomorrow.`;
        } else {
          msg = `Flawless execution today. All dossiers have been processed. Have a good rest, we secure more intel tomorrow.`;
        }
      }
      
      document.getElementById('briefing-container').innerHTML = `${greeting}<br><br>${msg}`;
    }

    function renderLeads(leads) {
      const container = document.getElementById('leads-container');
      if (!leads || leads.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted); font-weight:300;">Vault is empty.</div>';
        return;
      }
      
      const activeLeads = leads.filter(l => l.status !== 'Closing' && l.status !== 'Ghost');
      
      container.innerHTML = activeLeads.map(l => {
        const isProcessed = l.notes && l.notes.includes('[CLIENT FEEDBACK:');
        const waLink = `https://wa.me/${l.wa.replace(/\D/g,'')}`;
        
        return `
          <div class="dossier ${isProcessed ? 'processed' : ''}" id="dossier-${l.leadId}">
            <div class="dossier-header">
              <div>
                <div class="dossier-name">${l.name}</div>
                <div class="dossier-meta"><a href="${waLink}" target="_blank" style="color:var(--text-muted); text-decoration:none;">${l.wa}</a> &bull; ${l.property || 'General Inquiry'}</div>
              </div>
              <div class="dossier-pill">${l.status}</div>
            </div>
            
            <div class="dossier-actions">
              <button class="btn btn-gold" onclick="sendVerdict('${l.leadId}', 'Good Lead')">Approve (Hot)</button>
              <button class="btn" onclick="sendVerdict('${l.leadId}', 'Bad Lead')">Reject (Cold)</button>
            </div>
          </div>
        `;
      }).join('');
    }
    
    function loadAppointments() {
      google.script.run.withSuccessHandler(data => {
        const container = document.getElementById('appts-container');
        if (!data || data.length === 0) {
          container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-weight:300;">No engagements.</div>';
          return;
        }
        container.innerHTML = data.map(a => {
          return `
          <div class="dossier" id="appt-${a.leadId}" style="padding:15px 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-size:16px; font-weight:600; margin-bottom:4px;">${a.name}</div>
                <div style="font-size:12px; color:var(--text-muted);">${a.property || '-'} &bull; ${a.time || '-'}</div>
              </div>
              <div>
                <button class="btn btn-gold" style="padding:8px 16px; font-size:11px;" onclick="acceptAppointment('${a.leadId}')">Confirm</button>
              </div>
            </div>
          </div>`;
        }).join('');
      }).getAppointmentsByClient(clientName);
    }

    function sendVerdict(leadId, verdict) {
      const el = document.getElementById('dossier-' + leadId);
      el.classList.add('processed');
      google.script.run.withSuccessHandler(() => {
        showToast('Verdict secured.');
        loadVault();
      }).clientSubmitFeedback(leadId, verdict);
    }
    
    function acceptAppointment(leadId) {
      showToast('Securing engagement...');
      google.script.run.withSuccessHandler(() => {
        showToast('Engagement Confirmed.');
        document.getElementById('appt-' + leadId).style.display = 'none';
      }).clientActionAppointment(leadId, 'Confirmed');
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', safeInit);
    } else {
      safeInit();
    }
  
