const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, '..', '..', '06_Assets', 'Banners');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Visual Theme Tokens
const COLORS = {
  bg: '#0D1117',
  cardBg: '#161B22',
  cardBorder: '#30363D',
  textPrimary: '#F0F6FC',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',
  emerald: '#2EA043',
  emeraldDark: '#238636',
  emeraldLight: '#3FB950',
  cyan: '#58A6FF',
  blue: '#1F6FEE',
  gold: '#D29922',
  goldLight: '#F1E05A'
};

// Common Defs for SVGs (Gradients, Filters, Patterns)
function getSvgDefs() {
  return `
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0D1117" />
        <stop offset="50%" stop-color="#161B22" />
        <stop offset="100%" stop-color="#090D12" />
      </linearGradient>
      
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1C2128" />
        <stop offset="100%" stop-color="#161B22" />
      </linearGradient>

      <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#238636" />
        <stop offset="100%" stop-color="#2EA043" />
      </linearGradient>

      <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#1F6FEE" />
        <stop offset="100%" stop-color="#58A6FF" />
      </linearGradient>

      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#B08000" />
        <stop offset="100%" stop-color="#D29922" />
      </linearGradient>

      <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#21262D" stroke-width="1" opacity="0.6"/>
      </pattern>

      <filter id="glowEmerald" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="15" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="15" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <style>
        .title-text { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; font-weight: 700; }
        .body-text { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; font-weight: 400; }
        .mono-text { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-weight: 700; }
      </style>
    </defs>
  `;
}

