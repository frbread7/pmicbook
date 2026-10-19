# Current milestone: PMICBook v1.2.0 release

**Status:** The v1.2.0 code-bearing commit `7ff37aed666d4d3d6cceeb4948a4199c0daff312` passed local verification and bounded independent scientific review, then deployed through GitHub Pages on 2026-10-19. Its live site passed the bilingual route, model, process-viewer, lab, and source-hash checks in [production QA](PRODUCTION_QA.md). This report records those observations before the final release metadata was prepared. C8 remains deferred P3, and native-speaker/human language naturalness review is not claimed.

The v1.2 scope is recorded in the [technical audit](V1_2_TECHNICAL_AUDIT.md), [content improvement register](V1_2_CONTENT_IMPROVEMENTS.md), [nLDMOS sequence review](NLDMOS_PROCESS_SEQUENCE_REVIEW.md), [device physics note](NLDMOS_DEVICE_PHYSICS.md), and [source evidence register](V1_2_SOURCE_EVIDENCE.md). Local checks include static/content validation, the persistent physics regression, Chrome route and responsive journeys, representative model endpoints, the bilingual process-lab interactions, and the regenerated KaTeX SRI assets. Their exact scope and bounded failures/corrections are in the technical audit. The published v1.1 evidence below remains historical; v1.2 production evidence is in [production QA](PRODUCTION_QA.md).

## Prior milestone: v1.1 technical-quality review and release

**Status:** Complete (2026-10-09). PMICBook v1.1.0 passed the whole-repository review and production browser gates, is published at the project-site URL, and is tagged as a stable release. See [production QA](PRODUCTION_QA.md) for deployment and live-browser evidence.

## Outcome

Review the complete PMICBook v1.0.0 repository, correct valid P0/P1 findings and reasonable in-scope P2 defects, re-review changed areas, validate the production site, and publish v1.1.0. Keep the existing static-site architecture and the v1 product boundary.

## Completion checklist

- [x] Confirm the v1.0.0 starting commit, fork remotes, upstream relationship, and `upstream-processbook-baseline` tag.
- [x] Confirm existing GitHub Pages setup is `main` / `/` at <https://frbread7.github.io/pmicbook/>; retain the project URL and no-custom-domain configuration.
- [x] Independently review technical claims and sources, simulators, English/Korean parity, UI/runtime behavior, accessibility, licenses, and release documentation.
- [x] Correct verified oxidation coefficients/orientation and pressure handling; correct wafer-cleaning and lifetime-model framing; clarify device, implant, anneal, and Korean glossary terminology.
- [x] Repair confirmed faint-text contrast and keyboard drawer interaction issues.
- [x] Resolve and re-test the shared lab-state restore performance finding, including expensive anneal/oxidation boundaries in both locales.
- [x] Re-review changed technical and runtime areas; complete local static, bilingual, and browser interaction checks.
- [x] Run final production browser validation against the release commit and record route, interaction, simulator, and limitation evidence in [PRODUCTION_QA.md](PRODUCTION_QA.md).
- [x] Update review findings and backlog dispositions; keep remaining improvement ideas bounded and deferred.
- [x] Push the validated commit, publish annotated tag `v1.1.0` and GitHub Release, and verify Pages and repository state.

## Scope boundary

This milestone completes quality corrections and release work for the existing single-book PMICBook. It does not include case-first engineering structure, internal OpenCode overlay, RAG, graph/knowledge systems, additional semiconductor books, or `semibook-core`; these remain deferred in [VISION.md](VISION.md).
