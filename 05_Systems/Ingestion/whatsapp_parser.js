/**
 * ZK Revenue Ops — WhatsApp Auto-Outreach & Inbound Lead Qualification Engine
 * Features:
 * 1. REN Cold Outreach Generator (Custom personalized pitch per 6 Zone)
 * 2. Inbound Buyer Lead DSR Parser (Extracts Net Income, Commitments & calculates DSR %)
 */

const fs = require('fs');
const path = require('path');

const PROSPECTS_FILE = path.join(__dirname, '../../01_Business/ZK-Revenue-Ops/Leads/ren_prospects_100.json');

/**
 * Generates personalized WhatsApp Outreach message for REN Prospect
 */
function generateRenWhatsAppPitch(ren) {
    return `Salam & Hi ${ren.name} (${ren.ren_tag} - ${ren.agency}),

Saya perhatikan anda aktif menguruskan listing hartanah di zon ${ren.primary_location} (${ren.zone_name}).

Kami di ZK Revenue Ops menyediakan *AI-Powered REN Infrastructure & Client Portal* khas untuk ejen top performer macam anda:

✅ *Zero Manual Data Entry*: Automasi tapisan DSR & kelayakan pinjaman pembeli.
✅ *White-Label Client Portal*: Dashboard khas atas nama ${ren.name} (${ren.agency}).
✅ *5,000 Lead Database R&D Engine*: Kelolakan beribu lead serentak tanpa hang.
✅ *Perkhidmatan Eksklusif*: Kami mengehadkan *maksimum 5 REN sahaja per zon* (${ren.zone_name}).

Boleh saya kongsikan Live Demo Client Portal (Piksel Kemas Stripe-Style) untuk anda pandu uji percuma?

Boleh tengok contoh Client Portal live di sini:
👉 https://zkoroci10.github.io/zk-nexus-revenue-ops/

Terima kasih,
*ZK Revenue Ops Team*`;
}

/**
 * Parses inbound WhatsApp text from a buyer prospect to calculate DSR
 */
function parseInboundBuyerMessage(rawText) {
    // Example format: "Gaji net RM 7500, komitmen bank RM 2100. budget RM 480000"
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

// Quick Test Execution
if (require.main === module) {
    if (fs.existsSync(PROSPECTS_FILE)) {
        const prospects = JSON.parse(fs.readFileSync(PROSPECTS_FILE, 'utf8'));
        const sampleRen = prospects[0];
        console.log("================ SAMPLE WHATSAPP PITCH ================");
        console.log(generateRenWhatsAppPitch(sampleRen));
        console.log("\n================ SAMPLE INBOUND DSR PARSER ================");
        const sampleBuyerText = "Salam Bang, saya Ali. Gaji net RM 7500, komitmen bank RM 2100. Cari kondo kat Setia Alam budget RM 480000.";
        console.log("Raw Input:", sampleBuyerText);
        console.log("Parsed Result:", parseInboundBuyerMessage(sampleBuyerText));
    }
}

module.exports = { generateRenWhatsAppPitch, parseInboundBuyerMessage };