// 1. wa_header_cover.svg (1920x1080)
function buildHeaderCoverSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  ${getSvgDefs()}
  <!-- Background Base -->
  <rect width="1920" height="1080" fill="url(#bgGrad)" />
  <rect width="1920" height="1080" fill="url(#gridPattern)" />
  
  <!-- Glow Accent Spots -->
  <circle cx="200" cy="200" r="300" fill="#2EA043" opacity="0.12" filter="url(#glowEmerald)"/>
  <circle cx="1700" cy="850" r="350" fill="#58A6FF" opacity="0.1" filter="url(#glowCyan)"/>

  <!-- Top Brand Navigation Ribbon -->
  <rect x="0" y="0" width="1920" height="60" fill="#161B22" opacity="0.9"/>
  <line x1="0" y1="60" x2="1920" y2="60" stroke="#30363D" stroke-width="1"/>
  <circle cx="60" cy="30" r="10" fill="#2EA043"/>
  <text x="80" y="36" fill="${COLORS.textPrimary}" class="mono-text" font-size="16" letter-spacing="2">ZK NEXUS REVOPS PLATFORM</text>
  <text x="400" y="36" fill="${COLORS.textMuted}" class="body-text" font-size="16">|</text>
  <text x="420" y="36" fill="${COLORS.cyan}" class="mono-text" font-size="15">OFFICIAL WHATSAPP BUSINESS DIRECTORY &amp; REVOPS ENGINE</text>

  <!-- Left Main Container Card -->
  <rect x="80" y="110" width="1120" height="910" rx="20" fill="url(#cardGrad)" stroke="#30363D" stroke-width="2"/>
  
  <!-- Category Pill Badge -->
  <rect x="130" y="160" width="380" height="42" rx="21" fill="url(#emeraldGrad)"/>
  <text x="320" y="186" fill="#FFFFFF" class="mono-text" font-size="15" text-anchor="middle" letter-spacing="1">B2B REAL ESTATE REVOPS ENGINE</text>

  <!-- Main Headline & Subtitle -->
  <text x="130" y="270" fill="${COLORS.textPrimary}" class="title-text" font-size="58">ZK NEXUS PLATFORM</text>
  <text x="130" y="325" fill="${COLORS.cyan}" class="title-text" font-size="28">Autonomous WhatsApp SDR &amp; High-Volume Lead Pipeline</text>
  <text x="130" y="365" fill="${COLORS.textSecondary}" class="body-text" font-size="20">Empowering Solo Negotiators, Top Teams, and Enterprise Agencies across Malaysia.</text>

  <!-- Key Value Pillars (Checklist Cards) -->
  <g transform="translate(130, 410)">
    <!-- Pillar 1 -->
    <rect x="0" y="0" width="1020" height="85" rx="12" fill="#0D1117" stroke="#30363D" stroke-width="1"/>
    <circle cx="45" cy="42" r="18" fill="#2EA043" opacity="0.2"/>
    <path d="M 37 42 L 43 48 L 54 36" fill="none" stroke="#2EA043" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="80" y="38" fill="${COLORS.textPrimary}" class="title-text" font-size="20">AI Lead Parser &amp; Instant DSR Qualification</text>
    <text x="80" y="64" fill="${COLORS.textSecondary}" class="body-text" font-size="15">Extracts buyer budget, location preferences, and automatically calculates debt-service capability in real time.</text>

    <!-- Pillar 2 -->
    <rect x="0" y="105" width="1020" height="85" rx="12" fill="#0D1117" stroke="#30363D" stroke-width="1"/>
    <circle cx="45" cy="147" r="18" fill="#58A6FF" opacity="0.2"/>
    <path d="M 37 147 L 43 153 L 54 141" fill="none" stroke="#58A6FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="80" y="143" fill="${COLORS.textPrimary}" class="title-text" font-size="20">Dynamic Multi-Agent Round-Robin Allocation</text>
    <text x="80" y="169" fill="${COLORS.textSecondary}" class="body-text" font-size="15">Zero-delay lead distribution for 1-5 REN teams with speed-to-lead SLA tracking under 2 minutes.</text>

    <!-- Pillar 3 -->
    <rect x="0" y="210" width="1020" height="85" rx="12" fill="#0D1117" stroke="#30363D" stroke-width="1"/>
    <circle cx="45" cy="252" r="18" fill="#D29922" opacity="0.2"/>
    <path d="M 37 252 L 43 258 L 54 246" fill="none" stroke="#D29922" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="80" y="248" fill="${COLORS.textPrimary}" class="title-text" font-size="20">Enterprise WhatsApp Cloud API &amp; Dedicated Infrastructure</text>
    <text x="80" y="274" fill="${COLORS.textSecondary}" class="body-text" font-size="15">High-concurrency query handling supporting massive 100,000+ lead databases with sub-50ms latency.</text>
  </g>

  <!-- Stat Counter Boxes (Bottom of Left Card) -->
  <g transform="translate(130, 745)">
    <!-- Stat 1 -->
    <rect x="0" y="0" width="320" height="200" rx="14" fill="#0D1117" stroke="#30363D" stroke-width="1.5"/>
    <text x="30" y="70" fill="${COLORS.cyan}" class="mono-text" font-size="44">100k+</text>
    <text x="30" y="110" fill="${COLORS.textPrimary}" class="title-text" font-size="18">Lead Scale</text>
    <text x="30" y="140" fill="${COLORS.textSecondary}" class="body-text" font-size="14">Enterprise DB capacity</text>

    <!-- Stat 2 -->
    <rect x="350" y="0" width="320" height="200" rx="14" fill="#0D1117" stroke="#30363D" stroke-width="1.5"/>
    <text x="380" y="70" fill="${COLORS.emerald}" class="mono-text" font-size="44">&lt;50ms</text>
    <text x="380" y="110" fill="${COLORS.textPrimary}" class="title-text" font-size="18">Query Latency</text>
    <text x="380" y="140" fill="${COLORS.textSecondary}" class="body-text" font-size="14">Instant response engine</text>

    <!-- Stat 3 -->
    <rect x="700" y="0" width="320" height="200" rx="14" fill="#0D1117" stroke="#30363D" stroke-width="1.5"/>
    <text x="730" y="70" fill="${COLORS.gold}" class="mono-text" font-size="44">100%</text>
    <text x="730" y="110" fill="${COLORS.textPrimary}" class="title-text" font-size="18">PDPA 2010</text>
    <text x="730" y="140" fill="${COLORS.textSecondary}" class="body-text" font-size="14">Malaysian Data Compliance</text>
  </g>

  <!-- Right Side Column -->
  <!-- 1. Founder Badge Card -->
  <g transform="translate(1240, 110)">
    <rect x="0" y="0" width="600" height="435" rx="20" fill="url(#cardGrad)" stroke="#30363D" stroke-width="2"/>
    
    <text x="40" y="55" fill="${COLORS.textMuted}" class="mono-text" font-size="14" letter-spacing="2">LEADERSHIP &amp; FOUNDER</text>
    
    <!-- Founder Avatar Visual Circle -->
    <circle cx="110" cy="165" r="55" fill="#0D1117" stroke="${COLORS.emerald}" stroke-width="3" filter="url(#glowEmerald)"/>
    <circle cx="110" cy="165" r="48" fill="url(#emeraldGrad)"/>
    <text x="110" y="177" fill="#FFFFFF" class="title-text" font-size="36" text-anchor="middle">ZA</text>
    <circle cx="148" cy="202" r="14" fill="${COLORS.emerald}"/>
    <path d="M 142 202 L 146 206 L 154 198" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>

    <!-- Founder Info -->
    <text x="190" y="145" fill="${COLORS.textPrimary}" class="title-text" font-size="30">Zubair Ariff</text>
    <text x="190" y="175" fill="${COLORS.emerald}" class="mono-text" font-size="16">FOUNDER &amp; CHIEF ARCHITECT</text>
    <text x="190" y="202" fill="${COLORS.textSecondary}" class="body-text" font-size="15">ZK Nexus RevOps Engineering</text>

    <!-- Bio / Badge Statement -->
    <rect x="40" y="250" width="520" height="145" rx="12" fill="#0D1117" stroke="#30363D" stroke-width="1"/>
    <text x="65" y="288" fill="${COLORS.textPrimary}" class="body-text" font-size="16" font-style="italic">"We built ZK Nexus to empower Malaysian real estate</text>
    <text x="65" y="315" fill="${COLORS.textPrimary}" class="body-text" font-size="16" font-style="italic">professionals with enterprise-grade autonomous SDR</text>
    <text x="65" y="342" fill="${COLORS.textPrimary}" class="body-text" font-size="16" font-style="italic">tools, instant DSR qualification, &amp; 100% compliance."</text>
    
    <rect x="360" y="352" width="180" height="28" rx="14" fill="#161B22" stroke="${COLORS.emerald}" stroke-width="1"/>
    <text x="450" y="371" fill="${COLORS.emerald}" class="mono-text" font-size="12" text-anchor="middle">AUTHENTIC BADGE</text>
  </g>

  <!-- 2. PDPA Compliance & Trust Seal Card -->
  <g transform="translate(1240, 585)">
    <rect x="0" y="0" width="600" height="435" rx="20" fill="url(#cardGrad)" stroke="#30363D" stroke-width="2"/>
    
    <text x="40" y="55" fill="${COLORS.textMuted}" class="mono-text" font-size="14" letter-spacing="2">DATA GOVERNANCE &amp; SECURITY</text>

    <!-- Shield Graphic -->
    <g transform="translate(40, 85)">
      <rect x="0" y="0" width="520" height="150" rx="14" fill="#0D1117" stroke="${COLORS.emerald}" stroke-width="1.5"/>
      <path d="M 60 40 L 90 25 L 120 40 C 120 80 90 105 90 105 C 90 105 60 80 60 40 Z" fill="url(#emeraldGrad)" opacity="0.9"/>
      <path d="M 80 62 L 87 69 L 100 56" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>

      <text x="145" y="58" fill="${COLORS.textPrimary}" class="title-text" font-size="22">100% PDPA 2010 ALIGNMENT SEAL</text>
      <text x="145" y="88" fill="${COLORS.emerald}" class="mono-text" font-size="14">MALAYSIA PERSONAL DATA PROTECTION ACT</text>
      <text x="145" y="115" fill="${COLORS.textSecondary}" class="body-text" font-size="14">Strict consent tracking, encrypted data storage &amp; audit trails.</text>
    </g>

    <!-- Feature Grid inside Trust Card -->
    <g transform="translate(40, 260)">
      <rect x="0" y="0" width="245" height="135" rx="10" fill="#0D1117" stroke="#30363D" stroke-width="1"/>
      <text x="20" y="45" fill="${COLORS.cyan}" class="mono-text" font-size="16">AES-256 BIT</text>
      <text x="20" y="75" fill="${COLORS.textPrimary}" class="title-text" font-size="16">Data Encryption</text>
      <text x="20" y="102" fill="${COLORS.textMuted}" class="body-text" font-size="13">At rest &amp; in transit</text>

      <rect x="275" y="0" width="245" height="135" rx="10" fill="#0D1117" stroke="#30363D" stroke-width="1"/>
      <text x="295" y="45" fill="${COLORS.gold}" class="mono-text" font-size="16">24/7 MONITORING</text>
      <text x="295" y="75" fill="${COLORS.textPrimary}" class="title-text" font-size="16">Audit Log System</text>
      <text x="295" y="102" fill="${COLORS.textMuted}" class="body-text" font-size="13">Real-time threat check</text>
    </g>
  </g>
