/**
 * The tools the chat agent can call.
 *
 * Schemas and implementations live in the same file on purpose: a tool whose
 * schema and behaviour drift apart is the most common bug in this kind of code.
 *
 * SERVER ONLY. This module builds a service-role Supabase client, which bypasses
 * RLS. Never import it from a client component.
 */

import { createClient } from "@supabase/supabase-js";
import { CAMPUS_PLACES } from "@/lib/campus_places";
import { BLOG_POSTS } from "@/lib/blogs/blogData";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

export const TOOL_SCHEMAS = [
  {
    type: "function",
    function: {
      name: "search_campus_places",
      description:
        "Find locations of buildings, cafes, lounges, schools, gates, sports complex, gym, swimming pool, hostels, ATMs, and landmarks on NUST H-12 campus. Always use this when a student asks 'where is X' or for directions.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Name of place, cafe, school, or landmark (e.g., 'coffee lounge', 'c1', 'seecs', 'swimming pool', 'sada cafe', 'gate 1')",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_campus_knowledge",
      description:
        "Search campus rules, Orientation 2026 schedule, gym/swimming pool registration, attendance policy (75%), GPA calculation, hostel curfew, shuttle routes, and FAQs.",
      parameters: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            description: "Topic to lookup (e.g., 'swimming pool membership', 'orientation schedule', '75 percent attendance', 'how gpa works', 'hostel timing')",
          },
        },
        required: ["topic"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "find_forms",
      description:
        "Find the exact official NUST form a student must fill in (e.g. gym/sports medical fitness, paper rechecking, semester freeze, transcript request, course drop). Call this only when the student needs a specific form.",
      parameters: {
        type: "object",
        properties: { topic: { type: "string" } },
        required: ["topic"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_sections",
      description:
        "Search NUST's official handbooks and policy documents for detailed administrative rules.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search terms in document vocabulary" },
          doc_type: {
            type: "string",
            enum: ["policy", "fee", "scholarship", "prospectus", "form", "campus", "faq"],
            description: "Optional filter",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_events",
      description: "Find upcoming campus events happening soon. Use for questions about events and orientation.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" },
          days_ahead: { type: "integer", description: "Default 14" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_my_rsvps",
      description: "Events the student has RSVP'd to.",
      parameters: { type: "object", properties: {} },
    },
  },
] as const;

// ─── Verified Official NUST Forms Catalog ─────────────────────────────────────
export const VERIFIED_FORMS = [
  {
    keywords: ["gym", "fitness", "swimming", "sports", "pool", "workout"],
    title: "Medical Fitness Certificate for Sports/Gym",
    url: "https://nust.edu.pk/wp-content/uploads/2020/03/Medical-Fitness-Certificate.pdf",
    section_id: "form-gym-medical",
    heading_path: "Sports Complex > Medical Fitness Certificate",
    doc_type: "form",
    content: "Medical Fitness Certificate required for Gym, Swimming Pool, and Sports Complex registration. Must be signed and stamped by a certified medical doctor (or verified at NUST Medical Centre NMC) before paying membership fee.",
  },
  {
    keywords: ["recheck", "re-check", "paper rechecking", "recount", "marks", "exam sheet", "exam paper"],
    title: "Application for Re-Checking of Answer Books/Papers",
    url: "https://nust.edu.pk/wp-content/uploads/2020/03/Paper-Rechecking-Form.pdf",
    section_id: "form-rechecking",
    heading_path: "Exam Branch > Paper Re-Checking Form",
    doc_type: "form",
    content: "Application for Re-Checking of Answer Books/Papers. Fee is Rs. 500 per paper payable via HBL NUST branch challan. Submit along with receipt to your school examination branch within 15 days of result declaration.",
  },
  {
    keywords: ["freeze", "freezing", "freeze semester", "semester freeze", "gap semester", "leave of absence", "gap year", "freeze course"],
    title: "Semester Freeze Application Form",
    url: "https://nust.edu.pk/wp-content/uploads/2020/03/Semester-Freeze-Form.pdf",
    section_id: "form-semester-freeze",
    heading_path: "Academic Branch > Semester Freeze Form",
    doc_type: "form",
    content: "Semester Freeze Application Form. A student can freeze up to 2 semesters during their undergraduate degree. Requires HoD approval and clearance from accounts and library before the 4th week of semester.",
  },
  {
    keywords: ["drop", "add drop", "course drop", "withdraw course", "course withdrawal"],
    title: "Course Add / Drop Form",
    url: "https://nust.edu.pk/wp-content/uploads/2020/03/Course-Add-Drop.pdf",
    section_id: "form-course-drop",
    heading_path: "Academics > Course Add/Drop Form",
    doc_type: "form",
    content: "Course Add/Drop Form. Allows adding or dropping courses within the first 2 weeks of the semester without penalty, or withdrawing with a 'W' grade before the 8th week.",
  },
  {
    keywords: ["transcript", "official transcript", "dmc", "gradesheet", "academic record"],
    title: "Application for Official Transcript",
    url: "https://nust.edu.pk/wp-content/uploads/2020/03/Transcript-Form.pdf",
    section_id: "form-transcript",
    heading_path: "Exam Branch > Official Transcript Form",
    doc_type: "form",
    content: "Application for Official Transcript / Detailed Marks Certificate (DMC). Submit with fee receipt to Main Office Examination Branch.",
  },
  {
    keywords: ["hostel", "hostel clearance", "hostel leaving", "hostel allotment", "hostel admission", "hostel form"],
    title: "Hostel Clearance / Application Form",
    url: "https://nust.edu.pk/wp-content/uploads/2020/03/Hostel-Clearance.pdf",
    section_id: "form-hostel",
    heading_path: "Hostels Branch > Hostel Clearance Form",
    doc_type: "form",
    content: "Hostel Clearance and Allotment Form. Required for room vacation, security refund, and hostel admissions.",
  },
  {
    keywords: ["medical", "sick", "doctor", "medical leave", "nmc"],
    title: "Medical Leave Certificate & Endorsement Form",
    url: "https://nust.edu.pk/wp-content/uploads/2020/03/Medical-Fitness-Certificate.pdf",
    section_id: "form-medical-leave",
    heading_path: "NMC > Medical Leave Form",
    doc_type: "form",
    content: "Medical Certificate for Absence. External hospital certificates must be endorsed by the NUST Medical Centre (NMC) within 7 days of returning to campus.",
  },
];

// ─── Campus Static FAQs & Knowledge ──────────────────────────────────────────
const CAMPUS_KNOWLEDGE_ENTRIES = [
  {
    topic: "swimming pool",
    keywords: ["swimming", "pool", "swim", "swimming pool", "swim timing"],
    title: "NUST Swimming Pool Timings, Fees & Membership",
    content: "The NUST Swimming Pool is located inside the Sports Complex near Gate 1. Features temperature-controlled Olympic-size indoor pool. Separate morning and evening slots for male and female students/faculty. Registration requires: 1. Download Medical Fitness Certificate, 2. Get certified by a doctor (or NMC), 3. Pay seasonal/monthly membership fee at Sports Complex reception.",
  },
  {
    topic: "gym and fitness",
    keywords: ["gym", "gymnasium", "workout", "fitness centre", "gym fee"],
    title: "NUST Gymnasium & Fitness Center",
    content: "The Gymnasium is located inside the NUST Sports Complex (Ground Floor). Equipped with modern cardio and weight training machines. Separate timings for male and female students. Registration requires Medical Fitness Certificate and monthly gym fee.",
  },
  {
    topic: "orientation 2026",
    keywords: ["orientation", "orientation 2026", "freshmen", "schedule", "og", "scavenger hunt", "bazm"],
    title: "NUST Orientation 2026 Schedule & Highlights",
    content: "Orientation 2026 runs from Wednesday, Sep 2 to Friday, Sep 4, 2026. Day 1: Opening Briefing (Jinnah Auditorium), Meet Your OGs (NBS Ground), Batch Photo (Convocation Ground). Day 2: School Receptions, OG Activities, Scavenger Hunt (waitlist at https://orientation.nust.edu.pk/waitlist), NDC Drama Night. Day 3: Life at NUST talk, Closing Ceremony, and Bazm Cultural Night at SCME Ground.",
  },
  {
    topic: "attendance policy",
    keywords: ["attendance", "75", "75 percent", "classes miss", "leave", "debarred"],
    title: "NUST 75% Attendance Policy",
    content: "Students must maintain at least 75% attendance in each course. For a standard 3-credit course (~48 classes), you can miss a maximum of 12 classes. Falling below 75% results in an 'F' grade (debarment from final exams). Medical certificates must be endorsed by NMC within 7 days.",
  },
  {
    topic: "grading and gpa",
    keywords: ["gpa", "grading", "relative grading", "cgpa", "probation", "curve"],
    title: "NUST Relative Grading & GPA System",
    content: "Courses with >20 students follow Relative Grading (calculated using class mean and standard deviation). A CGPA below 2.00 triggers academic probation. Repeating courses with grade C+ or lower is allowed.",
  },
  {
    topic: "campus gates",
    keywords: ["gate", "gate 1", "gate 2", "gate 10", "entry", "metro"],
    title: "NUST H-12 Campus Gates & Entry",
    content: "Gate 1: Main car & visitor entry (facing Kashmir Highway / Metro Orange Line). Gate 10: Motorbike entrance right beside Gate 1. Gate 2: Pedestrian and student vehicle entry (facing G-13). Gate 4: Service gate.",
  },
  {
    topic: "medical centre",
    keywords: ["nmc", "medical", "doctor", "emergency", "hospital", "clinic", "pharmacy"],
    title: "NUST Medical Centre (NMC)",
    content: "NMC is located centrally near the Central Mosque and Hostels. Provides 24/7 emergency medical care, general physicians, ambulance service, and pharmacy for students and hostelites. Medical leaves from outside clinics must be verified here.",
  },
];

/** Search campus places from campus_places.ts */
function searchCampusPlaces(query: string) {
  const q = query.toLowerCase().trim();
  const matched = CAMPUS_PLACES.filter((place) => {
    const nameMatch = place.name.toLowerCase().includes(q);
    const catMatch = place.category.toLowerCase().includes(q);
    const blurbMatch = place.blurb.toLowerCase().includes(q);
    return nameMatch || catMatch || blurbMatch;
  });

  if (matched.length === 0) {
    // Fuzzy split words
    const words = q.split(/\s+/).filter((w) => w.length > 2);
    const fuzzy = CAMPUS_PLACES.filter((place) => {
      const text = `${place.name} ${place.category} ${place.blurb}`.toLowerCase();
      return words.some((w) => text.includes(w));
    });
    return fuzzy.slice(0, 4).map((p) => ({
      name: p.name,
      category: p.category,
      location: p.blurb,
      coordinates: { lat: p.lat, lng: p.lng },
    }));
  }

  return matched.slice(0, 4).map((p) => ({
    name: p.name,
    category: p.category,
    location: p.blurb,
    coordinates: { lat: p.lat, lng: p.lng },
  }));
}

/** Search internal campus knowledge base and blog guides */
function searchCampusKnowledge(topic: string) {
  const q = topic.toLowerCase().trim();
  const results = CAMPUS_KNOWLEDGE_ENTRIES.filter((entry) => {
    return (
      entry.topic.toLowerCase().includes(q) ||
      entry.keywords.some((k) => q.includes(k) || k.includes(q)) ||
      entry.content.toLowerCase().includes(q)
    );
  });

  // Also check blog posts
  const matchedBlogs = BLOG_POSTS.filter((post) => {
    return (
      post.title.toLowerCase().includes(q) ||
      post.description.toLowerCase().includes(q) ||
      post.tags.some((t) => q.includes(t.toLowerCase()))
    );
  }).map((post) => ({
    title: post.title,
    summary: post.description,
    read_more: `/blog/${post.slug}`,
  }));

  return {
    knowledge: results.slice(0, 2),
    related_guides: matchedBlogs.slice(0, 2),
  };
}

/** Find verified NUST official forms */
function findVerifiedForm(topic: string) {
  const q = topic.toLowerCase().trim();
  const words = q.split(/\s+/).filter((w) => w.length > 2);

  // Score each form based on match relevance
  const scored = VERIFIED_FORMS.map((form) => {
    let score = 0;
    const titleLower = form.title.toLowerCase();
    const contentLower = form.content.toLowerCase();

    // Exact full query match
    if (titleLower.includes(q)) score += 20;
    if (q.includes(titleLower)) score += 20;

    // Keyword matches
    for (const kw of form.keywords) {
      if (q === kw || q.includes(kw)) score += 15;
      else if (words.some((w) => w === kw)) score += 10;
      else if (words.some((w) => kw.includes(w) || w.includes(kw))) score += 4;
    }

    // Word occurrences in title & content
    for (const w of words) {
      if (titleLower.includes(w)) score += 5;
      if (contentLower.includes(w)) score += 2;
    }

    return { form, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0 && scored[0].score >= 4) {
    const f = scored[0].form;
    return [
      {
        section_id: f.section_id,
        title: f.title,
        heading_path: f.heading_path,
        url: f.url,
        doc_type: "form",
        content: f.content,
      },
    ];
  }

  return [];
}

type SearchRow = {
  section_id: string;
  heading_path: string;
  content: string;
  url: string | null;
  title: string | null;
  page_start: number | null;
  page_end: number | null;
  published_at: string | null;
  doc_type: string | null;
};

/** Search database documents */
async function searchSections(query: string, docType?: string): Promise<SearchRow[]> {
  try {
    const { data, error } = await db.rpc("search_sections", {
      query_text: query,
      query_embedding: null,
      match_count: 4,
      filter_doc_type: docType ?? null,
    });
    if (error) return [];
    return (data ?? []).map((row: SearchRow & { content: string }) => ({
      section_id: row.section_id,
      heading_path: row.heading_path,
      content: row.content?.slice(0, 1000) ?? "",
      url: row.url,
      title: row.title,
      page_start: row.page_start,
      page_end: row.page_end,
      published_at: row.published_at,
      doc_type: row.doc_type,
    }));
  } catch {
    return [];
  }
}

/**
 * Run one tool safely.
 */
export async function runTool(
  name: string,
  args: Record<string, unknown>,
  userId: string,
): Promise<unknown> {
  switch (name) {
    case "search_campus_places":
      return searchCampusPlaces(String(args.query ?? ""));

    case "search_campus_knowledge":
      return searchCampusKnowledge(String(args.topic ?? ""));

    case "find_forms": {
      const verified = findVerifiedForm(String(args.topic ?? ""));
      if (verified.length > 0) return verified;
      return searchSections(String(args.topic ?? ""), "form");
    }

    case "search_sections":
      return searchSections(String(args.query ?? ""), args.doc_type as string | undefined);

    case "read_section": {
      const { data, error } = await db
        .from("sections")
        .select("id, document_id, ordinal, heading_path, content, page_start, page_end")
        .eq("id", String(args.section_id ?? ""))
        .maybeSingle();
      if (error) return { error: error.message };
      return data ?? { error: "no section with that id" };
    }

    case "search_events": {
      const days = Number(args.days_ahead) > 0 ? Number(args.days_ahead) : 30;
      const now = new Date();
      const until = new Date(now.getTime() + days * 86_400_000);
      const { data, error } = await db
        .from("events")
        .select("id, title, description, start_time, end_time, venue_name, price, registration_url, tags, is_official")
        .eq("status", "approved")
        .gte("start_time", now.toISOString())
        .lte("start_time", until.toISOString())
        .order("start_time", { ascending: true })
        .limit(8);
      if (error) return { error: error.message };
      return data ?? [];
    }

    case "get_my_rsvps": {
      const { data, error } = await db
        .from("rsvps")
        .select("status, guests_count, created_at, events(id, title, start_time, end_time, venue_name)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) return { error: error.message };
      return data ?? [];
    }

    default:
      return { error: `unknown tool: ${name}` };
  }
}
