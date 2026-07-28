---
name: apify-lead-generation
description: Automated lead harvesting, B2B contact extraction, web scraping, and data enrichment skill using Apify actors. Provides actor configuration specs, proxy and anti-bot evasion settings, data cleaning & deduplication pipelines, enrichment schemas, and CRM export formats (HubSpot, Salesforce, CSV). Activate when configuring lead scrapers, harvesting contact lists, or building automated prospect pipelines.
---

# Apify Lead Generation Skill Specification

## 1. Executive Summary & Capabilities
The `apify-lead-generation` skill guides agents in configuring, executing, and processing lead generation web scraping actors via Apify. It covers actor parameter tuning, proxy settings, anti-detection techniques, email verification, contact deduplication, and schema formatting for downstream CRM ingestion.

---

## 2. Invocation & Usage Triggers
Activate this skill when:
- Gathering B2B contact info (emails, LinkedIn profiles, company metrics, phone numbers).
- Configuring Apify actors (e.g. `apify/google-maps-scraper`, `curious_coder/linkedin-company-scraper`, `apify/web-scraper`).
- Designing lead enrichment pipelines and deduplication rules.
- Formatting scraped JSON datasets into normalized CRM import payloads.

---

## 3. Actor Selection Matrix

| Target Source | Actor ID / Name | Primary Data Points Harvested | Recommended Proxy |
|---------------|----------------|-------------------------------|-------------------|
| **LinkedIn Companies** | `curious_coder/linkedin-company-scraper` | Company size, domain, industry, key executives, location | Datacenter / Residential |
| **Google Maps / Local B2B** | `apify/google-maps-scraper` | Business name, website, phone, address, rating, category | Residential |
| **Custom Web Contact Scraper** | `apify/contact-details-scraper` | Extracted emails, social links, contact forms, phone numbers | Datacenter |
| **Twitter / X Profile Lead Scraper** | `apify/twitter-scraper` | Bio keywords, follower count, website link, email in bio | Residential |

---

## 4. Scraping Parameters & Anti-Detection Strategies

### 4.1 Anti-Detection Guidelines
1. **Proxy Rotation**: Always use Apify residential proxies (`RESIDENTIAL`) when targeting high-protection domains (e.g. LinkedIn, Twitter/X).
2. **Concurrency Tuning**: Set max concurrency to `<= 5` threads per run to avoid IP throttling and 429 rate limit responses.
3. **Session Persistence**: Maintain session cookies when executing paginated requests.
4. **User-Agent Randomization**: Enable automatic browser fingerprint and User-Agent header rotation.

### 4.2 Standard Input Schema Payload
```json
{
  "searchTerms": ["Zero Knowledge Proofs", "Web3 Security"],
  "location": "United States",
  "maxItems": 500,
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  },
  "extractEmails": true,
  "extractPhoneNumbers": true,
  "deduplicateResults": true
}
```

---

## 5. Data Sanitation & Validation Pipeline

Before exporting harvested leads into project databases or CRMs, agents MUST run data through the 4-step sanitation pipeline:

1. **Email Syntax & Domain Check**: Verify email formatting against standard RFC regex; filter out throwaway/disposable email domains (`tempmail.com`, `mailinator.com`).
2. **Deduplication**: Key on `email` (primary key) or `companyDomain` + `fullName` combination.
3. **Field Normalization**:
   - Clean company names (remove "Inc.", "LLC", "Ltd.", "Corp.").
   - Title case first name and last name.
   - Format phone numbers to E.164 standard (`+1...`).
4. **Enrichment Tagging**: Compute Lead Score based on company size, target industry match, and contact completeness score (0-100).

---

## 6. CRM Export & Schema Transformation

### Standard Normalized CSV / JSON Output Schema
```json
{
  "leadId": "LEAD-001",
  "fullName": "Sarah Connor",
  "firstName": "Sarah",
  "lastName": "Connor",
  "email": "s.connor@cyberdyne.com",
  "emailVerified": true,
  "jobTitle": "VP of Engineering",
  "companyName": "Cyberdyne Systems",
  "domain": "cyberdyne.com",
  "industry": "Robotics & Defense",
  "companySize": "500-1000",
  "phone": "+14155550199",
  "linkedinUrl": "https://linkedin.com/in/sconnor",
  "leadScore": 92,
  "sourceActor": "apify/contact-details-scraper",
  "scrapedAt": "2026-07-28T04:02:08Z"
}
```

---

## 7. Supporting Actor Presets
Refer to `config/actor-presets.json` in this skill package for ready-to-run Apify actor parameters.
