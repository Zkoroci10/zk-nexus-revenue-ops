// Title: WebApp Setup Minimal
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

// =====================================================
// ZK REVENUE OPS - WEBAPP SETUP v2.0 (METALLIC OBSIDIAN)
// =====================================================

function step1_createSheets() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) { Logger.log('ERROR: Sila buka Google Spreadsheet terlebih dahulu.'); return; }
    
    var names = ['War Room', 'Engine', 'Ghost Revival', 'System Brain', 'Command Center'];
    var created = [];
    var existing = [];
    
    for (var i = 0; i < names.length; i++) {
      var sh = ss.getSheetByName(names[i]);
      if (!sh) {
        ss.insertSheet(names[i]);
        created.push(names[i]);
        Logger.log('Dicipta: ' + names[i]);
        Utilities.sleep(300);
      } else {
        existing.push(names[i]);
        Logger.log('Sudah Ada: ' + names[i]);
      }
    }
    Logger.log('=== SELESAI FASA 1 ===');
  } catch (e) {
    Logger.log('RALAT FASA 1: ' + e.message);
  }
}

function step2_writeHeaders() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) { Logger.log('ERROR: Tiada spreadsheet.'); return; }
    
    // --- WAR ROOM ---
    var sh = ss.getSheetByName('War Room');
    if (sh) {
      var headers = [['CLIENT','LEAD ID','NAME','WA NO','PROPERTY','PRICE','STATUS','PRIORITY','COMMISSION','TOUCH','LAST CONTACT','DAYS STALE','NEXT ACTION','DSR','SCRIPT','NOTES','GHOST STAGE']];
      sh.getRange(1, 1, 1, 17).setValues(headers);
      sh.getRange("D:D").setNumberFormat("@"); // Set Plain Text untuk nombor WhatsApp
      Logger.log('War Room: Pengepala ditulis & Lajur D diset Plain Text');
    }
    
    // --- ENGINE ---
    sh = ss.getSheetByName('Engine');
    if (sh) {
      var headers = [['','TIMESTAMP','LEAD NAME','CHANNEL','RESPONSE','TOUCH','STATUS','SCRIPT','NOTES']];
      sh.getRange(1, 1, 1, 9).setValues(headers);
      Logger.log('Engine: Pengepala ditulis');
    }
    
    // --- GHOST REVIVAL ---
    sh = ss.getSheetByName('Ghost Revival');
    if (sh) {
      var headers = [['','LEAD ID','NAME','WA NO','PROPERTY','GHOSTED SINCE','DAYS COLD','STAGE','REVIVAL SCRIPT','OUTCOME','NOTES']];
      sh.getRange(1, 1, 1, 11).setValues(headers);
      sh.getRange("D:D").setNumberFormat("@"); // Set Plain Text
      Logger.log('Ghost Revival: Pengepala ditulis');
    }
    
    // --- SYSTEM BRAIN ---
    sh = ss.getSheetByName('System Brain');
    if (sh) {
      var data = [
        ['STATUS','T1','T2','T3','T4','T5','T6','T7'],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['Cold','Hi [Name], masih cari property?','Checking in - any updates?','Saw new listing in [Area]','Market update for [Area]','Still available? Quick question','Last call - closing this lead','Revive: New project launch!'],
        ['Warm','Great speaking with you!','Here are the listings we discussed','Viewing this Saturday?','FAQ: Financing & DSR','Reminder: Viewing tomorrow','Your dream home is waiting','Special offer: Zero deposit!'],
        ['Hot','Ready to move forward?','Offer letter template attached','Lawyer recommendation','SPA signing checklist','Financing approved! Next steps','Final walkthrough this week','Welcome to your new home!'],
        ['Appointment','Confirmed: [Date] at [Time]','Location: [Address]','Parking & access instructions','What to bring: IC & Deposit','See you tomorrow!','Viewing completed - feedback?','Follow-up: Decision?'],
        ['Closing','Congratulations! Offer accepted','SPA signing appointment','Loan disbursement tracking','Key handover checklist','Welcome home!','Referral program: RM500 reward','Review & testimonial request'],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['STAGE','REVIVAL SCRIPT','','','','','',''],
        [1,'Hi [Name], still interested? Quick chat?','','','','','',''],
        [2,'New project in [Area] - early bird price!','','','','','',''],
        [3,'Market update: Prices going up 5%','','','','','',''],
        [4,'Your friend [Ref] referred you - special rate','','','','','',''],
        [5,'Last unit available - decision needed today','','','','','',''],
        [6,'New financing option: 100% loan approved','','','','','',''],
        [7,'Final attempt: Closing your file - last chance','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['TYPE','RATE','NOTE','','','','',''],
        ['Subsale Standard',0.02,'2% of transacted price','','','','',''],
        ['Subsale Co-Agency',0.01,'1% (split with co-agent)','','','','',''],
        ['Project Sale',0.03,'3% developer commission','','','','','']
      ];
      sh.getRange(1, 1, data.length, data[0].length).setValues(data);
      Logger.log('System Brain: Membina templat lalai');
    }
    
    // --- COMMAND CENTER ---
    sh = ss.getSheetByName('Command Center');
    if (sh) {
      var data = [
        ['COMMAND CENTER',''],
        ['TOTAL LEADS', "=COUNTA('War Room'!C:C)-1"],
        ['APPOINTMENTS', '=COUNTIF(\'War Room\'!G:G,"Appointment")'],
        ['GHOSTS', '=COUNTIF(\'War Room\'!G:G,"Ghost")'],
        ['PIPELINE VALUE', '=SUMIF(\'War Room\'!G:G,"Hot",\'War Room\'!F:F)+SUMIF(\'War Room\'!G:G,"Appointment",\'War Room\'!F:F)'],
        ['',''],
        ['HOT LEADS', '=COUNTIF(\'War Room\'!G:G,"Hot")'],
        ['WARM LEADS', '=COUNTIF(\'War Room\'!G:G,"Warm")'],
        ['COLD LEADS', '=COUNTIF(\'War Room\'!G:G,"Cold")'],
        ['CLOSED', '=COUNTIF(\'War Room\'!G:G,"Closed")']
      ];
      sh.getRange(1, 1, data.length, data[0].length).setValues(data);
      Logger.log('Command Center: Formula dibina');
    }
    Logger.log('=== SELESAI FASA 2 ===');
  } catch (e) {
    Logger.log('RALAT FASA 2: ' + e.message);
  }
}

function runSetupComplete() {
  step1_createSheets();
  step2_writeHeaders();
}
