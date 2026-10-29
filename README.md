# Retime Tool landing page

A responsive light/orange product page based on the supplied Lazy Realism FX reference. The hero and first three feature cards use guided, annotated actual Blender Graph Editor footage, prepared from the existing raw capture screenshots. The fourth card is an explicitly labeled, interactive undo/redo illustration.

## Local preview and export

Run `npm run dev` and open http://localhost:5173. No dependencies or build step are needed to serve `dist/`.

Run `node build-standalone.mjs` to rebuild `retime-tool-standalone.html`. The export includes CSS, JavaScript, and all nine guided assets as data URLs: three MP4 clips, three animated WebPs, and three static WebP posters. The marker guide is reused in the hero and live retiming feature. The builder checks every guided triplet and the six preserved original capture assets for readable, nonempty files before replacing the previous export. It also requires all nine guided assets to be referenced in the page and rejects unresolved local media references. Only referenced media is embedded; originals remain in `dist/media/` for provenance. External purchase/support/license links still require internet access. The current standalone export is 6,626,934 bytes (6.32 MiB).

Both player attributes (`src` and `poster`) and direct format links (`href`) are converted to data URLs in the standalone file. Its format links contain the embedded media bytes, so they do not need a companion folder; browser policies can still restrict opening data URLs in a new tab. Use the hosted page's relative file links for sharing direct media URLs or adding images to Superhive.

The hosted page uses only relative media paths. Keep the deployment contents together in `dist/`. Rebuild the standalone file after changing content, styles, configuration, or media. Nothing in this build script publishes the page.

## Typography and responsive layout

Explanatory copy is 18 px on desktop and 17 px on phones, with 1.7 line spacing. Captions use 15 px; labels, metadata, keycaps, and footer details never drop below 14 px. Secondary copy uses darker neutral colors. Headings have their own scale and tighter spacing. Narrow layouts stack instead of reducing text size, and shortcuts wrap within their table cells.

The final guided layout was checked at 320, 390, 768, and 1280 px: no page-level horizontal overflow or authored DOM text below 14 px. Animated WebP assets are not fetched before their links are opened. The guides magnify the captured Graph Editor region and add explanatory annotations. Native player fullscreen remains available for closer inspection. The tiny decorative frame numbers in the undo illustration were removed; the readable history status explains the interaction.

## Media and capture provenance

| Guided files in `dist/media/` | Placement and explanation |
| --- | --- |
| `retime-marker-guide.mp4`, `retime-marker-guide.webp`, `retime-marker-guide-poster.webp` | Hero and live retiming feature. Moving the middle marker right slows the left span and speeds up the right span. |
| `retime-ease-guide.mp4`, `retime-ease-guide.webp`, `retime-ease-guide-poster.webp` | Ease controls feature. A blue ease handle affects only its own half of the span. |
| `retime-smooth-guide.mp4`, `retime-smooth-guide.webp`, `retime-smooth-guide-poster.webp` | Smooth zones feature. Nearby key timing changes while the marker stays fixed. |

Each triplet contains an MP4 player source, an animated WebP for manual opening or Superhive image use, and a separate static WebP player poster. All three guides are **1200 × 1200, 7.8 seconds**. MP4s are H.264, 15 fps / 117 frames, `yuv420p`, with faststart and no audio. Animated WebPs use quality 70, infinite looping, and a 10 fps timeline; identical held frames are merged while preserving their durations. Posters are single-frame WebPs. Every authored title, phase caption, badge, legend, and footer uses **66 px type** at the 1200 px source width. At the minimum **271 px actual player width** inside the 320 px embed layout, that is **66 × 271 / 1200 = 14.905 px** (15.125 px at a 275 px player). Captions wrap without shrinking; the taller canvas preserves the original footage scale and gives annotations room. The four HTML players and CSS use the matching square aspect ratio, so the footage fills the player width. Native Blender UI text remains in its original capture. Review the actual 271 px poster and decoded video files in `../media-work/retime-explainers/phone-review/`; a 390 px viewport screenshot is not a substitute for that check.

| Guide | MP4 bytes | Animated WebP bytes | Static poster bytes |
| --- | ---: | ---: | ---: |
| Marker timing | 323,245 | 574,304 | 53,408 |
| Independent ease | 173,110 | 341,892 | 51,026 |
| Smooth timing | 155,288 | 302,572 | 49,126 |

Rebuild the guided media with `python ../media-work/scripts/retime_explainers.py` from this directory. It uses the supplied Pillow library and `C:/yt-dlp/ffmpeg.exe`, never launches Blender, and writes review frames plus an exact source/output manifest to `../media-work/retime-explainers/`. `--metrics-only` refreshes output metrics from existing encodes; it does not render or establish their annotation size. The compositor asserts every authored label is 66 px and lies within the canvas; the per-guide `*-text-audit.json` files record its labels and bounds. After rebuilding media and the standalone, run `python ../media-work/retime-explainers/p2_verify.py` to verify all nine outputs, all 225 preserved source-frame hashes, all six preserved original-media hashes, matching raw loop endpoints, encoded dimensions/format/faststart, static posters, and standalone media references. It decodes the media into `decoded-review/` and writes actual 271 px poster/MP4/WebP review images to `phone-review/`, with results in `checks.json`. The manifest records every original source-frame hash and the original MP4 hash. Each loop holds the authentic start for 1.2 seconds, shows the outward drag for 2.47 seconds, holds its authentic result for 2.13 seconds, labels the source return motion as a replay reset for 1.4 seconds, and holds the clean reset for 0.6 seconds. The smooth guide's graph and lower control strip are two crops of the same source frame. No new software behavior or result is synthesized.

