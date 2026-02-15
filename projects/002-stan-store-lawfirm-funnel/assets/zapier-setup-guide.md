# Zapier Setup Guide: Stan Store → n8n Lead Capture

**Version**: 1.0
**Date**: 2026-02-06
**Audience**: CEO (The Innovative Native LLC)
**Purpose**: Step-by-step instructions to connect Stan Store to the n8n Lead Capture workflow via Zapier

---

## Prerequisites

Before you begin:

- [ ] Stan Store account with at least ONE customer (free or paid) for testing
- [ ] Zapier account (free tier supports 100 tasks/month)
- [ ] n8n workflow "Stan Store Lead Capture" is built and ACTIVATED
- [ ] n8n webhook URL copied from the activated workflow

**Important**: You must activate the n8n workflow BEFORE setting up Zapier, because you need the webhook URL to configure the Zap.

---

## Part 1: Get the n8n Webhook URL

### Step 1: Activate the Workflow in n8n

1. Open your n8n instance
2. Navigate to the "Stan Store Lead Capture" workflow
3. Click **"Activate"** in the top-right corner (toggle should turn green)
4. Click on the **"Webhook - Stan Store"** node (first node in the workflow)
5. In the right panel, find the section labeled **"Webhook URLs"**
6. Copy the **Production URL** (should look like: `https://your-n8n-instance.com/webhook/stan-store-lead`)
7. **Save this URL** — you'll paste it into Zapier in Part 2

**What this looks like in n8n**:
```
Webhook URLs
------------
Production URL: https://n8n.example.com/webhook/stan-store-lead
Test URL: https://n8n.example.com/webhook-test/stan-store-lead

[Copy] button next to each URL
```

**Troubleshooting**:
- If you don't see a webhook URL, the workflow is not activated. Check the toggle in the top-right.
- If the URL says "webhook-test", you're looking at the test URL. Use the Production URL instead.

---

## Part 2: Create the Zap in Zapier

### Step 2: Start a New Zap

