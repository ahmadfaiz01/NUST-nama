"""Heuristic document metadata: title, publication date, doc_type.

Pure functions, no network and no LLM. The pipeline calls them at parse time;
backfill_metadata() applies them to rows that were stored before they existed.
"""
import re
from datetime import date, datetime
from email.utils import parsedate_to_datetime
from urllib.parse import unquote, urlparse

MAX_TITLE = 120
WORD_PREFIX = "Microsoft Word - "
_BAD_TITLE = re.compile(
    r"^(untitled|document\d*|doc\d*|microsoft word|network scan data|"
    r"powerpoint presentation|print|scan|new microsoft.*)$",
    re.I,
)
_FILE_EXT = re.compile(r"\.(pdf|doc|docx|indd|ppt|pptx|pub|xls|xlsx)$", re.I)
_YEAR = re.compile(r"(?<!\d)(20(?:1[5-9]|2\d|30))(?!\d)")

# Filename/title keyword -> doc_type, first match wins. 'handbook' etc. come
# first on purpose: Revised-Undergraduate-Handbook.pdf is policy, not a form.
RULES = [
    ("policy", ("handbook", "regulation", "policy", "policies", "rules", "sop", "statute")),
    ("form", ("form", "application", "proforma", "undertaking", "affidavit")),
    ("fee", ("fee", "challan", "dues")),
    ("scholarship", ("scholarship", "financial aid", "financial-aid")),
    ("prospectus", ("prospectus", "admission")),
    ("newsletter", ("newsletter", "nust-news", "nust news", "nn-")),
]


def filename(url: str) -> str:
    return unquote(urlparse(url).path.rsplit("/", 1)[-1])


def _deslug(name: str) -> str:
    name = _FILE_EXT.sub("", name)
    name = re.sub(r"^\d{4,}", "", name)          # NUST numeric upload ids
    name = re.sub(r"[-_+]+", " ", name)
    name = re.sub(r"\s+", " ", name).strip(" -_")
    return name.title() if name.islower() else name


def _sensible(t: str | None) -> str | None:
    """A PDF metadata title worth using, or None."""
    if not t:
        return None
    t = re.sub(r"\s+", " ", t).strip()
    if t.startswith(WORD_PREFIX):
        t = t[len(WORD_PREFIX):].strip()
        t = _deslug(t) if _FILE_EXT.search(t) else t
    if len(t) < 4 or _BAD_TITLE.match(t) or _FILE_EXT.search(t):
        return None
    return t[:MAX_TITLE]


def _sensible_heading(t: str | None) -> str | None:
    """As _sensible, plus the checks a page-1 line needs and a metadata field doesn't.

    The largest line on page 1 is often a mid-sentence fragment ("to collect my
    Bachelor degree") or a rule of dashes. A real title starts a phrase.
    """
    t = _sensible(t)
    if not t or sum(c.isalpha() for c in t) < 4:
        return None
    if not t[0].isalnum() or (t[0].isalpha() and t[0].islower()):
        return None
    # Cover-page display type is a fragment of a slogan ("AIM HIGHER", "We AIM",
    # "Excellence"). The filename beats a fragment, so demand a real phrase.
    if len(t) < 12 or " " not in t.strip():
        return None
    return t


def clean_title(pdf_meta_title, largest_font_text, url) -> str:
    """PDF metadata title, else biggest text on page 1-2, else de-slugged filename."""
    return (
        _sensible(pdf_meta_title)
        or _sensible_heading(largest_font_text)
        or _deslug(filename(url))
        or url
    )


def _from_pdf_date(value) -> date | None:
    m = re.search(r"(\d{4})(\d{2})(\d{2})", str(value or ""))
    if not m:
        return None
    try:
        return date(*(int(g) for g in m.groups()))
    except ValueError:
        return None


