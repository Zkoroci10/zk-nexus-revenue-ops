const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, '..', '..', '06_Assets', 'Banners');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Package 01 - Entry / Pilot Trial (Navy Slate Theme - Dormant Lead Revival & Follow-Up Shield)
function buildCard01() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .serif-title { font-family: 'Georgia', 'Times New Roman', serif; font-weight: 700; }
      .sans-body { font-family: 'Segoe UI', -apple-system, system-ui, sans-serif; font-weight: 400; }
      .sans-bold { font-family: 'Segoe UI', -apple-system, system-ui, sans-serif; font-weight: 600; }
      .mono-text { font-family: 'SFMono-Regular', Consolas, monospace; font-weight: 600; }
    </style>
  </defs>

  <!-- Background Base -->
  <rect width="1080" height="1080" fill="#09101C"/>
  
  <!-- Subtle Circular Line Art in Background -->
  <circle cx="850" cy="220" r="450" fill="none" stroke="#1A2840" stroke-width="1.5" opacity="0.6"/>
  <circle cx="850" cy="220" r="600" fill="none" stroke="#152033" stroke-width="1.5" opacity="0.4"/>
  
  <!-- Huge Faint Background Number -->
  <text x="750" y="320" fill="#132138" class="serif-title" font-size="280" opacity="0.7">01</text>

  <!-- Header Text Line -->
  <text x="80" y="110" fill="#7D93B5" class="mono-text" font-size="16" letter-spacing="3">ZK ARIFF CAPITAL · VA REVOPS</text>
  
  <!-- Pill Tag -->
  <g transform="translate(80, 138)">
    <rect width="280" height="38" rx="6" fill="#0F1B2E" stroke="#1F3354" stroke-width="1"/>
    <circle cx="22" cy="19" r="4" fill="#C5A059"/>
    <text x="36" y="24" fill="#C5A059" class="mono-text" font-size="13" letter-spacing="2">PACKAGE 01 · ENTRY</text>
  </g>

  <!-- Main Title & Subtitle -->
  <text x="80" y="280" fill="#FFFFFF" class="serif-title" font-size="82">Follow-Up Shield</text>
  <text x="80" y="335" fill="#7D93B5" class="serif-title" font-size="38" opacity="0.8">&amp; Dead Lead Revival</text>

  <!-- Accent Line -->
  <rect x="80" y="375" width="60" height="4" fill="#C5A059"/>

  <!-- Body Description -->
  <text x="80" y="430" fill="#B0C4DE" class="sans-body" font-size="21" width="800">
    <tspan x="80" dy="0">Leads going cold or dormant? We revive old dead leads,</tspan>
    <tspan x="80" dy="32">manage daily follow-ups, and move pre-qualified DSR buyers</tspan>
    <tspan x="80" dy="32">directly to your client portal.</tspan>
  </text>

  <!-- Checklist Section -->
  <g transform="translate(80, 560)">
    <!-- Checklist 1 -->
    <g transform="translate(0, 0)">
      <circle cx="14" cy="14" r="13" fill="none" stroke="#C5A059" stroke-width="1.5"/>
      <path d="M 9 14 L 13 18 L 20 10" fill="none" stroke="#C5A059" stroke-width="2" stroke-linecap="round"/>
      <text x="45" y="19" fill="#D0E1F9" class="sans-body" font-size="20">Dormant &amp; dead lead revival (1,000+ lead batch)</text>
    </g>
    <!-- Checklist 2 -->
    <g transform="translate(0, 52)">
      <circle cx="14" cy="14" r="13" fill="none" stroke="#C5A059" stroke-width="1.5"/>
      <path d="M 9 14 L 13 18 L 20 10" fill="none" stroke="#C5A059" stroke-width="2" stroke-linecap="round"/>
      <text x="45" y="19" fill="#D0E1F9" class="sans-body" font-size="20">Daily VA follow-up on all active buyer inquiries</text>
    </g>
    <!-- Checklist 3 -->
    <g transform="translate(0, 104)">
      <circle cx="14" cy="14" r="13" fill="none" stroke="#C5A059" stroke-width="1.5"/>
      <path d="M 9 14 L 13 18 L 20 10" fill="none" stroke="#C5A059" stroke-width="2" stroke-linecap="round"/>
      <text x="45" y="19" fill="#D0E1F9" class="sans-body" font-size="20">Auto-DSR bank loan pre-qualification calculator</text>
    </g>
    <!-- Checklist 4 -->
    <g transform="translate(0, 156)">
      <circle cx="14" cy="14" r="13" fill="none" stroke="#C5A059" stroke-width="1.5"/>
      <path d="M 9 14 L 13 18 L 20 10" fill="none" stroke="#C5A059" stroke-width="2" stroke-linecap="round"/>
      <text x="45" y="19" fill="#D0E1F9" class="sans-body" font-size="20">Single-tenant client portal access &amp; weekly reports</text>
    </g>
  </g>

  <!-- Divider Line -->
  <line x1="80" y1="840" x2="1000" y2="840" stroke="#16253D" stroke-width="1.5"/>

  <!-- Footer Section -->
  <g transform="translate(80, 880)">
    <!-- Price Area -->
    <text x="0" y="15" fill="#7D93B5" class="mono-text" font-size="14" letter-spacing="3">MONTHLY RETAINER</text>
    <text x="0" y="70" fill="#C5A059" class="serif-title" font-size="62">RM800</text>
    <text x="0" y="98" fill="#7D93B5" class="sans-body" font-size="15">per month (or RM0 30-Day Free Pilot)</text>

    <!-- Target & CTA Button (Right Aligned) -->
    <g transform="translate(680, 0)">
      <text x="240" y="28" fill="#7D93B5" class="mono-text" font-size="14" letter-spacing="2" text-anchor="end">PROPERTY AGENTS</text>
      <g transform="translate(40, 42)">
        <rect width="200" height="52" fill="none" stroke="#C5A059" stroke-width="1.5"/>
        <text x="100" y="32" fill="#C5A059" class="mono-text" font-size="15" letter-spacing="2" text-anchor="middle">DM TO START</text>
      </g>
    </g>
  </g>
