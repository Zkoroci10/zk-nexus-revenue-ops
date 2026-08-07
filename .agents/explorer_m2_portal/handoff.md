# Handoff Report — Explorer 2 (Branded REN Client Portal & UI/UX Pro Max)

## 1. Observation

### 1.1 Existing Portal Templates & Structure
- **`portal.html` (root)** and **`05_Systems/Console-Portal/public/portal.html`**:
  - File size: 10,705 bytes, 306 lines.
  - Current styling: Custom `<style>` block using CSS custom properties (`--bg-dark: #090d16`, `--surface-dark: #111827`, `--border-color: #374151`, `--accent-blue: #38bdf8`, `--accent-emerald: #10b981`, `--accent-amber: #f59e0b`).
  - Font: Inter loaded via Google Fonts (`family=Inter:wght@300;400;500;600;700`).
  - Current state: Basic static HTML template with 4 metric cards (`statLeads`, `statQualified`, `statViewings`, pipeline loan value) and 2 static buyer cards (`Muhammad Hariz`, `Tan Wei Lun`).
- **`05_Systems/App/client-portal.html`**:
  - File size: 13,859 bytes, 227 lines.
  - Uses Tailwind CSS CDN with custom config (`platinum-950: #050505`, `gold-500: #d4af37`), Outfit & JetBrains Mono fonts. Features a Kanban pipeline board for REN clients.
- **`01_Business/ZK-Revenue-Ops/Client-Delivery/Live-Client-Dashboard.html`**:
  - File size: 5,874 bytes, 153 lines.
  - Basic HTML table format for lead delivery to clients.
- **`05_Systems/Console-Portal/public/dossiers.json`**:
  - File size: 752 bytes, 28 lines.
  - JSON schema containing buyer dossier records (`id`, `buyerName`, `phone`, `projectInterest`, `loanStatus`, `viewingTime`, `assignedAgentId`, `assignedAgentName`, `tier`).
- **`05_Systems/Console-Portal/public/js/app.js`**:
  - Lines 449-475: Contains `calculateDsr()` logic (`DSR = (commitment / income) * 100`, max installment capacity `income * 0.65 - commitment`).

### 1.2 Identified Gaps & Requirements for Requirement R2
1. **Static HTML vs Dynamic State**: Current `portal.html` is hardcoded HTML. Needs client-side JS engine to dynamically load dossiers from `dossiers.json` or local state, filter by assigned REN agent (`REN-001`, `REN-002`, `REN-003`), and handle interactions.
2. **UI/UX Pro Max Slate Dark Theme Alignment**: Needs exact Stripe/Linear Slate Dark aesthetic (`#0f172a` canvas background, `#1e293b` card surface, `#334155` border color, `#38bdf8` sky blue accent, `#10b981` emerald accent, `#f59e0b` amber accent, `#6366f1` indigo accent) with crisp Inter typography and ZERO emojis (replaced with Lucide/Feather inline SVG icons).
3. **Interactive DSR Loan Pre-Approval Calculator Component**: Missing from `portal.html`. Requires an interactive modal or embedded section where REN agents can input buyer gross income, commitments, proposed property price, and immediately calculate DSR %, max installment, maximum loan eligibility, and loan qualification tier (Tier 1 Pre-Approved DSR ≤ 40%, Tier 2 Qualified DSR 41-60%, Tier 3 Underwriting Review DSR > 60%).
4. **Viewing Calendar Display Component**: Missing from `portal.html`. Requires a visual schedule grid / timeline showing scheduled viewings, buyer name, contact, location (Sales Gallery), viewing date/time, and anti-ghosting status pill (`T-2h Reminder Sent`).
5. **Assigned Buyer Dossiers Layout**: Needs enhanced financial metrics display on each dossier card (Gross Income, Commitments, DSR %, Loan Pre-Approval Tier badge, target project, WhatsApp direct contact button with Malay template).
6. **1-Click PDF Print Export**: Current `window.print()` in `portal.html` lacks clean page-break formatting for individual buyer dossier print cards. Needs dedicated `@media print` rules for printing individual buyer cards or a clean multi-card report without navigation UI chrome.

---

## 2. Logic Chain

### 2.1 UI/UX Pro Max Visual Tokens & Design System

```json
{
  "theme": "Stripe/Linear Slate Dark",
  "colors": {
    "bg_canvas": "#0f172a",
    "bg_surface": "#1e293b",
    "bg_surface_hover": "#334155",
    "border_subtle": "#334155",
    "border_strong": "#475569",
    "text_primary": "#f8fafc",
    "text_secondary": "#cbd5e1",
    "text_muted": "#94a3b8",
    "accent_blue": "#38bdf8",
    "accent_emerald": "#10b981",
    "accent_amber": "#f59e0b",
    "accent_red": "#ef4444",
    "accent_indigo": "#6366f1"
  },
  "typography": {
    "font_family": "Inter, system-ui, -apple-system, sans-serif",
    "display": "28px/36px font-bold tracking-tight",
    "h1": "22px/28px font-bold",
    "h2": "16px/24px font-semibold text-primary",
    "body": "14px/20px font-normal text-secondary",
    "caption": "12px/16px font-medium text-muted uppercase tracking-wider"
  },
  "iconography": "Lucide/Feather inline SVG icons (1.5px stroke width), strictly ZERO emojis"
}
```

