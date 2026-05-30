"""Environment and shared constants. Import-safe: no network calls at import time."""
import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client

REPO_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(REPO_ROOT / ".env.local")

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

CRAWL_ROOT = "https://nust.edu.pk"
ALLOWED_SUFFIX = ".nust.edu.pk"
ALLOWED_APEX = "nust.edu.pk"

# nust.edu.pk returns 403 to any non-browser User-Agent, so a bot UA gets nothing
# at all. We send a browser UA to be served, and identify ourselves honestly via
# the From header instead. robots.txt and the rate limit are still obeyed.
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)
CONTACT = "support@quickgentech.com"

REQUEST_DELAY = 1.0          # seconds between requests to the same host
REQUEST_TIMEOUT = 30.0

# nust.edu.pk is WordPress with Yoast. /sitemap.xml redirects here.
SITEMAP_INDEX = "/sitemap_index.xml"

# The sitemap taxonomy is free classification: a URL listed in
# fee_structure-sitemap.xml is a fee document, with no LLM needed to work it out.
SITEMAP_DOC_TYPES = {
    "fee_structure": "fee",
    "scholarship": "scholarship",
    "under-graduate": "prospectus",
    "masters-program": "prospectus",
    "phd-program": "prospectus",
    "academic": "policy",
    "download": "form",
    "resources-offices": "campus",
    "faq": "faq",
    "announcements": "notice",
    "about": "about",
    "page": "page",
}

# Skipped outright. Tenders, news, events and photo galleries are the bulk of the
# corpus by volume and answer none of the questions the chatbot exists for.
SITEMAP_SKIP_PREFIXES = (
    "tender", "news", "event", "photo-gallery", "defaulter",
    "category", "announcement-cat", "photo-category",
    "event-category", "news-category", "faq-category",
)

MAX_PAGES = 20_000           # hard stops so a bug cannot run forever
MAX_FILES = 5_000
MAX_TOTAL_BYTES = 5 * 1024**3

STORAGE_BUCKET = "documents"


@lru_cache(maxsize=1)
def supabase() -> Client:
    """Service-role client. Bypasses RLS — never expose this to a browser."""
    return create_client(SUPABASE_URL, SERVICE_KEY)
