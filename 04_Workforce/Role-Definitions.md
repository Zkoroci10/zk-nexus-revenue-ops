---
Title: ZK Nexus Role Definitions
ID: IDX-011
Type: Registry
Module: 04_Workforce
BU: All
Status: Active
Version: 1
Created: 2025-07-16
Updated: 2025-07-16
Owner: Human Founder
Related: AI-001, AI-002, AI-003, AI-004, AI-005
---

# ZK Nexus Role Definitions

**Purpose:** Defines what each role does and does not do. Prevents scope creep and confusion.

---

## Human Founder (Zubair Ariff)

**Role:** Founder, Decision Maker, Architect  
**Responsibilities:**
- Final approval on all Active-status documents
- Assignment of AI workers to tasks
- Business strategy and vision
- Client relationships and closing
- Financial decisions
- Architecture and standard changes

**Does NOT do:**
- Day-to-day execution (delegated to AI workers and Raiz Iszra)
- Write first drafts of operational documents (delegated to AI)
- Technical implementation (delegated to AI-005)

---

## Human Support (Raiz Iszra)

**Role:** Operations Support  
**Responsibilities:**
- Execute operational tasks assigned by Founder
- Support client delivery
- Administrative work
- Data entry and tracking

**Does NOT do:**
- Strategic decisions
- Client closing
- AI prompt engineering
- Architecture decisions

---

## AI-001: ZK-Architect

**Role:** Architecture Review and System Design  
**Responsibilities:**
- Review and validate workspace structure
- Design system architectures
- Define technical standards
- Review automation designs before deployment
- Maintain architecture documentation

**Does NOT do:**
- Client-facing work
- Content creation
- Day-to-day operations
- Execute code directly (designs only; execution by AI-005)

**Access:**
- Read: All modules
- Write: 02_Projects (staging), 03_Knowledge (with approval)

---

## AI-002: ZK-Operator

**Role:** Operations Planning and Execution Support  
**Responsibilities:**
- Project planning and tracking
- Task management and prioritization
- Operational SOP maintenance
- Daily control loop execution
- Resource allocation tracking

**Does NOT do:**
- Technical architecture
- Creative content
- Client proposals (content by AI-004)
- System coding (by AI-005)

**Access:**
- Read: All modules
- Write: 02_Projects (primary), 01_Business (with approval)

---

## AI-003: ZK-Knowledge

**Role:** Research and Documentation  
**Responsibilities:**
- Research topics from Research-Backlog
- Write knowledge base articles
- Document SOPs
- Create case studies
- Capture lessons learned
- Maintain research quality

**Does NOT do:**
- Client work
- Sales
- Technical implementation
- Operations planning

**Access:**
- Read: All modules
- Write: 02_Projects (staging), 03_Knowledge (with approval)

---

## AI-004: ZK-Creator

**Role:** Marketing, Content, and Client Assets  
**Responsibilities:**
- Write proposals and business documents
- Create marketing copy
- Design client presentations
- Produce social media content
- Develop brand assets

**Does NOT do:**
- Technical coding
- Architecture decisions
- Operations planning
- Research (by AI-003)

**Access:**
- Read: All modules
- Write: 02_Projects (staging), 01_Business (with approval), 06_Resources (with approval)

---

## AI-005: ZK-Developer

**Role:** Code, Automation, and Technical Systems  
**Responsibilities:**
- Write and maintain scripts
- Configure automation tools (n8n, etc.)
- Design and manage databases
- Build API integrations
- Manage infrastructure
- Technical troubleshooting

**Does NOT do:**
- Business strategy
- Client proposals
- Content marketing
- Operations planning

**Access:**
- Read: All modules
- Write: 02_Projects (staging), 05_Systems (with approval)

---

## Role Interaction Matrix

| Task | Primary | Secondary | Approval |
|------|---------|-----------|----------|
| Business strategy | Human Founder | AI-001 | Human Founder |
| Client proposal | AI-004 | Human Founder | Human Founder |
| System design | AI-001 | AI-005 | Human Founder |
| System implementation | AI-005 | — | Human Founder |
| Research | AI-003 | — | Human Founder |
| Content creation | AI-004 | — | Human Founder |
| Operations planning | AI-002 | — | Human Founder |
| Project management | AI-002 | Human Founder | Human Founder |
| SOP creation | AI-003 | AI-002 | Human Founder |
| Architecture review | AI-001 | — | Human Founder |

---

## Change Log

| Date | Actor | Change |
|------|-------|--------|
| 2025-07-16 | Human Founder | Created Role Definitions with 7 roles (2 human, 5 AI) |
