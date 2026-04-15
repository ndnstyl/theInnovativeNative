#!/usr/bin/env python3
"""
OKR Data Seeder for TIN Airtable
Creates quarterly OKRs for Q4 2025 (completed) and Q1 2026 (current).

Quarters:
- Q4 2025: Oct 1 - Dec 31, 2025 (mostly Achieved)
- Q1 2026: Jan 1 - Mar 31, 2026 (in progress)
"""
import os

import requests
import json
import random
import time
from datetime import datetime

AIRTABLE_BASE_ID = "appTO7OCRB2XbAlak"
AIRTABLE_API_KEY = os.environ["AIRTABLE_API_KEY"]
OKRS_TABLE = "tblqVcKaHXd4w8Nzw"

# Agent IDs for owners
AGENTS = {
    "michael_ceo": "rechNDvw9Sv42BFuR",
    "drew_pm": "recANUnwKYsknrokD",
    "mike_cmo": "recQpukgvyessT3ya",
    "risa_finance": "recvvs5w8QvySt9LE",
    "chris_storyteller": "recsLqFvG8vajOmjD",
    "scales_lfr": "recS4d3UgnmeXG1ZW",
    "trinity_bmt": "recfmi0qcoxXIYnTe",
    "ozhi_crm": "recCCXejw4INmMMOl",
    "aurora_vs": "recgvSup7c2meoTAI",
    "haven_sloh": "recMtwQfMsmJorBv1",
    "nigel_ukd": "recd6eDXRtj8qiLiJ",
    "patricia_dea": "recOZXPF3YcUSlwIg",
}

# Project IDs
PROJECTS = {
    "lawfirm_rag": "recTCil7BdtXPDxLY",
    "buildmytribe": "recxUuGIPLc7kpDYT",
    "ozhiapp_crm": "recsBGDowHyz2Xdng",
    "visionspark": "rec9J9DDX0noT62YU",
    "asliceofhaven": "rec72HtXWWwE7PFVk",
    "uk_directory": "reccD7V6vTV6bq9xV",
    "dea_data_silo": "rec39tpHSQQKycY22",
    "tin_internal": "rec0wNt7i2E6V7FXH",
    "theinnovativenative": "rec1NqwMMWvv2PpVD",
}

# =============================================================================
# Q4 2025 OKRs (Completed Quarter)
# =============================================================================

