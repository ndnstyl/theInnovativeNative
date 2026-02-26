#!/usr/bin/env python3
"""
Pipeline V2 Update: 8 images, 4 Veo 3.1 videos, first+last frame interpolation.

Changes:
  PROMPT: 8 image + 4 video phases in Gemini system prompt; parse expects 8+4
  IMAGE:  "Check All Complete" expects 8 images
  VIDEO:  Veo 3.1 endpoint, FIRST_AND_LAST_FRAMES_2_VIDEO, pairs (1,2)(3,4)(5,6)(7,8)
  REEL:   4 clips, 3 crossfades, shorter total duration
"""

import json
import os
import sys

WORKFLOW_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'n8n-workflows')

def load_workflow(filename):
    path = os.path.join(WORKFLOW_DIR, filename)
    with open(path, 'r') as f:
        return json.load(f), path

def save_workflow(data, path):
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"  Saved: {path}")

def find_node(workflow, name):
    for node in workflow['nodes']:
        if node['name'] == name:
            return node
    raise ValueError(f"Node '{name}' not found")

# ============================================================
# WF-THT-PROMPT
# ============================================================
def update_prompt_generator():
    print("\n=== Updating WF-THT-PROMPT ===")
    wf, path = load_workflow('tht-prompt-generator.json')
    fixes = 0

    # 1. Replace Build Gemini Prompt code entirely
    node = find_node(wf, 'Code — Build Gemini Prompt')
    node['parameters']['jsCode'] = r'''// Build Gemini prompt for brand timelapse — V2: 8 images, 4 videos
const project = $('Airtable — Fetch Project').first().json;
const brandName = project['Brand Name'];
const brandConcept = project['Brand Concept'];

const systemPrompt = `You are a hyper-realistic architectural construction timelapse prompt engineer.

You generate structured image and video prompts for AI image/video generation tools.
All prompts describe a SINGLE iconic brand building being constructed from raw land to full activation.

## GLOBAL RULES — Apply to EVERY image prompt:
- Fixed drone-level viewpoint: ~100 feet altitude, 30-40 degree downward angle, static camera
- Same plot of land, same camera position, same lens across ALL 8 images (except Image 8 which is a push-in detail shot)
- 9:16 vertical aspect ratio (portrait orientation)
- HYPER-REALISTIC and PHOTOREALISTIC — NOT cartoonish, NOT cel-shaded, NOT stylized
- Architecturally sound with real physics — structures must look constructionally plausible
- Consistent dusk/blue-hour lighting across all images
- The brand's recognizable visual elements (logo, colors, structural style) incorporated naturally

## IMAGE PHASES (8 total — paired as start+end for 4 video stages):

### Stage 1: Earth to Foundation
1. **Excavated Lot** — Empty excavated dirt lot. Construction fencing around perimeter. Bulldozers, dump trucks, workers in hard hats. Raw exposed earth, no vegetation in center. Same surrounding trees/landscape that will appear in the final image.
2. **Construction Starting** — Foundation concrete visible. Rebar grid and structural base emerging from ground. Crane base installed at center. Construction materials staged. First signs of the building footprint taking shape.

### Stage 2: Building Rises
3. **Mid Construction** — Steel/concrete framework rising to ~40-50% of final height. Scaffolding wrapping the structure. Glass/cladding panels beginning on lower floors. Multiple cranes active. The brand's architectural form becoming recognizable in the skeleton.
4. **Structure Nearly Complete** — Building at ~85-90%. Most exterior cladding/glass installed. Brand's signature architectural features clearly visible. Scaffolding still on upper portions. Surrounding site work (driveways, walkways) being laid.

### Stage 3: Polish and Finish
5. **Detail & Finishing** — Scaffolding removed from most areas. Workers doing exterior finishing — cleaning glass, installing trim, mounting signage hardware. Some panels or details still incomplete. Close to done but not pristine. The building's form is complete.
6. **Fully Polished** — Building 100% complete. Every surface clean and finished. Brand signage/logo elements mounted but NOT illuminated. No cars, no people, no interior lights. Empty surroundings. Pure architectural beauty in natural light.

### Stage 4: Activation & Reveal
7. **Coming to Life** — Same wide drone viewpoint. Building complete. Interior lights beginning to glow warm through windows. Dusk sky deepening. The first signs of activation — a few cars appearing, exterior lighting warming up. Setting the stage for the grand reveal.
8. **Iconic Brand Reveal (PUSH-IN)** — CAMERA MOVES: slow push-in toward the building's most iconic brand element (the logo, the signature architectural feature). Full activation — all lights blazing, cars in lot, people at entrance, landscaping lush and mature. The brand symbol is the hero of the shot. This is the money shot.

## VIDEO TRANSITION PROMPTS (4 total):
Each video uses Veo 3.1 first+last frame interpolation. The model receives the start image and end image and generates smooth motion between them. The prompt describes WHAT HAPPENS during the transition.

- Videos 1-3: Camera remains COMPLETELY STATIC (same drone position)
- Video 4: Camera performs a slow, cinematic PUSH-IN toward the brand symbol
- All motion must be gradual, physically realistic — construction workers moving, cranes operating, materials being placed
- NO teleportation, NO snapping, NO time-lapse jitter

## OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "images": [
    { "phase": 1, "label": "Excavated Lot", "prompt": "..." },
    { "phase": 2, "label": "Construction Starting", "prompt": "..." },
    { "phase": 3, "label": "Mid Construction", "prompt": "..." },
    { "phase": 4, "label": "Structure Nearly Complete", "prompt": "..." },
    { "phase": 5, "label": "Detail and Finishing", "prompt": "..." },
    { "phase": 6, "label": "Fully Polished", "prompt": "..." },
    { "phase": 7, "label": "Coming to Life", "prompt": "..." },
    { "phase": 8, "label": "Iconic Brand Reveal", "prompt": "..." }
  ],
  "videos": [
    { "phase": 1, "label": "Excavated Lot to Construction Starting", "prompt": "..." },
    { "phase": 2, "label": "Mid Construction to Structure Nearly Complete", "prompt": "..." },
    { "phase": 3, "label": "Detail and Finishing to Fully Polished", "prompt": "..." },
    { "phase": 4, "label": "Coming to Life to Iconic Brand Reveal", "prompt": "..." }
  ]
}

Each prompt should be 3-5 sentences of vivid, specific, cinematic description. Include the brand name and recognizable brand elements in every prompt. Image prompts should describe a STILL PHOTOGRAPH. Video prompts should describe MOTION and ACTIVITY.`;

const userPrompt = "Generate construction timelapse prompts for: " + brandName + "\n\nArchitectural Concept: " + brandConcept + "\n\nGenerate all 8 image prompts and 4 video transition prompts following the rules above. Make the building unmistakably " + brandName + " — incorporate their logo, signature colors, and architectural style naturally into a hyper-realistic construction sequence.";

return [{
  json: {
    prompt: userPrompt,
    systemPrompt: systemPrompt,
    brandName: brandName,
    brandConcept: brandConcept,
    projectRecordId: $('Airtable — Fetch Project').first().json.id
  }
}];'''
    fixes += 1
    print("  Updated: Build Gemini Prompt (8 images + 4 videos)")

    # 2. Replace Parse Prompt JSON code
    node = find_node(wf, 'Code — Parse Prompt JSON')
    node['parameters']['jsCode'] = r'''// Parse Gemini structured JSON response — V2: 8 images + 4 videos = 12 records
const geminiResponse = $input.first().json;
const projectRecordId = $('Code — Build Gemini Prompt').first().json.projectRecordId;
const brandName = $('Code — Build Gemini Prompt').first().json.brandName;

try {
  const rawText = geminiResponse.candidates[0].content.parts[0].text;
  const data = typeof rawText === 'object' ? rawText : JSON.parse(rawText);

  if (!data.images || data.images.length !== 8) {
    throw new Error(`Expected 8 image prompts, got ${data.images ? data.images.length : 0}`);
  }
  if (!data.videos || data.videos.length !== 4) {
    throw new Error(`Expected 4 video prompts, got ${data.videos ? data.videos.length : 0}`);
  }

  const records = [];

  for (const img of data.images) {
    records.push({
      json: {
        projectRecordId,
        phaseNumber: img.phase,
        assetType: 'image',
        phaseLabel: img.label,
        promptLabel: `${brandName} - Phase ${img.phase} (image)`,
        promptText: img.prompt,
        brandName
      }
    });
  }

  for (const vid of data.videos) {
    records.push({
      json: {
        projectRecordId,
        phaseNumber: vid.phase,
        assetType: 'video',
        phaseLabel: vid.label,
        promptLabel: `${brandName} - Phase ${vid.phase} (video)`,
        promptText: vid.prompt,
        brandName
      }
    });
  }

  return records;
} catch (error) {
  return [{
    json: {
      projectRecordId,
      parseError: true,
      errorMessage: `Failed to parse Gemini response: ${error.message}`
    }
  }];
}'''
    fixes += 1
    print("  Updated: Parse Prompt JSON (expects 8+4)")

    save_workflow(wf, path)
    return fixes


