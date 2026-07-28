---
name: antigravity-agent-manager
description: Multi-agent system management, subagent orchestration, role definition, inter-agent communication, and workflow execution skill for Google Antigravity. Enforces subagent spawning rules, liveness heartbeats, BRIEFING.md maintenance, 5-Component Handoff reports, task decomposition, and forensic integrity auditing. Activate when coordinating multi-agent workflows, managing subagent lifecycles, or transferring tasks.
---

# Antigravity Agent Manager Skill Specification

## 1. Executive Summary & Capabilities
The `antigravity-agent-manager` skill governs multi-agent orchestration within the Antigravity runtime environment. It standardizes subagent spawning, role assignment, liveness heartbeats, inter-agent messaging protocols, handoff reports (`handoff.md`), and compliance with the 5-Component Handoff framework.

---

## 2. Invocation & Usage Triggers
Activate this skill when:
- Dispatching or spawning subagent instances (e.g. explorer, worker, reviewer, auditor).
- Establishing working directories (`.agents/<agent_name>/`) and briefing files (`BRIEFING.md`).
- Monitoring progress heartbeats (`progress.md`) during long-running tasks.
- Writing or verifying 5-Component Handoff Reports (`handoff.md`) during task transfers or completions.
- Handling agent errors, missing files, or verification failures.

---

## 3. Multi-Agent Archetypes & Topology

```
                  ┌──────────────────────┐
                  │     Orchestrator     │
                  │   (Plan & Dispatch)  │
                  └──────────┬───────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │   Explorer   │    │   Worker     │    │   Reviewer   │
  │ (Inspection) │    │(Execution M4)│    │(Verification)│
  └──────────────┘    └──────────────┘    └──────────────┘
                             │
                             ▼
                      ┌──────────────┐
                      │   Auditor    │
                      │ (Forensics)  │
                      └──────────────┘
```

---

## 4. Agent Lifecycle Protocols

### 4.1 Initialization Protocol
When spawning an agent:
1. Create dedicated workspace folder: `.agents/<agent_id>/`.
2. Write initial `ORIGINAL_REQUEST.md` containing full prompt payload.
3. Write `BRIEFING.md` containing mission, identity, constraints, task summary, change tracker, and quality status.
4. Write initial `progress.md` with timestamp.

### 4.2 Liveness & Heartbeat Protocol
- Every active agent MUST update `.agents/<agent_id>/progress.md` after completing meaningful subtasks.
- Long-running tool executions require a timestamp bump (`Last visited: ISO-8601`) at least once every 5 minutes.

---

## 5. Inter-Agent Communication Protocol

Use the standard 3-field message format when communicating between agents via `send_message`:

```markdown
**Context**: [What you are working on / current task milestone]
**Content**: [Specific data, status update, report findings, or paths to files]
**Action**: [Clear instruction or expectation for the receiving agent]
```

---

## 6. Mandatory 5-Component Handoff Report

Every handoff report (`handoff.md`) MUST contain all 5 required sections:

1. **Observation**: Direct, verbatim evidence from tool calls, exact file paths, line numbers, error messages, and build output.
2. **Logic Chain**: Step-by-step reasoning bridging observations to conclusion.
3. **Caveats**: Uninvestigated scope, potential edge cases, assumptions made (or explicit "No caveats").
4. **Conclusion**: Scoped, actionable final assessment.
5. **Verification Method**: Exact reproducible commands or steps to verify work independently.

---

## 7. Fault Tolerance & Verification Protocols

### 7.1 Verification Failure Procedure
If a reviewer or auditor discovers invalid claims:
1. Log discrepancies between claimed result and actual filesystem/build state.
2. Determine if the error is localized or invalidates the full task outcome.
3. Issue corrective tool calls or notify parent agent with exact failure evidence.
4. Never silently ignore build, test, or lint failures.

---

## 8. Supporting Agent Role Definitions
Refer to `config/agent-roles.json` in this skill package for standard agent role specifications.
