/**
 * ZK Revenue Ops — WhatsApp Auto-Outreach & Inbound Lead Qualification Engine
 * Elite Malaysian B2B Founder-to-Founder Cold Outreach Sequence (3-Message Flow)
 */

const fs = require('fs');
const path = require('path');

const PROSPECTS_FILE = path.join(__dirname, '../../01_Business/ZK-Revenue-Ops/Leads/ren_prospects_100.json');

/**
 * Generates the 3-Message Conversational Flow for a REN Prospect
 * Strictly follows Founder-to-Founder Rules (Zero Buzzwords, Zero Brochure Tone)
 */
function generateFounderWhatsAppSequence(ren) {
    const isFemale = /siti|nur|ain|puan|akak|nabilah|kavitha|devi|amira|zainab/i.test(ren.name);
    const honorific = isFemale ? 'Puan' : 'Tuan';

    return {
        message1: `Hi ${honorific} ${ren.name}. Saya Ariff.\nSaya ternampak listing ${honorific} dekat area ${ren.primary_location} tadi.\nNak tanya sikit, boleh?`,

        message2: `Biasa sebelum bawa buyer pergi viewing, ${honorific} tapis dulu tak kelayakan DSR diorang?\nSaja tanya sebab ramai ejen saya borak mengadu banyak masa habis bawak buyer viewing, tapi bila nak submit loan rupanya DSR ke laut.`,

        message3: `Sebab tu saya ada terbina satu tool simple.\nDia tolong auto-tapis DSR gaji & komitmen buyer sebelum ${honorific} set masa viewing. So ${honorific} cuma layan buyer yang betul-betul confirm lepas loan je.\nSaya ada buat contoh demo 1 minit atas nama ${ren.name} (${ren.agency}). Kalau ${honorific} nak tengok, saya boleh hantar link.`
    };
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
        const seq = generateFounderWhatsAppSequence(prospects[0]);
        console.log("================ FOUNDER B2B WHATSAPP SEQUENCE (SAMPLE 1) ================");
        console.log("--- MESSAGE 1 ---");
        console.log(seq.message1);
        console.log("\n--- MESSAGE 2 ---");
        console.log(seq.message2);
        console.log("\n--- MESSAGE 3 ---");
        console.log(seq.message3);
    }
}

module.exports = { generateFounderWhatsAppSequence, parseInboundBuyerMessage };
