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


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Send up to 100 texts to the edge function, get one 384-number vector each.

    Retries with exponential backoff: the first call to an idle function loads the
    model and can time out, and losing a batch of 100 to a cold start is silly.
    """
    for attempt in range(4):
        try:
            response = httpx.post(
                EMBED_URL,
                json={"texts": texts},
                headers={"Authorization": f"Bearer {SERVICE_KEY}"},
                timeout=120.0,
            )
            if response.status_code == 200:
                return response.json()["embeddings"]
            print(f"  embed failed {response.status_code}, retrying")
        except httpx.HTTPError as error:
            print(f"  embed error {error}, retrying")
        time.sleep(2**attempt)
    raise RuntimeError("embedding failed after 4 attempts")


def backfill() -> None:
    """Embed every section with no vector yet.

    The `embedding is null` filter IS the resume mechanism — interrupt this and
    re-run it and it continues where it stopped. No checkpoint file to corrupt;
    the database is the state.
    """
    done = 0
    while True:
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

        # ponytail: one UPDATE per section, roughly 100ms each. Fine for a few
        # thousand sections. Batch through an RPC taking an array if a full crawl
        # makes the backfill time hurt.
        for row, vector in zip(rows, vectors):
            supabase().table("sections").update({"embedding": vector}).eq(
                "id", row["id"]
            ).execute()

        done += len(rows)
        print(f"embedded {done}")

    print(f"done: {done} sections")


if __name__ == "__main__":
    backfill()
