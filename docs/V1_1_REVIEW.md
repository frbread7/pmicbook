# PMICBook v1.1 review backlog

This is a selective review list, not authorization to implement v1.1. It records opportunities identified during publication QA and the v1 architecture/content audit. The owner should first compare it with feedback from using the live site.

Publication QA found no P0 defect requiring a release-blocking site-code change.

## Candidate work

### 1. Tighten claim-level technical references

- **Priority:** P1
- **Location:** `docs/REFERENCES.md`; chapters 06–08, 17–23
- **Problem:** The reference index is explicitly non-exhaustive, and some entries are source records or abstracts rather than full-text reviews. A bibliography entry does not establish that every nearby claim is supported.
- **Why it matters:** Readers need to distinguish sourced facts, engineering interpretation, and illustrative assumptions, especially for device/reliability claims.
- **Recommended change:** Audit high-impact claims against accessible primary sources; add author/date/document identifiers and place direct citations next to claims. Remove or narrow unsupported statements.
- **Estimated scope:** Medium

### 2. Extend the LDO model with operating regions

- **Priority:** P2
- **Location:** `chapters/fundamentals.html`, `chapters/references-ldo.html`
- **Problem:** The calculator estimates steady-state power and pass-path headroom; it does not solve loop dynamics, dropout curves, PSRR, or transient response.
- **Why it matters:** Readers may otherwise treat a power-balance result as a complete regulator operating prediction.
- **Recommended change:** Keep the present calculator and add a sourced, explicitly illustrative operating-region view that separates regulation, dropout, current limit, and thermal constraints.
- **Estimated scope:** Medium

### 3. Add nonideal switching-converter comparisons

- **Priority:** P2
- **Location:** `chapters/switching.html`
- **Problem:** The interactive model is ideal CCM duty/ripple; it omits efficiency, conduction/switching losses, boundary/DCM behavior, and control limits.
- **Why it matters:** Those effects drive component selection, heat, and feasible conversion ranges in real PMICs.
- **Recommended change:** Add one public-source-backed comparison for a clearly stated example operating point, with separate loss terms and explicit component/controller limits. Preserve the ideal model as the baseline.
- **Estimated scope:** Medium

### 4. Add a sourced BCD platform example

- **Priority:** P2
- **Location:** `chapters/bcd.html`, `chapters/integration.html`, `docs/REFERENCES.md`
- **Problem:** The module map and cross-section teach generic integration, but they do not walk through a specific publicly documented BCD example from requirements to device/process choices.
- **Why it matters:** A bounded case helps connect voltage domains, isolation, device options, and integration trade-offs without implying a universal foundry flow.
- **Recommended change:** Add one public-paper/vendor example with its technology-specific limits clearly separated from the generic BCD model.
- **Estimated scope:** Medium

### 5. Quantify the HV-device trade-off with public data

- **Priority:** P2
- **Location:** `chapters/hv-devices.html`
- **Problem:** Breakdown versus specific on-resistance is explained conceptually, while the references include only an abstract-verified example rather than a comparable dataset.
- **Why it matters:** A sourced plot or table could make the voltage/resistance trade-off more concrete while avoiding invented process parameters.
- **Recommended change:** Use one accessible public data source, state device geometry and measurement context, and label it as one implementation rather than a portable design rule.
- **Estimated scope:** Medium

### 6. Clarify parasitic passive trade-offs

- **Priority:** P2
- **Location:** `chapters/passives.html`
- **Problem:** Resistors, MIM/MOS capacitors, diodes, and inductors are introduced, but area, density, voltage coefficient, loss, and substrate-parasitic comparisons remain mostly qualitative.
- **Why it matters:** Passive selection is a major PMIC area, accuracy, and efficiency trade-off.
- **Recommended change:** Add a sourced comparison table using technology-specific ranges only where public sources support them; otherwise retain normalized/qualitative comparisons.
- **Estimated scope:** Medium

### 7. Add a package-aware thermal example

- **Priority:** P2
- **Location:** `chapters/layout.html`, `chapters/advanced.html`
- **Problem:** The thermal-resistance equation and heat-path figure identify boundary-condition dependence but do not calculate a realistic die/package/board example.
- **Why it matters:** PMIC junction temperature depends on power distribution and package/board conditions, not a single generic die value.
- **Recommended change:** Add a documented thermal-resistance network example with assumptions, transient/steady-state distinction, and sensitivity to board and package paths.
- **Estimated scope:** Medium

### 8. Make the test chapter more operational

