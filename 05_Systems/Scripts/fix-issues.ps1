<#
---
Title: Workspace Issue Fixer
ID: SYS-005
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

$content = Get-Content -Path '05_Systems\Scripts\gas-code-optimized.js' -Raw -Encoding utf8

$oldListClients = '(?s)function listClients\(\) \{.*?return clients;\s*\}'
$newListClients = @'
function listClients() {
  const props = PropertiesService.getScriptProperties().getProperties();
  const sheet = getSheet(SHEET_NAMES.ACTIVE_CLIENTS);
  let sheetData = [];
  if (sheet) {
    const lastRow = sheet.getLastRow();
    if (lastRow >= 4) {
      sheetData = sheet.getRange(4, 2, lastRow - 3, 6).getValues(); // Name, Agency, Date, Link, Status, Notes
    }
  }

  const clients = [];
  for (const key in props) {
    if (key.startsWith('token_')) {
      const name = key.replace('token_', '');
      const url = ScriptApp.getService().getUrl() + '?client=' + encodeURIComponent(name) + '&token=' + props[key];
      const leadCount = getLeadsByClient(name).length;
      
      let agency = '';
      let status = 'Active';
      let notes = '';
      
      const rowData = sheetData.find(r => r[0].toString().trim().toLowerCase() === name.toLowerCase());
      if (rowData) {
        agency = rowData[1];
        status = rowData[4] || 'Active';
        notes = rowData[5];
      }
      
      clients.push({ 
        name: name, 
        token: props[key], 
        url: url, 
        leadCount: leadCount,
        agency: agency,
        status: status,
        notes: notes
      });
    }
  }
  return clients;
}
'@
$content = [regex]::Replace($content, $oldListClients, $newListClients)
$content | Out-File -FilePath '05_Systems\Scripts\gas-code-optimized.js' -Encoding utf8
Write-Output "Updated backend listClients"

$opContent = Get-Content -Path '05_Systems\Scripts\operator-console.html' -Raw -Encoding utf8
$oldThead = '(?s)<th>Client Name</th>\s*<th>Active Leads Assigned</th>\s*<th>Personalized Portal URL</th>\s*<th>Actions</th>'
$newThead = '<th>Client Name</th><th>Agency & Status</th><th>Active Leads</th><th>Personalized Portal URL</th><th>Actions</th>'
$opContent = [regex]::Replace($opContent, $oldThead, $newThead)

$oldJs = '(?s)tbody\.innerHTML = clients\.map.*?</tr>\)\.join\(''''\);'
$newJs = @'
            tbody.innerHTML = clients.map(c => {
              const escNotes = (c.notes || '').replace(/'/g, "\\'");
              const escAgency = (c.agency || '').replace(/'/g, "\\'");
              return <tr>
                <td><strong></strong><br><span style="font-size:10px; color:var(--text-muted);"></span></td>
                <td>
                  <span style="font-weight:600;"></span><br>
                  <span class="status-pill sp-"></span>
                </td>
                <td> leads</td>
                <td><input type="text" class="form-input" value="" readonly onclick="this.select()" style="width:100%; max-width:280px; font-family:Consolas,monospace; font-size:10px; padding: 4px 8px;"></td>
                <td>
                  <div class="row-actions">
                    <button class="row-btn row-btn-edit" onclick="editClient('', '', '', '')">Edit</button>
                    <button class="row-btn row-btn-delete" onclick="deleteClient('')">Delete</button>
                  </div>
                </td>
              </tr>;
            }).join('');
'@
$opContent = [regex]::Replace($opContent, $oldJs, $newJs)

$editJs = @'
    function editClient(name, agency, status, notes) {
      document.getElementById('client-name-input').value = name;
      document.getElementById('client-agency-input').value = agency;
      document.getElementById('client-status-input').value = status;
      document.getElementById('client-notes-input').value = notes;
      document.getElementById('modal-client').classList.add('active');
    }
'@
$opContent = $opContent -replace 'function deleteClient\(name\) \{', "$editJs

    function deleteClient(name) {"
$opContent | Out-File -FilePath '05_Systems\Scripts\operator-console.html' -Encoding utf8
Write-Output "Updated Operator Console"

$cpContent = Get-Content -Path '05_Systems\Scripts\client-portal.html' -Raw -Encoding utf8
$oldCss = '(?s)\/\* Header \*\/\s*\.header \{.*?\.header-sub \{.*?\}'
$newCss = @'
    /* Header */
    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 1px solid var(--border-glass);
      position: relative;
    }
    
    .header-sub { 
      color: var(--gold-primary); 
      font-size: 13px; 
      letter-spacing: 6px; 
      text-transform: uppercase; 
      margin-bottom: 8px; 
      font-weight: 700;
      text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
    }
    .header-title { font-size: 38px; font-weight: 800; background: linear-gradient(90deg, #FFFFFF, var(--gold-light)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
'@
$cpContent = [regex]::Replace($cpContent, $oldCss, $newCss)

$oldHtml = '(?s)<header class="header">\s*<div>\s*<div class="header-sub">Exclusive Client Portal</div>.*?</div>\s*</header>'
$newHtml = @'
    <header class="header">
      <div class="header-sub">Exclusive Client Portal</div>
      <div class="header-title">Welcome, <?= clientName ?></div>
      <button class="btn btn-gold" onclick="loadDashboard()" style="position:absolute; right:0; bottom:30px; font-size:11px; padding:6px 12px;">&#8635; Refresh Data</button>
    </header>
'@
$cpContent = [regex]::Replace($cpContent, $oldHtml, $newHtml)

$cpContent = $cpContent -replace 'Welcome, <\?\= clientName \?\>', 'Welcome, <span style="color:var(--gold-primary);"><\?= clientName \?></span>'
$cpContent | Out-File -FilePath '05_Systems\Scripts\client-portal.html' -Encoding utf8
Write-Output "Updated Client Portal UI"

