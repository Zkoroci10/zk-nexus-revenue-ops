/**
 * ZK Revenue Ops — WhatsApp Auto-Outreach & Inbound Lead Qualification Engine
 * Professional, High-Converting Malaysian REN Outreach (Zero Cringe, Zero Emoji Overload)
 */

const fs = require('fs');
const path = require('path');

const PROSPECTS_FILE = path.join(__dirname, '../../01_Business/ZK-Revenue-Ops/Leads/ren_prospects_100.json');

/**
 * Generates a Clean, Professional & Respectful Outreach Message for Malaysian RENs
 */
function generateProfessionalWhatsAppPitch(ren) {
    const isFemale = /siti|nur|ain|puan|akak|nabilah|kavitha|devi|amira|zainab/i.test(ren.name);
    const honorific = isFemale ? 'Puan' : 'Tuan';

    return `Salam ${honorific} ${ren.name},

Saya menghubungi anda berhubung aktiviti listing hartanah anda di sekitar kawasan ${ren.primary_location} di bawah agensi ${ren.agency}.

Salah satu cabaran utama yang sering dihadapi oleh ejen terbilang seperti anda adalah menguruskan pangkalan data pembeli yang besar, di mana sebahagian besar pembeli tidak melepasi nisbah kelayakan pinjaman (DSR) bank selepas sesi perbincangan.

Pihak ZK Revenue Ops telah membangunkan infrastruktur *Client Portal & DSR Qualification Engine* khusus untuk REN top-performer:

- **Tapisan DSR Automatik**: Menapis kelayakan gaji bersih dan komitmen bank pembeli sebelum jadual viewing disahkan.
- **Portal Pelanggan Khas**: Dashboard berjenama persendirian di atas nama ${ren.name} (${ren.agency}).
- **Perkhidmatan Eksklusif**: Setiap daerah/sub-pasaran di ${ren.primary_location} dihadkan secara eksklusif kepada 1 REN sahaja bagi mengelakkan pertindihan kawasan pengiklanan (*ad targeting*).

Saya telah menyediakan satu pautan demonstrasi Client Portal di bawah profil anda untuk pandu uji:
https://zkoroci10.github.io/zk-nexus-revenue-ops/

Sekiranya kelapangan, dipersilakan untuk meneliti pautan tersebut. Terima kasih.

Yang benar,
**Pasukan ZK Revenue Ops**`;
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
        console.log("================ PROFESSIONAL CLEAN WHATSAPP PITCH ================");
        console.log(generateProfessionalWhatsAppPitch(prospects[0]));
    }
}

module.exports = { generateProfessionalWhatsAppPitch, parseInboundBuyerMessage };