def guess_published(pdf_meta, url, http_last_modified) -> date | None:
    """PDF creation/mod date, else a year in the FILENAME, else Last-Modified.

    Never the year in the URL path: /wp-content/uploads/2020/03/ is when the file
    was uploaded, not what edition the document is.
    """
    for key in ("creationDate", "modDate"):
        d = _from_pdf_date((pdf_meta or {}).get(key))
        if d:
            return d

    years = _YEAR.findall(filename(url or ""))
    if years:
        return date(int(years[-1]), 1, 1)

    if http_last_modified:
        try:
            return parsedate_to_datetime(http_last_modified).date()
        except (TypeError, ValueError):
            try:
                return datetime.fromisoformat(http_last_modified).date()
            except ValueError:
                return None
    return None


def classify(url, title, inherited_doc_type) -> str | None:
    """Filename and title evidence outranks the inherited sitemap doc_type.

    Inheritance is what mislabelled the handbooks as 'form' — they are linked
    from /downloads/ pages — so it is only the fallback.
    """
    haystack = f"{filename(url or '')} {title or ''}".lower()
    for doc_type, keywords in RULES:
        if any(k in haystack for k in keywords):
            return doc_type
    return inherited_doc_type


def metadata_for(row: dict, pdf_meta: dict | None = None,
                 largest_font_text: str | None = None) -> dict:
    """The three heuristics as a `documents` update dict."""
    url = row["url"]
    title = clean_title((pdf_meta or {}).get("title"), largest_font_text, url)
    published = guess_published(pdf_meta, url, row.get("http_last_modified"))
    doc_type = classify(url, title, row.get("doc_type"))
    out = {
        "title": title,
        "doc_type": doc_type,
        "published_at": published.isoformat() if published else None,
        "valid_from_year": published.year if published else None,
    }
    if doc_type == "newsletter":
        out["indexed"] = False       # answers none of the chatbot's questions
    return out


def _largest_font_text(doc) -> str | None:
    """Biggest line of text on page 1-2, reusing outline.py's line scanner."""
    from ingest.outline import _lines

    best = max(
        ((size, text) for page, text, size, _b, _o in _lines(doc)
         if page <= 2 and 4 <= len(text) <= MAX_TITLE),
        default=None,
    )
    return best[1] if best else None


def backfill_metadata(limit: int | None = None) -> dict:
    """Recompute title/published_at/doc_type for existing rows. Touches nothing else."""
    import fitz

    from ingest import config
    from ingest.fetcher import Fetcher

    s = config.supabase()
    rows = s.table("documents").select("*").execute().data
    if limit:
        rows = rows[:limit]

    counts = {"updated": 0, "failed": 0}
    fetcher = Fetcher()
    try:
        for i, row in enumerate(rows, 1):
            pdf_meta, largest = None, None
            try:
                if row["source_type"] == "pdf" and row.get("storage_path"):
                    body = s.storage.from_(config.STORAGE_BUCKET).download(row["storage_path"])
                    doc = fitz.open(stream=body, filetype="pdf")
                    pdf_meta = doc.metadata or {}
                    if not _sensible(pdf_meta.get("title")):
                        largest = _largest_font_text(doc)
                    doc.close()
                elif row["source_type"] != "pdf":
                    html = fetcher.get(row["final_url"] or row["url"]).body.decode(
                        "utf-8", "replace")
                    largest = _html_title(html)
            except Exception as exc:
                counts["failed"] += 1
                print(f"[{i}/{len(rows)}] meta failed {row['url'][:70]}: {exc}")

            fields = metadata_for(row, pdf_meta, largest)
            s.table("documents").update(fields).eq("id", row["id"]).execute()
            counts["updated"] += 1
            print(f"[{i}/{len(rows)}] {fields['doc_type']} {fields['published_at']} "
                  f"{fields['title'][:60]}")
    finally:
        fetcher.close()
    return counts


def _html_title(html: str) -> str | None:
    """<title>, falling back to the first <h1>."""
    for pattern in (r"<title[^>]*>(.*?)</title>", r"<h1[^>]*>(.*?)</h1>"):
        m = re.search(pattern, html, re.I | re.S)
        if m:
            text = re.sub(r"<[^>]+>", " ", m.group(1))
            text = re.sub(r"\s+", " ", text).strip()
            if len(text) >= 4:
                return text[:MAX_TITLE]
    return None


if __name__ == "__main__":
    print(backfill_metadata())
