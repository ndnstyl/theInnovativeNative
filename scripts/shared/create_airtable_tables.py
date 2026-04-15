#!/usr/bin/env python3
"""
Create Episodes, Scenes, and Shorts tables in Airtable for the BowTie Bullies pipeline.
Seeds EP-001 Victory Lap record.

Usage: python scripts/create_airtable_tables.py
"""
import os

import json
import sys
import time
import urllib.request
import urllib.error

BASE_ID = "appTO7OCRB2XbAlak"
API_TOKEN = os.environ["AIRTABLE_API_KEY"]
API_URL = f"https://api.airtable.com/v0/meta/bases/{BASE_ID}/tables"


def api_request(url, data=None, method="GET"):
    """Make an Airtable API request."""
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json",
    }
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"HTTP {e.code}: {error_body}")
        sys.exit(1)


def create_table(name, fields, description=""):
    """Create a table in the Airtable base."""
    payload = {
        "name": name,
        "description": description,
        "fields": fields,
    }
    print(f"Creating table: {name}...")
    result = api_request(API_URL, data=payload, method="POST")
    table_id = result["id"]
    print(f"  Created: {table_id}")
    return table_id


def create_record(table_id, fields):
    """Create a record in a table."""
    url = f"https://api.airtable.com/v0/{BASE_ID}/{table_id}"
    payload = {"records": [{"fields": fields}]}
    result = api_request(url, data=payload, method="POST")
    record_id = result["records"][0]["id"]
    print(f"  Record created: {record_id}")
    return record_id


