# PMICBook v1.0 production QA

**Deployment date:** 2026-10-06<br>
**Production URL:** <https://frbread7.github.io/pmicbook/><br>
**Code-bearing commit browser-tested:** `6260e6bb1d36a2f991896340098070d937a25be0`<br>
**Release:** `v1.0.0` (the documentation-only release tree was pushed, deployed, and smoke-checked again before tagging)<br>
**GitHub Pages:** `main` branch, repository root (`/`), GitHub-managed project-site domain, HTTPS enforced<br>
**Pages build:** [run 37391912727](https://github.com/frbread7/pmicbook/actions/runs/37391912727) — successful; GitHub API reported `status: built`.

## Domain and project-path audit

The published site is served below `/pmicbook/`. Browser requests and generated page metadata use that project path. No root-relative internal HTML, CSS, or JavaScript asset/navigation paths were found. The fork contains no `CNAME`; Pages reports `cname: null`. Therefore no ProcessBook custom domain was removed from this tree, no custom domain was configured, and no DNS was changed. The ProcessBook domain remains only in historical/license context where its attribution is relevant.

The live `robots.txt`, `sitemap.xml`, favicon, social preview image, shared stylesheet, and common JavaScript returned HTTP 200. The sitemap has 52 indexable entries (the 25 English chapters, 25 Korean chapters, and two home routes); the non-indexed `chapters/resist.html` compatibility redirect points to lithography. All canonical and Open Graph URLs identify PMICBook at the project-site path.

## Browser and route checks

Chrome headless 150 was used against the deployed URL at a 1280×900 desktop viewport.

- All **53 HTML routes** (home pages, 25 English chapters plus the compatibility route, and 25 Korean chapters) loaded with a title and site CSS. The live HTTP/metadata pass returned 200 for every route and found no canonical/Open Graph path mismatch.
- The browser sweep found **zero HTTP errors, failed network requests, unhandled runtime exceptions, console errors, or KaTeX error nodes**. All 78 canvases found across loaded routes had nonzero dimensions.
- Table-of-contents anchors updated the page fragment; chapter previous/next links navigated from Chapter 02 to Chapter 03; the English/Korean switch pointed to the matching lesson under `/pmicbook/`.
- Light/dark theme switching and chapter drawer open/close worked.
- At a 390×844 mobile viewport, Korean fundamentals, integration, and lab pages had no horizontal overflow. The drawer opened and closed on Escape.

## Interactive checks

- Fundamentals LDO estimate rejected `Vin = 2 V, Vout = 3.3 V` and suppressed power/efficiency values with a localized warning.
- The LDO pass-path model rejected an input at or below the output. The buck/boost explorer returned 50% ideal duty and 1.2 A peak-to-peak ripple for a valid 12 V-to-24 V boost example.
- The integration threshold model changed from `0.071 V` to `0.768 V` when the illustrative oxide-thickness control moved to 10 nm; its canvas was drawn.
- Integration quiz wrong/correct paths applied the corresponding feedback and disabled answered options.
- The BCD nLDMOS lab preset produced an eight-step share state; reloading its fragment restored the same sequence. A malformed fragment showed the localized invalid-link notice, loaded the default eight-step preset, and produced no runtime exception.
- `python3 tools/check_site.py` passed local-link and fragment checks, 25 paired chapters, 53 routes, IDs, input/quiz parity, and inline JavaScript syntax.

## Fixes and limitations

Publication changes were limited to enabling Pages and updating deployment, release, and review documentation. No site-code, chapter-content, or simulator fix was needed: all route, asset, metadata, and representative interaction checks passed. The README now records the production URL and stable version; the architecture audit describes the completed deployment rather than the pre-publication state.

The site remains a static educational textbook. Simulator values and cross-sections are illustrative and are not foundry recipes, TCAD, signoff models, or qualification guidance. KaTeX, selected visualizations, and web fonts load from public CDNs, so those features can be unavailable on restricted or offline networks. Pages has no custom domain or content-management workflow.

## PMICBook v1.1.0 production QA

**Status:** Pending. The v1.1.0 candidate has not yet been pushed and verified at the live Pages URL. Do not treat local browser results as production validation. This section will record the exact tested commit, Pages deployment result, live route and browser checks, date, and any limitations after the candidate is deployed.