</svg>`;
}

// 2. wa_catalog_tier1_starter.svg (1080x1080)
function buildCatalogTier1Svg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  ${getSvgDefs()}
  <rect width="1080" height="1080" fill="url(#bgGrad)" />
  <rect width="1080" height="1080" fill="url(#gridPattern)" />
  <circle cx="900" cy="150" r="300" fill="#2EA043" opacity="0.12" filter="url(#glowEmerald)"/>

  <!-- Outer Frame Card -->
  <rect x="50" y="50" width="980" height="980" rx="24" fill="url(#cardGrad)" stroke="#30363D" stroke-width="2"/>

  <!-- Header Header Line -->
  <rect x="90" y="90" width="220" height="36" rx="18" fill="#0D1117" stroke="#30363D" stroke-width="1"/>
  <text x="200" y="113" fill="${COLORS.textMuted}" class="mono-text" font-size="14" text-anchor="middle" letter-spacing="1">TIER 1 EDITION</text>

  <!-- Promo Ribbon Badge Top Right -->
  <rect x="640" y="85" width="330" height="46" rx="23" fill="url(#goldGrad)"/>
  <text x="805" y="114" fill="#000000" class="mono-text" font-size="16" text-anchor="middle" font-weight="bold">67% OFF LAUNCH PROMO</text>

  <!-- Title & Description -->
  <text x="90" y="205" fill="${COLORS.textPrimary}" class="title-text" font-size="46">STARTER SOLO REN</text>
  <text x="90" y="245" fill="${COLORS.cyan}" class="title-text" font-size="22">Automated WhatsApp RevOps for Solo Real Estate Negotiators</text>
  <text x="90" y="280" fill="${COLORS.textSecondary}" class="body-text" font-size="18">Turn raw WhatsApp leads into qualified buyers effortlessly 24/7.</text>

  <!-- Pricing Box Container -->
  <rect x="90" y="320" width="900" height="170" rx="16" fill="#0D1117" stroke="${COLORS.emerald}" stroke-width="2"/>
  
  <text x="130" y="375" fill="${COLORS.textMuted}" class="mono-text" font-size="24" style="text-decoration: line-through;">Standard RM1,500/mo</text>
  
  <g transform="translate(130, 395)">
    <text x="0" y="50" fill="${COLORS.emerald}" class="mono-text" font-size="58">RM500</text>
    <text x="235" y="50" fill="${COLORS.emerald}" class="mono-text" font-size="28">/mo</text>
    <rect x="310" y="18" width="180" height="34" rx="17" fill="url(#emeraldGrad)"/>
    <text x="400" y="40" fill="#FFFFFF" class="mono-text" font-size="14" text-anchor="middle">SAVE RM1,000/MO</text>
  </g>
  <text x="130" y="472" fill="${COLORS.textSecondary}" class="body-text" font-size="15">Limited Launch Offer • Billed Monthly • Zero Risk</text>

  <!-- Features Grid -->
  <g transform="translate(90, 520)">
    <text x="0" y="30" fill="${COLORS.textPrimary}" class="title-text" font-size="24">Included Starter Features:</text>

    <!-- Feature 1 -->
    <rect x="0" y="50" width="435" height="100" rx="12" fill="#161B22" stroke="#30363D" stroke-width="1"/>
    <circle cx="40" cy="100" r="16" fill="#2EA043" opacity="0.2"/>
    <path d="M 33 100 L 38 105 L 48 95" fill="none" stroke="#2EA043" stroke-width="3" stroke-linecap="round"/>
    <text x="70" y="93" fill="${COLORS.textPrimary}" class="title-text" font-size="18">AI WhatsApp Lead Parser</text>
    <text x="70" y="118" fill="${COLORS.textSecondary}" class="body-text" font-size="14">Extracts buyer name, budget &amp; area</text>

    <!-- Feature 2 -->
    <rect x="465" y="50" width="435" height="100" rx="12" fill="#161B22" stroke="#30363D" stroke-width="1"/>
    <circle cx="505" cy="100" r="16" fill="#2EA043" opacity="0.2"/>
    <path d="M 498 100 L 503 105 L 513 95" fill="none" stroke="#2EA043" stroke-width="3" stroke-linecap="round"/>
    <text x="535" y="93" fill="${COLORS.textPrimary}" class="title-text" font-size="18">Instant DSR Qualifier</text>
    <text x="535" y="118" fill="${COLORS.textSecondary}" class="body-text" font-size="14">Debt Service Ratio pre-qualification</text>

    <!-- Feature 3 -->
    <rect x="0" y="170" width="435" height="100" rx="12" fill="#161B22" stroke="#30363D" stroke-width="1"/>
    <circle cx="40" cy="220" r="16" fill="#2EA043" opacity="0.2"/>
    <path d="M 33 220 L 38 225 L 48 215" fill="none" stroke="#2EA043" stroke-width="3" stroke-linecap="round"/>
    <text x="70" y="213" fill="${COLORS.textPrimary}" class="title-text" font-size="18">24/7 Auto Responder</text>
    <text x="70" y="238" fill="${COLORS.textSecondary}" class="body-text" font-size="14">Sub-minute automated response</text>

    <!-- Feature 4 -->
    <rect x="465" y="170" width="435" height="100" rx="12" fill="#161B22" stroke="#30363D" stroke-width="1"/>
    <circle cx="505" cy="220" r="16" fill="#2EA043" opacity="0.2"/>
    <path d="M 498 220 L 503 225 L 513 215" fill="none" stroke="#2EA043" stroke-width="3" stroke-linecap="round"/>
    <text x="535" y="213" fill="${COLORS.textPrimary}" class="title-text" font-size="18">Up to 1,000 Active Leads</text>
    <text x="535" y="238" fill="${COLORS.textSecondary}" class="body-text" font-size="14">Organized buyer database storage</text>
  </g>

  <!-- CTA Banner Bottom -->
  <g transform="translate(90, 875)">
    <rect x="0" y="0" width="900" height="90" rx="16" fill="url(#emeraldGrad)" filter="url(#glowEmerald)"/>
    <text x="450" y="52" fill="#FFFFFF" class="title-text" font-size="24" text-anchor="middle" letter-spacing="1">CLAIM STARTER TIER — RM500/MO</text>
  </g>
</svg>`;
}