# ============================================================
# WF-THT-IMAGE
# ============================================================
def update_image_generator():
    print("\n=== Updating WF-THT-IMAGE ===")
    wf, path = load_workflow('tht-image-generator.json')
    fixes = 0

    # Update Check All Complete message
    node = find_node(wf, 'Code — Check All Complete')
    node['parameters']['jsCode'] = r'''// All 8 images processed — user review gate handles partial failures
const projectRecordId = $('Airtable — Fetch Project').first().json.id;
return [{
  json: {
    projectRecordId,
    message: 'All 8 image prompts processed — user will review before approval'
  }
}];'''
    fixes += 1
    print("  Updated: Check All Complete (8 images)")

    save_workflow(wf, path)
    return fixes


# ============================================================
# WF-THT-VIDEO
# ============================================================
def update_video_generator():
    print("\n=== Updating WF-THT-VIDEO ===")
    wf, path = load_workflow('tht-video-generator.json')
    fixes = 0

    # 1. Build Video Jobs — pair (1,2), (3,4), (5,6), (7,8) with BOTH image URLs
    node = find_node(wf, 'Code — Build Video Jobs')
    node['parameters']['jsCode'] = r'''// V2: Build video jobs — pair images (1,2), (3,4), (5,6), (7,8) for Veo 3.1 first+last frame
const imageRecords = $('Airtable — Fetch Image Records').all();
const videoPrompts = $('Airtable — Fetch Video Prompts').all();

if (imageRecords.length < 8) {
  throw new Error(`Expected 8 image records, found ${imageRecords.length}`);
}
if (videoPrompts.length < 4) {
  throw new Error(`Expected 4 video prompts, found ${videoPrompts.length}`);
}

// Sort by phase number
const images = imageRecords.sort((a, b) => a.json['Phase Number'] - b.json['Phase Number']);
const videos = videoPrompts.sort((a, b) => a.json['Phase Number'] - b.json['Phase Number']);

// Pair images: (1,2), (3,4), (5,6), (7,8) → 4 video jobs
const jobs = [];
for (let i = 0; i < 4; i++) {
  const startImage = images[i * 2];      // Images 0,2,4,6 (phases 1,3,5,7)
  const endImage = images[i * 2 + 1];    // Images 1,3,5,7 (phases 2,4,6,8)
  const videoPrompt = videos[i];

  const startDriveId = startImage.json['Drive File ID'];
  const endDriveId = endImage.json['Drive File ID'];
  const startUrl = `https://drive.google.com/uc?export=download&confirm=t&id=${startDriveId}`;
  const endUrl = `https://drive.google.com/uc?export=download&confirm=t&id=${endDriveId}`;

  jobs.push({
    json: {
      videoRecordId: videoPrompt.json.id,
      phaseNumber: videoPrompt.json['Phase Number'],
      phaseLabel: videoPrompt.json['Phase Label'],
      promptText: videoPrompt.json['Prompt Text'],
      startImageUrl: startUrl,
      endImageUrl: endUrl,
      startImageDriveId: startDriveId,
      endImageDriveId: endDriveId,
      startPhase: startImage.json['Phase Label'],
      endPhase: endImage.json['Phase Label']
    }
  });
}

return jobs;'''
    fixes += 1
    print("  Updated: Build Video Jobs (paired 1,2 / 3,4 / 5,6 / 7,8)")

    # 2. Rename and rewrite Build Kling Payload → Build Veo3 Payload
    node = find_node(wf, 'Code — Build Kling Payload')
    node['name'] = 'Code — Build Veo3 Payload'
    node['parameters']['jsCode'] = r'''// V2: Build Kie.AI Veo 3.1 payload — first+last frame interpolation
const item = $input.first().json;

const payload = {
  prompt: item.promptText,
  imageUrls: [
    item.startImageUrl,
    item.endImageUrl
  ],
  model: 'veo3',
  generationType: 'FIRST_AND_LAST_FRAMES_2_VIDEO',
  aspect_ratio: '9:16'
};

return [{
  json: {
    payload,
    recordId: item.videoRecordId,
    phaseNumber: item.phaseNumber,
    phaseLabel: item.phaseLabel
  }
}];'''
    fixes += 1
    print("  Updated: Build Veo3 Payload (was Build Kling Payload)")

    # 3. Update HTTP CreateTask URL for Veo 3.1
    node = find_node(wf, 'HTTP Request — Kie.AI CreateTask')
    node['parameters']['url'] = 'https://api.kie.ai/api/v1/veo/generate'
    # Update the jsonBody reference to new node name
    node['parameters']['jsonBody'] = "={{ JSON.stringify($('Code — Build Veo3 Payload').first().json.payload) }}"
    fixes += 1
    print("  Updated: HTTP CreateTask URL → Veo 3.1 endpoint")

    # 4. Update Check All Complete
    node = find_node(wf, 'Code — Check All Complete')
    node['parameters']['jsCode'] = r'''// All 4 Veo 3.1 videos processed — user review gate handles partial failures
const projectRecordId = $('Airtable — Fetch Project').first().json.id;
return [{
  json: {
    projectRecordId,
    message: 'All 4 Veo 3.1 videos processed — user will review before approval'
  }
}];'''
    fixes += 1
    print("  Updated: Check All Complete (4 videos)")

    # 5. Update all connections that reference the old node name
    for conn_name, conn_data in wf.get('connections', {}).items():
        for output_idx, output_conns in conn_data.items():
            for conn_list in output_conns:
                for conn in conn_list:
                    if conn.get('node') == 'Code — Build Kling Payload':
                        conn['node'] = 'Code — Build Veo3 Payload'
    # Also update connections FROM the renamed node
    if 'Code — Build Kling Payload' in wf.get('connections', {}):
        wf['connections']['Code — Build Veo3 Payload'] = wf['connections'].pop('Code — Build Kling Payload')
    fixes += 1
    print("  Updated: All connections referencing Build Kling Payload → Build Veo3 Payload")

    # 6. Update Store Task ID to reference new node name
    node = find_node(wf, 'Code — Store Task ID')
    old_code = node['parameters']['jsCode']
    new_code = old_code.replace('Build Kling Payload', 'Build Veo3 Payload')
    if new_code != old_code:
        node['parameters']['jsCode'] = new_code
        fixes += 1
        print("  Updated: Store Task ID references → Build Veo3 Payload")

    save_workflow(wf, path)
    return fixes


