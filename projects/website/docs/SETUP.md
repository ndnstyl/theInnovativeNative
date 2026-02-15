# Local Development Setup Guide

This guide walks you through setting up a local development environment for theinnovativenative.com.

---

## Step 1: Install LocalWP

1. Download LocalWP from [https://localwp.com/](https://localwp.com/)
2. Install and open the application
3. Grant any required permissions (macOS may require security approval)

---

## Step 2: Backup the Live Site

### Option A: Using UpdraftPlus (Recommended)

1. Log into WordPress admin at `theinnovativenative.com/wp-admin`
2. Navigate to **Settings → UpdraftPlus Backups**
3. If UpdraftPlus isn't installed:
   - Go to **Plugins → Add New**
   - Search for "UpdraftPlus"
   - Install and activate
4. In UpdraftPlus, click **Backup Now**
5. Ensure both "Include database" and "Include files" are checked
6. Click **Backup Now**
7. Once complete, click on each backup component to download:
   - Database
   - Plugins
   - Themes
   - Uploads
   - Others
8. Save all files to `/Users/makwa/theinnovativenative/backups/`

### Option B: Using cPanel

1. Log into cPanel at hosting.com
2. Use **File Manager** to download `public_html` folder
3. Use **phpMyAdmin** to export the WordPress database
4. Save both to `/Users/makwa/theinnovativenative/backups/`

---

## Step 3: Create Local Site in LocalWP

1. Open LocalWP
2. Click the **+** button to create a new site
3. Choose **Create a new site**
4. Enter site name: `theinnovativenative`
5. Select **Preferred** environment (or customize PHP/MySQL versions)
6. Set WordPress credentials:
   - Username: `admin` (or your preference)
   - Password: (choose a local password)
   - Email: your email
7. Click **Add Site**
8. Wait for LocalWP to create the site

---

## Step 4: Import the Backup

### Using UpdraftPlus

1. In LocalWP, click **Open Site** → **WP Admin**
2. Log in with the credentials you created
3. Go to **Plugins → Add New**
4. Search for and install **UpdraftPlus**
5. Activate the plugin
6. Go to **Settings → UpdraftPlus Backups**
7. Click **Upload backup files**
8. Upload all the backup files from `/backups/`
9. Once uploaded, click **Restore** next to the backup
10. Select all components to restore
11. Confirm the restoration

### Post-Restore Steps

1. You may need to log in again with the **original** site credentials (not the LocalWP ones)
2. Go to **Settings → General** and verify the site URL shows your local address
3. Go to **Settings → Permalinks** and click **Save Changes** (fixes routing)

---

## Step 5: Link Theme Files to Git

After restoring, your theme files are at:
```
~/Local Sites/theinnovativenative/app/public/wp-content/themes/
```

To track changes in git:

1. Identify the theme being used (likely `pro` or a child theme)
2. Copy the theme folder to this repo:
   ```bash
   cp -r "~/Local Sites/theinnovativenative/app/public/wp-content/themes/pro-child" \
         /Users/makwa/theinnovativenative/wp-content/themes/
   ```
3. Create a symlink (optional, for easier development):
   ```bash
   # Backup original
   mv "~/Local Sites/theinnovativenative/app/public/wp-content/themes/pro-child" \
      "~/Local Sites/theinnovativenative/app/public/wp-content/themes/pro-child-backup"

   # Create symlink
   ln -s /Users/makwa/theinnovativenative/wp-content/themes/pro-child \
         "~/Local Sites/theinnovativenative/app/public/wp-content/themes/pro-child"
   ```

---

## Step 6: Access Your Local Site

- **Site URL:** Click "Open Site" in LocalWP (usually `theinnovativenative.local`)
- **Admin URL:** Click "WP Admin" in LocalWP
- **Database:** Click "Open Adminer" for database access

---

## Troubleshooting

### "White Screen" After Restore
- Check `wp-content/debug.log` for errors
- In `wp-config.php`, set `WP_DEBUG` to `true`

### Can't Log In After Restore
- Use the credentials from the original site, not LocalWP defaults
- Or reset password via Adminer/phpMyAdmin

### Permalinks Not Working
- Go to Settings → Permalinks and click Save Changes
- This regenerates the `.htaccess` file

### Pro Theme License Warning
- This is normal for local development
- The theme will work, just with a license notice
- You can dismiss or ignore this locally

---

## Next Steps

Once your local environment is running:
1. Review the current site structure
2. Begin building the Portfolio page (see `CONTENT.md`)
3. Commit theme changes to git as you work
