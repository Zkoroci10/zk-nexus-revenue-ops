## 2026-08-07T04:10:39Z

You are Worker 2 (Branded REN Client Portal UI/UX Pro Max Implementation).
Working directory: C:\Users\Dell\Documents\Projects ZK Nexus\.agents\worker_m2
Workspace directory: C:\Users\Dell\Documents\Projects ZK Nexus

MUST READ FIRST:
- Explorer Handoff: C:\Users\Dell\Documents\Projects ZK Nexus\.agents\explorer_m2_portal\handoff.md
- UI/UX Pro Max Skill: C:\Users\Dell\Documents\Projects ZK Nexus\.agents\skills\ui-ux-pro-max-skill\SKILL.md
- Project Plan: C:\Users\Dell\Documents\Projects ZK Nexus\PROJECT.md
- Original Request: C:\Users\Dell\Documents\Projects ZK Nexus\.agents\orchestrator\ORIGINAL_REQUEST.md

Your Mission (Milestone M2 / Requirement R2):
Implement the complete Branded REN Client Portal across `05_Systems/Console-Portal/public/portal.html` and `portal.html` (root):

1. **UI/UX Pro Max Slate Dark Palette**: Stripe/Linear Slate Dark aesthetic (`#0f172a` canvas, `#1e293b` cards, `#334155` borders, `#38bdf8` sky blue, `#10b981` emerald, `#f59e0b` amber, `#6366f1` indigo).
2. **Crisp Inter Typography & ZERO Emojis**: Crisp Inter font family, strictly ZERO emojis anywhere in HTML/CSS/JS (use Lucide/Feather inline SVG icons).
3. **White-Label REN Client Header**: Dynamic selector for REN-001 (Subang Jaya), REN-002 (Shah Alam North), and REN-003 (Cyberjaya/Puchong), retainer status badge, lead count summary, and Export PDF button.
4. **Assigned Buyer Dossiers Grid**: Render dynamic buyer cards from `dossiers.json` / local state filtered by selected REN client. Include financial metrics (Gross Income, Commitments, DSR %, Loan Tier badge, target project, WhatsApp direct Malay link).
5. **Interactive DSR Loan Pre-Approval Calculator Component**: Build an interactive component where REN agents input income, commitments, property price, and get instant DSR %, max loan eligibility, and loan qualification tier (<40% Tier 1 Pre-Approved).
6. **Viewing Calendar Schedule Grid**: Interactive calendar view showing viewing date/time, buyer name, sales gallery location, and anti-ghosting status pills (`T-2h Reminder Sent`).
7. **1-Click PDF Print Export (`@media print`)**: Dedicated print stylesheet hiding UI chrome and formatting buyer dossiers into clean white-paper A4 print cards.
8. **Mirror Sync**: Keep `05_Systems/Console-Portal/public/portal.html` and `portal.html` (root) 100% byte-for-byte identical.
9. **Verification**: Run `powershell -ExecutionPolicy Bypass -File "05_Systems/Scripts/validate-zns.ps1"` to confirm 0 ZNS validation errors.
