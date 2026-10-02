# Current milestone: PMICBook v1

**Status:** Validation complete; milestone commits and push are in progress. This document defines only the work required to deliver PMICBook v1. The remaining unchecked item is not complete yet.

## Outcome

Deliver a coherent, usable, interactive PMIC and BCD textbook by transforming the ProcessBook fork in place. Preserve useful static-site learning and process-visualization capabilities, adapt relevant process material, validate the site, document reuse, and push the finished work to the PMICBook fork.

## v1 delivery checklist

- [x] Establish PMICBook branding, chapter registry/order, responsive navigation, themes, metadata, and deployment instructions on the existing static site.
- [x] Implement the architecture in [PMICBook architecture](PMICBOOK_ARCHITECTURE.md), or a coverage-equivalent map with explicit prerequisite and disposition updates.
- [x] Deliver complete English and Korean versions of each subject chapter with a same-chapter language switcher, localized site navigation, metadata, model labels, and knowledge checks.
- [x] Cover PMIC systems and specifications; references, bias and LDOs; switching and power-path circuits; PMIC-relevant semiconductor devices; BCD; HV MOS/LDMOS; and integrated passives.
- [x] Adapt relevant substrate, well/isolation, oxidation/dielectric, lithography, etch, deposition/epitaxy, implant, anneal, CMP, contact, metal, and integration material around educational BCD examples.
- [x] Retain and adapt the useful process cross-section/stepper for explicitly limited 2D educational examples; do not present it as TCAD or a foundry recipe.
- [x] Cover layout, parasitics, thermal behavior, noise/EMI, characterization and production test, reliability, failure analysis, and bounded advanced context.
- [x] Provide a useful PMIC/BCD glossary, cross-links, summaries, and knowledge checks.
- [x] Make each simulator answer a stated engineering question; document assumptions, units, input ranges, and model limits. Use public sources or label values as illustrative.
- [x] Preserve MIT code notices and CC BY 4.0 attribution for retained or adapted educational material, including translations and modifications.
- [x] Update README/setup, attribution, references, metadata, sitemap, robots, and domain/deployment files for the derivative project; keep GitHub Pages settings unchanged.
- [x] Validate local links and assets, chapter/navigation consistency, equations, representative interactive controls and boundaries, quizzes, themes, responsive layouts, and browser console behavior. Record skipped checks and limitations.
- [ ] Make coherent milestone commits, push intended changes to `https://github.com/frbread7/pmicbook`, and finish with a clean working tree.

## Validation evidence

- `python3 tools/check_site.py`: passed for 25 paired chapters and 53 HTML routes, checking local links/fragments, unique IDs, bilingual input/quiz parity, and inline JavaScript syntax.
- `python3 tools/head.py`: generated 52 sitemap routes; a second generation produced identical output across 54 metadata files. Canonical URLs, reciprocal `en`/`ko`/`x-default` links, Open Graph identity, and JSON-LD parsing were checked.
- JavaScript syntax checks passed for shared scripts and executable inline scripts in the lab, fundamentals, and every Korean chapter. A mixed Hangul/ASCII identifier scan and an HTML control-character scan found no remaining issues.
- `git diff --check` and local Markdown-link checks passed. `LICENSE-MIT` and `LICENSE-CC-BY-4.0` are unchanged from the upstream baseline.
- Final desktop Chromium sweep: 53/53 routes loaded; zero timeouts, console/runtime errors, HTTP/CDN failures, or KaTeX parse errors; all 76 visible canvases rendered; 374 KaTeX nodes rendered.
- Mobile Chromium checks at 390 px found no horizontal overflow on Korean fundamentals, integration, and lab routes; chapter drawer, locale switching, and theme controls worked. Lab share-state validation/rendering, simulator boundaries, quizzes, and representative charts were also checked.
- Targeted Korean oxidation interaction changed the field-oxide readouts from 300/355/290/140 nm to 360/431/340/170 nm when the time control moved from 40 to 55 minutes; strip toggle updated the canvas without runtime errors.
- The fundamentals estimator suppresses all power/efficiency values for invalid `Vin = 2 V, Vout = 10 V` and shows a localized warning; a valid 5 V to 3.3 V point reports 500.5/330.0/170.5 mW and 65.9% efficiency.
- A forged lab fragment with HTML in restored labels/descriptions renders the markup as text. Forced `history.replaceState` failures show distinct localized save errors and preserve diagnostic details; normal 53-route runs have no console errors.
- The fork's GitHub Pages configuration remains unchanged and unconfigured. No pages were published.

## Scope boundary

This milestone excludes RAG, internal or workplace knowledge, document ingestion, vector/graph databases, knowledge-graph UI, enterprise cases or collaboration, user accounts, Yield-RCA integration, additional semiconductor books, a generalized semiconductor library, and `semibook-core`. Future ideas belong in [VISION.md](VISION.md); adding an idea there does not change this milestone.

## Completion evidence

The final delivery report records the fork, baseline/tag, chapters and interactions delivered, attribution status, validation evidence, deployment status, limitations, and deferred work. See [BASELINE_VALIDATION.md](BASELINE_VALIDATION.md) for the pre-transformation ProcessBook evidence; it is not evidence that PMICBook features are complete.
