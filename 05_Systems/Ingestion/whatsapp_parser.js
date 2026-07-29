/**
 * ZK Revenue Ops — WhatsApp Auto-Outreach & Inbound Lead Qualification Engine
 * Humanized Malaysian REN Conversational Outreach & DSR Qualification
 */

const fs = require('fs');
const path = require('path');

const PROSPECTS_FILE = path.join(__dirname, '../../01_Business/ZK-Revenue-Ops/Leads/ren_prospects_100.json');

/**
 * Generates an Ultra-Humanized Conversational WhatsApp Pitch for Malaysian RENs
 */
function generateHumanizedWhatsAppPitch(ren) {
    const isFemale = /siti|nur|ain|puan|akak|nabilah|kavitha|devi|amira|zainab/i.test(ren.name);
    const salutation = isFemale ? 'Akak' : 'Bro';
    const honorific = isFemale ? 'Puan' : 'Tuan';

    return `Salam & Hi ${honorific} ${ren.name} 👋

Lama juga duk perhati listing ${ren.propertyType || 'hartanah'} ${salutation} kat area ${ren.primary_location}... mantap betul pergerakan listing bawah ${ren.agency} 👍

Nak tanya sikit ${salutation}, selalu mesti ramai giler buyer dok WhatsApp masuk kan? Tapi bila dah penat melayan, rupanya komitmen bank DSR ke laut... penat kan layan buyer tak lepas loan ni 😅

Sebab tu team kami ada terbina satu *tool portal simple* khas untuk ejen top kat ${ren.primary_location}. 

Dia tolong auto-tapis DSR gaji & komitmen bank buyer siap-siap, lepas tu susun terus pembeli mana yang Grade A (betul-betul layak loan & sedia nak viewing). Ejen tak payah buat data entry manual dah.

Saya ada tolong bukakan satu link contoh portal atas nama ${salutation} (*${ren.name} — ${ren.agency}*). 

Kalau ${salutation} free 1 minit, cer try klik tengok sesuai tak dengan workflow ${salutation}:
👉 https://zkoroci10.github.io/zk-nexus-revenue-ops/

Kita pun memang hadkan *5 ejen sahaja per zon* kat area ${ren.primary_location} ni supaya tak bertindih. 

Kalau rasa mantap, bagitahu tau! Thanks ${salutation} 🙏`;
}

/**
 * Parses inbound WhatsApp text from a buyer prospect to calculate DSR
 */
function parseInboundBuyerMessage(rawText) {
    const incomeMatch = rawText.match(/gaji[^\d]*(\d+)/i) || rawText.match(/income[^\d]*(\d+)/i);
    const commitMatch = rawText.match(/komitmen[^\d]*(\d+)/i) || rawText.match(/commitment[^\d]*(\d+)/i);
    const budgetMatch = rawText.match(/budget[^\d]*(\d+)/i);

    const netIncome = incomeMatch ? parseInt(incomeMatch[1]) : 0;
    const commitments = commitMatch ? parseInt(commitMatch[1]) : 0;
    const maxBudget = budgetMatch ? parseInt(budgetMatch[1]) : 500000;

    const estNewLoanInstallment = Math.round((maxBudget * 0.9 * 0.045) / 12);
    const totalCommitments = commitments + estNewLoanInstallment;
    const dsrPercent = netIncome > 0 ? Math.round((totalCommitments / netIncome) * 100) : 0;

    let grade = 'C';
    let status = 'DSR Exceeded (>75%)';
    if (dsrPercent > 0 && dsrPercent <= 65) {
        grade = 'A';
        status = 'Highly Eligible (DSR ≤ 65%)';
    } else if (dsrPercent > 65 && dsrPercent <= 75) {
        grade = 'B';
        status = 'Moderate Risk (DSR 66-75%)';
    }

    return {
        netIncome,
        commitments,
        maxBudget,
        estLoanInstallment: estNewLoanInstallment,
        dsrPercent,
        grade,
        status
    };
}

if (require.main === module) {
    if (fs.existsSync(PROSPECTS_FILE)) {
        const prospects = JSON.parse(fs.readFileSync(PROSPECTS_FILE, 'utf8'));
        console.log("================ HUMANIZED WHATSAPP PITCH (SAMPLE 1) ================");
        console.log(generateHumanizedWhatsAppPitch(prospects[0]));
        console.log("\n================ HUMANIZED WHATSAPP PITCH (SAMPLE 2 - FEMALE) ================");
        console.log(generateHumanizedWhatsAppPitch(prospects[3] || prospects[1]));
    }
}

module.exports = { generateHumanizedWhatsAppPitch, parseInboundBuyerMessage };
