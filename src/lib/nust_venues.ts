export interface Venue {
    id: string;
    name: string;
    lat: number;
    lng: number;
    category: string;
    keywords: string[];
}

export const NUST_VENUES: Venue[] = [
    // ACADEMIC
    { id: "seecs", name: "SEECS", lat: 33.64286, lng: 72.99021, category: "Academic", keywords: ["seecs", "electrical", "cs", "computing"] },
    { id: "nbs", name: "NBS", lat: 33.64446, lng: 72.99057, category: "Academic", keywords: ["nbs", "business"] },
    { id: "s3h", name: "S3H", lat: 33.64436, lng: 72.99300, category: "Academic", keywords: ["s3h", "social", "sciences", "humanities"] },
    { id: "sada", name: "SADA", lat: 33.64597, lng: 72.98881, category: "Academic", keywords: ["sada", "art", "architecture", "design"] },
    { id: "sns", name: "SNS", lat: 33.63684, lng: 72.99022, category: "Academic", keywords: ["sns", "natural", "physics", "chemistry", "math"] },
    { id: "smme", name: "SMME", lat: 33.63632, lng: 72.98941, category: "Academic", keywords: ["smme", "mechanical", "manufacturing"] },
    { id: "scme", name: "SCME", lat: 33.64806, lng: 72.99282, category: "Academic", keywords: ["scme", "chemical", "materials"] },
    { id: "asab", name: "ASAB", lat: 33.64636, lng: 72.98786, category: "Academic", keywords: ["asab", "bio", "applied biosciences"] },
    { id: "nshs", name: "NSHS", lat: 33.64858, lng: 72.99486, category: "Academic", keywords: ["nshs", "health", "medical sciences"] },
    { id: "sines", name: "SINES", lat: 33.64611, lng: 72.99787, category: "Academic", keywords: ["sines", "interdisciplinary"] },
    { id: "cips", name: "CIPS", lat: 33.64541, lng: 72.98729, category: "Academic", keywords: ["cips", "peace", "stability"] },
    { id: "uspcas-e", name: "USPCAS-E", lat: 33.64225, lng: 72.98441, category: "Academic", keywords: ["uspcas-e", "energy", "upcase"] },
    { id: "iese", name: "IESE (SCEE)", lat: 33.64800, lng: 72.98930, category: "Academic", keywords: ["iese", "scee", "environmental"] },
    { id: "nice", name: "NICE (SCEE)", lat: 33.64070, lng: 72.98524, category: "Academic", keywords: ["nice", "scee", "civil"] },
    { id: "igis", name: "IGIS (SCEE)", lat: 33.64499, lng: 72.98827, category: "Academic", keywords: ["igis", "scee", "gis"] },
    { id: "rimms", name: "RIMMS", lat: 33.64436, lng: 72.98705, category: "Academic", keywords: ["rimms", "microwave"] },

    // CAFE
    { id: "c1", name: "Concordia 1 (C1)", lat: 33.64664, lng: 72.99016, category: "Cafe", keywords: ["c1", "concordia 1", "cafe", "food"] },
    { id: "c2", name: "Concordia 2 (C2)", lat: 33.64302, lng: 72.98827, category: "Cafe", keywords: ["c2", "concordia 2", "cafe", "food"] },
    { id: "c3", name: "C3 (Monal of NUST)", lat: 33.64186, lng: 72.99386, category: "Cafe", keywords: ["c3", "monal", "cafe", "food"] },
    { id: "coffee-lounge", name: "Coffee Lounge", lat: 33.64758, lng: 72.99084, category: "Cafe", keywords: ["coffee", "lounge", "c1"] },
    { id: "central-library-cafe", name: "Central Library Cafe", lat: 33.64204, lng: 72.99251, category: "Cafe", keywords: ["library", "cafe"] },

    // AUDITORIUM & CONVOCATION
    { id: "jinnah-aud", name: "Jinnah Auditorium", lat: 33.64328, lng: 72.99324, category: "Auditorium", keywords: ["jinnah", "auditorium", "jinnah aud"] },
    { id: "convocation-ground", name: "Convocation Ground", lat: 33.64285, lng: 72.99228, category: "Auditorium", keywords: ["convocation", "convo ground", "lawn"] },

    // SPORTS
    { id: "old-gym", name: "Old Gym", lat: 33.64492, lng: 72.99321, category: "Sports", keywords: ["gym", "old gym", "fitness"] },
    { id: "new-gym", name: "New Gym & Swimming Pool", lat: 33.64192, lng: 72.99478, category: "Sports", keywords: ["gym", "new gym", "pool", "swimming"] },
    { id: "nbs-ground", name: "NBS Ground", lat: 33.64542, lng: 72.99002, category: "Sports", keywords: ["nbs", "ground"] },
    { id: "hbl-ground", name: "HBL Football Ground", lat: 33.64512, lng: 72.98370, category: "Sports", keywords: ["hbl", "football", "ground"] },
    { id: "cricket-ground", name: "Cricket Ground", lat: 33.64355, lng: 72.98277, category: "Sports", keywords: ["cricket", "ground", "hbl cricket"] },
    { id: "tennis", name: "Tennis Court", lat: 33.64403, lng: 72.98424, category: "Sports", keywords: ["tennis", "lawn tennis"] },

    // ADMIN/FACULTY
    { id: "main-office", name: "NUST Main Office", lat: 33.64255, lng: 72.99307, category: "Faculty/Admin", keywords: ["main", "office", "rectorate", "admin"] },
    { id: "admin-block", name: "Admin Block", lat: 33.64463, lng: 72.98482, category: "Faculty/Admin", keywords: ["admin", "block", "hostel office"] },
];

export function findVenueCoordinates(query: string): { name: string; lat: number; lng: number } | null {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return null;

    // Exact match on name or ID
    const exact = NUST_VENUES.find(v => v.name.toLowerCase() === normalizedQuery || v.id === normalizedQuery);
    if (exact) return { name: exact.name, lat: exact.lat, lng: exact.lng };

    // Keyword match
    const keywordMatch = NUST_VENUES.find(v =>
        v.keywords.some(k => normalizedQuery.includes(k) || k.includes(normalizedQuery))
    );
    if (keywordMatch) return { name: keywordMatch.name, lat: keywordMatch.lat, lng: keywordMatch.lng };

    return null;
}

export function getVenueSuggestions(query: string): Venue[] {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return NUST_VENUES; // Return all if empty (for dropdown)

    return NUST_VENUES.filter(v =>
        v.name.toLowerCase().includes(normalizedQuery) ||
        v.id.includes(normalizedQuery) ||
        v.keywords.some(k => k.includes(normalizedQuery))
    );
}
