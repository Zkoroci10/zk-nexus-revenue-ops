// ═══════════════════════════════════════════════════════════════════
// ZK REVENUE OPERATIONS — UNIFIED CRM BACKEND & API (v2.0)
// ═══════════════════════════════════════════════════════════════════

// Styling theme tokens
const CC = {
  BG:'#0D0D0F', SURFACE:'#16171B', CARD:'#1C1D23', BORDER:'#25262C',
  TEXT:'#E8E6DD', MUTED:'#8B8A82', GOLD:'#C9A84C',
  COLD_BG:'#141618', COLD_FG:'#6A9AB0',
  WARM_BG:'#2A1F0D', WARM_FG:'#D4942E',
  HOT_BG:'#2D1515', HOT_FG:'#FF8080',
  SIGNED_BG:'#112D1A', SIGNED_FG:'#4EB87A',
  LOST_BG:'#1A1530', LOST_FG:'#9585D8',
  RED:'#E24B4A', GREEN:'#4CAF70', BLUE:'#378ADD'
};

// Sheet configuration names
const SHEET_NAMES = {
  DASHBOARD: 'Dashboard',
  ACTIVE_CLIENTS: 'Active Clients',
  PROSPECTS: 'Prospects',
  WAR_ROOM: 'War Room',
  ACTIVITY_LOG: 'Activity Log'
};

// Column mapping indices (1-indexed for Apps Script range operations)
const COL_PROS = {
  NAME: 2, AREA: 3, STATE: 4, AGENCY: 5, WA: 6, CHANNEL: 7, 
  STATUS: 8, NEEDS: 9, TOUCH: 10, LAST_CONTACT: 11, NEXT_FOLLOWUP: 12, NOTES: 13
};

const COL_WAR = {
  CLIENT: 1, LEAD_ID: 2, NAME: 3, WA: 4, PROPERTY: 5, PRICE: 6,
  STATUS: 7, PRIORITY: 8, COMMISSION: 9, TOUCH: 10,
  LAST_CONTACT: 11, DAYS_STALE: 12, NEXT_ACTION: 13,
  DSR_STATUS: 14, SCRIPT_REF: 15, NOTES: 16, GHOST_STAGE: 17
};

const STATUS_WEIGHTS = { 'Hot': 5, 'Warm': 3, 'Cold': 1, 'Appointment': 4, 'Closing': 5, 'Ghost': 0 };

// ═══════════════════════════════════════════════════════════════════
// 1. ROUTER: WEB APP ENDPOINTS (doGet & doPost)
// ═══════════════════════════════════════════════════════════════════

