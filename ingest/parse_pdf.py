"""PDF -> section dicts matching the `sections` table."""

import fitz  # pymupdf imports as fitz

from ingest.outline import detect_outline
from ingest.sections import build_embed_text, toc_to_ranges

MIN_CONTENT = 50


def sections_for(document_id: str, body: bytes, title: str) -> list[dict]:
    doc = fitz.open(stream=body, filetype="pdf")
    page_text = [doc[i].get_text() for i in range(doc.page_count)]
    if not any(t.strip() for t in page_text):
        return []  # scanned; caller sets needs_ocr

    out = []
    toc = doc.get_toc() or detect_outline(doc)
    for r in toc_to_ranges(toc, doc.page_count):
        content = "\n".join(page_text[r.page_start - 1 : r.page_end])
        if len(content.strip()) < MIN_CONTENT:
            continue
        heading_path = r.heading_path or title
        out.append(
            {
                "document_id": document_id,
                "ordinal": len(out),
                "heading_path": heading_path,
                "content": content,
                "embed_text": build_embed_text(heading_path, content),
                "page_start": r.page_start,
                "page_end": r.page_end,
            }
        )
    return out
