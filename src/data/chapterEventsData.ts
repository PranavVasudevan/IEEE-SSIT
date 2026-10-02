// IEEE SSIT SSN Chapter Events Configuration & Flagship 2026 Registry
// Update registration URLs here when official Google Forms / Unstop links are published.

export interface EventRound {
  name: string
  desc: string
}

export interface DetailedChapterEvent {
  id: string
  title: string
  subtitle?: string
  category: "Hackathon" | "Symposium" | "Workshop" | "Cyber Quest" | "Chapter Event" | "Other"
  track?: string
  date: string
  time?: string
  location: string
  mode: "In-Person" | "Online" | "Hybrid"
  squadFormat?: string
  eligibility?: string
  prizePool?: string
  status: "upcoming" | "ongoing" | "completed"
  featured?: boolean
  badge?: string
  accentColor: "cyan" | "amber" | "emerald" | "purple"
  description: string
  overview?: string
  rounds?: EventRound[]
  rules?: string[]
  speaker?: string
  speakerRole?: string
  image?: string
  registerUrl?: string
  externalUrl?: string
  rulebookUrl?: string
  registrationStatus?: "OPEN" | "CLOSED" | "COMING_SOON" | "CONCLUDED"
  registrationFees?: {
    ieee?: string
    nonIeee?: string
  }
  registrationRule?: string
  contacts?: Array<{
    name: string
    phone: string
  }>
  isFlagship?: boolean
}

/**
 * Validates registration URLs to prevent broken Firebase Dynamic Links or placeholders
 */
export function isValidRegistrationUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false
  const trimmed = url.trim().toLowerCase()
  if (
    !trimmed ||
    trimmed === "#" ||
    trimmed === "/" ||
    trimmed === "null" ||
    trimmed === "undefined"
  ) {
    return false
  }

  // Detect and reject known placeholder / invalid mock URLs
  if (
    trimmed.includes("ssnieee-ai-ethics-2025") ||
    trimmed.includes("ssn-istas-paper-sprint") ||
    trimmed.includes("envision-2025-ssn") ||
    trimmed.includes("example.com") ||
    trimmed.includes("placeholder") ||
    trimmed.includes("fake") ||
    trimmed.includes("test.com")
  ) {
    return false
  }

  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

/**
 * Flagship 2026 Main Events for IEEE SSIT SSN Student Branch Chapter
 * Priority 1: DIGITAL HEIST (Upcoming — Registration Open)
 * Priority 2: Prompt-a-Thon 2026 (Completed — Concluded Archive)
 */
