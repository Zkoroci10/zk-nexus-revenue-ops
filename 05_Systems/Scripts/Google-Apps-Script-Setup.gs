/**
 * ZK Revenue Ops — Google Workspace Cloud Lead Database Generator
 * Auto-creates the Lead Database & Dashboard in Google Sheets & Google Drive
 */

function setupZKRevenueOpsCloudDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    ss = SpreadsheetApp.create("ZK Revenue Ops — Master Client Lead Database (Cloud)");
  }
  
  // 1. Dashboard Tab
  var dashSheet = ss.getSheetByName("Papan Pemuka (Dashboard)") || ss.insertSheet("Papan Pemuka (Dashboard)");
  dashSheet.clear();
  dashSheet.getRange("A1").setValue("ZK Revenue Ops — Live Cloud Dashboard").setFontSize(16).setFontWeight("bold").setFontColor("#0284c7");
  dashSheet.getRange("A3:D3").setValues([["JUMLAH LEAD", "QUALIFIED", "VIEWING SCHEDULED", "KADAR PENUKARAN"]]).setFontWeight("bold").setBackground("#0f172a").setFontColor("#ffffff");
  dashSheet.getRange("A4").setFormula('=COUNTA(Database!A2:A100)');
  dashSheet.getRange("B4").setFormula('=COUNTIF(Database!I2:I100, "Qualified")');
  dashSheet.getRange("C4").setFormula('=COUNTIF(Database!I2:I100, "Viewing Scheduled")');
  dashSheet.getRange("D4").setFormula('=IFERROR(TEXT((B4+C4)/A4, "0.0%"), "0%")');
  dashSheet.getRange("A4:D4").setFontSize(18).setFontWeight("bold").setHorizontalAlignment("center");
  
  // 2. Database Tab
  var dbSheet = ss.getSheetByName("Database") || ss.insertSheet("Database");
  dbSheet.clear();
  var headers = [["Lead_ID", "Tarikh_Masuk", "Nama_Prospek", "No_WhatsApp", "Sumber_Lead", "Projek_Pilihan", "Tujuan_Beli", "Kelayakan_Gaji", "Status_Lead", "Tarikh_Viewing", "Nota_SDR"]];
  dbSheet.getRange("A1:K1").setValues(headers).setFontWeight("bold").setBackground("#1e293b").setFontColor("#38bdf8");
  
  var sampleData = [
    ["LD-001", "2026-07-28", "Ahmad Zaki", "0123456789", "FB Ads", "Residensi Skyline", "Own Stay", "RM 4500 (Lulus)", "Viewing Scheduled", "2026-07-30 14:00", "Berminat bilik 3. Loan pre-checked."],
    ["LD-002", "2026-07-28", "Siti Hajar", "0198765432", "PropertyGuru", "Villa Mutiara", "Investment", "RM 5200 (Lulus)", "Qualified", "Pending Schedule", "Cari unit ground floor."],
    ["LD-003", "2026-07-28", "Muhammad Hafiz", "0171122334", "Mudah.my", "Residensi Skyline", "Own Stay", "RM 2600 (Low)", "Unqualified", "-", "Komitmen tinggi."],
    ["LD-004", "2026-07-28", "Kavitha Nair", "0112233445", "TikTok DM", "KV Condo", "Own Stay", "RM 6000 (Lulus)", "Viewing Scheduled", "2026-07-31 11:00", "Slot viewing Jumaat."],
    ["LD-005", "2026-07-28", "Tan Wei Ming", "0165544332", "FB Ads", "Residensi Skyline", "Investment", "RM 8500 (Lulus)", "Qualified", "Pending Schedule", "Pelabur Cash."]
  ];
  
  dbSheet.getRange(2, 1, sampleData.length, sampleData[0].length).setValues(sampleData);
  dbSheet.autoResizeColumns(1, 11);
  
  // Set Status Dropdown Validation
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(["Qualified", "Viewing Scheduled", "Unqualified", "Pending Check"], true).build();
  dbSheet.getRange("I2:I100").setDataValidation(rule);
  
  Logger.log("✅ Google Cloud Database & Dashboard Successfully Created!");
}
