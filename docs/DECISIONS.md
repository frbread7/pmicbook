# Project decisions

Decisions below constrain PMICBook v1. Revisit a decision when new evidence or explicit user direction warrants it; record the reason and consequences here.

| Decision | Rationale and boundary | Status |
|---|---|---|
| Transform ProcessBook in place as a static, no-build site. | The audited upstream uses static HTML/CSS/classic JavaScript and already has navigation, learning helpers, and process visualizations. Preserve that architecture unless a verified defect requires a narrow change. | Selected for v1 |
| Deliver paired English and Korean routes with an EN/KO switcher. | The user explicitly selected bilingual content. Use the same 25 chapter IDs and learning objectives in both languages, localized navigation, lesson explanations, model labels, and knowledge checks. The switcher defaults to matching chapter routes. This is a static-site authoring decision, with no external translation service. | Selected for v1 |
| Use the audited 25-chapter map as a working organization. | It connects systems, circuits, devices, BCD, fabrication, implementation, test, reliability, FA, and glossary. Chapter names or boundaries may change only while preserving coverage, prerequisites, and the documented ProcessBook disposition. | Working map; architecture draft |
| Reuse `PB` helpers and the `XS` process cross-section/stepper where they serve the lessons. | `XS` is a 2D educational representation. It is not TCAD, a field solver, validated manufacturing data, or a foundry process recipe. Any adapted BCD flow must label its illustrative assumptions and limits. | Selected for v1 |
| Keep the retained paired LV CMOS stepper in Chapter 18 and add an illustrative masked-window nLDMOS preset in Chapter 24. | A fabricated complete BCD process sequence would overstate the 2D cell-grid model. The integration lesson maps module dependencies; the lab shows qualitative well, body, drift, source/drain and field geometry using ideal mask windows and public educational assumptions. Neither calculates BV or a qualified recipe. | Selected for v1 |
| Use public, traceable technical sources only. | Cite technical claims and simulator assumptions in the relevant lessons and index sources in [REFERENCES.md](REFERENCES.md). Clearly separate what a source says from PMICBook’s teaching interpretation. | Required |
| Preserve ProcessBook’s dual-license boundaries. | Retain MIT copyright/license notices for executable/framework code. Attribute retained/adapted educational material under CC BY 4.0, identify the upstream source and chapter, and describe translation or other changes. | Required |
| Do not change GitHub Pages settings or publish during this work. | Repository inspection found Pages not configured. Correct project documentation and metadata as needed, but leave external repository settings and deployment state unchanged. | Required boundary |

## Baseline references

- Upstream: [`geniuskey/processbook`](https://github.com/geniuskey/processbook)
- Fork: [`frbread7/pmicbook`](https://github.com/frbread7/pmicbook)
- Baseline commit: `0bc4314d1e13c485a658e0cb1d4fd237b5fc8dff`
- Reference tag: `upstream-processbook-baseline`
- Pre-transformation evidence: [BASELINE_VALIDATION.md](BASELINE_VALIDATION.md)

These records describe the starting point and selected constraints. They do not assert that PMICBook content or features have been implemented.
