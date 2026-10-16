# PMICBook v1.2 expert mastery roadmap

This roadmap defines an optional learning sequence, prerequisites, and skill levels for the existing textbook. It is a study guide, not a qualification standard or a claim that completing the book establishes job readiness. Chapter numbering follows the v1.1 catalog; update if chapter structure changes.

## Skill levels

| Level | Learner can… |
|---|---|
| 0 — Orientation | Identify the topic, vocabulary, and model boundary; explain the concept qualitatively. |
| 1 — Explain | Interpret a diagram or equation, state units and assumptions, and compare basic alternatives. |
| 2 — Apply | Work a bounded example, connect adjacent domains, and identify when the model no longer applies. |
| 3 — Evaluate | Assess evidence, uncertainty, platform dependencies, and alternative explanations; justify a decision with sources. |

Levels describe learning outcomes, not a certification grade. A simulator result alone never demonstrates Level 2 or 3.

## Recommended path

| Stage | Chapters | Prerequisites | Target level and mastery evidence |
|---|---|---|---|
| 1. Product and circuit context | 01–04 | Algebra, units, voltage/current/power, basic feedback vocabulary | L1: trace rails, efficiencies, transient/specification terms, and explain what the ideal converter/LDO models omit. |
| 2. Device and BCD architecture | 05–08 | Basic semiconductor vocabulary; Stage 1 | L1–L2: explain device roles, voltage domains, drift-region trade-offs, and select a passive category while stating platform dependencies. |
| 3. Front-end materials and modules | 09–16 | Device basics; logarithms and qualitative diffusion/oxidation concepts | L1–L2: follow substrate, well, lithography, etch, deposition, implant, anneal, and CMP concepts; label inherited numeric models as illustrative. |
| 4. BEOL, layout, and integration | 17–19 | Stages 2–3; resistance/capacitance/inductance basics | L2: trace an integration flow and identify where on-chip parasitics, thermal paths, isolation, and noise enter; distinguish generic teaching diagrams from process rules. |
| 5. Test, reliability, and diagnosis | 20–22 | Stages 2–4; basic statistics and measurement concepts | L2–L3: distinguish characterization, WAT, wafer sort, and final test; interpret uncertainty and guard bands; choose FA methods as evidence-gathering steps; separate stress from lifetime inference. |
| 6. Emerging context and synthesis | 23–25 | Prior stages | L2–L3: compare a cited emerging example within its source limits; explain a process-lab sequence as illustrative; synthesize glossary terms and identify unanswered questions. |

## Prerequisite details

- **Mathematics:** algebra, logarithms, ratios, graph reading, and units are sufficient for most explanations. Diffusion length and simple thermal models benefit from square roots and first-order differential-equation intuition; the book does not require full semiconductor transport derivations.
- **Electrical foundations:** Ohm's law, power balance, RC response, feedback, and basic MOSFET behavior support Chapters 02–08 and 17–21.
- **Process foundations:** know that masks, implants, thermal steps, deposition, and etch are platform-dependent operations. The book's diagrams are conceptual; they do not provide a qualified recipe.
- **Evidence skills:** distinguish measured data, vendor examples, model assumptions, and educational placeholders. For reliability and FA, a symptom or accelerated test is evidence, not by itself a mechanism or lifetime conclusion.

## Suggested mastery checks

1. **Explain:** draw one PMIC power path from input through conversion to loads and annotate rails, limits, and where the ideal models stop.
2. **Connect:** sketch a generic BCD cross-section and mark voltage domains, isolation, drift region, contacts, and metal while labeling platform-dependent choices.
3. **Evaluate:** choose one public, traceable device/process example and list its geometry, conditions, and limits before comparing it with generic chapter concepts.
4. **Diagnose:** for a hypothetical open, short, leakage, or intermittent symptom, propose a staged test/localization plan and state what evidence would confirm or falsify each hypothesis.
5. **Reflect bilingually:** explain three glossary terms in both languages and verify that the same quantity, polarity, and caveat survive translation.

Do not treat these exercises as proof of design, process-integration, test, or reliability qualification. Follow the [technical audit](V1_2_TECHNICAL_AUDIT.md) and its current evidence boundaries.
