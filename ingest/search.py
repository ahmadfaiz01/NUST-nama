"""Search the NUST document corpus from the command line.

    python -m ingest.search "how many classes can I miss"

This is the payoff for the whole ingestion pipeline, and the thing the chatbot in
Plan B will wrap. If the answers here are wrong, no amount of prompt engineering
downstream will save them.
"""
import sys
import textwrap

from ingest.config import supabase
from ingest.embed import embed_texts


def search(question: str, k: int = 8) -> list[dict]:
    """Hybrid search: keyword and meaning, merged by reciprocal rank fusion.

    The question is embedded with the same model that embedded the sections. That
    is not a detail — different models put the same meaning in different places,
    and the failure is silent.
    """
    vector = embed_texts([question])[0]
    return (
        supabase()
        .rpc(
            "search_sections",
            {
                "query_text": question,
                "query_embedding": vector,
                "match_count": k,
            },
        )
        .execute()
        .data
    )


def main() -> None:
    if len(sys.argv) < 2:
        print('usage: python -m ingest.search "your question"')
        raise SystemExit(1)

    question = " ".join(sys.argv[1:])
    results = search(question)

    if not results:
        print("No matches. Either the corpus is empty or nothing was embedded yet.")
        return

    for rank, row in enumerate(results, 1):
        print(f"\n{rank}. {row['heading_path']}")
        print(f"   score {row['score']:.4f}   {row['title'] or row['url']}")
        if row.get("page_start"):
            print(f"   pages {row['page_start']}-{row['page_end']}")
        snippet = row["content"][:320].replace("\n", " ")
        print(textwrap.fill(snippet, width=88, initial_indent="   ", subsequent_indent="   "))


if __name__ == "__main__":
    main()
