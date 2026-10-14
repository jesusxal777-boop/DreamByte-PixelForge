# DreamByte PixelForge — architecture and database plan

## Selected hosting architecture

- **GitHub repository:** source control and backups of the code.
- **InfinityFree:** serves the frontend and PHP endpoints from the same hostname.
- **MySQL:** stores account records and cloud projects for DreamByte apps when those features are implemented.
- **GitHub Pages:** optional static preview only. Its copy is separate from the InfinityFree site and cannot call the InfinityFree API under the free-hosting restrictions.

InfinityFree's official support says browser-based JavaScript and PHP can work when they share the same hostname. The free hosting security system can block external API clients and cross-origin frontend requests, so do not design this deployment around CORS.

## Frontend and local projects

- Keep drawing and editing in the browser.
- Add IndexedDB autosave so editable projects persist on the device.
- Define a versioned `.dpf` project format containing canvas dimensions, pixel data, palette, tool settings and (later) layer metadata.
- Keep PNG export as an image export, distinct from the editable project format.
- Cloud sync should be optional; local editing should work without an account.

## PHP API

The current `api/index.php` only provides a database health check. Account and project endpoints are not implemented yet.

For the free-hosting compatibility target, initially use ordinary browser requests to same-host PHP endpoints. Before implementing CRUD routes, verify which HTTP methods are accepted by the current plan. If PUT/DELETE are blocked, use POST action routes rather than relying on those methods.

Planned capabilities:
- Register/login/logout with secure session handling.
- Get current user.
- List, create, load, rename and delete owned projects.
- Save a versioned editable project document.
- Share user/account tables across future DreamByte tools using an `app_key` on project records.

## Shared schema

The initial draft is in `database/schema.sql`:
- `users`: username, email, password hash and timestamps.
- `sessions`: user ID, hash of a random session token, expiry and revocation timestamps.
- `projects`: owner, app key, name, format version and editable document data.
- `project_versions`: saved snapshots for recovery/version history.

The schema is a starting point, not a deployed or fully validated production database. Use InnoDB, utf8mb4, foreign keys and indexes. Apply schema changes deliberately as migrations.

## Security requirements

- Never place MySQL credentials in browser JavaScript or Git.
- Keep the real `api/config.php` only on the hosting account; copy it from `api/config.example.php` and fill it in privately.
- Use PHP `password_hash()` and `password_verify()`.
- Use PDO prepared statements for SQL values.
- Generate random opaque session tokens and store only token hashes. Use HTTPS, HttpOnly/Secure cookies and an appropriate SameSite policy; protect cookie-authenticated writes against CSRF.
- Validate and limit request bodies. Do not trust client filenames or MIME declarations.
- Enforce ownership checks for every project operation.
- Rate-limit authentication attempts and back up the database.
- Never expose raw database errors or credentials in API responses.

## Hosting limitations and next steps

InfinityFree's free hosting is intended for websites accessed in browsers, not a general-purpose API for unrelated external clients. Keep the frontend and API on the same hostname. Other DreamByte apps will need to share that hostname to reuse this backend under the same constraints, or use a different backend host later.

Before enabling cloud accounts, confirm HTTPS is active, create the MySQL database, import `database/schema.sql`, configure `api/config.php) on the server, and test `/api/?action=health`. The deploy guide contains the upload checklist.
