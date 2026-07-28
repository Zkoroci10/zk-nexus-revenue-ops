---
name: brain-to-docs
description: Knowledge extraction, transcript parsing, and document synthesis skill. Transforms unstructured brain dumps, voice notes, raw meeting notes, and informal brainstorms into polished, publication-ready project documentation (SOPs, Architecture Decision Records, Functional Specs, FAQs) fully compliant with ZNS metadata rules. Activate when processing meeting transcripts, converting raw notes into specs, or standardizing project documentation.
---

# Brain-to-Docs Skill Specification

## 1. Executive Summary & Capabilities
The `brain-to-docs` skill enables agents to take raw, unstructured, fragmented human thoughts, meeting transcripts, or informal notes and synthesize them into structured, clear, publication-grade documentation. It enforces ZNS metadata rules (`ZNS-MD`), taxonomy tags, hierarchical headings, and actionable execution checklists.

---

## 2. Invocation & Usage Triggers
Activate this skill when:
- Parsing raw text notes, voice memo transcripts, or chat logs into structured docs.
- Drafting Standard Operating Procedures (SOPs), Architecture Decision Records (ADRs), Product Requirement Documents (PRDs), or Technical Specs.
- Synthesizing meeting minutes into clear action items, decisions, and owner assignments.
- Re-formatting informal project write-ups into ZNS-compliant Markdown files.

---

## 3. Ingestion & Structuring Pipeline

```
[ Raw Notes / Transcript ]
          │
          ▼
   1. Noise Removal ────► Strip filler words, tangents, stuttering, duplicate thoughts
          │
          ▼
  2. Categorization ────► Group concepts into Themes, Decisions, Risks, Action Items
          │
          ▼
3. Format Selection ────► Select Target Schema (SOP, ADR, Spec Sheet, Meeting Note)
          │
          ▼
  4. ZNS Headering  ────► Inject YAML frontmatter (ID, Type, Status, Module, Owner)
          │
          ▼
 5. Final Polish   ────► Add TOC, tables, callout blocks, verification commands
```

---

## 4. Document Types & ZNS Metadata Headers

All generated documents MUST begin with valid ZNS-MD YAML frontmatter adhering to the structure below:

```yaml
---
Title: "Zero Knowledge Proof Verification SOP"
ID: SOP-005
Type: Standard Operating Procedure
Module: 05_Systems
BU: Infrastructure
Status: Draft
Version: 1.0
Created: 2026-07-28
Updated: 2026-07-28
Owner: Lead Systems Architect
Related: RUL-001, BRG-001
---
```

---

## 5. Structural Rules & Formatting Guidelines

1. **Heading Hierarchy**: Enforce sequential heading depth (`# H1` -> `## H2` -> `### H3`). Never skip heading levels.
2. **Callout Boxes**: Use standard blockquotes for warnings and notes:
   - `> ⚠️ **IMPORTANT:** ...`
   - `> 💡 **PRO TIP:** ...`
3. **Action Item Tables**: Format action items into actionable markdown tables:

| Action Item | Assigned Owner | Target Deadline | Priority | Status |
|-------------|----------------|-----------------|----------|--------|
| Implement ZKP benchmark script | Systems Engineer | 2026-08-05 | High | In Progress |

4. **Change Log**: Every created or updated document MUST include a Change Log table at the bottom of the file.

---

## 6. Auto-Summarization Protocol

Each synthesized document MUST include an **Executive Summary / TL;DR** block directly below the title:

```markdown
## Executive Summary
This document defines the operational workflow for deploying and executing Zero Knowledge proof verification circuits across distributed worker nodes. It establishes latency targets, memory allocation bounds, and automated fallback routines.
```

---

## 7. Supporting Document Templates
Refer to `templates/doc-types.json` inside this skill package for exact JSON schemas for SOPs, ADRs, PRDs, and Meeting Notes.