function doGet(e) {
  const client = e.parameter.client;
  const token = e.parameter.token;
  
  // If client credentials are supplied, route to Client Portal
  if (client && token) {
    const validToken = PropertiesService.getScriptProperties().getProperty('token_' + client);
    if (validToken === token) {
      let template;
      try {
        template = HtmlService.createTemplateFromFile('ClientPortal');
      } catch(err1) {
        try {
          template = HtmlService.createTemplateFromFile('client-portal');
        } catch(err2) {
          return HtmlService.createHtmlOutput('<h2>Deployment Error</h2><p>HTML template (ClientPortal or client-portal) was not found in Apps Script.</p>');
        }
      }
      
      template.clientName = client;
      return template.evaluate()
        .setTitle('My Dashboard — ' + client)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }
    return HtmlService.createHtmlOutput('<h2>Access Denied</h2><p>Invalid or expired portal token.</p>');
  }
  
  // Else, default to Operator/SDR Internal Console
  let htmlOutput;
  try {
    htmlOutput = HtmlService.createHtmlOutputFromFile('OperatorConsole');
  } catch(err1) {
    try {
      htmlOutput = HtmlService.createHtmlOutputFromFile('operator-console');
    } catch(err2) {
      try {
        htmlOutput = HtmlService.createHtmlOutputFromFile('WebApp_Frontend');
      } catch(err3) {
        return HtmlService.createHtmlOutput('<h2>Deployment Error</h2><p>HTML file (OperatorConsole, operator-console, or WebApp_Frontend) was not found in Apps Script.</p>');
      }
    }
  }
  
  return htmlOutput
    .setTitle('ZK Revenue Ops — Internal Panel')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Webhook Inbound POST Receiver (Facebook Ads / Web Forms / API)
 */
function doPost(e) {
  try {
    const jsonString = e.postData.getDataAsString();
    const data = JSON.parse(jsonString);
    
    // Check if the payload is a Buyer Lead for War Room (if client property exists)
    if (data.client) {
      const result = addLead(data);
      return ContentService.createTextOutput(JSON.stringify({status: 'success', source: 'War Room', leadId: result.leadId}))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Else, treat as Outbound REN Prospect for Prospects sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAMES.PROSPECTS);
    if (!sheet) throw new Error('Prospects tab not found.');
    
    const targetRow = sheet.getLastRow() + 1;
    sheet.getRange(targetRow, COL_PROS.NAME).setValue(data.name || 'Unknown Agent');
    sheet.getRange(targetRow, COL_PROS.AREA).setValue(data.area || 'TBD');
    sheet.getRange(targetRow, COL_PROS.STATE).setValue(data.state || 'TBD');
    sheet.getRange(targetRow, COL_PROS.AGENCY).setValue(data.agency || 'TBD');
    sheet.getRange(targetRow, COL_PROS.WA).setValue(formatWhatsAppNumber(data.phone || data.wa));
    sheet.getRange(targetRow, COL_PROS.CHANNEL).setValue(data.channel || 'Webhook');
    sheet.getRange(targetRow, COL_PROS.STATUS).setValue(data.status || 'Cold');
    sheet.getRange(targetRow, COL_PROS.NEEDS).setValue(data.needs || 'Outreach setup');
    sheet.getRange(targetRow, COL_PROS.TOUCH).setValue(0);
    sheet.getRange(targetRow, COL_PROS.NOTES).setValue('Added via API on ' + new Date().toLocaleString());
    
    const act = ss.getSheetByName(SHEET_NAMES.ACTIVITY_LOG);
    if (act) {
      act.appendRow(['', new Date(), data.name || 'Unknown Agent', 'Webhook', 'Replied', 0, data.status || 'Cold', 'Prospect created via API Webhook']);
    }
    
    return ContentService.createTextOutput(JSON.stringify({status: 'success', source: 'Prospects', row: targetRow}))
                         .setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// ═══════════════════════════════════════════════════════════════════
// 2. SETUP: REBUILD GOOGLE SHEET DATABASE
// ═══════════════════════════════════════════════════════════════════

function buildCRM_Pipeline_All() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Create or retrieve Dashboard sheet first
  let dash = ss.getSheetByName(SHEET_NAMES.DASHBOARD);
  if (!dash) {
    dash = ss.insertSheet(SHEET_NAMES.DASHBOARD, 0);
  }
  
  // 2. Delete all other sheets safely
  const sheets = ss.getSheets();
  sheets.forEach(s => {
    if (s.getName() !== SHEET_NAMES.DASHBOARD) {
      try { ss.deleteSheet(s); } catch(e) {}
    }
  });

  // 3. Rebuild all components
  buildCRM_Part1_Dashboard(dash);
  buildCRM_Part2_ActiveClients(ss);
  buildCRM_Part3_Prospects(ss);
  buildCRM_Part4_WarRoom(ss);
  buildCRM_Part5_ActivityLog(ss);
  
  // 4. Return to Dashboard
  ss.setActiveSheet(dash);
}

function buildCRM_Part1_Dashboard(dash) {
  dash.setTabColor(CC.GOLD);
  dash.getRange(1,1,dash.getMaxRows(),dash.getMaxColumns())
      .setBackground(CC.BG).setFontColor(CC.TEXT);
  dash.setColumnWidth(1,20);
  [2,3,4,5].forEach(c => dash.setColumnWidth(c,160));

  dash.setRowHeight(1,5);
  dash.getRange('A1:E1').setBackground(CC.GOLD);
  dash.setRowHeight(2,44);
  dash.getRange('B2:D2').merge()
      .setValue('CLIENT PIPELINE')
      .setFontSize(15).setFontWeight('bold').setFontColor(CC.GOLD)
      .setBackground(CC.SURFACE).setVerticalAlignment('middle');
  dash.setRowHeight(3,20);
  dash.getRange('B3:D3').merge()
      .setValue('ZK Revenue Ops')
      .setFontSize(9).setFontColor(CC.MUTED).setBackground(CC.SURFACE);

  // KPI Cards
  dash.setRowHeight(5,6); dash.setRowHeight(6,16); dash.setRowHeight(7,38); dash.setRowHeight(8,16);
  const kpis = [
    {col:2, label:'TOTAL PROSPECTS', f:"=COUNTA(Prospects!B4:B)", color:CC.GOLD},
    {col:3, label:'ACTIVE LEADS (WARM/HOT)', f:"=COUNTIF('War Room'!G2:G,\"Warm\")+COUNTIF('War Room'!G2:G,\"Hot\")", color:CC.BLUE},
    {col:4, label:'ACTIVE CLIENTS', f:"=COUNTIF('Active Clients'!F4:F,\"Active\")", color:CC.GREEN},
    {col:5, label:'CONVERSION', f:"=IFERROR(TEXT(COUNTIF(Prospects!H4:H,\"Signed\")/COUNTA(Prospects!B4:B),\"0%\"),\"—\")", color:'#c792ea'}
  ];
  kpis.forEach(k => {
    dash.getRange(5,k.col,4,1).setBackground(CC.CARD);
    dash.getRange(5,k.col).setBorder(true,false,false,false,false,false,k.color,SpreadsheetApp.BorderStyle.SOLID_THICK);
    dash.getRange(6,k.col).setValue(k.label).setFontSize(8).setFontWeight('bold')
        .setFontColor(CC.MUTED).setHorizontalAlignment('center').setVerticalAlignment('middle');
    dash.getRange(7,k.col).setFormula(k.f).setFontSize(26).setFontWeight('bold')
        .setFontColor(k.color).setHorizontalAlignment('center').setVerticalAlignment('middle');
    dash.getRange(8,k.col).setValue('Live').setFontSize(8).setFontColor(CC.GREEN)
        .setHorizontalAlignment('center').setVerticalAlignment('middle');
  });

  // Status Breakdown
  dash.setRowHeight(10,14); dash.setRowHeight(11,18);
  dash.getRange('B11').setValue('STATUS BREAKDOWN')
      .setFontSize(8).setFontWeight('bold').setFontColor(CC.MUTED);
  ['STATUS','COUNT','%'].forEach((h,i) => {
    dash.getRange(12,i+2).setValue(h).setFontSize(8).setFontWeight('bold')
        .setFontColor(CC.MUTED).setBackground(CC.CARD).setHorizontalAlignment('center');
  });
  const statuses = ['Cold','Warm','Hot','Signed','Lost'];
  statuses.forEach((st,i) => {
    const r = 13+i; dash.setRowHeight(r,24);
    dash.getRange(r,2).setValue(st).setFontSize(10).setFontWeight('bold')
        .setFontColor(CC[st.toUpperCase()+'_FG']).setBackground(CC[st.toUpperCase()+'_BG'])
        .setVerticalAlignment('middle');
    dash.getRange(r,3).setFormula(`=COUNTIF(Prospects!H:H,"${st}")`)
        .setFontSize(12).setFontWeight('bold').setFontColor(CC[st.toUpperCase()+'_FG'])
        .setBackground(CC[st.toUpperCase()+'_BG']).setHorizontalAlignment('center');
    dash.getRange(r,4).setFormula(`=IFERROR(TEXT(COUNTIF(Prospects!H:H,"${st}")/COUNTA(Prospects!B4:B),"0%"),"—")`)
        .setFontSize(10).setFontColor(CC[st.toUpperCase()+'_FG'])
        .setBackground(CC[st.toUpperCase()+'_BG']).setHorizontalAlignment('center');
  });
}

function buildCRM_Part2_ActiveClients(ss) {
  let clients = ss.insertSheet(SHEET_NAMES.ACTIVE_CLIENTS, 1);
  clients.setTabColor(CC.GOLD);
  clients.getRange(1,1,clients.getMaxRows(),clients.getMaxColumns())
         .setBackground(CC.BG).setFontColor(CC.TEXT);
  clients.setColumnWidth(1,20); clients.setColumnWidth(2,140); clients.setColumnWidth(3,100);
  clients.setColumnWidth(4,90); clients.setColumnWidth(5,300); clients.setColumnWidth(6,100);
  clients.setColumnWidth(7,250); clients.setColumnWidth(8,20);

  clients.setRowHeight(1,5);
  clients.getRange('A1:H1').setBackground(CC.GOLD);
  clients.setRowHeight(2,40);
  clients.getRange('B2:F2').merge()
          .setValue('ACTIVE CLIENTS')
          .setFontSize(14).setFontWeight('bold').setFontColor(CC.GOLD)
          .setBackground(CC.SURFACE).setVerticalAlignment('middle');

  clients.setRowHeight(3,28);
  const headers = ['','CLIENT NAME','AGENCY','SIGN DATE','LINK TO CLOSING DESK','STATUS','NOTES',''];
  headers.forEach((h,i) => {
    if(!h) return;
    clients.getRange(3,i+1).setValue(h)
            .setFontSize(8).setFontWeight('bold')
            .setFontColor(CC.MUTED).setBackground(CC.CARD)
            .setHorizontalAlignment('center').setVerticalAlignment('middle');
  });

  clients.getRange('F4:F').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['Active','On Hold','Terminated'],true).build()
  );
  clients.getRange('E4:E').setFontColor('#378ADD').setFontLine('underline');

  const rules = [
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$F4="Active"').setBackground('#112D1A').setFontColor('#4EB87A').setRanges([clients.getRange('A4:H')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$F4="On Hold"').setBackground('#2A1F0D').setFontColor('#D4942E').setRanges([clients.getRange('A4:H')]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=$F4="Terminated"').setBackground('#2D1515').setFontColor('#FF8080').setRanges([clients.getRange('A4:H')]).build()
  ];
  clients.setConditionalFormatRules(rules);
  clients.setFrozenRows(3);
}

