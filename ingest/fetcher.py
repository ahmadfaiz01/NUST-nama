"""Polite HTTP client: per-host rate limiting, robots.txt, conditional requests."""
import time
from dataclasses import dataclass
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

import httpx

from ingest.config import CONTACT, REQUEST_DELAY, REQUEST_TIMEOUT, USER_AGENT


@dataclass
class FetchResult:
    status: int
    body: bytes
    headers: dict
    final_url: str

    @property
    def ok(self) -> bool:
        return 200 <= self.status < 300

    @property
    def not_modified(self) -> bool:
        return self.status == 304


class Fetcher:
    """One instance per crawl. Holds the connection pool and the per-host state."""

    def __init__(self) -> None:
        self._client = httpx.Client(
            follow_redirects=True,
            timeout=REQUEST_TIMEOUT,
            headers={"User-Agent": USER_AGENT, "From": CONTACT},
        )
        self._last: dict[str, float] = {}
        self._robots: dict[str, RobotFileParser | None] = {}

    def _wait(self, host: str) -> None:
        """Sleep until REQUEST_DELAY has passed since our last hit on this host."""
        last = self._last.get(host)
        if last is not None:
            elapsed = time.monotonic() - last
            if elapsed < REQUEST_DELAY:
                time.sleep(REQUEST_DELAY - elapsed)
        self._last[host] = time.monotonic()

    def _load_robots(self, host: str) -> RobotFileParser | None:
        """None means 'no robots.txt', which by convention means everything is allowed."""
        try:
            self._wait(host)
            response = self._client.get(f"https://{host}/robots.txt")
            if response.status_code != 200:
                return None
            parser = RobotFileParser()
            parser.parse(response.text.splitlines())
            return parser
        except httpx.HTTPError:
            return None

    def allowed(self, url: str) -> bool:
        host = urlparse(url).hostname
        if not host:
            return False
        if host not in self._robots:
            self._robots[host] = self._load_robots(host)
        parser = self._robots[host]
        return True if parser is None else parser.can_fetch(USER_AGENT, url)

    def get(self, url: str, etag: str | None = None,
            last_modified: str | None = None) -> FetchResult:
        """Fetch a URL. Never raises on 304, 404 or 500 — the caller decides."""
        self._wait(urlparse(url).hostname or "")

        headers = {}
        if etag:
            headers["If-None-Match"] = etag
        if last_modified:
            headers["If-Modified-Since"] = last_modified

        response = self._client.get(url, headers=headers)
        return FetchResult(
            status=response.status_code,
            body=response.content,
            headers=dict(response.headers),
            final_url=str(response.url),
        )

    def close(self) -> None:
        self._client.close()
