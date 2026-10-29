# Retime Tool landing page

A responsive light/orange product page based on the supplied Lazy Realism FX reference. The hero and first three feature cards use actual Blender Graph Editor recordings. The fourth card is an explicitly labeled, interactive undo/redo illustration.

## Local preview and export

Run `npm run dev` and open http://localhost:5173. No dependencies or build step are needed to serve `dist/`.

Run `node build-standalone.mjs` to rebuild `retime-tool-standalone.html`. The export includes CSS, JavaScript, all three MP4 files, and all three WebP posters as data URLs, so it can be opened directly without a server or companion media folder. The live clip is reused in the hero and live feature. All six source media files must exist and be nonempty; a missing asset fails the build before replacing the previous export. External purchase/support/license links still require internet access.

The hosted page uses only relative media paths. Keep the deployment contents together in `dist/`. Rebuild the standalone file after changing content, styles, configuration, or media. Nothing in this build script publishes the page.

## Typography and responsive layout

Explanatory copy is 18 px on desktop and 17 px on phones, with 1.7 line spacing. Captions use 15 px; labels, metadata, keycaps, and footer details never drop below 14 px. Secondary copy uses darker neutral colors. Headings have their own scale and tighter spacing. Narrow layouts stack instead of reducing text size, and shortcuts wrap within their table cells.

The readability pass checked every rendered text node, including expanded FAQs, at 320, 390, 768, and 1280 px: no text below 14 px, no horizontal text overflow, and sufficient contrast on the authored solid backgrounds. Native Blender UI inside recordings retains its recorded size; use the player's fullscreen control for closer inspection. The tiny decorative frame numbers in the undo illustration were removed; the readable history status explains the interaction.

## Media and capture provenance

| File in `dist/media/` | Placement |
| --- | --- |
| `retime-live.mp4`, `retime-live-poster.webp` | Hero and live retiming feature; 1440 × 854, five-second clip |
| `retime-ease.mp4`, `retime-ease-poster.webp` | Ease controls feature |
| `retime-smooth.mp4`, `retime-smooth-poster.webp` | Smooth zones feature |

The capture work uses the supplied, original Retime Tool 2.4.2 `__init__.py` from `Retime Tool (Maya Style) (4).zip`, loaded into memory in a disposable Blender 5.0.1 session with temporary configuration. These are source demonstrations with Blender's native Graph Editor and real F-curves, not reconstructed browser editor graphics. Capture scripts and audit material are outside this deployable repository, at `../media-work/retime-audit/`; factual findings are in `audit-findings.txt` and the original source copy is `__init__.py`.

**Supported requirement remains Blender 5.2+.** The extension manifest declares `blender_version_min = "5.2.0"`; Blender 5.0.1 rejects installation of that package. Loading the source into a disposable older runtime for capture bypasses the package version check and does not establish support for 5.0.1. It also does not replace testing the packaged extension on a supported Blender version. Do not advertise the capture runtime as expanded compatibility. Keep these capture details in developer documentation, outside customer-facing copy.

All videos have native controls, loop, muted playback, inline playback, posters, and explicit recording descriptions. Feature videos preload nothing until playback; the hero preloads metadata. Only the hero can autoplay, and only with reduced motion off, while at least 12% visible and the document is active. Manual hero pause persists when scrolling away and back; autoplay policy failures leave playback under native controls. All clips pause offscreen or in a hidden document. Feature clips never restart automatically. Switching to reduced motion stops the hero; playback can still be started manually. No continuous animation loop runs for the undo illustration.

## Links and product facts

Edit `RETIME_CONFIG` at the top of `dist/app.js`:

- `productUrl`: exact Superhive product URL, currently empty pending the creator's URL. Purchase prompts lead to the price section until supplied; the final action clearly says the listing link is coming soon.
- `supportEmail` or `supportProfile`: actual creator-supplied contact only. The support link remains hidden while these are empty.

Price is the creator-provided **$2**, not a value derived from the extension ZIP. Version **2.4.2**, **Blender 5.2+**, Graph Editor and Dope Sheet support, and **GPL-3.0-or-later** match the supplied package. No invented contact, external redirect, analytics, cookies, external fonts, or third-party scripts are included.

The page follows the source audit on these details:

- With just one marker, dragging offsets all keys on the included editable, unlocked curves. Curve selection differs from key selection. Outside smoothing zones, exterior keys follow the nearest outer marker's offset; stationary outer markers leave exterior keys stationary.
- Smoothing changes nearby **key timing**, potentially by more than one frame with wide zones. The marker guide remains where dropped.
- Each newly completed retime becomes the latest live smoothing target. Undo, redo, or actual insertion of new keys clears that target; existing zones apply to the next drag. Adding/deleting markers does not clear the cached mapping: complete another retime after changing the marker set before adjusting smoothing.
- Ease parameters return to neutral on release while their timing changes stay baked. Enter accepts only while idle: release the drag first. X/Delete removes selected markers, and double-click or Ctrl+Click creates a marker. Session markers disappear on exit.

## Superhive embedding

Open `/?embed=1` for the product-description layout. It hides the outside-site header, repeated purchase prompts, price/purchase panel, and footer navigation. A compact navigation labeled “In this description” links only to sections inside the iframe. It does not access, resize, scroll, or redirect the parent Superhive page. The compatibility strip still states the creator's $2 price.

Copy `superhive-embed.html` into a Superhive field that accepts iframe HTML. It uses the existing address `https://aastik7.github.io/retime-tool-landing-page/?embed=1`, width `100%`, and a **starting height of 12000 px** for the larger typography. Local default-FAQ measurements range from about 7400 px on a wide desktop to 11600 px at a 320 px viewport; at 720 px the page is about 9750 px tall. This is a starting point, not a verified final height in Superhive. Adjust excess space for the actual listing width and check expanded FAQs. The iframe retains normal internal scrolling. The snippet does not enable hosting or change Superhive/account settings.

## Verification handoff

Check the regular and embed layouts at desktop and narrow mobile widths, native player loading/play/pause/fullscreen, offscreen and hidden-document pause, manual pause persistence, reduced-motion startup and preference changes, mobile menu Escape handling, keyboard use of native players and undo buttons, shortcut filtering/no-results, and native FAQ keyboard toggles. Check the standalone file offline after all final media is supplied. Verify the iframe height and host's iframe support in the real Superhive description before publishing.