function buildCRM_Part3_Prospects(ss) {
  let pros = ss.insertSheet(SHEET_NAMES.PROSPECTS, 2);
  pros.setTabColor(CC.BLUE);
  pros.getRange(1,1,pros.getMaxRows(),pros.getMaxColumns())
      .setBackground(CC.BG).setFontColor(CC.TEXT);
  const colWidths = {1:30,2:140,3:100,4:90,5:110,6:120,7:110,8:100,9:180,10:60,11:100,12:100,13:240,14:20};
  Object.entries(colWidths).forEach(([c,v])=>pros.setColumnWidth(+c,v));

  pros.setRowHeight(1,5);
  pros.getRange('A1:N1').setBackground(CC.BLUE);
  pros.setRowHeight(2,40);
  pros.getRange('B2:K2').merge().setValue('PROSPEK REN')
      .setFontSize(14).setFontWeight('bold').setFontColor(CC.BLUE)
      .setBackground(CC.SURFACE).setVerticalAlignment('middle');
  pros.setRowHeight(3,28);
  const headers = ['','NAMA REN','DAERAH','NEGERI','AGENCY','CONTACT (WA)','MEDIA SOSIAL','STATUS','KEPERLUAN','TOUCH','LAST CONTACT','NEXT FOLLOW-UP','FOLLOW-UP NOTES',''];
  headers.forEach((h,i) => {
    if(!h) return;
    pros.getRange(3,i+1).setValue(h).setFontSize(8).setFontWeight('bold')
        .setFontColor(CC.MUTED).setBackground(CC.CARD).setHorizontalAlignment('center')
        .setVerticalAlignment('middle')
        .setBorder(false,false,true,false,false,false,CC.BORDER,SpreadsheetApp.BorderStyle.SOLID);
  });

  pros.getRange('G4:G').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['Facebook','Instagram','LinkedIn','Referral','Lain-lain'],true).build());
  pros.getRange('H4:H').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['Cold','Warm','Hot','Signed','Lost'],true).build());
  pros.getRange('J4:J').setFontColor(CC.TEXT).setHorizontalAlignment('center');
  pros.getRange('K4:K').setNumberFormat('d MMM yyyy').setFontColor(CC.TEXT);
  pros.getRange('L4:L').setNumberFormat('d MMM yyyy').setFontColor(CC.TEXT);

  const statuses = ['Cold','Warm','Hot','Signed','Lost'];
  const cfR = pros.getRange('B4:N');
  const rules = statuses.map(st => SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied(`=$H4="${st}"`)
    .setBackground(CC[st.toUpperCase()+'_BG']).setFontColor(CC[st.toUpperCase()+'_FG'])
    .setRanges([cfR]).build()
  );
  pros.setConditionalFormatRules(rules);
  pros.setFrozenRows(3);
}

function buildCRM_Part4_WarRoom(ss) {
  let war = ss.insertSheet(SHEET_NAMES.WAR_ROOM, 3);
  war.setTabColor(CC.RED);
  war.getRange(1,1,war.getMaxRows(),war.getMaxColumns())
     .setBackground(CC.BG).setFontColor(CC.TEXT);
  const widths = [100, 90, 130, 110, 130, 90, 90, 70, 90, 60, 110, 80, 130, 100, 120, 200, 80];
  widths.forEach((w,i) => war.setColumnWidth(i+1, w));
  
  war.setRowHeight(1, 28);
  const headers = ['CLIENT','LEAD_ID','NAME','WANUM','PROPERTY','PRICE','STATUS','PRIORITY','COMMISSION','TOUCH','LAST_CONTACT','DAYS_STALE','NEXT_ACTION','DSR_STATUS','SCRIPT_REF','NOTES','GHOST_STAGE'];
  headers.forEach((h,i) => {
    war.getRange(1, i+1).setValue(h).setFontSize(9).setFontWeight('bold')
       .setFontColor(CC.MUTED).setBackground(CC.CARD).setHorizontalAlignment('center')
       .setVerticalAlignment('middle');
  });
  war.getRange('G2:G').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['Cold','Warm','Hot','Appointment','Closing','Ghost'],true).build());
  war.getRange('N2:N').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['-','Strong','Borderline','Over'],true).build());
  
  war.setFrozenRows(1);
}

