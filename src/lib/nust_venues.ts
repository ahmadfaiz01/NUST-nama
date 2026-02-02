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
    { id: "seecs", name: "SEECS", lat: 33.6433, lng: 72.9916, category: "Academic", keywords: ["seecs", "electrical", "cs"] },
    { id: "nbs", name: "NBS", lat: 33.6454, lng: 72.9922, category: "Academic", keywords: ["nbs", "business"] },
    { id: "s3h", name: "S3H", lat: 33.6468, lng: 72.9932, category: "Academic", keywords: ["s3h", "social", "sciences"] },
    { id: "sada", name: "SADA", lat: 33.6465, lng: 72.9948, category: "Academic", keywords: ["sada", "art", "architecture"] },
    { id: "sns", name: "SNS", lat: 33.6444, lng: 72.9904, category: "Academic", keywords: ["sns", "natural"] },
    { id: "smme", name: "SMME", lat: 33.6508, lng: 72.9972, category: "Academic", keywords: ["smme", "mechanical"] },
    { id: "scme", name: "SCME", lat: 33.6496, lng: 73.0003, category: "Academic", keywords: ["scme", "chemical", "materials"] },
    { id: "asab", name: "ASAB", lat: 33.6416, lng: 72.9868, category: "Academic", keywords: ["asab", "bio"] },
    { id: "nshs", name: "NSHS", lat: 33.6410, lng: 72.9860, category: "Academic", keywords: ["nshs", "health"] },
    { id: "sines", name: "SINES", lat: 33.6425, lng: 72.9905, category: "Academic", keywords: ["sines"] },
    { id: "cips", name: "CIPS", lat: 33.6430, lng: 72.9900, category: "Academic", keywords: ["cips", "planning"] },
    { id: "upcase", name: "UPCASE", lat: 33.6455, lng: 72.9985, category: "Academic", keywords: ["upcase"] },
    { id: "jsppl", name: "JSPPL", lat: 33.6460, lng: 72.9990, category: "Academic", keywords: ["jsppl"] },
    { id: "iese", name: "IESE (SCEE)", lat: 33.6472, lng: 73.0036, category: "Academic", keywords: ["iese", "scee"] },
    { id: "nice", name: "NICE (SCEE)", lat: 33.6477, lng: 73.0028, category: "Academic", keywords: ["nice", "scee"] },
    { id: "igis", name: "IGIS (SCEE)", lat: 33.6480, lng: 73.0012, category: "Academic", keywords: ["igis", "scee"] },

    // CAFE
    { id: "c1", name: "Concordia 1 (C1)", lat: 33.6458, lng: 72.9914, category: "Cafe", keywords: ["c1", "cafe", "food"] },
    { id: "c2", name: "Concordia 2 (C2)", lat: 33.6500, lng: 72.9980, category: "Cafe", keywords: ["c2", "cafe", "food"] },
    { id: "c3", name: "C3 / South Edge", lat: 33.6405, lng: 72.9875, category: "Cafe", keywords: ["c3", "cafe", "food"] },
    { id: "central-library-cafe", name: "Central Library Cafe", lat: 33.6465, lng: 72.9910, category: "Cafe", keywords: ["library", "cafe"] },

    // AUDITORIUM
    { id: "jinnah-aud", name: "Jinnah Auditorium", lat: 33.6460, lng: 72.9925, category: "Auditorium", keywords: ["jinnah", "auditorium"] },

    // SPORTS
    { id: "old-gym", name: "Old Gym", lat: 33.6510, lng: 72.9930, category: "Sports", keywords: ["gym", "sports"] },
    { id: "new-gym", name: "New Gym", lat: 33.6518, lng: 72.9942, category: "Sports", keywords: ["gym", "sports"] },
    { id: "nbs-ground", name: "NBS Ground", lat: 33.6450, lng: 72.9928, category: "Sports", keywords: ["nbs", "ground"] },
    { id: "hbl-ground", name: "HBL Ground", lat: 33.6475, lng: 72.9905, category: "Sports", keywords: ["hbl", "ground"] },
    { id: "cricket-ground", name: "Cricket Ground", lat: 33.6490, lng: 72.9910, category: "Sports", keywords: ["cricket", "ground"] },

    // ADMIN/FACULTY
    { id: "main-office", name: "Main Office (Admin)", lat: 33.6475, lng: 72.9915, category: "Faculty/Admin", keywords: ["main", "office", "admin"] },
    { id: "faculty-housing", name: "Faculty Housing", lat: 33.6400, lng: 73.0050, category: "Faculty/Admin", keywords: ["faculty", "housing"] },
];

export function findVenueCoordinates(query: string): { name: string; lat: number; lng: number } | null {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return null;

    // Exact match on name or ID
    const exact = NUST_VENUES.find(v => v.name.toLowerCase() === normalizedQuery || v.id === normalizedQuery);
    if (exact) return { name: exact.name, lat: exact.lat, lng: exact.lng };

    return null;
}

export function getVenueSuggestions(query: string): Venue[] {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return NUST_VENUES; // Return all if empty (for dropdown)

    return NUST_VENUES.filter(v =>
        v.name.toLowerCase().includes(normalizedQuery) ||
        v.keywords.some(k => k.includes(normalizedQuery))
    );
}
