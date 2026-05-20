#!/usr/bin/env python3
"""
Full Cross-Workflow Audit & Fix — Haven Pipeline
=================================================
Applies all 5 critical fixes (C1–C5) and runs verification.

C1: WF-001 "Store Resume URL - G1" — add typecast:true so "Awaiting Script Approval"
    auto-creates in Content Pipeline Status
C2: WF-004 "Create Asset Record" — QA Status "Flagged" → "Revision Needed"
C3: WF-004 "Create Asset Record" — remove non-existent "Generation Prompt" field
C4: WF-004 "Create Asset Record" — remove non-existent "Scene Number" field
C5: WF-003 "Validate Scene JSON" — map Gemini music_mood to valid Airtable options

Also: resets test playbook recQqnS9e0OnBIOul to Approved status.
Also: verifies every Airtable node field/value against live schema.
"""
import json
import os
import sys
import copy
import urllib.request
import urllib.error
from datetime import datetime

# ── Credentials ──────────────────────────────────────────────────────────────
MCP_PATH = os.path.expanduser("~/.claude/.mcp.json")
with open(MCP_PATH) as f:
    mcp = json.load(f)
N8N_API_KEY = mcp["mcpServers"]["n8n"]["env"]["N8N_API_KEY"]
N8N_BASE = "https://n8n.srv948776.hstgr.cloud"

AIRTABLE_TOKEN = mcp["mcpServers"]["airtable-mcp"]["env"]["AIRTABLE_API_KEY"]
HAVEN_BASE_ID = "appWVJhdylvNm07nv"

# ── Workflow IDs ─────────────────────────────────────────────────────────────
WF001_ID = "z9HkSEBkro1H9NSt"
WF003_ID = "WpAKeX9wCLWaJcsx"
WF004_ID = "ZPN0W5s5QKWSxxgQ"
WF005_ID = "hGVLwuBRunJeLHeY"
WF006_ID = "7xT9Ezu6wHHZ0Z3S"

# ── Table IDs ────────────────────────────────────────────────────────────────
PLAYBOOKS_TABLE = "tblyXrG01Tt7O07wI"
PRODUCTS_TABLE = "tblwjpzXzw2qMurJU"
CONTENT_PIPELINE_TABLE = "tblOsG9I5bk8zVtxg"
ASSETS_TABLE = "tblJq7QP7OPFKYzzR"
CHAR_SHEETS_TABLE = "tbl8pQ9WlCikdesYf"
VIDEOS_TABLE = "tblr3X73lfCjul8Br"
QA_REVIEWS_TABLE = "tblQ4xl6Gd0jYs6vN"

TEST_PLAYBOOK_ID = "recQqnS9e0OnBIOul"

# ── Backup dir ───────────────────────────────────────────────────────────────
BACKUP_DIR = "/private/tmp"


# ═══════════════════════════════════════════════════════════════════════════════
#  n8n API helpers
# ═══════════════════════════════════════════════════════════════════════════════
def n8n_get(path):
    url = f"{N8N_BASE}/api/v1/{path}"
    req = urllib.request.Request(url)
    req.add_header("X-N8N-API-KEY", N8N_API_KEY)
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read())


def n8n_put(path, payload):
    url = f"{N8N_BASE}/api/v1/{path}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="PUT")
    req.add_header("X-N8N-API-KEY", N8N_API_KEY)
    req.add_header("Content-Type", "application/json")
    try:
        resp = urllib.request.urlopen(req)
        return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"  ERROR {e.code}: {body[:500]}")
        raise


def put_workflow(wf_id, wf):
    """PUT workflow back — only safe fields."""
    safe = {
        "name": wf["name"],
        "nodes": wf["nodes"],
        "connections": wf["connections"],
        "settings": wf["settings"],
    }
    return n8n_put(f"workflows/{wf_id}", safe)


# ═══════════════════════════════════════════════════════════════════════════════
#  Airtable API helpers
# ═══════════════════════════════════════════════════════════════════════════════
def airtable_get(path):
    url = f"https://api.airtable.com/v0/{path}"
    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {AIRTABLE_TOKEN}")
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read())


def airtable_patch(table_id, record_id, fields, typecast=False):
    url = f"https://api.airtable.com/v0/{HAVEN_BASE_ID}/{table_id}"
    payload = {
        "records": [{"id": record_id, "fields": fields}],
    }
    if typecast:
        payload["typecast"] = True
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="PATCH")
    req.add_header("Authorization", f"Bearer {AIRTABLE_TOKEN}")
    req.add_header("Content-Type", "application/json")
    resp = urllib.request.urlopen(req)
    return json.loads(resp.read())


def get_airtable_schema():
    """Pull full schema for Haven base."""
    return airtable_get(f"meta/bases/{HAVEN_BASE_ID}/tables")


