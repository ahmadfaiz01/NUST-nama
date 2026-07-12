"""PDF -> section dicts matching the `sections` table."""

import fitz  # pymupdf imports as fitz

from ingest.outline import detect_outline_positions
from ingest.sections import build_embed_text, merge_small, split_clauses, toc_to_ranges

MIN_CONTENT = 50


def _slices(toc, page_text):
    """Yield (heading_path, content, page_start, page_end) split at heading offsets.

    toc entries are (level, title, page_1indexed, char_offset_in_page).
    """
    stack = []
    for i, (level, title, page, off) in enumerate(toc):
        stack = stack[: level - 1]
        stack.append(title)
        if i + 1 < len(toc):
            end_page, end_off = toc[i + 1][2], toc[i + 1][3]
        else:
            end_page, end_off = len(page_text), len(page_text[-1])
        if end_page == page:
            content = page_text[page - 1][off:end_off]
        else:
            content = "\n".join(
                [page_text[page - 1][off:]]
                + page_text[page : end_page - 1]
                + [page_text[end_page - 1][:end_off]]
            )
        yield " > ".join(stack), content, page, max(end_page, page)


def sections_for(document_id: str, body: bytes, title: str) -> list[dict]:
    doc = fitz.open(stream=body, filetype="pdf")
    page_text = [doc[i].get_text() for i in range(doc.page_count)]
    if not any(t.strip() for t in page_text):
        return []  # scanned; caller sets needs_ocr

    embedded = doc.get_toc()
    if embedded:
        slices = (
            (r.heading_path, "\n".join(page_text[r.page_start - 1 : r.page_end]), r.page_start, r.page_end)
            for r in toc_to_ranges(embedded, doc.page_count)
        )
    else:
        toc = detect_outline_positions(doc)
        slices = (
            _slices(toc, page_text)
            if toc
            else [("", "\n".join(page_text), 1, doc.page_count)]
        )

    out, seen = [], set()
    for heading_path, content, page_start, page_end in slices:
        if len(content.strip()) < MIN_CONTENT:
            continue
        if content in seen:
            continue
        seen.add(content)
        heading_path = heading_path or title
        out.append(
            {
                "document_id": document_id,
                "ordinal": len(out),
                "heading_path": heading_path,
                "content": content,
                "embed_text": build_embed_text(heading_path, content),
                "page_start": page_start,
                "page_end": page_end,
            }
        )
    if not embedded:
        out = split_clauses(out)
    return merge_small(out)
