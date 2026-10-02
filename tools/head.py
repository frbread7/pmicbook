#!/usr/bin/env python3
# Copyright (c) 2026 geniuskey and ProcessBook contributors. MIT (see ../LICENSE-MIT).
"""Generate localized PMICBook metadata and sitemap entries.

Chapter pages carry a replaceable marker:
  <!--head:start {"desc":"...", "libs":["xsec"], "lang":"en"}-->
  ... generated metadata and shared script/style links ...
  <!--head:end-->

The English routes are read from PB.CHAPTERS in js/common.js. Korean routes,
when added, must mirror all registered chapter slugs under ko/chapters/ and
include ko/index.html. Partial Korean route sets fail closed so the generated
language switcher, hreflang links, and sitemap cannot point at missing pages.

Run: python3 tools/head.py
"""
import datetime
import html
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://frbread7.github.io/pmicbook/"
BOOK_EN = "PMICBook: Power Management IC Technology"
BOOK_KO = "PMICBook: 전력관리 IC 기술"
TODAY = datetime.date.today().isoformat()

src = (ROOT / "js/common.js").read_text(encoding="utf-8")
chapter_pattern = re.compile(
    r'\{\s*slug:\s*"([\w-]+)",\s*num:\s*"(\d+)",\s*'
    r'title:\s*"([^"]+)",\s*titleKo:\s*"([^"]+)"',
)
CH = [
    {"slug": m[0], "num": m[1], "title": m[2], "titleKo": m[3]}
    for m in chapter_pattern.findall(src)
]
if not CH:
    raise SystemExit("no chapter routes found in PB.CHAPTERS")
if len({c["slug"] for c in CH}) != len(CH):
    raise SystemExit("duplicate chapter slug in PB.CHAPTERS")

MARKER = re.compile(r"(<!--head:start (\{.*?\})-->\n)(.*?)(<!--head:end-->)", re.S)


def chapter_url(chapter, lang):
    prefix = "ko/" if lang == "ko" else ""
    return f"{SITE}{prefix}chapters/{chapter['slug']}.html"


def page_title(chapter, lang):
    return chapter["titleKo"] if lang == "ko" else chapter["title"]


def hreflang_tags(en_url, ko_url=None):
    rows = [f'<link rel="alternate" hreflang="en" href="{en_url}">']
    if ko_url:
        rows.extend([
            f'<link rel="alternate" hreflang="ko" href="{ko_url}">',
            f'<link rel="alternate" hreflang="x-default" href="{en_url}">',
        ])
    return "\n".join(rows)


def chapter_head(chapter, meta, lang, paired):
    marker_lang = meta.get("lang", lang)
    if marker_lang != lang:
        raise SystemExit(f"{chapter['slug']}: marker lang={marker_lang!r}, expected {lang!r}")
    if "desc" not in meta or not meta["desc"].strip():
        raise SystemExit(f"{chapter['slug']}: head marker needs a non-empty desc")

    url = chapter_url(chapter, lang)
    en_url = chapter_url(chapter, "en")
    ko_url = chapter_url(chapter, "ko") if paired else None
    title = f"{page_title(chapter, lang)} · PMICBook"
    desc = meta["desc"]
    libs = meta.get("libs", [])
    og_locale = "ko_KR" if lang == "ko" else "en_US"
    book = BOOK_KO if lang == "ko" else BOOK_EN
    book_url = SITE + ("ko/" if lang == "ko" else "")
    prefix = "../../" if lang == "ko" else "../"
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": ["Chapter", "LearningResource"], "@id": url + "#chapter", "name": page_title(chapter, lang), "headline": title,
         "description": desc, "url": url, "position": int(chapter["num"]), "inLanguage": lang, "isAccessibleForFree": True,
         "learningResourceType": "Interactive textbook" if lang == "en" else "인터랙티브 교재",
         "educationalLevel": "Undergraduate and engineering professional" if lang == "en" else "공학 학부 및 실무 참고 자료",
         "image": SITE + "og.png", "dateModified": TODAY,
         "isPartOf": {"@type": "Book", "@id": book_url + "#book", "name": book, "url": book_url}},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "PMICBook", "item": SITE},
            {"@type": "ListItem", "position": 2, "name": f"{int(chapter['num'])}. {page_title(chapter, lang)}", "item": url}]}]}
    escape_attr = lambda value: html.escape(value, quote=True)
    out = f'''<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape_attr(title)}</title>
<meta name="description" content="{escape_attr(desc)}">
<link rel="canonical" href="{url}">
{hreflang_tags(en_url, ko_url)}
<link rel="icon" type="image/svg+xml" href="{prefix}favicon.svg">
<meta name="theme-color" content="#c2550c">
<meta property="og:type" content="article">
<meta property="og:site_name" content="PMICBook">
<meta property="og:locale" content="{og_locale}">
<meta property="og:title" content="{escape_attr(title)}">
<meta property="og:description" content="{escape_attr(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False, separators=(',', ':'))}</script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
<link rel="stylesheet" href="{prefix}css/style.css">
<script src="{prefix}js/common.js"></script>
'''
    if "xsec" in libs:
        out += f'<script src="{prefix}js/xsec.js"></script>\n'
    if "optics" in libs:
        out += f'<script src="{prefix}js/optics.js"></script>\n'
    if "three" in libs:
        out += '<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js"></script>\n'
        out += '<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/controls/OrbitControls.js"></script>\n'
    return out


