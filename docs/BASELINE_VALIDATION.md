# ProcessBook baseline validation

**Date:** 2026-10-02
**Upstream baseline:** `geniuskey/processbook` commit `0bc4314d1e13c485a658e0cb1d4fd237b5fc8dff`
**Reference tag:** `upstream-processbook-baseline`

This report records the unmodified fork before PMICBook changes.

## Run and browser checks

The documented static-server command works. Port 8000 was already serving an unrelated API, so validation used `python3 -m http.server 18321 --bind 127.0.0.1` without changing that listener. The home page and representative chapter routes returned HTTP 200.

Headless Chrome 150 loaded the home page and chapters `overview`, `litho`, `integration`, `lab`, and `advanced`:

- The home page generated all 16 chapter cards and the shared navigation drawer listed 17 destinations (home plus chapters).
- Chapter pages generated the table of contents and previous/next links. The overview page linked to `wafer.html`; the CMOS integration page linked between `metal.html` and `advanced.html`.
- KaTeX rendered equations on representative chapter pages. `OPT` initialized on the lithography chapter; `THREE` initialized on the advanced chapter.
- The home-page process illustration, overview cross-section widgets, 61-step CMOS integration cross-section, and process-lab widget created canvases. Advancing the overview and integration steppers updated the displayed process step.
- The overview quiz accepted a correct answer. The theme control switched between dark and light themes.
- At a 375 px mobile viewport, the overview page had no horizontal overflow (`documentElement.scrollWidth` was 375 px).
- No JavaScript runtime exceptions or browser-console errors were observed on the checked pages.

## Limits

This is a representative baseline smoke check, not a full audit of every simulator input or every chapter. The original site depends on external CDNs for KaTeX, fonts, and Three.js; browser checks were performed with network access available. The upstream README documents the no-build static-site workflow.