export const FLAGSHIP_2026_EVENTS: DetailedChapterEvent[] = [
  {
    id: "digital-heist-2026",
    title: "DIGITAL HEIST",
    subtitle: "Cyber Investigation, Cryptography & Socio-Technical Escape Quest",
    category: "Cyber Quest",
    track: "Cybersecurity & Digital Forensics",
    date: "8 October 2026",
    time: "12:00 PM – 2:30 PM",
    location: "Mini Auditorium, SSN College of Engineering",
    mode: "In-Person",
    squadFormat: "Individual Registration (Form a Team)",
    eligibility: "Open to all Engineering & Tech Students",
    prizePool: "₹2000+",
    status: "upcoming",
    featured: true,
    isFlagship: true,
    badge: "REGISTRATION OPEN",
    accentColor: "amber",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=700&fit=crop&auto=format",
    description: "🚨 THE HEIST IS ON! 🕵️‍♂️💰\n\nIEEE SSIT Student Branch, SSN College of Engineering presents DIGITAL HEIST 🔐\n\nThink you’ve got what it takes to crack the case, outsmart the competition, and pull off the perfect digital heist?\n\nGather your crew, sharpen your skills, and get ready for a day of mystery, strategy, and chaos. 🕵️‍♀️💻\n\nWill you crack the heist… or get caught? 🔴",
    overview: "Digital Heist blends Capture-The-Flag mechanics with an interactive story-driven digital crime scene investigation. Teams act as cyber forensic investigators dissecting packet captures, reverse-engineering covert scripts, identifying social engineering vectors, and securing compromised endpoints. Will you crack the heist… or get caught?",
    rounds: [
      {
        name: "Level 1: The Breach — Network Recon & Log Forensics",
        desc: "Analyze intercepted PCAP logs, uncover stealthy exfiltration channels, and identify the attacker's initial ingress vector.",
      },
      {
        name: "Level 2: The Vault — Cryptanalysis & Steganography",
        desc: "Decrypt fragmented ciphertexts, reverse-engineer obfuscated payloads, and extract hidden credentials from multi-layer media.",
      },
      {
        name: "Level 3: The Lockdown — Incident Containment & Exploit Mitigation",
        desc: "Race against the countdown to deploy defensive patches, isolate infected subnets, and neutralize the threat vector.",
      },
    ],
    rules: [
      "Registration is strictly individual. Each participant must fill out the registration form separately to form a team.",
      "Registration Fees: IEEE Members: ₹75 | Non-IEEE Members: ₹100.",
      "Cash Prize: ₹2000+ for the top performing teams.",
      "Date: 8 October 2026 | Time: 12:00 PM – 2:30 PM.",
      "Venue: Mini Auditorium, SSN College of Engineering.",
      "Tools such as Wireshark, CyberChef, Ghidra, and Python scripting are fully permitted.",
      "Attacking organizers' infrastructure or external systems outside the isolated CTF subnet results in immediate disqualification.",
      "Contacts: Yuva Sriram (+91 75987 74597) | Mohammed Afzal (+91 93618 38615).",
      "Decisions made by the technical evaluation panel are final.",
    ],
    registerUrl: "https://docs.google.com/forms/d/e/1FAIpQLScPO6DdtWuVManOljeBdz6JL5YQDsq_pkFO0nn_jy7rr6oJWg/viewform",
    rulebookUrl: "https://drive.google.com/file/d/1iJ4_4zyu6ahRXmDom4z5YP3xq95LBra9/view",
    registrationStatus: "OPEN",
    registrationFees: {
      ieee: "₹75",
      nonIeee: "₹100",
    },
    registrationRule: "Registration is strictly individual. Each participant must fill out the registration form separately to form a team.",
    contacts: [
      { name: "Yuva Sriram", phone: "+91 75987 74597" },
      { name: "Mohammed Afzal", phone: "+91 93618 38615" },
    ],
  },
  {
    id: "prompt-a-thon-2026",
    title: "PROMPT-A-THON",
    subtitle: "Every prompt has an attitude. What's yours?",
    category: "Hackathon",
    track: "IEEE SSIT SSNCE",
    date: "22 September 2026",
    time: "12 noon to 3:30 PM",
    location: "ECE Seminar Hall",
    mode: "In-Person",
    squadFormat: "2 – 3 members (Strictly Individual Registration)",
    eligibility: "Open to all Engineering & Tech Students (OD will be provided for SSN Students)",
    prizePool: "1st: ₹1200 | 2nd: ₹1000",
    status: "completed",
    featured: false,
    isFlagship: true,
    badge: "CONCLUDED",
    accentColor: "cyan",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=700&fit=crop&auto=format",
    description: "Every prompt has an attitude. What's yours?\n\nThink beyond the obvious and compete in SSIT's most creative flagship event. From decoding pop culture and crafting AI prompts to solving chaotic college life challenges, every round pushes your creativity, speed, and teamwork to the limit.\n\nGet your squad ready. The prompts are waiting.\n\n// think // prompt // build // together",
    overview: "Think beyond the obvious and compete in SSIT's most creative flagship event. From decoding pop culture and crafting AI prompts to solving chaotic college life challenges, every round pushes your creativity, speed, and teamwork to the limit.\n\nOD will be provided for SSN Students.\n\n// think // prompt // build // together",
    rounds: [
      {
        name: "Round 1: Pop Culture Decoding & AI Prompt Sprint",
        desc: "Decode pop-culture scenarios and craft structured prompts under rapid countdown constraints.",
      },
      {
        name: "Round 2: College Life Chaos Challenge",
        desc: "Tackle chaotic campus scenarios with intelligent LLM workflows, guardrails, and deterministic outputs.",
      },
      {
        name: "Round 3: Grand Prompt Finals",
        desc: "Pitch and benchmark final prompt solutions before the evaluation jury.",
      },
    ],
    rules: [
      "Team Size: 2 – 3 members.",
      "Registration is strictly individual. Each participant must fill out the registration form separately to form a team.",
      "Registration Fees: IEEE members: ₹100 | NON-IEEE members: ₹125.",
      "Cash Prizes: 1st Place: ₹1200 | 2nd Place: ₹1000.",
      "Date: 22 September 2026 | Time: 12 noon to 3:30 PM.",
      "Venue: ECE Seminar Hall.",
      "OD will be provided for SSN Students.",
      "Point of Contact (POC): Smrithi (+91 80568 42307).",
      "// think // prompt // build // together",
    ],
    registerUrl: "https://forms.gle/pvZ27JAt5JpAzB1j9",
    rulebookUrl: "https://drive.google.com/file/d/1o-kGEw-Ur1CM0CJsu_T82Ux1xsXaeST7/view?usp=sharing",
    registrationStatus: "CONCLUDED",
    registrationFees: {
      ieee: "₹100",
      nonIeee: "₹125",
    },
    registrationRule: "Registration is strictly individual. Each participant must fill out the registration form separately to form a team. OD will be provided for SSN Students.",
    contacts: [
      { name: "Smrithi", phone: "+91 80568 42307" },
    ],
  },
]