function buildCRM_Part5_ActivityLog(ss) {
  let act = ss.insertSheet(SHEET_NAMES.ACTIVITY_LOG, 4);
  act.setTabColor(CC.GREEN);
  act.getRange(1,1,act.getMaxRows(),act.getMaxColumns())
     .setBackground(CC.BG).setFontColor(CC.TEXT);
  act.setColumnWidth(1,18); act.setColumnWidth(2,130); act.setColumnWidth(3,140);
  act.setColumnWidth(4,110); act.setColumnWidth(5,130); act.setColumnWidth(6,80);
  act.setColumnWidth(7,120); act.setColumnWidth(8,250);

  act.setRowHeight(1,5);
  act.getRange('A1:H1').setBackground(CC.GREEN);
  act.setRowHeight(2,40);
  act.getRange('B2:F2').merge().setValue('ACTIVITY LOG')
      .setFontSize(14).setFontWeight('bold').setFontColor(CC.GREEN)
      .setBackground(CC.SURFACE).setVerticalAlignment('middle');
  act.setRowHeight(3,26);
  ['','TIMESTAMP','REN NAME','CHANNEL','RESPONSE','TOUCH','STATUS UPDATE','NOTES',''].forEach((h,i)=>{
    if(!h) return;
    act.getRange(3,i+1).setValue(h).setFontSize(8).setFontWeight('bold')
        .setFontColor(CC.MUTED).setBackground(CC.CARD).setHorizontalAlignment('center')
        .setVerticalAlignment('middle');
  });
  act.getRange('B4:B').setNumberFormat('d MMM yyyy h:mm am/pm').setFontColor(CC.TEXT);
  act.getRange('D4:D').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['WhatsApp','Call','Instagram','Facebook','Email','Webhook'],true).build());
  act.getRange('E4:E').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['No Reply','Seen','Replied','Interested','Not Interested','Appointment Set','Synced'],true).build());
  act.getRange('G4:G').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['Cold','Warm','Hot','Signed','Lost','—'],true).build());
  act.setFrozenRows(3);
}

// ═══════════════════════════════════════════════════════════════════
// 3. API METHOD REGISTRY: READ & WRITE OPERATIONS
// ═══════════════════════════════════════════════════════════════════

function getSheet(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

// --- HELPER: Format local numbers (01xxxxxxxx) ---
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

// --- HELPER: Convert to API WA Format (601xxxxxxxx) ---
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

function findRowByLeadId(sheet, leadId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) throw new Error("Database is empty.");
  const data = sheet.getRange(2, COL_WAR.LEAD_ID, lastRow - 1, 1).getValues();
  for (let i = 0; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(leadId).trim()) {
      return i + 2; 
    }
  }
  throw new Error("Lead ID '" + leadId + "' not found.");
}

// --- BUYER LEADS APIs (War Room) ---
function getAllLeads() {
  const sheet = getSheet(SHEET_NAMES.WAR_ROOM);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const leads = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    leads.push({
      rowIndex: i + 1,
      client: row[COL_WAR.CLIENT - 1],
      leadId: row[COL_WAR.LEAD_ID - 1],
      name: row[COL_WAR.NAME - 1],
      wa: row[COL_WAR.WA - 1],
      property: row[COL_WAR.PROPERTY - 1],
      price: row[COL_WAR.PRICE - 1],
      status: row[COL_WAR.STATUS - 1],
      priority: row[COL_WAR.PRIORITY - 1],
      commission: row[COL_WAR.COMMISSION - 1],
      touch: row[COL_WAR.TOUCH - 1],
      lastContact: safeIsoString(row[COL_WAR.LAST_CONTACT - 1]),
      daysStale: row[COL_WAR.DAYS_STALE - 1],
      nextAction: row[COL_WAR.NEXT_ACTION - 1],
      dsr: row[COL_WAR.DSR_STATUS - 1],
      scriptRef: row[COL_WAR.SCRIPT_REF - 1],
      notes: row[COL_WAR.NOTES - 1],
      ghostStage: row[COL_WAR.GHOST_STAGE - 1]
    });
  }
  return leads;
}

function getLeadsByClient(clientName) {
  const all = getAllLeads();
  return all.filter(l => (l.client || '').toString().trim().toLowerCase() === clientName.trim().toLowerCase());
}

function getDashboardStats() {
  const leads = getAllLeads();
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.status === 'Hot').length;
  const appointments = leads.filter(l => l.status === 'Appointment').length;
  const closing = leads.filter(l => l.status === 'Closing').length;
  const ghosts = leads.filter(l => l.status === 'Ghost').length;
  const revivedLeads = leads.filter(l => l.notes && l.notes.includes('[REVIVED]')).length;
  
  const pipelineValue = leads.filter(l => ['Hot','Appointment','Closing'].includes(l.status)).reduce((sum, l) => sum + (Number(l.price) || 0), 0);
  const estCommission = Math.round(pipelineValue * 0.03);
  const funnel = ['Cold', 'Warm', 'Hot', 'Appointment', 'Closing', 'Ghost'].map(label => ({
    label: label,
    count: leads.filter(l => l.status === label).length
  }));
  return { totalLeads, hotLeads, appointments, closing, ghosts, revivedLeads, pipelineValue, estCommission, funnel };
}

function getDashboardStatsByClient(clientName) {
  const leads = getLeadsByClient(clientName);
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.status === 'Hot').length;
  const appointments = leads.filter(l => l.status === 'Appointment').length;
  const closing = leads.filter(l => l.status === 'Closing').length;
  const revivedLeads = leads.filter(l => l.notes && l.notes.includes('[REVIVED]')).length;
  
  const pipelineValue = leads.filter(l => ['Hot','Appointment','Closing'].includes(l.status)).reduce((sum, l) => sum + (Number(l.price) || 0), 0);
  const estCommission = Math.round(pipelineValue * 0.03);
  const funnel = ['Cold', 'Warm', 'Hot', 'Appointment', 'Closing', 'Ghost'].map(label => ({
    label: label,
    count: leads.filter(l => l.status === label).length
  }));
  return { totalLeads, hotLeads, appointments, closing, revivedLeads, pipelineValue, estCommission, funnel };
}

