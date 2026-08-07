from datetime import date

from ingest.metadata import classify, clean_title, guess_published

UPLOADS = "https://nust.edu.pk/wp-content/uploads/2020/03/"


def test_microsoft_word_prefix_stripped():
    assert clean_title("Microsoft Word - Semester Freeze Policy", None,
                       UPLOADS + "x.pdf") == "Semester Freeze Policy"


def test_microsoft_word_prefix_leaving_a_filename_falls_through():
    t = clean_title("Microsoft Word - hostel_rules_final.doc", None,
                    UPLOADS + "Hostel-Rules.pdf")
    assert t == "Hostel Rules Final"


def test_junk_metadata_titles_rejected():
    for junk in ("", None, "untitled", "Document1", "abc", "report.pdf"):
        assert clean_title(junk, None, UPLOADS + "Fee-Structure-2024.pdf") == \
            "Fee Structure 2024"


def test_numeric_id_prefix_stripped_from_filename():
    assert clean_title(None, None, UPLOADS + "510378613396Hostel_Allotment_SOPs.pdf") == \
        "Hostel Allotment SOPs"


def test_lowercase_filename_is_title_cased():
    assert clean_title(None, None, UPLOADS + "semester-freeze-form.pdf") == \
        "Semester Freeze Form"


def test_largest_font_used_when_metadata_useless():
    assert clean_title("untitled", "Undergraduate Student Handbook", UPLOADS + "x.pdf") == \
        "Undergraduate Student Handbook"


def test_year_from_filename_beats_year_from_path():
    got = guess_published({}, UPLOADS + "BS-HND-Student-Handbook-updated-17.4.2026.pdf", None)
    assert got == date(2026, 1, 1)


def test_no_year_anywhere_but_the_path_gives_none():
    assert guess_published({}, UPLOADS + "Hostel-Rules.pdf", None) is None


def test_pdf_metadata_date_wins():
    assert guess_published({"creationDate": "D:20230415120000+05'00'"},
                           UPLOADS + "Handbook-2026.pdf", None) == date(2023, 4, 15)


def test_last_modified_header_is_the_last_resort():
    assert guess_published({}, UPLOADS + "Hostel-Rules.pdf",
                           "Wed, 21 Oct 2020 07:28:00 GMT") == date(2020, 10, 21)


def test_handbook_is_policy_not_form():
    assert classify(UPLOADS + "Revised-Undergraduate-Handbook.pdf", None, "form") == "policy"
    assert classify(UPLOADS + "Revised-Postgraduate-Handbook.pdf", None, "form") == "policy"


def test_real_forms_still_classify_as_form():
    assert classify(UPLOADS + "Semester-Freeze-Application.pdf", None, "page") == "form"


def test_newsletters_detected():
    assert classify(UPLOADS + "NUST-NEWS-Sep-Oct-2015.pdf", None, "page") == "newsletter"
    assert classify(UPLOADS + "NN-Jan-Feb-16-web.pdf", None, None) == "newsletter"


def test_title_evidence_counts_when_the_url_is_opaque():
    assert classify(UPLOADS + "1234567.pdf", "Undergraduate Handbook", "form") == "policy"


def test_unknown_keeps_the_inherited_type():
    assert classify(UPLOADS + "misc-notice.pdf", "Notice", "notice") == "notice"
    assert classify(UPLOADS + "misc-notice.pdf", "Notice", None) is None