</svg>`;
}

// 2. Package 02 - Growth / Starter Promo (Forest Green Theme - VA Sales Outreach & Lead Revival)
function buildCard02() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .serif-title { font-family: 'Georgia', 'Times New Roman', serif; font-weight: 700; }
      .sans-body { font-family: 'Segoe UI', -apple-system, system-ui, sans-serif; font-weight: 400; }
      .sans-bold { font-family: 'Segoe UI', -apple-system, system-ui, sans-serif; font-weight: 600; }
      .mono-text { font-family: 'SFMono-Regular', Consolas, monospace; font-weight: 600; }
    </style>
  </defs>

  <!-- Background Base -->
  <rect width="1080" height="1080" fill="#06120B"/>
  
  <!-- Subtle Circular Line Art in Background -->
  <circle cx="850" cy="220" r="450" fill="none" stroke="#0E2919" stroke-width="1.5" opacity="0.6"/>
  <circle cx="850" cy="220" r="600" fill="none" stroke="#0B2114" stroke-width="1.5" opacity="0.4"/>
  
  <!-- Huge Faint Background Number -->
  <text x="750" y="320" fill="#0C2416" class="serif-title" font-size="280" opacity="0.7">02</text>

  <!-- Top Right Ribbon Badge -->
  <g transform="translate(860, 0)">
    <rect width="140" height="38" fill="#2EA043"/>
    <text x="70" y="24" fill="#FFFFFF" class="mono-text" font-size="12" letter-spacing="2" text-anchor="middle">MOST POPULAR</text>
  </g>

  <!-- Header Text Line -->
  <text x="80" y="110" fill="#6EA582" class="mono-text" font-size="16" letter-spacing="3">ZK ARIFF CAPITAL · VA REVOPS</text>
  
  <!-- Pill Tag -->
  <g transform="translate(80, 138)">
    <rect width="290" height="38" rx="6" fill="#0C2114" stroke="#1B4D2E" stroke-width="1"/>
    <circle cx="22" cy="19" r="4" fill="#3FB950"/>
    <text x="36" y="24" fill="#3FB950" class="mono-text" font-size="13" letter-spacing="2">PACKAGE 02 · GROWTH</text>
  </g>

  <!-- Main Title & Subtitle -->
  <text x="80" y="280" fill="#FFFFFF" class="serif-title" font-size="82">Outreach + Revival</text>
  <text x="80" y="335" fill="#6EA582" class="serif-title" font-size="38" opacity="0.8">System</text>

  <!-- Accent Line -->
  <rect x="80" y="375" width="60" height="4" fill="#3FB950"/>

  <!-- Body Description -->
  <text x="80" y="430" fill="#B3D8C1" class="sans-body" font-size="21" width="800">
    <tspan x="80" dy="0">Everything in Package 1, plus daily first-contact VA outreach to</tspan>
    <tspan x="80" dy="32">new REN prospects. More revived leads, more conversations,</tspan>
    <tspan x="80" dy="32">and more viewing appointments booked.</tspan>
  </text>

  <!-- Checklist Section -->
  <g transform="translate(80, 560)">
    <!-- Checklist 1 -->
    <g transform="translate(0, 0)">
      <circle cx="14" cy="14" r="13" fill="none" stroke="#3FB950" stroke-width="1.5"/>
      <path d="M 9 14 L 13 18 L 20 10" fill="none" stroke="#3FB950" stroke-width="2" stroke-linecap="round"/>
      <text x="45" y="19" fill="#D2EBDC" class="sans-body" font-size="20">Everything in Follow-Up Shield &amp; Lead Revival</text>
    </g>
    <!-- Checklist 2 -->
    <g transform="translate(0, 52)">
      <circle cx="14" cy="14" r="13" fill="none" stroke="#3FB950" stroke-width="1.5"/>
      <path d="M 9 14 L 13 18 L 20 10" fill="none" stroke="#3FB950" stroke-width="2" stroke-linecap="round"/>
      <text x="45" y="19" fill="#D2EBDC" class="sans-body" font-size="20">Daily first-contact VA sales outreach to new buyers</text>
    </g>
    <!-- Checklist 3 -->
    <g transform="translate(0, 104)">
      <circle cx="14" cy="14" r="13" fill="none" stroke="#3FB950" stroke-width="1.5"/>
      <path d="M 9 14 L 13 18 L 20 10" fill="none" stroke="#3FB950" stroke-width="2" stroke-linecap="round"/>
      <text x="45" y="19" fill="#D2EBDC" class="sans-body" font-size="20">Automated 7-day lead reactivation sequence</text>
    </g>
    <!-- Checklist 4 -->
    <g transform="translate(0, 156)">
      <circle cx="14" cy="14" r="13" fill="none" stroke="#3FB950" stroke-width="1.5"/>
      <path d="M 9 14 L 13 18 L 20 10" fill="none" stroke="#3FB950" stroke-width="2" stroke-linecap="round"/>
      <text x="45" y="19" fill="#D2EBDC" class="sans-body" font-size="20">1 exclusive sub-market protection (3km radius)</text>
    </g>
  </g>

  <!-- Divider Line -->
  <line x1="80" y1="840" x2="1000" y2="840" stroke="#12331F" stroke-width="1.5"/>

  <!-- Footer Section -->
  <g transform="translate(80, 880)">
    <!-- Price Area -->
    <text x="0" y="15" fill="#6EA582" class="mono-text" font-size="14" letter-spacing="3">MONTHLY RETAINER</text>
    <text x="0" y="70" fill="#3FB950" class="serif-title" font-size="62">RM1,500</text>
    <text x="0" y="98" fill="#6EA582" class="sans-body" font-size="15">per month (or RM500 Launch Promo)</text>

    <!-- Target & CTA Button (Right Aligned) -->
    <g transform="translate(680, 0)">
      <text x="240" y="28" fill="#6EA582" class="mono-text" font-size="14" letter-spacing="2" text-anchor="end">SOLO NEGOTIATORS</text>
      <g transform="translate(40, 42)">
        <rect width="200" height="52" fill="none" stroke="#3FB950" stroke-width="1.5"/>
        <text x="100" y="32" fill="#3FB950" class="mono-text" font-size="15" letter-spacing="2" text-anchor="middle">DM TO START</text>
      </g>
    </g>
  </g>
</svg>`;
}

