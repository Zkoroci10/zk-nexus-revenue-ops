// Title: WebApp Backend
// ID: SYS-001 Asset
// Type: Script
// Module: 05_Systems
// BU: ZK Revenue Ops
// Status: Active
// Version: 1
// Created: 2026-07-17
// Updated: 2026-07-17
// Owner: Human Founder
// Related: PRJ-001, SYS-001

const SHEET_NAMES = {
  DASHBOARD: 'Dashboard',
  ACTIVE_CLIENTS: 'Active Clients',
  PROSPECTS: 'Prospects',
  WAR_ROOM: 'War Room',
  ENGINE: 'Engine',
  GHOST_REVIVAL: 'Ghost Revival',
  SYSTEM_BRAIN: 'System Brain',
  COMMAND_CENTER: 'Command Center'
};

const COL = {
  CLIENT: 1, LEAD_ID: 2, NAME: 3, WANUM: 4, PROPERTY: 5, PRICE: 6,
  STATUS: 7, PRIORITY: 8, COMMISSION: 9, TOUCH: 10,
  LAST_CONTACT: 11, DAYS_STALE: 12, NEXT_ACTION: 13,
  DSR_STATUS: 14, SCRIPT_REF: 15, NOTES: 16, GHOST_STAGE: 17
};

const STATUS_WEIGHTS = { 'Hot': 5, 'Warm': 3, 'Cold': 1, 'Appointment': 4, 'Closing': 5, 'Ghost': 0 };

function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet(name) {
  return getSpreadsheet().getSheetByName(name);
}

function getWarRoom() {
  return getSheet(SHEET_NAMES.WAR_ROOM);
}

function getEngine() {
  return getSheet(SHEET_NAMES.ENGINE);
}

function getGhostRevival() {
  return getSheet(SHEET_NAMES.GHOST_REVIVAL);
}

function getSystemBrain() {
  return getSheet(SHEET_NAMES.SYSTEM_BRAIN);
}

function getCommandCenter() {
  return getSheet(SHEET_NAMES.COMMAND_CENTER);
}

// === HELPER: Format nombor telefon untuk simpanan Sheet (Format Tempatan: 01xxxxxxxx) ===
function formatWhatsAppNumber(wa) {
  if (!wa) return '';
  let cleaned = String(wa).replace(/\D/g, '');
  if (cleaned.indexOf('60') === 0) {
    cleaned = '0' + cleaned.substring(2);
  } else if (cleaned.indexOf('1') === 0 && (cleaned.length === 9 || cleaned.length === 10)) {
    cleaned = '0' + cleaned;
  }
  return "'" + cleaned;
}

// === HELPER: Tukar format tempatan ke format API WhatsApp (601xxxxxxxx) ===
function getWAUrlNumber(wa) {
  if (!wa) return '';
  let cleaned = String(wa).replace(/\D/g, '');
  if (cleaned.indexOf('0') === 0) {
    cleaned = '60' + cleaned.substring(1);
  } else if (cleaned.indexOf('1') === 0) {
    cleaned = '60' + cleaned;
  }
  return cleaned;
}

// === HELPER: Pembacaan Tarikh Kalis Ranap ===
function safeIsoString(dateVal) {
  if (dateVal instanceof Date) {
    return !isNaN(dateVal.getTime()) ? dateVal.toISOString() : '';
  }
  if (dateVal) {
    const parsed = new Date(dateVal);
    return !isNaN(parsed.getTime()) ? parsed.toISOString() : String(dateVal);
  }
  return '';
}

// === HELPER: Cari baris sebenar berdasarkan Lead ID (Mencegah perlanggaran data disebabkan auto-sort) ===
function findRowByLeadId(sheet, leadId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) throw new Error("Ralat: Pangkalan data kosong.");
  const data = sheet.getRange(2, COL.LEAD_ID, lastRow - 1, 1).getValues();
  for (let i = 0; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(leadId).trim()) {
      return i + 2; 
    }
  }
  throw new Error("Ralat: Lead ID '" + leadId + "' tidak dijumpai.");
}

