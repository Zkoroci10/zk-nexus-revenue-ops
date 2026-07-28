---
name: cold-email
description: Strategic B2B cold email copy generation and outreach automation skill. Provides proven copywriting frameworks (PAS, AIDA, BAB), high-converting subject line formulas, multi-touch SDR cadence blueprints, lead personalization schemas, deliverability optimization guidelines, and CAN-SPAM / GDPR compliance checks. Activate when drafting outreach campaigns, prospect emails, SDR sequences, or response handling blueprints.
---

# Cold Email Outreach Skill Specification

## 1. Executive Summary & Capabilities
The `cold-email` skill enables agents to generate high-converting B2B cold outreach messages, build structured SDR sequences, optimize subject lines for open rates, map custom prospect variables, and maintain strict email deliverability and privacy compliance standards.

---

## 2. Invocation & Usage Triggers
Activate this skill when:
- Designing cold email outreach campaigns for B2B prospects or partners.
- Writing initial outreach emails, follow-up messages, or value-add touchpoints.
- Building automated SDR multi-touch sequences (e.g., 4-touch 14-day cadence).
- Auditing email copy for spam trigger words, readability, or privacy compliance.

---

## 3. Strategic Copywriting Frameworks

### 3.1 PAS (Problem - Agitate - Solution)
1. **Problem**: Identify a specific pain point relevant to the prospect's role/industry.
2. **Agitate**: Briefly highlight the hidden cost or inefficiency of leaving the problem unsolved.
3. **Solution**: Introduce your solution concisely with a specific, low-friction Call to Action (CTA).

### 3.2 BAB (Before - After - Bridge)
1. **Before**: Describe the current frustrating status quo.
2. **After**: Paint a picture of the optimized future state.
3. **Bridge**: Present your platform or service as the path to reach that state.

### 3.3 AIDA (Attention - Interest - Desire - Action)
1. **Attention**: Catchy, hyper-personalized opening line referencing recent news or trigger event.
2. **Interest**: Relevant data point, case study metric, or peer benchmark.
3. **Desire**: Tangible outcome (e.g., "reduce latency by 40%", "save 15 hrs/week").
4. **Action**: Low-friction CTA (e.g., "Worth a 5-minute look next Tuesday?").

---

## 4. Standard 4-Touch Sequence Blueprint

| Touchpoint | Day | Pattern / Goal | Structure |
|------------|-----|----------------|-----------|
| **Touch 1** | Day 1 | Initial Value Pitch | Personalized Hook + Pain Point + Solution + Low-friction CTA |
| **Touch 2** | Day 4 | Value Add / Social Proof | Case Study Metric / Case Study Story + Re-iterated CTA |
| **Touch 3** | Day 8 | Short Bump / Perspective Shift | 2-sentence quick follow-up asking if topic is top-of-mind |
| **Touch 4** | Day 14 | Break-up / Re-engagement | Friendly closing step leaving the door open for future timing |

---

## 5. Personalization Fields & Variable Schemas

All template engines and email generators utilizing this skill MUST support the following schema parameters:

```json
{
  "firstName": "Alex",
  "lastName": "Rivera",
  "jobTitle": "Head of Engineering",
  "companyName": "TechCorp Solutions",
  "industry": "Fintech",
  "customTrigger": "recent series B announcement",
  "painPoint": "scaling zero-knowledge proof verification workloads",
  "senderName": "Jordan Chen",
  "senderCompany": "ZK Nexus",
  "ctaType": "interest_check"
}
```

---

## 6. Deliverability & Compliance Checklist

### 6.1 Deliverability Optimization
- Keep email length between **50 and 125 words**.
- Avoid spam trigger words: *Free, Guaranteed, Risk-Free, Act Now, $$$*, excessive exclamation points.
- Plain text formatting or minimal HTML styling without heavy image attachments.
- Single hyperlink maximum in initial touchpoint.

### 6.2 Legal & Privacy Compliance
- **CAN-SPAM**: Valid physical postal address included in footer; clear opt-out mechanism provided.
- **GDPR**: Legitimate Interest Assessment (LIA) verified; processing limited to professional roles; honor opt-out/deletion requests immediately.

---

## 7. Supporting Sequence Templates
Refer to `templates/sequence-templates.json` inside this skill package for structured email copy templates.
