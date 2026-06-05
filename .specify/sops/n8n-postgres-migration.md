# n8n SQLite → Postgres Migration (Hostinger VPS)

**Goal:** Stop losing all execution history every time the n8n VPS is rebuilt.

**Why:** Default n8n install on Hostinger uses SQLite at `~/.n8n/database.sqlite`. That file gets wiped on every n8n update, container rebuild, or one-click reinstall. Migrating to an external managed Postgres instance makes the database survive any n8n install changes — execution history, credentials, workflows, all persist.

**Time:** ~1 hour for first-time setup, ~10 minutes for the actual migration.

---

## Step 1 — Provision a managed Postgres (free tier)

Pick ONE of these (all have free tiers that handle n8n's data volume comfortably):

### Option A — Supabase (recommended)
1. Go to https://supabase.com → New Project
2. Name: `tin-n8n-prod`, region: `us-east-2` (closest to Hostinger srv948776)
3. Set a strong DB password (save to 1Password / your secrets manager)
4. Wait ~2 minutes for provisioning
5. Settings → Database → Connection string → **Session pooler** (port 5432)
6. Copy these values:
   - `DB_POSTGRESDB_HOST` = `db.{project-ref}.supabase.co`
   - `DB_POSTGRESDB_PORT` = `5432`
   - `DB_POSTGRESDB_DATABASE` = `postgres`
   - `DB_POSTGRESDB_USER` = `postgres`
   - `DB_POSTGRESDB_PASSWORD` = `<your password>`
   - `DB_POSTGRESDB_SCHEMA` = `n8n`

### Option B — Neon
1. https://neon.tech → New Project
2. Same connection details, similar layout
3. Free tier: 0.5 GB storage, branching included

### Option C — Railway
1. https://railway.app → New Project → Provision Postgres
2. Free tier: $5 credit/mo (enough for n8n)

---

## Step 2 — Backup current SQLite database

SSH into your Hostinger VPS:
```bash
ssh root@srv948776.hstgr.cloud
cd /root/.n8n   # or wherever n8n stores its data
cp database.sqlite database.sqlite.backup-$(date +%Y%m%d)
ls -lh database.sqlite*
```

Download a copy locally so you have a forensic snapshot:
```bash
scp root@srv948776.hstgr.cloud:~/.n8n/database.sqlite ./n8n-backup-$(date +%Y%m%d).sqlite
```

---

## Step 3 — Configure n8n to use Postgres

Find your n8n environment config. On Hostinger this is usually one of:
- `/etc/n8n/.env`
- `~/.n8n/.env`
- `docker-compose.yml` environment block (if Dockerized)
- A systemd service unit `EnvironmentFile=`

Add or update these env vars:
```bash
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=db.<your-project-ref>.supabase.co
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=postgres
DB_POSTGRESDB_USER=postgres
DB_POSTGRESDB_PASSWORD=<your-password>
DB_POSTGRESDB_SCHEMA=n8n
DB_POSTGRESDB_SSL_ENABLED=true
DB_POSTGRESDB_SSL_REJECT_UNAUTHORIZED=false

# Also disable execution-data pruning so you keep history
EXECUTIONS_DATA_PRUNE=false
EXECUTIONS_DATA_PRUNE_MAX_COUNT=0
```

---

## Step 4 — Restart n8n (auto-migrates schema)

```bash
# Systemd
sudo systemctl restart n8n
sudo systemctl status n8n
journalctl -u n8n -f

# OR Docker
docker compose restart n8n
docker compose logs -f n8n
```

n8n will detect the empty Postgres database, create its schema, and start fresh. **Note:** This DOES NOT automatically import your old SQLite data. The new install starts blank.

If you want to bring your existing workflows + credentials over, you have two paths:

### Path A — Export/import via UI (easiest, recommended for workflows only)
Before you switch to Postgres:
1. Open n8n UI → Workflows → select all → Export
2. Open n8n UI → Credentials → select all → Export (encrypted JSON)
3. Switch to Postgres (Step 3 + 4 above)
4. After restart, log in to n8n with a new admin account
5. Import workflows JSON
6. Import credentials JSON (you'll need the encryption key from the OLD instance — find it in `~/.n8n/config` under `encryptionKey`)

### Path B — pgloader migration (advanced, copies execution history too)
Use the `pgloader` tool to migrate SQLite → Postgres directly:
```bash
apt install pgloader  # or brew install pgloader on Mac
pgloader sqlite:///root/.n8n/database.sqlite postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres?sslmode=require
```
This brings over workflows, credentials, executions, and all settings. May fail on some Postgres-specific n8n schema differences — fall back to Path A if so.

---

## Step 5 — Verify

```bash
# Check n8n logs for "Connected to PostgreSQL"
journalctl -u n8n -n 50 | grep -i postgres

# Check the Supabase dashboard → Table Editor → n8n schema
# Should see tables: workflow_entity, execution_entity, credentials_entity, etc.
```

In the n8n UI:
1. Open any active workflow → click Execute Workflow
2. Refresh → execution should appear in the list
3. Now restart n8n: `sudo systemctl restart n8n`
4. Refresh the workflow → execution history should STILL be there ✅

---

## Step 6 — Update Hostinger update procedure

Going forward, when you update n8n on Hostinger:
- The application files get rebuilt
- The Postgres database (on Supabase) is untouched
- All execution history, workflows, credentials persist
- No more lost data

Add a note to your VPS update runbook:
> n8n DB is on Supabase (`db.<project-ref>.supabase.co`). Do NOT touch the local SQLite file — it's empty/legacy. All n8n state lives in Postgres.

---

## Rollback plan

If something breaks:
```bash
# 1. Revert env vars (remove DB_TYPE=postgresdb and friends)
# 2. Restore original SQLite backup
cp ~/.n8n/database.sqlite.backup-YYYYMMDD ~/.n8n/database.sqlite
# 3. Restart n8n
sudo systemctl restart n8n
```

---

## Tasks for Mike before kickoff

- [ ] Pick Postgres provider (recommend Supabase free tier)
- [ ] Create the project, save the password somewhere safe
- [ ] Decide: Path A (clean slate) or Path B (full history migration)
- [ ] Schedule a 30-minute window for the cutover (no executions running during the switch)
- [ ] Confirm Cerebro Daily Legal Digest, IG publishers, content workflows are NOT mid-execution when you flip the switch
