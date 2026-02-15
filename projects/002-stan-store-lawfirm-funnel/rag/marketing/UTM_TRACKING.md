# Law Firm RAG - UTM Tracking Documentation

**Project**: Law Firm RAG Content Campaign (Cerebro)
**Created**: 2026-02-04
**Owner**: Neo (Automation)
**Task**: T003 - Implement UTM tracking on all campaign links

---

## Base URL

```
https://theinnovativenative.com/law-firm-rag
```

---

## UTM Parameter Reference

| Channel | utm_source | utm_medium | utm_campaign | utm_content (optional) |
|---------|------------|------------|--------------|------------------------|
| LinkedIn Posts | linkedin | social | lfr-launch-q1 | post-1, post-2, etc. |
| Cold Email | outreach | email | lfr-pilot-q1 | hook-time, hook-risk, etc. |
| Direct URL | direct | landing | lfr-q1 | - |
| Slide Deck QR | slidedeck | qr | lfr-sales-q1 | - |
| Video CTA | video | embed | lfr-video-q1 | video-30s, video-15s, etc. |

---

## Complete Trackable URLs

### 1. LinkedIn Posts

**Post 1 - Problem-Focused (AI Hallucination)**
```
https://theinnovativenative.com/law-firm-rag?utm_source=linkedin&utm_medium=social&utm_campaign=lfr-launch-q1&utm_content=post-1-problem
```

**Post 2 - Social Proof-Focused (Harvey/Copilot ROI)**
```
https://theinnovativenative.com/law-firm-rag?utm_source=linkedin&utm_medium=social&utm_campaign=lfr-launch-q1&utm_content=post-2-social-proof
```

**Post 3 - Technical Credibility (RAG vs GPT)**
```
https://theinnovativenative.com/law-firm-rag?utm_source=linkedin&utm_medium=social&utm_campaign=lfr-launch-q1&utm_content=post-3-technical
```

**Post 4 - Knowledge Walks Out the Door**
```
https://theinnovativenative.com/law-firm-rag?utm_source=linkedin&utm_medium=social&utm_campaign=lfr-launch-q1&utm_content=post-4-knowledge-loss
```

**Post 5 - Authority Hierarchy**
```
https://theinnovativenative.com/law-firm-rag?utm_source=linkedin&utm_medium=social&utm_campaign=lfr-launch-q1&utm_content=post-5-authority
```

**Post 6 - Cost/Pricing Question**
```
https://theinnovativenative.com/law-firm-rag?utm_source=linkedin&utm_medium=social&utm_campaign=lfr-launch-q1&utm_content=post-6-cost
```

---

### 2. Cold Email Campaigns

**Hook 1 - Time-Based**
```
https://theinnovativenative.com/law-firm-rag?utm_source=outreach&utm_medium=email&utm_campaign=lfr-pilot-q1&utm_content=hook-time
```

**Hook 2 - Risk-Based**
```
https://theinnovativenative.com/law-firm-rag?utm_source=outreach&utm_medium=email&utm_campaign=lfr-pilot-q1&utm_content=hook-risk
```

**Hook 3 - Social Proof**
```
https://theinnovativenative.com/law-firm-rag?utm_source=outreach&utm_medium=email&utm_campaign=lfr-pilot-q1&utm_content=hook-social-proof
```

**Hook 4 - Scarcity**
```
https://theinnovativenative.com/law-firm-rag?utm_source=outreach&utm_medium=email&utm_campaign=lfr-pilot-q1&utm_content=hook-scarcity
```

**Hook 5 - Loss Aversion**
```
https://theinnovativenative.com/law-firm-rag?utm_source=outreach&utm_medium=email&utm_campaign=lfr-pilot-q1&utm_content=hook-loss-aversion
```

---

### 3. Direct Landing Page

**Standard Direct URL**
```
https://theinnovativenative.com/law-firm-rag?utm_source=direct&utm_medium=landing&utm_campaign=lfr-q1
```

---

### 4. Slide Deck QR Code

**Sales Presentation QR**
```
https://theinnovativenative.com/law-firm-rag?utm_source=slidedeck&utm_medium=qr&utm_campaign=lfr-sales-q1
```

---

### 5. Video CTAs

**30-Second "How Law Firm RAG Works" Video**
```
https://theinnovativenative.com/law-firm-rag?utm_source=video&utm_medium=embed&utm_campaign=lfr-video-q1&utm_content=how-rag-works-30s
```