The guides are edited sequences assembled from the existing raw Blender screenshots. They magnify actual captured Graph Editor content and add instructional annotations. Preserve the original capture screenshots in the audit workspace and the original recordings and posters in `dist/media/`: `retime-live.mp4`, `retime-live-poster.webp`, `retime-ease.mp4`, `retime-ease-poster.webp`, `retime-smooth.mp4`, and `retime-smooth-poster.webp`. The guided assets supplement those originals. The builder reads and validates originals without rewriting or deleting them.

The capture work uses the supplied, original Retime Tool 2.4.2 `__init__.py` from `Retime Tool (Maya Style) (4).zip`, loaded into memory in a disposable Blender 5.0.1 session with temporary configuration. These are source demonstrations with Blender's native Graph Editor and real F-curves, not reconstructed browser editor graphics. Capture scripts and audit material are outside this deployable repository, at `../media-work/retime-audit/`; factual findings are in `audit-findings.txt` and the original source copy is `__init__.py`.

**Supported requirement remains Blender 5.2+.** The extension manifest declares `blender_version_min = "5.2.0"`; Blender 5.0.1 rejects installation of that package. Loading the source into a disposable older runtime for capture bypasses the package version check and does not establish support for 5.0.1. It also does not replace testing the packaged extension on a supported Blender version. Do not advertise the capture runtime as expanded compatibility. Keep these capture details in developer documentation, outside customer-facing copy.

All videos have native controls, loop, muted playback, inline playback, static posters, and visible captions identifying guided, annotated actual Blender footage. Feature videos preload nothing until playback; the hero preloads metadata. Only the hero can autoplay, and only with reduced motion off, while at least 12% visible and the document is active. Manual hero pause persists when scrolling away and back; autoplay policy failures leave playback under native controls. All clips pause offscreen or in a hidden document. Feature clips never restart automatically. Switching to reduced motion stops the hero; playback can still be started manually. No continuous animation loop runs for the undo illustration.

Every guide caption is followed by visible **Animated image version** and **Open full-size clip** links for that guide. Animated WebPs are linked only: no `img`, poster, or other page element loads them automatically. With reduced motion enabled, the page therefore retains static posters and manual video playback. Opening an animated WebP is a separate, explicit action; the video's pause controls and reduced-motion handling do not control that image in a separate tab.

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

Copy `superhive-embed.html` into a Superhive field that accepts iframe HTML. It uses the existing address `https://aastik7.github.io/retime-tool-landing-page/?embed=1`, width `100%`, and a **starting height of 13000 px**. Final default-FAQ measurements are about 9100 px at 1280 px, 11300 px at 768 px, 11550 px at 390 px, and 12600 px at 320 px. Adjust the height for the actual listing width and expanded FAQs; these are local measurements rather than an account-editor test. Normal iframe scrolling remains available.

The iframe URL is unchanged, so existing embedded pages receive the updated guides automatically.

For Superhive's direct image workflow, use the matching `retime-{marker,ease,smooth}-guide.webp` file through the **Animated image version** link. After deployment, its direct hosted `.webp` URL is the image URL to copy; use the file upload route when the destination accepts an animated WebP upload. Verify animation support in the actual listing editor. The **Open full-size clip** link points directly to the corresponding video file for viewing or downloading. A static `-poster.webp` file is the still preview, and the HTML page/iframe URL is the full interactive description. Do not paste the standalone export's data URLs as public image addresses.

## Verification handoff

Check the regular and embed layouts at desktop and narrow mobile widths, native player loading/play/pause/fullscreen, offscreen and hidden-document pause, manual pause persistence, reduced-motion startup and preference changes, mobile menu Escape handling, keyboard use of native players and undo buttons, shortcut filtering/no-results, and native FAQ keyboard toggles. Confirm all four placements show the correct guide, static poster, instructional caption, animated WebP link, and MP4 link. Confirm no animated WebP is fetched before its link is opened. Check final media metrics and original-source preservation, then build and check the standalone file offline, including its embedded link targets. Verify the iframe height, iframe support, and direct animated WebP behavior in the real Superhive description before publishing.


Optional direct About fragments: `superhive-video-clips.html` uses controllable MP4 players with static posters; `superhive-image-clips.html` uses continuously animated WebP images without pause controls. Both use only the tags and attributes listed in https://support.superhivemarket.com/article/280-customizing-your-content. No Superhive account editor was changed.