- **Priority:** P2
- **Location:** `chapters/metrology.html`
- **Problem:** The chapter maps DC/transient/efficiency tests and WAT/EDS concepts, but has limited example waveforms, test sequencing, and guard-band interpretation.
- **Why it matters:** A concrete measurement sequence helps bridge textbook metrics and characterization/production practice.
- **Recommended change:** Add a public, generic test-plan example that separates characterization, wafer sort, and final test, and explains measurement uncertainty and limits.
- **Estimated scope:** Medium

### 9. Add an FA method-selection matrix

- **Priority:** P2
- **Location:** `chapters/failure-analysis.html`
- **Problem:** The chapter describes electrical signatures, localization, emission, microscopy, and deprocessing, but lacks a compact symptom-to-method decision aid.
- **Why it matters:** Readers need to understand what each method can locate or resolve and what evidence it cannot provide alone.
- **Recommended change:** Add a decision matrix for open, short, leakage, and intermittent signatures with method purpose, sample constraints, and confirmation evidence.
- **Estimated scope:** Small

### 10. Deepen reliability mechanism separation

- **Priority:** P2
- **Location:** `chapters/reliability.html`, `chapters/metal.html`
- **Problem:** EM, TDDB, BTI, HCI, ESD, latch-up, and thermal stress are introduced, while lifetime prediction is intentionally out of scope.
- **Why it matters:** Readers benefit from distinguishing acceleration stress, failure signatures, and qualification evidence without treating a single rule as universal.
- **Recommended change:** Add a sourced mechanism/stress/observable/limit table; keep lifetime estimates technology- and mission-profile-specific.
- **Estimated scope:** Medium

### 11. Review keyboard and assistive-technology access

- **Priority:** P2
- **Location:** shared `css/style.css`, `js/common.js`; interactive chapter controls and diagrams
- **Problem:** Publication QA exercised visual desktop/mobile behavior, but did not perform a full keyboard-only or screen-reader review of drawers, quizzes, charts, and SVG diagrams.
- **Why it matters:** Interactive lessons should remain usable when learners cannot use a pointer or cannot perceive a visual alone.
- **Recommended change:** Audit focus order, visible focus, control names/state announcements, reduced motion, chart descriptions, and diagram text alternatives; fix confirmed gaps.
- **Estimated scope:** Medium

### 12. Improve CDN resilience and loading cost

- **Priority:** P2
- **Location:** `tools/head.py`, generated chapter heads, `README.md`
- **Problem:** KaTeX, Three.js-compatible resources where used, and some web fonts load from public CDNs; content styling and formula rendering can be affected by blocked or unavailable third parties.
- **Why it matters:** Learners may use restricted or unreliable networks, and each external dependency adds availability and privacy considerations.
- **Recommended change:** Measure the live dependency set and load cost; document it, add graceful formula/font behavior, and evaluate local vendoring only with license and update policy recorded.
- **Estimated scope:** Medium

### 13. Run a Korean technical terminology review

- **Priority:** P2
- **Location:** `ko/chapters/`, especially 05–08, 18–22; `ko/chapters/glossary.html`
- **Problem:** Structural bilingual parity is checked, but structural checks cannot establish consistent Korean engineering terminology or natural technical phrasing.
- **Why it matters:** Inconsistent translations can obscure concepts even when routes, controls, and quizzes match.
- **Recommended change:** Review recurring terms against the glossary and public Korean semiconductor usage; update the glossary and paired passages together.
- **Estimated scope:** Medium

### 14. Expand layout parasitic examples

- **Priority:** P3
- **Location:** `chapters/layout.html`, `chapters/metal.html`
- **Problem:** The lessons explain IR drop, RLC coupling, current loops, and current density, but provide few linked examples comparing on-chip routing, package paths, and board-level loops.
- **Why it matters:** PMIC noise and loss often cross die/package/board boundaries.
- **Recommended change:** Add one annotated current-path example that identifies which parasitics belong to silicon, package, and PCB and where measurement or extraction is needed.
- **Estimated scope:** Small

### 15. Add learner-tested figure descriptions

- **Priority:** P3
- **Location:** chapter SVG diagrams and the BCD lab
- **Problem:** Existing diagrams explain useful concepts, but some contain detailed relationships that could be easier to navigate with a textual summary or stepwise reveal.
- **Why it matters:** Better descriptions support accessibility and help learners connect static figures to the process-lab cross-section.
- **Recommended change:** Review diagrams with learners and add concise captions or accessible text descriptions where they improve comprehension.
- **Estimated scope:** Small

## Review order

Start with items 1–5 after owner feedback from the live v1 site. Items 6–13 are bounded follow-up improvements; items 14–15 are optional. No item in this document was implemented as part of the v1.0.0 publication task.