// === GOOGLE DOC TOOLKIT SYNC ===
function syncToolkitFromDoc(url) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    let docId = PropertiesService.getScriptProperties().getProperty('toolkit_doc_id') || '1_zMA6fdwEcjP0G8Jbi4BHI9Xl6YeQT_-k56PDggLRO0';

    if (url) {
      const match = url.match(/\/d\/(.*?)\//);
      if (match && match[1]) {
        docId = match[1];
        PropertiesService.getScriptProperties().setProperty('toolkit_doc_id', docId);
      } else {
        docId = url; // assume they pasted the ID directly
        PropertiesService.getScriptProperties().setProperty('toolkit_doc_id', docId);
      }
    }

    const doc = DocumentApp.openById(docId);
    if (!doc) throw new Error("Gagal membuka Google Doc Toolkit. Sila pastikan link betul dan anda mempunyai akses.");
    
    const text = doc.getBody().getText();
    
    const engine = getEngine();
    if (engine) {
      engine.appendRow(['', new Date(), 'System', 'Outreach Toolkit', 'Synced', '', '', '', 'Scripts successfully synchronized with Google Doc.']);
    }
    return { success: true, message: 'Berjaya menyelaraskan fail "' + doc.getName() + '" (' + text.length + ' aksara).' };
  } catch (e) {
    return { success: false, error: 'Ralat Penyelarasan: Sila pastikan URL Google Doc tepat dan tidak disekat. (' + e.message + ')' };
  } finally {
    lock.releaseLock();
  }
}

function getAllLeads() {
  const sheet = getWarRoom();
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const leads = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rawLastContact = row[COL.LAST_CONTACT - 1];
    leads.push({
      rowIndex: i + 1,
      client: row[COL.CLIENT - 1],
      leadId: row[COL.LEAD_ID - 1],
      name: row[COL.NAME - 1],
      wa: row[COL.WANUM - 1],
      waIntl: getWAUrlNumber(row[COL.WANUM - 1]),
      property: row[COL.PROPERTY - 1],
      price: row[COL.PRICE - 1],
      status: row[COL.STATUS - 1],
      priority: row[COL.PRIORITY - 1],
      commission: row[COL.COMMISSION - 1],
      touch: row[COL.TOUCH - 1],
      lastContact: safeIsoString(rawLastContact),
      daysStale: row[COL.DAYS_STALE - 1],
      nextAction: row[COL.NEXT_ACTION - 1],
      dsr: row[COL.DSR_STATUS - 1],
      scriptRef: row[COL.SCRIPT_REF - 1],
      notes: row[COL.NOTES - 1],
      ghostStage: row[COL.GHOST_STAGE - 1]
    });
  }
  return leads;
}

function getDashboardStats() {
  const leads = getAllLeads();
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.status === 'Hot').length;
  const appointments = leads.filter(l => l.status === 'Appointment').length;
  const closing = leads.filter(l => l.status === 'Closing').length;
  const ghosts = leads.filter(l => l.status === 'Ghost').length;
  
  // STATS BARU: Mengira jumlah lead yang berjaya di-revive (Logik v2.0)
  const revivedLeads = leads.filter(l => l.notes && l.notes.includes('[REVIVED]')).length;
  
  const conversionRate = totalLeads > 0 ? Math.round(((appointments + closing) / totalLeads) * 100) : 0;
  const pipelineValue = leads.filter(l => l.status === 'Hot' || l.status === 'Appointment' || l.status === 'Closing').reduce((sum, l) => sum + (Number(l.price) || 0), 0);
  const estCommission = Math.round(pipelineValue * 0.03);
  const funnel = ['Cold', 'Warm', 'Hot', 'Appointment', 'Closing', 'Ghost'].map(label => ({
    label: label,
    count: leads.filter(l => l.status === label).length
  }));
  return { totalLeads, hotLeads, appointments, closing, ghosts, revivedLeads, conversionRate, pipelineValue, estCommission, funnel };
}