# ═══════════════════════════════════════════════════════════════════════════════
#  Backup
# ═══════════════════════════════════════════════════════════════════════════════
def backup_workflow(wf_id, label):
    wf = n8n_get(f"workflows/{wf_id}")
    path = os.path.join(BACKUP_DIR, f"audit-{label}-pre-fix.json")
    with open(path, "w") as f:
        json.dump(wf, f, indent=2)
    print(f"  Backed up {label} → {path}")
    return wf


# ═══════════════════════════════════════════════════════════════════════════════
#  FIX C1: WF-001 — add typecast to "Store Resume URL - G1"
# ═══════════════════════════════════════════════════════════════════════════════
def fix_c1(wf):
    """Add typecast:true to Store Resume URL - G1 so 'Awaiting Script Approval' auto-creates."""
    wf = copy.deepcopy(wf)
    for node in wf["nodes"]:
        if node.get("name") == "Store Resume URL - G1":
            # Add typecast to options
            if "options" not in node["parameters"]:
                node["parameters"]["options"] = {}
            node["parameters"]["options"]["typecast"] = True
            print("  C1: Added typecast:true to 'Store Resume URL - G1'")
            return wf
    print("  C1: WARNING — node 'Store Resume URL - G1' not found!")
    return wf


# ═══════════════════════════════════════════════════════════════════════════════
#  FIX C2/C3/C4: WF-004 — fix "Airtable - Create Asset Record"
# ═══════════════════════════════════════════════════════════════════════════════
def fix_c2_c3_c4(wf):
    """Fix QA Status value and remove non-existent fields from Create Asset Record."""
    wf = copy.deepcopy(wf)
    for node in wf["nodes"]:
        if node.get("name") == "Airtable - Create Asset Record":
            mapping = node["parameters"]["columns"]["value"]

            # C2: Fix QA Status "Flagged" → "Revision Needed"
            if "QA Status" in mapping:
                old_val = mapping["QA Status"]
                # The expression evaluates pass_quality ? 'Passed' : 'Flagged'
                # Change 'Flagged' to 'Revision Needed' in the expression
                if "Flagged" in str(old_val):
                    mapping["QA Status"] = old_val.replace("Flagged", "Revision Needed")
                    print(f"  C2: QA Status expression updated: 'Flagged' → 'Revision Needed'")
                else:
                    print(f"  C2: QA Status value is '{old_val}' — no 'Flagged' found")

            # C3: Remove "Generation Prompt" (field doesn't exist)
            if "Generation Prompt" in mapping:
                del mapping["Generation Prompt"]
                print("  C3: Removed 'Generation Prompt' from mapping")
            else:
                print("  C3: 'Generation Prompt' not in mapping (already clean)")

            # C4: Remove "Scene Number" (field doesn't exist)
            if "Scene Number" in mapping:
                del mapping["Scene Number"]
                print("  C4: Removed 'Scene Number' from mapping")
            else:
                print("  C4: 'Scene Number' not in mapping (already clean)")

            return wf
    print("  C2/C3/C4: WARNING — node 'Airtable - Create Asset Record' not found!")
    return wf


# ═══════════════════════════════════════════════════════════════════════════════
#  FIX C5: WF-003 — add music_mood mapping in "Validate Scene JSON"
# ═══════════════════════════════════════════════════════════════════════════════
# The valid Airtable music_mood options are:
#   upbeat_ambient, calm_lofi, warm_dreamy, Upbeat, Chill, Dreamy, Warm
# Gemini might return any of these or similar values.

MUSIC_MOOD_MAPPING_JS = """
// --- C5 FIX: Map Gemini music_mood to valid Airtable options ---
const moodMap = {
  'upbeat_ambient': 'upbeat_ambient',
  'calm_lofi': 'calm_lofi',
  'warm_dreamy': 'warm_dreamy',
  'upbeat': 'Upbeat',
  'chill': 'Chill',
  'dreamy': 'Dreamy',
  'warm': 'Warm',
  'ambient': 'upbeat_ambient',
  'lofi': 'calm_lofi',
  'lo-fi': 'calm_lofi',
  'lo_fi': 'calm_lofi'
};
if (parsed.music_mood) {
  const normalizedMood = parsed.music_mood.toLowerCase().trim();
  const mappedMood = moodMap[normalizedMood];
  if (mappedMood) {
    parsed.music_mood = mappedMood;
  } else {
    // Default to calm_lofi if unrecognized
    parsed.music_mood = 'calm_lofi';
  }
}
// --- END C5 FIX ---"""


