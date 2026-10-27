# Retime Tool landing page

A responsive landing page inspired by the supplied Lazy Realism FX reference. All graph demos are original interactive illustrations, not extension recordings.

## Preview

Run `npm run dev` and open http://localhost:5173. No dependencies or build step are required. The deployable site is `dist/`.

For a single-file version you can open directly, run `node build-standalone.mjs` and open `retime-tool-standalone.html`.

## Add your links and recordings

Edit `RETIME_CONFIG` at the top of `dist/app.js`:

- `productUrl`: the exact Superhive product URL, currently empty at the creator's request. All purchase links update together once this is supplied. Until then, purchase buttons lead to the pricing area and the final action clearly shows the link is coming soon.
- `supportEmail` or `supportProfile`: the creator's actual support contact. The support link appears only after a contact is supplied.
- `videos`: optional MP4 or WebM URLs for `hero`, `live`, `ease`, `smooth`, and `undo`. Each recording replaces its corresponding illustration. Videos have playback controls and do not autoplay. Self-hosted video files belong in `dist/`; use relative paths.

Rebuild the standalone file after edits. `dist/styles.css` controls appearance and responsive layouts. `dist/index.html` contains all product content, including limitations and the license link.

No analytics, cookies, forms, external fonts, or third-party scripts. The page respects reduced-motion preferences, includes a pause control, and supports keyboard navigation for the marker, sliders, and editor tabs.

Product facts are supplied by the creator: $2, version 2.4.2, Blender 5.2+, Graph Editor and Dope Sheet, GPL-3.0-or-later.
