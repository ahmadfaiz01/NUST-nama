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

USER_AGENT = "NustNamaBot/1.0 (+https://nustnama.vercel.app; student project)"
REQUEST_DELAY = 1.0          # seconds between requests to the same host
REQUEST_TIMEOUT = 30.0

MAX_PAGES = 20_000           # hard stops so a bug cannot run forever
MAX_FILES = 5_000
MAX_TOTAL_BYTES = 5 * 1024**3

STORAGE_BUCKET = "documents"


@lru_cache(maxsize=1)
def supabase() -> Client:
    """Service-role client. Bypasses RLS — never expose this to a browser."""
    return create_client(SUPABASE_URL, SERVICE_KEY)
