#!/usr/bin/env python3
"""
Fix Round 2: Address all issues found in exhaustive node-by-node audit.

CRITICAL BUGS FIXED:
  C1: .json.fields['Field'] → .json['Field'] in ALL 4 workflows
  C2: VIDEO Merge multiplex → append mode (prevents 30x duplication)
  C3: REEL Drive Upload $json.brandName → explicit node reference
  H1: PROMPT missing Prompt Label in parse + create nodes

Each fix is applied surgically to the specific Code node's jsCode string
or node parameters, then the file is written back.
"""

import json
import sys
import os

WORKFLOW_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'n8n-workflows')

def load_workflow(filename):
    path = os.path.join(WORKFLOW_DIR, filename)
    with open(path, 'r') as f:
        return json.load(f), path

def save_workflow(data, path):
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"  ✅ Saved: {path}")

def find_node(workflow, name):
    for node in workflow['nodes']:
        if node['name'] == name:
            return node
    raise ValueError(f"Node '{name}' not found")

def fix_prompt_generator():
    print("\n=== Fixing WF-THT-PROMPT ===")
    wf, path = load_workflow('tht-prompt-generator.json')
    fixes = 0

    # C1: Build Gemini Prompt - .json.fields → .json
    node = find_node(wf, 'Code — Build Gemini Prompt')
    code = node['parameters']['jsCode']
    old = "$('Airtable — Fetch Project').first().json.fields"
    new = "$('Airtable — Fetch Project').first().json"
    if old in code:
        code = code.replace(old, new)
        node['parameters']['jsCode'] = code
        fixes += 1
        print(f"  Fixed C1: Build Gemini Prompt .fields access")
    else:
        print(f"  ⚠️  C1 pattern not found in Build Gemini Prompt - may already be fixed")

    # H1: Parse Prompt JSON - add Prompt Label to output
    node = find_node(wf, 'Code — Parse Prompt JSON')
    code = node['parameters']['jsCode']
    # Check if promptLabel is already generated
    if 'promptLabel' not in code:
        # Add promptLabel generation to the image loop
        old_img = "promptText: img.prompt"
        new_img = "promptLabel: `${brandName} - Phase ${img.phase} (image)`,\n        promptText: img.prompt"
        if old_img in code:
            code = code.replace(old_img, new_img, 1)
            fixes += 1
            print(f"  Fixed H1: Added promptLabel to image items")

        old_vid = "promptText: vid.prompt"
        new_vid = "promptLabel: `${brandName} - Phase ${vid.phase} (video)`,\n        promptText: vid.prompt"
        if old_vid in code:
            code = code.replace(old_vid, new_vid, 1)
            fixes += 1
            print(f"  Fixed H1: Added promptLabel to video items")

        node['parameters']['jsCode'] = code
    else:
        print(f"  ⚠️  H1 promptLabel already present")

    # H1: Create Prompt Record - add Prompt Label field mapping
    node = find_node(wf, 'Airtable — Create Prompt Record')
    columns = node['parameters'].get('columns', {})
    if isinstance(columns, dict):
        values = columns.get('mappingMode', '')
        # Check the values array for Prompt Label
        schema_vals = columns.get('values', [])
        has_prompt_label = any(v.get('column') == 'Prompt Label' for v in schema_vals)
        if not has_prompt_label:
            schema_vals.append({
                "column": "Prompt Label",
                "fieldValue": "={{ $json.promptLabel }}"
            })
            columns['values'] = schema_vals
            node['parameters']['columns'] = columns
            fixes += 1
            print(f"  Fixed H1: Added Prompt Label to Create Prompt Record")
    else:
        print(f"  ⚠️  Unexpected columns format in Create Prompt Record")

    save_workflow(wf, path)
    print(f"  Total fixes: {fixes}")
    return fixes

def fix_image_generator():
    print("\n=== Fixing WF-THT-IMAGE ===")
    wf, path = load_workflow('tht-image-generator.json')
    fixes = 0

    # C1: Build NBP Payload - item.fields['X'] → item['X']
    node = find_node(wf, 'Code — Build NBP Payload')
    code = node['parameters']['jsCode']
    replacements = [
        ("item.fields['Prompt Text']", "item['Prompt Text']"),
        ("item.fields['Phase Number']", "item['Phase Number']"),
        ("item.fields['Phase Label']", "item['Phase Label']"),
    ]
    for old, new in replacements:
        if old in code:
            code = code.replace(old, new)
            fixes += 1
            print(f"  Fixed C1: {old} → {new}")
    node['parameters']['jsCode'] = code

    save_workflow(wf, path)
    print(f"  Total fixes: {fixes}")
    return fixes

