# Upstream origin and attribution

**Project status:** The English and Korean PMICBook chapter set is implemented. The tables below describe the implemented English-route reuse and paired Korean translations; v1.1 review evidence is recorded in [V1_1_QA.md](V1_1_QA.md), and v1.2 review and production evidence in [V1_2_TECHNICAL_AUDIT.md](V1_2_TECHNICAL_AUDIT.md) and [PRODUCTION_QA.md](PRODUCTION_QA.md).

## Origin and baseline

PMICBook is a derivative of the open-source [ProcessBook repository](https://github.com/geniuskey/processbook), by geniuskey and ProcessBook contributors. The fork is [frbread7/pmicbook](https://github.com/frbread7/pmicbook). The recorded upstream baseline is commit `0bc4314d1e13c485a658e0cb1d4fd237b5fc8dff`, preserved by the `upstream-processbook-baseline` tag. The unmodified baseline was checked before transformation; see [BASELINE_VALIDATION.md](BASELINE_VALIDATION.md).

The local annotated tag `upstream-processbook-baseline` resolves to that commit object (`0bc4314d1e13c485a658e0cb1d4fd237b5fc8dff`, tree `680389464d683245b34e7a9f0d0533c309159431`). The PMICBook v1.1 release baseline is tag `v1.1.0` at commit `da37b183c559d35fcb7f6471c86c513b104a7020` (tree `25e96d0cd23e398e37e1f3be125be80a4eca79e8`). The v1.2 work descends from that release; its code-bearing commit is `7ff37aed666d4d3d6cceeb4948a4199c0daff312`, with production verification in [PRODUCTION_QA.md](PRODUCTION_QA.md). This does not change the immutable ProcessBook derivative baseline.

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

## Executable-file lineage map

This file-level map records the local ProcessBook baseline comparison and PMICBook v1.1 history for reusable code. It is not a legal opinion and does not assign one license to every byte in a mixed HTML/JavaScript file. File extensions alone do not determine the license.

| Current path | Local ProcessBook baseline / v1.1 relation | Working classification and notices |
|---|---|---|
| `css/style.css` | Present in the pinned ProcessBook tree; retained and rebranded for PMICBook. It changed between the baseline and v1.1, and v1.2 adds PMIC-specific viewer styling. | Shared styling/framework code: MIT; keep the inherited copyright/SPDX header and `LICENSE-MIT`. New prose-like labels or educational illustrations are content and require separate classification. |
| `js/common.js` | Present in ProcessBook; PMICBook extended/reworked shared navigation, quiz, theme, chart, math, and page helpers through v1.1. | Executable helper/framework code: MIT; retain notice. The chapter registry and any educational wording/data embedded in JavaScript need the dual-content treatment in `LICENSE.md` rather than blanket MIT treatment. |
| `js/optics.js` | Present in ProcessBook and retained with narrow changes through v1.1. | Imaging implementation: MIT; retain notice. Comments or displayed instructional wording that function as educational explanation should not be treated as code solely because they are in a `.js` file. |
| `js/xsec.js` | Present in ProcessBook; materially modified through v1.1 for the PMICBook sandbox, including bounded implant-mask behavior. v1.2 also bounds the illustrative diffusion kernel at intervening material barriers. | Simulator implementation: MIT; retain notice. Embedded names, instructions, explanatory strings, and educational data remain CC BY 4.0 material under the mixed-content rule. |
| `js/ldmos-sequence.js` | Added in v1.2; no corresponding file exists in the pinned ProcessBook tree or v1.1 tag. It implements the two source-bounded sequence views. | Program/controller and diagram-generation logic are MIT under the repository policy. Stage explanations, labels, and generated instructional schematic content are PMICBook educational contributions under CC BY 4.0. Its header records both categories. Patent citations support the examples; they do not grant rights to patent figures or establish recipe values. |
| `tools/head.py` | Present in ProcessBook; substantially adapted as the PMICBook metadata/sitemap generator. | Executable generator: MIT; retain inherited notice. Generated descriptions/titles are educational/editorial content and should follow the content license. |
| `tools/check_site.py` | Added in the PMICBook history after the upstream baseline; no file at this path in the pinned tree. | Project code policy classifies it as MIT. The file has no file-local copyright/license header in the inspected version; confirm attribution expectations before reuse or release packaging. |
| `tools/browser_qa.mjs` | Added in PMICBook history after the upstream baseline; no file at this path in the pinned tree. | Project code policy classifies it as MIT. The file has no file-local copyright/license header in the inspected version; confirm attribution expectations before reuse or release packaging. |

Comparison basis: `git diff upstream-processbook-baseline..v1.1.0 -- css/style.css js/common.js js/optics.js js/xsec.js tools/head.py tools/check_site.py tools/browser_qa.mjs`; at the pinned ProcessBook tree the last two tool files are absent. The v1.2 release adds `js/ldmos-sequence.js` and modifies `css/style.css`, `js/xsec.js`, `tools/head.py`, and `tools/browser_qa.mjs`. This records file lineage and diff presence, not a line-by-line copyright determination.

### Mixed chapter and embedded content

English and Korean chapter HTML mixes MIT-licensed structural/event code with CC BY 4.0 lesson text, static figures/SVG, questions, explanatory tables, and educational data. Chapter shells and adapted shared helpers remain ProcessBook-derived; new PMIC lessons and diagrams are PMICBook contributions. The v1.2 nLDMOS stage viewer is loaded from `js/ldmos-sequence.js`; its code is separate from its explanatory strings and generated educational drawing. The HTML also embeds the independent editable `XS` process sandbox, so the lab page is mixed both by material type and by lineage.

Keep existing headers, notices, and chapter-level attribution. Before release, review mixed or uncertain portions at the material level, especially inline scripts copied/adapted from the upstream sandbox, JavaScript strings, SVG and program-generated diagrams, translated educational wording, and any asset with an external source. A whole-file hash or extension is not adequate provenance evidence. If the lineage of a passage or drawing cannot be established, mark it for release review rather than assuming that the entire file is MIT or CC BY.

## External upstream reading snapshot

The following public repositories were inspected read-only for the v1.2 research review. Their `main` heads, observed 2026-10-16, are pinned below so the source snapshot is reproducible. These readings inform citations and differentiation; they are not additional source-code or prose imports into PMICBook. No text or figures were copied from these books as part of that inspection. Preserve each source book's own attribution if a later specific adaptation is made.

| Source repository and pinned revision | Inspected chapters | PMICBook overlap and distinction |
|---|---|---|
| [ProcessBook](https://github.com/geniuskey/processbook/tree/f583bc33c5dfdd31292f7ef6826ce24a2c8b7fed), `f583bc33c5dfdd31292f7ef6826ce24a2c8b7fed` | [`implant.html`](https://github.com/geniuskey/processbook/blob/f583bc33c5dfdd31292f7ef6826ce24a2c8b7fed/chapters/implant.html), [`anneal.html`](https://github.com/geniuskey/processbook/blob/f583bc33c5dfdd31292f7ef6826ce24a2c8b7fed/chapters/anneal.html), [`integration.html`](https://github.com/geniuskey/processbook/blob/f583bc33c5dfdd31292f7ef6826ce24a2c8b7fed/chapters/integration.html), [`lab.html`](https://github.com/geniuskey/processbook/blob/f583bc33c5dfdd31292f7ef6826ce24a2c8b7fed/chapters/lab.html), [pinned `LICENSE.md`](https://github.com/geniuskey/processbook/blob/f583bc33c5dfdd31292f7ef6826ce24a2c8b7fed/LICENSE.md) | Overlaps PMICBook Ch. 14–15 and process/lab foundations. ProcessBook's integration sequence is generic CMOS; it is not the source for the new two-branch nLDMOS viewer. PMICBook applies process limits to PMIC/BCD system choices. |
| [DeviceBook](https://github.com/geniuskey/devicebook/tree/32f52a3961c2a3399659cd4279c0538391c34f97), `32f52a3961c2a3399659cd4279c0538391c34f97` | [`mosfet.html`](https://github.com/geniuskey/devicebook/blob/32f52a3961c2a3399659cd4279c0538391c34f97/chapters/mosfet.html), [`transport.html`](https://github.com/geniuskey/devicebook/blob/32f52a3961c2a3399659cd4279c0538391c34f97/chapters/transport.html), [`pn.html`](https://github.com/geniuskey/devicebook/blob/32f52a3961c2a3399659cd4279c0538391c34f97/chapters/pn.html), [pinned `LICENSE.md`](https://github.com/geniuskey/devicebook/blob/32f52a3961c2a3399659cd4279c0538391c34f97/LICENSE.md) | Foundational device physics overlaps Ch. 05 and supports device-model boundaries; it is not an LDMOS/BCD design or calibrated process model. |
| [DopingBook](https://github.com/geniuskey/dopingbook/tree/944526d6c2bb790d5d8f1e08d2614e1c5de22c3c), `944526d6c2bb790d5d8f1e08d2614e1c5de22c3c` | [`doping.html`](https://github.com/geniuskey/dopingbook/blob/944526d6c2bb790d5d8f1e08d2614e1c5de22c3c/chapters/doping.html), [`anneal.html`](https://github.com/geniuskey/dopingbook/blob/944526d6c2bb790d5d8f1e08d2614e1c5de22c3c/chapters/anneal.html), [`diffusion.html`](https://github.com/geniuskey/dopingbook/blob/944526d6c2bb790d5d8f1e08d2614e1c5de22c3c/chapters/diffusion.html), [pinned `LICENSE.md`](https://github.com/geniuskey/dopingbook/blob/944526d6c2bb790d5d8f1e08d2614e1c5de22c3c/LICENSE.md) | Chemical versus active concentration, implant damage, and transient-enhanced diffusion deepen the boundaries of Ch. 14–15. Those topics inform what PMICBook's educational profile/anneal models omit; they are not source recipe values. |
| [TCADBook](https://github.com/geniuskey/tcadbook/tree/56d3c14f757a55caed574e720069cfdf2b7a2bf6), `56d3c14f757a55caed574e720069cfdf2b7a2bf6` | [`equations.html`](https://github.com/geniuskey/tcadbook/blob/56d3c14f757a55caed574e720069cfdf2b7a2bf6/chapters/equations.html), [`mesh.html`](https://github.com/geniuskey/tcadbook/blob/56d3c14f757a55caed574e720069cfdf2b7a2bf6/chapters/mesh.html), [`numerics.html`](https://github.com/geniuskey/tcadbook/blob/56d3c14f757a55caed574e720069cfdf2b7a2bf6/chapters/numerics.html), [`highfield.html`](https://github.com/geniuskey/tcadbook/blob/56d3c14f757a55caed574e720069cfdf2b7a2bf6/chapters/highfield.html), [`transport.html`](https://github.com/geniuskey/tcadbook/blob/56d3c14f757a55caed574e720069cfdf2b7a2bf6/chapters/transport.html), [pinned `LICENSE.md`](https://github.com/geniuskey/tcadbook/blob/56d3c14f757a55caed574e720069cfdf2b7a2bf6/LICENSE.md) | Drift-diffusion, Poisson/continuity, mesh, numerical convergence, and high-field physics provide context for Ch. 07/24 limits. Its examples are not a calibrated LDMOS solver or proof that PMICBook's cell-grid model solves fields/BV. |
| [AnalogBook](https://github.com/geniuskey/analogbook/tree/0440a0100a809e704be5e2cb67fd1c973551d2ba), `0440a0100a809e704be5e2cb67fd1c973551d2ba` | [`ldo.html`](https://github.com/geniuskey/analogbook/blob/0440a0100a809e704be5e2cb67fd1c973551d2ba/chapters/ldo.html), [pinned `LICENSE.md`](https://github.com/geniuskey/analogbook/blob/0440a0100a809e704be5e2cb67fd1c973551d2ba/LICENSE.md) | Generic PMOS-pass LDO loop/stability concepts overlap Ch. 03. Its equivalent circuit is a separate educational model, not a product/foundry performance result. |

The source snapshot also found that all five inspected repositories use a material-based dual-license policy for code and educational content; the pinned `LICENSE.md` files are linked above. It reported no dedicated BCD nLDMOS process-integration chapter, RESURF design method, or LDMOS-calibrated TCAD solver in the inspected/indexed subset. These are scoped observations, not claims about every possible file in those repositories. Recheck live heads before relying on these pins as current.

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

All 25 subject chapters have matching English and Korean routes with localized lesson text, controls, metadata, and knowledge checks. The Korean pages are translations or adaptations with language-specific edits, not metadata-only copies. Final browser validation of interactive behavior is recorded in [PRODUCTION_QA.md](PRODUCTION_QA.md); the publication review record is in [CURRENT_MILESTONE.md](CURRENT_MILESTONE.md).
