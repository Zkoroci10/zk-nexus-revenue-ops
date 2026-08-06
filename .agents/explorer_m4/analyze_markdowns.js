const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Dell\\.gemini\\antigravity\\brain';

const mdFiles = [
  "1c511e99-1290-4c59-be68-631ea7380b1f\\zk_revenue_ops_positioning_and_copy_strategy.md",
  "23fe428c-a4f4-42cd-aeee-061fa6a86f90\\BATCH_1_OUTREACH_REVIEW_KIT.md",
  "23fe428c-a4f4-42cd-aeee-061fa6a86f90\\FB_IG_ADS_CAMPAIGN_MASTER_KIT.md",
  "23fe428c-a4f4-42cd-aeee-061fa6a86f90\\GEMINI_SPARK_INTEGRATION_BLUEPRINT.md",
  "23fe428c-a4f4-42cd-aeee-061fa6a86f90\\PRE_LAUNCH_CHECKLIST_AND_EXECUTION_ROADMAP.md",
  "23fe428c-a4f4-42cd-aeee-061fa6a86f90\\PRICING_TIERS_AND_PILOT_PROGRAM_BLUEPRINT.md",
  "23fe428c-a4f4-42cd-aeee-061fa6a86f90\\prompt_draft.md",
  "23fe428c-a4f4-42cd-aeee-061fa6a86f90\\REN_PROSPECTS_100_AUDIT_REPORT.md",
  "23fe428c-a4f4-42cd-aeee-061fa6a86f90\\task.md",
  "23fe428c-a4f4-42cd-aeee-061fa6a86f90\\WHATSAPP_BUSINESS_BRANDING_BLUEPRINT.md",
  "23fe428c-a4f4-42cd-aeee-061fa6a86f90\\WHATSAPP_BUSINESS_COVER_CATALOG_MASTER_BLUEPRINT.md",
  "23fe428c-a4f4-42cd-aeee-061fa6a86f90\\WHATSAPP_BUSINESS_MASTER_KIT.md",
  "23fe428c-a4f4-42cd-aeee-061fa6a86f90\\WHATSAPP_BUSINESS_STRUCTURED_MASTER_KIT.md",
  "23fe428c-a4f4-42cd-aeee-061fa6a86f90\\ZK_NEXUS_EMPIRE_REVOPS_MASTER_REPORT.md",
  "23fe428c-a4f4-42cd-aeee-061fa6a86f90\\ZK_REVENUE_OPS_END_TO_END_MASTER_REPORT.md",
  "3de85b56-21f0-4f14-89a3-0f3999f6c6cb\\implementation_plan.md",
  "3de85b56-21f0-4f14-89a3-0f3999f6c6cb\\walkthrough.md",
  "435ee332-a864-4437-88f8-f519df28b010\\implementation_plan.md",
  "435ee332-a864-4437-88f8-f519df28b010\\walkthrough.md",
  "435ee332-a864-4437-88f8-f519df28b010\\zk_revenue_ops_master_blueprint.md",
  "58e35714-d7a4-449f-a051-62c2aaba283c\\zk_revenue_ops_catalog_analysis.md",
  "87e8612a-47bf-4578-bd7c-d706b1e22cea\\sdr_workflow_report.md",
  "b2e73095-31c3-4336-8b5b-63e52ec5e534\\cleanup_summary.md",
  "b2e73095-31c3-4336-8b5b-63e52ec5e534\\implementation_plan.md",
  "b2e73095-31c3-4336-8b5b-63e52ec5e534\\master_sop_v3.md",
  "b2e73095-31c3-4336-8b5b-63e52ec5e534\\master_system_blueprint.md",
  "b2e73095-31c3-4336-8b5b-63e52ec5e534\\migration_summary.md",
  "b2e73095-31c3-4336-8b5b-63e52ec5e534\\promotion_checklist.md",
  "b2e73095-31c3-4336-8b5b-63e52ec5e534\\readiness_summary.md",
  "b2e73095-31c3-4336-8b5b-63e52ec5e534\\realtime_stresstest_and_teamwork_plan.md",
  "b2e73095-31c3-4336-8b5b-63e52ec5e534\\research_notes.md",
  "b2e73095-31c3-4336-8b5b-63e52ec5e534\\task.md",
  "b2e73095-31c3-4336-8b5b-63e52ec5e534\\walkthrough.md",
  "b868e254-2307-47f9-9b64-d83b087d495f\\prompt_draft.md",
  "db5ac766-a349-4973-b136-8a3b7fc8bf12\\implementation_plan.md",
  "db5ac766-a349-4973-b136-8a3b7fc8bf12\\prompt_draft.md",
  "db5ac766-a349-4973-b136-8a3b7fc8bf12\\walkthrough.md"
];

const summaries = [];

mdFiles.forEach(rel => {
  const full = path.join(brainDir, rel);
  if (fs.existsSync(full)) {
    const content = fs.readFileSync(full, 'utf8');
    const lines = content.split('\n');
    const first50 = lines.slice(0, 30).join('\n');
    const headers = lines.filter(l => l.startsWith('#')).slice(0, 10);
    summaries.push({
      rel,
      size: fs.statSync(full).size,
      mtime: fs.statSync(full).mtime.toISOString(),
      headers,
      preview: first50.substring(0, 500)
    });
  }
});

const outFile = 'c:\\Users\\Dell\\Documents\\Projects ZK Nexus\\.agents\\explorer_m4\\markdown_summaries.json';
fs.writeFileSync(outFile, JSON.stringify(summaries, null, 2));
console.log(`Saved ${summaries.length} markdown summaries to ${outFile}`);
