# Upstream origin and attribution

**Project status:** The English and Korean PMICBook chapter set is implemented. The tables below describe the implemented English-route reuse and paired Korean translations; v1.1 review evidence is recorded in [V1_1_QA.md](V1_1_QA.md), with final production evidence in [PRODUCTION_QA.md](PRODUCTION_QA.md).

## Origin and baseline

PMICBook is a derivative of the open-source [ProcessBook repository](https://github.com/geniuskey/processbook), by geniuskey and ProcessBook contributors. The fork is [frbread7/pmicbook](https://github.com/frbread7/pmicbook). The recorded upstream baseline is commit `0bc4314d1e13c485a658e0cb1d4fd237b5fc8dff`, preserved by the `upstream-processbook-baseline` tag. The unmodified baseline was checked before transformation; see [BASELINE_VALIDATION.md](BASELINE_VALIDATION.md).

PMICBook retains ProcessBook as its primary implementation base. Rewriting or reorganizing a page does not remove the obligation to identify and attribute any upstream educational material that remains or is adapted.

The retained ProcessBook copyright line identifies upstream material; it does not attribute all newly authored PMICBook lessons to ProcessBook contributors. New PMICBook educational material is shared under this repository's CC BY 4.0 content license and identified as PMICBook-authored in its file header. Shared layout/framework code retains the upstream MIT notice. A page that adapts upstream educational material also carries a chapter-level CC BY 4.0 source note.

## License boundaries

ProcessBook uses two licenses, assigned by material type rather than file extension:

| Material | Upstream license | PMICBook handling |
|---|---|---|
| Executable/framework code, including JavaScript, CSS, Python, HTML structure/event code, simulators, and code that generates diagrams | MIT, in [`LICENSE-MIT`](../LICENSE-MIT) | Preserve copyright and license notices in copies or substantial portions. Identify retained/modified framework components in project records. |
| Educational prose, figures, questions, explanations, definitions, educational tables/data, and README/contributor-guide explanatory text | CC BY 4.0, in [`LICENSE-CC-BY-4.0`](../LICENSE-CC-BY-4.0) | Give appropriate credit, link the source and license, retain relevant notices, and identify modifications, including translation. Add chapter/asset-specific notes as actual reuse is established. |

The upstream [`LICENSE.md`](../LICENSE.md) explains mixed-content HTML/JavaScript treatment. A page may contain both licensed code and educational content. Third-party materials and dependencies retain their own terms. This summary is operational documentation, not a substitute for the license texts. The PMICBook-specific boundary is described in the derivative note at the top of that guide.

Suggested attribution for adapted material (replace the bracketed fields with the actual chapter/source and changes):

> Adapted from ProcessBook, “[source chapter or material]” by geniuskey and ProcessBook contributors, [direct upstream chapter URL]. Licensed under CC BY 4.0, https://creativecommons.org/licenses/by/4.0/. Changes: translated from Korean and adapted for PMIC/BCD instruction; [specific changes].

For unmodified retained content, state “Changes: none.” Do not use this template for material that was not actually reused. Keep code notices with reused code separately from educational-content attribution.

## Existing chapter disposition

Every source filename below refers to the immutable [ProcessBook baseline tree](https://github.com/geniuskey/processbook/tree/0bc4314d1e13c485a658e0cb1d4fd237b5fc8dff/chapters). Adapted chapter pages include direct source links and CC BY 4.0 change notes. This table summarizes actual English-route treatment; a Korean translation of adapted text is a further modification under the same attribution obligation.

| ProcessBook source chapter | Actual disposition | Retained material and identified changes |
|---|---|---|
| `overview.html` | REPLACE body / RETAIN framework | Replaced process-first educational body with new PMIC systems/power-domain material, a power-tree diagram, rail checklist, and cross-links. No upstream educational passage or figure remains on this page; the page shell and shared site framework remain derived. |
| `wafer.html` | ADAPT | Retained substrate, cleaning, epitaxy, and wafer teaching/simulation patterns; translated and reframed them for BCD well/isolation starting conditions. |
| `oxidation.html` | ADAPT | Retained oxide growth/dielectric physics and numerical illustrations; translated and connected them to gate/field structures and thermal budget. |
| `litho.html` | ADAPT + MERGE | Retained the optical imaging helpers and selected aerial-image/focus simulators; translated and reframed patterning around BCD wells, drift, isolation, gates, and contacts; added a coat/bake/expose/develop/transfer track and diagram based on the separate resist source. |
| `resist.html` | MERGE / RETIRE route | Folded useful track, contrast/profile, and transfer ideas into `litho.html`; replaced the old standalone page with a compatibility redirect. Original advanced logic/EUV stochastic and OPC/SADP digressions are not PMICBook chapter content. The old source remains in Git history and is credited from lithography. |
| `etch.html` | ADAPT | Retained profile/selectivity and etch teaching interactions; translated and connected them to isolation/contact/field geometry and limited model assumptions. |
| `deposition.html` | ADAPT | Retained CVD/ALD/PVD/epi and coverage/void interactions; translated and connected them to BCD dielectrics, passivation, contacts, and metal. |
| `implant.html` | ADAPT | Retained range/masking/lateral-spread educational models; translated and reframed examples around wells, drift, channel, and source/drain with noncalibrated limits. |
| `anneal.html` | ADAPT | Retained diffusion/activation/thermal-budget interactions; translated and connected junction movement to BCD device boundaries. |
| `cmp.html` | ADAPT | Retained pattern density, dishing, erosion, and planarization models; translated and connected topography to contact/BEOL consequences. |
| `metal.html` | ADAPT | Retained interconnect stack/resistance/RC/current-density and EM teaching models; translated and prioritized PMIC current paths, via redundancy, thick top metal, IR drop, and reliability. |
| `integration.html` | SUBSTANTIALLY ADAPT | Retained the original paired LV CMOS/M1 `XS` process stepper and threshold model as an explicitly limited base module. Added an educational BCD module-dependency map and links to the separate nLDMOS lab example. It is not a complete BCD recipe or HV-device solver. |
| `advanced.html` | ADAPT / REFERENCE | Retained the bonding geometry model with explicit independent-local-offset limits and a bounded backside-power logic-context figure. Omitted the large-die cost/yield widget, which does not answer a PMIC design question. Added PMIC-specific BCD partition, automotive, GaN, digital-control, power-path and thermal discussion. |
| `metrology.html` | ADAPT | Retained optical-thickness, overlay, SPC/Cpk, and defect-yield widgets as supporting process monitors; added PMIC DC/transient/efficiency/WAT/EDS/production-test interpretation and test matrix. |
| `lab.html` | ADAPT | Retained `XS` editable process sandbox and its process templates; translated controls and explanations, added an annotated nLDMOS schematic and default masked-window well/body/drift/source-drain preset with explicit cell-grid limits. |
| `glossary.html` | ADAPT | Retained searchable/filterable/sortable glossary and interactive final-quiz shell; replaced generic process definitions and questions with 48 PMIC/BCD terms and 20 integrated checks. |

No upstream chapter is planned to remain unchanged as a PMICBook product chapter. For code, retain the upstream MIT notices in the corresponding source files when reuse is made. For adapted or translated educational content, record the precise source and modifications at the relevant chapter/asset and keep the summary here current.

### Other retained or newly authored educational assets

- [`favicon.svg`](../favicon.svg) is retained unchanged from ProcessBook and remains CC BY 4.0 educational artwork. Source: [ProcessBook favicon at the immutable baseline](https://github.com/geniuskey/processbook/blob/0bc4314d1e13c485a658e0cb1d4fd237b5fc8dff/favicon.svg). Changes: none.
- `og.svg` and the generated `og.png` are PMICBook-authored title-card artwork, not ProcessBook figures. They are included with PMICBook's CC BY 4.0 educational contributions.
- The PMIC power-tree and chapter diagrams authored for this fork are PMICBook contributions under CC BY 4.0. Adapted ProcessBook figures or simulator-generated educational illustrations remain identified in their chapter notes.

## New PMICBook chapter content

The following lesson content was newly authored for PMICBook and is not ProcessBook educational content. The page shell and shared styles remain derived from ProcessBook under MIT. The new lesson material follows this repository's CC BY 4.0 content license, and public technical sources are cited in the chapters and indexed in [REFERENCES.md](REFERENCES.md).

| PMICBook chapter | Content status |
|---|---|
| `fundamentals.html`, `references-ldo.html`, `switching.html` | New requirements, reference/LDO, and switching-converter lessons, with paired Korean translations. |
| `devices.html`, `bcd.html`, `hv-devices.html`, `passives.html` | New PMIC device, BCD, HV/LDMOS, and passive-device lessons, with paired Korean translations. |
| `layout.html`, `reliability.html`, `failure-analysis.html` | New layout/parasitics, reliability, and failure-analysis introductions, with paired Korean translations. |

All 25 subject chapters have matching English and Korean routes with localized lesson text, controls, metadata, and knowledge checks. The Korean pages are translations or adaptations with language-specific edits, not metadata-only copies. Final browser validation of interactive behavior is recorded in [PRODUCTION_QA.md](PRODUCTION_QA.md); the in-progress review checklist is in [CURRENT_MILESTONE.md](CURRENT_MILESTONE.md).