function addLead(data) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const sheet = getSheet(SHEET_NAMES.WAR_ROOM);
    if (!sheet) throw new Error('War Room tab not found.');
    
    const now = new Date();
    const incomingWa = getWAUrlNumber(data.wa);
    
    // --- SMART DEDUPLICATION & GHOST AUTO-REVIVAL CHECK ---
    const lastRow = sheet.getLastRow();
    let existingRowIndex = -1;
    let existingLeadId = '';
    let existingStatus = '';
    let existingNotes = '';
    let existingTouch = 1;
    
    if (lastRow >= 2) {
      const db = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
      for (let i = 0; i < db.length; i++) {
        const dbWa = getWAUrlNumber(db[i][COL_WAR.WA - 1]);
        if (dbWa && dbWa === incomingWa) {
          existingRowIndex = i + 2;
          existingLeadId = db[i][COL_WAR.LEAD_ID - 1];
          existingStatus = db[i][COL_WAR.STATUS - 1];
          existingNotes = db[i][COL_WAR.NOTES - 1];
          existingTouch = Number(db[i][COL_WAR.TOUCH - 1]) || 1;
          break;
        }
      }
    }
    
    if (existingRowIndex !== -1) {
      // Lead already exists!
      let newStatus = existingStatus;
      let newNotes = existingNotes;
      let touchCount = existingTouch;
      
      if (existingStatus === 'Ghost') {
        newStatus = 'Warm'; // Automatically revive to Warm
        touchCount += 1;
        const tag = '[REVIVED via Webhook — ' + now.toLocaleDateString('en-MY') + ']';
        newNotes = newNotes ? newNotes + ' | ' + tag : tag;
        
        // Log to activity log
        const engine = getSheet(SHEET_NAMES.ACTIVITY_LOG);
        if (engine) {
          engine.appendRow(['', now, data.name, 'Webhook', 'Replied', touchCount, 'Warm', 'Lead revived from Ghost via Webhook form re-submission']);
        }
      } else {
        const tag = '[Form Re-submitted — ' + now.toLocaleDateString('en-MY') + ']';
        newNotes = newNotes ? newNotes + ' | ' + tag : tag;
      }
      
      // Update existing lead row details
      sheet.getRange(existingRowIndex, COL_WAR.STATUS).setValue(newStatus);
      sheet.getRange(existingRowIndex, COL_WAR.NOTES).setValue(newNotes);
      sheet.getRange(existingRowIndex, COL_WAR.TOUCH).setValue(touchCount);
      sheet.getRange(existingRowIndex, COL_WAR.LAST_CONTACT).setValue(now);
      sheet.getRange(existingRowIndex, COL_WAR.DAYS_STALE).setValue(0);
      if (data.property) sheet.getRange(existingRowIndex, COL_WAR.PROPERTY).setValue(data.property);
      if (data.price) sheet.getRange(existingRowIndex, COL_WAR.PRICE).setValue(Number(data.price));
      
      autoSortWarRoom();
      return { success: true, leadId: existingLeadId, status: 'revived_or_updated' };
    }
    
    // Completely new lead
    const leadId = 'ZK-' + (1000 + lastRow + 1);
    let lastContactDate = now;
    if (data.lastContact) {
      const temp = new Date(data.lastContact);
      if (!isNaN(temp.getTime())) lastContactDate = temp;
    }
    
    const statusWeight = STATUS_WEIGHTS[data.status || 'Cold'] || 1;
    const touchBonus = (data.touch || 1) * 0.5;
    const priority = Math.round((statusWeight * 10) + touchBonus);
    const daysStale = Math.floor((now - lastContactDate) / (86400000));
    
    const rowData = [
      data.client || 'Unknown',
      leadId,
      data.name,
      formatWhatsAppNumber(data.wa),
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
    return { success: true, leadId: leadId, status: 'new' };
  } finally {
    lock.releaseLock();
  }
}

function updateLead(data) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const sheet = getSheet(SHEET_NAMES.WAR_ROOM);
    if (!sheet) throw new Error('War Room tab not found.');
    
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
    
    const oldStatus = sheet.getRange(row, COL_WAR.STATUS).getValue();
    let notes = data.notes || '';
    if (oldStatus === 'Ghost' && data.status !== 'Ghost' && !notes.includes('[REVIVED]')) {
      notes = notes ? notes + ' | [REVIVED]' : '[REVIVED]';
    }
    
    sheet.getRange(row, COL_WAR.CLIENT).setValue(data.client || 'Unknown');
    sheet.getRange(row, COL_WAR.NAME).setValue(data.name);
    sheet.getRange(row, COL_WAR.WA).setValue(formatWhatsAppNumber(data.wa));
    sheet.getRange(row, COL_WAR.PROPERTY).setValue(data.property || '');
    sheet.getRange(row, COL_WAR.PRICE).setValue(data.price || 0);
    sheet.getRange(row, COL_WAR.STATUS).setValue(data.status || 'Cold');
    sheet.getRange(row, COL_WAR.PRIORITY).setValue(priority);
    sheet.getRange(row, COL_WAR.COMMISSION).setValue(Math.round((data.price || 0) * 0.03));
    sheet.getRange(row, COL_WAR.TOUCH).setValue(data.touch || 1);
    sheet.getRange(row, COL_WAR.LAST_CONTACT).setValue(lastContactDate);
    sheet.getRange(row, COL_WAR.DAYS_STALE).setValue(daysStale);
    sheet.getRange(row, COL_WAR.NEXT_ACTION).setValue(data.nextAction || '');
    sheet.getRange(row, COL_WAR.DSR_STATUS).setValue(data.dsr || '-');
    sheet.getRange(row, COL_WAR.NOTES).setValue(notes);
    
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
    const sheet = getSheet(SHEET_NAMES.WAR_ROOM);
    if (!sheet) throw new Error('War Room tab not found.');
    const row = findRowByLeadId(sheet, leadId);
    sheet.deleteRow(row);
    return { success: true };
  } finally {
    lock.releaseLock();
  }
}

function autoSortWarRoom() {
  const sheet = getSheet(SHEET_NAMES.WAR_ROOM);
  if (!sheet) return;
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2) return;
  const range = sheet.getRange(2, 1, lastRow - 1, lastCol);
  range.sort([{ column: COL_WAR.PRIORITY, ascending: false }, { column: COL_WAR.DAYS_STALE, ascending: false }]);
}

