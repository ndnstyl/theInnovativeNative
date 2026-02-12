# n8n Pattern Library

**Owner**: Neo (n8n Workflows)
**Purpose**: Reusable workflow patterns extracted from active and deprecated workflows
**Last Updated**: 2026-02-05

## Pattern Categories

| Category | Workflows | Active | Key Sources |
|----------|-----------|--------|-------------|
| FFmpeg/Video | 31 | 5 | BodyCam Bandits, Reels, Viral Clipping |
| Enrichment | 17 | 9 | UK Local Services (client project) |
| Social Publishing | 11 | 3 | X, Instagram, LinkedIn tools |
| Graphics | 9 | 6 | Nano/Banano image tools |
| RAG/AI Agents | 27 | 8 | Content/Email/Calendar Agents |
| CRM/Pipeline | 9 | 8 | GovCon, Hubspot |
| Sync/ETL | 4 | 2 | RSS, Airtable sync |
| Other | 50+ | 6 | Rize, SEO, misc |

## Directory Structure

```
.specify/patterns/
├── README.md                                    # This file
├── PATTERN-TEMPLATE.md                          # Template for new patterns
├── ffmpeg/
│   └── bodycam-video-processing.md              # Multi-stage FFmpeg pipeline
├── enrichment/
│   └── uk-local-business-enrichment.md          # Batch data enrichment
├── social/
│   └── crypto-social-distribution.md            # Image distribution to social
└── graphics/
    └── create-image-tool.md                     # AI image generation
```

## How to Use This Library

### For Neo (Building New Workflows)
1. Check this library BEFORE building from scratch
2. Copy reusable node configurations
3. Reference source workflows for full context
4. Add new patterns after building successful workflows

### For Other Agents
1. Reference when requesting n8n work from Neo
2. Specify which patterns to use: "Use the multi-platform-posting pattern"
3. Reduces rebuild time and errors

## Pattern Documentation Template

Each pattern file should include:

```markdown
# Pattern Name

## Source
- **Workflow ID**: xxx
- **Workflow Name**: xxx
- **Status**: Active/Deprecated/Archived

## Use Case
When to use this pattern...

## Key Nodes
1. Node type - purpose
2. Node type - purpose

## Configuration
Required credentials, environment variables, etc.

## Reusable JSON
```json
{exportable node config}
```

## Integration Points
How this connects to other patterns or systems.

## Gotchas
Known issues or edge cases.
```

## Priority Extraction Queue

### High Priority (Tier 1 - This Week)
- [ ] Social Publishing multi-platform pattern
- [ ] Graphics image combination pattern
- [ ] Rize time tracking pattern

### Medium Priority (Tier 2 - Next Week)
- [ ] FFmpeg video transcoding (from BodyCam)
- [ ] Enrichment scoring/validation (from UK Local Services)
- [ ] RAG agent template pattern

### Low Priority (As Time Permits)
- [ ] CRM pipeline patterns (GovCon)
- [ ] Deprecated workflow cleanup

## Quick Reference

### Most Reusable Patterns
1. **Multi-platform social posting** - Posts to Instagram, X, LinkedIn, TikTok
2. **Image combination** - Nano/Banano image merging
3. **FFmpeg video processing** - Transcoding, clipping, editing
4. **Data enrichment pipeline** - Batch process → Enrich → Score → Validate
5. **RSS ingestion** - Feed monitoring and processing

### Pattern Extraction Status (Updated 2026-02-05)
- FFmpeg: 3% (1/31) - bodycam-video-processing.md complete
- Enrichment: 6% (1/17) - uk-local-business-enrichment.md complete
- Social: 9% (1/11) - crypto-social-distribution.md complete
- Graphics: 11% (1/9) - create-image-tool.md complete

**Total Patterns Documented**: 4 of 20+ target (SC-006)
