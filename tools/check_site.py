#!/usr/bin/env python3
"""Check PMICBook's static English/Korean route and local-link contract.

Run from any directory: ``python3 tools/check_site.py``. Requires only Python 3
and Node.js for syntax checking inline chapter scripts.
"""

from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
REGISTRY = (ROOT / "js/common.js").read_text(encoding="utf-8")
SLUGS = re.findall(r'\{ slug: "([^"]+)"', REGISTRY)
ERRORS = []


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lang = ""
        self.body_chapter = None
        self.viewport = None
        self.ids = []
        self.inputs = []
        self.refs = []
        self.inline_scripts = []
        self.visible_text = []
        self._script = None
        self._hidden = 0

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag in ("script", "style"):
            self._hidden += 1
        if tag == "html":
            self.lang = values.get("lang", "")
        if tag == "body":
            self.body_chapter = values.get("data-chapter")
        if tag == "meta" and values.get("name") == "viewport":
            self.viewport = values.get("content")
        if "id" in values:
            self.ids.append(values["id"])
        if tag == "input":
            self.inputs.append(tuple(values.get(key) for key in
                                     ("id", "type", "min", "max", "step", "value")))
        if tag in ("a", "link", "script", "img", "source"):
            ref = values.get("href") or values.get("src")
            if ref:
                self.refs.append(ref)
        if tag == "script" and "src" not in values and values.get("type") != "application/ld+json":
            self._script = []

    def handle_data(self, data):
        if self._script is not None:
            self._script.append(data)
        elif not self._hidden:
            self.visible_text.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self._script is not None:
            self.inline_scripts.append("".join(self._script))
            self._script = None
        if tag in ("script", "style"):
            self._hidden -= 1


def parse(path):
    page = Page()
    page.feed(path.read_text(encoding="utf-8"))
    return page


def correct_options(source):
    answers = []
    for group in re.findall(r'<div class="opts">(.*?)</div>', source, re.S):
        buttons = re.findall(r'<button\b([^>]*)>', group)
        correct = []
        for index, attrs in enumerate(buttons):
            flag = re.search(r'\bdata-correct(?:\s*=\s*(["\'])(.*?)\1)?', attrs)
            if flag and (flag.group(2) is None or flag.group(2).lower() == "true"):
                correct.append(index)
        answers.append((len(buttons), tuple(correct)))
    return answers


if len(SLUGS) != 25 or len(set(SLUGS)) != 25:
    ERRORS.append(f"registry: expected 25 unique chapters, got {len(SLUGS)}")

routes = [ROOT / "index.html", ROOT / "ko/index.html"]
for slug in SLUGS:
    routes.extend((ROOT / "chapters" / f"{slug}.html",
                   ROOT / "ko/chapters" / f"{slug}.html"))
routes.append(ROOT / "chapters/resist.html")  # compatibility redirect
pages = {}
for path in routes:
    if not path.exists():
        ERRORS.append(f"missing route: {path.relative_to(ROOT)}")
        continue
    pages[path] = parse(path)

for path, page in pages.items():
    name = str(path.relative_to(ROOT))
    expected_lang = "ko" if name.startswith("ko/") else "en"
    if page.lang != expected_lang:
        ERRORS.append(f"{name}: html lang={page.lang!r}, expected {expected_lang!r}")
    if page.viewport != "width=device-width, initial-scale=1":
        ERRORS.append(f"{name}: missing or malformed responsive viewport")
    if path.parent.name == "chapters" and path.name != "resist.html":
        if page.body_chapter != path.stem:
            ERRORS.append(f"{name}: body chapter={page.body_chapter!r}, expected {path.stem!r}")
    if expected_lang == "ko":
        visible = " ".join(page.visible_text)
        hangul = len(re.findall(r"[가-힣]", visible))
        latin = len(re.findall(r"[A-Za-z]", visible))
        # A screen for accidental English-copy pages, not a translation-quality verdict.
        if hangul < 100 or hangul / max(1, hangul + latin) < 0.55:
            ERRORS.append(f"{name}: visible lesson text appears untranslated "
                          f"({hangul} Hangul / {latin} Latin letters)")
    duplicates = [key for key, count in Counter(page.ids).items() if count > 1]
    if duplicates:
        ERRORS.append(f"{name}: duplicate IDs {duplicates}")
    raw = path.read_text(encoding="utf-8")
    marker = re.search(r'<!--head:start (\{.*?\})-->', raw)
    if path.parent.name == "chapters" and path.name != "resist.html" and not marker:
        ERRORS.append(f"{name}: missing head marker")
    if marker:
        meta = json.loads(marker.group(1))
        if meta.get("lang") != expected_lang:
            ERRORS.append(f"{name}: head marker lang={meta.get('lang')!r}")
    for ref in page.refs:
        parsed = urlsplit(ref)
        if parsed.scheme or parsed.netloc or ref.startswith("//"):
            continue
        target = (path.parent / unquote(parsed.path)).resolve() if parsed.path else path
        if not target.is_relative_to(ROOT):
            ERRORS.append(f"{name}: local reference escapes repository: {ref}")
        elif not target.exists():
            ERRORS.append(f"{name}: missing local reference: {ref}")
        elif parsed.fragment and target.suffix == ".html":
            target_page = pages.get(target) or parse(target)
            if unquote(parsed.fragment) not in target_page.ids:
                ERRORS.append(f"{name}: missing fragment: {ref}")
    for index, script in enumerate(page.inline_scripts, 1):
        check = subprocess.run(["node", "--check", "-"], input=script, text=True,
                               stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False)
        if check.returncode:
            ERRORS.append(f"{name}: inline script {index}: {check.stderr.strip()[:200]}")

for slug in SLUGS:
    en = ROOT / "chapters" / f"{slug}.html"
    ko = ROOT / "ko/chapters" / f"{slug}.html"
    if en not in pages or ko not in pages:
        continue
    e, k = pages[en], pages[ko]
    if Counter(e.ids) != Counter(k.ids):
        ERRORS.append(f"{slug}: EN/KO element IDs differ")
    if Counter(e.inputs) != Counter(k.inputs):
        ERRORS.append(f"{slug}: EN/KO input ranges or defaults differ")
    ea = correct_options(en.read_text(encoding="utf-8"))
    ka = correct_options(ko.read_text(encoding="utf-8"))
    if ea != ka:
        ERRORS.append(f"{slug}: EN/KO quiz option counts or correct positions differ")
    if any(len(correct) != 1 for _, correct in ea):
        ERRORS.append(f"{slug}: quiz group lacks exactly one correct choice")

if ERRORS:
    print("Static site check failed:")
    for error in ERRORS:
        print(" -", error)
    raise SystemExit(1)

print(f"Static site check passed: {len(SLUGS)} paired chapters, {len(pages)} routes, "
      "local links/fragments, IDs, input and quiz parity, and inline JavaScript syntax.")
