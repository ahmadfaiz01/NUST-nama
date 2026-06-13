"""Infer a table of contents from font formatting, for PDFs with no embedded outline."""

from collections import Counter

MAX_LEVELS = 4
BOILERPLATE_PAGE_FRACTION = 0.25


def _lines(doc):
    """Yield (page_1indexed, text, size, bold) for every line with spans."""
    for pno in range(doc.page_count):
        for block in doc[pno].get_text("dict")["blocks"]:
            for line in block.get("lines", []):
                spans = [s for s in line["spans"] if s["text"].strip()]
                if not spans:
                    continue
                text = "".join(s["text"] for s in spans).strip()
                dom = max(spans, key=lambda s: len(s["text"]))
                yield pno + 1, text, round(dom["size"], 1), bool(dom["flags"] & 2**4)


def detect_outline(doc) -> list[tuple[int, str, int]]:
    """Infer a table of contents from font formatting.

    Takes an open fitz.Document. Returns entries in the same
    (level, title, page_1indexed) shape as fitz's doc.get_toc(), so it is a
    drop-in substitute when the PDF has no embedded outline.
    """
    lines = list(_lines(doc))
    if not lines:
        return []

    chars = Counter()
    for _, text, size, bold in lines:
        chars[(size, bold)] += len(text)
    body_size, body_bold = chars.most_common(1)[0][0]

    candidates = []
    for page, text, size, bold in lines:
        if size < body_size:
            continue  # running headers, footers, page numbers
        if not (3 <= len(text) <= 120):
            continue
        if not any(c.isalpha() for c in text):
            continue
        if size > body_size or (size == body_size and bold and not body_bold):
            candidates.append((page, text, size, bold))

    # Cover-page display text ("AIM HIGHER", "BS-HND 2026") is the largest type in
    # the document and appears on that one page only; real heading styles recur
    # throughout. So drop any style confined to a single page — unless that leaves
    # none, since a short document's headings may genuinely all sit on one page.
    style_pages = {}
    for page, _, size, bold in candidates:
        style_pages.setdefault((size, bold), set()).add(page)
    kept = {st for st, pages in style_pages.items() if len(pages) > 1}
    if kept:
        candidates = [c for c in candidates if (c[2], c[3]) in kept]

    # levels derived after the drop, so the surviving top style is level 1
    styles = sorted({(s, b) for _, _, s, b in candidates}, key=lambda x: (-x[0], not x[1]))
    level_of = {st: min(i + 1, MAX_LEVELS) for i, st in enumerate(styles)}

    title_pages = Counter()
    for _, text, _, _ in candidates:
        title_pages[text] += 1
    boilerplate = {
        t for t, n in title_pages.items() if n > max(2, doc.page_count * BOILERPLATE_PAGE_FRACTION)
    }

    out, last = [], None
    for page, text, size, bold in candidates:
        if text in boilerplate:
            continue
        level = level_of[(size, bold)]
        if last == (level, text):
            continue  # same heading repeating across consecutive pages
        last = (level, text)
        out.append((level, text, page))
    return out


if __name__ == "__main__":
    import fitz

    d = fitz.open()
    p = d.new_page()
    p.insert_text((72, 100), "Chapter One", fontname="hebo", fontsize=16)
    for i in range(40):
        p.insert_text((72, 130 + i * 12), "body text line here", fontname="helv", fontsize=12)
    def body(page, n=40):
        for i in range(n):
            page.insert_text((72, 130 + i * 12), "body text line here", fontsize=12)

    # only-headings-on-page-1 guard: the rule must not strip the sole style
    d = fitz.open()
    p = d.new_page()
    p.insert_text((72, 100), "Chapter One", fontname="hebo", fontsize=16)
    body(p)
    assert detect_outline(d) == [(1, "Chapter One", 1)], detect_outline(d)

    # cover style dropped, and levels re-derived so 24pt gone -> 16pt becomes level 1
    d = fitz.open()
    p1 = d.new_page()
    p1.insert_text((72, 100), "AIM HIGHER", fontname="hebo", fontsize=24)  # cover style
    p1.insert_text((72, 200), "Chapter One", fontname="hebo", fontsize=16)
    body(p1)
    p2 = d.new_page()
    p2.insert_text((72, 100), "Chapter Two", fontname="hebo", fontsize=16)
    body(p2)
    toc = detect_outline(d)
    assert toc == [(1, "Chapter One", 1), (1, "Chapter Two", 2)], toc
    print("ok", toc)
