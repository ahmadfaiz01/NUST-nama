"""URL discovery: sitemaps for the page list, link-following for the documents.

Both are mandatory. The sitemaps of nust.edu.pk contain zero PDFs — every <loc>
is an HTML page and the documents hang off links inside them.
"""
import xml.etree.ElementTree as ET
from collections import deque
from urllib.parse import urljoin, urlparse

from ingest import urls
from ingest.config import (
    CRAWL_ROOT,
    MAX_PAGES,
    SITEMAP_DOC_TYPES,
    SITEMAP_INDEX,
    SITEMAP_SKIP_PREFIXES,
)
from ingest.fetcher import Fetcher
from ingest.seeds import SEED_URLS

try:
    from selectolax.parser import HTMLParser
except ImportError:  # selectolax ships two module paths depending on the build
    from selectolax.lexbor import LexborHTMLParser as HTMLParser


def _locs(xml: bytes) -> list[str]:
    """Every <loc> text in a sitemap. Tags are namespaced, so match on the suffix."""
    return [
        el.text.strip()
        for el in ET.fromstring(xml).iter()
        if el.tag.endswith("loc") and el.text
    ]


def _doc_type(sitemap_url: str) -> str | None:
    name = urlparse(sitemap_url).path.rsplit("/", 1)[-1]
    for prefix, doc_type in SITEMAP_DOC_TYPES.items():
        if name.startswith(prefix):
            return doc_type
    return None


def _skip(sitemap_url: str) -> bool:
    name = urlparse(sitemap_url).path.rsplit("/", 1)[-1]
    return name.startswith(SITEMAP_SKIP_PREFIXES)


def sitemap_urls(fetcher: Fetcher, host: str) -> dict[str, str | None]:
    """Every URL from the host's sitemaps, mapped to the doc_type its sitemap implies."""
    found: dict[str, str | None] = {}
    index = f"https://{host}{SITEMAP_INDEX}"
    try:
        if not fetcher.allowed(index):
            return found
        response = fetcher.get(index)
        if not response.ok:
            return found
        children = _locs(response.body)
    except Exception as exc:
        print(f"  sitemap index failed for {host}: {exc}")
        return found

    for child in children:
        if not child.endswith(".xml"):
            # A flat sitemap: these are page URLs, not child sitemaps.
            if urls.in_scope(child):
                found.setdefault(urls.normalise(child), None)
            continue
        if _skip(child) or not urls.in_scope(child):
            continue
        try:
            if not fetcher.allowed(child):
                continue
            child_response = fetcher.get(child)
            if not child_response.ok:
                continue
            doc_type = _doc_type(child)
            for url in _locs(child_response.body):
                if urls.in_scope(url):
                    found[urls.normalise(url)] = doc_type
        except Exception as exc:
            print(f"  sitemap {child} failed: {exc}")
    return found


def crawl(
    fetcher: Fetcher,
    roots: list[str],
    seen: set[str],
    doc_types: dict[str, str | None] | None = None,
) -> tuple[dict[str, str | None], dict[str, str | None]]:
    """Breadth-first from roots. Returns (pages, documents) -> doc_type or None."""
    doc_types = doc_types or {}
    pages: dict[str, str | None] = {}
    documents: dict[str, str | None] = {}
    queue: deque[tuple[str, str | None]] = deque()
    hosts_tried: set[str] = set()

    for root in roots:
        url = urls.normalise(root)
        if urls.in_scope(url) and url not in seen:
            seen.add(url)
            if urls.is_document(url):
                documents[url] = doc_types.get(url)
            else:
                queue.append((url, doc_types.get(url)))

    while queue and len(pages) < MAX_PAGES:
        url, doc_type = queue.popleft()
        try:
            host = urlparse(url).hostname or ""
            if host not in hosts_tried:
                hosts_tried.add(host)
                for found, found_type in sitemap_urls(fetcher, host).items():
                    if found in seen:
                        continue
                    seen.add(found)
                    if urls.is_document(found):
                        documents[found] = found_type
                    else:
                        queue.append((found, found_type))

            if not fetcher.allowed(url):
                continue
            response = fetcher.get(url)
            if not response.ok or b"html" not in response.headers.get(
                "content-type", ""
            ).encode():
                continue

            pages[url] = doc_type
            if len(pages) % 100 == 0:
                print(f"  {len(pages)} pages, {len(documents)} documents, "
                      f"{len(queue)} queued")

            for node in HTMLParser(response.body.decode("utf-8", "replace")).css(
                "a[href]"
            ):
                href = node.attributes.get("href")
                if not href:
                    continue
                link = urls.normalise(urljoin(response.final_url, href))
                if link in seen or not urls.in_scope(link):
                    continue
                seen.add(link)
                if urls.is_document(link):
                    documents[link] = doc_type
                else:
                    queue.append((link, doc_type))
        except Exception as exc:
            print(f"  {url} failed: {exc}")

    return pages, documents


def discover(root: str = CRAWL_ROOT) -> tuple[dict[str, str | None], dict[str, str | None]]:
    """Sitemaps first, then BFS. Returns (pages, documents)."""
    fetcher = Fetcher()
    try:
        host = urlparse(root).hostname or ""
        from_sitemap = sitemap_urls(fetcher, host)
        print(f"sitemaps: {len(from_sitemap)} URLs from {host}")
        roots = [root, *SEED_URLS, *from_sitemap]
        return crawl(fetcher, roots, set(), from_sitemap)
    finally:
        fetcher.close()


if __name__ == "__main__":
    pages, documents = discover()
    hosts = {urlparse(u).hostname for u in {**pages, **documents}}
    print(f"\npages: {len(pages)}  documents: {len(documents)}")
    print(f"hosts ({len(hosts)}): {sorted(hosts)}")
    assert all(urls.in_scope(u) for u in {**pages, **documents}), "out-of-scope URL!"
    print("\nsample documents:")
    for url, doc_type in list(documents.items())[:15]:
        print(f"  [{doc_type}] {url}")