/**
 * Supplementary Chapter & Archive Events
 */
export const ARCHIVE_AND_SYMPOSIA_EVENTS: DetailedChapterEvent[] = [
  {
    id: "ai-ethics-healthcare-2025",
    title: "AI Ethics & Algorithmic Bias in Healthcare Systems",
    subtitle: "Hands-on Technical Workshop on Clinical Machine Learning Fairness",
    category: "Workshop",
    track: "Ethics & Healthcare AI",
    date: "March 15, 2025",
    time: "2:00 PM – 4:30 PM",
    location: "SSN Central Auditorium / Hybrid",
    mode: "Hybrid",
    squadFormat: "Individual Attendance",
    status: "completed",
    featured: false,
    accentColor: "cyan",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop&auto=format",
    description: "An interactive hands-on workshop examining algorithmic transparency, bias mitigation in diagnostic models, and the ethical responsibility of engineers deploying AI in critical healthcare infrastructure.",
    overview: "This session explored algorithmic fairness metrics, dataset demographic parity, and clinical explainability standards (XAI) for diagnostic neural networks.",
    speaker: "Dr. K. Swaminathan",
    speakerRole: "IIT Madras AI Ethics Lab Lead",
    registerUrl: "", // Archived, no fake form link
  },
  {
    id: "envision-2025",
    title: "Envision 2025: Tech for Humanity National Hackathon",
    subtitle: "36-Hour Hackathon on Sustainable Energy & Assistive Tech",
    category: "Hackathon",
    track: "Sustainable Technology & Assistive Systems",
    date: "April 11–12, 2025",
    time: "36-Hour Hackathon",
    location: "SSN Innovation & Incubation Centre",
    mode: "In-Person",
    squadFormat: "Team of 3–4 Members",
    prizePool: "Cash Prizes worth 1.5 Lakhs",
    status: "completed",
    featured: false,
    accentColor: "emerald",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop&auto=format",
    description: "Annual national level hackathon focused on sustainable energy solutions, assistive technologies for disabilities, and reducing the rural digital divide.",
    overview: "Over 120 teams from across South India converged at SSN CE to build hardware and software solutions addressing UN Sustainable Development Goals.",
    speaker: "IEEE SSIT Madras Section Mentors",
    speakerRole: "Industry Advisory Committee",
    registerUrl: "", // Concluded, no broken link
  },
  {
    id: "digital-inclusion-rural-2025",
    title: "Universal Digital Inclusion: Bridging Rural Connectivity",
    subtitle: "Distinguished Panel on Low-Power Satellite Terminals & Community Meshes",
    category: "Chapter Event",
    track: "Socio-Technical Systems",
    date: "January 24, 2025",
    time: "3:30 PM – 5:00 PM",
    location: "Mini Auditorium, SSN CE",
    mode: "In-Person",
    squadFormat: "Open Student Delegation",
    status: "completed",
    featured: false,
    accentColor: "purple",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop&auto=format",
    description: "Distinguished panel discussion exploring mesh networking, low-power satellite terminals, and educational access in underserved rural communities across Tamil Nadu.",
    overview: "Panelists discussed field trials of Wi-Fi 6 mesh extensions in rural Kanchipuram school clusters and policy recommendations for spectrum allocation.",
    speaker: "Prof. S. Ramanathan & Panel",
    speakerRole: "Senior Members, IEEE",
    registerUrl: "", // Concluded
  },
  {
    id: "istas-preview-sprint-2025",
    title: "IEEE ISTAS Chapter Preview & Paper Writing Sprint",
    subtitle: "Mentorship Sprint for International Symposium Submissions",
    category: "Symposium",
    track: "Academic Research & Publications",
    date: "May 2, 2025",
    time: "10:00 AM – 1:00 PM",
    location: "ECE Seminar Hall, SSN",
    mode: "In-Person",
    squadFormat: "Individual or Research Pairs",
    status: "completed",
    featured: false,
    accentColor: "cyan",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop&auto=format",
    description: "Mentorship sprint guiding student researchers to prepare, format, and submit conference papers for IEEE International Symposium on Technology and Society (ISTAS).",
    overview: "Faculty advisors provided step-by-step guidance on IEEE conference formatting, literature synthesis, and empirical methodology validation.",
    registerUrl: "", // Concluded, no broken dynamic link
  },
]

/**
 * Combines all chapter events, ensuring 2026 Flagship events (Prompt-a-Thon and Digital Heist)
 * take precedence and appear prominently first.
 */
export function getAllStructuredEvents(): DetailedChapterEvent[] {
  return [...FLAGSHIP_2026_EVENTS, ...ARCHIVE_AND_SYMPOSIA_EVENTS]
}
