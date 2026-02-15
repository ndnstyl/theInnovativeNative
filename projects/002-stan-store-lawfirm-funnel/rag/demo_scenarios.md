# Cerebro Legal RAG - Demo Scenarios

Sales demonstration scenarios showcasing Cerebro's authority-aware legal RAG capabilities.

---

## Demo 1: Bankruptcy - Fraud Dischargeability (bk-001)

### The Query

> "What is the test for dischargeability under 11 USC 523(a)(2)(A)?"

### Expected Response

The test for nondischargeability based on fraud under 11 U.S.C. Section 523(a)(2)(A) requires the creditor to prove five elements, as established in **Field v. Mans, 516 U.S. 59 (1995)**:

1. **False representation** - The debtor made a false representation of fact
2. **Knowledge of falsity** - The debtor knew the representation was false at the time it was made
3. **Intent to deceive** - The debtor made the representation with intent to deceive the creditor
4. **Justifiable reliance** - The creditor justifiably relied on the false representation
5. **Resulting damage** - The creditor suffered damage as a proximate result of the reliance

**Critical Legal Distinction**: The Supreme Court in *Field v. Mans* adopted the "justifiable reliance" standard from the Restatement (Second) of Torts, explicitly rejecting the more demanding "reasonable reliance" standard. This is a crucial distinction for practitioners.

### Citations

- **Field v. Mans, 516 U.S. 59 (1995)** - Supreme Court case establishing justifiable reliance standard
- **11 U.S.C. Section 523(a)(2)(A)** - Statutory basis for fraud discharge exception

### Talking Points

1. **Authority-Aware Ranking**: "Notice how Cerebro surfaces the Supreme Court case first. Our authority-aware reranking ensures controlling precedent appears at the top, not buried in results."

2. **Precision on Legal Tests**: "Cerebro correctly distinguishes between 'justifiable' and 'reasonable' reliance - a common error in legal research that could cost your client the case."

3. **Complete Element Lists**: "All five elements are present. Cerebro doesn't give you fragments - it gives you the complete legal test you need for pleadings."

---

## Demo 2: Criminal Procedure - Cell Phone Searches (cp-017)

### The Query

> "Can police search a cell phone incident to arrest without a warrant?"

### Expected Response

No. The Supreme Court in **Riley v. California, 573 U.S. 373 (2014)** unanimously held that police generally **cannot search digital contents of a cell phone** seized during an arrest without a warrant.

**Key Holdings**:

1. **Warrant required** - The search incident to arrest exception to the Fourth Amendment does not apply to cell phone data searches
2. **Privacy interests** - Cell phones contain vast quantities of personal data that create substantial privacy interests beyond physical objects
3. **Reduced government interest** - The traditional justifications for warrantless searches (officer safety and evidence preservation) are diminished for digital data

**Rationale**: The Court emphasized that modern smartphones are "minicomputers" with immense storage capacity that can reveal "the privacies of life." The categorical rule requiring a warrant applies regardless of circumstances.

**Exception**: Officers may still conduct a physical inspection of the phone itself for safety (e.g., checking for hidden weapons or razor blades).

### Citations

- **Riley v. California, 573 U.S. 373 (2014)** - Controlling Supreme Court precedent

### Talking Points

1. **Definitive Answers**: "This is a yes-or-no question. Cerebro gives you the clear answer backed by binding precedent - no hedging, no 'it depends' when the law is settled."

2. **Current Law**: "Riley is from 2014, but it's still controlling. Cerebro's corpus includes current precedent, not just historical cases."

3. **Practical Guidance**: "Notice the exception for physical inspection - that's the kind of practical detail attorneys need when advising clients or preparing motions to suppress."

---

## Demo 3: Administrative Law - Major Questions Doctrine (ad-016)

### The Query

> "What is the major questions doctrine?"

### Expected Response

The major questions doctrine, formalized in **West Virginia v. EPA, 597 U.S. 697 (2022)**, requires that agencies have **clear congressional authorization** before making rules with **extraordinary economic or political significance**.

**Core Principles**:

1. **Clear statement required** - When an agency claims authority to regulate a matter of vast economic or political significance, courts expect Congress to speak clearly
2. **Skepticism of broad claims** - Courts are skeptical when agencies discover broad regulatory authority in "modest" or "ancillary" statutory provisions
3. **Separation of powers** - Major policy decisions should be made by Congress, not administrative agencies

**Application**: The doctrine acts as a substantive canon of interpretation that overrides Chevron deference in cases involving:
- Significant economic impact (billions of dollars)
- Major political or policy implications
- Agency assertions of authority over previously unregulated areas
- Dramatic expansion of agency power

**Effect**: When triggered, agencies must point to clear statutory text granting the claimed authority; general or ambiguous delegations are insufficient.

### Citations

- **West Virginia v. EPA, 597 U.S. 697 (2022)** - Supreme Court decision formalizing the major questions doctrine

### Talking Points

1. **Cutting-Edge Doctrine**: "This is the most significant development in administrative law in decades. Cerebro's corpus includes 2022 precedent that older research platforms may miss."

2. **Practical Framework**: "We don't just cite the case - we explain when and how the doctrine applies. That's actionable intelligence for regulatory practice."

3. **Authority Hierarchy**: "West Virginia v. EPA is the controlling case. Cerebro surfaces it first, not the older cases the Court relied upon. You get the current state of the law."

---

## Demo Script Tips

### Opening

"Let me show you how Cerebro handles a common legal research scenario. I'm going to ask a question that your associates might spend hours researching..."

### During Demo

- Pause after each response to highlight the cited authorities
- Point out how elements are clearly enumerated
- Emphasize response time (typically under 3 seconds)

### Closing

"This is one query of 150 gold-standard questions we've tested across bankruptcy, criminal procedure, and administrative law. Cerebro passes on citation accuracy, element completeness, and response speed. Would you like to try a query from your practice area?"

---

## Competitive Differentiators to Emphasize

| Feature | Cerebro | Generic RAG |
|---------|---------|-------------|
| Authority Ranking | SCOTUS > Circuit > District | Random or recency-based |
| Legal Tests | Complete elements | Partial or missing |
| Citation Accuracy | 100% verified | Hallucinations common |
| Binding vs. Persuasive | Clearly distinguished | Often conflated |
| Practice-Specific | Trained per domain | Generic legal text |

---

## Objection Handling

**"We already use Westlaw/LexisNexis."**
> "Cerebro complements your existing tools. We're not replacing search - we're giving you synthesized, citation-verified answers for common questions. Your associates can get a complete legal test in seconds, then verify in Westlaw. It's about efficiency, not replacement."

**"What about hallucinations?"**
> "Every citation in Cerebro's responses resolves to a real case in our corpus. We validate at ingestion and check again at response time. Our citation integrity rate is 100% - we don't ship answers with fake cases."

**"How current is the law?"**
> "Our corpus includes cases through [current year]. We update weekly with new published opinions from CourtListener. For rapidly evolving areas like the major questions doctrine, you're getting 2022 precedent, not outdated treatises."