**15-Second "Authority-Aware Ranking" Video**
```
https://theinnovativenative.com/law-firm-rag?utm_source=video&utm_medium=embed&utm_campaign=lfr-video-q1&utm_content=authority-ranking-15s
```

**15-Second "The Problem" Video**
```
https://theinnovativenative.com/law-firm-rag?utm_source=video&utm_medium=embed&utm_campaign=lfr-video-q1&utm_content=problem-15s
```

**20-Second "Zero Hallucination" Video**
```
https://theinnovativenative.com/law-firm-rag?utm_source=video&utm_medium=embed&utm_campaign=lfr-video-q1&utm_content=zero-hallucination-20s
```

**87-Second Full Cerebro Overview Video**
```
https://theinnovativenative.com/law-firm-rag?utm_source=video&utm_medium=embed&utm_campaign=lfr-video-q1&utm_content=cerebro-full-87s
```

---

## Shortened URLs (for Print/QR)

For slide decks and printed materials, use shortened URLs with tracking. Create via bit.ly or similar:

| Full URL | Suggested Short | Use Case |
|----------|-----------------|----------|
| Slide Deck QR URL | bit.ly/lfr-demo | Sales deck QR code |
| Direct Landing | bit.ly/law-firm-rag | Business cards |

---

## Calendly Integration URLs

When Calendly is set up, append UTM parameters to the booking link:

**Standard Calendly with UTM passthrough:**
```
https://calendly.com/[HANDLE]/law-firm-rag-pilot?utm_source={{utm_source}}&utm_medium={{utm_medium}}&utm_campaign={{utm_campaign}}&utm_content={{utm_content}}
```

Calendly supports UTM passthrough - enable this in Calendly settings under "Tracking Parameters".

---

## Analytics Setup Checklist

- [ ] Google Analytics 4 configured on landing page
- [ ] UTM parameters auto-captured in GA4
- [ ] Conversion event set for Calendly booking
- [ ] n8n webhook listening for form submissions
- [ ] Airtable lead tracking connected

---

## n8n Workflow: Lead Tracking Pipeline

**Workflow Name**: `LFR-Lead-Tracking`

**Trigger**: Webhook (receives form submission or Calendly booking)

**Nodes**:
1. **Webhook Trigger** - Receives lead data with UTM parameters
2. **Set Node** - Extracts and normalizes UTM data
3. **Airtable Node** - Creates lead record with attribution
4. **Slack Notification** - Alerts team of new lead
5. **Email Node** - Sends confirmation to lead (optional)

**Webhook Payload Expected**:
```json
{
  "email": "contact@lawfirm.com",
  "name": "John Smith",
  "firm": "Smith & Associates",
  "practice_area": "bankruptcy",
  "utm_source": "linkedin",
  "utm_medium": "social",
  "utm_campaign": "lfr-launch-q1",
  "utm_content": "post-1-problem",
  "timestamp": "2026-02-04T10:00:00Z"
}
```

---

## Attribution Tracking Table

For reference, track lead attribution in Airtable:

| Field | Type | Source |
|-------|------|--------|
| Lead Email | Email | Form submission |
| Lead Name | Text | Form submission |
| Firm Name | Text | Form submission |
| UTM Source | Single Select | URL parameter |
| UTM Medium | Single Select | URL parameter |
| UTM Campaign | Text | URL parameter |
| UTM Content | Text | URL parameter |
| First Touch Date | Date | Auto-generated |
| Lead Status | Single Select | Manual |
| Notes | Long Text | Manual |

---

## Quick Copy Reference

### LinkedIn Posts - Copy this URL structure:
```
?utm_source=linkedin&utm_medium=social&utm_campaign=lfr-launch-q1&utm_content=[POST-ID]
```

### Cold Emails - Copy this URL structure:
```
?utm_source=outreach&utm_medium=email&utm_campaign=lfr-pilot-q1&utm_content=[HOOK-ID]
```

### Video CTAs - Copy this URL structure:
```
?utm_source=video&utm_medium=embed&utm_campaign=lfr-video-q1&utm_content=[VIDEO-ID]
```

---

*Document created: 2026-02-04*
*Created by: Neo (Automation Agent)*
*Task: T003 - UTM Tracking Implementation*
