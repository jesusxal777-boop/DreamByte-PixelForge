# Deploy DreamByte PixelForge to InfinityFree

The selected plan is to host the frontend and PHP API under the **same hostname**. Keep this GitHub repository as the source of truth; InfinityFree will serve the live website.

## Before deploying

1. Create an InfinityFree hosting account and a free subdomain.
2. In the hosting control panel, create a MySQL database and note its hostname, database name, username and password.
3. Never send database credentials in chat, screenshots, issues, or commits.

## Upload the site

1. Open the website's File Manager (or connect with FTP).
2. Upload the site files and folders into `htdocs`, keeping the folder structure:
   - `index.html`
   - `css/app.css`
   - `js/app.js`
   - `api/index.php`
   - `api/.htaccess`
   - `database/.htaccess`
3. In `htdocs/api/`, make a copy of `config.example.php` named `config.php`.
4. Edit `config.php` on the hosting account with the database details from the control panel. Do not upload the real config file to GitHub.
5. Open phpMyAdmin from the hosting control panel, select the new database, and import `database/schema.sql`.

## Verify the PHP/database connection

Visit:

`https://YOUR-HOSTNAME/api/?action=health`

Expected response after setup:

`{"ok":true,"service":"DreamByte PixelForge API","database":"connected","version":"0.1.0"}`

If configuration is missing or the database cannot connect, the endpoint returns a generic status without exposing credentials.

## Important limitations

- This is only a deployment scaffold and database health check. Login, cloud project saving, project loading, and sync are **not implemented yet**.
- InfinityFree's free hosting security system expects the JavaScript frontend and PHP API to run under the same hostname. Do not configure a cross-origin API for the GitHub Pages frontend.
- The frontend may still be published on GitHub Pages for preview, but that copy will not be able to use this InfinityFree API.
- Use HTTPS before implementing account sessions.
- Keep `api/config.php` private and out of Git. The repository's `.gitignore` already excludes it.