# ============================================================
# WF-THT-REEL
# ============================================================
def update_reel_assembler():
    print("\n=== Updating WF-THT-REEL ===")
    wf, path = load_workflow('tht-reel-assembler.json')
    fixes = 0

    # 1. Pre-flight Check — expect 4 videos
    node = find_node(wf, 'Code — Pre-flight Check')
    node['parameters']['jsCode'] = r'''// V2: Pre-flight check — 4 Veo 3.1 clips + music
const videoRecords = $('Airtable — Fetch Video Records').all();
const reelRecord = $('Airtable — Fetch Reel Record').first().json;
const project = $('Airtable — Fetch Project').first().json;
const projectId = project.id.replace(/[^a-zA-Z0-9]/g, '');

// Validate 4 video records (was 5)
if (videoRecords.length < 4) {
  throw new Error(`Expected 4 video records, found ${videoRecords.length}`);
}

// Sort by phase number
const sorted = videoRecords.sort((a, b) =>
  a.json['Phase Number'] - b.json['Phase Number']
);

// Extract Drive File IDs for 4 clips
const driveFileIds = sorted.map(r => r.json['Drive File ID']);
for (let i = 0; i < 4; i++) {
  if (!driveFileIds[i]) {
    throw new Error(`Video ${i + 1} missing Drive File ID`);
  }
}

// Get music track selection
const musicTrack = reelRecord['Music Track'] || 'swing_pop';

const musicDriveIds = {
  'swing_pop': '1Wx2Je-Ohtl9Wwk8Ga4J8IXn-IP58JpVV',
  'ambient_build': '1BGL2u2ZQl9LROg5-6vpWAvvU-B8NX-XW',
  'cinematic_progress': '16Li5bzMLaLvAZSbDJ9tePfBgB-qNlhuz'
};

const musicDriveId = musicDriveIds[musicTrack];
if (!musicDriveId || musicDriveId.startsWith('REPLACE')) {
  throw new Error(`Music track '${musicTrack}' Drive ID not configured`);
}

const workDir = `/tmp/tht-${projectId}`;

return [{
  json: {
    workDir,
    projectId,
    projectRecordId: project.id,
    reelRecordId: reelRecord.id,
    driveFileIds,
    musicDriveId,
    musicTrack,
    brandName: project['Brand Name'],
    clipCount: 4
  }
}];'''
    fixes += 1
    print("  Updated: Pre-flight Check (4 videos)")

    # 2. Update Build Download Commands — download 4 clips + music
    node = find_node(wf, 'Code — Build Download Commands')
    old_code = node['parameters']['jsCode']
    # Replace the loop that builds download commands for 5 clips
    node['parameters']['jsCode'] = r'''// V2: Download 4 video clips + music file from Google Drive
const data = $('Code — Pre-flight Check').first().json;
const workDir = data.workDir;
const driveFileIds = data.driveFileIds;
const musicDriveId = data.musicDriveId;

// Build download commands for 4 clips + 1 music file
const downloads = [];
for (let i = 0; i < driveFileIds.length; i++) {
  const fileId = driveFileIds[i];
  const outFile = `${workDir}/clip_${i + 1}.mp4`;
  // BUG-6 FIX: confirm=t bypasses Google virus scan page
  downloads.push(
    `curl -L -o ${outFile} "https://drive.google.com/uc?export=download&confirm=t&id=${fileId}" && ` +
    `file ${outFile} | grep -qv 'HTML' || (echo "FAIL: clip_${i + 1} is HTML" && exit 1)`
  );
}

// Download music
downloads.push(
  `curl -L -o ${workDir}/music.mp3 "https://drive.google.com/uc?export=download&confirm=t&id=${musicDriveId}" && ` +
  `file ${workDir}/music.mp3 | grep -qv 'HTML' || (echo "FAIL: music is HTML" && exit 1)`
);

const downloadCmd = downloads.join(' && ');

return [{
  json: {
    downloadCmd,
    workDir,
    projectRecordId: data.projectRecordId,
    reelRecordId: data.reelRecordId,
    brandName: data.brandName,
    clipCount: data.clipCount
  }
}];'''
    fixes += 1
    print("  Updated: Build Download Commands (4 clips)")

    # 3. Update Build Normalize Commands — normalize 4 clips
    node = find_node(wf, 'Code — Build Normalize Commands')
    node['parameters']['jsCode'] = r'''// V2: Normalize 4 clips to 1080x1920 30fps h264
const workDir = $('Code — Build Download Commands').first().json.workDir;
const clipCount = $('Code — Build Download Commands').first().json.clipCount || 4;

const cmds = [];
for (let i = 1; i <= clipCount; i++) {
  cmds.push(
    `ffmpeg -y -i ${workDir}/clip_${i}.mp4 ` +
    `-vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" ` +
    `-r 30 -c:v libx264 -crf 18 -pix_fmt yuv420p -an ${workDir}/norm_${i}.mp4`
  );
}
const normalizeCmd = cmds.join(' && ');

return [{
  json: {
    normalizeCmd,
    workDir
  }
}];'''
    fixes += 1
    print("  Updated: Build Normalize Commands (4 clips)")

    # 4. Build Stitch Command — 4 clips, 3 crossfades
    node = find_node(wf, 'Code — Build Stitch Command')
    node['parameters']['jsCode'] = r'''// V2: FFMPEG stitch 4 clips with 3 crossfades + music
// Veo 3.1 clips are ~8s each
// Offsets: clip1_dur - fade = 7.5, then 7.5+8-0.5=15.0, then 15.0+8-0.5=22.5
const workDir = $('Code — Build Download Commands').first().json.workDir;

const filterComplex = [
  '[0:v][1:v]xfade=transition=fade:duration=0.5:offset=7.5[v01]',
  '[v01][2:v]xfade=transition=fade:duration=0.5:offset=15.0[v012]',
  '[v012][3:v]xfade=transition=fade:duration=0.5:offset=22.5[vfinal]',
  '[4:a]volume=0.4,afade=t=in:st=0:d=1,afade=t=out:st=28:d=1.5[afinal]'
].join(';');

const ffmpegCmd = `ffmpeg -y ` +
  `-i ${workDir}/norm_1.mp4 ` +
  `-i ${workDir}/norm_2.mp4 ` +
  `-i ${workDir}/norm_3.mp4 ` +
  `-i ${workDir}/norm_4.mp4 ` +
  `-i ${workDir}/music.mp3 ` +
  `-filter_complex "${filterComplex}" ` +
  `-map "[vfinal]" -map "[afinal]" ` +
  `-c:v libx264 -crf 18 -profile:v main -level 4.1 ` +
  `-r 30 -pix_fmt yuv420p ` +
  `-c:a aac -b:a 128k ` +
  `-movflags +faststart ` +
  `-shortest ` +
  `${workDir}/reel_final.mp4`;

return [{
  json: {
    ffmpegCmd,
    workDir
  }
}];'''
    fixes += 1
    print("  Updated: Build Stitch Command (4 clips, 3 crossfades, ~30s total)")

    save_workflow(wf, path)
    return fixes


# ============================================================
# MAIN
# ============================================================
def main():
    print("=" * 60)
    print("THT Pipeline V2: 8 Images + 4 Veo 3.1 Videos")
    print("=" * 60)

    total = 0
    total += update_prompt_generator()
    total += update_image_generator()
    total += update_video_generator()
    total += update_reel_assembler()

    print(f"\n{'=' * 60}")
    print(f"TOTAL UPDATES: {total}")
    print(f"{'=' * 60}")

if __name__ == '__main__':
    main()
