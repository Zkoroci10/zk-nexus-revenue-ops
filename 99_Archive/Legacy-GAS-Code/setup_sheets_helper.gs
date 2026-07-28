/**
 * ZK REVENUE OPS — AUTOMATED SPREADSHEET SETUP SCRIPT
 * 
 * Run this function 'setupAllSpreadsheetTabs()' in Google Apps Script Editor
 * to automatically create and format all 6 database tabs with exact column headers.
 */

function setupAllSpreadsheetTabs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const tabs = [
    {
      name: 'War Room',
      headers: [
        'Client', 'Lead ID', 'Name', 'WhatsApp', 'Property', 'Price', 
        'Status', 'Priority', 'Commission', 'Touch', 'Last Contact', 
        'Days Stale', 'Next Action', 'DSR Status', 'Script Ref', 
        'Notes', 'Ghost Stage', 'Date Added'
      ]
    },
    {
      name: 'SDR Prospects',
      headers: [
        'REN Name', 'WhatsApp', 'Area', 'Agency', 'Touch Count', 
        'Last Touch', 'Next Follow-up', 'Status', 'Needs / Notes', 'Date Added'
      ]
    },
    {
      name: 'Ghost Revival',
      headers: [
        'Lead ID', 'Name', 'Client', 'WhatsApp', 'Last Status', 
        'Days Inactive', 'Revival Script', 'Status'
      ]
    },
    {
      name: 'Clients',
      headers: [
        'Client Name', 'Agency', 'Status', 'Portal Token', 'Notes', 'Date Onboarded'
      ]
    },
    {
      name: 'Toolkit',
      headers: [
        'Script ID', 'Category', 'Script Name', 'Script Content'
      ]
    },
    {
      name: 'System Log',
      headers: [
        'Timestamp', 'Actor', 'Action', 'Details'
      ]
    }
  ];

  tabs.forEach(tabConfig => {
    let sheet = ss.getSheetByName(tabConfig.name);
    if (!sheet) {
      sheet = ss.insertSheet(tabConfig.name);
    }
    
    // Set Header Row
    sheet.getRange(1, 1, 1, tabConfig.headers.length).setValues([tabConfig.headers]);
    sheet.getRange(1, 1, 1, tabConfig.headers.length)
      .setFontWeight('bold')
      .setBackground('#1C1C24')
      .setFontColor('#FBE7A1')
      .setHorizontalAlignment('center');
      
    sheet.setFrozenRows(1);
  });

  // Setup Days Stale formula column for War Room if rows exist
  const warRoom = ss.getSheetByName('War Room');
  if (warRoom && warRoom.getMaxRows() > 1) {
    warRoom.getRange('L2:L').setFormulaR1C1('=IF(ISBLANK(RC[-1]), "", INT(NOW()-RC[-1]))');
  }

  Logger.log('SUCCESS: All 6 ZK Revenue Ops Database Tabs Created & Formatted!');
}
