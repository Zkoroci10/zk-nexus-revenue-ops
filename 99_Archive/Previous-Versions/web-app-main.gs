// Title: WebApp Main
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

function doGet(e) {
  const client = e.parameter.client;
  const token = e.parameter.token;
  
  if (client && token) {
    const validToken = PropertiesService.getScriptProperties().getProperty('token_' + client);
    if (validToken === token) {
      let template;
      try {
        template = HtmlService.createTemplateFromFile('ClientPortal');
      } catch (err1) {
        try {
          template = HtmlService.createTemplateFromFile('client-portal');
        } catch (err2) {
          return HtmlService.createHtmlOutput('<h2>Deployment Error</h2><p>HTML template (ClientPortal or client-portal) was not found in Apps Script.</p>');
        }
      }
      template.clientName = client;
      return template.evaluate()
        .setTitle('My Dashboard — ' + client)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no') // Memaksa paparan responsif mudah alih untuk Klien
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }
    return HtmlService.createHtmlOutput('<h2>Access Denied</h2><p>Invalid or expired token.</p>');
  }
  
  let consoleTemplate;
  try {
    consoleTemplate = HtmlService.createTemplateFromFile('OperatorConsole');
  } catch (err1) {
    try {
      consoleTemplate = HtmlService.createTemplateFromFile('operator-console');
    } catch (err2) {
      try {
        consoleTemplate = HtmlService.createTemplateFromFile('WebApp_Frontend');
      } catch (err3) {
        try {
          consoleTemplate = HtmlService.createTemplateFromFile('web-app-frontend');
        } catch (err4) {
          return HtmlService.createHtmlOutput('<h2>Deployment Error</h2><p>HTML file (OperatorConsole, operator-console, WebApp_Frontend, or web-app-frontend) was not found in Apps Script.</p>');
        }
      }
    }
  }

  return consoleTemplate.evaluate()
    .setTitle('ZK Revenue Ops — Internal Panel')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no') // Memaksa paparan responsif mudah alih untuk Internal Panel
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  return doGet(e);
}
