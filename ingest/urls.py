from urllib.parse import urlparse,urldefrag
from ingest.config import ALLOWED_APEX, ALLOWED_SUFFIX

DOCUMENT_EXTENSIONS = {".pdf", ".doc", ".docx"}

def is_document (url: str) -> bool:

    path = urlparse(url).path.lower()
    return any(path.endswith(ext) for ext in DOCUMENT_EXTENSIONS)

def in_scope(url: str) -> bool:
    host = urlparse(url).hostname
    if not host:
        return False
    return host == ALLOWED_APEX or host.endswith(ALLOWED_SUFFIX)

def normalise(url: str) -> str:
    
    url, _ = urldefrag(url)
    parts = urlparse(url)
    host = parts.hostname or ""
    path = parts.path.rstrip("/") or ("/")
    query = f"?{parts.query}" if parts.query else ""

    return f"https://{host}{path}{query}"