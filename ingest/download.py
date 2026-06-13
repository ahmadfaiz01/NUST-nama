"""Fetch each URL once, store the bytes in Storage, record a `documents` row.

sha256 does both jobs: dedupe (the same handbook is mirrored on several school
sites) and change detection (a new hash for a known URL means it was revised).
"""
import hashlib
from datetime import datetime, timezone
from urllib.parse import urlparse

from ingest import config
from ingest.fetcher import Fetcher

EXTENSIONS = {"pdf": ".pdf", "web": ".html"}


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _source_type(content_type: str) -> str | None:
    ct = content_type.lower()
    if "application/pdf" in ct:
        return "pdf"
    if "text/html" in ct:
        return "web"
    return None


def _row_by(column: str, value: str) -> dict | None:
    res = (
        config.supabase().table("documents").select("*")
        .eq(column, value).limit(1).execute()
    )
    return res.data[0] if res.data else None


def _touch(row_id: str, **fields) -> None:
    config.supabase().table("documents").update(
        {"last_seen": _now(), **fields}
    ).eq("id", row_id).execute()


def store_document(fetcher: Fetcher, url: str, doc_type: str | None = None,
                   discovered_from: str | None = None) -> dict | None:
    """Fetch, dedupe by sha256, upload, upsert a documents row. Returns the row or None."""
    existing = _row_by("url", url)

    result = fetcher.get(
        url,
        etag=(existing or {}).get("http_etag"),
        last_modified=(existing or {}).get("http_last_modified"),
    )

    if result.not_modified and existing:
        _touch(existing["id"])
        return existing

    if not result.ok:
        print(f"  skip {result.status}: {url}")
        return None

    source_type = _source_type(result.headers.get("content-type", ""))
    if source_type is None:
        print(f"  skip content-type {result.headers.get('content-type')!r}: {url}")
        return None

    sha256 = hashlib.sha256(result.body).hexdigest()

    mirror = _row_by("sha256", sha256)
    if mirror and mirror["url"] != url:
        _touch(mirror["id"])
        print(f"  mirror of {mirror['url']}: {url}")
        return mirror

    host = urlparse(url).hostname or ""
    name = urlparse(url).path.rsplit("/", 1)[-1]
    ext = ("." + name.rsplit(".", 1)[-1].lower()) if "." in name else EXTENSIONS[source_type]
    storage_path = f"{host}/{sha256[:2]}/{sha256}{ext}"

    config.supabase().storage.from_(config.STORAGE_BUCKET).upload(
        storage_path,
        result.body,
        {"content-type": result.headers.get("content-type", ""), "upsert": "true"},
    )

    row = {
        "url": url,
        "final_url": result.final_url,
        "storage_path": storage_path,
        "sha256": sha256,
        "source_type": source_type,
        "host": host,
        "http_etag": result.headers.get("etag"),
        "http_last_modified": result.headers.get("last-modified"),
        "last_seen": _now(),
    }
    if doc_type:
        row["doc_type"] = doc_type
    if discovered_from:
        row["discovered_from"] = discovered_from

    if existing:
        # Same URL, new bytes: revise the row in place rather than growing a
        # second row for what is one document.
        row["last_changed"] = _now()
        res = config.supabase().table("documents").update(row).eq(
            "id", existing["id"]
        ).execute()
    else:
        res = config.supabase().table("documents").upsert(
            row, on_conflict="sha256"
        ).execute()
    return res.data[0] if res.data else None


def run(urls: dict[str, str | None] | list[str], limit: int | None = None) -> None:
    """Store many. Accepts discover()'s {url: doc_type} mapping or a plain list."""
    items = list(urls.items()) if isinstance(urls, dict) else [(u, None) for u in urls]
    if limit:
        items = items[:limit]

    fetcher = Fetcher()
    stored = unchanged = mirrored = failed = 0
    try:
        for i, (url, doc_type) in enumerate(items, 1):
            try:
                before = _row_by("url", url)
                row = store_document(fetcher, url, doc_type)
                if row is None:
                    failed += 1
                elif before and row["id"] == before["id"] and row["sha256"] == before["sha256"]:
                    unchanged += 1
                elif row["url"] != url:
                    mirrored += 1
                else:
                    stored += 1
            except Exception as exc:
                failed += 1
                print(f"  {url} failed: {exc}")
            print(f"[{i}/{len(items)}] stored={stored} unchanged={unchanged} "
                  f"mirrored={mirrored} failed={failed}")
    finally:
        fetcher.close()


if __name__ == "__main__":
    from ingest.discover import discover

    _pages, documents = discover()
    run(documents, limit=10)