// 3. wa_catalog_tier2_growth.svg (1080x1080)
function buildCatalogTier2Svg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  ${getSvgDefs()}
  <rect width="1080" height="1080" fill="url(#bgGrad)" />
  <rect width="1080" height="1080" fill="url(#gridPattern)" />
  <circle cx="900" cy="150" r="300" fill="#58A6FF" opacity="0.12" filter="url(#glowCyan)"/>

  <!-- Outer Frame Card -->
  <rect x="50" y="50" width="980" height="980" rx="24" fill="url(#cardGrad)" stroke="#30363D" stroke-width="2"/>

  <!-- Header Header Line -->
  <rect x="90" y="90" width="220" height="36" rx="18" fill="#0D1117" stroke="#30363D" stroke-width="1"/>
  <text x="200" y="113" fill="${COLORS.textMuted}" class="mono-text" font-size="14" text-anchor="middle" letter-spacing="1">TIER 2 EDITION</text>

  <!-- Top Ribbon Badge -->
  <rect x="640" y="85" width="330" height="46" rx="23" fill="url(#cyanGrad)"/>
  <text x="805" y="114" fill="#FFFFFF" class="mono-text" font-size="16" text-anchor="middle" font-weight="bold">TOP TEAM CHOICE (1-5 RENs)</text>

  <!-- Title & Description -->
  <text x="90" y="205" fill="${COLORS.textPrimary}" class="title-text" font-size="46">GROWTH TOP TEAM</text>
  <text x="90" y="245" fill="${COLORS.cyan}" class="title-text" font-size="22">Multi-Agent Lead Allocation &amp; Team Speed-to-Lead Engine</text>
  <text x="90" y="280" fill="${COLORS.textSecondary}" class="body-text" font-size="18">Equip your team with automated round-robin routing &amp; SLA tracking.</text>

  <!-- Pricing Box Container -->
  <rect x="90" y="320" width="900" height="170" rx="16" fill="#0D1117" stroke="${COLORS.cyan}" stroke-width="2"/>
  
  <g transform="translate(130, 355)">
    <text x="0" y="60" fill="${COLORS.cyan}" class="mono-text" font-size="64">RM3,000</text>
    <text x="315" y="60" fill="${COLORS.cyan}" class="mono-text" font-size="28">/mo</text>
    <rect x="400" y="25" width="240" height="38" rx="19" fill="url(#cyanGrad)"/>
    <text x="520" y="50" fill="#FFFFFF" class="mono-text" font-size="15" text-anchor="middle">1 UNTIL 5 REN SEATS INCLUDED</text>
  </g>
  <text x="130" y="465" fill="${COLORS.textSecondary}" class="body-text" font-size="15">Flat Monthly Rate • No Per-Lead Hidden Charges • SLA Guaranteed</text>

  <!-- Features Grid -->
  <g transform="translate(90, 520)">
    <text x="0" y="30" fill="${COLORS.textPrimary}" class="title-text" font-size="24">Growth Team Platform Capabilities:</text>

    <!-- Feature 1 -->
    <rect x="0" y="50" width="435" height="100" rx="12" fill="#161B22" stroke="#30363D" stroke-width="1"/>
    <circle cx="40" cy="100" r="16" fill="#58A6FF" opacity="0.2"/>
    <path d="M 33 100 L 38 105 L 48 95" fill="none" stroke="#58A6FF" stroke-width="3" stroke-linecap="round"/>
    <text x="70" y="93" fill="${COLORS.textPrimary}" class="title-text" font-size="18">Dynamic Round-Robin Engine</text>
    <text x="70" y="118" fill="${COLORS.textSecondary}" class="body-text" font-size="14">Instant fair lead distribution</text>

    <!-- Feature 2 -->
    <rect x="465" y="50" width="435" height="100" rx="12" fill="#161B22" stroke="#30363D" stroke-width="1"/>
    <circle cx="505" cy="100" r="16" fill="#58A6FF" opacity="0.2"/>
    <path d="M 498 100 L 503 105 L 513 95" fill="none" stroke="#58A6FF" stroke-width="3" stroke-linecap="round"/>
    <text x="535" y="93" fill="${COLORS.textPrimary}" class="title-text" font-size="18">Speed-to-Lead SLA Tracker</text>
    <text x="535" y="118" fill="${COLORS.textSecondary}" class="body-text" font-size="14">&lt;2 min agent response alerts</text>

    <!-- Feature 3 -->
    <rect x="0" y="170" width="435" height="100" rx="12" fill="#161B22" stroke="#30363D" stroke-width="1"/>
    <circle cx="40" cy="220" r="16" fill="#58A6FF" opacity="0.2"/>
    <path d="M 33 220 L 38 225 L 48 215" fill="none" stroke="#58A6FF" stroke-width="3" stroke-linecap="round"/>
    <text x="70" y="213" fill="${COLORS.textPrimary}" class="title-text" font-size="18">Team Dashboard &amp; Inbox</text>
    <text x="70" y="238" fill="${COLORS.textSecondary}" class="body-text" font-size="14">Shared multi-agent visibility</text>

    <!-- Feature 4 -->
    <rect x="465" y="170" width="435" height="100" rx="12" fill="#161B22" stroke="#30363D" stroke-width="1"/>
    <circle cx="505" cy="220" r="16" fill="#58A6FF" opacity="0.2"/>
    <path d="M 498 220 L 503 225 L 513 215" fill="none" stroke="#58A6FF" stroke-width="3" stroke-linecap="round"/>
    <text x="535" y="213" fill="${COLORS.textPrimary}" class="title-text" font-size="18">Automated CRM Sync</text>
    <text x="535" y="238" fill="${COLORS.textSecondary}" class="body-text" font-size="14">Follow-up drip sequences</text>
  </g>

  <!-- CTA Banner Bottom -->
  <g transform="translate(90, 875)">
    <rect x="0" y="0" width="900" height="90" rx="16" fill="url(#cyanGrad)" filter="url(#glowCyan)"/>
    <text x="450" y="52" fill="#FFFFFF" class="title-text" font-size="24" text-anchor="middle" letter-spacing="1">SELECT GROWTH TIER — RM3,000/MO</text>
  </g>
