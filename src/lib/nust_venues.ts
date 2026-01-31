export interface Venue {
    id: string;
    name: string;
    lat: number;
    lng: number;
    keywords: string[];
}

export const NUST_VENUES: Venue[] = [
    {
        id: "seecs-seminar-hall",
        name: "SEECS Seminar Hall",
        lat: 33.642512,
        lng: 72.990425,
        keywords: ["seecs", "seminar", "hall", "auditorium"],
    },
    {
        id: "seecs-lab-3",
        name: "SEECS Lab 3 (Farooq Ahmed)",
        lat: 33.642512,
        lng: 72.990425,
        keywords: ["seecs", "lab", "computer", "lab 3"],
    },
    {
        id: "smme-auditorium",
        name: "SMME Auditorium",
        lat: 33.636605,
        lng: 72.992667,
        keywords: ["smme", "mechanical", "auditorium"],
    },
    {
        id: "sada-courtyard",
        name: "SADA Courtyard",
        lat: 33.647318,
        lng: 72.993354,
        keywords: ["sada", "art", "architecture", "courtyard"],
    },
    {
        id: "nbs-ground",
        name: "NBS Ground",
        lat: 33.646450,
        lng: 72.986873,
        keywords: ["nbs", "business", "ground", "lawn"],
    },
    {
        id: "s3h-lecture-hall",
        name: "S3H Lecture Hall",
        lat: 33.646450,
        lng: 72.986873, // Approximate S3H location
        keywords: ["s3h", "social", "sciences", "hall"],
    },
    {
        id: "c1-cordoba",
        name: "Concordia 1 (C1)",
        lat: 33.645084,
        lng: 72.994513,
        keywords: ["c1", "cafe", "cafeteria", "concordia"],
    },
    {
        id: "c2-cafe",
        name: "Concordia 2 (C2)",
        lat: 33.639418,
        lng: 72.985929,
        keywords: ["c2", "cafe", "cafeteria", "concordia", "sada cafe"],
    },
    {
        id: "main-library",
        name: "NUST Main Library",
        lat: 33.643665,
        lng: 72.992667,
        keywords: ["library", "central"],
    },
    {
        id: "nust-lake",
        name: "NUST Lake",
        lat: 33.636605, // Approximate
        lng: 72.992667,
        keywords: ["lake", "water", "picnic"],
    },
    {
        id: "student-center",
        name: "Student Center (NSTP)",
        lat: 33.642,
        lng: 72.990,
        keywords: ["nstp", "park", "center", "bowling"],
    },
];

export function findVenueCoordinates(query: string): { name: string; lat: number; lng: number } | null {
    const normalizedQuery = query.toLowerCase().trim();

    // Exact match
    const exact = NUST_VENUES.find(v => v.name.toLowerCase() === normalizedQuery);
    if (exact) return { name: exact.name, lat: exact.lat, lng: exact.lng };

    // Keyword match (scoring)
    let bestMatch = null;
    let maxScore = 0;

    for (const venue of NUST_VENUES) {
        let score = 0;
        const venueWords = venue.keywords;
        const queryWords = normalizedQuery.split(/\s+/);

        for (const qWord of queryWords) {
            if (venueWords.some(vWord => vWord.includes(qWord) || qWord.includes(vWord))) {
                score++;
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
