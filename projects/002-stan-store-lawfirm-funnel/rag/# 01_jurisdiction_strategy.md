# 01_jurisdiction_strategy.md

## Jurisdiction Scope (Final)

### Federal Only

We will ingest:

1. **United States Supreme Court**
2. **All U.S. Circuit Courts**
3. **U.S. District Courts**
4. **U.S. Bankruptcy Courts**
5. **Federal Administrative Bodies**
   - BIA
   - SSA
   - NLRB
   - VA
   - EPA

We will not ingest state law at this phase.

Reason:
- Federal opinions are more consistently published
- Jurisdictional hierarchy is clean
- Precedent logic is uniform
- Reduces ambiguity in authority ranking

---

## Authority Ranking

The system must rank sources as:

1. Supreme Court
2. Circuit Court
3. District Court
4. Bankruptcy Court
5. Agency Decision
6. Persuasive Authority

Every citation must be labeled with:
- court
- year
- precedential weight

---

## Partitioning Strategy

Indexes:

- `bankruptcy_federal`
- `criminal_procedure_federal`
- `administrative_federal`

Each index contains:
- opinions
- statutes
- procedural rules

They do not mix.

---

## Citation Output Rules

The system must:

- Prefer binding authority
- Only use persuasive when binding is absent
- Always include:
  - court
  - year
  - holding summary
- Never fabricate citations
- Never mix jurisdictions in the same answer unless explicitly requested