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
    category: "Admissions" | "Orientation" | "Academics" | "Campus Life" | "Food & Cafes" | "Guides";
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
        bio: "Curating verified campus guides, orientation breakdowns, admissions roadmaps, and student survival resources for NUST H-12.",
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
        slug: "nust-net-entry-test-preparation-guide-syllabus",
        title: "NUST NET Entry Test (2026): Syllabus, Paper Pattern & How to Score 150+ (Complete Guide)",
        headline: "Everything you need to ace the NUST Entry Test (NET): Section-wise syllabus, series breakdown (NET 1–4), recommended books, and time management hacks.",
        description: "Master the NUST Entry Test (NET) 2026. Complete subject-wise breakdown for Engineering, Computing, and Business, 200 MCQ pattern, best prep books (KIPS / OETP), and strategy to score 150+.",
        category: "Admissions",
        tags: ["NET", "Admissions", "EntryTest", "NET2026", "SEECS", "Preparation"],
        keywords: [
            "NUST NET preparation guide",
            "NUST NET syllabus 2026",
            "how to score 150 in NET",
            "NET paper pattern engineering",
            "NUST entry test series 1 2 3 4",
            "NET computing syllabus",
            "best books for NUST NET",
        ],
        publishedAt: "2026-09-01T12:00:00+05:00",
        updatedAt: "2026-09-01T18:00:00+05:00",
        readTime: "7 min read",
        author: BLOG_AUTHORS.team,
        coverImage: "/images/hero_aerial_2.jpg",
        faqs: [
            {
                question: "How many total MCQs are in the NUST NET exam?",
                answer: "The NUST NET consists of 200 MCQs to be solved in 180 minutes (3 hours) on a computer at NUST H-12 Islamabad. There is NO negative marking.",
            },
            {
                question: "What is the subject breakdown for Engineering and Computing NET?",
                answer: "Engineering/Computing NET is 40% Mathematics (80 MCQs), 30% Physics (60 MCQs), 15% Chemistry/Computer Science (30 MCQs), 10% English (20 MCQs), and 5% Intelligence (10 MCQs).",
            },
            {
                question: "Can I take multiple NET series, and which score counts?",
                answer: "Yes, NUST conducts 4 test series (NET-1 to NET-4) throughout the academic year. NUST automatically considers your single highest score when calculating final admission merit.",
            },
        ],
        content: `
The **NUST Entry Test (NET)** is the primary gateway to getting admission into undergraduate programs at NUST. Because the NET accounts for a massive **75% of your total admission aggregate**, scoring above 150 is the golden target for competitive fields like Computer Science, Software Engineering, AI, and Mechanical Engineering.

Here is the definitive roadmap to mastering the NET, based on patterns from recent series.

---

## 📋 NET Paper Pattern & MCQ Distribution

The test is a computer-based exam (CBT) held in NUST's dedicated NET Exam Hall in Sector H-12, Islamabad.

* **Total Questions:** 200 MCQs
* **Total Time:** 180 Minutes (3 Hours)
* **Negative Marking:** **Zero (No Negative Marking)**
* **Calculator:** **Not Allowed** (rough sheets and pens are provided on-site)

### Subject-Wise Breakdown:

| Subject | Engineering Test | Computing Test (ICS / Pre-Med Addl) | Business / Social Sciences |
| :--- | :--- | :--- | :--- |
| **Mathematics** | 80 MCQs (40%) | 80 MCQs (40%) | Quantitative: 80 MCQs (40%) |
| **Physics** | 60 MCQs (30%) | 60 MCQs (30%) | — |
| **Chemistry / CS** | 30 MCQs (15%) | 30 MCQs (15%) | — |
| **English** | 20 MCQs (10%) | 20 MCQs (10%) | 80 MCQs (40%) |
| **Intelligence** | 10 MCQs (5%) | 10 MCQs (5%) | 40 MCQs (20%) |
| **Total** | **200 MCQs** | **200 MCQs** | **200 MCQs** |

---

## 📚 Best Preparation Books & Materials

1. **Punjab Textbook Board (PTB) FSc Textbooks:** Your holy grail. Over 85% of theoretical questions and numerical shortcuts come directly from PTB Physics, Math, and Chemistry textbooks.
2. **KIPS FUNG Series (Prep Book + Practice Book):** Crucial for practicing past NET-style tricky questions and short calculation tricks.
3. **OETP NUST Guide:** Excellent for understanding the exact computer UI and historical question patterns.
4. **Anees Hussain / STEP Past Papers:** Great for timed full-length mock tests during the final 2 weeks before your test date.

---

## ⏱️ The 3-Hour Time Allocation Strategy

With 200 questions in 180 minutes, you have roughly **54 seconds per question**. Never attempt Math first!

* **Round 1 (Minutes 0 – 30):** Tackle **Intelligence (10 Qs)** and **English (20 Qs)**. These are straightforward and bank easy marks quickly.
* **Round 2 (Minutes 30 – 80):** Solve **Physics (60 Qs)** and **Chemistry/CS (30 Qs)**. Prioritize theoretical concept questions first before calculating numericals.
* **Round 3 (Minutes 80 – 165):** Dedicate a full 85 minutes to **Mathematics (80 Qs)**. Use answer-elimination and back-substitution tricks.
* **Round 4 (Minutes 165 – 180):** Review flagged questions and guess any unanswered questions (remember: no negative marking!).

> **Pro Tip:** Formulas for Integration, Conic Sections, Trigonometric identities, Vectors, and Rotational Motion appear in almost every single shift. Memorize standard integral substitutions!
`,
    },
    {
        slug: "nust-aggregate-formula-merit-list-calculator",
        title: "NUST Aggregate Calculator & Merit List Criteria: Step-by-Step Formula (2026)",
        headline: "Calculate your exact NUST admission aggregate: 75/15/10 weightage breakdown, closing merit trends for CS/SE/BBA, and how lists are issued.",
        description: "Official NUST aggregate formula for FSc and A-Level students. Calculate your exact merit percentage using NET (75%), FSc/HSSC (15%), and Matric/O-Levels (10%), with closing merit ranks.",
        category: "Admissions",
        tags: ["Aggregate", "MeritList", "Admissions", "Calculator", "NET"],
        keywords: [
            "NUST aggregate calculator",
            "NUST merit formula",
            "NUST aggregate criteria",
            "NUST closing merits 2026",
            "how to calculate NUST aggregate",
            "NUST A levels aggregate formula",
        ],
        publishedAt: "2026-08-31T14:00:00+05:00",
        updatedAt: "2026-09-01T17:00:00+05:00",
        readTime: "5 min read",
        author: BLOG_AUTHORS.ahmad,
        coverImage: "/images/hero_concert.jpg",
        faqs: [
            {
                question: "What is the official weightage formula for NUST admissions?",
                answer: "For undergraduate engineering and computing: NET = 75%, HSSC / FSc Part 1 (or A-Levels Equivalence) = 15%, and SSC / Matric (or O-Levels Equivalence) = 10%.",
            },
            {
                question: "What aggregate is needed for Computer Science (SEECS)?",
                answer: "Computer Science at SEECS typically closes between an aggregate of 79.5% to 81.5% (approx. Merit Position 1 – 400).",
            },
        ],
        content: `
Securing admission into your dream discipline at NUST depends on your **Aggregate Merit Percentage**. Because NUST heavily prioritizes the entry test, a high NET score can easily compensate for an average FSc or Matric result.

Here is the exact step-by-step formula and historical closing merit targets.

---

## 🧮 The Official NUST Aggregate Formula

NUST computes your aggregate using a **75% – 15% – 10% weighted formula**:

$$\\text{Aggregate (\\%)} = \\left(\\frac{\\text{NET Score}}{200} \\times 75\\right) + \\left(\\frac{\\text{FSc / A-Level Marks}}{\\text{Total}} \\times 15\\right) + \\left(\\frac{\\text{Matric / O-Level Marks}}{\\text{Total}} \\times 10\\right)$$

### Worked Example:
* **NET Score:** 152 / 200 $\\rightarrow (152 / 200) \\times 75 = \\mathbf{57.00\\%}$
* **FSc Part 1:** 440 / 520 $\\rightarrow (440 / 520) \\times 15 = \\mathbf{12.69\\%}$
* **Matric:** 980 / 1100 $\\rightarrow (980 / 1100) \\times 10 = \\mathbf{8.91\\%}$
* **Total Final Aggregate:** $57.00 + 12.69 + 8.91 = \\mathbf{78.60\\%}$

---

## 🎯 Target Aggregates & Closing Merit Estimates

| Discipline & School | Typical Closing Aggregate | Safe Target NET Score |
| :--- | :--- | :--- |
| **BS Computer Science (SEECS)** | **79.5% – 81.5%** | **155+** |
| **BS Software Engineering (SEECS)** | **78.5% – 80.5%** | **152+** |
| **BS Artificial Intelligence (SEECS)** | **78.0% – 80.0%** | **150+** |
| **BS Data Science (SEECS)** | **77.0% – 79.0%** | **148+** |
| **BBA / ACF (NBS)** | **75.0% – 78.0%** | **145+** |
| **BS Mechanical / Electrical (SMME/SEECS)**| **68.0% – 73.0%** | **135+** |
| **BS Civil Engineering (NICE)** | **64.0% – 68.0%** | **125+** |

> **Note for A-Level Students:** For A-Level candidates, IBCC equivalence marks are used for both O-Level (10%) and A-Level (15%). If A-Level results are awaiting, O-Level equivalence carries the combined 25% weightage.
`,
    },
    {
        slug: "nust-fee-structure-scholarships-financial-aid",
        title: "NUST Fee Structure & Scholarships (2026): Tuition, Hostel & Financial Aid Guide",
        headline: "Complete breakdown of NUST tuition fees per semester, one-time admission charges, hostel dues, and how to apply for Need-Based Scholarships.",
        description: "Updated 2026 NUST fee structure across Engineering, Computing, Business, and Architecture. Full guide to NUST Need-Based Financial Aid, HEC scholarships, and fee installment procedures.",
        category: "Admissions",
        tags: ["Fees", "Scholarships", "FinancialAid", "NUST2026", "HostelFees"],
        keywords: [
            "NUST fee structure 2026",
            "NUST tuition fee per semester",
            "NUST need based scholarship",
            "NUST financial aid form",
            "NUST admission fee",
            "NUST fee installments",
        ],
        publishedAt: "2026-08-30T16:00:00+05:00",
        updatedAt: "2026-09-01T16:00:00+05:00",
        readTime: "6 min read",
        author: BLOG_AUTHORS.team,
        coverImage: "/images/hero_aerial_1.jpg",
        faqs: [
            {
                question: "What is the tuition fee per semester for Engineering and CS at NUST?",
                answer: "For Engineering, Computing, and Applied Biosciences programs, tuition is approximately PKR 197,050 per semester for Pakistani national students.",
            },
            {
                question: "Does NUST offer Need-Based Financial Aid and Scholarships?",
                answer: "Yes, NUST provides comprehensive Need-Based Financial Aid (NFA) covering up to 100% of tuition and hostel fees for deserving students, alongside HEC, Ehsaas, and external donor endowments.",
            },
        ],
        content: `
Understanding the total cost of attendance at NUST is essential for prospective students and parents planning their higher education budget.

Here is the verified breakdown of semester tuition, one-time charges, hostel fees, and available financial assistance.

---

## 💳 Semester Tuition Fee Breakdown (2026)

Tuition is charged on a semester basis (two semesters per academic year):

| Discipline / School Category | Semester Tuition Fee | One-Time Admission Fee | Security Deposit (Refundable) |
| :--- | :--- | :--- | :--- |
| **Engineering, Computing & IT (SEECS, SMME, SCME, NICE)** | **PKR 197,050** | PKR 40,000 | PKR 15,000 |
| **Business Studies & Social Sciences (NBS, S3H)** | **PKR 275,400** | PKR 40,000 | PKR 15,000 |
| **Architecture & Industrial Design (SADA)** | **PKR 275,400** | PKR 40,000 | PKR 15,000 |
| **Natural & Applied Biosciences (SNS, ASAB)** | **PKR 197,050** | PKR 40,000 | PKR 15,000 |

---

## 🏠 Hostel & Accommodation Dues (H-12 Campus)

* **Tri-Seater Room (Freshmen Standard):** ~PKR 8,500 – 10,500 per month
* **Bi-Seater Room:** ~PKR 12,000 – 14,000 per month
* **Single Room (Senior / Postgrad):** ~PKR 18,000 – 21,000 per month
* **Hostel Security Deposit (One-time, Refundable):** PKR 15,000
* **Messing Charges:** Billed on actual monthly consumption (~PKR 12,000 – 16,000/month).

---

## 🎓 Scholarships & Financial Assistance at NUST

No deserving student is turned away from NUST due to financial hardship. Over 25% of the student body receives financial aid:

### 1. NUST Need-Based Financial Aid (NFA)
* Covers **25%, 50%, 75%, or 100% of tuition fees**, and can also include hostel/messing support for top-tier need cases.
* **How to apply:** Fill out the financial aid section on the NUST online admission portal during your initial registration.

### 2. Merit Scholarships
* Awarded each semester to the top 3 academic performers in each discipline based on Semester GPA (SGPA).

### 3. Fee Installment Option
* Students facing temporary financial bottlenecks can apply to the Financial Aid Office (FAO) to pay semester tuition in **3 equal monthly installments**.
`,
    },
    {
        slug: "nust-hostel-accommodation-guide-fees-allotment",
        title: "NUST H-12 Hostel Guide: Allotment Rules, Fees, Facilities & Room Life",
        headline: "The ultimate survival guide for living on campus: Hostel allotment priority, curfew timings, mess reviews, laundry, and essentials to pack.",
        description: "Complete guide to NUST H-12 hostels for boys and girls. Learn about allotment priority lists, room categories (Attar, Razi, Fatima, Aisha), curfew rules, and hostel life hacks.",
        category: "Campus Life",
        tags: ["Hostels", "CampusLife", "HostelAllotment", "Freshmen", "H12"],
        keywords: [
            "NUST hostel allotment rules",
            "NUST hostel fee 2026",
            "NUST girls hostels h12",
            "NUST boys hostels h12",
            "NUST hostel curfew timings",
            "hostel life at NUST",
        ],
        publishedAt: "2026-08-29T11:00:00+05:00",
        updatedAt: "2026-09-01T14:00:00+05:00",
        readTime: "5 min read",
        author: BLOG_AUTHORS.ahmad,
        coverImage: "/images/hero_badminton.jpg",
        faqs: [
            {
                question: "Who gets priority for on-campus hostel allotment at NUST?",
                answer: "Allotment is strictly merit and distance-based. Outstation students living furthest from Islamabad/Rawalpindi receive highest priority. Twin cities (ISB/RWP) residents are generally not eligible for on-campus hostels.",
            },
            {
                question: "What is the hostel curfew timing at NUST H-12?",
                answer: "Hostel gates close at 10:00 PM for undergraduate students. Night passes and weekend leaves must be applied for and approved through the online Hostel Portal.",
            },
        ],
        content: `
Living in the on-campus hostels at NUST H-12 is one of the most enriching experiences of university life. From late-night study sessions at Concordia 2 to midnight tea runs and inter-hostel sports tournaments, hostel life builds lifelong friendships.

Here is what every freshman needs to know about hostel allotment, facilities, and campus rules.

---

## 🏢 Hostel Names & Sectors on H-12

NUST hostels are named after historic scholars, scientists, and trailblazers:

### Boys Hostels:
* **Attar, Razi, Ghazali, Beruni, Johar, Liaquat, Sir Syed, and Hajveri.**
* Located on the northern and western perimeter of the campus, within walking distance of Concordia 2 (C2) and the Sports Complex.

### Girls Hostels:
* **Fatima, Aisha, Zainab, Khadija, Amna, and Maryam.**
* Centrally located near the Central Library, NUST Medical Centre (NMC), and Concordia 1 (C1).

---

## 🛏️ Facilities Included in NUST Hostels

* **High-Speed Wi-Fi & LAN:** Fiber-optic connectivity in all rooms and study lounges.
* **Mess & Dining:** 3 hot meals daily with rotating weekly menus (chicken biryani, daal makhni, karahi, eggs, and parathas).
* **Laundry & Ironing:** Central automated washing machines and on-site dhobi services.
* **Recreation Lounges:** Table tennis tables, LED screens, foosball, and daily newspapers.
* **24/7 Security & CCTV:** Biometric entry gates, security guards, and emergency medical shuttle to NMC.

---

## 🧳 What to Pack for Your First Semester

1. **Bedding:** Standard single bed mattress protector, bedsheets, pillow, and a warm blanket/quilt for Islamabad winters.
2. **Electronics:** Power extension strip (surge protected), laptop, ethernet cable, and a small study lamp.
3. **Personal Hygiene:** Towels, bathroom slippers, personal laundry basket, and a padlock for your wardrobe.
4. **Kitchen Items:** Electric kettle, coffee mug, and a reusable water bottle.

> **Rule Reminder:** High-power heating appliances (electric heaters, heavy immersion rods) are strictly prohibited and subject to confiscation and fines.
`,
    },
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
