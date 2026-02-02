export interface Venue {
    id: string;
    name: string;
    lat: number;
    lng: number;
    keywords: string[];
}

export const NUST_VENUES: Venue[] = [
    // ===== SCHOOLS & ACADEMIC BUILDINGS =====
    {
        id: "seecs",
        name: "SEECS (School of Electrical Engineering & Computer Science)",
        lat: 33.6433,
        lng: 72.9916,
        keywords: ["seecs", "electrical", "computer", "science", "engineering", "cs", "ee"],
    },
    {
        id: "seecs-seminar-hall",
        name: "SEECS Seminar Hall",
        lat: 33.6433,
        lng: 72.9916,
        keywords: ["seecs", "seminar", "hall", "auditorium"],
    },
    {
        id: "seecs-backyard",
        name: "SEECS Backyard",
        lat: 33.6433,
        lng: 72.9916,
        keywords: ["seecs", "backyard", "garden", "lawn"],
    },
    {
        id: "seecs-lab-3",
        name: "SEECS Lab 3 (Farooq Ahmed)",
        lat: 33.6433,
        lng: 72.9916,
        keywords: ["seecs", "lab", "computer", "lab 3", "farooq"],
    },
    {
        id: "smme",
        name: "SMME (School of Mechanical & Manufacturing Engineering)",
        lat: 33.6508,
        lng: 72.9972,
        keywords: ["smme", "mechanical", "manufacturing", "engineering"],
    },
    {
        id: "smme-auditorium",
        name: "SMME Auditorium",
        lat: 33.6508,
        lng: 72.9972,
        keywords: ["smme", "mechanical", "auditorium"],
    },
    {
        id: "scme",
        name: "SCME (School of Chemical & Materials Engineering)",
        lat: 33.6496,
        lng: 73.0003,
        keywords: ["scme", "chemical", "materials", "engineering"],
    },
    {
        id: "scme-ground",
        name: "SCME Ground",
        lat: 33.6496,
        lng: 73.0003,
        keywords: ["scme", "ground", "lawn", "chemical"],
    },
    {
        id: "sada",
        name: "SADA (School of Art, Design & Architecture)",
        lat: 33.6465,
        lng: 72.9948,
        keywords: ["sada", "art", "design", "architecture"],
    },
    {
        id: "sada-courtyard",
        name: "SADA Courtyard",
        lat: 33.6465,
        lng: 72.9948,
        keywords: ["sada", "art", "architecture", "courtyard"],
    },
    {
        id: "nbs",
        name: "NBS (NUST Business School)",
        lat: 33.6454,
        lng: 72.9922,
        keywords: ["nbs", "business", "school", "management"],
    },
    {
        id: "nbs-ground",
        name: "NBS Ground",
        lat: 33.6450,
        lng: 72.9928,
        keywords: ["nbs", "business", "ground", "lawn"],
    },
    {
        id: "s3h",
        name: "S3H (School of Social Sciences & Humanities)",
        lat: 33.6468,
        lng: 72.9932,
        keywords: ["s3h", "social", "sciences", "humanities"],
    },
    {
        id: "s3h-lecture-hall",
        name: "S3H Lecture Hall",
        lat: 33.6468,
        lng: 72.9932,
        keywords: ["s3h", "social", "sciences", "hall", "lecture"],
    },
    {
        id: "nice",
        name: "NICE (National Institute of Construction Engineering)",
        lat: 33.6477,
        lng: 73.0028,
        keywords: ["nice", "construction", "civil", "engineering", "ice", "scee"],
    },
    {
        id: "nice-ground",
        name: "NICE Ground",
        lat: 33.6477,
        lng: 73.0028,
        keywords: ["nice", "ground", "lawn", "construction"],
    },
    {
        id: "rcms",
        name: "RCMS (Research Centre for Modelling & Simulation)",
        lat: 33.6390,
        lng: 72.9910,
        keywords: ["rcms", "research", "modelling", "simulation"],
    },
    {
        id: "asab",
        name: "ASAB (Atta-ur-Rahman School of Applied Biosciences)",
        lat: 33.6416,
        lng: 72.9868,
        keywords: ["asab", "biosciences", "biology", "bio"],
    },
    {
        id: "sns",
        name: "SNS (School of Natural Sciences)",
        lat: 33.6444,
        lng: 72.9904,
        keywords: ["sns", "natural", "sciences", "physics", "chemistry", "math"],
    },
    {
        id: "sines",
        name: "SINES (School of Interdisciplinary Engineering & Sciences)",
        lat: 33.6425,
        lng: 72.9905,
        keywords: ["sines", "interdisciplinary", "engineering", "sciences"],
    },
    {
        id: "nshs",
        name: "NSHS (School of Health Sciences)",
        lat: 33.6410,
        lng: 72.9860,
        keywords: ["nshs", "health", "sciences", "medical", "medicine"],
    },
    {
        id: "cips",
        name: "CIPS (Centre for Integrated Planning & Services)",
        lat: 33.6430,
        lng: 72.9900,
        keywords: ["cips", "centre", "planning", "services"],
    },
    {
        id: "upcase",
        name: "UPCASE",
        lat: 33.6455,
        lng: 72.9985,
        keywords: ["upcase", "university", "programme"],
    },
    {
        id: "jsppl",
        name: "JSPPL (Jinnah School of Planning and Policy)",
        lat: 33.6460,
        lng: 72.9990,
        keywords: ["jsppl", "jinnah", "planning", "policy", "school"],
    },
    {
        id: "iese",
        name: "IESE (Interdisciplinary Engineering and Sciences Engineering)",
        lat: 33.6472,
        lng: 73.0036,
        keywords: ["iese", "scee", "interdisciplinary", "engineering", "sciences"],
    },
    {
        id: "igis",
        name: "IGIS (Institute of Geomatics & Environmental Sciences)",
        lat: 33.6480,
        lng: 73.0012,
        keywords: ["igis", "geomatics", "environmental", "sciences"],
    },
    {
        id: "cae",
        name: "CAE (College of Aeronautical Engineering)",
        lat: 33.6350,
        lng: 72.9950,
        keywords: ["cae", "aeronautical", "aerospace", "aviation"],
    },
    {
        id: "ceme",
        name: "CEME (College of Electrical & Mechanical Engineering)",
        lat: 33.6340,
        lng: 72.9920,
        keywords: ["ceme", "electrical", "mechanical", "college"],
    },
    {
        id: "mcs",
        name: "MCS (Military College of Signals)",
        lat: 33.6320,
        lng: 72.9900,
        keywords: ["mcs", "military", "signals", "telecom"],
    },
    
    // ===== CAFES & FOOD =====
    {
        id: "c1-cordoba",
        name: "Concordia 1 (C1)",
        lat: 33.6458,
        lng: 72.9914,
        keywords: ["c1", "concordia", "cafe", "cafeteria", "food", "canteen"],
    },
    {
        id: "c2-cafe",
        name: "Concordia 2 (C2)",
        lat: 33.6500,
        lng: 72.9980,
        keywords: ["c2", "concordia", "cafe", "cafeteria", "food", "sada cafe"],
    },
    {
        id: "c3-south-edge",
        name: "C3 / South Edge Cafe",
        lat: 33.6405,
        lng: 72.9875,
        keywords: ["c3", "concordia", "south", "edge", "cafe", "cafeteria"],
    },
    {
        id: "central-library-cafe",
        name: "Central Library Cafe",
        lat: 33.6465,
        lng: 72.9910,
        keywords: ["central", "library", "cafe", "cafeteria", "food"],
    },
    {
        id: "khaaba",
        name: "Khaaba Cafe",
        lat: 33.6430,
        lng: 72.9920,
        keywords: ["khaaba", "cafe", "food", "snacks"],
    },
    {
        id: "chai-khana",
        name: "Chai Khana",
        lat: 33.6440,
        lng: 72.9910,
        keywords: ["chai", "khana", "tea", "cafe"],
    },
    
    // ===== SPORTS & RECREATION =====
    {
        id: "hbl-ground",
        name: "HBL Ground / Cricket Ground",
        lat: 33.6475,
        lng: 72.9905,
        keywords: ["hbl", "ground", "cricket", "sports", "stadium", "main ground"],
    },
    {
        id: "cricket-ground",
        name: "Cricket Ground",
        lat: 33.6490,
        lng: 72.9910,
        keywords: ["cricket", "ground", "sports", "field"],
    },
    {
        id: "football-ground",
        name: "NUST Football Ground",
        lat: 33.6470,
        lng: 72.9905,
        keywords: ["football", "soccer", "ground", "sports"],
    },
    {
        id: "basketball-court",
        name: "NUST Basketball Court",
        lat: 33.6455,
        lng: 72.9930,
        keywords: ["basketball", "court", "sports"],
    },
    {
        id: "tennis-courts",
        name: "NUST Tennis Courts",
        lat: 33.6460,
        lng: 72.9940,
        keywords: ["tennis", "court", "sports"],
    },
    {
        id: "swimming-pool",
        name: "NUST Swimming Pool",
        lat: 33.6445,
        lng: 72.9950,
        keywords: ["swimming", "pool", "sports", "aquatic"],
    },
    {
        id: "old-gym",
        name: "Old Gym",
        lat: 33.6510,
        lng: 72.9930,
        keywords: ["gym", "old", "gymnasium", "fitness", "sports"],
    },
    {
        id: "new-gym",
        name: "New Gym",
        lat: 33.6518,
        lng: 72.9942,
        keywords: ["gym", "new", "gymnasium", "fitness", "sports"],
    },
    {
        id: "sports-complex",
        name: "NUST Sports Complex",
        lat: 33.6465,
        lng: 72.9935,
        keywords: ["sports", "complex", "athletic"],
    },
    
    // ===== MAIN FACILITIES =====
    {
        id: "main-library",
        name: "NUST Main Library",
        lat: 33.6437,
        lng: 72.9927,
        keywords: ["library", "main", "central", "books", "study"],
    },
    {
        id: "nls",
        name: "NLS (National Library of Science)",
        lat: 33.6420,
        lng: 72.9905,
        keywords: ["nls", "national", "library", "science", "books"],
    },
    {
        id: "nust-lake",
        name: "NUST Lake",
        lat: 33.6380,
        lng: 72.9900,
        keywords: ["lake", "water", "picnic", "pond"],
    },
    {
        id: "student-center",
        name: "Student Center (NSTP)",
        lat: 33.6420,
        lng: 72.9900,
        keywords: ["nstp", "student", "center", "bowling", "entertainment"],
    },
    {
        id: "jinnah-auditorium",
        name: "Jinnah Auditorium",
        lat: 33.6460,
        lng: 72.9925,
        keywords: ["jinnah", "auditorium", "hall", "events"],
    },
    {
        id: "main-auditorium",
        name: "NUST Main Auditorium",
        lat: 33.6430,
        lng: 72.9915,
        keywords: ["auditorium", "main", "hall", "convocation"],
    },
    {
        id: "rector-office",
        name: "Rector Office / Admin Block",
        lat: 33.6440,
        lng: 72.9925,
        keywords: ["rector", "admin", "administration", "office", "principal"],
    },
    {
        id: "main-office",
        name: "Main Office (Admin)",
        lat: 33.6475,
        lng: 72.9915,
        keywords: ["main", "office", "admin", "administration"],
    },
    {
        id: "faculty-housing",
        name: "Faculty Housing",
        lat: 33.6400,
        lng: 73.0050,
        keywords: ["faculty", "housing", "residential"],
    },
    {
        id: "main-gate",
        name: "NUST Main Gate",
        lat: 33.6500,
        lng: 72.9960,
        keywords: ["gate", "main", "entrance", "entry"],
    },
    {
        id: "gate-2",
        name: "NUST Gate 2",
        lat: 33.6350,
        lng: 72.9800,
        keywords: ["gate", "gate 2", "entrance", "entry"],
    },
    
    // ===== HOSTELS =====
    {
        id: "iqbal-hostel",
        name: "Iqbal Hostel (Boys)",
        lat: 33.6410,
        lng: 72.9860,
        keywords: ["iqbal", "hostel", "boys", "dorm", "residential"],
    },
    {
        id: "liaquat-hostel",
        name: "Liaquat Hostel (Boys)",
        lat: 33.6405,
        lng: 72.9850,
        keywords: ["liaquat", "hostel", "boys", "dorm", "residential"],
    },
    {
        id: "jinnah-hostel",
        name: "Jinnah Hostel (Boys)",
        lat: 33.6400,
        lng: 72.9845,
        keywords: ["jinnah", "hostel", "boys", "dorm", "residential"],
    },
    {
        id: "fatima-hostel",
        name: "Fatima Hostel (Girls)",
        lat: 33.6385,
        lng: 72.9870,
        keywords: ["fatima", "hostel", "girls", "dorm", "female", "residential"],
    },
    {
        id: "khadija-hostel",
        name: "Khadija Hostel (Girls)",
        lat: 33.6380,
        lng: 72.9865,
        keywords: ["khadija", "hostel", "girls", "dorm", "female", "residential"],
    },
    {
        id: "zainab-hostel",
        name: "Zainab Hostel (Girls)",
        lat: 33.6375,
        lng: 72.9860,
        keywords: ["zainab", "hostel", "girls", "dorm", "female", "residential"],
    },
    {
        id: "ayesha-hostel",
        name: "Ayesha Hostel (Girls)",
        lat: 33.6370,
        lng: 72.9855,
        keywords: ["ayesha", "hostel", "girls", "dorm", "female", "residential"],
    },
    
    // ===== OTHER FACILITIES =====
    {
        id: "mosque",
        name: "NUST Mosque / Masjid",
        lat: 33.6435,
        lng: 72.9920,
        keywords: ["mosque", "masjid", "prayer", "namaz"],
    },
    {
        id: "medical-center",
        name: "NUST Medical Center",
        lat: 33.6425,
        lng: 72.9935,
        keywords: ["medical", "center", "hospital", "clinic", "health","nmc"],
    },
    {
        id: "bank",
        name: "HBL Bank Branch",
        lat: 33.6432,
        lng: 72.9928,
        keywords: ["bank", "hbl", "atm", "money"],
    },
    {
        id: "post-office",
        name: "NUST Post Office",
        lat: 33.6428,
        lng: 72.9930,
        keywords: ["post", "office", "mail", "courier"],
    },
    {
        id: "bookshop",
        name: "NUST Bookshop",
        lat: 33.6433,
        lng: 72.9925,
        keywords: ["bookshop", "books", "stationery", "shop"],
    },
    {
        id: "tayyip-erdogan",
        name: "Tayyip Erdogan Hall",
        lat: 33.6445,
        lng: 72.9915,
        keywords: ["tayyip", "erdogan", "hall", "auditorium"],
    },
    {
        id: "convention-center",
        name: "NUST Convention Center",
        lat: 33.6442,
        lng: 72.9918,
        keywords: ["convention", "center", "conference", "events"],
    },
    {
        id: "tech-incubator",
        name: "NUST Technology Incubation Center",
        lat: 33.6415,
        lng: 72.9895,
        keywords: ["incubator", "tech", "startup", "tic", "technology"],
    },
    {
        id: "nust-exam-hall",
        name: "NUST Exam Hall (Gate 4)",
        lat: 33.6416301,
        lng: 72.9836426,
        keywords: ["exam", "hall", "gate 4", "testing","net"],
    },
    {
        id: "nust-gate-2-check",
        name: "NUST Gate 2 Check Post",
        lat: 33.6461563,
        lng: 72.980547,
        keywords: ["gate", "gate 2", "check", "post", "security"],
    },
    {
        id: "pmo",
        name: "NUST Project Management Office",
        lat: 33.6355714,
        lng: 72.9911047,
        keywords: ["pmo", "project", "management", "office"],
    },
    {
        id: "health-sciences",
        name: "NUST School of Health Sciences",
        lat: 33.6482571,
        lng: 72.9949461,
        keywords: ["health", "sciences", "medical", "medicine"],
    },
    {
        id: "alumni-corner",
        name: "NUST Alumni Corner",
        lat: 33.6420004,
        lng: 72.9924817,
        keywords: ["alumni", "corner", "graduate"],
    },
    {
        id: "main-office",
        name: "NUST Main Office",
        lat: 33.6425881,
        lng: 72.9931443,
        keywords: ["main", "office", "admin", "administration"],
    },
];