// 3. Package 03 - Premium / Growth Team (Warm Bronze Theme - Full Pipeline & Multi-Agent Operator)
function buildCard03() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .serif-title { font-family: 'Georgia', 'Times New Roman', serif; font-weight: 700; }
      .sans-body { font-family: 'Segoe UI', -apple-system, system-ui, sans-serif; font-weight: 400; }
      .sans-bold { font-family: 'Segoe UI', -apple-system, system-ui, sans-serif; font-weight: 600; }
      .mono-text { font-family: 'SFMono-Regular', Consolas, monospace; font-weight: 600; }
    </style>
  </defs>

  <!-- Background Base -->
  <rect width="1080" height="1080" fill="#160E0A"/>
  
  <!-- Subtle Circular Line Art in Background -->
  <circle cx="850" cy="220" r="450" fill="none" stroke="#331F17" stroke-width="1.5" opacity="0.6"/>
  <circle cx="850" cy="220" r="600" fill="none" stroke="#291912" stroke-width="1.5" opacity="0.4"/>
  
  <!-- Huge Faint Background Number -->
  <text x="750" y="320" fill="#2B1911" class="serif-title" font-size="280" opacity="0.7">03</text>

  <!-- Top Right Ribbon Badge -->
  <g transform="translate(860, 0)">
    <rect width="140" height="38" fill="#D97706"/>
    <text x="70" y="24" fill="#FFFFFF" class="mono-text" font-size="12" letter-spacing="2" text-anchor="middle">PREMIUM</text>
  </g>

  <!-- Header Text Line -->
  <text x="80" y="110" fill="#B88A75" class="mono-text" font-size="16" letter-spacing="3">ZK ARIFF CAPITAL · VA REVOPS</text>
  
  <!-- Pill Tag -->
  <g transform="translate(80, 138)">
    <rect width="300" height="38" rx="6" fill="#261711" stroke="#543427" stroke-width="1"/>
    <circle cx="22" cy="19" r="4" fill="#F59E0B"/>
    <text x="36" y="24" fill="#F59E0B" class="mono-text" font-size="13" letter-spacing="2">PACKAGE 03 · PREMIUM</text>
  </g>

  <!-- Main Title & Subtitle -->
  <text x="80" y="280" fill="#FFFFFF" class="serif-title" font-size="82">Full Pipeline</text>
  <text x="80" y="335" fill="#B88A75" class="serif-title" font-size="38" opacity="0.8">Operator</text>

  <!-- Accent Line -->
  <rect x="80" y="375" width="60" height="4" fill="#F59E0B"/>

  <!-- Body Description -->
  <text x="80" y="430" fill="#E6C8BC" class="sans-body" font-size="21" width="800">
    <tspan x="80" dy="0">For top producers and team leaders who need full pipeline coverage.</tspan>
    <tspan x="80" dy="32">You close SPA deals. We run lead revival and SDR outreach</tspan>
    <tspan x="80" dy="32">for your entire team.</tspan>
  </text>

  <!-- Checklist Section -->
  <g transform="translate(80, 560)">
    <!-- Checklist 1 -->
    <g transform="translate(0, 0)">
      <circle cx="14" cy="14" r="13" fill="none" stroke="#F59E0B" stroke-width="1.5"/>
      <path d="M 9 14 L 13 18 L 20 10" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
      <text x="45" y="19" fill="#F5E3DA" class="sans-body" font-size="20">Everything in Packages 1 and 2</text>
    </g>
    <!-- Checklist 2 -->
    <g transform="translate(0, 52)">
      <circle cx="14" cy="14" r="13" fill="none" stroke="#F59E0B" stroke-width="1.5"/>
      <path d="M 9 14 L 13 18 L 20 10" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
      <text x="45" y="19" fill="#F5E3DA" class="sans-body" font-size="20">Multi-agent round-robin lead allocation (1-5 RENs)</text>
    </g>
    <!-- Checklist 3 -->
    <g transform="translate(0, 104)">
      <circle cx="14" cy="14" r="13" fill="none" stroke="#F59E0B" stroke-width="1.5"/>
      <path d="M 9 14 L 13 18 L 20 10" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
      <text x="45" y="19" fill="#F5E3DA" class="sans-body" font-size="20">Cal.com viewing scheduler &amp; CRM maintenance</text>
    </g>
    <!-- Checklist 4 -->
    <g transform="translate(0, 156)">
      <circle cx="14" cy="14" r="13" fill="none" stroke="#F59E0B" stroke-width="1.5"/>
      <path d="M 9 14 L 13 18 L 20 10" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
      <text x="45" y="19" fill="#F5E3DA" class="sans-body" font-size="20">2 exclusive sub-markets &amp; bi-weekly strategy report</text>
    </g>
  </g>

  <!-- Divider Line -->
  <line x1="80" y1="840" x2="1000" y2="840" stroke="#3D251C" stroke-width="1.5"/>

  <!-- Footer Section -->
  <g transform="translate(80, 880)">
    <!-- Price Area -->
    <text x="0" y="15" fill="#B88A75" class="mono-text" font-size="14" letter-spacing="3">MONTHLY RETAINER</text>
    <text x="0" y="70" fill="#F59E0B" class="serif-title" font-size="62">RM2,500</text>
    <text x="0" y="98" fill="#B88A75" class="sans-body" font-size="15">per month (or RM3,000 Team Tier)</text>

    <!-- Target & CTA Button (Right Aligned) -->
    <g transform="translate(680, 0)">
      <text x="240" y="28" fill="#B88A75" class="mono-text" font-size="14" letter-spacing="2" text-anchor="end">TEAM LEADERS (1-5 REN)</text>
      <g transform="translate(40, 42)">
        <rect width="200" height="52" fill="none" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="100" y="32" fill="#F59E0B" class="mono-text" font-size="15" letter-spacing="2" text-anchor="middle">DM TO START</text>
      </g>
    </g>
  </g>
