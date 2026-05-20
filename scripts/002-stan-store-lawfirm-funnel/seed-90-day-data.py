#!/usr/bin/env python3
"""
90-Day Historical Data Seeder for TIN Airtable
Generates realistic data for CEO, Marketing, and Finance dashboards.

Pricing Model:
- All projects: $125/hr minimum
- $5,000 onboarding fee per client (one-time)
- Billing: Monthly invoicing

Projects Weekly Hours (based on complexity):
- High complexity (SaaS): 10-15 hrs/week
- Medium complexity: 6-8 hrs/week
- Low complexity (internal): 4 hrs/week
"""
import os

import requests
import json
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any
import time

# =============================================================================
# CONFIGURATION
# =============================================================================

AIRTABLE_BASE_ID = "appTO7OCRB2XbAlak"
AIRTABLE_API_KEY = os.environ["AIRTABLE_API_KEY"]

# Table IDs
TABLES = {
    "projects": "tbl6StWS4UGkX49Xs",
    "agents": "tblj2uMe0M8xAW6u8",
    "time_entries": "tbl4FrwRqV02j2TSK",
    "tasks": "tbliXF3imV0uFxJSB",
    "contacts": "tblg49y1OCUhyFmlH",
    "subscriptions": "tblapT15JO53LQzx0",
    "payments": "tbl55nyKpaqjuuUkw",
    "leads": "tblOKWsV4GXq5sWjE",
    "interactions": "tblgHSyLh8oW0tNfj",
    "campaigns": "tbllkC5ZmNvO74rH3",
}

# Project configurations (name -> config)
PROJECT_CONFIG = {
    "rec0wNt7i2E6V7FXH": {  # TIN Internal Airtable
        "name": "TIN Internal Airtable",
        "company": "The Innovative Native LLC",
        "weekly_hours": (3, 5),
        "is_internal": True,
        "industry": "Other",
        "workers": ["reczaukja9sEdMHHq", "recqPOalla801ezQt"],  # Tab, Neo
    },
    "rec1NqwMMWvv2PpVD": {  # TheInnovativeNative
        "name": "TheInnovativeNative",
        "company": "The Innovative Native LLC",
        "weekly_hours": (5, 8),
        "is_internal": True,
        "industry": "Other",
        "workers": ["recGO3te7FAkoB4nh", "recA3Z8kYojtdxNV4", "reck8wsTAZ7DvGlOO"],  # Spike, Rex, Sage
    },
    "rec39tpHSQQKycY22": {  # DEA Data Silo
        "name": "DEA Data Silo",
        "company": "DEA Academy",
        "weekly_hours": (5, 8),
        "is_internal": False,
        "industry": "Other",
        "workers": ["reczaukja9sEdMHHq", "recqPOalla801ezQt"],  # Tab, Neo
    },
    "rec72HtXWWwE7PFVk": {  # aSliceOfHaven
        "name": "aSliceOfHaven",
        "company": "A Slice of Haven Media",
        "weekly_hours": (5, 8),
        "is_internal": False,
        "industry": "Other",
        "workers": ["recGO3te7FAkoB4nh", "recWkvV7ECg6VQ8ZS"],  # Spike, Echo
    },
    "rec9J9DDX0noT62YU": {  # VisionSpark
        "name": "VisionSpark",
        "company": "VisionSpark Analytics Inc",
        "weekly_hours": (5, 8),
        "is_internal": False,
        "industry": "Other",
        "workers": ["recqPOalla801ezQt", "recFr4Jo1MFTYsE7i", "recGO3te7FAkoB4nh"],  # Neo, Maya, Spike
    },
    "recN2VorsuzMoQjgH": {  # TIN Database Expansion
        "name": "TIN Database Expansion",
        "company": "The Innovative Native LLC",
        "weekly_hours": (3, 5),
        "is_internal": True,
        "industry": "Other",
        "workers": ["reczaukja9sEdMHHq"],  # Tab
    },
    "recTCil7BdtXPDxLY": {  # Law Firm RAG
        "name": "Law Firm RAG",
        "company": "Cerebro Legal Solutions",
        "weekly_hours": (10, 15),
        "is_internal": False,
        "industry": "Legal Tech",
        "workers": ["recpDqkfmJppiqsPa", "reck8wsTAZ7DvGlOO"],  # Ada, Sage
    },
    "reccD7V6vTV6bq9xV": {  # UK Directory
        "name": "UK Directory",
        "company": "UK Business Directory Ltd",
        "weekly_hours": (5, 8),
        "is_internal": False,
        "industry": "Other",
        "workers": ["recpDqkfmJppiqsPa", "recqPOalla801ezQt"],  # Ada, Neo
    },
    "recsBGDowHyz2Xdng": {  # OzhiApp CRM
        "name": "OzhiApp CRM",
        "company": "OzhiApp Technologies",
        "weekly_hours": (8, 12),
        "is_internal": False,
        "industry": "LegalTech",
        "workers": ["reczaukja9sEdMHHq", "recpDqkfmJppiqsPa", "recqPOalla801ezQt"],  # Tab, Ada, Neo
    },
    "recxUuGIPLc7kpDYT": {  # BuildMyTribe.AI
        "name": "BuildMyTribe.AI",
        "company": "BuildMyTribe Inc",
        "weekly_hours": (8, 12),
        "is_internal": False,
        "industry": "LegalTech",
        "workers": ["recpDqkfmJppiqsPa", "reczaukja9sEdMHHq", "recqPOalla801ezQt"],  # Ada, Tab, Neo
    },
}