Q4_2025_OKRS = [
    # Company-Level OKRs
    {
        "Objective": "Establish operational foundation for agent-based workflow system",
        "Key Result": "1. Deploy 20+ agent skill definitions\n2. Complete Airtable operational database with 10+ tables\n3. Achieve 90% constitution compliance across all agents",
        "Type": "Company",
        "Level": "Quarterly",
        "Quarter": "Q4 2025",
        "Status": "Achieved",
        "Target Value": 100,
        "Current Value": 95,
        "Start Date": "2025-10-01",
        "Due Date": "2025-12-31",
        "Owner": [AGENTS["michael_ceo"]],
        "Notes": "Foundation quarter. All major systems deployed successfully."
    },
    {
        "Objective": "Generate $100K in client revenue",
        "Key Result": "1. Close 5+ new client engagements\n2. Collect all onboarding fees\n3. Maintain 95% payment collection rate",
        "Type": "Company",
        "Level": "Quarterly",
        "Quarter": "Q4 2025",
        "Status": "Achieved",
        "Target Value": 100000,
        "Current Value": 127000,
        "Start Date": "2025-10-01",
        "Due Date": "2025-12-31",
        "Owner": [AGENTS["michael_ceo"]],
        "Notes": "Exceeded target by 27%. Strong demand for AI/automation services."
    },

    # Department OKRs
    {
        "Objective": "Build marketing infrastructure for 2026 campaigns",
        "Key Result": "1. Create brand system files\n2. Establish content calendar\n3. Set up UTM tracking framework",
        "Type": "Department",
        "Level": "Quarterly",
        "Quarter": "Q4 2025",
        "Status": "Achieved",
        "Target Value": 100,
        "Current Value": 100,
        "Start Date": "2025-10-01",
        "Due Date": "2025-12-31",
        "Owner": [AGENTS["mike_cmo"]],
        "Notes": "Marketing foundations complete. Ready for Q1 campaigns."
    },
    {
        "Objective": "Implement financial tracking and reporting",
        "Key Result": "1. Configure Subscriptions table\n2. Set up Payments tracking\n3. Create MRR dashboard",
        "Type": "Department",
        "Level": "Quarterly",
        "Quarter": "Q4 2025",
        "Status": "Achieved",
        "Target Value": 100,
        "Current Value": 100,
        "Start Date": "2025-10-01",
        "Due Date": "2025-12-31",
        "Owner": [AGENTS["risa_finance"]],
        "Notes": "All financial tables operational. Dashboard ready."
    },
    {
        "Objective": "Establish project management workflows",
        "Key Result": "1. Deploy task routing system\n2. Implement time tracking\n3. Create escalation matrix",
        "Type": "Department",
        "Level": "Quarterly",
        "Quarter": "Q4 2025",
        "Status": "Achieved",
        "Target Value": 100,
        "Current Value": 92,
        "Start Date": "2025-10-01",
        "Due Date": "2025-12-31",
        "Owner": [AGENTS["drew_pm"]],
        "Notes": "Core PM workflows operational. Escalation automation pending."
    },

    # Project OKRs - Law Firm RAG
    {
        "Objective": "Complete Law Firm RAG MVP development",
        "Key Result": "1. Finish RAG pipeline implementation\n2. Complete landing page\n3. Set up pilot program infrastructure",
        "Type": "Project",
        "Level": "Quarterly",
        "Quarter": "Q4 2025",
        "Status": "Achieved",
        "Target Value": 100,
        "Current Value": 85,
        "Start Date": "2025-10-01",
        "Due Date": "2025-12-31",
        "Owner": [AGENTS["scales_lfr"]],
        "Project": [PROJECTS["lawfirm_rag"]],
        "Notes": "MVP complete. Landing page 85% done, finishing in Q1."
    },

    # Project OKRs - BuildMyTribe
    {
        "Objective": "Launch BuildMyTribe.AI beta platform",
        "Key Result": "1. Complete Instagram automation core\n2. Deploy user authentication\n3. Onboard 10 beta users",
        "Type": "Project",
        "Level": "Quarterly",
        "Quarter": "Q4 2025",
        "Status": "Achieved",
        "Target Value": 10,
        "Current Value": 12,
        "Start Date": "2025-10-01",
        "Due Date": "2025-12-31",
        "Owner": [AGENTS["trinity_bmt"]],
        "Project": [PROJECTS["buildmytribe"]],
        "Notes": "Beta launched successfully. 12 users onboarded."
    },

    # Project OKRs - OzhiApp
    {
        "Objective": "Deploy OzhiApp CRM core features",
        "Key Result": "1. Complete contact management\n2. Implement deal pipeline\n3. Integrate Stripe payments",
        "Type": "Project",
        "Level": "Quarterly",
        "Quarter": "Q4 2025",
        "Status": "On Track",
        "Target Value": 100,
        "Current Value": 75,
        "Start Date": "2025-10-01",
        "Due Date": "2025-12-31",
        "Owner": [AGENTS["ozhi_crm"]],
        "Project": [PROJECTS["ozhiapp_crm"]],
        "Notes": "Stripe integration pushed to Q1. Core CRM functional."
    },
]

# =============================================================================
# Q1 2026 OKRs (Current Quarter)
# =============================================================================