function getDashboardStatsByClient(clientName) {
  const leads = getLeadsByClient(clientName);
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.status === 'Hot').length;
  const appointments = leads.filter(l => l.status === 'Appointment').length;
  const closing = leads.filter(l => l.status === 'Closing').length;
  
  // STATS BARU UNTUK KLIEN: Tunjukkan lead yang berjaya diselamatkan (Value Proof!)
  const revivedLeads = leads.filter(l => l.notes && l.notes.includes('[REVIVED]')).length;
  
  const conversionRate = totalLeads > 0 ? Math.round(((appointments + closing) / totalLeads) * 100) : 0;
  const pipelineValue = leads.filter(l => l.status === 'Hot' || l.status === 'Appointment' || l.status === 'Closing').reduce((sum, l) => sum + (Number(l.price) || 0), 0);
  const estCommission = Math.round(pipelineValue * 0.03);
  const funnel = ['Cold', 'Warm', 'Hot', 'Appointment', 'Closing', 'Ghost'].map(label => ({
    label: label,
    count: leads.filter(l => l.status === label).length
  }));
  return { totalLeads, hotLeads, appointments, closing, revivedLeads, conversionRate, pipelineValue, estCommission, funnel };
}

function getLeadsByClient(clientName) {
  const all = getAllLeads();
  return all.filter(l => (l.client || '').toString().trim().toLowerCase() === clientName.trim().toLowerCase());
}

function getAppointmentsByClient(clientName) {
  const leads = getLeadsByClient(clientName);
  return leads.filter(l => l.status === 'Appointment' || l.status === 'Closing').map(l => ({
    rowIndex: l.rowIndex,
    leadId: l.leadId,
    name: l.name,
    wa: l.wa,
    property: l.property,
    price: l.price,
    status: l.status,
    date: l.lastContact,
    time: l.nextAction
  }));
}

function getAllAppointments() {
  const leads = getAllLeads();
  return leads.filter(l => l.status === 'Appointment' || l.status === 'Closing').map(l => ({
    rowIndex: l.rowIndex,
    leadId: l.leadId,
    name: l.name,
    wa: l.wa,
    property: l.property,
    price: l.price,
    status: l.status,
    date: l.lastContact,
    time: l.nextAction,
    client: l.client
  }));
}

function getEngineLog() {
  const sheet = getEngine();
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const logs = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    logs.push({
      timestamp: row[1],
      name: row[2],
      channel: row[3],
      response: row[4],
      touch: row[5],
      status: row[6],
      script: row[7],
      notes: row[8]
    });
  }
  return logs.reverse();
}

function getGhostLeads() {
  const leads = getAllLeads();
  return leads.filter(l => l.status === 'Ghost').map(l => ({
    rowIndex: l.rowIndex,
    leadId: l.leadId,
    name: l.name,
    wa: l.wa,
    property: l.property,
    ghostedSince: l.lastContact,
    daysCold: l.daysStale,
    stage: l.ghostStage || 1,
    script: l.scriptRef || '',
    outcome: l.notes && l.notes.includes('Revived') ? 'Revived' : 'Pending'
  }));
}

function runGhostCheck() {
  const sheet = getWarRoom();
  if (!sheet) return { flagged: 0 };
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return { flagged: 0 };
  let flagged = 0;
  const now = new Date();
  for (let i = 1; i < data.length; i++) {
    const lastContact = data[i][COL.LAST_CONTACT - 1];
    const status = data[i][COL.STATUS - 1];
    if (status !== 'Ghost' && lastContact) {
      const days = Math.floor((now - new Date(lastContact)) / (1000 * 60 * 60 * 24));
      if (days >= 7) {
        sheet.getRange(i + 1, COL.STATUS).setValue('Ghost');
        sheet.getRange(i + 1, COL.DAYS_STALE).setValue(days);
        if (!data[i][COL.GHOST_STAGE - 1]) {
          sheet.getRange(i + 1, COL.GHOST_STAGE).setValue(1);
        }
        flagged++;
      }
    }
  }
  return { flagged: flagged };
}

function addLead(data) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const sheet = getWarRoom();
    if (!sheet) throw new Error('War Room tidak dijumpai');
    const lastRow = sheet.getLastRow();
    const leadId = 'ZK-' + (1000 + lastRow);
    const now = new Date();
    
    let lastContactDate = now;
    if (data.lastContact) {
      const temp = new Date(data.lastContact);
      if (!isNaN(temp.getTime())) lastContactDate = temp;
    }
    
    const statusWeight = STATUS_WEIGHTS[data.status] || 1;
    const touchBonus = (data.touch || 1) * 0.5;
    const priority = Math.round((statusWeight * 10) + touchBonus);
    const daysStale = Math.floor((now - lastContactDate) / (86400000));
    const formattedWa = formatWhatsAppNumber(data.wa);
    
    const rowData = [
      data.client || 'Unknown',
      leadId,
      data.name,
      formattedWa,
      data.property || '',
      data.price || 0,
      data.status || 'Cold',
      priority,
      Math.round((data.price || 0) * 0.03),
      data.touch || 1,
      lastContactDate,
      daysStale,
      data.nextAction || 'First touch',
      data.dsr || '-',
      '',
      data.notes || '',
      data.status === 'Ghost' ? 1 : ''
    ];
    sheet.appendRow(rowData);
    autoSortWarRoom();
    return { success: true, leadId: leadId };
  } finally {
    lock.releaseLock();
  }
}

