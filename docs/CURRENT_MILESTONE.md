# Current milestone: PMICBook v1

**Status:** In progress. This document defines only the work required to deliver PMICBook v1. The checklist records acceptance criteria; an unchecked item is not complete.

## Outcome

Deliver a coherent, usable, interactive PMIC and BCD textbook by transforming the ProcessBook fork in place. Preserve useful static-site learning and process-visualization capabilities, adapt relevant process material, validate the site, document reuse, and push the finished work to the PMICBook fork.

## v1 delivery checklist

- [ ] Establish PMICBook branding, chapter registry/order, responsive navigation, themes, metadata, and deployment instructions on the existing static site.
- [ ] Implement the architecture in [PMICBook architecture](PMICBOOK_ARCHITECTURE.md), or a coverage-equivalent map with explicit prerequisite and disposition updates.
- [ ] Deliver complete English and Korean versions of each subject chapter with a same-chapter language switcher, localized site navigation, metadata, model labels, and knowledge checks.
- [ ] Cover PMIC systems and specifications; references, bias and LDOs; switching and power-path circuits; PMIC-relevant semiconductor devices; BCD; HV MOS/LDMOS; and integrated passives.
- [ ] Adapt relevant substrate, well/isolation, oxidation/dielectric, lithography, etch, deposition/epitaxy, implant, anneal, CMP, contact, metal, and integration material around educational BCD examples.
- [ ] Retain and adapt the useful process cross-section/stepper for explicitly limited 2D educational examples; do not present it as TCAD or a foundry recipe.
- [ ] Cover layout, parasitics, thermal behavior, noise/EMI, characterization and production test, reliability, failure analysis, and bounded advanced context.
- [ ] Provide a useful PMIC/BCD glossary, cross-links, summaries, and knowledge checks.
- [ ] Make each simulator answer a stated engineering question; document assumptions, units, input ranges, and model limits. Use public sources or label values as illustrative.
- [ ] Preserve MIT code notices and CC BY 4.0 attribution for retained or adapted educational material, including translations and modifications.
- [ ] Update README/setup, attribution, references, metadata, sitemap, robots, and domain/deployment files for the derivative project; keep GitHub Pages settings unchanged.
- [ ] Validate local links and assets, chapter/navigation consistency, equations, representative interactive controls and boundaries, quizzes, themes, responsive layouts, and browser console behavior. Record skipped checks and limitations.
- [ ] Make coherent milestone commits, push intended changes to `https://github.com/frbread7/pmicbook`, and finish with a clean working tree.

## Scope boundary

This milestone excludes RAG, internal or workplace knowledge, document ingestion, vector/graph databases, knowledge-graph UI, enterprise cases or collaboration, user accounts, Yield-RCA integration, additional semiconductor books, a generalized semiconductor library, and `semibook-core`. Future ideas belong in [VISION.md](VISION.md); adding an idea there does not change this milestone.

## Completion evidence

The milestone is complete only when all applicable checklist items are verified and the final delivery report records the fork, baseline/tag, chapters and interactions delivered, attribution status, validation evidence, deployment status, limitations, and deferred work. See [BASELINE_VALIDATION.md](BASELINE_VALIDATION.md) for the pre-transformation ProcessBook evidence; it is not evidence that PMICBook features are complete.
