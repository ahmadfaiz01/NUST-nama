/**
 * Every place on NUST's H-12 campus worth putting a pin on.
 *
 * Coordinates come from OpenStreetMap where the feature is mapped there (52 of
 * the 77 below), and are otherwise read off NUST's own orientation map. The OSM
 * ones are survey-grade; the rest are accurate to roughly 20 m.
 *
 * ponytail: a flat array, not a table. This changes about once a year, when a
 * cafe opens or a hostel is renamed, so a commit is the right edit mechanism.
 * Move it to Supabase if non-developers ever need to edit it.
 *
 * Separate from `nust_venues.ts` on purpose: that one feeds the venue dropdown
 * on /post-event and only lists places you can hold an event at.
 */

export const CATEGORIES = [
    "Gates",
    "Schools",
    "Hostels",
    "Cafes",
    "Sports",
    "Mosques",
    "Banks",
    "Facilities",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface CampusPlace {
    id: string;
    name: string;
    category: Category;
    lat: number;
    lng: number;
    /** One line. What a student needs to know, not what the building is called. */
    blurb: string;
}

export const CATEGORY_COLOURS: Record<Category, string> = {
    Gates: "#D85503",
    Schools: "#2A5290",
    Hostels: "#C9BFA8",
    Cafes: "#E58A4E",
    Sports: "#3D66A9",
    Mosques: "#4FA8C7",
    Banks: "#9AA7B8",
    Facilities: "#7FD1B9",
};

/** Category Emojis / Icons for fallback */
export const CATEGORY_ICONS: Record<Category, string> = {
    Gates: "🚪",
    Schools: "🎓",
    Hostels: "🏢",
    Cafes: "☕",
    Sports: "⚽",
    Mosques: "🕌",
    Banks: "🏦",
    Facilities: "🛠️",
};

/** High-contrast icon colors for maximum legibility on each background */
export const CATEGORY_ICON_COLOURS: Record<Category, string> = {
    Gates: "#FFFFFF",
    Schools: "#FFFFFF",
    Hostels: "#1B3A6B",
    Cafes: "#FFFFFF",
    Sports: "#FFFFFF",
    Mosques: "#1B3A6B",
    Banks: "#1B3A6B",
    Facilities: "#1B3A6B",
};

/** High-res SVG icon strings with matched contrast for Leaflet circular markers */
export const CATEGORY_SVG_STRINGS: Record<Category, string> = {
    Gates: `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/><path d="M2 20h20"/><path d="M14 12v.01"/></svg>`,
    Schools: `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    Hostels: `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1B3A6B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
    Cafes: `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`,
    Sports: `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
    Mosques: `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1B3A6B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4v2h8V6a4 4 0 0 0-4-4Z"/><path d="M4 22V10h16v12"/><path d="M9 22v-5a3 3 0 0 1 6 0v5"/><path d="M12 2v2"/></svg>`,
    Banks: `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1B3A6B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2 6 10-4 10 4"/><path d="M4 10h16"/><path d="M6 10v8"/><path d="M10 10v8"/><path d="M14 10v8"/><path d="M18 10v8"/><path d="M2 18h20"/><path d="M2 22h20"/></svg>`,
    Facilities: `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1B3A6B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
};

/** Centre of campus, bounds, and the zoom at which every pin fits on screen. */
export const CAMPUS_CENTER: [number, number] = [33.6428, 72.9905];
export const CAMPUS_ZOOM = 15.2;
export const CAMPUS_MIN_ZOOM = 15;
export const CAMPUS_MAX_ZOOM = 18;
export const CAMPUS_BOUNDS: [[number, number], [number, number]] = [
    [33.6330, 72.9780],
    [33.6515, 73.0030],
];

export const CAMPUS_PLACES: CampusPlace[] = [
    // ---- Gates ----
    { id: "gate-1", name: "Gate 1", category: "Gates", lat: 33.64898, lng: 72.99904, blurb: "By the NUST metro stop and the girls' hostels. Cars only — bikes are turned away." },
    { id: "gate-2", name: "Gate 2", category: "Gates", lat: 33.6461, lng: 72.98058, blurb: "The G-13 metro side. Shortest walk to the boys' hostels and Fatima." },
    { id: "gate-4", name: "Gate 4", category: "Gates", lat: 33.64107, lng: 72.98367, blurb: "Opens onto NICE and the exam centre." },
    { id: "gate-10", name: "Gate 10", category: "Gates", lat: 33.64643, lng: 73.00155, blurb: "Right beside Gate 1, and this one does let bikes through." },
    { id: "gate-15", name: "Gate 15", category: "Gates", lat: 33.64209, lng: 72.98571, blurb: "Small side gate by the NICE lawn." },
    { id: "gate-16", name: "Gate 16", category: "Gates", lat: 33.64296, lng: 72.98886, blurb: "Small side gate between C2 and SEECS." },

    // ---- Schools ----
    { id: "seecs", name: "SEECS", category: "Schools", lat: 33.64286, lng: 72.99021, blurb: "Electrical Engineering and Computer Science. Undergrad, postgrad and faculty blocks together." },
    { id: "nbs", name: "NBS", category: "Schools", lat: 33.64446, lng: 72.99057, blurb: "NUST Business School." },
    { id: "s3h", name: "S3H", category: "Schools", lat: 33.64436, lng: 72.993, blurb: "Social Sciences and Humanities." },
    { id: "sada", name: "SADA", category: "Schools", lat: 33.64597, lng: 72.98881, blurb: "Art, Design and Architecture." },
    { id: "sns", name: "SNS", category: "Schools", lat: 33.63684, lng: 72.99022, blurb: "Natural Sciences, down at the south end past SMME." },
    { id: "smme", name: "SMME", category: "Schools", lat: 33.63632, lng: 72.98941, blurb: "Mechanical and Manufacturing Engineering. The furthest school from the main gates." },
    { id: "scme", name: "SCME", category: "Schools", lat: 33.64806, lng: 72.99282, blurb: "Chemical and Materials Engineering, up in the north of campus." },
    { id: "asab", name: "ASAB", category: "Schools", lat: 33.64636, lng: 72.98786, blurb: "Atta-ur-Rahman School of Applied Biosciences." },
    { id: "nshs", name: "NSHS", category: "Schools", lat: 33.64858, lng: 72.99486, blurb: "Health Sciences, at the top of campus near SCME." },
    { id: "sines", name: "SINES", category: "Schools", lat: 33.64611, lng: 72.99787, blurb: "Interdisciplinary Engineering and Sciences, beside the science park." },
    { id: "nice", name: "NICE", category: "Schools", lat: 33.6407, lng: 72.98524, blurb: "Civil Engineering, part of SCEE. Near Gate 4." },
    { id: "iese", name: "IESE", category: "Schools", lat: 33.648, lng: 72.9893, blurb: "Environmental Sciences and Engineering, part of SCEE." },
    { id: "igis", name: "IGIS", category: "Schools", lat: 33.64499, lng: 72.98827, blurb: "Geographical Information Systems, part of SCEE." },
    { id: "rimms", name: "RIMMS", category: "Schools", lat: 33.64436, lng: 72.98705, blurb: "Microwave and millimetre-wave research institute." },
    { id: "uspcas-e", name: "USPCAS-E", category: "Schools", lat: 33.64225, lng: 72.98441, blurb: "US–Pakistan Centre for Advanced Studies in Energy." },
    { id: "cips", name: "CIPS", category: "Schools", lat: 33.64541, lng: 72.98729, blurb: "Centre for International Peace and Stability." },
    { id: "ncls", name: "NUST Creative Learning School", category: "Schools", lat: 33.64502, lng: 73.00206, blurb: "K–12 school for staff and faculty children, out past Gate 1." },

    // ---- Hostels ----
    { id: "rahmat-raazi", name: "Rahmat & Raazi Hostels", category: "Hostels", lat: 33.64024, lng: 72.98673, blurb: "Twin boys' hostels in the southern hostel block." },
    { id: "ghazali-beruni", name: "Ghazali & Beruni Hostels", category: "Hostels", lat: 33.64031, lng: 72.98771, blurb: "Twin boys' hostels, next door to Rahmat and Raazi." },
    { id: "hajveri", name: "Hajveri Hostel", category: "Hostels", lat: 33.63949, lng: 72.98643, blurb: "Boys' hostel." },
    { id: "zakriya", name: "Zakriya Hostel", category: "Hostels", lat: 33.63974, lng: 72.98879, blurb: "Boys' hostel." },
    { id: "attar", name: "Attar Hostel", category: "Hostels", lat: 33.64001, lng: 72.98926, blurb: "Boys' hostel." },
    { id: "liaquat", name: "Liaquat Hostel", category: "Hostels", lat: 33.63953, lng: 72.98883, blurb: "Boys' hostel." },
    { id: "rayyan", name: "Rayyan Hostel", category: "Hostels", lat: 33.64096, lng: 72.98058, blurb: "Boys' hostel on the western edge, near Gate 2." },
    { id: "galaxy", name: "Galaxy Hostel", category: "Hostels", lat: 33.64189, lng: 72.97957, blurb: "Boys' hostel on the western edge." },
    { id: "fatima", name: "Fatima Hostels", category: "Hostels", lat: 33.64342, lng: 72.98553, blurb: "Girls' hostels, closest to Gate 2." },
    { id: "zainab", name: "Zainab Hostel", category: "Hostels", lat: 33.64557, lng: 72.99406, blurb: "Girls' hostel in the eastern hostel block." },
    { id: "ayesha", name: "Ayesha Hostel", category: "Hostels", lat: 33.64524, lng: 72.99449, blurb: "Girls' hostel in the eastern hostel block." },
    { id: "khadija", name: "Khadija Hostel", category: "Hostels", lat: 33.64455, lng: 72.99484, blurb: "Girls' hostel in the eastern hostel block." },
    { id: "amna", name: "Amna Hostel", category: "Hostels", lat: 33.644, lng: 72.99522, blurb: "Girls' hostel, closest to Maryam Mess." },
    { id: "capital", name: "Capital Hostel", category: "Hostels", lat: 33.64162, lng: 72.98058, blurb: "Girls' hostel on the western edge." },
    { id: "rumi", name: "Rumi Hostel", category: "Hostels", lat: 33.64558, lng: 72.99201, blurb: "Postgraduate hostel, blocks I and II." },

    // ---- Cafes ----
    { id: "c1", name: "C1", category: "Cafes", lat: 33.64664, lng: 72.99016, blurb: "Concordia 1, by the girls' hostels. Has a mart and an ATM." },
    { id: "c2", name: "C2", category: "Cafes", lat: 33.64302, lng: 72.98827, blurb: "Next to SEECS. Mart, tailor, stationery, barber and an ATM under one roof." },
    { id: "c3", name: "C3 (Monal of NUST)", category: "Cafes", lat: 33.64186, lng: 72.99386, blurb: "By the library, and the view is the reason for the nickname." },
    { id: "coffee-lounge", name: "Coffee Lounge", category: "Cafes", lat: 33.64758, lng: 72.99084, blurb: "Beside C1. Campus consensus is the desserts are the best going." },
    { id: "retro", name: "Retro Cafe", category: "Cafes", lat: 33.63935, lng: 72.98812, blurb: "In the boys' hostel area, open until 11pm, delivers to hostels free." },
    { id: "inno", name: "Inno Cafe", category: "Cafes", lat: 33.64631, lng: 72.99685, blurb: "Beside SINES, handy for NSTP and NSHS." },
    { id: "nstp-cafe", name: "NSTP Cafe", category: "Cafes", lat: 33.64646, lng: 72.99693, blurb: "Inside the National Science and Technology Park." },
    { id: "maryam-mess", name: "Maryam Mess", category: "Cafes", lat: 33.64388, lng: 72.9947, blurb: "Dining mess serving the girls' hostels." },
    { id: "shawarma-ladz", name: "Shawarma Ladz", category: "Cafes", lat: 33.64776, lng: 72.99067, blurb: "Fast food by C1 and the Coffee Lounge." },
    { id: "jango", name: "Jango", category: "Cafes", lat: 33.6394, lng: 72.98802, blurb: "Cafe in the boys' hostel area." },

    // ---- Sports ----
    { id: "new-gym", name: "New Gym & Swimming Pool", category: "Sports", lat: 33.64192, lng: 72.99478, blurb: "The newer fitness centre, with the pool attached." },
    { id: "old-gym", name: "Old Gym", category: "Sports", lat: 33.64492, lng: 72.99321, blurb: "By the girls' hostels, and free to use." },
    { id: "cricket-ground", name: "Cricket Ground", category: "Sports", lat: 33.64355, lng: 72.98277, blurb: "The main cricket ground, on the western side." },
    { id: "cricket-nets", name: "Cricket Nets", category: "Sports", lat: 33.63674, lng: 72.99098, blurb: "Practice nets down by SNS and SMME." },
    { id: "hbl-football", name: "HBL Football Ground", category: "Sports", lat: 33.64512, lng: 72.98370, blurb: "Full-size football ground." },
    { id: "hbl-futsal", name: "HBL Futsal Ground", category: "Sports", lat: 33.64456, lng: 72.98364, blurb: "Futsal pitch beside the football ground." },
    { id: "nbs-ground", name: "NBS Ground", category: "Sports", lat: 33.64542, lng: 72.99002, blurb: "The ground behind NBS." },
    { id: "basketball", name: "Basketball Court", category: "Sports", lat: 33.64438, lng: 72.98364, blurb: "Main basketball court, by the western grounds." },
    { id: "raazi-basketball", name: "Raazi Basketball Court", category: "Sports", lat: 33.63929, lng: 72.98656, blurb: "Court in the boys' hostel block, next to Raazi." },
    { id: "volleyball", name: "Volleyball Court", category: "Sports", lat: 33.64574, lng: 72.98982, blurb: "Casual volleyball court." },
    { id: "tennis", name: "Tennis Court", category: "Sports", lat: 33.64403, lng: 72.98424, blurb: "Lawn tennis courts beside the HBL sports grounds." },
    { id: "squash", name: "Squash Court", category: "Sports", lat: 33.64095, lng: 72.9871, blurb: "Indoor squash, near Sir Syed Mess." },
    { id: "badminton", name: "Badminton Court", category: "Sports", lat: 33.64147, lng: 72.99452, blurb: "Beside the new gym and pool." },
    { id: "skating", name: "Skating Rink", category: "Sports", lat: 33.64053, lng: 72.99568, blurb: "Indoor skating rink." },
    { id: "saddle-club", name: "Saddle Club", category: "Sports", lat: 33.63735, lng: 72.9925, blurb: "Horse riding and the equestrian centre." },
    { id: "nust-trail", name: "NUST Trail", category: "Sports", lat: 33.64794, lng: 72.99674, blurb: "Walking and jogging trail along the north edge." },

    // ---- Mosques ----
    { id: "masjid-rahmat", name: "Masjid e Rahmat", category: "Mosques", lat: 33.64405, lng: 72.98599, blurb: "The central mosque. Jummah at 1:00pm and again at 1:45pm." },
    { id: "masjid-noor", name: "Masjid e Noor", category: "Mosques", lat: 33.6356, lng: 72.9917, blurb: "By the employee quarters. Jummah at 1:30pm." },
    { id: "masjid-taqwa", name: "Masjid e Taqwa", category: "Mosques", lat: 33.64237, lng: 72.99576, blurb: "Serves the student residential area." },

    // ---- Banks ----
    { id: "hbl", name: "HBL Bank", category: "Banks", lat: 33.64335, lng: 72.98492, blurb: "A full branch — open an account or pay your fee here." },
    { id: "askari", name: "Askari Bank", category: "Banks", lat: 33.64592, lng: 72.99643, blurb: "Near NSTP. This is where mess bills get paid." },
    { id: "atm-east", name: "ATM", category: "Banks", lat: 33.64406, lng: 72.99806, blurb: "Cash withdrawals on the eastern side." },

    // ---- Facilities ----
    { id: "library", name: "NUST Library", category: "Facilities", lat: 33.64204, lng: 72.99251, blurb: "The central library, and the main place to actually study." },
    { id: "jinnah-auditorium", name: "Jinnah Auditorium", category: "Facilities", lat: 33.64328, lng: 72.99324, blurb: "Where the big events and ceremonies happen." },
    { id: "convocation-ground", name: "Convocation Ground", category: "Facilities", lat: 33.64285, lng: 72.99228, blurb: "Convocation and large outdoor events." },
    { id: "helipad-ground", name: "Helipad Ground", category: "Facilities", lat: 33.6446, lng: 72.98956, blurb: "Event ground used when guests visit." },
    { id: "medical-centre", name: "NUST Medical Centre", category: "Facilities", lat: 33.64412, lng: 72.99787, blurb: "Treatment and free medicine for emergencies." },
    { id: "admin-block", name: "Admin Block", category: "Facilities", lat: 33.64456, lng: 72.98488, blurb: "Hostel office and administration." },
    { id: "main-office", name: "NUST Main Office", category: "Facilities", lat: 33.64255, lng: 72.99307, blurb: "The rectorate — university administration." },
];
