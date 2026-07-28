// Title: WebApp Main
// ID: SYS-001 Asset
// Type: Script
// Module: 02_Projects
// BU: ZK Revenue Ops
// Status: Draft
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
      const template = HtmlService.createTemplateFromFile('ClientPortal');
      template.clientName = client;
      return template.evaluate()
        .setTitle('My Dashboard — ' + client)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1') // Memaksa paparan responsif mudah alih untuk Klien
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }
    return HtmlService.createHtmlOutput('<h2>Access Denied</h2><p>Invalid or expired token.</p>');
  }
  
  return HtmlService.createHtmlOutputFromFile('WebApp_Frontend')
    .setTitle('ZK Revenue Ops — Internal Panel')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1') // Memaksa paparan responsif mudah alih untuk Internal Panel
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  return doGet(e);
}
