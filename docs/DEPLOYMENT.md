# Deployment Guide

How to deploy changes from your local environment to the live site.

---

## Deployment Options

### Option 1: SFTP Upload (Simple)

Best for small changes to theme files.

1. **Connect via SFTP**
   - Host: (from cPanel or hosting.com)
   - Username: (your cPanel username)
   - Password: (your cPanel password)
   - Port: 22

2. **Navigate to theme folder**
   ```
   public_html/wp-content/themes/pro-child/
   ```

3. **Upload changed files**
   - Only upload files you've modified
   - Compare local vs remote before overwriting

### Option 2: cPanel File Manager

1. Log into cPanel at hosting.com
2. Open **File Manager**
3. Navigate to `public_html/wp-content/themes/`
4. Upload your changed theme folder

### Option 3: UpdraftPlus Migration (Full Site)

Best for major changes or full rebuilds.

1. **Create local backup**
   - In LocalWP site, go to UpdraftPlus
   - Create new backup
   - Download all components

2. **Upload to live site**
   - Log into live site's UpdraftPlus
   - Upload the backup files
   - Restore

**Warning:** This overwrites the entire live site. Use with caution.

---

## Pre-Deployment Checklist

Before deploying any changes:

- [ ] Test all changes locally
- [ ] Check responsive design (mobile/tablet/desktop)
- [ ] Verify all links work
- [ ] Test Calendly integration
- [ ] Check portfolio filters function correctly
- [ ] Validate forms if any
- [ ] Commit all changes to git

---

## Git Workflow

```bash
# After making local changes

# 1. Check what's changed
git status

# 2. Add changes
git add .

# 3. Commit with descriptive message
git commit -m "Add portfolio filter for n8n workflows"

# 4. Push to GitHub
git push origin main

# 5. Deploy to live site (SFTP or cPanel)
```

---

## Rollback Procedure

If something goes wrong after deployment:

### Quick Rollback (Theme Only)

1. Connect via SFTP
2. Rename broken theme folder: `pro-child` → `pro-child-broken`
3. Upload previous version from git:
   ```bash
   git checkout HEAD~1 -- wp-content/themes/pro-child
   ```
4. Upload this version via SFTP

### Full Rollback (Database + Files)

1. Log into live site's UpdraftPlus
2. Find a previous backup
3. Restore that backup

---

## Production Considerations

### SSL Certificate
- Ensure HTTPS is working after any domain/URL changes
- If issues, check Let's Encrypt status in cPanel

### Caching
- Clear any caching plugins after deploying
- Clear CDN cache if using one
- Check in an incognito browser to verify changes

### Backups
- Always create a backup before major deployments
- Keep at least 3 recent backups available

---

## Staging Environment (Optional)

For safer testing, consider setting up a staging site:

1. Create subdomain: `staging.theinnovativenative.com`
2. Clone production to staging
3. Test changes on staging first
4. Deploy to production when verified

---

## Contact

If deployment issues occur:
- Check cPanel error logs
- Review WordPress debug.log
- Contact hosting.com support if server-level issues
