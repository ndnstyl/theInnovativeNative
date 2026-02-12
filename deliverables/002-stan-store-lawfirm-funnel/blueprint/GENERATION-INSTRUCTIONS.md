# Automated Law Firm Blueprint - Generation Instructions

## Overview
This directory contains 6 Python scripts to generate a 30-slide presentation branded for The Innovative Native.

## File Structure
```
blueprint/
├── GENERATION-INSTRUCTIONS.md   (this file)
├── generate-batch1.py            (slides 1-5)
├── generate-batch2.py            (slides 6-10)
├── generate-batch3.py            (slides 11-15)
├── generate-batch4.py            (slides 16-20)
├── generate-batch5.py            (slides 21-25)
├── generate-batch6.py            (slides 26-30)
└── combine-all.py                (combines all parts into final PPTX)
```

## Generation Steps

### Step 1: Install Dependencies
```bash
# Ensure python-pptx is installed
uv run --with python-pptx==1.0.2 python -c "import pptx; print('Ready')"
```

### Step 2: Generate Each Batch
Run each batch script in order:

```bash
cd /Users/makwa/theinnovativenative/deliverables/002-stan-store-lawfirm-funnel/blueprint

# Batch 1 (Slides 1-5)
uv run --with python-pptx==1.0.2 python generate-batch1.py

# Batch 2 (Slides 6-10)
uv run --with python-pptx==1.0.2 python generate-batch2.py

# Batch 3 (Slides 11-15)
uv run --with python-pptx==1.0.2 python generate-batch3.py

# Batch 4 (Slides 16-20)
uv run --with python-pptx==1.0.2 python generate-batch4.py

# Batch 5 (Slides 21-25)
uv run --with python-pptx==1.0.2 python generate-batch5.py

# Batch 6 (Slides 26-30)
uv run --with python-pptx==1.0.2 python generate-batch6.py
```

### Step 3: Combine Into Final Presentation
```bash
uv run --with python-pptx==1.0.2 python combine-all.py
```

This will:
- Combine all 6 part files into `automated-lawfirm-blueprint.pptx`
- Delete the individual part files (part1.pptx through part6.pptx)
- Preserve proper slide backgrounds throughout (critical bug fix applied)

### Step 4: Verify Output
```bash
ls -lh automated-lawfirm-blueprint.pptx
```

Expected output: A single PPTX file, approximately 200-400KB in size, containing 30 slides.

## Slide Plan (30 slides total)

**Batch 1 (Slides 1-5)**
1. Title Slide: "The Automated Law Firm Blueprint"
2. Content Slide: What This Is / What This Is Not (disclaimer)
3. Section Break: "Section 1: The $100K Problem"
4. Stats Slide: Revenue loss breakdown
5. Two-Column Slide: Before vs After automation

**Batch 2 (Slides 6-10)**
6. Section Break: "Section 2: The Automated Intake Engine"
7. Floating-Cards Slide: 3 intake problems
8. Multi-Card Slide: Intake automation architecture
9. Two-Column Slide: Practice-area intake differences
10. Section Break: "Section 3: Document Assembly System"

**Batch 3 (Slides 11-15)**
11. Multi-Card Slide: Document automation components
12. Stats Slide: Time savings per practice area
13. Section Break: "Section 4: Deadline & Compliance Engine"
14. Floating-Cards Slide: Compliance requirements by practice area
15. Section Break: "Section 5: Client Communication Hub"

**Batch 4 (Slides 16-20)**
16. Multi-Card Slide: Communication automation touchpoints
17. Quote Slide: Key insight about client communication
18. Section Break: "Section 6: The Billing Machine"
19. Stats Slide: Billing recovery metrics
20. Two-Column Slide: Manual billing vs automated billing

**Batch 5 (Slides 21-25)**
21. Section Break: "Section 7: Faceless Marketing Engine"
22. Floating-Cards Slide: Marketing automation components
23. Multi-Card Slide: Content pipeline architecture
24. Section Break: "Section 8: Integration Architecture"
25. Bold-Diagonal Slide: Full system architecture overview

**Batch 6 (Slides 26-30)**
26. Corner-Anchor Slide: Integration stack layers
27. Section Break: "Section 9: Implementation Roadmap"
28. Giant-Focus Slide: "90 Days to Automation"
29. Stats Slide: ROI projections by practice area
30. Closing Slide: CTA — Book diagnostic call + ROI calculator

## Brand System (Applied Throughout)
- **Background**: #0A0A14 (deep navy)
- **Background Alt**: #12121F
- **Text Primary**: #F5F5F5 (off-white)
- **Text Secondary**: #B8B8C8 (muted gray)
- **Accent Cyan**: #00FFFF
- **Accent Magenta**: #FF00FF
- **Heading Font**: Playfair Display (700)
- **Body Font**: Inter (400)

## Critical Technical Notes

### Background Bug Fix
Every slide explicitly sets `slide.background.fill.solid()` and `slide.background.fill.fore_color.rgb` to prevent PowerPoint's default white background from appearing.

### Font Fallback
If Playfair Display or Inter are not installed on your system:
- Playfair Display will fall back to Georgia
- Inter will fall back to Arial

For best results, install these fonts before generating.

### Combining Script Safety
The `combine-all.py` script includes the critical background fix when merging slides. Without this, slides 6-30 would have white backgrounds even if the individual part files are correct.

## Troubleshooting

**Issue**: Slides have white backgrounds
**Solution**: Ensure each batch script ran successfully and the combining script applied backgrounds

**Issue**: Missing fonts
**Solution**: Install Playfair Display and Inter, or accept fallback fonts

**Issue**: Part files not deleted after combining
**Solution**: Check file permissions in the blueprint directory

## Next Steps After Generation

1. Open `automated-lawfirm-blueprint.pptx` in PowerPoint/Keynote
2. Review all 30 slides for accuracy
3. Make any final brand adjustments if needed
4. Export to PDF for distribution if required
5. Upload to Stan Store as the $97 digital product

## Success Criteria

- [x] 30 slides generated
- [x] All slides have proper brand colors (#0A0A14 background)
- [x] 8+ distinct layout types used across presentation
- [x] Visual layouts (cards, stats, columns) dominate (60%+)
- [x] Section breaks properly divide content (9 sections)
- [x] Final file is <5MB in size
- [x] No duplicate titles
- [x] Consistent typography and spacing
