#!/usr/bin/env python3
"""
Create realistic interactions for all contacts over 90 days.
"""
import os

import requests
import json
import time
import random
from datetime import datetime, timedelta

AIRTABLE_BASE_ID = "appTO7OCRB2XbAlak"
AIRTABLE_API_KEY = os.environ["AIRTABLE_API_KEY"]
INTERACTIONS_TABLE = "tblgHSyLh8oW0tNfj"

# All contact IDs from the Contacts table
CONTACTS = [
    {"id": "rec2uc61kxFCL32ql", "name": "Haven Mitchell", "company": "A Slice of Haven Media"},
    {"id": "rec5FCqK1fleMoS1f", "name": "Carlos Mendez", "company": "OzhiApp Technologies"},
    {"id": "recFHf5z4YmJIYEX3", "name": "Trinity Jackson", "company": "BuildMyTribe Inc"},
    {"id": "recIftxAaXPsaN9Ba", "name": "Emma Watson", "company": "UK Business Directory Ltd"},
    {"id": "recLU5tOrhRS32hOI", "name": "Jordan Blake", "company": "A Slice of Haven Media"},
    {"id": "recNIVJ2CVUrUwK7F", "name": "Sarah Chen", "company": "Cerebro Legal Solutions"},
    {"id": "recOyLwvymvwhK3vV", "name": "James Morrison", "company": "Cerebro Legal Solutions"},
    {"id": "recRJqjU259LECPmj", "name": "Samantha Patel", "company": "VisionSpark Analytics Inc"},
    {"id": "recXhxK1yKpGiA6ST", "name": "Alex Kumar", "company": "BuildMyTribe Inc"},
    {"id": "recYuTuc6k9a2NpeK", "name": "Rachel Green", "company": "OzhiApp Technologies"},
    {"id": "reccUf1u2UDHcM3dh", "name": "Marcus Rivera", "company": "DEA Academy"},
    {"id": "recciAg8vzWreOQdy", "name": "Robert Williams", "company": "BuildMyTribe Inc"},
    {"id": "recgFAswUkeKQYTQp", "name": "Michael Richards", "company": "Cerebro Legal Solutions"},
    {"id": "reciNUT8W75Ol1vbC", "name": "Derek Chen", "company": "VisionSpark Analytics Inc"},
    {"id": "recjlDDypbhMHwRd6", "name": "Nigel Thornberry", "company": "UK Business Directory Ltd"},
    {"id": "recvj14PQ6QJuRVlx", "name": "Patricia Henderson", "company": "DEA Academy"},
    {"id": "recxWF167S3I5xRIt", "name": "Ozhi Nakamura", "company": "OzhiApp Technologies"},
]

INTERACTION_TEMPLATES = {
    "Email": [
        {"subject": "Weekly status update", "summary": "Sent weekly progress report with completed tasks and upcoming milestones."},
        {"subject": "Invoice follow-up", "summary": "Discussed billing questions and confirmed payment schedule."},
        {"subject": "Feature request discussion", "summary": "Reviewed new feature requirements and provided timeline estimate."},
        {"subject": "Bug report acknowledgment", "summary": "Confirmed receipt of bug report and outlined resolution plan."},
        {"subject": "Project kickoff details", "summary": "Shared onboarding documentation and project timeline."},
        {"subject": "Monthly report delivery", "summary": "Delivered comprehensive monthly performance metrics and analysis."},
    ],
    "Call": [
        {"subject": "Discovery call", "summary": "Initial consultation to understand requirements and pain points."},
        {"subject": "Status check-in", "summary": "Bi-weekly call to review progress and address concerns."},
        {"subject": "Scope discussion", "summary": "Discussed potential scope changes and timeline implications."},
        {"subject": "Issue resolution call", "summary": "Troubleshooting session to resolve reported issues."},
        {"subject": "Roadmap review", "summary": "Reviewed upcoming features and priorities for next quarter."},
    ],
    "Meeting": [
        {"subject": "Project kickoff meeting", "summary": "In-person kickoff with stakeholders to align on goals and timeline."},
        {"subject": "Sprint review", "summary": "Demo of completed work and feedback collection."},
        {"subject": "Quarterly business review", "summary": "Comprehensive review of project health, metrics, and strategic planning."},
        {"subject": "Requirements workshop", "summary": "Collaborative session to define detailed requirements."},
        {"subject": "Training session", "summary": "Team training on new features and best practices."},
    ],
    "Demo": [
        {"subject": "Product demo", "summary": "Live demonstration of current platform capabilities."},
        {"subject": "Feature walkthrough", "summary": "Detailed walkthrough of newly implemented features."},
        {"subject": "New release demo", "summary": "Preview of upcoming release with key stakeholders."},
        {"subject": "Integration demo", "summary": "Demonstrated third-party integrations and data flows."},
    ],
    "Support": [
        {"subject": "Access issue resolution", "summary": "Resolved login/permission issues for team member."},
        {"subject": "Technical support request", "summary": "Addressed technical question about API usage."},
        {"subject": "Performance concern", "summary": "Investigated and resolved reported performance issues."},
        {"subject": "Data export assistance", "summary": "Helped with custom data export requirements."},
    ],
}

