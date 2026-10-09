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

**Status:** Passed (2026-10-09). The candidate commit was pushed to `main`, deployed by GitHub Pages, and tested against the live site before the release metadata commit was prepared. The release tag points to the final commit that was deployed and rechecked at the same URL.

**Production URL:** <https://frbread7.github.io/pmicbook/><br>
**Candidate site commit:** `210a3fb969e6a8847973517b3388d44ece26acc6`<br>
**Candidate Pages run:** [37939495837](https://github.com/frbread7/pmicbook/actions/runs/37939495837) — successful build and deployment; GitHub API reported `status: built`.<br>
**Release:** annotated tag `v1.1.0`; it points to the final production-validated commit.<br>
**Configuration:** `main` branch, repository root (`/`), GitHub-managed project-site domain, HTTPS enforced, no CNAME.

The release commit was pushed and its Pages deployment completed before the final live browser pass. The release tag was created only after that pass. It contains the same HTML, CSS, JavaScript, and generated site metadata as the candidate commit above, plus release documentation, README version status, and the QA harness timing correction described below.

### Live browser and route checks

The dependency-free `tools/browser_qa.mjs` harness used headless Chromium against the deployed URL. All **53 HTML routes** loaded. Four representative Korean/English mobile routes had no horizontal overflow. The route and interaction sweep reported `issues: []`: no HTTP or network errors, runtime exceptions, console errors, broken canvases, KaTeX error nodes, or project-path navigation escape.

The live pass exercised drawer open/close, Escape and focus return, drawer chapter navigation, previous/next, TOC fragments, English/Korean round-trip, compatibility redirect, light/dark persistence, chapter quiz feedback, final 20-question quiz and retry, LDO, converter, BCD stepper, wafer lifetime model, and Deal–Grove orientation and thickness outputs. Observed oxidation checks were a (111)/(100) `B/A` ratio of 1.68, default/(100) ratio of 1.0, and 100-minute outputs of 38.49 nm dry and 388.32 nm wet at 1000 °C.

### BCD process lab checks

Both languages rejected hostile 100-step lithography shares and malformed Base64/JSON, unknown-operation, unknown-field, and oversized fragments with a localized notice and the default eight-step sequence. The 32-step share boundary was accepted and 33 steps rejected. Single-step anneal and oxidation boundaries in fine/standard/wide domains accepted at their computed limits (N2 at 1200 °C: 3/14/108 s; wet oxidation at 800 °C: 89/178/447 s) and rejected at +1 s. Maximum 1200 °C anneals and 16 repeated hostile anneals were rejected across all domains and ambients.

The original end-to-end lab timer included navigation, CDN resources, font loads, the `load` event, and the state read. It recorded up to 2.61 s in some Korean maximum-anneal cases, despite correct fallback state. An isolated DevTools probe separated the browser timings: the live hostile 100-step state reached DOMContentLoaded in 1.34–1.72 s and `load` in 1.51–1.87 s; reading the restored eight-step state took 7.7–148.5 ms after load. The local project-path-mapped run reached DOMContentLoaded in 1.24–1.34 s and `load` in 1.36–1.48 s, with the same safe state and a 6–125.6 ms state read. The harness now checks the state directly and enforces finite 5 s page-load and 6 s navigation-command limits instead of treating a 2 s network-inclusive measurement as a simulator failure.

All seven lab presets in both locales loaded; shareable presets reloaded to their original step count, while the local-only LOCOS sequence displayed its share-limit explanation. The injected diagnostic exception and blocked request were detected and attributed to their test page; the diagnostic harness reported no unexpected issues. One isolated probe saw a transient HTTP 503 for the GitHub Pages stylesheet on a simple route; an immediate `curl` check returned HTTP 200 and the repeated Chrome probe logged 22/22 successful requests for both the simple and hostile routes. The final full browser sweep and final lab suite reported no unexpected request failures.

### Limitations and test boundaries

The checks establish browser behavior for the tested routes, inputs, and current Chrome environment. They do not make the educational process models foundry-accurate or constitute accessibility certification. KaTeX, selected visualization resources, and fonts still use public CDNs and can be unavailable on restricted or offline networks. The simulator limits bound share-link replay work; the process engine remains a simplified educational model.
