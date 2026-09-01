export interface Author {
    name: string;
    role: string;
    avatar: string;
    bio: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface BlogPost {
    slug: string;
    title: string;
    headline: string;
    description: string;
    category: "Orientation" | "Academics" | "Campus Life" | "Food & Cafes" | "Guides";
    tags: string[];
    keywords: string[];
    publishedAt: string;
    updatedAt: string;
    readTime: string;
    author: Author;
    coverImage: string;
    faqs?: FAQItem[];
    content: string;
}

export const BLOG_AUTHORS: Record<string, Author> = {
    team: {
        name: "NUST Nama Editorial",
        role: "Campus Intelligence Team",
        avatar: "/images/bot-avatar.png",
        bio: "Curating verified campus guides, orientation breakdowns, and student survival resources for NUST H-12.",
    },
    ahmad: {
        name: "Ahmad Faiz",
        role: "Senior Contributor & SEECS Alum",
        avatar: "/images/bot-avatar.png",
        bio: "Writing about student life, academic hacks, and campus navigation on H-12.",
    },
};

export const BLOG_POSTS: BlogPost[] = [
    {
        slug: "nust-orientation-2026-complete-guide",
        title: "NUST Orientation 2026: Complete 3-Day Schedule, Events & Freshmen Guide",
        headline: "Everything you need to know about NUST Orientation 2026: Daily schedules, Scavenger Hunt, OG activities, and survival tips.",
        description: "Official breakdown of NUST Orientation 2026. Complete Day 1, Day 2, and Day 3 schedules, Scavenger Hunt waitlist, gate timings, dress code, and essential freshmen advice.",
        category: "Orientation",
        tags: ["Orientation2026", "Freshmen", "Schedule", "CampusGuide", "NUST"],
        keywords: [
            "NUST Orientation 2026",
            "NUST Freshmen guide 2026",
            "NUST Orientation schedule 2026",
            "NUST Orientation dates",
            "NUST OGs",
            "NUST Scavenger Hunt waitlist",
            "NUST H-12 orientation",
        ],
        publishedAt: "2026-08-31T10:00:00+05:00",
        updatedAt: "2026-09-01T15:00:00+05:00",
        readTime: "5 min read",
        author: BLOG_AUTHORS.team,
        coverImage: "/images/events/scavenger-hunt.jpg",
        faqs: [
            {
                question: "What are the official dates for NUST Orientation 2026?",
                answer: "NUST Orientation 2026 takes place over 3 full days from Wednesday, September 2nd to Friday, September 4th, 2026 on the H-12 Islamabad campus.",
            },
            {
                question: "Which gate should freshmen use for Orientation?",
                answer: "Gate 1 (main entrance facing Kashmir Highway / Metro Orange Line) and Gate 2 (facing Sector G-13) are the primary access points. Motorbikes must enter through Gate 10 right next to Gate 1.",
            },
            {
                question: "How do I register for the Orientation Scavenger Hunt?",
                answer: "Join the official waitlist directly at https://orientation.nust.edu.pk/waitlist for the Pokémon-themed campus Scavenger Hunt happening on Day 2.",
            },
        ],
        content: `
Stepping into NUST's 700-acre H-12 campus for the first time can feel exciting yet intimidating. With over 15 schools, sprawling hostels, and thousands of new faces, **Orientation Week (ON'26)** is designed to transition you seamlessly into university life.

Below is your verified, minute-by-minute schedule, venue details, and survival tips from senior students.

---

## 📅 Day 1: Wednesday, Sep 2 — The Grand Welcome

The opening day focuses on introducing you and your parents to university leadership, meeting your department heads, and getting assigned to your **Orientation Guides (OGs)**.

| Time | Event | Venue | Details |
| :--- | :--- | :--- | :--- |
| **10:00 – 11:30** | Opening Briefing & Q&A with Parents | Jinnah Auditorium / NBS Hall | Keynote address by the Rector & Registrar on campus policies, safety, and academics. |
| **12:00 – 13:00** | Principal S3H Address + Q&A | Jinnah Auditorium | Orientation for School of Social Sciences & Humanities. |
| **14:00 – 15:00** | Principal NBS Address + Q&A | Jinnah Auditorium | Orientation for NUST Business School freshers. |
| **15:30 – 16:30** | Principal SEECS Address + Q&A | Jinnah Auditorium | Orientation for School of Electrical Engineering & Computer Science. |
| **14:00 – 16:00** | Meet Your OGs (Orientation Guides) | NBS Ground | Icebreakers, squad name assignments, and tour group allocation. |
| **16:00 – 21:00** | Official Batch Photograph | Convocation Ground | The iconic whole-batch class photo that stays in NUST archives forever. |

> **Pro Tip:** Wear smart casuals or semi-formal attire for the batch photo. The sun can get warm on the grounds, so carry a water bottle!

---

## 🎯 Day 2: Thursday, Sep 3 — School Tours & Society Showcases

Day 2 is where the real campus energy kicks off. You will tour your school's research labs, sign up for student clubs, and compete in campus-wide challenges.

| Time | Event | Venue | Details |
| :--- | :--- | :--- | :--- |
| **09:00 – 13:00** | Department & School Reception | Respective School Blocks | Meet your HoD, course advisors, lab engineers, and receive your semester timetable. |
| **13:00 – 19:00** | OG Team Games & Campus Relay | NBS Ground | Fun interactive outdoor challenges with your OG squad. |
| **13:00 – 18:00** | Orientation Scavenger Hunt | NBS Ground / Campus Wide | Pokémon-themed quest across H-12 landmarks. Registration required at [orientation.nust.edu.pk/waitlist](https://orientation.nust.edu.pk/waitlist). |
| **14:00 – 19:00** | Clubs & Societies Expo | Central Grounds | Over 30+ official student bodies (NUST Science Society, GDSC, NUST Dramatics Club, etc.) recruiting freshmen. |
| **18:00 – 21:00** | Drama Night by NDC | Jinnah Auditorium | Live stage play and comedy sketches by NUST Dramatics Club. |

---

## 🌟 Day 3: Friday, Sep 4 — Life at NUST & Bazm Night

The final day prepares you for academic success, followed by an unforgettable musical and cultural evening under the stars.

| Time | Event | Venue | Details |
| :--- | :--- | :--- | :--- |
| **10:00 – 12:30** | Life at NUST (Registrar, FAO, & Alumni) | Jinnah Auditorium | Vital session on GPA rules, financial aid, fee installments, and alumni career paths. |
| **10:00 – 12:30** | Life at NUST — SEECS Special Session | SCEE Seminar Hall | Technical roadmap and career tips for computing & engineering students. |
| **15:30 – 16:30** | Closing Ceremony & Awards | Jinnah Auditorium | Concluding address, OG awards, and announcement of competition winners. |
| **17:00 – 22:00** | Bazm Night & Society Stalls | SCME Ground | Cultural food stalls, live acoustic performances, and celebration. |

---

## 🎒 5 Essential Freshmen Survival Tips

1. **Footwear is King:** NUST H-12 is massive (700+ acres). You will easily log 8,000 to 12,000 steps a day walking between hostels, cafes, and academic blocks. Wear comfortable sneakers.
2. **Transportation:** The Metro Orange Line & Green Line feeder buses stop right outside Gate 1 and Gate 2. If riding a bike, use Gate 10.
3. **Food on the Go:** Concordia 1 (C1) and the Central Library Cafe are the quickest spots for lunch between orientation sessions.
4. **ID Card & Documents:** Always keep your provisional admission letter and CNIC handy during the first week while official smart student cards are being printed.
5. **Interactive Campus Map:** Bookmark the live [NUST Nama Campus Map](/map) to search all 77 buildings, cafes, gates, and libraries right from your phone.
`,
    },
    {
        slug: "nust-attendance-policy-minimum-classes-rules",
        title: "NUST Attendance Policy Explained: Minimum 75% Rule, Fines & How to Calculate Leaves",
        headline: "Never get debarred from an exam: The complete breakdown of NUST's strict 75% attendance policy and medical leave procedures.",
        description: "Official guide to NUST's 75% attendance rule. Calculate exact class allowance per credit hour, learn how to submit medical leaves, and avoid exam debarment.",
        category: "Academics",
        tags: ["Attendance", "Academics", "Policies", "GPA", "NUSTRules"],
        keywords: [
            "NUST attendance policy",
            "NUST 75 percent rule",
            "how many classes can I miss at NUST",
            "NUST medical leave procedure",
            "NUST attendance fine",
            "debarred from NUST exam",
        ],
        publishedAt: "2026-08-30T09:00:00+05:00",
        updatedAt: "2026-09-01T12:00:00+05:00",
        readTime: "4 min read",
        author: BLOG_AUTHORS.ahmad,
        coverImage: "/images/hero_badminton.jpg",
        faqs: [
            {
                question: "What is the minimum attendance required at NUST?",
                answer: "NUST strictly mandates a minimum of 75% attendance in each registered course to be eligible to sit for the End-Semester Examination.",
            },
            {
                question: "How many lectures can I miss in a 3-credit hour course?",
                answer: "A standard 3-credit course has roughly 45 to 48 lectures per semester. Missing more than 11 to 12 lectures puts you below 75% and risks debarment.",
            },
            {
                question: "How do I submit a medical leave certificate?",
                answer: "Medical certificates must be submitted to the School Examination/Coordination Branch within 7 days of absence and verified by NUST Medical Centre (NMC).",
            },
        ],
        content: `
One of the quickest ways students run into academic trouble at NUST is taking attendance casually. Unlike many colleges, **NUST strictly enforces the 75% attendance rule across all undergraduate and postgraduate programs**.

Falling below 75% in any registered course means you are awarded an **'F' grade (debarred)** and are prohibited from sitting in the End-Semester Final Examination.

---

## 📊 How Many Classes Can You Safely Miss?

Attendance is tracked per-course on CMS/LMS, not as an aggregate across the semester. Here is the exact calculation for a typical 16-week semester:

| Course Type | Total Classes Held | Minimum Required (75%) | Max Allowed Absences (25%) |
| :--- | :--- | :--- | :--- |
| **3-Credit Theory (3 hrs/wk)** | ~48 lectures | **36 lectures** | **Max 12 lectures** |
| **2-Credit Theory (2 hrs/wk)** | ~32 lectures | **24 lectures** | **Max 8 lectures** |
| **1-Credit Lab (3 hrs lab/wk)** | ~16 lab sessions | **12 lab sessions** | **Max 4 lab sessions** |
| **4-Credit Course (4 hrs/wk)** | ~64 lectures | **48 lectures** | **Max 16 lectures** |

> **Critical Warning for Labs:** Because practical lab courses meet only once a week, missing just **4 labs** puts you under the 75% threshold and results in instant debarment from practical finals!

---

## 🏥 Official Medical & Duty Leave Procedures

If you fall ill or represent NUST in an official competition or conference, follow this exact workflow:

### 1. Medical Leave from NMC
* Any medical slip from outside hospitals must be endorsed by the **NUST Medical Centre (NMC)** on campus.
* Submit your leave application along with the endorsed medical certificate to your School Coordination / Examination Branch within **7 working days** of returning to classes.

### 2. Duty Leave (Competitions / Hackathons)
* If attending an official society event or sports tournament, ensure the Faculty Advisor submits a formal **Duty Leave Request** to the Dean *prior* to departure.
* Duty leaves count toward attendance and protect your 75% standing.

---

## ⚠️ What Happens If Your Attendance Drops Below 75%?

1. **CMS Warning Alerts:** Once your attendance drops below 80%, automated alert emails are sent via the CMS portal.
2. **Debarment Notice:** In the final week of classes, the School Examination branch posts the official debarment list. Debarred students cannot sit in the final exam and receive an 'F' grade in that course.
3. **Dean's Discretionary Condonation:** In exceptional, hospitalized medical emergencies, the Dean has discretionary authority to condone attendance down to 65% upon formal appeal.
`,
    },
    {
        slug: "nust-grading-system-gpa-calculation-relative-grading",
        title: "NUST GPA & Grading System (2026): How Relative & Absolute Grading Actually Works",
        headline: "Understand how the curve works at NUST: SGPA/CGPA formulas, relative grading bell curves, and academic probation thresholds.",
        description: "Demystifying NUST's grading policy. Learn how relative grading calculates mean and standard deviation, GPA scale tables, and how to maintain a 3.5+ CGPA.",
        category: "Academics",
        tags: ["GPA", "GradingSystem", "RelativeGrading", "Academics", "NUST"],
        keywords: [
            "NUST GPA calculation",
            "NUST grading system 2026",
            "NUST relative grading bell curve",
            "NUST SGPA CGPA formula",
            "NUST academic probation rules",
            "NUST grading scale",
        ],
        publishedAt: "2026-08-28T14:00:00+05:00",
        updatedAt: "2026-09-01T11:00:00+05:00",
        readTime: "6 min read",
        author: BLOG_AUTHORS.ahmad,
        coverImage: "/images/hero_aerial_1.jpg",
        faqs: [
            {
                question: "What is the difference between relative and absolute grading at NUST?",
                answer: "In absolute grading, fixed mark brackets determine grades (e.g. 85+ is A). In relative grading, your grade depends on your performance relative to the class mean (average) and standard deviation.",
            },
            {
                question: "What CGPA puts you on academic probation at NUST?",
                answer: "An undergraduate student with a CGPA below 2.00 is placed on Academic Probation. Remaining on probation for 3 consecutive semesters can lead to academic dismissal.",
            },
        ],
        content: `
At NUST, most computing, engineering, business, and social science courses with more than 20 students follow **Relative Grading**. Smaller elective batches (under 20 students) and specific laboratory practicals use **Absolute Grading**.

Understanding how the grading curve functions is the key to maintaining a high CGPA without burning out.

---

## 📈 The Relative Grading Bell Curve Explained

Instead of fixing 80 marks as an 'A', your final grade is determined by your statistical standing in the section:

* **Class Mean (μ):** The average score of all students in the course section.
* **Standard Deviation (σ):** How widely marks are distributed above and below the average.

### Grade Distribution Thresholds:
* **Grade 'A' (4.00 GPA):** Awarded to students scoring significantly above the mean (typically **Score ≥ μ + 1.5σ**).
* **Grade 'B+' (3.50 GPA):** Awarded around **Score ≥ μ + 1.0σ**.
* **Grade 'B' (3.00 GPA):** Awarded around **Score ≥ μ + 0.5σ**.
* **Grade 'C+' (2.50 GPA):** Awarded near the class average (**Score ≈ μ**).
* **Grade 'C' (2.00 GPA):** Passing benchmark (**Score ≥ μ - 1.0σ**).
* **Grade 'F' (0.00 GPA):** Failing score (**Score < μ - 2.0σ**).

> **The Big Advantage:** If an exam was exceptionally difficult and the class average was only 42/100, scoring a 60/100 can easily earn you a **4.0 GPA (A Grade)**!

---

## 📑 Official NUST Letter Grade & GPA Conversion Scale

| Letter Grade | Grade Point (GPA) | Percentage Range (Absolute) | Academic Standing |
| :--- | :--- | :--- | :--- |
| **A** | **4.00** | 80% and above | Outstanding / Exceptional |
| **B+** | **3.50** | 75% – 79% | Very Good |
| **B** | **3.00** | 70% – 74% | Good / Above Average |
| **C+** | **2.50** | 65% – 69% | Satisfactory |
| **C** | **2.00** | 60% – 64% | Average (Minimum Pass) |
| **D** | **1.00** | 50% – 59% | Bare Minimum Pass |
| **F** | **0.00** | Below 50% | Fail (Must Repeat Course) |

---

## 🚨 Academic Probation & Course Repeat Rules

* **Probation Threshold:** Any semester ending with a **CGPA below 2.00** triggers an official Academic Probation warning.
* **Repeating Courses:** You can repeat any course in which you received a **C+ or lower** to improve your grade point. The higher grade completely replaces the older grade in your CGPA calculation!
* **Rector's & Dean's Honor Roll:** Students achieving a semester GPA (SGPA) of **3.50+** earn Dean's Honor Roll, while **3.85+** earns Rector's Honor Roll.
`,
    },
    {
        slug: "best-food-spots-cafes-nust-h12-campus",
        title: "The Ultimate NUST H-12 Food Guide: Top 10 Cafes, Hidden Gems & Must-Try Dishes",
        headline: "Where to eat on H-12: The ultimate student-tested review of Concordia 1, C2, South Edge, and departmental cafes.",
        description: "Ranked student guide to the best food, coffee, fast food, and budget meals inside NUST Islamabad H-12 campus. Menus, prices, and locations reviewed.",
        category: "Food & Cafes",
        tags: ["Food", "Cafes", "NUSTLife", "C1", "C2", "CampusDining"],
        keywords: [
            "best food at NUST",
            "NUST H-12 cafes review",
            "C1 vs C2 NUST",
            "NUST Concordia 1 menu",
            "NUST South Edge C3",
            "NUST Central Library Cafe",
        ],
        publishedAt: "2026-08-25T12:00:00+05:00",
        updatedAt: "2026-09-01T10:00:00+05:00",
        readTime: "5 min read",
        author: BLOG_AUTHORS.team,
        coverImage: "/images/hero_concert.jpg",
        faqs: [
            {
                question: "What is the difference between C1 and C2 at NUST?",
                answer: "Concordia 1 (C1) is located in the central academic zone near NBS/S3H and is best for quick lunches, burgers, and juices. Concordia 2 (C2) is near the hostels and specializes in evening BBQ, karahi, and desi dining.",
            },
            {
                question: "Where can I find the best coffee and quiet study snacks?",
                answer: "The Central Library Cafe and SADA Courtyard Cafe serve the top-rated espresso, iced lattes, and bakery pastries in a calm atmosphere.",
            },
        ],
        content: `
With more than 15,000 students on campus daily, NUST H-12 hosts a diverse culinary landscape—from budget-friendly 100-rupee chai dhabas to full-service barbecue lawns and artisanal coffee spots.

Here is the student-ranked definitive guide to every major food hub on campus.

---

## 🥇 1. Concordia 1 (C1) — The Daytime Fast Food Hub
* **Location:** Behind NBS and S3H ([View on Map](/map))
* **Best For:** Quick lunch breaks between lectures, fresh fruit juices, loaded burgers, and wraps.
* **Must-Try Items:**
  * **Chicken Paratha Roll** — Quick, hearty, and easy on the pocket.
  * **Fresh Seasonal Juices** — Mint Lemonade, Mango Shake, and Peach Slush.
  * **Zinger Burger with Fries** — The campus standard quick bite.

---

## 🌙 2. Concordia 2 (C2) — The Evening & Hostel Hub
* **Location:** Adjacent to Attar & Razi Hostels ([View on Map](/map))
* **Best For:** Group dinners, late-night tea sessions, BBQ platters, and authentic desi woks.
* **Must-Try Items:**
  * **Chicken Sajji & BBQ Tikka** — Best shared with friends under the open sky.
  * **Chicken Karahi with Tandoori Naan** — Cooked fresh to order in large woks.
  * **Karak Doodh Patti** — The essential fuel for late-night exam prep.

---

## 🌊 3. South Edge (C3) & Lake View
* **Location:** South campus near SMME and the NUST Lake ([View on Map](/map))
* **Best For:** Scenic outdoor seating by the water, peaceful lunches away from the main rush.
* **Must-Try Items:** Club sandwiches, loaded cheesy fries, and iced peach tea.

---

## ☕ 4. Central Library Cafe
* **Location:** Ground Floor, Central Library ([View on Map](/map))
* **Best For:** Quiet study sessions, specialty espresso, cold brew, and bakery treats.
* **Must-Try Items:** Iced Caramel Macchiato and warm fudge brownies.

---

## 🎨 5. SADA Courtyard Cafe
* **Location:** School of Art, Design and Architecture (SADA)
* **Best For:** Bohemian artistic vibes, gourmet sandwiches, and al fresco benches.
* **Must-Try Items:** Grilled chicken paninis and chocolate croissants.
`,
    },
];

export function getBlogPost(slug: string): BlogPost | undefined {
    return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
    return BLOG_POSTS.map((p) => p.slug);
}

export function getRelatedBlogPosts(currentSlug: string, limit = 3): BlogPost[] {
    const current = getBlogPost(currentSlug);
    if (!current) return BLOG_POSTS.slice(0, limit);

    return BLOG_POSTS
        .filter((p) => p.slug !== currentSlug)
        .sort((a, b) => {
            if (a.category === current.category) return -1;
            if (b.category === current.category) return 1;
            return 0;
        })
        .slice(0, limit);
}
