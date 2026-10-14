# DreamByte PixelForge — architecture and database plan

## Phase 1: static frontend on GitHub Pages
- Publish HTML, CSS and JavaScript from this repository.
- Implement drawing in the browser and make local editing available without an account.
- Add IndexedDB autosave and a versioned .dpf project format.
- GitHub Pages serves static files only. It does not execute PHP or host MySQL.

## Phase 2: PHP API + MySQL host
When a suitable PHP host is selected, deploy a REST-style API on a separate HTTPS origin. Configure CORS for the exact frontend origins; CORS is not authentication.

Suggested endpoints:
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/logout
- GET /api/v1/me
- GET /api/v1/projects
- POST /api/v1/projects
- GET /api/v1/projects/{id}
- PUT /api/v1/projects/{id}
- DELETE /api/v1/projects/{id}
- POST /api/v1/projects/{id}/assets

## Shared schema
- users: internal ID, normalized unique email, unique username, password hash, timestamps.
- sessions: user ID, hash of random session token, expiry and revocation timestamps.
- projects: owner user ID, app key (pixelforge; later flow or arcade), name, format version, dimensions, private storage key, timestamps.
- project_assets: project ID, type, private storage key, MIME type, byte size and checksum.
- project_versions: project ID, version number, storage key and creation time.

Use InnoDB, utf8mb4, foreign keys, indexes and schema migrations.

## Security requirements
- Never place MySQL credentials in browser JavaScript or Git.
- Keep production secrets outside the public web root.
- Use PHP password_hash() and password_verify().
- Use PDO prepared statements for SQL values.
- Use random opaque session tokens; store only token hashes. Cookie sessions should use Secure, HttpOnly and an appropriate SameSite policy; protect cookie-authenticated writes against CSRF.
- Validate and limit request bodies and uploads; do not trust client filenames or MIME declarations.
- Store private files outside the public web root where possible and authorize downloads through the API.
- Rate-limit authentication attempts and back up both database and project files.

## Local-first synchronization
Local drafts should work without login. Cloud sync should be opt-in. Track local and server versions; show a conflict instead of silently overwriting newer data.

## Hosting checklist
Before selecting a host, verify the current plan allows PHP, persistent MySQL, HTTPS, uploads, API endpoints and cross-origin requests; check quotas, backups, terms and whether payment information is required. Do not enable cloud accounts until a host passes these checks.