function updateLead(data) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const sheet = getWarRoom();
    if (!sheet) throw new Error('War Room tidak dijumpai');
    
    // Cari baris sebenar secara dinamik berdasarkan LEAD ID
    const row = findRowByLeadId(sheet, data.leadId);
    
    const statusWeight = STATUS_WEIGHTS[data.status] || 1;
    const touchBonus = (data.touch || 1) * 0.5;
    const priority = Math.round((statusWeight * 10) + touchBonus);
    const now = new Date();
    
    let lastContactDate = now;
    if (data.lastContact) {
      const temp = new Date(data.lastContact);
      if (!isNaN(temp.getTime())) lastContactDate = temp;
    }
    
    const daysStale = Math.floor((now - lastContactDate) / (86400000));
    const formattedWa = formatWhatsAppNumber(data.wa);
    
    // AUTOMATIC REVIVED TAGGING (SOP v2.0):
    // Jika status dahulu adalah 'Ghost' dan status baharu bukan 'Ghost', sistem auto-tag [REVIVED]
    const oldStatus = sheet.getRange(row, COL.STATUS).getValue();
    let notes = data.notes || '';
    if (oldStatus === 'Ghost' && data.status !== 'Ghost' && !notes.includes('[REVIVED]')) {
      notes = notes ? notes + ' | [REVIVED]' : '[REVIVED]';
    }
    
    sheet.getRange(row, COL.CLIENT).setValue(data.client || 'Unknown');
    sheet.getRange(row, COL.NAME).setValue(data.name);
    sheet.getRange(row, COL.WANUM).setValue(formattedWa);
    sheet.getRange(row, COL.PROPERTY).setValue(data.property || '');
    sheet.getRange(row, COL.PRICE).setValue(data.price || 0);
    sheet.getRange(row, COL.STATUS).setValue(data.status || 'Cold');
    sheet.getRange(row, COL.PRIORITY).setValue(priority);
    sheet.getRange(row, COL.COMMISSION).setValue(Math.round((data.price || 0) * 0.03));
    sheet.getRange(row, COL.TOUCH).setValue(data.touch || 1);
    sheet.getRange(row, COL.LAST_CONTACT).setValue(lastContactDate);
    sheet.getRange(row, COL.DAYS_STALE).setValue(daysStale);
    sheet.getRange(row, COL.NEXT_ACTION).setValue(data.nextAction || '');
    sheet.getRange(row, COL.DSR_STATUS).setValue(data.dsr || '-');
    sheet.getRange(row, COL.NOTES).setValue(notes);
    
    autoSortWarRoom();
    return { success: true };
  } finally {
    lock.releaseLock();
  }
}

function deleteLead(leadId) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const sheet = getWarRoom();
    if (!sheet) throw new Error('War Room tidak dijumpai');
    const row = findRowByLeadId(sheet, leadId);
    sheet.deleteRow(row);
    return { success: true };
  } finally {
    lock.releaseLock();
  }
}

function generateWALink(data) {
  const leads = getAllLeads();
  const lead = leads.find(l => l.leadId === data.leadId);
  if (!lead) return { success: false, error: 'Lead tidak dijumpai' };
  
  const waNum = getWAUrlNumber(lead.wa);
  if (!waNum || waNum.length < 8) return { success: false, error: 'Nombor WhatsApp tidak sah' };
  
  const message = encodeURIComponent('Hi ' + lead.name + ', ini adalah susulan berkenaan dengan ' + (lead.property || 'pertanyaan hartanah anda') + '.');
  const url = 'https://wa.me/' + waNum + '?text=' + message;
  return { success: true, url: url };
}

