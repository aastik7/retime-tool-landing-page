# Retime Tool landing page

A compact, visual product page for the complete **$2 Retime Tool**, version **2.4.2**, for **Blender 5.2+**, in the **Graph Editor and Dope Sheet**, under **GPL-3.0-or-later**.

The art direction uses solid near-black `#101218`, orange `#ff6b2b` purchase panels, cyan `#5ee8ed` demo controls, and lime `#d5ff59` badges/checks. The hero shows the preserved wide Blender capture, with the price and CTA before the media on phones. The three annotated demos share a large, accessible scene switcher. Detailed controls, installation, scope, and timing limits start collapsed. The old duplicate marker player, undo illustration, and repeated workflow/problem copy have been removed.

## Local preview and export

Run `npm run dev` and open `http://localhost:5173`. The dependency-free server serves `dist/`; set `PORT` to select a different port. Reuse an existing server when one is already running.

Run `node build-standalone.mjs` after changing HTML, CSS, JavaScript, or configuration. This rebuilds `retime-tool-standalone.html`; it does not publish anything. Keep the stylesheet and deferred script tags in `dist/index.html` synchronized with the builder's exact replacements.

The standalone contains inline CSS/JavaScript and **11 unique embedded media assets**: the original wide live MP4 and static poster plus all nine guided assets. All quoted local `src`, `poster`, and direct-format `href` references are embedded, including fallback links. The current export is **6,087,507 bytes / 5.81 MiB**, with 19 embedded references. The build checks all nine guides and all six preserved original assets before replacing the export and rejects unresolved local media references. A byte-hash check confirmed every embedded reference matches its source file.

The hosted page uses relative paths. Keep all contents of `dist/` together. Standalone format links contain data URLs; browsers can restrict opening those in a new tab. Use hosted relative media URLs when sharing clips or adding an image to Superhive. External purchase/support/license destinations require internet access.

## Configuration and purchase state

Edit `RETIME_CONFIG` at the top of `dist/app.js` using creator-confirmed values only:

- `productUrl`: currently empty. Start/middle purchase prompts lead to `#get-retime`. The final action has no destination, is marked disabled, and says **Superhive link coming soon**; the visible status says **Buy link coming soon**.
- `supportEmail` and `supportProfile`: currently empty. Contact support stays hidden until a real contact is supplied.

A configured product URL enables the purchase links with safe HTTP(S) validation and external-link attributes. No invented redirect, contact, review, sales count, guarantee, analytics, cookies, external fonts, or third-party scripts are included.

## Responsive layout and measurements

Default state: marker scene selected, all details collapsed. Major section gaps are 48px on desktop and 32px on mobile. Body/feature explanations use 16–18px text; secondary DOM text never goes below 14px. At 320px, the guide player is 273px wide, so its authored 66px raster labels render at **66 × 273 / 1200 = 15.015px**. Guide videos remain square and uncropped.

Local T3 browser measurements on 2026-10-31, including the browser's scrollbar:

| Viewport width | Normal height | Embed height | Normal visible words | Embed visible words | Normal hero video top | Guide width |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 320px | 2626px | 2538px | 168 | 157 | 452px | 273px |
| 390px | 2614px | 2497px | 168 | 157 | 458px | 343px |
| 768px | 2097px | 1989px | 191 | 178 | 215px | 389px |
| 1280px | 2399px | 2291px | 194 | 181 | 170px | 678px |

The counts conservatively include visible navigation, symbols, tabs, captions, price metadata, and details summaries; hidden panels/details and the offscreen skip link are excluded. All measured layouts have no horizontal overflow and a minimum visible DOM text size of 14px. At 320 × 568, the original video begins in the first screen at 452px normally and 404px in embed mode. The hero price is 80px on mobile / 106px on desktop; the bottom price is 88px / 112px. Heights change with expanded details, selected scene, browser font metrics, and actual iframe width.

## Media and playback

No media was regenerated or edited during the redesign.

| Preserved media | Use |
| --- | --- |
| `retime-live.mp4`, `retime-live-poster.webp` | Original 1440 × 854 Graph Editor capture in the hero. |
| `retime-marker-guide.mp4`, `.webp`, `-poster.webp` | Marker scene, once. Moving the middle marker right slows the left span and speeds the right span. |
| `retime-ease-guide.mp4`, `.webp`, `-poster.webp` | Independent ease scene. A handle affects only its own half of the span. |
| `retime-smooth-guide.mp4`, `.webp`, `-poster.webp` | Smoothing scene. Nearby key timing changes while the marker stays fixed. |
| `retime-ease.mp4`, `retime-ease-poster.webp`, `retime-smooth.mp4`, `retime-smooth-poster.webp` | Preserved originals retained for provenance and build validation. |

All four MP4 players have native controls, muted/inline looping playback, static posters, accessible labels, and file fallback links. The hero preloads metadata; guides preload nothing. Only the hero can autoplay, with reduced motion off, an active document, and at least 12% visibility. Manual hero pause persists through scrolling away/back. Autoplay rejection leaves native controls available. All clips pause offscreen or in a hidden document; fullscreen visibility is respected. Guide clips never resume automatically, and switching scenes pauses the outgoing guide. Enabling reduced motion stops the hero; manual playback remains available, and turning the preference off does not itself restart it.