Q1_2026_OKRS = [
    # Company-Level OKRs
    {
        "Objective": "Scale revenue to $150K quarterly run rate",
        "Key Result": "1. Close 3 new client engagements\n2. Increase average project hours by 20%\n3. Launch paid ads for lead generation",
        "Type": "Company",
        "Level": "Quarterly",
        "Quarter": "Q1 2026",
        "Status": "On Track",
        "Target Value": 150000,
        "Current Value": 52000,
        "Start Date": "2026-01-01",
        "Due Date": "2026-03-31",
        "Owner": [AGENTS["michael_ceo"]],
        "Notes": "35% to target at 40% through quarter. Tracking well."
    },
    {
        "Objective": "Achieve 95% agent productivity compliance",
        "Key Result": "1. All agents logging time daily\n2. <5% tasks overdue\n3. Zero visibility gaps",
        "Type": "Company",
        "Level": "Quarterly",
        "Quarter": "Q1 2026",
        "Status": "At Risk",
        "Target Value": 95,
        "Current Value": 78,
        "Start Date": "2026-01-01",
        "Due Date": "2026-03-31",
        "Owner": [AGENTS["drew_pm"]],
        "Notes": "Early Q1 had visibility gaps. New constitution compliance helping."
    },

    # Department OKRs - Marketing
    {
        "Objective": "Execute Cerebro February 2026 Campaign",
        "Key Result": "1. Publish 6 LinkedIn posts\n2. Run Facebook retargeting ads\n3. Generate 50 qualified leads",
        "Type": "Department",
        "Level": "Quarterly",
        "Quarter": "Q1 2026",
        "Status": "On Track",
        "Target Value": 50,
        "Current Value": 18,
        "Start Date": "2026-01-01",
        "Due Date": "2026-03-31",
        "Owner": [AGENTS["mike_cmo"]],
        "Notes": "Campaign launching Feb 5. Content pipeline ready."
    },
    {
        "Objective": "Build content library with 20+ assets",
        "Key Result": "1. Create 10 video clips\n2. Design 15 graphics\n3. Write 12 blog posts",
        "Type": "Department",
        "Level": "Quarterly",
        "Quarter": "Q1 2026",
        "Status": "On Track",
        "Target Value": 37,
        "Current Value": 14,
        "Start Date": "2026-01-01",
        "Due Date": "2026-03-31",
        "Owner": [AGENTS["chris_storyteller"]],
        "Notes": "Pixel and Spike producing assets. On pace."
    },

    # Department OKRs - Operations
    {
        "Objective": "Complete Airtable interface blueprint implementation",
        "Key Result": "1. Create all 10 role-based interfaces\n2. Build 62 table views\n3. Deploy 5 automations",
        "Type": "Department",
        "Level": "Quarterly",
        "Quarter": "Q1 2026",
        "Status": "On Track",
        "Target Value": 100,
        "Current Value": 45,
        "Start Date": "2026-01-01",
        "Due Date": "2026-03-31",
        "Owner": [AGENTS["patricia_dea"]],
        "Notes": "Schema docs complete. Views in progress. Interfaces next."
    },
    {
        "Objective": "Achieve $50K+ MRR by end of Q1",
        "Key Result": "1. All 7 clients on active subscriptions\n2. Zero outstanding payments >30 days\n3. 100% onboarding fees collected",
        "Type": "Department",
        "Level": "Quarterly",
        "Quarter": "Q1 2026",
        "Status": "On Track",
        "Target Value": 50000,
        "Current Value": 42000,
        "Start Date": "2026-01-01",
        "Due Date": "2026-03-31",
        "Owner": [AGENTS["risa_finance"]],
        "Notes": "Strong collection rate. Two clients expanding scope."
    },

    # Project OKRs - Law Firm RAG
    {
        "Objective": "Sign 5 pilot customers for Law Firm RAG",
        "Key Result": "1. Complete landing page with Stripe\n2. Generate 100 demo requests\n3. Convert 5% to paid pilots",
        "Type": "Project",
        "Level": "Quarterly",
        "Quarter": "Q1 2026",
        "Status": "On Track",
        "Target Value": 5,
        "Current Value": 1,
        "Start Date": "2026-01-01",
        "Due Date": "2026-03-31",
        "Owner": [AGENTS["scales_lfr"]],
        "Project": [PROJECTS["lawfirm_rag"]],
        "Notes": "First pilot signed. Campaign launching this week."
    },

    # Project OKRs - BuildMyTribe
    {
        "Objective": "Scale BuildMyTribe to 50 paying users",
        "Key Result": "1. Launch Pro tier\n2. Implement usage analytics\n3. Reduce churn to <5%",
        "Type": "Project",
        "Level": "Quarterly",
        "Quarter": "Q1 2026",
        "Status": "At Risk",
        "Target Value": 50,
        "Current Value": 18,
        "Start Date": "2026-01-01",
        "Due Date": "2026-03-31",
        "Owner": [AGENTS["trinity_bmt"]],
        "Project": [PROJECTS["buildmytribe"]],
        "Notes": "User acquisition slower than expected. Pivoting marketing."
    },

    # Project OKRs - OzhiApp
    {
        "Objective": "Complete OzhiApp Stripe integration and launch",
        "Key Result": "1. Finish payment processing\n2. Deploy subscription management\n3. Onboard 3 paying customers",
        "Type": "Project",
        "Level": "Quarterly",
        "Quarter": "Q1 2026",
        "Status": "On Track",
        "Target Value": 3,
        "Current Value": 0,
        "Start Date": "2026-01-01",
        "Due Date": "2026-03-31",
        "Owner": [AGENTS["ozhi_crm"]],
        "Project": [PROJECTS["ozhiapp_crm"]],
        "Notes": "Stripe integration 80% complete. Launch targeted for Feb 15."
    },

    # Project OKRs - VisionSpark
    {
        "Objective": "Launch VisionSpark analytics dashboard v1",
        "Key Result": "1. Complete data pipeline\n2. Build 5 core dashboard views\n3. Integrate with client data sources",
        "Type": "Project",
        "Level": "Quarterly",
        "Quarter": "Q1 2026",
        "Status": "On Track",
        "Target Value": 100,
        "Current Value": 60,
        "Start Date": "2026-01-01",
        "Due Date": "2026-03-31",
        "Owner": [AGENTS["aurora_vs"]],
        "Project": [PROJECTS["visionspark"]],
        "Notes": "Pipeline complete. Dashboard development on schedule."
    },

    # Project OKRs - aSliceOfHaven
    {
        "Objective": "Produce 20 video pieces for aSliceOfHaven",
        "Key Result": "1. Create 10 short-form videos\n2. Produce 5 long-form pieces\n3. Establish 3x/week posting cadence",
        "Type": "Project",
        "Level": "Quarterly",
        "Quarter": "Q1 2026",
        "Status": "On Track",
        "Target Value": 20,
        "Current Value": 8,
        "Start Date": "2026-01-01",
        "Due Date": "2026-03-31",
        "Owner": [AGENTS["haven_sloh"]],
        "Project": [PROJECTS["asliceofhaven"]],
        "Notes": "Strong content velocity. Spike delivering quality work."
    },

    # Project OKRs - UK Directory
    {
        "Objective": "Enrich 10,000 UK business records",
        "Key Result": "1. Complete data scraping pipeline\n2. Enrich with contact info\n3. Verify 95% accuracy rate",
        "Type": "Project",
        "Level": "Quarterly",
        "Quarter": "Q1 2026",
        "Status": "Behind",
        "Target Value": 10000,
        "Current Value": 2500,
        "Start Date": "2026-01-01",
        "Due Date": "2026-03-31",
        "Owner": [AGENTS["nigel_ukd"]],
        "Project": [PROJECTS["uk_directory"]],
        "Notes": "Data source issues causing delays. Evaluating alternatives."
    },

    # Project OKRs - DEA
    {
        "Objective": "Complete DEA CRM sync and automation",
        "Key Result": "1. Sync all student records\n2. Automate payment reconciliation\n3. Build enrollment dashboard",
        "Type": "Project",
        "Level": "Quarterly",
        "Quarter": "Q1 2026",
        "Status": "On Track",
        "Target Value": 100,
        "Current Value": 55,
        "Start Date": "2026-01-01",
        "Due Date": "2026-03-31",
        "Owner": [AGENTS["patricia_dea"]],
        "Project": [PROJECTS["dea_data_silo"]],
        "Notes": "Sync complete. Working on reconciliation automation."
    },

    # Project OKRs - TIN Internal
    {
        "Objective": "Deploy Neo workflow management system",
        "Key Result": "1. Categorize all 160 workflows\n2. Implement health scoring\n3. Create pattern library",
        "Type": "Project",
        "Level": "Quarterly",
        "Quarter": "Q1 2026",
        "Status": "On Track",
        "Target Value": 160,
        "Current Value": 85,
        "Start Date": "2026-01-01",
        "Due Date": "2026-03-31",
        "Owner": [AGENTS["drew_pm"]],
        "Project": [PROJECTS["tin_internal"]],
        "Notes": "Good progress on categorization. Health audit running daily."
    },
]


