"""Web page -> section dicts matching the `sections` table."""

import re

import trafilatura

from ingest.sections import build_embed_text, merge_small

MIN_CONTENT = 50
HEADING = re.compile(r"^(#{1,6})\s+(.*)")


def sections_for(document_id: str, html: str, url: str, title: str) -> list[dict]:
    md = trafilatura.extract(html, output_format="markdown", include_links=False)
    if not md:
        return []

    chunks, stack, path, body = [], [], title, []
    for line in md.splitlines():
        m = HEADING.match(line)
        if not m:
            body.append(line)
            continue
        chunks.append((path, "\n".join(body)))
        stack = stack[: len(m.group(1)) - 1]
        stack.append(m.group(2).strip())
        path, body = " > ".join(stack), []
    chunks.append((path, "\n".join(body)))

    out = []
    for heading_path, content in chunks:
        if len(content.strip()) < MIN_CONTENT:
            continue
        out.append(
            {
                "document_id": document_id,
                "ordinal": len(out),
                "heading_path": heading_path,
                "content": content,
                "embed_text": build_embed_text(heading_path, content),
                "page_start": None,
                "page_end": None,
            }
        )
    return merge_small(out)
