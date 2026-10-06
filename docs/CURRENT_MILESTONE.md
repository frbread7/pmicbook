# Current milestone: PMICBook v1.0 publication and production QA

**Status:** Complete (2026-10-06). PMICBook v1.0 is published through GitHub Pages, browser-checked at its project-site path, documented, and tagged `v1.0.0`. See [production QA](PRODUCTION_QA.md) for reproducible deployment evidence and [the v1.1 review backlog](V1_1_REVIEW.md) for deferred opportunities.

## Outcome

Publish the completed PMICBook v1 static site from `main` and the repository root at <https://frbread7.github.io/pmicbook/>. Verify project-subpath navigation and assets, representative interactions, bilingual pages, mobile layout, metadata, and browser/network behavior. Make only publication-blocking corrections, record the release, and stop pending owner review.

## Completion checklist

- [x] Verify the PMICBook fork, clean starting state, upstream relationship, and `upstream-processbook-baseline` tag.
- [x] Configure GitHub Pages for `main` / `/`; confirm GitHub reports the Pages build and deployment as successful.
- [x] Confirm PMICBook uses its `/pmicbook/` project path and has no inherited ProcessBook CNAME or custom domain.
- [x] Check all 53 HTML routes and exercise navigation, bilingual switching, theme/drawer behavior, quizzes, PMIC estimators, integration visualization, and the BCD lab on the live site.
- [x] Record production URL, commit, Pages setup, route/browser results, limitations, CDN dependencies, and corrections in [PRODUCTION_QA.md](PRODUCTION_QA.md).
- [x] Update README with the stable version, live URL, local run instructions, content limits, upstream derivation, license links, chapter scope, and technical documentation.
- [x] Create a selective, prioritized [v1.1 review backlog](V1_1_REVIEW.md); do not implement its P1/P2/P3 items in this milestone.
- [x] Create and push annotated tag `v1.0.0` on the production-validated release commit; create a GitHub Release when available.
- [x] Confirm the final production URL, remote branch/tag, and clean working tree.

## Scope boundary

This milestone publishes and verifies the completed single-book PMICBook v1. It does not authorize v1.1 implementation or broaden product scope. Case-first engineering structure, internal OpenCode overlay, RAG, graph/knowledge systems, additional semiconductor books, and `semibook-core` remain deferred in [VISION.md](VISION.md).