def batch_create(records):
    """Create records in batches of 10."""
    created = 0
    for i in range(0, len(records), 10):
        batch = records[i:i+10]
        payload = {"records": [{"fields": r} for r in batch]}

        response = requests.post(
            f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{OKRS_TABLE}",
            headers={
                "Authorization": f"Bearer {AIRTABLE_API_KEY}",
                "Content-Type": "application/json"
            },
            json=payload
        )

        if response.status_code in [200, 201]:
            result = response.json()
            created += len(result.get("records", []))
            print(f"  Created {len(result.get('records', []))} OKRs (batch {i//10 + 1})")
        else:
            print(f"  Error: {response.status_code} - {response.text}")

        time.sleep(0.5)

    return created


def main():
    print("=" * 60)
    print("TIN Airtable OKR Seeder")
    print("=" * 60)

    # Combine all OKRs
    all_okrs = Q4_2025_OKRS + Q1_2026_OKRS

    print(f"\nQ4 2025 OKRs: {len(Q4_2025_OKRS)}")
    print(f"Q1 2026 OKRs: {len(Q1_2026_OKRS)}")
    print(f"Total OKRs to create: {len(all_okrs)}")

    print("\nCreating OKRs in Airtable...")
    created = batch_create(all_okrs)

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total OKRs created: {created}")

    # Status breakdown
    status_counts = {}
    for okr in all_okrs:
        status = okr["Status"]
        status_counts[status] = status_counts.get(status, 0) + 1

    print("\nBy Status:")
    for status, count in sorted(status_counts.items()):
        print(f"  {status}: {count}")

    # Type breakdown
    type_counts = {}
    for okr in all_okrs:
        t = okr["Type"]
        type_counts[t] = type_counts.get(t, 0) + 1

    print("\nBy Type:")
    for t, count in sorted(type_counts.items()):
        print(f"  {t}: {count}")


if __name__ == "__main__":
    main()