def main():
    # ── 1. Create Episodes table ──
    episodes_fields = [
        {"name": "Episode ID", "type": "singleLineText"},
        {"name": "Title", "type": "singleLineText"},
        {
            "name": "Content Pillar",
            "type": "singleSelect",
            "options": {
                "choices": [
                    {"name": "1A Economic Collapse Prep", "color": "redLight2"},
                    {"name": "1B Hood Financial Literacy", "color": "orangeLight2"},
                    {"name": "1C Wealth Building", "color": "yellowLight2"},
                    {"name": "2A Food Security", "color": "greenLight2"},
                    {"name": "2B Natural Resources", "color": "tealLight2"},
                    {"name": "2C Shelter", "color": "blueLight2"},
                    {"name": "3 Center Doesnt Hold", "color": "purpleLight2"},
                ]
            },
        },
        {
            "name": "Status",
            "type": "singleSelect",
            "options": {
                "choices": [
                    {"name": "planning", "color": "grayLight2"},
                    {"name": "scripting", "color": "blueLight2"},
                    {"name": "vo_generation", "color": "cyanLight2"},
                    {"name": "asset_generation", "color": "tealLight2"},
                    {"name": "assembly", "color": "greenLight2"},
                    {"name": "review", "color": "yellowLight2"},
                    {"name": "published", "color": "greenDark1"},
                ]
            },
        },
        {"name": "Target Duration (min)", "type": "number", "options": {"precision": 0}},
        {"name": "Brief", "type": "multilineText"},
        {"name": "Talking Points", "type": "multilineText"},
        {"name": "Cold Open", "type": "multilineText"},
        {"name": "Key Stat", "type": "multilineText"},
        {
            "name": "Thumbnail Type",
            "type": "singleSelect",
            "options": {
                "choices": [
                    {"name": "A", "color": "blueLight2"},
                    {"name": "B", "color": "greenLight2"},
                    {"name": "C", "color": "yellowLight2"},
                    {"name": "D", "color": "redLight2"},
                ]
            },
        },
        {"name": "Script JSON URL", "type": "url"},
        {"name": "Final Video URL", "type": "url"},
        {"name": "YouTube URL", "type": "url"},
        {"name": "Resume Webhook URL", "type": "multilineText"},
        {"name": "Current Phase", "type": "singleLineText"},
    ]

    episodes_table_id = create_table(
        "Episodes",
        episodes_fields,
        "BowTie Bullies episode tracking — pipeline state machine",
    )
    time.sleep(1)

    # ── 2. Create Scenes table ──
    scenes_fields = [
        {"name": "Scene Number", "type": "number", "options": {"precision": 0}},
        {
            "name": "Episode",
            "type": "multipleRecordLinks",
            "options": {"linkedTableId": episodes_table_id},
        },
        {
            "name": "Scene Type",
            "type": "singleSelect",
            "options": {
                "choices": [
                    {"name": "hook", "color": "redLight2"},
                    {"name": "narration_stills", "color": "blueLight2"},
                    {"name": "stat_callout", "color": "yellowLight2"},
                    {"name": "quote_card", "color": "purpleLight2"},
                    {"name": "transition_beat", "color": "grayLight2"},
                    {"name": "topic_pivot", "color": "tealLight2"},
                    {"name": "lower_third", "color": "cyanLight2"},
                    {"name": "closer", "color": "greenLight2"},
                ]
            },
        },
        {"name": "Narration Text", "type": "multilineText"},
        {"name": "Visual Prompt", "type": "multilineText"},
        {
            "name": "Visual Backend",
            "type": "singleSelect",
            "options": {
                "choices": [
                    {"name": "gemini", "color": "blueLight2"},
                    {"name": "kie_ai", "color": "tealLight2"},
                    {"name": "remotion", "color": "purpleLight2"},
                ]
            },
        },
        {
            "name": "Pose Variant",
            "type": "singleSelect",
            "options": {
                "choices": [
                    {"name": "P1", "color": "blueLight2"},
                    {"name": "P2", "color": "greenLight2"},
                    {"name": "P3", "color": "yellowLight2"},
                    {"name": "P4", "color": "purpleLight2"},
                    {"name": "P5", "color": "redLight2"},
                    {"name": "P6", "color": "tealLight2"},
                ]
            },
        },
        {"name": "Duration (seconds)", "type": "number", "options": {"precision": 1}},
        {"name": "VO File URL", "type": "url"},
        {"name": "Image File URL", "type": "url"},
        {"name": "Image Preview", "type": "multipleAttachments"},
        {"name": "Reuse Asset ID", "type": "singleLineText"},
        {"name": "SFX Bed", "type": "singleLineText"},
        {"name": "SFX Events", "type": "multilineText"},
        {
            "name": "Music Mood",
            "type": "singleSelect",
            "options": {
                "choices": [
                    {"name": "somber", "color": "blueLight2"},
                    {"name": "tense", "color": "redLight2"},
                    {"name": "reflective", "color": "purpleLight2"},
                    {"name": "defiant", "color": "orangeLight2"},
                    {"name": "triumphant", "color": "greenLight2"},
                ]
            },
        },
        {"name": "Pause After (ms)", "type": "number", "options": {"precision": 0}},
        {
            "name": "Transition Out",
            "type": "singleSelect",
            "options": {
                "choices": [
                    {"name": "fade_to_black", "color": "grayLight2"},
                    {"name": "hard_cut", "color": "redLight2"},
                    {"name": "dissolve", "color": "blueLight2"},
                ]
            },
        },
        {
            "name": "Status",
            "type": "singleSelect",
            "options": {
                "choices": [
                    {"name": "pending", "color": "grayLight2"},
                    {"name": "script_generated", "color": "blueLight2"},
                    {"name": "vo_generated", "color": "cyanLight2"},
                    {"name": "image_generated", "color": "tealLight2"},
                    {"name": "approved", "color": "greenLight2"},
                    {"name": "rejected", "color": "redLight2"},
                ]
            },
        },
    ]

    scenes_table_id = create_table(
        "Scenes",
        scenes_fields,
        "Individual scene records linked to episodes — tracks script, VO, and visual assets",
    )
    time.sleep(1)

    # ── 3. Create Shorts table ──
    shorts_fields = [
        {"name": "Title", "type": "singleLineText"},
        {
            "name": "Episode",
            "type": "multipleRecordLinks",
            "options": {"linkedTableId": episodes_table_id},
        },
        {"name": "Start Time", "type": "singleLineText"},
        {"name": "End Time", "type": "singleLineText"},
        {"name": "File URL", "type": "url"},
        {
            "name": "Platform",
            "type": "multipleSelects",
            "options": {
                "choices": [
                    {"name": "YouTube Shorts", "color": "redLight2"},
                    {"name": "Instagram Reels", "color": "purpleLight2"},
                    {"name": "TikTok", "color": "blueLight2"},
                ]
            },
        },
        {
            "name": "Status",
            "type": "singleSelect",
            "options": {
                "choices": [
                    {"name": "extracted", "color": "blueLight2"},
                    {"name": "captioned", "color": "yellowLight2"},
                    {"name": "published", "color": "greenLight2"},
                ]
            },
        },
    ]

    shorts_table_id = create_table(
        "Shorts",
        shorts_fields,
        "Extracted short-form clips from episodes — YouTube Shorts, Reels, TikTok",
    )
    time.sleep(1)

    # ── 4. Seed EP-001 Victory Lap ──
    print("\nSeeding EP-001 Victory Lap...")

    ep001_brief = (
        "Their victory lap vs. YOUR victory lap. Silicon Valley popped champagne. "
        "AI made billionaires. Your block saw nothing. But this isn't about their "
        "celebration — it's about what YOUR victory lap looks like. Ownership. "
        "Self-made success. Building something they can't take. Nipsey understood "
        "ownership. This episode is the thesis: survival starts with owning something."
    )

    ep001_talking_points = """- They popped champagne in San Francisco. $20 billion in revenue. Fastest-growing companies in history. That's their victory lap. Where's yours? Nipsey bought the plaza on Slauson and Crenshaw. He owned the block. That's what a real victory lap looks like — ownership, not applause.
- The difference between a paycheck and ownership. 92% of Black households have zero business equity. You can grind forever and never own the ground you stand on — unless you change the math.
- Five things you can own starting from zero: a skill nobody can automate, a side business, intellectual property, a rental arrangement, community equity. None of these require venture capital.
- AI is replacing white-collar work faster than blue-collar. The irony: the trades your counselor told you to skip — plumbing, electrical, welding — are becoming the most automation-proof income in America.
- The thesis of this channel: not fear, not hype, not tutorial energy. Witness testimony from someone who grew up watching systems promise progress to everyone except his block. Now survival knowledge. Because the hood already taught me what survival looks like. AI just made it urgent for everybody."""

    ep001_cold_open = (
        "They threw a party in San Francisco last year. Twenty billion in revenue. "
        "Fastest-growin' company in history, they said. Champagne. Magazine covers. "
        "TED talks about abundance. And somewhere in East Oakland, a woman tryin' to "
        "start a cleaning business got denied a loan by a machine she'll never meet. "
        "Nobody popped nothin' for her. She just got a rejection email at 2 AM and a "
        "credit score that went down for askin'. That's their victory lap. Not yours. "
        "Theirs. And they already finished runnin' it before you knew the race started. "
        "But here's the thing Nipsey taught me — you don't need their race. You need "
        "your own lane. And that starts with ownin' somethin'."
    )

    ep001_key_stat = (
        "Only 8% of Black households hold business equity, compared to 15% of white "
        "households. Median Black family wealth: $24,100 vs $189,100 white. "
        "— Federal Reserve Survey of Consumer Finances, 2024"
    )

    ep001_record = create_record(episodes_table_id, {
        "Episode ID": "EP-001",
        "Title": "Victory Lap",
        "Content Pillar": {"name": "1C Wealth Building"},
        "Status": {"name": "planning"},
        "Target Duration (min)": 15,
        "Brief": ep001_brief,
        "Talking Points": ep001_talking_points,
        "Cold Open": ep001_cold_open,
        "Key Stat": ep001_key_stat,
        "Thumbnail Type": {"name": "B"},
        "Current Phase": "Phase 0 — Planning",
    })

    # ── 5. Print summary ──
    print("\n" + "=" * 60)
    print("AIRTABLE TABLES CREATED SUCCESSFULLY")
    print("=" * 60)
    print(f"Episodes:  {episodes_table_id}")
    print(f"Scenes:    {scenes_table_id}")
    print(f"Shorts:    {shorts_table_id}")
    print(f"EP-001:    {ep001_record}")
    print("=" * 60)


if __name__ == "__main__":
    main()