export function findVenueCoordinates(query: string): { name: string; lat: number; lng: number } | null {
    const normalizedQuery = query.toLowerCase().trim();

    // Empty query check
    if (!normalizedQuery) return null;

    // Exact match on name (case insensitive)
    const exact = NUST_VENUES.find(v => v.name.toLowerCase() === normalizedQuery);
    if (exact) return { name: exact.name, lat: exact.lat, lng: exact.lng };

    // Direct ID match (for shortcuts like c1, c2, c3)
    const idMatch = NUST_VENUES.find(v => v.id.toLowerCase() === normalizedQuery);
    if (idMatch) return { name: idMatch.name, lat: idMatch.lat, lng: idMatch.lng };

    // Keyword match (scoring)
    let bestMatch: Venue | null = null;
    let maxScore = 0;

    for (const venue of NUST_VENUES) {
        let score = 0;
        const allKeywords = [...venue.keywords, venue.id, ...venue.name.toLowerCase().split(/\s+/)];
        const queryWords = normalizedQuery.split(/\s+/);

        for (const qWord of queryWords) {
            // Check if any keyword contains the query word or vice versa
            for (const keyword of allKeywords) {
                if (keyword === qWord) {
                    score += 3; // Exact keyword match
                } else if (keyword.includes(qWord) || qWord.includes(keyword)) {
                    score += 1; // Partial match
                }
            }
        }

        if (score > maxScore) {
            maxScore = score;
            bestMatch = venue;
        }
    }

    if (bestMatch && maxScore > 0) {
        return { name: bestMatch.name, lat: bestMatch.lat, lng: bestMatch.lng };
    }

    return null;
}

export function getVenueSuggestions(query: string): Venue[] {
    const normalizedQuery = query.toLowerCase().trim();

    // Empty query check
    if (!normalizedQuery) return [];

    // Score all venues and sort by match quality
    const scored = NUST_VENUES.map(venue => {
        let score = 0;
        const allKeywords = [...venue.keywords, venue.id, ...venue.name.toLowerCase().split(/\s+/)];
        const queryWords = normalizedQuery.split(/\s+/);

        for (const qWord of queryWords) {
            for (const keyword of allKeywords) {
                if (keyword === qWord) {
                    score += 10; // Exact keyword match
                } else if (keyword.startsWith(qWord)) {
                    score += 5; // Starts with match
                } else if (keyword.includes(qWord)) {
                    score += 3; // Contains match
                } else if (qWord.includes(keyword)) {
                    score += 1; // Partial reverse match
                }
            }
        }

        return { venue, score };
    }).filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    // Return top 8 suggestions
    return scored.slice(0, 8).map(item => item.venue);
}
