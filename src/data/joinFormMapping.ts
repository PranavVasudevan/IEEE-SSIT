// Entry ID mapping for the IEEE SSIT SSN "Student Chapter Member Application" Google Form.
// Extracted from the form's FB_PUBLIC_LOAD_DATA_ payload. Two fields (proof of SSIT
// membership, prior work samples) are file uploads — Google Forms cannot prefill those,
// so they're left for the applicant to attach after landing on the Google Form.

export const JOIN_FORM_ID = "1FAIpQLSdXfYNUejedJVf6gAMZ3_rWSdSCyXhsGEo7GEgg4uSyD1CRnQ"

export const JOIN_FORM_ENTRIES = {
  name: "entry.1929617468",
  registerNumber: "entry.1621444429",
  email: "entry.1287191891",
  phone: "entry.676191045",
  department: "entry.268159004",
  year: "entry.978141356",
  ieeeMembershipNumber: "entry.1848616198",
  verticalChoice1: "entry.221064841",
  whySuitable1: "entry.1857305650",
  verticalChoice2: "entry.412500552",
  whySuitable2: "entry.928294953",
  verticalChoice3: "entry.772083170",
  whySuitable3: "entry.349939181",
  pastExperience: "entry.1113679423",
  howYouSupport: "entry.1159505781",
} as const

export const DEPARTMENT_OPTIONS = ["BME", "CHEM", "CIVIL", "CSE", "ECE", "EEE", "IT", "MECH", "MTech CSE"]

export const YEAR_OPTIONS = ["1st", "2nd", "3rd", "4th"]

// Google's option text differs slightly per field (Choice 2 uses lowercase "development") —
// preserved exactly as-is so the prefilled value matches the option Google expects.
export const VERTICAL_CHOICE_1_OPTIONS = [
  "Marketing Outreach(PR and Social Media)",
  "Documentation and Newsletter",
  "Design",
  "Event Management",
  "Photography",
  "Web Development",
  "Logistics",
]

export const VERTICAL_CHOICE_2_OPTIONS = [
  "Marketing Outreach(PR and Social Media)",
  "Documentation and Newsletter",
  "Design",
  "Event Management",
  "Photography",
  "Web development",
  "Logistics",
]

export const VERTICAL_CHOICE_3_OPTIONS = [
  "Marketing Outreach(PR and Social Media)",
  "Documentation and Newsletter",
  "Design",
  "Event Management",
  "Photography",
  "Web Development",
  "Logistics",
]

export interface JoinFormValues {
  name: string
  registerNumber: string
  email: string
  phone: string
  department: string
  year: string
  ieeeMembershipNumber: string
  verticalChoice1: string
  whySuitable1: string
  verticalChoice2: string
  whySuitable2: string
  verticalChoice3: string
  whySuitable3: string
  pastExperience: string
  howYouSupport: string
}

export function buildJoinFormPrefillUrl(values: JoinFormValues): string {
  const params = new URLSearchParams({ usp: "pp_url" })
  for (const [key, entry] of Object.entries(JOIN_FORM_ENTRIES)) {
    const value = values[key as keyof JoinFormValues]
    if (value) params.set(entry, value)
  }
  return `https://docs.google.com/forms/d/e/${JOIN_FORM_ID}/viewform?${params.toString()}`
}