</svg>`;
}

// 4. wa_catalog_tier3_enterprise.svg (1080x1080)
function buildCatalogTier3Svg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  ${getSvgDefs()}
  <rect width="1080" height="1080" fill="url(#bgGrad)" />
  <rect width="1080" height="1080" fill="url(#gridPattern)" />
  <circle cx="900" cy="150" r="300" fill="#D29922" opacity="0.12" filter="url(#glowEmerald)"/>

  <!-- Outer Frame Card -->
  <rect x="50" y="50" width="980" height="980" rx="24" fill="url(#cardGrad)" stroke="#30363D" stroke-width="2"/>

  <!-- Header Header Line -->
  <rect x="90" y="90" width="220" height="36" rx="18" fill="#0D1117" stroke="#30363D" stroke-width="1"/>
  <text x="200" y="113" fill="${COLORS.textMuted}" class="mono-text" font-size="14" text-anchor="middle" letter-spacing="1">TIER 3 EDITION</text>

  <!-- Top Ribbon Badge -->
  <rect x="640" y="85" width="330" height="46" rx="23" fill="url(#goldGrad)"/>
  <text x="805" y="114" fill="#000000" class="mono-text" font-size="16" text-anchor="middle" font-weight="bold">100,000+ LEAD INFRASTRUCTURE</text>

  <!-- Title & Description -->
  <text x="90" y="205" fill="${COLORS.textPrimary}" class="title-text" font-size="46">ENTERPRISE AGENCY</text>
  <text x="90" y="245" fill="${COLORS.gold}" class="title-text" font-size="22">Dedicated High-Concurrency Infrastructure &amp; API Integration</text>
  <text x="90" y="280" fill="${COLORS.textSecondary}" class="body-text" font-size="18">Tailored for large real estate agencies, brokerages, &amp; property developers.</text>

  <!-- Pricing Box Container -->
  <rect x="90" y="320" width="900" height="170" rx="16" fill="#0D1117" stroke="${COLORS.gold}" stroke-width="2"/>
  
  <g transform="translate(130, 360)">
    <text x="0" y="55" fill="${COLORS.gold}" class="mono-text" font-size="52">CUSTOM QUOTE</text>
    <rect x="420" y="18" width="240" height="40" rx="20" fill="url(#goldGrad)"/>
    <text x="540" y="44" fill="#000000" class="mono-text" font-size="15" text-anchor="middle" font-weight="bold">OPEN TO DISCUSSION</text>
  </g>
  <text x="130" y="465" fill="${COLORS.textSecondary}" class="body-text" font-size="15">Custom SLA • Unlimited REN Accounts • Dedicated Server Architecture</text>

  <!-- Enterprise Specs Counters -->
  <g transform="translate(90, 515)">
    <rect x="0" y="0" width="435" height="110" rx="14" fill="#0D1117" stroke="#30363D" stroke-width="1"/>
    <text x="30" y="55" fill="${COLORS.gold}" class="mono-text" font-size="38">100,000+</text>
    <text x="30" y="88" fill="${COLORS.textPrimary}" class="title-text" font-size="16">Lead Database Capacity</text>

    <rect x="465" y="0" width="435" height="110" rx="14" fill="#0D1117" stroke="#30363D" stroke-width="1"/>
    <text x="495" y="55" fill="${COLORS.emerald}" class="mono-text" font-size="38">&lt;50ms</text>
    <text x="495" y="88" fill="${COLORS.textPrimary}" class="title-text" font-size="16">Query Response Latency</text>
  </g>

  <!-- Features Grid -->
  <g transform="translate(90, 650)">
    <!-- Feature 1 -->
    <rect x="0" y="0" width="435" height="90" rx="12" fill="#161B22" stroke="#30363D" stroke-width="1"/>
    <circle cx="40" cy="45" r="16" fill="#D29922" opacity="0.2"/>
    <path d="M 33 45 L 38 50 L 48 40" fill="none" stroke="#D29922" stroke-width="3" stroke-linecap="round"/>
    <text x="70" y="42" fill="${COLORS.textPrimary}" class="title-text" font-size="17">Dedicated Cloud API Node</text>
    <text x="70" y="65" fill="${COLORS.textSecondary}" class="body-text" font-size="14">Isolated infrastructure &amp; custom webhooks</text>

    <!-- Feature 2 -->
    <rect x="465" y="0" width="435" height="90" rx="12" fill="#161B22" stroke="#30363D" stroke-width="1"/>
    <circle cx="505" cy="45" r="16" fill="#D29922" opacity="0.2"/>
    <path d="M 498 45 L 503 50 L 513 40" fill="none" stroke="#D29922" stroke-width="3" stroke-linecap="round"/>
    <text x="535" y="42" fill="${COLORS.textPrimary}" class="title-text" font-size="17">Custom CRM &amp; ERP Connectors</text>
    <text x="535" y="65" fill="${COLORS.textSecondary}" class="body-text" font-size="14">Direct sync with enterprise databases</text>

    <!-- Feature 3 -->
    <rect x="0" y="105" width="435" height="90" rx="12" fill="#161B22" stroke="#30363D" stroke-width="1"/>
    <circle cx="40" cy="150" r="16" fill="#D29922" opacity="0.2"/>
    <path d="M 33 150 L 38 155 L 48 145" fill="none" stroke="#D29922" stroke-width="3" stroke-linecap="round"/>
    <text x="70" y="147" fill="${COLORS.textPrimary}" class="title-text" font-size="17">Unlimited REN Seat Licenses</text>
    <text x="70" y="170" fill="${COLORS.textSecondary}" class="body-text" font-size="14">Role-based access for 100+ agents</text>

    <!-- Feature 4 -->
    <rect x="465" y="105" width="435" height="90" rx="12" fill="#161B22" stroke="#30363D" stroke-width="1"/>
    <circle cx="505" cy="150" r="16" fill="#D29922" opacity="0.2"/>
    <path d="M 498 150 L 503 155 L 513 145" fill="none" stroke="#D29922" stroke-width="3" stroke-linecap="round"/>
    <text x="535" y="147" fill="${COLORS.textPrimary}" class="title-text" font-size="17">24/7 Dedicated Account Lead</text>
    <text x="535" y="170" fill="${COLORS.textSecondary}" class="body-text" font-size="14">Priority engineering &amp; SLA support</text>
  </g>

  <!-- CTA Banner Bottom -->
  <g transform="translate(90, 875)">
    <rect x="0" y="0" width="900" height="90" rx="16" fill="url(#goldGrad)"/>
    <text x="450" y="52" fill="#000000" class="title-text" font-size="24" text-anchor="middle" font-weight="bold" letter-spacing="1">REQUEST CUSTOM ENTERPRISE PROPOSAL</text>
  </g>
</svg>`;
}