</svg>`;
}

// 4. Package 04 - Enterprise Agency (Charcoal Platinum Theme - 100k+ Database Lead Revival Infrastructure)
function buildCard04() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .serif-title { font-family: 'Georgia', 'Times New Roman', serif; font-weight: 700; }
      .sans-body { font-family: 'Segoe UI', -apple-system, system-ui, sans-serif; font-weight: 400; }
      .sans-bold { font-family: 'Segoe UI', -apple-system, system-ui, sans-serif; font-weight: 600; }
      .mono-text { font-family: 'SFMono-Regular', Consolas, monospace; font-weight: 600; }
    </style>
  </defs>

  <!-- Background Base -->
  <rect width="1080" height="1080" fill="#0E1117"/>
  
  <!-- Subtle Circular Line Art in Background -->
  <circle cx="850" cy="220" r="450" fill="none" stroke="#212633" stroke-width="1.5" opacity="0.6"/>
  <circle cx="850" cy="220" r="600" fill="none" stroke="#1A1F2B" stroke-width="1.5" opacity="0.4"/>
  
  <!-- Huge Faint Background Number -->
  <text x="750" y="320" fill="#1C212E" class="serif-title" font-size="280" opacity="0.7">04</text>

  <!-- Top Right Ribbon Badge -->
  <g transform="translate(860, 0)">
    <rect width="140" height="38" fill="#58A6FF"/>
    <text x="70" y="24" fill="#000000" class="mono-text" font-size="12" letter-spacing="2" text-anchor="middle" font-weight="bold">ENTERPRISE</text>
  </g>

  <!-- Header Text Line -->
  <text x="80" y="110" fill="#8B949E" class="mono-text" font-size="16" letter-spacing="3">ZK ARIFF CAPITAL · VA REVOPS</text>
  
  <!-- Pill Tag -->
  <g transform="translate(80, 138)">
    <rect width="320" height="38" rx="6" fill="#161B22" stroke="#30363D" stroke-width="1"/>
    <circle cx="22" cy="19" r="4" fill="#58A6FF"/>
    <text x="36" y="24" fill="#58A6FF" class="mono-text" font-size="13" letter-spacing="2">PACKAGE 04 · ENTERPRISE</text>
  </g>

  <!-- Main Title & Subtitle -->
  <text x="80" y="280" fill="#FFFFFF" class="serif-title" font-size="82">100k+ Database</text>
  <text x="80" y="335" fill="#8B949E" class="serif-title" font-size="38" opacity="0.8">Infrastructure</text>

  <!-- Accent Line -->
  <rect x="80" y="375" width="60" height="4" fill="#58A6FF"/>

  <!-- Body Description -->
  <text x="80" y="430" fill="#C9D1D9" class="sans-body" font-size="21" width="800">
    <tspan x="80" dy="0">High-volume 100,000+ lead revival engine for agency owners</tspan>
    <tspan x="80" dy="32">and mega teams. Built to PDPA 2010 Privacy Standards</tspan>
    <tspan x="80" dy="32">and dedicated NDA alignment.</tspan>
  </text>

  <!-- Checklist Section -->
  <g transform="translate(80, 560)">
    <!-- Checklist 1 -->
    <g transform="translate(0, 0)">
      <circle cx="14" cy="14" r="13" fill="none" stroke="#58A6FF" stroke-width="1.5"/>
      <path d="M 9 14 L 13 18 L 20 10" fill="none" stroke="#58A6FF" stroke-width="2" stroke-linecap="round"/>
      <text x="45" y="19" fill="#E6EDF3" class="sans-body" font-size="20">100,000+ lead database revival &amp; sub-50ms engine</text>
    </g>
    <!-- Checklist 2 -->
    <g transform="translate(0, 52)">
      <circle cx="14" cy="14" r="13" fill="none" stroke="#58A6FF" stroke-width="1.5"/>
      <path d="M 9 14 L 13 18 L 20 10" fill="none" stroke="#58A6FF" stroke-width="2" stroke-linecap="round"/>
      <text x="45" y="19" fill="#E6EDF3" class="sans-body" font-size="20">SLA speed-to-lead broadcast engine ("Shark Tank")</text>
    </g>
    <!-- Checklist 3 -->
    <g transform="translate(0, 104)">
      <circle cx="14" cy="14" r="13" fill="none" stroke="#58A6FF" stroke-width="1.5"/>
      <path d="M 9 14 L 13 18 L 20 10" fill="none" stroke="#58A6FF" stroke-width="2" stroke-linecap="round"/>
      <text x="45" y="19" fill="#E6EDF3" class="sans-body" font-size="20">Custom API webhooks &amp; enterprise CRM connectors</text>
    </g>
    <!-- Checklist 4 -->
    <g transform="translate(0, 156)">
      <circle cx="14" cy="14" r="13" fill="none" stroke="#58A6FF" stroke-width="1.5"/>
      <path d="M 9 14 L 13 18 L 20 10" fill="none" stroke="#58A6FF" stroke-width="2" stroke-linecap="round"/>
      <text x="45" y="19" fill="#E6EDF3" class="sans-body" font-size="20">Dedicated NDA &amp; 24/7 priority account support</text>
    </g>
  </g>

  <!-- Divider Line -->
  <line x1="80" y1="840" x2="1000" y2="840" stroke="#21262D" stroke-width="1.5"/>

  <!-- Footer Section -->
  <g transform="translate(80, 880)">
    <!-- Price Area -->
    <text x="0" y="15" fill="#8B949E" class="mono-text" font-size="14" letter-spacing="3">MONTHLY RETAINER</text>
    <text x="0" y="70" fill="#58A6FF" class="serif-title" font-size="52">OPEN FOR DISCUSSION</text>
    <text x="0" y="98" fill="#8B949E" class="sans-body" font-size="15">custom quote for agency owners &amp; mega teams</text>

    <!-- Target & CTA Button (Right Aligned) -->
    <g transform="translate(680, 0)">
      <text x="240" y="28" fill="#8B949E" class="mono-text" font-size="14" letter-spacing="2" text-anchor="end">AGENCY OWNERS</text>
      <g transform="translate(40, 42)">
        <rect width="200" height="52" fill="none" stroke="#58A6FF" stroke-width="1.5"/>
        <text x="100" y="32" fill="#58A6FF" class="mono-text" font-size="15" letter-spacing="2" text-anchor="middle">DM TO START</text>
      </g>
    </g>
  </g>
</svg>`;
}

