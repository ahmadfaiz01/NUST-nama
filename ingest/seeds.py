"""High-value starting URLs, verified live on 2026-08-06.

Not a list of schools. All 48 *.nust.edu.pk subdomains, every school among them,
are linked from the nust.edu.pk homepage and are found by discovery — hardcoding
them would rot the moment NUST adds one.

What IS here: pages that hold the documents the chatbot exists to answer from, and
a handful of PDFs reachable only from deep inside a school site. Discovery would
probably reach most of these eventually; seeding them guarantees the important
ones land in the first run.
"""

# Pages known to link directly to policy PDFs. Verified PDF counts as of 2026-08-06.
DOCUMENT_HUBS = [
    "https://nust.edu.pk/downloads/",
    "https://nust.edu.pk/downloads/forms/",                    # 14 PDFs
    "https://nust.edu.pk/downloads/student-handbooks/",        # 4 PDFs, incl. the
                                                               # undergraduate handbook
    "https://nust.edu.pk/downloads/academic-schedule/",        # 2 PDFs
    "https://nust.edu.pk/downloads/for-masters-students/",
    "https://nust.edu.pk/downloads/salient-features-of-fee-policy/",
    "https://nust.edu.pk/admissions/fee-structure/",
    "https://nust.edu.pk/university-main-offices/",
    "https://nust.edu.pk/about-us/resources-offices/student-affairs-directorate/",
    "https://campuslife.nust.edu.pk/facility-and-amenity/housing-and-dining/",
    "https://campuslife.nust.edu.pk/facility-and-amenity/student-helpline/",
]

# Documents whose URLs were supplied directly. Both verified 200, application/pdf.
KNOWN_DOCUMENTS = [
    "https://campuslife.nust.edu.pk/wp-content/uploads/2024/08/NUST-HOSTEL-RULES.pdf",
    "https://campuslife.nust.edu.pk/wp-content/uploads/2025/07/510378613396Hostel_Allotment_SOPs.pdf",
]

SEED_URLS = DOCUMENT_HUBS + KNOWN_DOCUMENTS