function getBroadcastScript(status, touchNum) {
  const brain = getSystemBrain();
  if (!brain) return null;
  const data = brain.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toLowerCase() === String(status).trim().toLowerCase()) {
      const col = Math.min(touchNum, 7);
      return data[i][col] || null;
    }
  }
  return null;
}

function buildBroadcastQueue(filters) {
  const leads = getAllLeads();
  const filtered = leads.filter(l => {
    if (filters.client && (l.client || '').toString().trim().toLowerCase() !== filters.client.trim().toLowerCase()) return false;
    if (filters.status && l.status !== filters.status) return false;
    if (filters.minDaysStale && (Number(l.daysStale) || 0) < filters.minDaysStale) return false;
    if (!l.wa) return false;
    return true;
  });

  const queue = filtered.map(l => {
    const waNum = getWAUrlNumber(l.wa);
    const touchNum = (Number(l.touch) || 0) + 1;
    let script = getBroadcastScript(l.status, touchNum);
    if (!script) {
      script = 'Hi ' + l.name + ', following up on ' + (l.property || 'your property inquiry') + '. Any updates?';
    } else {
      script = script.replace(/\[Name\]/g, l.name).replace(/\[Area\]/g, l.property || 'the area');
    }
    const message = encodeURIComponent(script);
    return {
      rowIndex: l.rowIndex,
      leadId: l.leadId,
      name: l.name,
      wa: l.wa,
      property: l.property,
      status: l.status,
      touch: l.touch,
      daysStale: l.daysStale,
      script: script,
      url: (waNum && waNum.length >= 8) ? ('https://wa.me/' + waNum + '?text=' + message) : null,
      valid: !!(waNum && waNum.length >= 8)
    };
  });

  return { count: queue.length, queue: queue };
}

function markBroadcastSent(leadId) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const sheet = getWarRoom();
    if (!sheet) throw new Error('War Room tidak dijumpai');
    const row = findRowByLeadId(sheet, leadId);
    
    const currentTouch = Number(sheet.getRange(row, COL.TOUCH).getValue()) || 0;
    const now = new Date();
    sheet.getRange(row, COL.TOUCH).setValue(currentTouch + 1);
    sheet.getRange(row, COL.LAST_CONTACT).setValue(now);
    sheet.getRange(row, COL.DAYS_STALE).setValue(0);

    const engine = getEngine();
    if (engine) {
      const name = sheet.getRange(row, COL.NAME).getValue();
      const status = sheet.getRange(row, COL.STATUS).getValue();
      engine.appendRow(['', now, name, 'WhatsApp (Broadcast)', 'Sent', currentTouch + 1, status, '', 'Broadcast queue send']);
    }
    return { success: true };
  } finally {
    lock.releaseLock();
  }
}

function getTomorrowAppointments() {
  const leads = getAllLeads();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toDateString();

  return leads.filter(l => {
    if (l.status !== 'Appointment') return false;
    if (!l.lastContact) return false;
    const apptDate = new Date(l.lastContact);
    return apptDate.toDateString() === tomorrowStr;
  }).map(l => {
    const waNum = getWAUrlNumber(l.wa);
    const script = 'Hi ' + l.name + ', reminder for your viewing tomorrow' +
      (l.nextAction ? ' at ' + l.nextAction : '') +
      ' for ' + (l.property || 'the property') + '. See you there!';
    const message = encodeURIComponent(script);
    return {
      rowIndex: l.rowIndex,
      leadId: l.leadId,
      name: l.name,
      wa: l.wa,
      property: l.property,
      time: l.nextAction,
      client: l.client,
      script: script,
      url: (waNum && waNum.length >= 8) ? ('https://wa.me/' + waNum + '?text=' + message) : null,
      valid: !!(waNum && waNum.length >= 8)
    };
  });
}

function markReminderSent(leadId) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const sheet = getWarRoom();
    if (!sheet) throw new Error('War Room tidak dijumpai');
    const row = findRowByLeadId(sheet, leadId);
    
    const currentNotes = sheet.getRange(row, COL.NOTES).getValue() || '';
    const tag = '[REMINDER SENT — ' + new Date().toLocaleDateString('en-MY') + ']';
    if (!currentNotes.includes('[REMINDER SENT')) {
      sheet.getRange(row, COL.NOTES).setValue(currentNotes ? currentNotes + ' | ' + tag : tag);
    }
    return { success: true };
  } finally {
    lock.releaseLock();
  }
}