def fix_video_generator():
    print("\n=== Fixing WF-THT-VIDEO ===")
    wf, path = load_workflow('tht-video-generator.json')
    fixes = 0

    # C1: Build Video Jobs - .json.fields['X'] → .json['X']
    node = find_node(wf, 'Code — Build Video Jobs')
    code = node['parameters']['jsCode']
    replacements = [
        (".json.fields['Phase Number']", ".json['Phase Number']"),
        (".json.fields['Drive File ID']", ".json['Drive File ID']"),
        (".json.fields['Drive URL']", ".json['Drive URL']"),
        (".json.fields['Prompt Text']", ".json['Prompt Text']"),
        (".json.fields['Phase Label']", ".json['Phase Label']"),
    ]
    for old, new in replacements:
        count = code.count(old)
        if count > 0:
            code = code.replace(old, new)
            fixes += count
            print(f"  Fixed C1: {old} → {new} ({count} occurrences)")
    node['parameters']['jsCode'] = code

    # C2: Merge node - multiplex → mergeByPosition (or just use append)
    # Actually, the better fix is to NOT use multiplex. Since the Code node
    # uses $('NodeName').all() to access data directly, the Merge is just
    # a synchronization gate. Change to mode=append which concatenates
    # items instead of cartesian product.
    merge_node = find_node(wf, 'Merge — Wait For Both')
    if merge_node['parameters'].get('mode') == 'combine':
        merge_node['parameters']['mode'] = 'append'
        # Remove combinationMode since it's not used with append
        if 'combinationMode' in merge_node['parameters']:
            del merge_node['parameters']['combinationMode']
        fixes += 1
        print(f"  Fixed C2: Merge mode changed from combine/multiplex to append")

    save_workflow(wf, path)
    print(f"  Total fixes: {fixes}")
    return fixes

def fix_reel_assembler():
    print("\n=== Fixing WF-THT-REEL ===")
    wf, path = load_workflow('tht-reel-assembler.json')
    fixes = 0

    # C1: Pre-flight Check - .fields['X'] → ['X'] and .json.fields → .json
    node = find_node(wf, 'Code — Pre-flight Check')
    code = node['parameters']['jsCode']
    replacements = [
        (".json.fields['Phase Number']", ".json['Phase Number']"),
        (".json.fields['Drive File ID']", ".json['Drive File ID']"),
        (".json.fields['Drive URL']", ".json['Drive URL']"),
        (".json.fields['Phase Label']", ".json['Phase Label']"),
        # The reelRecord and project references
        ("reelRecord.fields['Music Track']", "reelRecord['Music Track']"),
        ("project.fields['Brand Name']", "project['Brand Name']"),
        ("project.fields['Project Name']", "project['Project Name']"),
    ]
    for old, new in replacements:
        count = code.count(old)
        if count > 0:
            code = code.replace(old, new)
            fixes += count
            print(f"  Fixed C1: {old} → {new} ({count} occurrences)")

    # Also check for pattern: .fields. (dot access)
    # e.g. reelRecord.fields.something
    more_replacements = [
        ("r.json.fields['", "r.json['"),
    ]
    for old, new in more_replacements:
        count = code.count(old)
        if count > 0:
            code = code.replace(old, new)
            fixes += count
            print(f"  Fixed C1: {old} → {new} ({count} occurrences)")

    node['parameters']['jsCode'] = code

    # C2: Merge node - same fix as VIDEO
    try:
        merge_node = find_node(wf, 'Merge — Wait For Both')
        if merge_node['parameters'].get('mode') == 'combine':
            merge_node['parameters']['mode'] = 'append'
            if 'combinationMode' in merge_node['parameters']:
                del merge_node['parameters']['combinationMode']
            fixes += 1
            print(f"  Fixed: Merge mode changed from combine/multiplex to append")
    except ValueError:
        print(f"  ⚠️  No Merge node found")

    # C3: Google Drive Upload Reel - $json.brandName → explicit reference
    node = find_node(wf, 'Google Drive — Upload Reel')
    params = node['parameters']
    name_val = params.get('name', '')
    if '$json.brandName' in name_val:
        new_name = name_val.replace(
            '$json.brandName',
            "$('Code — Check Validation').first().json.brandName"
        )
        params['name'] = new_name
        fixes += 1
        print(f"  Fixed C3: Drive Upload filename now references Code — Check Validation")

    save_workflow(wf, path)
    print(f"  Total fixes: {fixes}")
    return fixes

def main():
    print("=" * 60)
    print("THT Workflow Fix Round 2 — Airtable v2.1 .fields Bug")
    print("=" * 60)

    total = 0
    total += fix_prompt_generator()
    total += fix_image_generator()
    total += fix_video_generator()
    total += fix_reel_assembler()

    print(f"\n{'=' * 60}")
    print(f"TOTAL FIXES APPLIED: {total}")
    print(f"{'=' * 60}")

    if total == 0:
        print("⚠️  No fixes needed — all patterns may already be correct")
        sys.exit(0)
    else:
        print(f"✅ {total} fixes applied. Run deployment script to push to n8n.")

if __name__ == '__main__':
    main()