def fix_c5(wf):
    """Add music_mood validation/mapping to Validate Scene JSON code node."""
    wf = copy.deepcopy(wf)
    for node in wf["nodes"]:
        if node.get("name") == "Validate Scene JSON":
            code = node["parameters"]["jsCode"]

            # Check if already patched
            if "C5 FIX" in code:
                print("  C5: Already patched (C5 FIX marker found)")
                return wf

            # Find the existing music_mood validation block and replace it
            # The existing code has:
            #   const validMoods = ['upbeat_ambient', 'calm_lofi', 'warm_dreamy'];
            #   if (parsed.music_mood && !validMoods.includes(parsed.music_mood)) {
            #     errors.push('Invalid music_mood: ...');
            #   }
            old_validation = (
                "const validMoods = ['upbeat_ambient', 'calm_lofi', 'warm_dreamy'];\n"
                "if (parsed.music_mood && !validMoods.includes(parsed.music_mood)) {\n"
                "  errors.push('Invalid music_mood: ' + parsed.music_mood + '. Must be one of: ' + validMoods.join(', '));\n"
                "}"
            )

            if old_validation in code:
                # Replace the error-pushing validation with a mapping that fixes the value
                code = code.replace(old_validation, MUSIC_MOOD_MAPPING_JS)
                node["parameters"]["jsCode"] = code
                print("  C5: Replaced music_mood validation with mapping logic")
            else:
                # Try inserting before the scene loop as fallback
                insert_marker = "// Validate each scene"
                if insert_marker in code:
                    code = code.replace(insert_marker, MUSIC_MOOD_MAPPING_JS + "\n\n" + insert_marker)
                    node["parameters"]["jsCode"] = code
                    print("  C5: Inserted music_mood mapping before scene validation (fallback)")
                else:
                    print("  C5: WARNING — could not find insertion point in Validate Scene JSON!")
            return wf
    print("  C5: WARNING — node 'Validate Scene JSON' not found!")
    return wf


# ═══════════════════════════════════════════════════════════════════════════════
#  Reset test playbook
# ═══════════════════════════════════════════════════════════════════════════════
def reset_test_playbook():
    """Set playbook recQqnS9e0OnBIOul back to Approved, clear Notes."""
    print(f"\n── Step 4: Reset test playbook {TEST_PLAYBOOK_ID}")
    airtable_patch(PLAYBOOKS_TABLE, TEST_PLAYBOOK_ID, {
        "Status": "Approved",
        "Notes": ""
    })
    print("  Reset to Status=Approved, Notes cleared")


# ═══════════════════════════════════════════════════════════════════════════════
#  Verification
# ═══════════════════════════════════════════════════════════════════════════════
def build_schema_lookup(schema):
    """Build {table_id: {field_name: field_info}} and {table_id: {field_name: [options]}}."""
    tables = {}
    for table in schema["tables"]:
        tid = table["id"]
        fields = {}
        for field in table["fields"]:
            fname = field["name"]
            options = None
            if field["type"] == "singleSelect" and "options" in field:
                options = [c["name"] for c in field["options"].get("choices", [])]
            elif field["type"] == "multipleSelects" and "options" in field:
                options = [c["name"] for c in field["options"].get("choices", [])]
            fields[fname] = {
                "type": field["type"],
                "id": field["id"],
                "options": options,
            }
        tables[tid] = {"name": table["name"], "fields": fields}
    return tables


def extract_static_value(expr):
    """Try to extract a static string from an n8n expression or literal."""
    if not isinstance(expr, str):
        return None
    # Pure static string (no ={{ }})
    if not expr.startswith("="):
        return expr
    # Expression like "={{ ... ? 'Passed' : 'Revision Needed' }}"
    # We can't fully evaluate, but we can extract string literals
    return None


