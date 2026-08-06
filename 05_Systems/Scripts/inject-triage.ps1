<#
---
Title: Triage Injector
ID: SYS-012
Type: Script (PowerShell)
Module: 05_Systems
BU: ZK Revenue Ops
Status: Active
Version: 1.0
Created: 2026-08-05
Updated: 2026-08-05
Owner: Zubair (zubairisa10@gmail.com)
Related: PRJ-009
---
#>

$content = Get-Content -Path '05_Systems\Scripts\operator-console.html' -Raw -Encoding utf8

# Add Triage button to War Room toolbar
$oldWarRoomNav = '<button class="btn" id="btn-view-table" onclick="setWarRoomView\(''table''\)" style="background:var\(--bg-elevated\); border:none; box-shadow:0 2px 4px rgba\(0,0,0,0\.05\);">Table</button>\s*<button class="btn btn-ghost" id="btn-view-kanban" onclick="setWarRoomView\(''kanban''\)" style="border:none;">Kanban</button>'
$newWarRoomNav = @'
<button class="btn" id="btn-view-table" onclick="setWarRoomView('table')" style="background:var(--bg-elevated); border:none; box-shadow:0 2px 4px rgba(0,0,0,0.05);">Table</button>
<button class="btn btn-ghost" id="btn-view-kanban" onclick="setWarRoomView('kanban')" style="border:none;">Kanban</button>
<button class="btn btn-ghost" id="btn-view-triage" onclick="setWarRoomView('triage')" style="border:none; color:var(--primary); font-weight:800;">&#9889; Superhuman Triage</button>
'@
$content = [regex]::Replace($content, $oldWarRoomNav, $newWarRoomNav)

# Inject Triage View HTML
$oldWarRoomEnd = '(?s)<!-- KANBAN VIEW -->.*?</div>\s*</div>'
$newWarRoomEnd = @'
      <!-- KANBAN VIEW -->
      <div id="war-view-kanban" style="display:none; overflow-x:auto; padding-bottom:20px;">
        <div style="display:flex; gap:16px; min-width:1000px;" id="war-kanban-board">
          <!-- Columns injected by JS -->
        </div>
      </div>
      
      <!-- TRIAGE VIEW (Superhuman) -->
      <div id="war-view-triage" style="display:none; padding:40px 0;">
        <div style="max-width:600px; margin:0 auto;">
          <div style="text-align:center; margin-bottom:20px; color:var(--text-muted); font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:2px;">
            Inbox Zero Triage <span id="triage-counter" style="color:var(--primary);"></span>
          </div>
          
          <div id="triage-card" style="background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:40px; box-shadow:var(--shadow-md); text-align:center;">
             <!-- Triage Card Injected Here -->
          </div>
          
          <div style="display:flex; justify-content:center; gap:20px; margin-top:30px; font-size:11px; color:var(--text-muted); font-weight:600;">
            <div style="display:flex; align-items:center; gap:6px;"><kbd style="background:var(--border); padding:4px 8px; border-radius:4px; color:var(--text);">W</kbd> WhatsApp</div>
            <div style="display:flex; align-items:center; gap:6px;"><kbd style="background:var(--border); padding:4px 8px; border-radius:4px; color:var(--text);">H</kbd> Mark Hot</div>
            <div style="display:flex; align-items:center; gap:6px;"><kbd style="background:var(--border); padding:4px 8px; border-radius:4px; color:var(--text);">C</kbd> Mark Cold</div>
            <div style="display:flex; align-items:center; gap:6px;"><kbd style="background:var(--border); padding:4px 8px; border-radius:4px; color:var(--text);">S</kbd> Skip</div>
          </div>
        </div>
      </div>
    </div>
'@
$content = [regex]::Replace($content, $oldWarRoomEnd, $newWarRoomEnd)