// 5. wa_catalog_free_trial.svg (1080x1080)
function buildCatalogFreeTrialSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  ${getSvgDefs()}
  <rect width="1080" height="1080" fill="url(#bgGrad)" />
  <rect width="1080" height="1080" fill="url(#gridPattern)" />
  <circle cx="900" cy="150" r="300" fill="#2EA043" opacity="0.15" filter="url(#glowEmerald)"/>

  <!-- Outer Frame Card -->
  <rect x="50" y="50" width="980" height="980" rx="24" fill="url(#cardGrad)" stroke="#30363D" stroke-width="2"/>

  <!-- Header Header Line -->
  <rect x="90" y="90" width="220" height="36" rx="18" fill="#0D1117" stroke="#30363D" stroke-width="1"/>
  <text x="200" y="113" fill="${COLORS.textMuted}" class="mono-text" font-size="14" text-anchor="middle" letter-spacing="1">PILOT PROGRAM</text>

  <!-- Top Ribbon Badge -->
  <rect x="640" y="85" width="330" height="46" rx="23" fill="url(#emeraldGrad)"/>
  <text x="805" y="114" fill="#FFFFFF" class="mono-text" font-size="16" text-anchor="middle" font-weight="bold">100% RISK-FREE ONBOARDING</text>

  <!-- Title & Description -->
  <text x="90" y="205" fill="${COLORS.textPrimary}" class="title-text" font-size="46">30-DAY FREE PILOT</text>
  <text x="90" y="245" fill="${COLORS.emerald}" class="title-text" font-size="22">Test Drive ZK Nexus WhatsApp RevOps Engine with 0 Upfront Cost</text>
  <text x="90" y="280" fill="${COLORS.textSecondary}" class="body-text" font-size="18">Experience autonomous lead qualification in your real estate practice.</text>

  <!-- Pricing Box Container -->
  <rect x="90" y="320" width="900" height="170" rx="16" fill="#0D1117" stroke="${COLORS.emerald}" stroke-width="2"/>
  
  <g transform="translate(130, 360)">
    <text x="0" y="60" fill="${COLORS.emerald}" class="mono-text" font-size="64">RM0</text>
    <text x="160" y="60" fill="${COLORS.textPrimary}" class="title-text" font-size="34">FULL ACCESS</text>
    <rect x="420" y="24" width="240" height="40" rx="20" fill="#161B22" stroke="${COLORS.emerald}" stroke-width="1.5"/>
    <text x="540" y="50" fill="${COLORS.emerald}" class="mono-text" font-size="15" text-anchor="middle">0 UPFRONT COST</text>
  </g>
  <text x="130" y="465" fill="${COLORS.textSecondary}" class="body-text" font-size="15">No Credit Card Required • Zero Commitment • 1-Click Setup</text>

  <!-- Features Grid -->
  <g transform="translate(90, 520)">
    <text x="0" y="30" fill="${COLORS.textPrimary}" class="title-text" font-size="24">What You Get In Your 30-Day Pilot:</text>

    <!-- Feature 1 -->
    <rect x="0" y="50" width="435" height="100" rx="12" fill="#161B22" stroke="#30363D" stroke-width="1"/>
    <circle cx="40" cy="100" r="16" fill="#2EA043" opacity="0.2"/>
    <path d="M 33 100 L 38 105 L 48 95" fill="none" stroke="#2EA043" stroke-width="3" stroke-linecap="round"/>
    <text x="70" y="93" fill="${COLORS.textPrimary}" class="title-text" font-size="18">Full Feature Access</text>
    <text x="70" y="118" fill="${COLORS.textSecondary}" class="body-text" font-size="14">All Tier 1 Lead Parsing &amp; DSR engine</text>

    <!-- Feature 2 -->
    <rect x="465" y="50" width="435" height="100" rx="12" fill="#161B22" stroke="#30363D" stroke-width="1"/>
    <circle cx="505" cy="100" r="16" fill="#2EA043" opacity="0.2"/>
    <path d="M 498 100 L 503 105 L 513 95" fill="none" stroke="#2EA043" stroke-width="3" stroke-linecap="round"/>
    <text x="535" y="93" fill="${COLORS.textPrimary}" class="title-text" font-size="18">Free Guided Onboarding</text>
    <text x="535" y="118" fill="${COLORS.textSecondary}" class="body-text" font-size="14">1-on-1 workflow &amp; WhatsApp setup</text>

    <!-- Feature 3 -->
    <rect x="0" y="170" width="435" height="100" rx="12" fill="#161B22" stroke="#30363D" stroke-width="1"/>
    <circle cx="40" cy="220" r="16" fill="#2EA043" opacity="0.2"/>
    <path d="M 33 220 L 38 225 L 48 215" fill="none" stroke="#2EA043" stroke-width="3" stroke-linecap="round"/>
    <text x="70" y="213" fill="${COLORS.textPrimary}" class="title-text" font-size="18">Live Lead Qualification</text>
    <text x="70" y="238" fill="${COLORS.textSecondary}" class="body-text" font-size="14">Test with real active property leads</text>

    <!-- Feature 4 -->
    <rect x="465" y="170" width="435" height="100" rx="12" fill="#161B22" stroke="#30363D" stroke-width="1"/>
    <circle cx="505" cy="220" r="16" fill="#2EA043" opacity="0.2"/>
    <path d="M 498 220 L 503 225 L 513 215" fill="none" stroke="#2EA043" stroke-width="3" stroke-linecap="round"/>
    <text x="535" y="213" fill="${COLORS.textPrimary}" class="title-text" font-size="18">Zero Lock-In Guarantee</text>
    <text x="535" y="238" fill="${COLORS.textSecondary}" class="body-text" font-size="14">Export your lead database anytime</text>
  </g>

  <!-- CTA Banner Bottom -->
  <g transform="translate(90, 875)">
    <rect x="0" y="0" width="900" height="90" rx="16" fill="url(#emeraldGrad)" filter="url(#glowEmerald)"/>
    <text x="450" y="52" fill="#FFFFFF" class="title-text" font-size="24" text-anchor="middle" letter-spacing="1">START 30-DAY FREE PILOT NOW</text>
  </g>
