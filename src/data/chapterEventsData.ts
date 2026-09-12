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
 * Priority 1: Prompt-a-Thon
 * Priority 2: Digital Heist
 */
export const FLAGSHIP_2026_EVENTS: DetailedChapterEvent[] = [
  {
    id: "prompt-a-thon-2026",
    title: "Prompt-a-Thon 2026",
    subtitle: "Generative AI, Prompt Architecture & Ethical Reasoning Challenge",
    category: "Hackathon",
    track: "Generative AI & LLM Systems",
    date: "March 28, 2026",
    time: "9:30 AM – 4:30 PM IST",
    location: "SSN Central Computing Lab / Tech Park",
    mode: "In-Person",
    squadFormat: "Duo (2 Members) or Individual",
    eligibility: "Open to all Engineering & Tech Students",
    prizePool: "Merit Certificates + Cash Awards",
    status: "upcoming",
    featured: true,
    isFlagship: true,
    badge: "FLAGSHIP 2026",
    accentColor: "cyan",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=700&fit=crop&auto=format",
    description: "A fast-paced technical competition testing prompt architecture, chain-of-thought orchestration, model hallucination mitigation, and ethical AI deployment for high-impact social challenges.",
    overview: "Prompt-a-Thon 2026 challenges student developers, AI practitioners, and prompt architects to solve real-world problems using state-of-the-art LLMs. Participants will navigate multi-stage prompt engineering sprints covering structured outputs, agent orchestration, model guardrails, and algorithmic fairness.",
    rounds: [
      {
        name: "Round 1: Prompt Precision & Optimization Sprint",
        desc: "Craft deterministic, low-token prompts to solve intricate reasoning, code translation, and structured data synthesis challenges under strict constraints.",
      },
      {
        name: "Round 2: Adversarial Robustness & Guardrail Defense",
        desc: "Design system prompts and defensive filters capable of resisting prompt injections, jailbreak heuristics, and model hallucinations in critical deployment contexts.",
      },
      {
        name: "Round 3: Autonomous Agent Pipeline Finals",
        desc: "Architect an end-to-end multi-step agent workflow addressing a designated socio-technical challenge with live jury evaluation and demonstration.",
      },
    ],
    rules: [
      "Participants may compete individually or in squads of up to 2 members.",
      "Access to sanctioned LLM sandboxes and APIs will be provided or permitted as designated by organizers.",
      "All prompts, templates, and evaluations must be formulated during the designated sprint hours.",
      "Strict adherence to IEEE Code of Ethics and intellectual integrity is required.",
    ],
    // Replace with official Google Form URL when released (e.g., "https://forms.gle/...")
    registerUrl: "",
  },
  {
    id: "digital-heist-2026",
    title: "Digital Heist",
    subtitle: "Cyber Investigation, Cryptography & Socio-Technical Escape Quest",
    category: "Cyber Quest",
    track: "Cybersecurity & Digital Forensics",
    date: "April 04, 2026",
    time: "10:00 AM – 5:00 PM IST",
    location: "SSN Central Seminar Hall & Networking Labs",
    mode: "In-Person",
    squadFormat: "Squad of 2–3 Members",
    eligibility: "Open to all Engineering & Tech Students",
    prizePool: "Cash Prizes + Winner Laurels",
    status: "upcoming",
    featured: true,
    isFlagship: true,
    badge: "FLAGSHIP 2026",
    accentColor: "amber",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=700&fit=crop&auto=format",
    description: "An immersive multi-level cybersecurity challenge and digital escape room where teams decrypt intercepted transmissions, uncover digital breadcrumbs, and defuse simulated infrastructure breaches.",
    overview: "Digital Heist blends Capture-The-Flag mechanics with an interactive story-driven digital crime scene investigation. Teams act as cyber forensic investigators dissecting packet captures, reverse-engineering covert scripts, identifying social engineering vectors, and securing compromised endpoints.",
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
      "Teams must consist of 2 to 3 members.",
      "Attacking organizers' infrastructure or external systems outside the isolated CTF subnet results in immediate disqualification.",
      "Tools such as Wireshark, CyberChef, Ghidra, and Python scripting are fully permitted.",
      "Decisions made by the technical evaluation panel are final.",
    ],
    // Replace with official Google Form URL when released (e.g., "https://forms.gle/...")
    registerUrl: "",
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