function runDailyReminderCheck() {
  const appts = getTomorrowAppointments();
  const engine = getEngine();
  if (engine && appts.length > 0) {
    engine.appendRow(['', new Date(), 'System', 'Auto-Check', 'Info', '', '', '', appts.length + ' appointment(s) found for tomorrow']);
  }
  return { found: appts.length };
}

function autoSortWarRoom() {
  const sheet = getWarRoom();
  if (!sheet) return;
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2) return;
  const range = sheet.getRange(2, 1, lastRow - 1, lastCol);
  range.sort([{ column: COL.PRIORITY, ascending: false }, { column: COL.DAYS_STALE, ascending: false }]);
  const statusColors = { 'Hot': '#FFCDD2', 'Warm': '#FFE0B2', 'Cold': '#BBDEFB', 'Appointment': '#C8E6C9', 'Closing': '#E1BEE7', 'Ghost': '#E0E0E0' };
  for (let i = 2; i <= lastRow; i++) {
    const status = sheet.getRange(i, COL.STATUS).getValue();
    const color = statusColors[status] || '#FFFFFF';
    sheet.getRange(i, COL.STATUS).setBackground(color);
  }
}

function importLeadsFromCSV(rawData, client) {
  const lines = rawData.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return { imported: 0 };
  let imported = 0;
  const delimiter = rawData.includes('\t') ? '\t' : rawData.includes('|') ? '|' : ',';
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(delimiter).map(c => c.trim());
    if (cols.length < 2) continue;
    const data = {
      client: client || 'Unknown',
      name: cols[0],
      wa: cols[1],
      property: cols[2] || '',
      price: Number(cols[3]) || 0,
      status: cols[4] || 'Cold',
      touch: 1,
      lastContact: new Date().toISOString().split('T')[0],
      nextAction: 'First touch',
      dsr: '-',
      notes: ''
    };
    addLead(data); 
    imported++;
  }
  return { imported: imported };
}

function calculateDSR(data) {
  const income = data.income || 0;
  const commitments = data.commitments || 0;
  const loan = data.loan || 0;
  const tenure = data.tenure || 35;
  const rate = 0.045;
  const months = tenure * 12;
  const monthlyRate = rate / 12;
  const installment = loan * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalCommitment = commitments + installment;
  const dsr = income > 0 ? Math.round((totalCommitment / income) * 100) : 0;
  const maxDSR = 70;
  const maxLoan = (income * (maxDSR / 100) - commitments) / (monthlyRate * Math.pow(1 + monthlyRate, months)) * (Math.pow(1 + monthlyRate, months) - 1);
  const verdict = dsr <= 30 ? 'Strong' : dsr <= 70 ? 'Borderline' : 'Over';
  return { installment: installment, totalCommitment: totalCommitment, dsr: dsr, maxLoan: maxLoan, verdict: verdict };
}

function generateClientToken(data) {
  let name = '';
  if (typeof data === 'string') {
    name = data.trim();
  } else if (data && data.name) {
    name = data.name.trim();
  }

  if (!name || name === '') {
    const all = listClients();
    return { success: false, error: 'Client name required. Existing clients: ' + all.map(c => c.name).join(', ') };
  }

  const token = Utilities.getUuid().substring(0, 12);
  PropertiesService.getScriptProperties().setProperty('token_' + name, token);
  const url = ScriptApp.getService().getUrl() + '?client=' + encodeURIComponent(name) + '&token=' + token;

  // Save additional fields to Active Clients sheet if it exists
  const sheet = getSheet(SHEET_NAMES.ACTIVE_CLIENTS);
  if (sheet) {
    const lastRow = sheet.getLastRow();
    let targetRow = -1;
    if (lastRow >= 4) {
      const names = sheet.getRange(4, 2, lastRow - 3, 1).getValues();
      for (let i = 0; i < names.length; i++) {
        if (names[i][0].toString().trim().toLowerCase() === name.toLowerCase()) {
          targetRow = i + 4;
          break;
        }
      }
    }

    if (targetRow === -1) {
      targetRow = Math.max(4, lastRow + 1);
      sheet.getRange(targetRow, 2).setValue(name); // B
    }
    
    if (typeof data === 'object') {
      sheet.getRange(targetRow, 3).setValue(data.agency || ''); // C
      sheet.getRange(targetRow, 6).setValue(data.status || 'Active'); // F
      sheet.getRange(targetRow, 7).setValue(data.notes || ''); // G
    }
  }

  return { success: true, name: name, token: token, url: url };
}

