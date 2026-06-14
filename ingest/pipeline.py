"""One runner: discover -> download -> parse into sections. Bounded so it cannot run away."""
from urllib.parse import unquote, urlparse

from ingest import config, discover, download, parse_html, parse_pdf
from ingest.fetcher import Fetcher

BATCH = 100


def _title(row: dict) -> str:
    name = unquote(urlparse(row["url"]).path.rsplit("/", 1)[-1])
    return row.get("title") or name or row["url"]


def _parse_all() -> dict:
    """Parse every documents row that has no sections yet."""
    s = config.supabase()
    docs = s.table("documents").select("*").execute().data
    have = {r["document_id"] for r in s.table("sections").select("document_id").execute().data}
    todo = [d for d in docs if d["id"] not in have]
    print(f"parsing {len(todo)} of {len(docs)} documents")

    fetcher = Fetcher()
    parsed = sections = ocr = failed = 0
    try:
        for i, doc in enumerate(todo, 1):
            try:
                if doc["source_type"] == "pdf":
                    body = s.storage.from_(config.STORAGE_BUCKET).download(doc["storage_path"])
                    rows = parse_pdf.sections_for(doc["id"], body, _title(doc))
                    if not rows:
                        s.table("documents").update(
                            {"needs_ocr": True, "indexed": False}
                        ).eq("id", doc["id"]).execute()
                        ocr += 1
                else:
                    result = fetcher.get(doc["final_url"] or doc["url"])
                    rows = parse_html.sections_for(
                        doc["id"],
                        result.body.decode("utf-8", "replace"),
                        doc["url"],
                        _title(doc),
                    )
                for j in range(0, len(rows), BATCH):
                    s.table("sections").insert(rows[j : j + BATCH]).execute()
                parsed += 1
                sections += len(rows)
                print(f"[{i}/{len(todo)}] {len(rows):4d} sections  {doc['url'][:80]}")
            except Exception as exc:
                failed += 1
                print(f"[{i}/{len(todo)}] FAILED {doc['url'][:80]}: {exc}")
    finally:
        fetcher.close()
    return {"parsed": parsed, "sections": sections, "needs_ocr": ocr, "parse_failed": failed}


def run(max_pages: int = 120, max_documents: int = 60) -> dict:
    """Discover, download, then parse into sections. Returns summary counts."""
    original, config.MAX_PAGES, discover.MAX_PAGES = config.MAX_PAGES, max_pages, max_pages
    try:
        pages, documents = discover.discover()
    finally:
        config.MAX_PAGES = discover.MAX_PAGES = original
    print(f"discovered {len(pages)} pages, {len(documents)} documents")

    # Documents are the point, so PDFs go first and HTML pages only fill the remainder.
    pdfs = {u: t for u, t in documents.items() if u.lower().split("?")[0].endswith(".pdf")}
    rest = {u: t for u, t in documents.items() if u not in pdfs}
    chosen = dict(list({**pdfs, **rest}.items())[:max_documents])
    print(f"downloading {len(chosen)} ({len(pdfs)} pdf candidates)")
    download.run(chosen)

    return {"pages": len(pages), "documents_found": len(documents),
            "downloaded": len(chosen), **_parse_all()}


if __name__ == "__main__":
    print(run())