# Inject Triage JS
$oldJsView = '(?s)function setWarRoomView\(view\) \{.*?renderWarRoom\(window\.filteredWarRoomLeads \|\| window\.warRoomLeads \|\| \[\]\);\s*\}'
$newJsView = @'
    let currentWarRoomView = 'table';
    let triageQueue = [];
    let currentTriageIndex = 0;
    
    function setWarRoomView(view) {
      currentWarRoomView = view;
      ['table','kanban','triage'].forEach(v => {
        const btn = document.getElementById('btn-view-' + v);
        const div = document.getElementById('war-view-' + v);
        if(btn) {
           btn.className = (v === view) ? 'btn' : 'btn btn-ghost';
           btn.style.background = (v === view) ? 'var(--bg-elevated)' : 'transparent';
           btn.style.boxShadow = (v === view) ? '0 2px 4px rgba(0,0,0,0.05)' : 'none';
        }
        if(div) div.style.display = (v === view) ? 'block' : 'none';
      });
      
      const leads = window.filteredWarRoomLeads || window.warRoomLeads || [];
      if (view === 'triage') {
        triageQueue = leads.filter(l => l.status === 'Cold' || l.status === 'Warm');
        currentTriageIndex = 0;
        renderTriage();
      } else {
        renderWarRoom(leads);
      }
    }
'@
$content = [regex]::Replace($content, $oldJsView, $newJsView)

$oldRenderWarRoom = '(?s)function renderWarRoom\(leads\) \{.*?if \(currentWarRoomView === ''kanban''\) \{ renderKanban\(leads\); return; \}'
$newRenderWarRoom = @'
    function renderTriage() {
      const card = document.getElementById('triage-card');
      const counter = document.getElementById('triage-counter');
      if (currentTriageIndex >= triageQueue.length) {
        card.innerHTML = <div style="font-size:40px; margin-bottom:20px;">&#127881;</div><div style="font-size:24px; font-weight:800; margin-bottom:10px;">Inbox Zero</div><div style="color:var(--text-muted);">You have triaged all pending leads.</div>;
        counter.innerHTML = '';
        return;
      }
      
      const l = triageQueue[currentTriageIndex];
      counter.innerHTML = ( of );
      
      card.innerHTML = 
        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;"></div>
        <div style="font-size:28px; font-weight:800; color:var(--text); margin-bottom:12px;"></div>
        <div style="font-size:16px; color:var(--primary); font-weight:600; margin-bottom:24px;">&#128222; </div>
        
        <div style="background:var(--bg-input); padding:20px; border-radius:12px; display:inline-block; text-align:left; min-width:300px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span style="color:var(--text-muted);">Property:</span>
            <span style="font-weight:600;"></span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span style="color:var(--text-muted);">Status:</span>
            <span class="status-pill sp-"></span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-muted);">Touch Count:</span>
            <span style="font-weight:700;"></span>
          </div>
        </div>
      ;
    }
    
    document.addEventListener('keydown', function(e) {
      if (currentWarRoomView !== 'triage') return;
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      
      if (currentTriageIndex >= triageQueue.length) return;
      const l = triageQueue[currentTriageIndex];
      
      const key = e.key.toLowerCase();
      if (key === 'w') { logTouchQuick(l.leadId, l.wa); currentTriageIndex++; renderTriage(); }
      else if (key === 'h') { 
        google.script.run.updateLeadStatusDirect(l.leadId, 'Hot'); 
        showToast('Marked Hot'); currentTriageIndex++; renderTriage(); 
      }
      else if (key === 'c') { 
        google.script.run.updateLeadStatusDirect(l.leadId, 'Cold'); 
        showToast('Marked Cold'); currentTriageIndex++; renderTriage(); 
      }
      else if (key === 's') { 
        currentTriageIndex++; renderTriage(); 
      }
    });

    function renderWarRoom(leads) {
      window.filteredWarRoomLeads = leads;
      if (currentWarRoomView === 'kanban') { renderKanban(leads); return; }
      if (currentWarRoomView === 'triage') { return; }
'@
$content = [regex]::Replace($content, $oldRenderWarRoom, $newRenderWarRoom)

$content | Out-File -FilePath '05_Systems\Scripts\operator-console.html' -Encoding utf8
Write-Output "Injected Superhuman Triage"
