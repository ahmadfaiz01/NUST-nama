"""Turn a PDF outline into section page ranges. Pure logic — no pymupdf, no DB."""

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


def build_embed_text(heading_path: str, content: str, words: int = 200) -> str:
    return f"{heading_path}\n{' '.join(content.split()[:words])}"
