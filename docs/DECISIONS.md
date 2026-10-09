# Project decisions

Decisions below constrain PMICBook v1 and the v1.1 quality release. Revisit a decision when new evidence or explicit user direction warrants it; record the reason and consequences here.

| Decision | Rationale and boundary | Status |
|---|---|---|
| Transform ProcessBook in place as a static, no-build site. | The audited upstream uses static HTML/CSS/classic JavaScript and already has navigation, learning helpers, and process visualizations. Preserve that architecture unless a verified defect requires a narrow change. | Selected for v1 |
| Deliver paired English and Korean routes with an EN/KO switcher. | The user explicitly selected bilingual content. Use the same 25 chapter IDs and learning objectives in both languages, localized navigation, lesson explanations, model labels, and knowledge checks. The switcher defaults to matching chapter routes. This is a static-site authoring decision, with no external translation service. | Implemented and validated for v1 |
| Use the audited 25-chapter map as the v1 organization. | It connects systems, circuits, devices, BCD, fabrication, implementation, test, reliability, FA, and glossary. Chapter names or boundaries may change only while preserving coverage, prerequisites, and the documented ProcessBook disposition. | Implemented and validated for v1 |
| Reuse `PB` helpers and the `XS` process cross-section/stepper where they serve the lessons. | `XS` is a 2D educational representation. It is not TCAD, a field solver, validated manufacturing data, or a foundry process recipe. Any adapted BCD flow must label its illustrative assumptions and limits. | Selected for v1 |
| Keep the retained paired LV CMOS stepper in Chapter 18 and add an illustrative masked-window nLDMOS preset in Chapter 24. | A fabricated complete BCD process sequence would overstate the 2D cell-grid model. The integration lesson maps module dependencies; the lab shows qualitative well, body, drift, source/drain and field geometry using ideal mask windows and public educational assumptions. Neither calculates BV or a qualified recipe. | Selected for v1 |
| Use public, traceable technical sources only. | Cite technical claims and simulator assumptions in the relevant lessons and index sources in [REFERENCES.md](REFERENCES.md). Clearly separate what a source says from PMICBook’s teaching interpretation. | Required |
| Preserve ProcessBook’s dual-license boundaries. | Retain MIT copyright/license notices for executable/framework code. Attribute retained/adapted educational material under CC BY 4.0, identify the upstream source and chapter, and describe translation or other changes. | Required |
| Publish from the existing GitHub Pages project site. | Pages is configured for `main` / repository root and serves `https://frbread7.github.io/pmicbook/`. Keep the inherited ProcessBook CNAME absent; v1.1 publication uses this established project URL. | v1.0 configuration; v1.1 release validation pending |
| Keep technical simulator inputs distinct from sourced physical constants. | When inherited ProcessBook values are retained as teaching parameters, label them illustrative unless a cited source supports the exact value and conditions. Place claim-level citations and scope limits beside the relevant explanation. | Applied in v1.1 review; final validation pending |
| Treat wafer surface cleaning separately from bulk lifetime. | SC1/SC2 cleaning is represented as surface-contamination control. The simplified SRH example uses explicit assumed bulk trap density, capture cross-section, thermal velocity, and diffusivity; it does not model a clean changing bulk defects. | Applied in v1.1 review; final validation pending |
| Scope Deal–Grove coefficients by substrate orientation and ambient. | The linked TU Wien table supplies (111) Arrhenius coefficients; the page applies the cited (100) conversion and dry/wet pressure exponents under the stated classic-model assumptions. The shared engine follows the orientation conversion and does not imply process calibration. | Applied in v1.1 review; final validation pending |

## Baseline references

- Upstream: [`geniuskey/processbook`](https://github.com/geniuskey/processbook)
- Fork: [`frbread7/pmicbook`](https://github.com/frbread7/pmicbook)
- Baseline commit: `0bc4314d1e13c485a658e0cb1d4fd237b5fc8dff`
- Reference tag: `upstream-processbook-baseline`
- Pre-transformation evidence: [BASELINE_VALIDATION.md](BASELINE_VALIDATION.md)

These records describe the starting point and selected constraints. PMICBook v1 implementation and validation status are recorded in [CURRENT_MILESTONE.md](CURRENT_MILESTONE.md).
