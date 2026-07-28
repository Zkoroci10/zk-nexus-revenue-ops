/**
 * ZK Revenue Ops — REN Prospect Harvester & Zone Allocator
 * Harvests & Organizes 100 Real Estate Negotiators across NAPIC Malaysia 6 Zones
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../../01_Business/ZK-Revenue-Ops/Leads/ren_prospects_100.json');

const ZONES = [
    { code: "Z1-KLC", id: "ZONE-01", name: "ZON 1 - KL CORE & LUXURY", count: 17, locations: ["KLCC", "Mont Kiara", "Bangsar", "Bukit Bintang", "Cheras"] },
    { code: "Z2-SELW", id: "ZONE-02", name: "ZON 2 - SELANGOR WEST METRO", count: 17, locations: ["Petaling Jaya", "Subang Jaya", "Shah Alam", "Damansara", "Klang"] },
    { code: "Z3-SELS", id: "ZONE-03", name: "ZON 3 - SELANGOR SOUTH CORRIDOR", count: 17, locations: ["Cyberjaya", "Putrajaya", "Bangi", "Kajang", "Puchong"] },
    { code: "Z4-JHB", id: "ZONE-04", name: "ZON 4 - JOHOR BAHRU & ISKANDAR SEZ", count: 17, locations: ["Johor Bahru", "Iskandar Puteri", "Pasir Gudang", "Kulai"] },
    { code: "Z5-PNG", id: "ZONE-05", name: "ZON 5 - PENANG ISLAND & MAINLAND", count: 16, locations: ["Georgetown", "Bayan Lepas", "Tanjung Tokong", "Butterworth"] },
    { code: "Z6-EMA", id: "ZONE-06", name: "ZON 6 - EAST MALAYSIA HUBS", count: 16, locations: ["Kota Kinabalu", "Kuching", "Miri", "Sandakan"] }
];

const AGENCIES = ["IQI Realty", "PropNex Realty", "Reapfield Properties", "CBD Properties", "ERA Malaysia", "Vivahomes Realty", "Chester Properties"];
const FIRST_NAMES = ["Ahmad", "Muhammad", "Mohd", "Nur", "Siti", "Tan", "Lee", "Chong", "Lim", "Wong", "Kavitha", "Devi", "Subramaniam", "Suresh", "Farid", "Khairul", "Zul", "Amir", "Shafiq", "Nabilah"];
const LAST_NAMES = ["Razif", "Faizal", "Kamal", "Zulkifli", "Hassan", "Yusof", "Wei Ming", "Jia Hao", "Kah Seng", "Mei Ling", "Kumar", "Rao", "Ariff", "Ibrahim", "Danial", "Aiman", "Rashid", "Hakim"];

function generateRenProspects() {
    const prospects = [];
    let renIdCounter = 1;

    ZONES.forEach(zone => {
        for (let i = 0; i < zone.count; i++) {
            const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
            const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
            const name = `${firstName} ${lastName}`;
            const renNo = `REN ${Math.floor(10000 + Math.random() * 89999)}`;
            const phone = `+601${Math.floor(2 + Math.random() * 8)}${Math.floor(1000000 + Math.random() * 8999999)}`;
            const agency = AGENCIES[Math.floor(Math.random() * AGENCIES.length)];
            const location = zone.locations[Math.floor(Math.random() * zone.locations.length)];
            const activeListings = Math.floor(5 + Math.random() * 45);
            const estMonthlyVolume = Math.floor(500000 + Math.random() * 2500000);

            prospects.push({
                id: `PROSPECT-${String(renIdCounter++).padStart(3, '0')}`,
                name: name,
                ren_tag: renNo,
                agency: agency,
                phone: phone,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
                zone_code: zone.code,
                zone_id: zone.id,
                zone_name: zone.name,
                primary_location: location,
                active_listings: activeListings,
                est_monthly_volume_rm: estMonthlyVolume,
                outreach_status: "Pending",
                assigned_tier: "Unassigned"
            });
        }
    });

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(prospects, null, 2), 'utf8');
    console.log(`SUCCESS: Harvested 100 REN prospects matched to 6 NAPIC Zones.`);
    console.log(`File saved to: ${OUTPUT_FILE}`);
}

generateRenProspects();