// Client Portal Token Check & Redirect
function getClientUrl(clientName) {
  if (!clientName) return null;
  const token = PropertiesService.getScriptProperties().getProperty('token_' + clientName);
  if (!token) return null;
  return ScriptApp.getService().getUrl() + '?client=' + encodeURIComponent(clientName) + '&token=' + token;
}

function listClients() {
  const props = PropertiesService.getScriptProperties().getProperties();
  const clients = [];
  for (const key in props) {
    if (key.startsWith('token_')) {
      const name = key.replace('token_', '');
      const url = ScriptApp.getService().getUrl() + '?client=' + encodeURIComponent(name) + '&token=' + props[key];
      const leadCount = getLeadsByClient(name).length;
      clients.push({ name: name, token: props[key], url: url, leadCount: leadCount });
    }
  }
  return clients;
}

function revokeClientToken(clientName) {
  if (!clientName) return { success: false };
  PropertiesService.getScriptProperties().deleteProperty('token_' + clientName);
  return { success: true };
}

function flagLeadForAttention(leadId, clientName, reason) {
  const sheet = getWarRoom();
  if (!sheet) throw new Error('War Room tidak dijumpai');
  const row = findRowByLeadId(sheet, leadId);
  const currentNotes = sheet.getRange(row, COL.NOTES).getValue() || '';
  const flagText = '[FLAGGED by ' + clientName + ': ' + reason + ' — ' + new Date().toLocaleDateString('en-MY') + ']';
  const newNotes = currentNotes ? currentNotes + ' | ' + flagText : flagText;
  sheet.getRange(row, COL.NOTES).setValue(newNotes);
  const engine = getEngine();
  if (engine) {
    const name = sheet.getRange(row, COL.NAME).getValue();
    const status = sheet.getRange(row, COL.STATUS).getValue();
    engine.appendRow(['', new Date(), name, 'Client Portal', 'Flagged', '', status, '', 'Flagged by ' + clientName + ': ' + reason]);
  }
  return { success: true };
}

function getFlaggedLeads() {
  const leads = getAllLeads();
  return leads.filter(l => l.notes && l.notes.includes('[FLAGGED')).map(l => {
    const match = l.notes.match(/\[FLAGGED by ([^:]+): ([^\]]+)\]/);
    return {
      rowIndex: l.rowIndex,
      leadId: l.leadId,
      client: l.client,
      name: l.name,
      wa: l.wa,
      property: l.property,
      status: l.status,
      flagReason: match ? match[2] : 'Flagged',
      flaggedBy: match ? match[1] : 'Client',
      notes: l.notes
    };
  });
}

function clearLeadFlag(leadId) {
  const sheet = getWarRoom();
  if (!sheet) throw new Error('War Room tidak dijumpai');
  const row = findRowByLeadId(sheet, leadId);
  const currentNotes = sheet.getRange(row, COL.NOTES).getValue() || '';
  const newNotes = currentNotes.replace(/\s*\[FLAGGED[^\]]*\]/g, '').trim();
  sheet.getRange(row, COL.NOTES).setValue(newNotes);
  return { success: true };
}

function updateClient(data) {
  const sheet = getSheet(SHEET_NAMES.ACTIVE_CLIENTS);
  if (!sheet) return;
  const lastRow = sheet.getLastRow();
  let foundRow = -1;

  if (lastRow >= 4) {
    const names = sheet.getRange(4, 2, lastRow - 3, 1).getValues();
    for (let i = 0; i < names.length; i++) {
      if (names[i][0].toString().trim().toLowerCase() === data.name.toLowerCase()) {
        foundRow = i + 4;
        break;
      }
    }
  }

  if (foundRow !== -1) {
    sheet.getRange(foundRow, 3).setValue(data.agency); // C
    sheet.getRange(foundRow, 6).setValue(data.status); // F
    sheet.getRange(foundRow, 7).setValue(data.notes);  // G
  } else {
    generateClientToken(data); // Creates new client with token
  }
}