Every guide has an explicit **Animated image version** link and **Open full-size clip** link. Animated WebPs are never loaded as page images or posters. Local browser resource checks confirmed zero animated WebP fetches before opening a link. An explicitly opened animated image has its own browser playback behavior, outside the MP4 controls.

The scene switcher uses tabs with selected state, roving focus, Arrow keys, Home/End, and labeled panels. Without JavaScript, all three guides remain visible with native controls. Native details also work without JavaScript. The 14-control table retains trimmed, case-insensitive filtering, empty-result feedback, and live result counts. Direct links to a collapsed timing detail reveal it.

## Audited product facts

- All keys on included editable, unlocked curves are retimed, regardless of key selection. Use visibility filters or Selected Curves Only to set the scope. **With just one marker**, all included curves shift together. Outside smooth zones, exterior keys follow the nearest outer marker's offset; stationary outer markers leave exterior keys stationary.
- Smoothing moves nearby **key timing**, potentially by more than one frame with wide zones or big speed changes. Marker guides remain fixed. The caveat is visible beside the smoothing demo.
- Each completed retime becomes the latest live smoothing target. Undo, redo, or actual insertion of new keys clears it; saved zones apply to the next retime. Adding/deleting markers does not clear the mapping: complete another retime after changing the marker set before adjusting zones.
- Each ease handle affects only its own half. Handles need a span about 60 screen pixels wide. Controls reset to neutral on release while the timing changes stay baked. The half-span and width caveats are visible beside the ease demo.
- Keys can land on subframes. Marker snapping does not round keys; an existing fractional marker can retain its offset.
- Release the drag before Enter to accept and exit as one Blender undo step. Esc restores the starting animation and exits. Right-click during a drag cancels only that drag. Ctrl+Z / Ctrl+Shift+Z traverse retime history, including inserted keys. Session markers disappear on exit.

Price is creator-provided. The package supplies the version, Blender minimum, editor support, and GPL-3.0-or-later license. Installation instructions describe the eventual downloaded extension ZIP; the listing link is still pending.

## Capture provenance

The guides are existing edited sequences of authentic Blender Graph Editor captures with enlarged content and authored annotations. Each is 1200 × 1200 and 7.8 seconds; MP4s are H.264, 15fps / 117 frames, `yuv420p`, faststart, with no audio. The animated WebPs have a 10fps timeline, merged held frames, quality 70, and looping playback. Posters are static single-frame WebPs. Authored titles, phase captions, legends, badges, and footers use 66px source type. Native Blender UI text retains its captured scale.

Existing guide asset sizes: marker MP4 323,245 bytes / animation 574,304 / poster 53,408; ease 173,110 / 341,892 / 51,026; smooth 155,288 / 302,572 / 49,126. Raw recordings, all six original media files, and all 225 preserved source frames remain untouched.

The external audit workspace at `../media-work/retime-audit/` holds the original supplied Retime Tool 2.4.2 source, `audit-findings.txt`, and capture records. Captures used a disposable Blender 5.0.1 source-loading session, which bypasses the package version check and **does not establish compatibility with Blender 5.0.1**. The manifest minimum remains Blender 5.2. Packaged-extension testing on a supported Blender version remains separate from source capture.

The existing media workflow is `python ../media-work/scripts/retime_explainers.py`, followed by `python ../media-work/retime-explainers/p2_verify.py`. Those scripts and media audit outputs are outside this deployable repository and were not changed. They retain text bounds, source hashes, decoded media metrics, faststart checks, and actual 271px poster/video/animation review images. Do not regenerate assets as part of a page-only change.

## Superhive embed and handoff

`/?embed=1` hides only the outside-site header and footer, then adds compact internal description navigation. **Hero, middle, and bottom purchase prompts remain visible**, including both giant prices and the pending final link/status. All internal links stay within the iframe; the page does not access, resize, scroll, or redirect the parent.

`superhive-embed.html` retains its existing URL and now uses a **2700px starting height**, replacing the old 13000px reservation. All three closed-details scenes measured 1963–2637px at 320, 390, 728, 1024 and 1280px widths. Keep normal iframe scrolling for expanded details and allow for browser font differences. Replace the old snippet on Superhive to reduce the reserved empty area; the live listing editor itself has not been changed.

The optional `superhive-video-clips.html` and `superhive-image-clips.html` fragments remain unchanged. The first has native MP4 players/static posters; the second contains continuously animated images. Hosted `.webp` file URLs or uploads are appropriate for direct-image placement if the listing editor supports animation. Do not paste standalone data URLs as public image addresses.

Implementation checks passed: JavaScript/build syntax, standalone rebuild and embedded byte matching, local anchor resolution, no changed media files, four-width normal/embed overflow/type checks, scene click/keyboard behavior, shortcut filtering/no-results, pending checkout/support state, zero unrequested animated-image loads, and manual hero pause persistence. Root owns final visual/browser QA, supported-Blender package tests, actual Superhive editor checks, iframe-height adjustment, and publication. No commits, pushes, hosting changes, or publication were performed.