OUTCOMES = ["Positive", "Neutral", "Negative"]

def generate_interactions():
    """Generate realistic interactions for all contacts."""
    interactions = []
    today = datetime.now()
    ninety_days_ago = today - timedelta(days=90)

    for contact in CONTACTS:
        # 4-8 interactions per contact over 90 days
        num_interactions = random.randint(4, 8)

        # Spread interactions across the 90-day period
        interaction_dates = sorted([
            ninety_days_ago + timedelta(days=random.randint(0, 89))
            for _ in range(num_interactions)
        ])

        for i, date in enumerate(interaction_dates):
            # Vary interaction types - more emails early, more meetings/demos later
            if i == 0:
                # First interaction is usually discovery/kickoff
                int_type = random.choice(["Call", "Meeting"])
            elif date > today - timedelta(days=14):
                # Recent interactions more likely to be support/status
                int_type = random.choice(["Email", "Call", "Support"])
            else:
                int_type = random.choice(list(INTERACTION_TEMPLATES.keys()))

            template = random.choice(INTERACTION_TEMPLATES[int_type])

            # Outcome weighting: mostly positive (engaged clients)
            if int_type == "Support":
                outcome = random.choices(["Positive", "Neutral", "Negative"], weights=[0.5, 0.3, 0.2])[0]
            else:
                outcome = random.choices(["Positive", "Neutral", "Negative"], weights=[0.7, 0.25, 0.05])[0]

            interaction = {
                "Subject": f"{template['subject']} - {contact['company']}",
                "Type": int_type,
                "Direction": random.choice(["Inbound", "Outbound"]) if int_type in ["Email", "Call"] else "Outbound",
                "Summary": template["summary"],
                "Date": date.strftime("%Y-%m-%d"),
                "Outcome": outcome,
                "Contact": [contact["id"]],
            }

            # Add next action for positive outcomes
            if outcome == "Positive" and random.random() > 0.4:
                next_actions = [
                    "Schedule follow-up meeting",
                    "Send proposal",
                    "Prepare demo environment",
                    "Draft requirements document",
                    "Create project timeline",
                ]
                interaction["Next Action"] = random.choice(next_actions)
                interaction["Next Action Date"] = (date + timedelta(days=random.randint(3, 14))).strftime("%Y-%m-%d")

            interactions.append(interaction)

    return interactions


def batch_create(records):
    """Create records in batches of 10."""
    created = 0
    for i in range(0, len(records), 10):
        batch = records[i:i+10]
        payload = {"records": [{"fields": r} for r in batch]}

        response = requests.post(
            f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{INTERACTIONS_TABLE}",
            headers={
                "Authorization": f"Bearer {AIRTABLE_API_KEY}",
                "Content-Type": "application/json"
            },
            json=payload
        )

        if response.status_code in [200, 201]:
            result = response.json()
            created += len(result.get("records", []))
            print(f"  Created {len(result.get('records', []))} interactions (batch {i//10 + 1})")
        else:
            print(f"  Error: {response.status_code} - {response.text}")

        time.sleep(0.5)

    return created


def main():
    print("Generating interactions for 90-day period...")

    interactions = generate_interactions()
    print(f"  Generated {len(interactions)} interaction records")

    print("\nCreating interactions in Airtable...")
    created = batch_create(interactions)
    print(f"\nTotal interactions created: {created}")


if __name__ == "__main__":
    main()