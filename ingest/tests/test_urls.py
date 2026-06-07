from ingest.urls import normalise, in_scope, is_document


def test_normalise_collapses_equivalent_urls():
    variants = [
        "http://nust.edu.pk/about/",
        "https://nust.edu.pk/about",
        "https://NUST.edu.pk/about#team",
        "https://nust.edu.pk/about/#anything",
    ]
    assert len({normalise(u) for u in variants}) == 1


def test_normalise_keeps_query_strings():
    assert normalise("https://nust.edu.pk/news?page=2") != normalise("https://nust.edu.pk/news")


def test_in_scope_accepts_apex_and_subdomains():
    assert in_scope("https://nust.edu.pk/x")
    assert in_scope("https://seecs.nust.edu.pk/x")
    assert in_scope("https://a.b.nust.edu.pk/x")


def test_in_scope_rejects_lookalikes_and_outsiders():
    assert not in_scope("https://evilnust.edu.pk/x")
    assert not in_scope("https://facebook.com/nust")
    assert not in_scope("https://evil.com/?ref=nust.edu.pk")
    assert not in_scope("mailto:someone@nust.edu.pk")


def test_is_document_matches_by_extension():
    assert is_document("https://seecs.nust.edu.pk/handbook.pdf")
    assert is_document("https://seecs.nust.edu.pk/form.PDF?v=2")
    assert is_document("https://seecs.nust.edu.pk/policy.docx")
    assert not is_document("https://seecs.nust.edu.pk/about")
