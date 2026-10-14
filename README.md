# DreamByte PixelForge

A browser-based pixel art editor by DreamByte Studios. Designed for desktop and touch devices, with local-first editing and a planned PHP + MySQL cloud backend.

## Status

Starter prototype. The current version includes a pixel canvas, pencil, eraser, fill, color picker, palette, undo/redo, grid toggle and PNG export. Editable project files, IndexedDB autosave, layers, animation, login and cloud sync are future milestones.

## Run locally

Open `index.html` in a modern browser. No build step is required.

## Hosting plan

The chosen deployment target is InfinityFree, with the frontend and PHP API served from the **same hostname**. This matches InfinityFree's free-hosting restrictions for browser-based JavaScript apps. GitHub remains the source-code repository; GitHub Pages can remain a static preview, but that copy cannot use the InfinityFree API.

See [the InfinityFree deployment guide](docs/INFINITYFREE_DEPLOY.md) and [the architecture plan](docs/architecture.md).

## Security

- Never commit database credentials or secrets.
- Keep the real `api/config.php` only on the hosting account; it is excluded by `.gitignore` and protected by `api/.htaccess`.
- Route database access through PHP over HTTPS.
- Hash passwords with PHP `password_hash()` and verify with `password_verify()`.
- Enforce project ownership and use PDO prepared statements.
- Do not store private user project files in a publicly browsable folder.