// --- OUTBOUND PROSPECTS APIs (REN Prospects) ---
function getAllProspects() {
  const sheet = getSheet(SHEET_NAMES.PROSPECTS);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 4) return []; // Header sits on row 3, data starts at 4
  const prospects = [];
  for (let i = 3; i < data.length; i++) {
    const row = data[i];
    prospects.push({
      rowIndex: i + 1,
      name: row[COL_PROS.NAME - 1],
      area: row[COL_PROS.AREA - 1],
      state: row[COL_PROS.STATE - 1],
      agency: row[COL_PROS.AGENCY - 1],
      wa: row[COL_PROS.WA - 1],
      channel: row[COL_PROS.CHANNEL - 1],
      status: row[COL_PROS.STATUS - 1],
      needs: row[COL_PROS.NEEDS - 1],
      touch: row[COL_PROS.TOUCH - 1],
      lastContact: safeIsoString(row[COL_PROS.LAST_CONTACT - 1]),
      nextFollowUp: safeIsoString(row[COL_PROS.NEXT_FOLLOWUP - 1]),
      notes: row[COL_PROS.NOTES - 1]
    });
  }
  return prospects;
}

function addProspect(data) {
  const sheet = getSheet(SHEET_NAMES.PROSPECTS);
  if (!sheet) throw new Error('Prospects tab not found.');
  const targetRow = sheet.getLastRow() + 1;
  
  sheet.getRange(targetRow, COL_PROS.NAME).setValue(data.name);
  sheet.getRange(targetRow, COL_PROS.AREA).setValue(data.area || '');
  sheet.getRange(targetRow, COL_PROS.STATE).setValue(data.state || '');
  sheet.getRange(targetRow, COL_PROS.AGENCY).setValue(data.agency || '');
  sheet.getRange(targetRow, COL_PROS.WA).setValue(formatWhatsAppNumber(data.wa));
  sheet.getRange(targetRow, COL_PROS.CHANNEL).setValue(data.channel || 'Manual');
  sheet.getRange(targetRow, COL_PROS.STATUS).setValue(data.status || 'Cold');
  sheet.getRange(targetRow, COL_PROS.NEEDS).setValue(data.needs || '');
  sheet.getRange(targetRow, COL_PROS.TOUCH).setValue(data.touch || 0);
  sheet.getRange(targetRow, COL_PROS.NOTES).setValue(data.notes || '');
  
  return { success: true };
}

function updateProspect(data) {
  const sheet = getSheet(SHEET_NAMES.PROSPECTS);
  if (!sheet) throw new Error('Prospects tab not found.');
  const lastRow = sheet.getLastRow();
  
  // Find prospect by WA number match
  let targetRow = -1;
  const waList = sheet.getRange(4, COL_PROS.WA, lastRow - 3, 1).getValues();
  const cleanedSearchWa = getWAUrlNumber(data.wa);
  
  for (let i = 0; i < waList.length; i++) {
    if (getWAUrlNumber(waList[i][0]) === cleanedSearchWa) {
      targetRow = i + 4;
      break;
    }
  }
  
  if (targetRow === -1) throw new Error('Prospect with WA ' + data.wa + ' not found.');
  
  sheet.getRange(targetRow, COL_PROS.NAME).setValue(data.name);
  sheet.getRange(targetRow, COL_PROS.AREA).setValue(data.area || '');
  sheet.getRange(targetRow, COL_PROS.STATE).setValue(data.state || '');
  sheet.getRange(targetRow, COL_PROS.AGENCY).setValue(data.agency || '');
  sheet.getRange(targetRow, COL_PROS.CHANNEL).setValue(data.channel || '');
  sheet.getRange(targetRow, COL_PROS.STATUS).setValue(data.status || 'Cold');
  sheet.getRange(targetRow, COL_PROS.NEEDS).setValue(data.needs || '');
  sheet.getRange(targetRow, COL_PROS.TOUCH).setValue(data.touch || 0);
  if (data.lastContact) sheet.getRange(targetRow, COL_PROS.LAST_CONTACT).setValue(new Date(data.lastContact));
  if (data.nextFollowUp) sheet.getRange(targetRow, COL_PROS.NEXT_FOLLOWUP).setValue(new Date(data.nextFollowUp));
  sheet.getRange(targetRow, COL_PROS.NOTES).setValue(data.notes || '');
  
  // If status is updated to 'Signed', automatically check if client portal exists. If not, generate!
  if (data.status === 'Signed') {
    const activeClientsSheet = getSheet(SHEET_NAMES.ACTIVE_CLIENTS);
    if (activeClientsSheet) {
      // Check if client is already registered
      const lastClientRow = activeClientsSheet.getLastRow();
      let exists = false;
      if (lastClientRow >= 4) {
        const names = activeClientsSheet.getRange(4, 2, lastClientRow - 3, 1).getValues();
        exists = names.some(n => n[0].toString().trim().toLowerCase() === data.name.trim().toLowerCase());
      }
      if (!exists) {
        // Register client & generate token
        generateClientToken(data.name);
      }
    }
  }
  
  return { success: true };
}

function deleteProspect(wa) {
  const sheet = getSheet(SHEET_NAMES.PROSPECTS);
  if (!sheet) throw new Error('Prospects tab not found.');
  const lastRow = sheet.getLastRow();
  const waList = sheet.getRange(4, COL_PROS.WA, lastRow - 3, 1).getValues();
  const cleanedSearch = getWAUrlNumber(wa);
  
  for (let i = 0; i < waList.length; i++) {
    if (getWAUrlNumber(waList[i][0]) === cleanedSearch) {
      sheet.deleteRow(i + 4);
      return { success: true };
    }
  }
  throw new Error('Prospect not found.');
}

// --- APPOINTMENTS APIS ---
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
    const sheet = getSheet(SHEET_NAMES.WAR_ROOM);
    if (!sheet) throw new Error('War Room tab not found.');
    const row = findRowByLeadId(sheet, leadId);
    
    const currentNotes = sheet.getRange(row, COL_WAR.NOTES).getValue() || '';
    const tag = '[REMINDER SENT — ' + new Date().toLocaleDateString('en-MY') + ']';
    if (!currentNotes.includes('[REMINDER SENT')) {
      sheet.getRange(row, COL_WAR.NOTES).setValue(currentNotes ? currentNotes + ' | ' + tag : tag);
    }
    
    const name = sheet.getRange(row, COL_WAR.NAME).getValue();
    const wa = sheet.getRange(row, COL_WAR.WA).getValue();
    const property = sheet.getRange(row, COL_WAR.PROPERTY).getValue();
    const time = sheet.getRange(row, COL_WAR.NEXT_ACTION).getValue();

    const script = 'Hi ' + name + ', reminder for your viewing tomorrow' +
      (time ? ' at ' + time : '') +
      ' for ' + (property || 'the property') + '. See you there!';

    const apiSent = sendWhatsAppAPI_Message(getWAUrlNumber(wa), script);

    const engine = getSheet(SHEET_NAMES.ACTIVITY_LOG);
    if (engine) {
      engine.appendRow(['', new Date(), name, 'WhatsApp (Reminder)', 'Sent', '', 'Appointment', apiSent ? 'Reminder sent automatically via API' : 'Reminder link opened manually']);
    }
    
    return { success: true, apiSent: apiSent };
  } finally {
    lock.releaseLock();
  }
}