1. Log in to [Zapier.com](https://zapier.com)
2. Click **"Create Zap"** (orange button, top-right or center of dashboard)
3. You'll see a blank Zap editor with two sections: **Trigger** and **Action**

---

### Step 3: Configure the Trigger (Stan Store → New Customer)

#### 3.1: Choose the Trigger App

1. In the **Trigger** section, click **"Choose app and event"**
2. In the search box, type: **"Stan"** (NOT "Stan Store" — the app name is just "Stan")
3. Select **Stan** from the results (logo is a black square with white "S")
4. For **Event**, choose: **"New Customer"**
   - This event fires when someone downloads a free product OR purchases a paid product
5. Click **"Continue"**

**What "New Customer" includes**:
- Free product downloads (e.g., Automation Readiness Scorecard)
- Paid product purchases (e.g., Law Firm Automation Blueprint)
- Recurring membership sign-ups

**Alternatives**:
- **"New Member"** → Only recurring memberships (ignore this unless you have a membership tier)
- **"Canceled Member"** → Not relevant for this funnel

---

#### 3.2: Connect Your Stan Store Account

1. Click **"Sign in to Stan"**
2. A pop-up will open asking for your Stan Store credentials
3. Log in to your Stan Store account
4. Grant Zapier permission to access your Stan Store data
5. Once connected, you'll see your Stan Store account name in the dropdown
6. Click **"Continue"**

**Troubleshooting**:
- If the pop-up doesn't open, disable your browser's pop-up blocker for Zapier.com
- If authentication fails, make sure you're using the Stan Store account owner's credentials (not a team member's)

---

#### 3.3: Test the Trigger

1. Zapier will say: **"Find data: We'll pull in a recent New Customer from Stan to set up your Zap."**
2. Click **"Test trigger"**
3. Zapier will fetch your most recent customer from Stan Store

**Expected Result**:
You should see a sample customer record with fields like:
- Customer Name
- Customer Email
- Product Name
- (Possibly) Amount, Currency, Purchase Date

**Example Output**:
```
Customer Name: Jane Smith
Customer Email: jane@lawfirm.com
Product Name: Automation Readiness Scorecard
Amount: 0
Currency: USD
Created At: 2026-02-05T10:30:00Z
```

**If the test fails**:
- **"No data found"** → You don't have any customers in Stan Store yet. Create a test customer by:
  - Publishing a free product
  - Using a personal email to download it
  - Then re-test the trigger
- **"Authentication error"** → Disconnect and reconnect your Stan Store account

4. Once you see sample data, click **"Continue"**

---

### Step 4: Configure the Action (Webhooks by Zapier → POST to n8n)

#### 4.1: Choose the Action App

1. In the **Action** section, click **"Choose app and event"**
2. In the search box, type: **"Webhooks by Zapier"**
3. Select **Webhooks by Zapier** (icon is a chain link)
4. For **Event**, choose: **"POST"**
5. Click **"Continue"**

**Why POST?**
The n8n workflow expects a POST request with a JSON payload. Zapier's Webhooks app will format the data correctly.

---

#### 4.2: Set Up the POST Request

You'll now configure the webhook payload that gets sent to n8n. This is the most critical step.

##### **URL Field**
1. In the **URL** field, paste the n8n webhook URL you copied in Part 1
2. Example: `https://n8n.example.com/webhook/stan-store-lead`

##### **Payload Type**
1. Set **Payload Type** to: **JSON**

##### **Data Section**
This is where you map Stan Store fields to the JSON payload expected by n8n.

Click **"Add a new data field"** for each of the following:

| Key                 | Value (mapped from Stan trigger)                  | Notes                                      |
|---------------------|---------------------------------------------------|--------------------------------------------|
| `customer_name`     | *[Stan] Customer Name*                            | Drag from "Insert Data" dropdown           |
| `customer_email`    | *[Stan] Customer Email*                           | Drag from "Insert Data" dropdown           |
| `product_name`      | *[Stan] Product Name*                             | Drag from "Insert Data" dropdown           |
| `product_type`      | **(see below for logic)**                         | Requires custom formatting                 |
| `amount`            | *[Stan] Amount* (or `0` if not available)         | May need to use "Or if blank" fallback     |
| `currency`          | *[Stan] Currency* (or `USD` if not available)     | May need to use "Or if blank" fallback     |
| `timestamp`         | *[Built-in] Zap Meta Human Now*                   | In "Insert Data", search "Zap Meta"        |
| `zapier_event_id`   | *[Built-in] Zap Meta ID*                          | In "Insert Data", search "Zap Meta"        |

**How to add each field**:
1. Click **"+ Add a new data field"**
2. In the **Key** box, type the exact key name (e.g., `customer_name`)
3. In the **Value** box, click **"Insert Data"** and select the corresponding Stan Store field
4. Repeat for all 8 fields

---

##### **Special Case: product_type Field**

Stan Store does not provide a direct "product_type" field. You need to use Zapier's **Formatter** to derive this.

**Option A: Use Amount to Determine Type** (Recommended)

1. Add a **Formatter by Zapier** step BEFORE the Webhooks step:
   - App: **Formatter by Zapier**
   - Event: **Numbers → Format Number**
   - Input: *[Stan] Amount*
   - Transform: **Check if greater than 0**
2. Then in the Webhooks step, for `product_type`:
   - If Amount > 0 → "paid"
   - If Amount = 0 → "free"

**Option B: Use Product Name to Determine Type** (Fallback if Amount is not available)

1. Add a **Formatter by Zapier** step BEFORE the Webhooks step:
   - App: **Formatter by Zapier**
   - Event: **Text → Replace**
   - Input: *[Stan] Product Name*
   - Find: (leave blank, we're using conditional logic)
2. Then add **Paths by Zapier** to route based on product name:
   - Path A: If Product Name contains "Blueprint" → Set `product_type` = "paid"
   - Path B: If Product Name contains "Scorecard" → Set `product_type` = "free"

**For V1, simplest approach**:
If you know your funnel only has two products (Scorecard = free, Blueprint = paid), hardcode the logic:
- Add a **Filter by Zapier** step:
  - Continue if *[Stan] Product Name* contains "Blueprint"
  - Set `product_type` = "paid"
- All other products default to "free"

**Ask Builder if you need help with this step** — product_type is critical for lead classification in n8n.

---

##### **Example Final Data Payload**

Your Data section should look like this:

```
customer_name        → [Stan] Customer Name
customer_email       → [Stan] Customer Email
product_name         → [Stan] Product Name
product_type         → [Formatter Output] "paid" or "free"
amount               → [Stan] Amount (or 0)
currency             → [Stan] Currency (or "USD")
timestamp            → [Zap Meta] Human Now
zapier_event_id      → [Zap Meta] ID
```

**Visual Reference**:
```
┌────────────────────┬─────────────────────────────────┐
│ Key                │ Value                           │
├────────────────────┼─────────────────────────────────┤
│ customer_name      │ 1. Customer Name ▼              │
│ customer_email     │ 1. Customer Email ▼             │
│ product_name       │ 1. Product Name ▼               │
│ product_type       │ 2. Formatter Output ▼           │
│ amount             │ 1. Amount ▼                     │
│ currency           │ 1. Currency ▼                   │
│ timestamp          │ Zap Meta Human Now ▼            │
│ zapier_event_id    │ Zap Meta ID ▼                   │
└────────────────────┴─────────────────────────────────┘
```

---

#### 4.3: Test the Action

1. Click **"Test action"**
2. Zapier will send a POST request to your n8n webhook URL with the sample data
3. **Expected Result**: You should see:
   ```
   Status: 200 OK
   Response:
   {
     "success": true,
     "record_id": "recXXXXXXXXXXXXXX",
     "lead_type": "Lead",
     "timestamp": "2026-02-06T15:45:00Z"
   }
   ```

**If the test succeeds**:
- Check your Airtable "Stan Store Leads" table → You should see a new record
- If the test customer was a paid product → Check Slack #project-updates for a notification

**If the test fails**:
- **"404 Not Found"** → Your n8n workflow is not activated, or the webhook URL is wrong
- **"500 Internal Server Error"** → Check n8n workflow for errors (likely Airtable connection issue)
- **"Timeout"** → n8n workflow is taking too long (check if Slack is slow to respond)

4. Once the test succeeds, click **"Continue"**

---

### Step 5: Name and Publish the Zap

1. In the top-left, click the default Zap name (e.g., "Stan and Webhooks")
2. Rename it to: **"Stan Store → n8n Lead Capture"**
3. Click **"Publish"** (or "Turn on Zap")
4. The Zap is now live!

---

## Part 3: Verify the Integration

### Step 6: Test with Real Data

**Option A: Use a Test Customer**
1. In Stan Store, create a test free product (or use your existing Scorecard)
2. Use a personal email (not the same as your Stan Store account) to download it
3. Wait 1-2 minutes for Zapier to process
4. Check Airtable "Stan Store Leads" → New record should appear with:
   - Lead Type = "Lead"
   - Product = "Scorecard"
   - Amount = 0

**Option B: Use Zapier's "Load More Records"**
1. In the Zap editor, go back to the Trigger step
2. Click **"Test trigger"** → **"Load more records"**
3. Select a different customer (if you have multiple)
4. Re-test the entire Zap with that customer's data

---

### Step 7: Test Paid Product (Blueprint)

1. In Stan Store, create a test paid product (or use your Blueprint) priced at $97
2. Use a personal email to purchase it (you can refund yourself afterward)
3. Wait 1-2 minutes for Zapier to process
4. Check Airtable "Stan Store Leads" → New record should appear with:
   - Lead Type = "Buyer"
   - Product = "Blueprint"
   - Amount = 97
5. Check Slack #project-updates → You should see a notification:
   ```
   🎯 New Blueprint Buyer from Stan Store!

   Name: Your Name
   Email: your-email@example.com
   Product: Law Firm Automation Blueprint
   Amount: $97
   Timestamp: 2026-02-06T16:00:00Z

   Airtable Record: recXXXXXXXXXXXXXX
   ```

---

### Step 8: Monitor Zap History

1. In Zapier, go to your dashboard → **"Zap History"**
2. You'll see a log of every time the Zap ran
3. Look for:
   - **Green checkmark** = Success
   - **Red X** = Error
4. Click on any run to see the full data payload and response

**Common Errors**:
- **"Missing required field"** → Stan Store didn't send a field (e.g., Amount). Add a fallback value in Zapier.
- **"Duplicate record"** → n8n's duplicate check caught a retry. This is expected behavior (safe to ignore).
- **"Airtable API error"** → Check if your Airtable connection in n8n is still valid.

---

## Part 4: Troubleshooting

### Issue 1: Zapier Test Works, But Live Zap Doesn't Fire

**Cause**: Zapier's trigger polling interval is 5-15 minutes on the free plan.

**Fix**: Wait 15 minutes after a new customer signs up, then check Zap History.

**Alternative**: Upgrade to Zapier's paid plan for instant triggers (not necessary for this funnel).

---

### Issue 2: product_type Always Shows "free" (Even for Paid Products)

**Cause**: The Formatter step isn't working, or Stan Store's Amount field is null.

**Fix**:
1. In Zapier, go to the Trigger step → "Test trigger" → "Load more records"
2. Select a paid customer and look at the data
3. Check if "Amount" field exists and has a value > 0
4. If Amount is null, use Product Name instead (see Option B in Step 4.2)

---

### Issue 3: Duplicate Records in Airtable

**Cause**: Zapier retried the webhook, and n8n's duplicate check failed.

**Fix**:
1. Check if the duplicate records have the same `Zapier Event ID`
2. If yes → n8n's deduplication logic is broken (check Nodes 2, 3, 3b in n8n workflow)
3. If no → Different events, not duplicates (this is expected if a customer buys multiple products)

---

### Issue 4: Slack Notification Not Sending

**Cause**: Either Slack connection in n8n is broken, or the lead is classified as "Lead" (not "Buyer").

**Fix**:
1. Check Airtable record → Is `Lead Type` = "Buyer"?
   - If "Lead", Slack won't fire (this is expected for free products)
   - If "Buyer", check n8n workflow → Node 7a (Slack) → Test the Slack connection
2. In n8n, manually trigger Node 7a with test data to verify Slack works

---

### Issue 5: Webhook Returns 200, But No Record in Airtable

**Cause**: n8n workflow is returning 200 even on error (by design, to prevent Zapier retry storms).

**Fix**:
1. Check n8n's **Execution History** (sidebar in n8n)
2. Find the failed execution
3. Look for the red X on Node 6 (Airtable Create)
4. Common causes:
   - Airtable connection expired → Reconnect in n8n
   - Field name mismatch → Check that Airtable field names match the workflow spec
   - Missing required field → Check Airtable table schema

---

## Part 5: Maintenance and Monitoring

### Weekly Checklist

- [ ] Check Zapier Zap History for errors (red X's)
- [ ] Verify Airtable record count matches Stan Store customer count
- [ ] Spot-check 2-3 recent Airtable records for data accuracy

### Monthly Checklist

- [ ] Review Zapier task usage (free plan = 100 tasks/month)
- [ ] Audit Airtable for records with Status = "New" older than 7 days
- [ ] Test the Zap with a new free product download

### When to Update the Zap

- **Stan Store changes product names** → Update product_type logic (if using Product Name)
- **Add new products** → Verify product_type logic still works
- **Airtable schema changes** → Update field mappings (shouldn't affect Zapier, but check)
- **n8n webhook URL changes** → Update URL in Zapier Action step

---

## Appendix: Zapier Limitations (Free Plan)

- **100 tasks/month** → Each new customer = 1 task. Upgrade if you exceed 100 customers/month.
- **15-minute polling** → Zap fires every 15 minutes to check for new customers (not instant).
- **Single-step Zaps only** → Free plan allows 1 trigger + 1 action. If you need multi-step logic (e.g., Formatter), upgrade to paid plan.

**Recommended Upgrade**: If you hit 100 customers/month, upgrade to Zapier's Starter plan ($29.99/mo for 750 tasks).

---

## Appendix: Example Zap Data Flow

**Step-by-step of what happens when a customer signs up**:

1. **Customer downloads Scorecard in Stan Store** (free product)
2. **Stan Store creates a "New Customer" event**
3. **Zapier polls Stan Store** (every 15 minutes on free plan)
4. **Zapier detects the new customer**
5. **Zapier formats the data into JSON**:
   ```json
   {
     "customer_name": "Jane Smith",
     "customer_email": "jane@lawfirm.com",
     "product_name": "Automation Readiness Scorecard",
     "product_type": "free",
     "amount": 0,
     "currency": "USD",
     "timestamp": "2026-02-06T14:30:00Z",
     "zapier_event_id": "zap_abc123"
   }
   ```
6. **Zapier sends POST request to n8n webhook**
7. **n8n receives the payload and processes it**:
   - Checks for duplicates (Node 2-3b)
   - Classifies as "Lead" (Node 4 → Node 5b)
   - Creates Airtable record (Node 6)
   - Skips Slack (Node 7 → false branch)
   - Responds to webhook (Node 8)
8. **Zapier receives 200 OK response** (marks as success in Zap History)
9. **Done!** Record is now in Airtable with Status = "New"

---

## Support

If you encounter issues not covered in this guide:

1. **Check n8n Execution History** first (most issues are in the workflow, not Zapier)
2. **Check Zapier Zap History** for error messages
3. **Contact Builder** (The Innovative Native LLC) with:
   - Screenshot of Zapier error (if any)
   - Screenshot of n8n execution error (if any)
   - Sample customer data from Stan Store

---

**End of Guide**

**Version History**:
| Version | Date       | Changes                          |
|---------|------------|----------------------------------|
| 1.0     | 2026-02-06 | Initial guide (Builder)          |
