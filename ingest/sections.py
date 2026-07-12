"""Turn a PDF outline into section page ranges. Pure logic — no pymupdf, no DB."""

import re
from dataclasses import dataclass


@dataclass
class SectionRange:
    heading_path: str
    page_start: int
    page_end: int


def toc_to_ranges(toc: list[tuple[int, str, int]], page_count: int) -> list[SectionRange]:
    if not toc:
        return [SectionRange("", 1, page_count)]

    ranges, stack = [], []
    for i, (level, title, page) in enumerate(toc):
        stack = stack[: level - 1]
        stack.append(title)
        end = toc[i + 1][2] - 1 if i + 1 < len(toc) else page_count
        ranges.append(SectionRange(" > ".join(stack), page, max(end, page)))
    return ranges


MIN_SECTION = 200
MAX_SECTION = 40_000


def merge_small(sections: list[dict]) -> list[dict]:
    """Fold sections under MIN_SECTION chars into the previous kept one."""
    out: list[dict] = []
    for s in sections:
        prev = out[-1] if out else None
        # merge s into prev if either is undersized (first-undersized merges forward)
        if prev and (len(s["content"]) < MIN_SECTION or len(prev["content"]) < MIN_SECTION):
            merged = f"{prev['content']}\n{s['content']}"
            if len(merged) <= MAX_SECTION:
                # an undersized first section keeps the next section's heading
                if len(prev["content"]) < MIN_SECTION and len(s["content"]) >= MIN_SECTION:
                    prev["heading_path"] = s["heading_path"]
                prev["content"] = merged
                prev["page_end"] = s["page_end"] if s["page_end"] is not None else prev["page_end"]
                if prev["page_start"] is None:
                    prev["page_start"] = s["page_start"]
                prev["embed_text"] = build_embed_text(prev["heading_path"], merged)
                continue
        out.append(s)
    for i, s in enumerate(out):
        s["ordinal"] = i
    return out


MIN_SPLIT = 400
MAX_LABEL = 60

# NUST handbooks carry their actual rules in lettered/numbered sub-clauses that are
# not visually distinct, so font-based heading detection lumps them all together.
CLAUSE_RE = re.compile(
    r"^[ \t]*(?:\(\d{1,2}\)\s|[a-z]\.\s+(?=[A-Z])|\d{1,2}\.\s+(?=[A-Z]))",
    re.M,
)


def _clause_label(chunk: str) -> str:
    m = CLAUSE_RE.match(chunk)
    if not m:
        return ""
    rest = " ".join(chunk[m.end() :].split())[:MAX_LABEL]
    cut = min((i for i in (rest.find("."), rest.find(":")) if i >= 0), default=len(rest))
    return f"{m.group(0).strip()} {rest[:cut]}".strip()


def split_clauses(sections: list[dict]) -> list[dict]:
    """Sub-split font-detected sections on `a.` / `(1)` / `1.` clause markers."""
    out: list[dict] = []
    seen = {s["content"] for s in sections}
    for s in sections:
        starts = [m.start() for m in CLAUSE_RE.finditer(s["content"])] if len(s["content"]) >= MIN_SPLIT else []
        if len(starts) < 2:  # a lone marker is a false positive; leave the section whole
            out.append(s)
            continue
        bounds = ([0] if starts[0] > 0 else []) + starts
        for i, start in enumerate(bounds):
            chunk = s["content"][start : bounds[i + 1] if i + 1 < len(bounds) else len(s["content"])]
            label = _clause_label(chunk) if start in starts else ""
            heading = f"{s['heading_path']} > {label}" if label else s["heading_path"]
            if chunk in seen:
                continue
            seen.add(chunk)
            out.append({**s, "heading_path": heading, "content": chunk,
                        "embed_text": build_embed_text(heading, chunk)})
    for i, s in enumerate(out):
        s["ordinal"] = i
    return out


def build_embed_text(heading_path: str, content: str, words: int = 200) -> str:
    return f"{heading_path}\n{' '.join(content.split()[:words])}"