function getBroadcastScript(status, touchNum) {
  const brain = getSheet('System Brain');
  if (brain) {
    try {
      const data = brain.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]).trim().toLowerCase() === String(status).trim().toLowerCase()) {
          const col = Math.min(touchNum, 7);
          if (data[i][col]) return data[i][col];
        }
      }
    } catch(e) {}
  }
  
  // Robust Fallback: ABM T1-T7 script templates
  const fallbackScripts = {
    'Cold': [
      "Hi [Name], I noticed you were looking for property listings in [Area]. Are you still active in your search?",
      "Hi [Name], just checking in. Did you manage to look through the brochure for [Area]?",
      "Hi [Name], we have 3 new listings in [Area] that match your criteria. Let me know if you want the details."
    ],
    'Warm': [
      "Hi [Name], since you were interested in [Area], would you like to do a quick call to check loan eligibility?",
      "Hi [Name], I can run a quick DSR calculation for you. What is your estimated monthly income?",
      "Hi [Name], just following up on our last chat. Did you have any questions about the property in [Area]?"
    ],
    'Hot': [
      "Hi [Name], the owner of the unit in [Area] is hosting a viewing this Sunday. Would you like to reserve a slot?",
      "Hi [Name], viewing slots for [Area] are filling up. I have 2PM and 4PM available. Which one suits you?",
      "Hi [Name], just confirming if we are still on for our viewing at [Area]?"
    ],
    'Ghost': [
      "Hi [Name], is this property inquiry for [Area] still active, or have you already purchased a unit?",
      "Hi [Name], just following up one last time before we close this inquiry for [Area]. Let me know if you are still looking.",
      "Hi [Name], we just launched a new pricing package for [Area]. Let me know if you want to take a look."
    ]
  };
  
  const list = fallbackScripts[status] || fallbackScripts['Cold'];
  const idx = Math.min(touchNum - 1, list.length - 1);
  return list[idx >= 0 ? idx : 0];
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
    script = script.replace(/\[Name\]/g, l.name).replace(/\[Area\]/g, l.property || 'the area');
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
    const sheet = getSheet(SHEET_NAMES.WAR_ROOM);
    if (!sheet) throw new Error('War Room tab not found.');
    const row = findRowByLeadId(sheet, leadId);
    
    const currentTouch = Number(sheet.getRange(row, COL_WAR.TOUCH).getValue()) || 0;
    const now = new Date();
    sheet.getRange(row, COL_WAR.TOUCH).setValue(currentTouch + 1);
    sheet.getRange(row, COL_WAR.LAST_CONTACT).setValue(now);
    sheet.getRange(row, COL_WAR.DAYS_STALE).setValue(0);

    const name = sheet.getRange(row, COL_WAR.NAME).getValue();
    const status = sheet.getRange(row, COL_WAR.STATUS).getValue();
    const wa = sheet.getRange(row, COL_WAR.WA).getValue();
    const property = sheet.getRange(row, COL_WAR.PROPERTY).getValue();

    // Generate Outreach script
    const touchNum = currentTouch + 1;
    let script = getBroadcastScript(status, touchNum);
    script = script.replace(/\[Name\]/g, name).replace(/\[Area\]/g, property || 'the area');

    // Trigger WhatsApp API Gateway if credentials exist!
    const apiSent = sendWhatsAppAPI_Message(getWAUrlNumber(wa), script);

    const engine = getSheet(SHEET_NAMES.ACTIVITY_LOG);
    if (engine) {
      engine.appendRow(['', now, name, 'WhatsApp', 'Replied', touchNum, status, apiSent ? 'Broadcast sent automatically via API' : 'Broadcast link opened manually']);
    }
    return { success: true, apiSent: apiSent };
  } finally {
    lock.releaseLock();
  }
}

// --- GHOST REVIVAL SCANNER ---
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
  const sheet = getSheet(SHEET_NAMES.WAR_ROOM);
  if (!sheet) return { flagged: 0 };
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return { flagged: 0 };
  let flagged = 0;
  const now = new Date();
  for (let i = 1; i < data.length; i++) {
    const lastContact = data[i][COL_WAR.LAST_CONTACT - 1];
    const status = data[i][COL_WAR.STATUS - 1];
    if (status !== 'Ghost' && lastContact) {
      const days = Math.floor((now - new Date(lastContact)) / (86400000));
      if (days >= 7) {
        sheet.getRange(i + 1, COL_WAR.STATUS).setValue('Ghost');
        sheet.getRange(i + 1, COL_WAR.DAYS_STALE).setValue(days);
        if (!data[i][COL_WAR.GHOST_STAGE - 1]) {
          sheet.getRange(i + 1, COL_WAR.GHOST_STAGE).setValue(1);
        }
        flagged++;
      }
    }
  }
  return { flagged: flagged };
}

// --- ENGINE ACTIVITY LOG APIs ---
function getEngineLog() {
  const sheet = getSheet(SHEET_NAMES.ACTIVITY_LOG);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 4) return []; // Header rests on Row 3
  const logs = [];
  for (let i = 3; i < data.length; i++) {
    const row = data[i];
    logs.push({
      timestamp: safeIsoString(row[1]),
      name: row[2],
      channel: row[3],
      response: row[4],
      touch: row[5],
      status: row[6],
      notes: row[7]
    });
  }
  return logs.reverse(); // Newest logs first
}

// --- CLIENT PORTAL & TOKEN APIs ---
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

