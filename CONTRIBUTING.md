# Contributing to PMICBook

PMICBook is a static HTML/CSS/classic-JavaScript textbook derived from ProcessBook. It has no package install or build step. Run it from the repository root with `python3 -m http.server 8000` and open <http://localhost:8000>.

## Product and scope

PMICBook v1 teaches the path from power-system needs through PMIC circuits, devices, BCD technology, fabrication/process integration, layout and parasitics, characterization, reliability, and failure analysis. Keep additions within [the current milestone](docs/CURRENT_MILESTONE.md); put future platform or book ideas in [VISION](docs/VISION.md) without expanding v1 automatically.

PMICBook maintains complete English and Korean lessons for the same 25 subject chapters. Keep `chapters/<slug>.html` and `ko/chapters/<slug>.html` paired when changing lessons, controls, quizzes, figures, or links. The language switcher must lead to the matching chapter; navigation and links within a lesson should stay in that language.

## Chapter structure

- Add or reorder chapter entries in `PB.CHAPTERS` in `js/common.js` and make sure every registered route exists in both `chapters/` and `ko/chapters/`.
- Use an explicit `<html lang="en">` or `<html lang="ko">` that matches the lesson body. The `<!--head:start ...-->` JSON marker supports `lang`, for example:

  ```html
  <!--head:start {"desc":"Describe the engineering question answered in this chapter.","libs":[],"lang":"en"}-->
  <!--head:end-->
  ```

- The chapter body uses `<body data-chapter="slug">` and `<main class="chapter">`. `js/common.js` creates the chapter drawer, on-page table of contents, previous/next links, footer, theme toggle, and quiz behavior.
- Where it helps the learner, combine the concept, engineering intuition, diagram or cross-section, equation/model, interactive experiment, interpretation, short summary, and knowledge check. Do not add controls that do not answer a useful engineering question.
- Link prerequisites and related chapters in the same language. Keep the glossary chapter chips and term links consistent with the chapter registry.
- Reuse existing `PB` helpers in `js/common.js`, `XS` operations in `js/xsec.js`, and the chapter patterns in `css/style.css`. Keep scripts compatible with the current classic-script site unless the architecture is intentionally reviewed.

## Technical accuracy and citations

- Use public sources only. Do not add confidential or workplace material.
- Cite a technical source close to the claim it supports. Start from [docs/REFERENCES.md](docs/REFERENCES.md), then confirm the source itself and its access/publication details before relying on a specific claim.
- Separate a source's stated value from PMICBook's interpretation. A vendor example, one published device structure, or a standards listing is not a foundry-neutral specification.
- For numerical models, state units, assumptions, valid ranges, and omissions. Use cited representative values or label values as illustrative. Do not imply foundry-specific accuracy.
- Explain the engineering meaning of an equation and check dimensions and limiting cases. Distinguish ideal converter relationships from switching, conduction, control-loop, and parasitic effects omitted by the model.
- Keep the process cross-section engine's limits visible: it is an educational two-dimensional model, not process TCAD, a three-dimensional electric-field solver, or a validated BCD recipe.

## Attribution and licensing

ProcessBook executable/framework code is MIT-licensed; educational content is CC BY 4.0. See [LICENSE.md](LICENSE.md), [LICENSE-MIT](LICENSE-MIT), and [LICENSE-CC-BY-4.0](LICENSE-CC-BY-4.0).

When retaining or adapting ProcessBook text, figures, questions, explanations, definitions, or educational data, identify the upstream chapter/source, link to it and to CC BY 4.0, and state the changes. Translation counts as a modification. Update [docs/UPSTREAM_ATTRIBUTION.md](docs/UPSTREAM_ATTRIBUTION.md) with chapter-level reuse as it is established. Preserve copyright/license headers in reused code. Do not mark wholly new writing as ProcessBook material.

## Metadata and checks

After changing a chapter route/title or metadata, run `python3 tools/head.py`. It regenerates English and Korean canonical/alternate/SEO/JSON-LD metadata and `sitemap.xml`. The generator requires all paired routes. The marker description should match the final lesson. Do not commit generated URLs for a route that does not exist.

Before a coherent change is committed, run `python3 tools/check_site.py` for paired routes, local links, IDs, input ranges, quizzes, and inline script syntax. Check simulator boundaries, equation units, mobile width, theme mode, browser console output, and `git diff --check` for the affected work. The repository has no package scripts; document checks that cannot be covered statically.
