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
                answer: "NUST Orientation 2026 takes place over 3 days from Wednesday, September 2nd to Friday, September 4th, 2026 on the H-12 Islamabad campus.",
            },
            {
                question: "Which gate should freshmen use for Orientation?",
                answer: "Gate 1 (metro and car entry) and Gate 2 (G-13 pedestrian entry) are the main access points. Gate 10 is available for motorbike entry right beside Gate 1.",
            },
            {
                question: "How do I register for the Orientation Scavenger Hunt?",
                answer: "You can join the official waitlist directly at https://orientation.nust.edu.pk/waitlist for the Pokémon-themed campus Scavenger Hunt happening on Day 2.",
            },
        ],
        content: `
## Welcome to NUST H-12, Class of 2026!

Stepping into NUST's 700-acre H-12 campus for the first time can feel overwhelming. With over 15 schools, multiple hostel sectors, and thousands of new faces, **Orientation Week** is your official launchpad.

Here is the verified 3-day schedule, event locations, and insider advice from seniors so you don't miss a thing.

---

### Day 1: Wednesday, 2nd September 2026 — The Grand Welcome

The first day is dedicated to getting familiar with university leadership, meeting your department principals, and getting allocated to your Orientation Guides (OGs).

* **10:00 – 11:30 | Opening Briefing & Q&A with Parents**  
  *Venue:* Jinnah Auditorium / NBS Hall (Broadcast)  
  *What to expect:* Key address by the Rector and Registrar explaining NUST core policies, transport, and campus safety. Parents are warmly invited.
* **12:00 – 13:00 | Principal S3H Address + Q&A**  
  *Venue:* Jinnah Auditorium
* **14:00 – 15:00 | Principal NBS Address + Q&A**  
  *Venue:* Jinnah Auditorium
* **15:30 – 16:30 | Principal SEECS Address + Q&A**  
  *Venue:* Jinnah Auditorium
* **14:00 – 16:00 | Meet Your OGs (Orientation Guides)**  
  *Venue:* NBS Ground  
  *What to expect:* Icebreakers, squad name assignments, and campus tour groups.
* **16:00 – 21:00 | Official Batch Photograph**  
  *Venue:* Convocation Ground  
  *Pro Tip:* Wear semi-formal or smart casual attire; this photo remains in NUST archives for your entire degree!

---

### Day 2: Thursday, 3rd September 2026 — School Tours & Society Showcases

* **09:00 – 13:00 | Department & School Reception**  
  *Venue:* Respective School Blocks / NET Exam Hall  
  *What to expect:* Meet your Head of Department (HoD), course advisors, tour computer/hardware labs, and receive timetable packets.
* **13:00 – 19:00 | OG Team Activities & Games**  
  *Venue:* NBS Ground
* **13:00 – 18:00 | Orientation Scavenger Hunt**  
  *Venue:* NBS Ground (Registration required via [orientation.nust.edu.pk/waitlist](https://orientation.nust.edu.pk/waitlist))
* **14:00 – 19:00 | Clubs & Societies Showcase**  
  *Venue:* Central Grounds  
  *What to expect:* Over 30+ official student bodies (NUST Science Society, GDSC, NUST Dramatics Club, PNEC Racing, etc.) setting up interactive recruitment stalls.
* **18:00 – 21:00 | Drama Night by NDC (NUST Dramatics Club)**  
  *Venue:* Jinnah Auditorium

---

### Day 3: Friday, 4th September 2026 — Life at NUST & Bazm Night

* **10:00 – 12:30 | Life at NUST (Registrar, FAO, & Alumni Talk)**  
  *Venue:* Jinnah Auditorium  
  *What to expect:* Crucial details regarding GPA policies, financial aid, fee installments, and alumni career paths.
* **10:00 – 12:30 | Life at NUST — SEECS Special Session**  
  *Venue:* SCEE Seminar Hall
* **15:30 – 16:30 | Closing Ceremony**  
  *Venue:* Jinnah Auditorium
* **17:00 – 22:00 | Bazm Night / Cultural Evening**  
  *Venue:* SCME Ground  
  *What to expect:* Live musical performances, food stalls, and the traditional send-off into regular classes!

---

### 5 Essential Tips for Freshmen:
1. **Transport:** Metro Orange Line / Red Line feeder buses drop off right at Gate 1 and Gate 2.
2. **Dress Code:** Smart casuals. Comfortable sneakers are mandatory—you'll easily log 8,000+ steps per day walking between blocks.
3. **Food:** Quickest bites near the venues are Concordia 1 (C1) and Central Library Cafe.
4. **Campus Map:** Open the live [NUST Nama Campus Map](/map) on your phone to instantly pinpoint any hall, gate, or cafe.
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
## The Golden Rule: 75% Minimum Attendance

One of the most common pitfalls for freshmen at NUST is taking attendance lightly. Unlike school, **NUST strictly enforces the 75% attendance rule across all undergraduate and postgraduate programs**.

Falling below 75% in any course means you receive an **'F' grade (debarred)** and are prohibited from sitting in the End-Semester Final Examination.

---

### How Many Lectures Can You Safely Miss?

Attendance is counted on a per-course basis, not semester aggregate. Here is the math for a standard 16-week academic semester:

| Course Type | Total Classes (Approx.) | Maximum Allowed Absences (25%) |
| :--- | :--- | :--- |
| **3-Credit Theory (3 hrs/week)** | ~48 lectures | **Max 12 lectures** |
| **2-Credit Theory (2 hrs/week)** | ~32 lectures | **Max 8 lectures** |
| **1-Credit Lab (3 hrs lab/week)** | ~16 lab sessions | **Max 4 lab sessions** |

> **Warning:** Labs have very few total sessions. Missing just 4 labs can result in an instant debarment from the practical exam!

---

### The Medical Leave & Duty Leave Process

If you fall sick or represent NUST in an official competition/conference:

1. **Medical Certificate from NMC:** Any medical slip from outside hospitals must be endorsed by the **NUST Medical Centre (NMC)** on campus.
2. **Submission Deadline:** Submit your leave application along with verified medical slips to your School Coordinator within **7 working days** of returning to campus.
3. **Duty Leave:** If attending a society event or hackathon, ensure the faculty advisor issues an official duty leave letter *prior* to departure.

---

### What to Do If Your Attendance Drops to 74%?

* **Talk to your instructor immediately:** Professors have a brief window before finals to review genuine emergencies.
* **Dean's Discretionary Condonation:** In rare, verified medical cases with hospital stays, the Dean/Commandant can condone attendance down to 65% upon formal petition.
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
                answer: "In absolute grading, fixed mark brackets determine grades (e.g. 85+ is A). In relative grading, your grade depends on your performance compared to the class average (mean) and standard deviation.",
            },
            {
                question: "What CGPA puts you on academic probation at NUST?",
                answer: "An undergraduate student with a CGPA below 2.00 is placed on Academic Probation. Falling on probation for 3 consecutive semesters results in academic dismissal.",
            },
        ],
        content: `
