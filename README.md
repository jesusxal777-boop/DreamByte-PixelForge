# DreamByte PixelForge

A browser-based pixel art editor by DreamByte Studios. Designed for desktop and touch devices, with local-first editing and a future PHP + MySQL cloud backend.

## Status
Starter prototype. The first version includes a pixel canvas, pencil, eraser, fill, color picker, palette, undo/redo, grid toggle and PNG export. Layers, animation, IndexedDB projects and cloud accounts are future milestones.

## Run locally
Open index.html in a modern browser. No build step is required.

## Hosting
The frontend can be published on GitHub Pages. GitHub Pages serves static files only; it does not execute PHP or host MySQL. Cloud features will be added after selecting a compatible PHP host.

## Security
- Never commit database credentials or secrets.
- Route all database access through a PHP API over HTTPS.
- Hash passwords with PHP password_hash() and verify with password_verify().
- Enforce project ownership and use PDO prepared statements.
- Keep private project files outside the public web root when possible.

See docs/architecture.md for the database integration plan.