def set_html_lang(page, lang):
    page, n = re.subn(r'(<html\b[^>]*\blang=")[^"]*(")', rf'\g<1>{lang}\2', page, count=1)
    if n:
        return page
    page, n = re.subn(r"<html\b", f'<html lang="{lang}"', page, count=1)
    if not n:
        raise SystemExit("missing <html> element")
    return page


def replace_or_insert(page, pattern, replacement):
    updated, count = re.subn(pattern, lambda _match: replacement, page, count=1, flags=re.I)
    if count:
        return updated
    head_end = re.search(r"</head\s*>", page, flags=re.I)
    if not head_end:
        raise SystemExit("missing </head> while writing home metadata")
    return page[:head_end.start()] + replacement + "\n" + page[head_end.start():]


def refresh_home(path, lang, paired):
    if not path.exists():
        raise SystemExit(f"missing home route: {path.relative_to(ROOT)}")
    page = path.read_text(encoding="utf-8")
    title_match = re.search(r"<title>(.*?)</title>", page, flags=re.I | re.S)
    desc_match = re.search(r'<meta\s+name="description"\s+content="([^"]*)"\s*/?>', page, flags=re.I)
    if not title_match or not desc_match:
        raise SystemExit(f"{path.relative_to(ROOT)} needs title and description metadata")
    title = html.unescape(title_match.group(1).strip())
    desc = html.unescape(desc_match.group(1).strip())
    url = SITE + ("ko/" if lang == "ko" else "")
    en_url = SITE
    ko_url = SITE + "ko/" if paired else None
    page = set_html_lang(page, lang)
    if lang == "ko":
        for attr, relative_path in (("href", "favicon.svg"), ("href", "css/style.css"), ("src", "js/common.js")):
            pattern = rf'({attr}=")(?:\.\./)?{re.escape(relative_path)}(")'
            page = re.sub(pattern, lambda match: match.group(1) + "../" + relative_path + match.group(2), page, flags=re.I)
    page = replace_or_insert(page, r'<link\s+rel="canonical"\s+href="[^"]*"\s*/?>', f'<link rel="canonical" href="{url}">')
    page = re.sub(r'<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*/?>\s*', "", page, flags=re.I)
    alternate = hreflang_tags(en_url, ko_url)
    head_end = re.search(r"</head\s*>", page, flags=re.I)
    if not head_end:
        raise SystemExit(f"{path.relative_to(ROOT)} is missing </head>")
    page = page[:head_end.start()] + alternate + "\n" + page[head_end.start():]

    def set_meta(key, value, kind="name"):
        attr = "property" if kind == "property" else "name"
        escaped = html.escape(value, quote=True)
        pattern = rf'<meta\s+{attr}="{re.escape(key)}"\s+content="[^"]*"\s*/?>'
        return replace_or_insert(page, pattern, f'<meta {attr}="{key}" content="{escaped}">')

    page = set_meta("description", desc)
    page = set_meta("og:site_name", "PMICBook", "property")
    page = set_meta("og:locale", "ko_KR" if lang == "ko" else "en_US", "property")
    page = set_meta("og:title", title, "property")
    page = set_meta("og:description", desc, "property")
    page = set_meta("og:url", url, "property")
    page = set_meta("og:image", SITE + "og.png", "property")

    home_book = BOOK_KO if lang == "ko" else BOOK_EN
    language_parts = [{
        "@type": "Chapter", "name": page_title(c, lang), "position": int(c["num"]),
        "url": chapter_url(c, lang),
    } for c in CH]
    graph = [
        {"@type": "WebSite", "@id": SITE + "#site", "name": "PMICBook", "url": url,
         "inLanguage": lang, "description": desc},
        {"@type": "Book", "@id": url + "#book", "name": home_book,
         "url": url, "inLanguage": lang, "isAccessibleForFree": True,
         "educationalLevel": "Undergraduate and engineering professional" if lang == "en" else "공학 학부 및 실무 참고 자료",
         "about": ["power management integrated circuits", "BCD technology", "semiconductor fabrication", "power electronics", "reliability"],
         "description": desc, "image": SITE + "og.png", "dateModified": TODAY, "hasPart": language_parts},
    ]
    jsonld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, separators=(",", ":"))
    json_script = f'<script type="application/ld+json">{jsonld}</script>'
    page = replace_or_insert(page, r'<script\s+type="application/ld\+json">.*?</script>', json_script)
    path.write_text(page, encoding="utf-8")
    print("home", path.relative_to(ROOT), "updated")


