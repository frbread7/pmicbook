# PMICBook — Power Management IC Technology

PMICBook is an interactive engineering textbook about power-management integrated circuits. It connects system rails and specifications to circuit behavior, semiconductor devices, BCD technology, fabrication and process integration, layout and parasitics, thermal behavior, characterization, reliability, and failure analysis.

This repository is a derivative of [ProcessBook](https://github.com/geniuskey/processbook), which remains the primary implementation base. PMICBook retains its static-site structure, chapter navigation, educational helpers, and 2D process cross-section engine while adapting the content and chapter path for PMIC/BCD learning. The upstream starting point is commit `0bc4314d1e13c485a658e0cb1d4fd237b5fc8dff`, recorded by the `upstream-processbook-baseline` tag. See [upstream attribution and reuse notes](docs/UPSTREAM_ATTRIBUTION.md).

## Run locally

PMICBook is a static site with no build step or package installation. From the repository root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/> for English or <http://localhost:8000/ko/> for Korean. The language control on the home page and each chapter opens the matching page in the other language; chapter links and navigation stay in the selected language. KaTeX, selected visualizations, and web fonts are loaded from public CDNs, so those features need an internet connection. Core HTML and CSS are served locally.

## Learning path

The 25-chapter map moves from PMIC systems and circuits through devices, BCD, fabrication, implementation, test, reliability, and advanced context. Each subject has paired English and Korean lessons. Start at [the English system overview](chapters/overview.html) or [the Korean system overview](ko/chapters/overview.html), or browse all chapters from either home page. Each chapter links to prerequisites and follow-on material where useful.

The [architecture document](docs/PMICBOOK_ARCHITECTURE.md) records the audited chapter map, learning interactions, and ProcessBook content dispositions. [Current milestone](docs/CURRENT_MILESTONE.md) defines PMICBook v1 scope. Future ideas are kept separately in [VISION](docs/VISION.md).

## Educational and numerical limits

PMICBook is a learning resource, not a foundry process manual, qualification guide, circuit signoff tool, device TCAD model, or product design reference. Process cross-sections are simplified, two-dimensional teaching models; they do not describe a proprietary manufacturing recipe. Simulator values are either traced to public sources or clearly labeled as illustrative assumptions, with units and model limits stated near the example.

## Development

- [CONTRIBUTING.md](CONTRIBUTING.md) explains chapter structure, citations, simulator assumptions, metadata generation, and attribution.
- [docs/REFERENCES.md](docs/REFERENCES.md) is the structured index of public technical sources. A listing there is not blanket support for a technical claim; cite the source next to the relevant lesson claim.
- [docs/DECISIONS.md](docs/DECISIONS.md) records product and architecture choices.
- [docs/BASELINE_VALIDATION.md](docs/BASELINE_VALIDATION.md) records checks run on ProcessBook before transformation.

After updating a chapter's title, marker, or route, run:

```bash
python3 tools/head.py
```

The generator updates English/Korean canonical and `hreflang` metadata, structured data, `sitemap.xml`, and home-page JSON-LD. It requires all 25 matching Korean chapter routes before publishing language links. The chapter order and localized titles live in `PB.CHAPTERS` in `js/common.js`.

## Deployment status

GitHub Pages is not currently configured for this fork. The intended project-site URL is <https://frbread7.github.io/pmicbook/>; canonical and sitemap entries use that path in preparation for a later Pages setup. To publish, configure the repository's **Settings → Pages** to deploy the `main` branch from the repository root after reviewing the finished content and metadata. No ProcessBook custom domain is carried by this fork.

## Licensing and attribution

PMICBook preserves ProcessBook's dual-license model:

- Executable/framework code is under the [MIT License](LICENSE-MIT). Preserve applicable copyright and license notices when reusing code.
- Educational prose, illustrations, questions, and explanations are under [CC BY 4.0](LICENSE-CC-BY-4.0). Attribute retained or adapted ProcessBook material, link to its source/license, and identify modifications, including translation.

Read the [license guide](LICENSE.md) and [upstream attribution record](docs/UPSTREAM_ATTRIBUTION.md). Per-chapter attribution is recorded when upstream educational material is actually retained or adapted. Third-party sources and dependencies keep their own terms.