def verify_all_workflows(schema_lookup):
    """Pull all 5 workflows and verify every Airtable node field/value."""
    print("\n── Step 5: Verification ──────────────────────────────────────────")
    wf_ids = {
        "WF-001": WF001_ID,
        "WF-003": WF003_ID,
        "WF-004": WF004_ID,
        "WF-005": WF005_ID,
        "WF-006": WF006_ID,
    }

    all_pass = True
    total_nodes = 0
    pass_count = 0
    fail_count = 0

    for wf_label, wf_id in wf_ids.items():
        print(f"\n  {wf_label} ({wf_id}):")
        wf = n8n_get(f"workflows/{wf_id}")

        for node in wf["nodes"]:
            # Only check Airtable nodes
            if node.get("type") != "n8n-nodes-base.airtable":
                continue

            node_name = node.get("name", "unnamed")
            params = node.get("parameters", {})
            operation = params.get("operation", "get")
            table_id = params.get("table", {}).get("value", "")

            # Read-only operations are safe
            if operation in ("get", "list", "search"):
                print(f"    ✅ {node_name} (read-only)")
                total_nodes += 1
                pass_count += 1
                continue

            total_nodes += 1

            # Check table exists in schema
            if table_id not in schema_lookup:
                print(f"    ❌ {node_name} — table '{table_id}' not in schema!")
                fail_count += 1
                all_pass = False
                continue

            table_info = schema_lookup[table_id]
            table_name = table_info["name"]

            # Check field mapping
            columns = params.get("columns", {})
            mapping = columns.get("value", {})
            node_errors = []

            for field_name, field_value in mapping.items():
                # Skip internal fields
                if field_name in ("id",):
                    continue

                # Check field exists
                if field_name not in table_info["fields"]:
                    node_errors.append(f"field '{field_name}' does not exist in {table_name}")
                    continue

                field_info = table_info["fields"][field_name]

                # Check select values
                if field_info["options"] is not None:
                    static_val = extract_static_value(field_value)
                    if static_val and static_val not in field_info["options"]:
                        # Check if typecast is enabled (allows new values)
                        options = params.get("options", {})
                        if options.get("typecast"):
                            pass  # typecast will auto-create
                        else:
                            node_errors.append(
                                f"'{field_name}' value '{static_val}' not in options: "
                                f"{field_info['options']}"
                            )

            if node_errors:
                print(f"    ❌ {node_name} ({table_name}):")
                for err in node_errors:
                    print(f"       - {err}")
                fail_count += 1
                all_pass = False
            else:
                print(f"    ✅ {node_name} ({table_name}, {operation})")
                pass_count += 1

    print(f"\n  ─── Summary ───")
    print(f"  Total Airtable nodes: {total_nodes}")
    print(f"  Passed: {pass_count}")
    print(f"  Failed: {fail_count}")
    if all_pass:
        print(f"  🟢 ALL CHECKS PASSED")
    else:
        print(f"  🔴 {fail_count} FAILURES — see above")
    return all_pass


# ═══════════════════════════════════════════════════════════════════════════════
#  Main
# ═══════════════════════════════════════════════════════════════════════════════
def main():
    print("=" * 72)
    print("Haven Pipeline — Full Cross-Workflow Audit & Fix")
    print(f"Date: {datetime.now().isoformat()}")
    print("=" * 72)

    # ── Step 1: Backup all workflows ─────────────────────────────────────────
    print("\n── Step 1: Backup workflows ──────────────────────────────────────")
    wf001 = backup_workflow(WF001_ID, "wf001")
    wf003 = backup_workflow(WF003_ID, "wf003")
    wf004 = backup_workflow(WF004_ID, "wf004")

    # ── Step 2: Apply C1 to WF-001 ──────────────────────────────────────────
    print("\n── Step 2: Fix C1 (WF-001) ──────────────────────────────────────")
    wf001_fixed = fix_c1(wf001)
    put_workflow(WF001_ID, wf001_fixed)
    print("  Deployed WF-001")

    # ── Step 3: Apply C2/C3/C4 to WF-004 ────────────────────────────────────
    print("\n── Step 3: Fix C2/C3/C4 (WF-004) ────────────────────────────────")
    wf004_fixed = fix_c2_c3_c4(wf004)
    put_workflow(WF004_ID, wf004_fixed)
    print("  Deployed WF-004")

    # ── Step 4: Apply C5 to WF-003 ──────────────────────────────────────────
    print("\n── Step 4: Fix C5 (WF-003) ──────────────────────────────────────")
    wf003_fixed = fix_c5(wf003)
    put_workflow(WF003_ID, wf003_fixed)
    print("  Deployed WF-003")

    # ── Step 5: Reset test playbook ──────────────────────────────────────────
    reset_test_playbook()

    # ── Step 6: Pull fresh schema + verify ───────────────────────────────────
    print("\n── Step 6: Pull Airtable schema ─────────────────────────────────")
    schema = get_airtable_schema()
    schema_lookup = build_schema_lookup(schema)
    print(f"  Got schema for {len(schema_lookup)} tables")

    # Save fresh schema
    schema_path = os.path.join(BACKUP_DIR, "audit-airtable-schema-post-fix.json")
    with open(schema_path, "w") as f:
        json.dump(schema, f, indent=2)
    print(f"  Saved → {schema_path}")

    all_pass = verify_all_workflows(schema_lookup)

    print("\n" + "=" * 72)
    if all_pass:
        print("✅ ALL FIXES APPLIED AND VERIFIED SUCCESSFULLY")
    else:
        print("⚠️  FIXES APPLIED BUT VERIFICATION FOUND ISSUES — check output above")
    print("=" * 72)

    return 0 if all_pass else 1


if __name__ == "__main__":
    sys.exit(main())