# Contact personas for each company type
CONTACT_TEMPLATES = {
    "Legal Tech": [
        {"first": "James", "last": "Morrison", "title": "Managing Partner", "type": "Customer"},
        {"first": "Sarah", "last": "Chen", "title": "Legal Operations Director", "type": "Customer"},
        {"first": "Michael", "last": "Richards", "title": "IT Director", "type": "Customer"},
    ],
    "LegalTech": [
        {"first": "David", "last": "Thompson", "title": "CEO", "type": "Customer"},
        {"first": "Emily", "last": "Nakamura", "title": "CTO", "type": "Customer"},
        {"first": "Robert", "last": "Williams", "title": "VP Product", "type": "Customer"},
    ],
    "Other": [
        {"first": "Jennifer", "last": "Martinez", "title": "CEO", "type": "Customer"},
        {"first": "Thomas", "last": "Anderson", "title": "Operations Manager", "type": "Customer"},
        {"first": "Lisa", "last": "Park", "title": "Project Lead", "type": "Customer"},
    ],
}

# Work descriptions for time entries
WORK_DESCRIPTIONS = [
    "Feature development and implementation",
    "Bug fixes and optimization",
    "Client meeting and requirements gathering",
    "Code review and documentation",
    "Database schema updates",
    "API integration work",
    "Testing and QA",
    "Workflow automation setup",
    "UI/UX improvements",
    "Performance optimization",
    "Security audit and fixes",
    "Infrastructure maintenance",
    "Data migration and cleanup",
    "Reporting dashboard development",
    "User training and support",
]

HOURLY_RATE = 125.00
ONBOARDING_FEE = 5000.00

# =============================================================================
# API HELPERS
# =============================================================================

def airtable_request(method: str, table: str, data: Dict = None, record_id: str = None) -> Dict:
    """Make Airtable API request with rate limiting."""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{table}"
    if record_id:
        url += f"/{record_id}"

    headers = {
        "Authorization": f"Bearer {AIRTABLE_API_KEY}",
        "Content-Type": "application/json",
    }

    # Rate limiting: max 5 requests/second
    time.sleep(0.25)

    if method == "GET":
        response = requests.get(url, headers=headers)
    elif method == "POST":
        response = requests.post(url, headers=headers, json=data)
    elif method == "PATCH":
        response = requests.patch(url, headers=headers, json=data)
    else:
        raise ValueError(f"Unsupported method: {method}")

    if response.status_code not in [200, 201]:
        print(f"Error {response.status_code}: {response.text}")
        return None

    return response.json()


def batch_create(table: str, records: List[Dict]) -> List[str]:
    """Create records in batches of 10 (Airtable limit)."""
    created_ids = []
    for i in range(0, len(records), 10):
        batch = records[i:i+10]
        result = airtable_request("POST", table, {"records": batch})
        if result and "records" in result:
            created_ids.extend([r["id"] for r in result["records"]])
            print(f"  Created {len(result['records'])} records in {table}")
        time.sleep(0.5)  # Extra delay between batches
    return created_ids


# =============================================================================
# DATA GENERATORS
# =============================================================================

