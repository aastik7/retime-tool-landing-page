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


## Enable GitHub Pages while keeping the repository private

GitHub Pages for a private personal repository requires GitHub Pro. The repository stays private, while the published website is public so it can be embedded in Superhive.

1. Open https://github.com/aastik7/retime-tool-landing-page/settings/pages.
2. If GitHub displays an upgrade prompt, GitHub Pro is required before continuing.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**. The deployment workflow is already in this repository.
4. Open https://github.com/aastik7/retime-tool-landing-page/actions/workflows/pages.yml.
5. Click **Run workflow**, choose the **main** branch, and click **Run workflow** again.
6. Open the run and wait for **Publish landing page** to finish successfully.
7. Open the website at https://aastik7.github.io/retime-tool-landing-page/. This URL works after the first successful deployment.
8. Open that URL in a private/incognito browser window to confirm visitors can view it without signing in.

The workflow uploads only `dist/`. Future pushes to `main` that change `dist/` deploy automatically. Changes to the guide or workflow can be deployed manually using the same **Run workflow** button. GitHub repository visibility and website visibility are separate settings.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
