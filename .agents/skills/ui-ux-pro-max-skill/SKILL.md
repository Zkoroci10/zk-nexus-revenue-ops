---
name: ui-ux-pro-max-skill
description: Comprehensive UI/UX design engineering skill for creating modern, responsive, visually polished web and mobile application interfaces. Provides design tokens, component architecture specs, visual hierarchy guidelines, dark/light mode color systems, accessibility compliance (WCAG 2.1 AA), Tailwind CSS patterns, and interface layout blueprints. Activate when designing landing pages, dashboards, design systems, component libraries, or interactive UI prototypes.
---

# UI/UX Pro Max Skill Specification

## 1. Executive Summary & Capabilities
The `ui-ux-pro-max-skill` equips agents with expert-level UI/UX design and frontend engineering standards. It converts abstract visual requirements into production-ready UI layouts, accessible design tokens, micro-interactions, responsive grid layouts, and clean visual design system specifications.

---

## 2. Invocation & Usage Triggers
Activate this skill when:
- Designing new user interfaces, web applications, dashboards, or SaaS landing pages.
- Crafting component design systems, style guides, or color palettes.
- Reviewing UI layouts for WCAG 2.1 AA accessibility, contrast ratios, and responsive breakpoints.
- Refactoring frontend HTML/Tailwind CSS components for visual elegance and micro-interactions.

---

## 3. Core Design Principles

### 3.1 Visual Hierarchy & Spatial Cadence
1. **Grid Architecture**: Standard 12-column fluid grid for desktop (`max-w-7xl px-4 sm:px-6 lg:px-8`), 4-column grid for mobile.
2. **Spacing Scale**: Strict adherence to an 8pt spatial grid scale (`4px`, `8px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`).
3. **Typography Scaling**: Modular scale with clear type hierarchy:
   - Display: 48px/56px (`text-4xl font-extrabold tracking-tight`)
   - H1: 36px/44px (`text-3xl font-bold`)
   - H2: 28px/36px (`text-2xl font-semibold`)
   - H3: 20px/28px (`text-xl font-medium`)
   - Body Base: 16px/24px (`text-base leading-relaxed`)
   - Caption / Small: 12px/16px (`text-xs text-muted font-medium`)

### 3.2 Color System & Contrast Standards
- **Primary & Neutral Surfaces**: High-contrast, semantic color tokens ensuring WCAG AA minimum 4.5:1 ratio for normal text and 3:1 for large text.
- **Dark Mode Palette**: Deep zinc/slate dark surfaces (`#09090b`, `#18181b`, `#27272a`) paired with vibrant brand accents (`#6366f1` Indigo, `#10b981` Emerald, `#3b82f6` Blue).
- **Light Mode Palette**: Crisp neutral backgrounds (`#ffffff`, `#f8fafc`) with soft border separation (`#e2e8f0`).

---

## 4. Component Architecture Blueprints

### 4.1 Dashboard Layout Blueprint
```html
<!-- Responsive App Shell Frame -->
<div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
  <!-- Sidebar Navigation -->
  <aside class="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between">
    <div class="space-y-6">
      <div class="flex items-center space-x-3 px-2">
        <div class="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">ZK</div>
        <span class="font-bold text-lg tracking-wide">Nexus App</span>
      </div>
      <nav class="space-y-1">
        <a href="#" class="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
          Dashboard
        </a>
        <a href="#" class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors">
          Analytics
        </a>
      </nav>
    </div>
  </aside>

  <!-- Main Content Area -->
  <main class="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
    <header class="flex items-center justify-between pb-6 border-b border-slate-800">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white">System Analytics</h1>
        <p class="text-sm text-slate-400">Real-time telemetry and operational metrics.</p>
      </div>
      <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-sm transition-all">
        Export Report
      </button>
    </header>
  </main>
</div>
```

---

## 5. Configuration & Design Tokens
Refer to `config/design-system-tokens.json` in this skill package for exact JSON specifications covering color hex codes, font families, elevation shadows, border radii, and transition durations.

---

## 6. Accessibility & Best Practices Checklist
- [ ] Ensure focus rings are clearly visible (`focus:ring-2 focus:ring-indigo-500 focus:outline-none`).
- [ ] Provide semantic HTML tags (`<main>`, `<nav>`, `<aside>`, `<header>`, `<article>`).
- [ ] Support keyboard navigation for dropdowns, modals, and interactive controls.
- [ ] All icon buttons include `aria-label` attributes.
- [ ] Contrast ratios strictly tested against 4.5:1 ratio minimum.