def localized_routes():
    ko_index = ROOT / "ko" / "index.html"
    ko_dir = ROOT / "ko" / "chapters"
    expected = {f"{c['slug']}.html" for c in CH}
    actual = {p.name for p in ko_dir.glob("*.html")} if ko_dir.exists() else set()
    korean_present = ko_index.exists() or bool(actual)
    if korean_present:
        missing = sorted(expected - actual)
        extra = sorted(actual - expected)
        if not ko_index.exists() or missing or extra:
            details = []
            if not ko_index.exists():
                details.append("ko/index.html is missing")
            if missing:
                details.append("missing Korean chapter routes: " + ", ".join(missing))
            if extra:
                details.append("unregistered Korean chapter routes: " + ", ".join(extra))
            raise SystemExit("incomplete bilingual route parity: " + "; ".join(details))
    return korean_present


paired = localized_routes()
for chapter in CH:
    for lang in (["en", "ko"] if paired else ["en"]):
        path = ROOT / ("ko/chapters" if lang == "ko" else "chapters") / f"{chapter['slug']}.html"
        if not path.exists():
            raise SystemExit(f"missing registered chapter: {path.relative_to(ROOT)}")
        page = path.read_text(encoding="utf-8")
        marker = MARKER.search(page)
        if not marker:
            raise SystemExit(f"missing head marker: {path.relative_to(ROOT)}")
        meta = json.loads(marker.group(2))
        page = page[:marker.start()] + marker.group(1) + chapter_head(chapter, meta, lang, paired) + marker.group(4) + page[marker.end():]
        page = set_html_lang(page, lang)
        path.write_text(page, encoding="utf-8")
        print("ok", path.relative_to(ROOT))


# Refresh home-page metadata only after paired routes pass the parity gate.
refresh_home(ROOT / "index.html", "en", paired)
if paired:
    refresh_home(ROOT / "ko" / "index.html", "ko", paired)

# Sitemap uses only routes that exist; Korean URLs are added as a complete set.
urls = [SITE] + [chapter_url(c, "en") for c in CH]
if paired:
    urls += [SITE + "ko/"] + [chapter_url(c, "ko") for c in CH]
url_rows = "".join(f"  <url><loc>{url}</loc><lastmod>{TODAY}</lastmod></url>\n" for url in urls)
(ROOT / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + url_rows + "</urlset>\n",
    encoding="utf-8",
)
print("sitemap", len(urls), "routes")