## Understanding Relative vs. Absolute Grading at NUST

At NUST, most engineering, computing, business, and social sciences courses with more than 20 students use **Relative Grading**. Smaller classes (under 20 students) or specific lab practicals may use **Absolute Grading**.

---

### How the Relative Grading Curve Works

Instead of fixing 80% as an 'A', your final grade is calculated based on:
1. **Class Mean ($\mu$):** The average score of all students in the section.
2. **Standard Deviation ($\sigma$):** How widely marks are spread around the average.

* **Grade 'A' (4.00 GPA):** Typically awarded to scores higher than $\mu + 1.5\sigma$.
* **Grade 'B+' (3.50 GPA):** Roughly $\mu + 1.0\sigma$.
* **Grade 'B' (3.00 GPA):** Near $\mu + 0.5\sigma$.
* **Grade 'C' (2.00 GPA):** Around the class average ($\mu$).

> **Key Takeaway:** If an exam was brutally hard and the class average was 45/100, scoring a 65/100 can easily earn you an **A (4.0 GPA)**!

---

### NUST GPA Grading Scale

| Letter Grade | Grade Point (GPA) | Performance Level |
| :--- | :--- | :--- |
| **A** | **4.00** | Exceptional / Outstanding |
| **B+** | **3.50** | Very Good |
| **B** | **3.00** | Good / Above Average |
| **C+** | **2.50** | Satisfactory |
| **C** | **2.00** | Average (Passing) |
| **D** | **1.00** | Bare Pass |
| **F** | **0.00** | Fail (Must Repeat) |

---

### Important Academic Warnings
* **Probation Threshold:** Any semester ending with a **CGPA below 2.00** triggers an official probation warning.
* **Course Repeats:** You can repeat any course where you received a **C+ or below** to improve your grade point.
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
                answer: "Concordia 1 (C1) is located in the central academic zone near NBS/S3H and features fast food, shawarmas, and juices. Concordia 2 (C2) is near the hostels and offers traditional BBQ, karahi, and late-night options.",
            },
            {
                question: "Where can I get the best coffee on campus?",
                answer: "The Central Library Cafe and SADA courtyard cafe serve the highest-rated specialty espresso, iced lattes, and bakery items.",
            },
        ],
        content: `
## The Food Scene at NUST H-12

With over 15,000 students on campus daily, NUST H-12 hosts a diverse culinary ecosystem ranging from 100-rupee chai spots to full-service dining halls and specialty cafes.

Here is the definitive ranking of every major food hub on campus.

---

### 1. Concordia 1 (C1) — The Fast Food Capital
* **Location:** Behind NBS and S3H ([View on Map](/map))
* **Best For:** Quick lunch breaks between classes, fresh juices, crispy chicken burgers, and paratha rolls.
* **Top Picks:**
  * **Chicken Roll Paratha** — Fast, filling, and budget-friendly.
  * **Fresh Seasonal Juices & Shakes** — Mango, Peach, and Mint Lemonade.
  * **Zinger Burger & Fries** — Student comfort classic.

---

### 2. Concordia 2 (C2) — The Evening & Hostel Hub
* **Location:** Beside the Boys' Hostels (Attar / Razi)
* **Best For:** Dinner, late-night tea sessions, BBQ platters, and traditional desi cuisine.
* **Top Picks:**
  * **Chicken Sajji & BBQ Tikka** — Best enjoyed with hostel friends after sundown.
  * **Chicken Karahi with Tandoori Naan** — Freshly prepared in large woks.
  * **Karak Doodh Patti** — The lifeblood of exam night study sessions.

---

### 3. South Edge (C3) & Lake View
* **Location:** South campus near SMME and the NUST Lake
* **Best For:** Scenic outdoor seating by the water, quiet lunches away from main rush.
* **Top Picks:** Club sandwiches, loaded fries, and refreshing iced tea.

---

### 4. Central Library Cafe
* **Location:** Ground Floor, Central Library
* **Best For:** Study fuel, quality coffee, and pastries.
* **Top Picks:** Iced Caramel Macchiato and warm chocolate brownies.

---

### 5. SADA Courtyard Cafe
* **Location:** School of Art, Design and Architecture (SADA)
* **Best For:** Artistic ambiance, pasta, artisanal sandwiches, and aesthetic outdoor benches.
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
