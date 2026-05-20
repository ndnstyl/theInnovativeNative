# Stan Store Leads - Airtable Table Specification

## Overview
This table captures leads and buyers from Stan Store (and other sources) for the Law Firm Scorecard and Blueprint offers. It integrates with Zapier to automatically capture Stan Store purchases and form submissions.

---

## Base Information
- **Base Name**: TIN Operations
- **Table Name**: Stan Store Leads

---

## Field Definitions

### Required Fields

| Field Name | Field Type | Configuration | Purpose |
|-----------|-----------|---------------|---------|
| **Name** | Single line text | Required field | Lead's full name |
| **Email** | Email | Required field | Lead's email address (primary identifier) |
| **Lead Type** | Single select | Options: "Lead", "Buyer"<br>Default: "Lead" | Distinguishes between free leads and paying customers |
| **Product** | Single select | Options: "Scorecard", "Blueprint", "Both", "Unknown"<br>Default: "Unknown" | Which product they purchased or expressed interest in |
| **Amount** | Currency | Format: USD ($)<br>Precision: 2 decimal places<br>Allow negative: No | Purchase amount (0 for free leads) |
| **Source** | Single select | Options: "Stan Store", "Direct", "LinkedIn", "Referral", "Other"<br>Default: "Stan Store" | Where the lead came from |
| **Timestamp** | Date and time | Include time: Yes<br>Time zone: GMT<br>Use same time zone for all collaborators: Yes | When lead was captured |
| **Status** | Single select | Options: "New", "Contacted", "Booked", "Converted", "Inactive"<br>Default: "New" | Current stage in sales funnel |

### Optional Fields

| Field Name | Field Type | Configuration | Purpose |
|-----------|-----------|---------------|---------|
| **Booking Date** | Date | Date only (no time)<br>Optional | When sales call is scheduled |
| **Notes** | Long text | Enable rich text formatting: No | Internal notes about the lead |
| **Zapier Event ID** | Single line text | Optional | Unique ID from Zapier for deduplication |
| **Phone** | Phone number | Optional | Contact phone number if provided |
| **Company** | Single line text | Optional | Law firm name |
| **Last Contact Date** | Date | Date only | When we last reached out |
| **Follow Up Date** | Date | Date only | When to follow up next |

---

## Views Configuration

### 1. All Leads (Default View)
- **Type**: Grid
- **Filter**: None (show all records)
- **Sort**: Timestamp (newest first)
- **Visible Fields**: Name, Email, Lead Type, Product, Amount, Source, Timestamp, Status

### 2. New Leads
- **Type**: Grid
- **Filter**: Status = "New"
- **Sort**: Timestamp (newest first)
- **Visible Fields**: Name, Email, Lead Type, Product, Amount, Source, Timestamp
- **Purpose**: Quick view of uncontacted leads

### 3. Buyers Only
- **Type**: Grid
- **Filter**: Lead Type = "Buyer"
- **Sort**: Timestamp (newest first)
- **Visible Fields**: Name, Email, Product, Amount, Status, Booking Date, Timestamp
- **Purpose**: Focus on paying customers

### 4. Booked Calls
- **Type**: Grid
- **Filter**: Status = "Booked"
- **Sort**: Booking Date (earliest first)
- **Visible Fields**: Name, Email, Product, Booking Date, Amount, Notes
- **Purpose**: Upcoming sales calls

### 5. Conversion Funnel
- **Type**: Grid
- **Group by**: Status (show as stacked groups)
- **Sort within groups**: Timestamp (newest first)
- **Visible Fields**: Name, Email, Lead Type, Product, Amount, Last Contact Date
- **Purpose**: Visual pipeline management

### 6. Follow-Ups Due
- **Type**: Grid
- **Filter**:
  - Status = "Contacted" OR Status = "New"
  - Follow Up Date is not empty
  - Follow Up Date is on or before today
- **Sort**: Follow Up Date (earliest first)
- **Visible Fields**: Name, Email, Follow Up Date, Last Contact Date, Status, Notes
- **Purpose**: Daily action list

---

## Automations (Create After Table Setup)

### 1. New Lead Notification
- **Trigger**: When record enters view "New Leads"
- **Action**: Send Slack notification to #leads channel
- **Message**: "New lead: [Name] ([Lead Type]) - [Product] - $[Amount]"

### 2. Auto-Update Last Contact Date
- **Trigger**: When Status changes to "Contacted"
- **Action**: Update "Last Contact Date" to today

### 3. Follow-Up Reminder
- **Trigger**: When Follow Up Date is today (daily at 9am)
- **Action**: Send email to CEO with list of follow-ups due

---

## Zapier Integration Notes

### Expected Zapier Fields Mapping

When setting up Zapier to push Stan Store data to this table:

```
Zapier Field → Airtable Field
-----------------------------
customer_name → Name
customer_email → Email
product_name → Product (map "Scorecard" or "Blueprint")
amount_paid → Amount
purchase_date → Timestamp
event_id → Zapier Event ID
"Buyer" (hardcoded) → Lead Type
"Stan Store" (hardcoded) → Source
"New" (hardcoded) → Status
```

### Deduplication Strategy
- Use Zapier's "Find record" step before creating
- Search by Email + Zapier Event ID
- If found, update record; if not found, create new

---

## Permission Settings (Recommended)

- **Editor**: CEO, Sales team members
- **Commenter**: Marketing team
- **Read-only**: Everyone else in workspace

---

## Implementation Checklist

- [ ] Create base "TIN Operations" (if not exists)
- [ ] Create table "Stan Store Leads"
- [ ] Add all required fields with exact configurations
- [ ] Add optional fields
- [ ] Create all 6 views
- [ ] Set "All Leads" as default view
- [ ] Set up 3 automations
- [ ] Configure Zapier integration
- [ ] Test with sample record
- [ ] Verify deduplication works
- [ ] Share with team members

---

## Sample Test Record

Use this to verify the table is set up correctly:

```
Name: John Smith
Email: john.smith@testlawfirm.com
Lead Type: Buyer
Product: Scorecard
Amount: $297
Source: Stan Store
Timestamp: [current date/time]
Status: New
Company: Smith & Associates Law
Notes: Test record - delete after verification
```

---

## Notes for CEO
- This table is the source of truth for all Stan Store leads
- Zapier will automatically populate new records when purchases occur
- Check "New Leads" view daily to follow up promptly
- Move leads through Status pipeline as you work them
- Use "Follow-Ups Due" view as your daily action list

---

**Created by**: Tab (Airtable Agent)
**Date**: 2026-02-06
**Project**: 002-stan-store-lawfirm-funnel