</svg>`;
}

const assets = [
  { name: 'wa_header_cover', width: 1920, height: 1080, generator: buildHeaderCoverSvg },
  { name: 'wa_catalog_tier1_starter', width: 1080, height: 1080, generator: buildCatalogTier1Svg },
  { name: 'wa_catalog_tier2_growth', width: 1080, height: 1080, generator: buildCatalogTier2Svg },
  { name: 'wa_catalog_tier3_enterprise', width: 1080, height: 1080, generator: buildCatalogTier3Svg },
  { name: 'wa_catalog_free_trial', width: 1080, height: 1080, generator: buildCatalogFreeTrialSvg }
];

console.log("Generating 5 SVG Master Vector Assets and Rendering 5 JPG Raster Assets...");

const edgePath = `C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe`;

assets.forEach(asset => {
  const svgPath = path.join(targetDir, `${asset.name}.svg`);
  const jpgPath = path.join(targetDir, `${asset.name}.jpg`);
  const htmlPath = path.join(targetDir, `${asset.name}_render.html`);

  const svgContent = asset.generator();
  fs.writeFileSync(svgPath, svgContent);
  console.log(`Saved SVG: ${svgPath} (${fs.statSync(svgPath).size} bytes)`);

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<style>
  html, body { margin: 0; padding: 0; width: ${asset.width}px; height: ${asset.height}px; overflow: hidden; background: #0D1117; }
  img { width: ${asset.width}px; height: ${asset.height}px; display: block; }
</style>
</head>
<body>
  <img src="file:///${svgPath.replace(/\\/g, '/')}" />
</body>
</html>
  `;
  fs.writeFileSync(htmlPath, htmlContent);

  const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --screenshot="${jpgPath}" --window-size=${asset.width},${asset.height} "file:///${htmlPath.replace(/\\/g, '/')}"`;
  
  try {
    execSync(cmd);
    console.log(`Rendered JPG: ${jpgPath} (${fs.statSync(jpgPath).size} bytes)`);
  } catch (err) {
    console.error(`Failed rendering ${asset.name}.jpg:`, err);
  } finally {
    if (fs.existsSync(htmlPath)) {
      fs.unlinkSync(htmlPath);
    }
  }
});

console.log("All 10 Banner Asset Files successfully created!");