### 2.2 Component Architecture & Blueprint for `portal.html`

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP HEADER & BRANDING BAR (White-Label REN Selector, Territory Badge, Export PDF)     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 4 METRIC STAT CARDS (Active Leads | Qualified DSR | Scheduled Viewings | Loan Value)   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ NAVIGATION / FILTER TABS:                                                              │
│ [ Buyer Dossiers ]   [ DSR Calculator Tool ]   [ Viewing Calendar ]   [ PDF Print ]    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ TAB 1: BUYER DOSSIERS GRID                                                             │
│ ┌──────────────────────────────────┐ ┌──────────────────────────────────┐             │
│ │ Buyer Card 1 (Muhammad Hariz)    │ │ Buyer Card 2 (Tan Wei Lun)       │             │
│ │ - Status: Tier 1 Pre-Approved    │ │ - Status: Tier 1 Bank            │             │
│ │ - Income: RM 7,500/mo            │ │ - Income: RM 8,200/mo            │             │
│ │ - DSR: 38.5% (Qualified)         │ │ - DSR: 42.0% (Qualified)         │             │
│ │ - Project: SkyResidence Subang   │ │ - Project: Subang Parksuites     │             │
│ │ - Viewing: Sat 11:00 AM          │ │ - Viewing: Sun 3:00 PM           │             │
│ │ [ Contact WA ] [ Print Card ]    │ │ [ Contact WA ] [ Print Card ]    │             │
│ └──────────────────────────────────┘ └──────────────────────────────────┘             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ TAB 2: INTERACTIVE DSR CALCULATOR COMPONENT                                            │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Income Input (RM) | Monthly Commitments (RM) | Property Price (RM)                 │ │
│ │ Real-Time Output: DSR Ratio (%) • Qualification Tier Badge • Max Loan Capacity     │ │
│ │ [ Attach Calculation to Buyer Dossier ]                                            │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ TAB 3: VIEWING CALENDAR SCHEDULE GRID                                                  │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Date & Time | Buyer Name | Project Location | Status | Action                      │ │
│ │ Sabtu 11:00 AM | Muhammad Hariz | SkyResidence Sales Gallery | Confirmed | Contact  │ │
│ └────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Interactive DSR Calculator Algorithm Specification
- **Formula**:
  $$\text{Existing Commitments} = \text{Car Loan} + \text{PTPTN / Personal} + \text{Credit Cards}$$
  $$\text{Mortgage Installment} \approx \text{Loan Amount} \times 0.0045 \quad (\text{for 35-yr tenure @ 4.25\%})$$
  $$\text{DSR (\%)} = \left( \frac{\text{Existing Commitments} + \text{Mortgage Installment}}{\text{Gross Monthly Income}} \right) \times 100$$
- **Qualification Tiers**:
  - **Tier 1 Pre-Approved (DSR ≤ 40%)**: `rgba(16,185,129,0.15)` bg, `#10b981` text. Status: High bank approval probability.
  - **Tier 2 Standard Qualified (DSR 41% - 60%)**: `rgba(245,158,11,0.15)` bg, `#f59e0b` text. Status: Standard banking eligibility satisfied.
  - **Tier 3 Underwriting Review (DSR > 60%)**: `rgba(239,68,68,0.15)` bg, `#ef4444` text. Status: High debt ratio, requires debt consolidation or co-applicant.

### 2.4 1-Click PDF Print Export Specification (`@media print`)
- Hides toolbar, navigation tabs, WhatsApp contact buttons, and interactive DSR inputs.
- Formats individual buyer dossier cards into standard print card size (2 cards per A4 page).
- Converts dark slate background to clean white paper layout (`background: #ffffff; color: #0f172a;`).
- Retains crisp borders (`1px solid #cbd5e1`), dark badges, and readable financial typography for physical print distribution to REN clients.

---

## 3. Caveats

- **No Core Source Code Modifications**: This investigation report is read-only. Production updates to `portal.html` and `05_Systems/Console-Portal/public/portal.html` will be performed during Milestone M2 implementation by the designated implementer.
- **Client-Side Storage**: In the standalone static `portal.html`, state persistence uses `localStorage` (with fallback to default JSON data from `dossiers.json`).

---

## 4. Conclusion

1. **Design System**: The UI/UX Pro Max Slate Dark theme specs (`#0f172a` canvas, `#1e293b` surface cards, Inter typography, ZERO emojis, inline SVG icons) provide a clean, high-end white-label portal for REN retainer clients.
2. **Feature Coverage**: Requirement R2 is fully defined across all 5 sub-requirements: white-label portal header, assigned buyer dossiers layout, interactive DSR calculator, viewing calendar grid, and 1-click PDF print export.
3. **Synchronization Target**: Both `portal.html` (root) and `05_Systems/Console-Portal/public/portal.html` must be updated synchronously during M2 execution.

---

## 5. Verification Method

To verify the design and implementation during/after M2 execution:

1. **ZNS Layout & Compliance Audit**:
   ```powershell
   powershell -ExecutionPolicy Bypass -File "05_Systems\Scripts\validate-zns.ps1"
   ```
   *Expected output*: 0 ZNS validation errors.

2. **Visual Inspection**:
   Open `portal.html` in browser or Playwright:
   - Check slate dark palette (`#0f172a` background, `#1e293b` cards).
   - Check Inter typography rendering.
   - Verify ZERO emojis exist in the HTML document.
   - Test DSR pre-approval calculator with sample inputs (e.g. Income RM 7,500, Debt RM 2,200). Verify DSR calculation returns 38.5% and displays Tier 1 Pre-Approved badge.
   - Click "Export Client Dossiers (PDF)" / `window.print()` and verify printable layout preview.
