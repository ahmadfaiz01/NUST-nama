from ingest.sections import toc_to_ranges, build_embed_text


def test_nested_headings_become_paths():
    toc = [
        (1, "7. Academic Standing", 40),
        (2, "7.1 Probation", 40),
        (2, "7.3 Repeating a Course", 44),
        (1, "8. Leave", 50),
    ]
    got = toc_to_ranges(toc, page_count=60)

    assert got[0].heading_path == "7. Academic Standing"
    assert got[1].heading_path == "7. Academic Standing > 7.1 Probation"
    assert got[2].heading_path == "7. Academic Standing > 7.3 Repeating a Course"
    assert got[3].heading_path == "8. Leave"


def test_page_ranges_do_not_overlap_and_cover_the_document():
    toc = [(1, "A", 1), (1, "B", 10), (1, "C", 20)]
    got = toc_to_ranges(toc, page_count=30)

    assert (got[0].page_start, got[0].page_end) == (1, 9)
    assert (got[1].page_start, got[1].page_end) == (10, 19)
    assert (got[2].page_start, got[2].page_end) == (20, 30)


def test_deeper_level_then_shallower_pops_the_stack():
    toc = [(1, "A", 1), (2, "A.1", 2), (3, "A.1.a", 3), (2, "A.2", 4)]
    got = toc_to_ranges(toc, page_count=10)

    assert got[3].heading_path == "A > A.2"


def test_empty_toc_yields_one_whole_document_range():
    got = toc_to_ranges([], page_count=12)

    assert len(got) == 1
    assert (got[0].page_start, got[0].page_end) == (1, 12)


def test_embed_text_is_path_plus_opening_words():
    out = build_embed_text("A > B", "one two three four five", words=3)

    assert out.startswith("A > B")
    assert "three" in out
    assert "four" not in out
