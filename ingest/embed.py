"""Turn section text into vectors using the gte-small model inside Supabase.

The same model must embed both sections and questions. Mixing models produces
confident nonsense with no error — search simply returns the wrong thing. That is
why both sides go through this one edge function.
"""
import time

import httpx

from ingest.config import SERVICE_KEY, SUPABASE_URL, supabase

EMBED_URL = f"{SUPABASE_URL}/functions/v1/embed"

# Measured 2026-08-06 against REAL section text (~1400 chars each), which is what
# matters — the limit is total volume, not text count. 4 succeeds, 8 fails. Short
# synthetic strings survive batches of 10, so do not re-measure with toy data.
# The edge function's own guard still says 100, which it cannot deliver.
BATCH = 4


def _post(texts: list[str]) -> list[list[float]] | int:
    """One call. Returns the vectors, or the HTTP status when it failed."""
    try:
        response = httpx.post(
            EMBED_URL,
            json={"texts": texts},
            headers={"Authorization": f"Bearer {SERVICE_KEY}"},
            timeout=180.0,
        )
        if response.status_code == 200:
            return response.json()["embeddings"]
        return response.status_code
    except httpx.HTTPError:
        return 0


def embed_texts(texts: list[str], _depth: int = 0) -> list[list[float]]:
    """Embed a batch, halving it on failure until the pieces fit.

    The edge function returns 546 (worker resource limit) unpredictably: gte-small
    is large relative to the memory an edge worker gets, so identical batches
    succeed and then fail as workers recycle. A fixed batch size cannot solve that,
    so the batch adapts instead — split on failure, and at a single text fall back
    to patient retries while the worker recovers.
    """
    result = _post(texts)
    if isinstance(result, list):
        return result

    if len(texts) > 1:
        middle = len(texts) // 2
        return embed_texts(texts[:middle], _depth + 1) + embed_texts(texts[middle:], _depth + 1)

    # Down to one text: the batch is not the problem, the worker is. Wait it out.
    for attempt in range(6):
        time.sleep(min(2**attempt, 30))
        single = _post(texts)
        if isinstance(single, list):
            return single
    raise RuntimeError(f"embedding failed for a single text of {len(texts[0])} chars")


def _write(rows: list[dict], vectors: list[list[float]]) -> None:
    """Store one vector per row.

    ponytail: one UPDATE per section, roughly 100ms each. Fine for a few thousand
    sections. Batch through an RPC taking an array if a full crawl makes the
    backfill time hurt.
    """
    for row, vector in zip(rows, vectors):
        supabase().table("sections").update({"embedding": vector}).eq(
            "id", row["id"]
        ).execute()


def backfill() -> None:
    """Embed every section with no vector yet.

    The `embedding is null` filter IS the resume mechanism — interrupt this and
    re-run it and it continues where it stopped. No checkpoint file to corrupt;
    the database is the state.
    """
    done = 0
    failures = 0
    while True:
        try:
            rows = (
                supabase()
                .table("sections")
                .select("id, embed_text")
                .is_("embedding", "null")
                .limit(BATCH)
                .execute()
                .data
            )
            if not rows:
                break

            # Order matters: the edge function returns embeddings in the order it
            # received texts, which is why zip() below is safe.
            vectors = embed_texts([row["embed_text"] for row in rows])
            _write(rows, vectors)
        except Exception as error:
            # Long runs drop connections — "Server disconnected" killed a run at
            # 192 of 2049. Nothing here needs to be transactional: the
            # `embedding is null` query re-selects whatever did not get written,
            # so a failed batch simply comes round again.
            failures += 1
            if failures > 15:
                raise
            print(f"  batch failed ({type(error).__name__}), retrying: {error}")
            time.sleep(min(2**failures, 30))
            continue

        failures = 0
        done += len(rows)
        print(f"embedded {done}")

    print(f"done: {done} sections")


if __name__ == "__main__":
    backfill()