function generateClientToken(clientName) {
  if (!clientName || clientName.trim() === '') {
    return { success: false, error: 'Client name required.' };
  }
  const name = clientName.trim();
  const token = Utilities.getUuid().substring(0, 8);
  PropertiesService.getScriptProperties().setProperty('token_' + name, token);
  const url = ScriptApp.getService().getUrl() + '?client=' + encodeURIComponent(name) + '&token=' + token;
  
  // Log inside Active Clients sheet
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
    
    if (targetRow === -1) targetRow = lastRow + 1;
    sheet.getRange(targetRow, 2).setValue(name);
    sheet.getRange(targetRow, 4).setValue(new Date());
    sheet.getRange(targetRow, 5).setValue(url);
    sheet.getRange(targetRow, 6).setValue('Active');
  }
  
  return { success: true, name: name, token: token, url: url };
}

function revokeClientToken(clientName) {
  if (!clientName) return { success: false };
  PropertiesService.getScriptProperties().deleteProperty('token_' + clientName);
  
  // Mark inactive in Active Clients sheet
  const sheet = getSheet(SHEET_NAMES.ACTIVE_CLIENTS);
  if (sheet) {
    const lastRow = sheet.getLastRow();
    if (lastRow >= 4) {
      const names = sheet.getRange(4, 2, lastRow - 3, 1).getValues();
      for (let i = 0; i < names.length; i++) {
        if (names[i][0].toString().trim().toLowerCase() === clientName.trim().toLowerCase()) {
          sheet.getRange(i + 4, 6).setValue('Terminated');
          break;
        }
      }
    }
  }
  
  return { success: true };
}

// --- DSR CALCULATOR API ---
function calculateDSR(data) {
  const income = Number(data.income) || 0;
  const commitments = Number(data.commitments) || 0;
  const loan = Number(data.loan) || 0;
  const tenure = Number(data.tenure) || 35;
  const rate = 0.045; // 4.5% interest rate benchmark
  const months = tenure * 12;
  const monthlyRate = rate / 12;
  
  const installment = loan * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalCommitment = commitments + installment;
  const dsr = income > 0 ? Math.round((totalCommitment / income) * 100) : 0;
  const verdict = dsr <= 60 ? 'Strong' : dsr <= 70 ? 'Borderline' : 'Over';
  
  return { 
    installment: Math.round(installment), 
    totalCommitment: Math.round(totalCommitment), 
    dsr: dsr, 
    verdict: verdict 
  };
}

function flagLeadForAttention(leadId, clientName, reason) {
  const sheet = getSheet(SHEET_NAMES.WAR_ROOM);
  if (!sheet) throw new Error('War Room tab not found.');
  const row = findRowByLeadId(sheet, leadId);
  const currentNotes = sheet.getRange(row, COL_WAR.NOTES).getValue() || '';
  const flagText = '[FLAGGED by ' + clientName + ': ' + reason + ' — ' + new Date().toLocaleDateString('en-MY') + ']';
  const newNotes = currentNotes ? currentNotes + ' | ' + flagText : flagText;
  sheet.getRange(row, COL_WAR.NOTES).setValue(newNotes);
  
  const engine = getSheet(SHEET_NAMES.ACTIVITY_LOG);
  if (engine) {
    const name = sheet.getRange(row, COL_WAR.NAME).getValue();
    const status = sheet.getRange(row, COL_WAR.STATUS).getValue();
    engine.appendRow(['', new Date(), name, 'Client Portal', 'Flagged', '', status, 'Flagged: ' + reason]);
  }
  return { success: true };
}

function clearLeadFlag(leadId) {
  const sheet = getSheet(SHEET_NAMES.WAR_ROOM);
  if (!sheet) throw new Error('War Room tab not found.');
  const row = findRowByLeadId(sheet, leadId);
  const currentNotes = sheet.getRange(row, COL_WAR.NOTES).getValue() || '';
  const newNotes = currentNotes.replace(/\s*\[FLAGGED[^\]]*\]/g, '').trim();
  sheet.getRange(row, COL_WAR.NOTES).setValue(newNotes);
  return { success: true };
}

// --- CSV BULK IMPORT ---
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

// ═══════════════════════════════════════════════════════════════════
// 4. AUTOMATED OUTBOUND TRIGGERS (WhatsApp API Gateway)
// ═══════════════════════════════════════════════════════════════════

/**
 * Sends WhatsApp message via configured external API gateway
 */
function sendWhatsAppAPI_Message(phone, message) {
  const props = PropertiesService.getScriptProperties();
  const apiURL = props.getProperty('WA_API_URL');
  const apiKey = props.getProperty('WA_API_KEY');
  
  if (!apiURL || !apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    Logger.log('WhatsApp API credentials not configured. Falling back to logger.');
    return false;
  }
  
  const payload = {
    phone: phone,
    message: message
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + apiKey
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(apiURL, options);
    const code = response.getResponseCode();
    Logger.log('WhatsApp Gateway HTTP Response: ' + code);
    return code === 200 || code === 201;
  } catch(e) {
    Logger.log('WhatsApp API error: ' + e.toString());
    return false;
  }
}

/**
 * Configure API Credentials dynamically via UI Prompt
 */
function configureAPICredentials() {
  const ui = SpreadsheetApp.getUi();
  
  const urlResponse = ui.prompt('Configure WhatsApp Gateway', 'Masukkan URL WhatsApp API Gateway anda:', ui.ButtonSet.OK_CANCEL);
  if (urlResponse.getSelectedButton() !== ui.Button.OK) return;
  const url = urlResponse.getResponseText().trim();
  
  const keyResponse = ui.prompt('Configure WhatsApp Gateway', 'Masukkan API Authorization Key:', ui.ButtonSet.OK_CANCEL);
  if (keyResponse.getSelectedButton() !== ui.Button.OK) return;
  const key = keyResponse.getResponseText().trim();
  
  const props = PropertiesService.getScriptProperties();
  props.setProperty('WA_API_URL', url);
  props.setProperty('WA_API_KEY', key);
  
  ui.alert('Success', 'WhatsApp API credentials successfully saved in Script Properties.', ui.ButtonSet.OK);
}

// ═══════════════════════════════════════════════════════════════════
// 5. SHEET TRIGGER & MENUS
// ═══════════════════════════════════════════════════════════════════

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Client Pipeline')
    .addItem('Build/Rebuild CRM Structure', 'buildCRM_Pipeline_All')
    .addItem('Configure WhatsApp API Credentials', 'configureAPICredentials')
    .addToUi();
}