def generate_contacts(project_configs: Dict) -> List[Dict]:
    """Generate contact records for each external client company."""
    contacts = []
    seen_companies = set()

    for project_id, config in project_configs.items():
        if config["is_internal"]:
            continue
        if config["company"] in seen_companies:
            continue
        seen_companies.add(config["company"])

        industry = config.get("industry", "Other")
        templates = CONTACT_TEMPLATES.get(industry, CONTACT_TEMPLATES["Other"])

        for template in templates:
            contact = {
                "fields": {
                    "First Name": template["first"],
                    "Last Name": template["last"],
                    "Email": f"{template['first'].lower()}.{template['last'].lower()}@{config['company'].lower().replace(' ', '').replace('.', '')[:15]}.com",
                    "Title": template["title"],
                    "Company": config["company"],
                    "Industry": industry,
                    "Type": template["type"],
                    "Notes": f"Primary contact for {config['name']} project",
                }
            }
            contacts.append(contact)

    return contacts


def generate_subscriptions(project_configs: Dict, ninety_days_ago: datetime) -> List[Dict]:
    """Generate subscription records for external clients."""
    subscriptions = []
    seen_companies = set()

    for project_id, config in project_configs.items():
        if config["is_internal"]:
            continue
        if config["company"] in seen_companies:
            continue
        seen_companies.add(config["company"])

        # Random start date within the 90-day period (weighted toward beginning)
        days_offset = random.randint(0, 30)  # Most started in first month
        start_date = ninety_days_ago + timedelta(days=days_offset)

        avg_weekly = (config["weekly_hours"][0] + config["weekly_hours"][1]) / 2
        estimated_mrr = avg_weekly * 4 * HOURLY_RATE  # 4 weeks/month average

        subscription = {
            "fields": {
                "Customer Name": config["company"],
                "Email": f"billing@{config['company'].lower().replace(' ', '').replace('.', '')[:15]}.com",
                "Plan": "Pro" if avg_weekly > 8 else "Starter",
                "Status": "Active",
                "MRR": estimated_mrr,
                "Start Date": start_date.strftime("%Y-%m-%d"),
                "Current Period End": (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d"),
                "Project": [project_id],
                "Notes": f"Hourly engagement at ${HOURLY_RATE}/hr. Onboarding fee: ${ONBOARDING_FEE}",
            }
        }
        subscriptions.append(subscription)

    return subscriptions


def generate_payments(project_configs: Dict, ninety_days_ago: datetime, subscription_ids: Dict) -> List[Dict]:
    """Generate payment records including onboarding fees and monthly invoices."""
    payments = []
    today = datetime.now()

    for project_id, config in project_configs.items():
        if config["is_internal"]:
            continue

        company = config["company"]
        if company not in subscription_ids:
            continue

        # Calculate project start date (random within first 30 days)
        days_offset = random.randint(0, 30)
        start_date = ninety_days_ago + timedelta(days=days_offset)

        # 1. Onboarding fee payment (at start)
        onboarding_payment = {
            "fields": {
                "Amount": ONBOARDING_FEE,
                "Currency": "USD",
                "Status": "Succeeded",
                "Payment Date": start_date.strftime("%Y-%m-%d"),
                "Payment Method": "Card",
                "Subscription": [subscription_ids[company]],
                "Notes": f"Onboarding fee for {config['name']} project",
            }
        }
        payments.append(onboarding_payment)

        # 2. Monthly invoices for hours worked
        current_month = start_date.replace(day=1)
        while current_month < today:
            # Calculate hours for this month
            month_end = (current_month + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            if month_end > today:
                month_end = today

            # Weeks in this billing period
            weeks_in_period = max(1, (month_end - current_month).days // 7)
            avg_weekly = (config["weekly_hours"][0] + config["weekly_hours"][1]) / 2
            month_hours = avg_weekly * weeks_in_period * random.uniform(0.8, 1.2)
            month_amount = round(month_hours * HOURLY_RATE, 2)

            if month_amount > 0:
                # Payment date is ~15th of following month
                payment_date = (month_end + timedelta(days=15)).strftime("%Y-%m-%d")

                monthly_payment = {
                    "fields": {
                        "Amount": month_amount,
                        "Currency": "USD",
                        "Status": "Succeeded",
                        "Payment Date": payment_date,
                        "Payment Method": "Card",
                        "Subscription": [subscription_ids[company]],
                        "Notes": f"{config['name']} - {current_month.strftime('%B %Y')} ({round(month_hours, 1)} hrs @ ${HOURLY_RATE}/hr)",
                    }
                }
                payments.append(monthly_payment)

            # Move to next month
            current_month = (current_month + timedelta(days=32)).replace(day=1)

    return payments


def generate_time_entries(project_configs: Dict, ninety_days_ago: datetime) -> List[Dict]:
    """Generate daily time entries for 90 days."""
    entries = []
    today = datetime.now()
    current_date = ninety_days_ago

    while current_date <= today:
        # Skip weekends (most work is weekdays)
        if current_date.weekday() >= 5:
            # 20% chance of weekend work
            if random.random() > 0.2:
                current_date += timedelta(days=1)
                continue

        for project_id, config in project_configs.items():
            # Daily probability of work on this project
            # Higher hours = more likely to have work each day
            avg_weekly = (config["weekly_hours"][0] + config["weekly_hours"][1]) / 2
            daily_probability = min(0.9, avg_weekly / 10)  # Max 90% chance

            if random.random() > daily_probability:
                continue

            # Pick a random worker from the project
            workers = config.get("workers", [])
            if not workers:
                continue

            worker_id = random.choice(workers)

            # Hours for this day (portion of weekly target)
            daily_hours = round(avg_weekly / 5 * random.uniform(0.5, 1.5), 2)
            daily_hours = min(daily_hours, 6)  # Cap at 6 hours per project per day

            if daily_hours < 0.25:
                continue

            # Generate description
            description = random.choice(WORK_DESCRIPTIONS)
            tokens = random.randint(5000, 50000) if random.random() > 0.3 else None

            entry = {
                "fields": {
                    "Entry Date": current_date.strftime("%Y-%m-%d"),
                    "Project": [project_id],
                    "Agent": [worker_id],
                    "Hours": daily_hours,
                    "Description": f"{description} - {config['name']}",
                }
            }
            if tokens:
                entry["fields"]["Tokens Used"] = tokens

            entries.append(entry)

        current_date += timedelta(days=1)

    return entries


def generate_leads(project_configs: Dict, ninety_days_ago: datetime) -> List[Dict]:
    """Generate lead records for marketing data."""
    leads = []
    lead_sources = ["Organic", "Paid", "Referral", "Event", "Cold Outreach"]
    lead_statuses = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"]

    # Generate ~3-5 leads per external project
    for project_id, config in project_configs.items():
        if config["is_internal"]:
            continue

        num_leads = random.randint(3, 6)
        for i in range(num_leads):
            days_ago = random.randint(0, 85)
            lead_date = ninety_days_ago + timedelta(days=days_ago)

            # Leads that came in earlier are more likely to have progressed
            if days_ago > 60:
                status = random.choice(["Won", "Qualified", "Proposal", "Lost"])
            elif days_ago > 30:
                status = random.choice(["Contacted", "Qualified", "Proposal", "New"])
            else:
                status = random.choice(["New", "Contacted", "New"])

            # Won leads have higher estimated value
            if status == "Won":
                estimated_value = random.randint(15000, 50000)
            elif status in ["Qualified", "Proposal"]:
                estimated_value = random.randint(10000, 30000)
            else:
                estimated_value = random.randint(5000, 15000)

            first_names = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa"]
            last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"]

            first = random.choice(first_names)
            last = random.choice(last_names)

            lead = {
                "fields": {
                    "Name": f"{first} {last}",
                    "Email": f"{first.lower()}.{last.lower()}{random.randint(1,99)}@example.com",
                    "Company": f"{last} {random.choice(['Law Firm', 'Legal Group', 'Associates', 'Partners'])}",
                    "Title": random.choice(["Managing Partner", "Associate", "Legal Ops", "IT Director"]),
                    "Source": random.choice(lead_sources),
                    "Status": status,
                    "Score": random.randint(30, 100),
                    "First Touch Date": lead_date.strftime("%Y-%m-%d"),
                    "Estimated Value": estimated_value,
                    "Notes": f"Interested in {config['name']} solution",
                }
            }
            leads.append(lead)

    return leads


def generate_interactions(contact_ids: List[str], ninety_days_ago: datetime) -> List[Dict]:
    """Generate interaction records for contacts."""
    interactions = []
    interaction_types = ["Email", "Call", "Meeting", "Demo", "Support"]
    outcomes = ["Positive", "Neutral", "Negative"]

    for contact_id in contact_ids:
        # 2-6 interactions per contact over 90 days
        num_interactions = random.randint(2, 6)

        for _ in range(num_interactions):
            days_ago = random.randint(0, 85)
            interaction_date = ninety_days_ago + timedelta(days=days_ago)

            int_type = random.choice(interaction_types)

            subjects = {
                "Email": ["Project update", "Invoice follow-up", "Feature request", "Weekly status"],
                "Call": ["Discovery call", "Status check-in", "Scope discussion", "Issue resolution"],
                "Meeting": ["Kickoff meeting", "Sprint review", "Quarterly review", "Requirements workshop"],
                "Demo": ["Product demo", "Feature walkthrough", "Training session", "New release demo"],
                "Support": ["Bug report", "How-to question", "Access issue", "Performance concern"],
            }

            interaction = {
                "fields": {
                    "Subject": random.choice(subjects[int_type]),
                    "Type": int_type,
                    "Direction": random.choice(["Inbound", "Outbound"]),
                    "Summary": f"Discussed ongoing project needs and timeline",
                    "Date": interaction_date.strftime("%Y-%m-%d"),
                    "Outcome": random.choice(outcomes),
                    "Contact": [contact_id],
                }
            }
            interactions.append(interaction)

    return interactions


# =============================================================================
# MAIN EXECUTION
# =============================================================================

def main():
    print("=" * 60)
    print("TIN Airtable 90-Day Data Seeder")
    print("=" * 60)

    today = datetime.now()
    ninety_days_ago = today - timedelta(days=90)
    print(f"Generating data from {ninety_days_ago.strftime('%Y-%m-%d')} to {today.strftime('%Y-%m-%d')}")

    # 1. Generate and create Contacts
    print("\n[1/6] Creating Contacts...")
    contacts = generate_contacts(PROJECT_CONFIG)
    print(f"  Generated {len(contacts)} contact records")
    contact_ids = batch_create(TABLES["contacts"], contacts)
    print(f"  Created {len(contact_ids)} contacts in Airtable")

    # 2. Generate and create Subscriptions
    print("\n[2/6] Creating Subscriptions...")
    subscriptions = generate_subscriptions(PROJECT_CONFIG, ninety_days_ago)
    print(f"  Generated {len(subscriptions)} subscription records")
    sub_result = batch_create(TABLES["subscriptions"], subscriptions)

    # Build company -> subscription ID mapping
    subscription_ids = {}
    if sub_result:
        # Fetch the subscriptions to get company names
        time.sleep(0.5)
        subs_data = airtable_request("GET", TABLES["subscriptions"])
        if subs_data and "records" in subs_data:
            for rec in subs_data["records"]:
                company = rec["fields"].get("Customer Name")
                if company:
                    subscription_ids[company] = rec["id"]
    print(f"  Subscription mapping: {list(subscription_ids.keys())}")

    # 3. Generate and create Payments
    print("\n[3/6] Creating Payments...")
    payments = generate_payments(PROJECT_CONFIG, ninety_days_ago, subscription_ids)
    print(f"  Generated {len(payments)} payment records")
    payment_ids = batch_create(TABLES["payments"], payments)
    print(f"  Created {len(payment_ids)} payments in Airtable")

    # 4. Generate and create Time Entries
    print("\n[4/6] Creating Time Entries...")
    time_entries = generate_time_entries(PROJECT_CONFIG, ninety_days_ago)
    print(f"  Generated {len(time_entries)} time entry records")
    entry_ids = batch_create(TABLES["time_entries"], time_entries)
    print(f"  Created {len(entry_ids)} time entries in Airtable")

    # 5. Generate and create Leads
    print("\n[5/6] Creating Leads...")
    leads = generate_leads(PROJECT_CONFIG, ninety_days_ago)
    print(f"  Generated {len(leads)} lead records")
    lead_ids = batch_create(TABLES["leads"], leads)
    print(f"  Created {len(lead_ids)} leads in Airtable")

    # 6. Generate and create Interactions
    print("\n[6/6] Creating Interactions...")
    interactions = generate_interactions(contact_ids, ninety_days_ago)
    print(f"  Generated {len(interactions)} interaction records")
    interaction_ids = batch_create(TABLES["interactions"], interactions)
    print(f"  Created {len(interaction_ids)} interactions in Airtable")

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Contacts created: {len(contact_ids)}")
    print(f"Subscriptions created: {len(subscription_ids)}")
    print(f"Payments created: {len(payment_ids)}")
    print(f"Time Entries created: {len(entry_ids)}")
    print(f"Leads created: {len(lead_ids)}")
    print(f"Interactions created: {len(interaction_ids)}")

    # Revenue calculation
    total_onboarding = len([c for c in PROJECT_CONFIG.values() if not c["is_internal"]]) * ONBOARDING_FEE
    total_hours = sum(e["fields"]["Hours"] for e in time_entries)
    total_hourly_revenue = total_hours * HOURLY_RATE

    print(f"\nESTIMATED 90-DAY REVENUE:")
    print(f"  Onboarding fees: ${total_onboarding:,.2f}")
    print(f"  Hourly work ({total_hours:.1f} hrs): ${total_hourly_revenue:,.2f}")
    print(f"  TOTAL: ${total_onboarding + total_hourly_revenue:,.2f}")


if __name__ == "__main__":
    main()