const cards = [
  { name: 'catalog_card_01_pilot', generator: buildCard01 },
  { name: 'catalog_card_02_starter', generator: buildCard02 },
  { name: 'catalog_card_03_growth', generator: buildCard03 },
  { name: 'catalog_card_04_enterprise', generator: buildCard04 }
];

console.log("Rendering 4 Minimalist Luxury Catalog SVG Cards (100% Apple-to-Apple Aligned)...");

const edgePath = `C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe`;

cards.forEach(card => {
  const svgPath = path.join(targetDir, `${card.name}.svg`);
  const jpgPath = path.join(targetDir, `${card.name}.jpg`);
  const htmlPath = path.join(targetDir, `${card.name}_render.html`);

  const svgContent = card.generator();
  fs.writeFileSync(svgPath, svgContent);

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<style>
  html, body { margin: 0; padding: 0; width: 1080px; height: 1080px; overflow: hidden; background: #000; }
  img { width: 1080px; height: 1080px; display: block; }
</style>
</head>
<body>
  <img src="file:///${svgPath.replace(/\\/g, '/')}" />
</body>
</html>
  `;
  fs.writeFileSync(htmlPath, htmlContent);

  const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --screenshot="${jpgPath}" --window-size=1080,1080 "file:///${htmlPath.replace(/\\/g, '/')}"`;
  
  try {
    execSync(cmd);
    console.log(`Rendered High-Res JPG: ${jpgPath} (${fs.statSync(jpgPath).size} bytes)`);
  } catch (err) {
    console.error(`Failed rendering ${card.name}.jpg:`, err);
  } finally {
    if (fs.existsSync(htmlPath)) {
      fs.unlinkSync(htmlPath);
    }
  }
});

console.log("✅ All 4 Apple-to-Apple Aligned Catalog Cards Rendered Successfully!");
