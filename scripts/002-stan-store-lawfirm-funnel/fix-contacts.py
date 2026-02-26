#!/usr/bin/env python3
"""
Fix and create remaining Contacts for external client companies.
"""

import requests
import json
import time

AIRTABLE_BASE_ID = "appTO7OCRB2XbAlak"
AIRTABLE_API_KEY = "***REDACTED***"
CONTACTS_TABLE = "tblg49y1OCUhyFmlH"

# Valid industry options: Law Practice, Legal Services, LegalTech, Corporate Law, Other

CONTACTS_TO_CREATE = [
    # DEA Academy
    {
        "First Name": "Patricia",
        "Last Name": "Henderson",
        "Email": "patricia@deaacademy.com",
        "Title": "Academy Director",
        "Company": "DEA Academy",
        "Industry": "Other",
        "Type": "Customer",
        "Notes": "Primary contact for DEA Data Silo project"
    },
    {
        "First Name": "Marcus",
        "Last Name": "Rivera",
        "Email": "marcus.rivera@deaacademy.com",
        "Title": "IT Coordinator",
        "Company": "DEA Academy",
        "Industry": "Other",
        "Type": "Customer",
        "Notes": "Technical contact for CRM integrations"
    },

    # A Slice of Haven Media
    {
        "First Name": "Haven",
        "Last Name": "Mitchell",
        "Email": "haven@asliceofhaven.com",
        "Title": "Content Creator",
        "Company": "A Slice of Haven Media",
        "Industry": "Other",
        "Type": "Customer",
        "Notes": "Primary contact for aSliceOfHaven project"
    },
    {
        "First Name": "Jordan",
        "Last Name": "Blake",
        "Email": "jordan@asliceofhaven.com",
        "Title": "Social Media Manager",
        "Company": "A Slice of Haven Media",
        "Industry": "Other",
        "Type": "Customer",
        "Notes": "Handles video distribution and scheduling"
    },

    # VisionSpark Analytics Inc
    {
        "First Name": "Derek",
        "Last Name": "Chen",
        "Email": "derek.chen@visionspark.io",
        "Title": "CEO",
        "Company": "VisionSpark Analytics Inc",
        "Industry": "LegalTech",
        "Type": "Customer",
        "Notes": "Primary contact for VisionSpark project"
    },
    {
        "First Name": "Samantha",
        "Last Name": "Patel",
        "Email": "sam.patel@visionspark.io",
        "Title": "Product Manager",
        "Company": "VisionSpark Analytics Inc",
        "Industry": "LegalTech",
        "Type": "Customer",
        "Notes": "Manages analytics dashboard requirements"
    },

    # Cerebro Legal Solutions (Law Firm RAG)
    {
        "First Name": "James",
        "Last Name": "Morrison",
        "Email": "james.morrison@cerebrolegal.com",
        "Title": "Managing Partner",
        "Company": "Cerebro Legal Solutions",
        "Industry": "Legal Services",
        "Type": "Customer",
        "Notes": "Primary contact for Law Firm RAG pilot program"
    },
    {
        "First Name": "Sarah",
        "Last Name": "Chen",
        "Email": "sarah.chen@cerebrolegal.com",
        "Title": "Legal Operations Director",
        "Company": "Cerebro Legal Solutions",
        "Industry": "Legal Services",
        "Type": "Customer",
        "Notes": "Technical champion for RAG implementation"
    },
    {
        "First Name": "Michael",
        "Last Name": "Richards",
        "Email": "michael.richards@cerebrolegal.com",
        "Title": "IT Director",
        "Company": "Cerebro Legal Solutions",
        "Industry": "Legal Services",
        "Type": "Customer",
        "Notes": "Handles system integrations and security"
    },

    # BuildMyTribe Inc
    {
        "First Name": "Trinity",
        "Last Name": "Jackson",
        "Email": "trinity@buildmytribe.ai",
        "Title": "Founder & CEO",
        "Company": "BuildMyTribe Inc",
        "Industry": "LegalTech",
        "Type": "Customer",
        "Notes": "Primary contact for BuildMyTribe.AI platform"
    },
    {
        "First Name": "Alex",
        "Last Name": "Kumar",
        "Email": "alex.kumar@buildmytribe.ai",
        "Title": "CTO",
        "Company": "BuildMyTribe Inc",
        "Industry": "LegalTech",
        "Type": "Customer",
        "Notes": "Technical lead for platform development"
    },

    # OzhiApp Technologies
    {
        "First Name": "Ozhi",
        "Last Name": "Nakamura",
        "Email": "ozhi@ozhiapp.com",
        "Title": "CEO",
        "Company": "OzhiApp Technologies",
        "Industry": "LegalTech",
        "Type": "Customer",
        "Notes": "Primary contact for OzhiApp CRM project"
    },
    {
        "First Name": "Rachel",
        "Last Name": "Green",
        "Email": "rachel.green@ozhiapp.com",
        "Title": "VP Sales",
        "Company": "OzhiApp Technologies",
        "Industry": "LegalTech",
        "Type": "Customer",
        "Notes": "Defines CRM requirements for sales team"
    },
    {
        "First Name": "Carlos",
        "Last Name": "Mendez",
        "Email": "carlos.mendez@ozhiapp.com",
        "Title": "Head of Engineering",
        "Company": "OzhiApp Technologies",
        "Industry": "LegalTech",
        "Type": "Customer",
        "Notes": "Technical integration lead"
    },

    # UK Business Directory Ltd
    {
        "First Name": "Nigel",
        "Last Name": "Thornberry",
        "Email": "nigel@ukbusinessdirectory.co.uk",
        "Title": "Managing Director",
        "Company": "UK Business Directory Ltd",
        "Industry": "Other",
        "Type": "Customer",
        "Notes": "Primary contact for UK Directory project"
    },
    {
        "First Name": "Emma",
        "Last Name": "Watson",
        "Email": "emma.watson@ukbusinessdirectory.co.uk",
        "Title": "Data Operations Manager",
        "Company": "UK Business Directory Ltd",
        "Industry": "Other",
        "Type": "Customer",
        "Notes": "Manages data enrichment processes"
    },
]

def batch_create(records):
    """Create records in batches of 10."""
    created = 0
    for i in range(0, len(records), 10):
        batch = records[i:i+10]
        payload = {"records": [{"fields": r} for r in batch]}

        response = requests.post(
            f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{CONTACTS_TABLE}",
            headers={
                "Authorization": f"Bearer {AIRTABLE_API_KEY}",
                "Content-Type": "application/json"
            },
            json=payload
        )

        if response.status_code in [200, 201]:
            result = response.json()
            created += len(result.get("records", []))
            print(f"  Created {len(result.get('records', []))} contacts")
        else:
            print(f"  Error: {response.status_code} - {response.text}")

        time.sleep(0.5)

    return created

def main():
    print("Creating additional contacts...")
    print(f"  {len(CONTACTS_TO_CREATE)} contacts to create")

    created = batch_create(CONTACTS_TO_CREATE)
    print(f"\nTotal contacts created: {created}")

if __name__ == "__main__":
    main()
