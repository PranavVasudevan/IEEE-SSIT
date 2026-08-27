import { useState, useEffect } from "react"
import { DEFAULT_ADMIN_EMAILS, normalizeEmail, isOfficialSSNEmail } from "./adminConfig"
import {
  teamApi,
  eventsApi,
  galleryApi,
  announcementsApi,
  contactApi,
  membershipApi,
  newsletterApi,
  settingsApi,
  adminsApi,
  activityLogsApi,
  type TeamMember,
  type ChapterEvent,
  type GalleryPhoto,
  type Announcement,
  type ContactSubmission,
  type SubmissionStatus,
  type NewsletterSubscriber,
  type ChapterInfoData,
  type MembershipContentData,
  type FAQItem,
  type AdminRecord,
  type ActivityLog,
} from "@/api"

export type {
  TeamMember,
  ChapterEvent,
  GalleryPhoto,
  Announcement,
  ContactSubmission,
  SubmissionStatus,
  NewsletterSubscriber,
  ChapterInfoData,
  MembershipContentData,
  FAQItem,
  AdminRecord,
  ActivityLog,
}

// =========================================================================
// 1. ADMIN ALLOWLIST MANAGEMENT & METADATA
// =========================================================================

export async function getAdminAllowlist(): Promise<string[]> {
  try {
    const list = await adminsApi.getAll()
    const emails = list.map((a) => normalizeEmail(a.email))
    return Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...emails]))
  } catch (err) {
    console.warn("Could not fetch admins from API, using default list:", err)
    return DEFAULT_ADMIN_EMAILS
  }
}

export async function getAdminRecords(): Promise<AdminRecord[]> {
  try {
    const list = await adminsApi.getAll()
    return list.map((a) => ({
      email: normalizeEmail(a.email),
      addedBy: a.added_by || a.addedBy || "Core System Config",
      addedAt: a.addedAt || "2026-01-01",
      active: a.active,
    }))
  } catch {
    return DEFAULT_ADMIN_EMAILS.map((email) => ({
      email,
      addedBy: "Core System Config",
      addedAt: "2026-01-01",
      active: true,
    }))
  }
}

export async function isEmailAllowlisted(email?: string | null): Promise<boolean> {
  const cleanEmail = normalizeEmail(email)
  if (!cleanEmail || !isOfficialSSNEmail(cleanEmail)) {
    return false
  }

  if (DEFAULT_ADMIN_EMAILS.includes(cleanEmail)) {
    return true
  }

  const list = await getAdminAllowlist()
  return list.includes(cleanEmail)
}

export async function addAdminEmail(email: string, _addedByEmail = "System Lead"): Promise<boolean> {
  const clean = normalizeEmail(email)
  if (!isOfficialSSNEmail(clean)) return false

  try {
    await adminsApi.add(clean)
    window.dispatchEvent(new Event("allowlist_changed"))
    window.dispatchEvent(new Event("activity_changed"))
    return true
  } catch (err) {
    console.error("Failed to add admin via API:", err)
    throw err
  }
}

export async function removeAdminEmail(emailToRemove: string): Promise<boolean> {
  const clean = normalizeEmail(emailToRemove)
  try {
    await adminsApi.remove(clean)
    window.dispatchEvent(new Event("allowlist_changed"))
    window.dispatchEvent(new Event("activity_changed"))
    return true
  } catch (err) {
    console.error("Failed to remove admin via API:", err)
    throw err
  }
}

export async function updateAdminAllowlist(emails: string[]): Promise<boolean> {
  for (const email of emails) {
    if (isOfficialSSNEmail(email)) {
      try {
        await adminsApi.add(email)
      } catch {}
    }
  }
  window.dispatchEvent(new Event("allowlist_changed"))
  return true
}

export function useAdminAllowlist() {
  const [emails, setEmails] = useState<string[]>(DEFAULT_ADMIN_EMAILS)
  const [records, setRecords] = useState<AdminRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const recs = await getAdminRecords()
        if (isMounted) {
          setRecords(recs)
          setEmails(recs.map((r) => r.email))
          setLoading(false)
        }
      } catch {
        if (isMounted) {
          setEmails(DEFAULT_ADMIN_EMAILS)
          setLoading(false)
        }
      }
    }

    load()
    const handler = () => load()
    window.addEventListener("allowlist_changed", handler)
    return () => {
      isMounted = false
      window.removeEventListener("allowlist_changed", handler)
    }
  }, [])

  return {
    emails,
    records,
    loading,
    addAdmin: addAdminEmail,
    removeAdmin: removeAdminEmail,
    updateAllowlist: updateAdminAllowlist,
  }
}

// =========================================================================
// 2. ACTIVITY LOGGING SYSTEM
// =========================================================================

export async function logAdminActivity(
  action: string,
  category: ActivityLog["category"],
  targetTitle?: string,
  details?: string
): Promise<string> {
  window.dispatchEvent(new Event("activity_changed"))
  return `act-${Date.now()}`
}

export function useActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchLogs = async () => {
      try {
        const data = await activityLogsApi.getAll(50)
        if (isMounted) {
          const mapped = data.map((d) => ({
            id: d.id,
            action: d.action,
            category: d.category as any,
            targetTitle: d.target_title || d.targetTitle,
            adminEmail: d.admin_email || d.adminEmail,
            timestamp: d.timestamp_str || d.timestamp || d.created_at || "",
            details: d.details,
          }))
          setLogs(mapped)
          setLoading(false)
        }
      } catch (err) {
        console.warn("Could not fetch activity logs:", err)
        if (isMounted) setLoading(false)
      }
    }

    fetchLogs()
    const handler = () => fetchLogs()
    window.addEventListener("activity_changed", handler)
    return () => {
      isMounted = false
      window.removeEventListener("activity_changed", handler)
    }
  }, [])

  return { logs, loading }
}

// =========================================================================
// 3. EVENTS DATA & ADVANCED CMS HOOKS
// =========================================================================

export function useEvents() {
  const [events, setEvents] = useState<ChapterEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchEvents = async () => {
      try {
        const list = await eventsApi.getAll()
        if (isMounted) {
          const normalized = list.map((e) => ({
            ...e,
            startTime: e.start_time || e.startTime,
            endTime: e.end_time || e.endTime,
            registerUrl: e.register_url || e.registerUrl,
            externalUrl: e.external_url || e.externalUrl,
            speakerRole: e.speaker_role || e.speakerRole,
          }))
          setEvents(normalized)
          setLoading(false)
        }
      } catch (err) {
        console.warn("Failed to load events from FastAPI:", err)
        if (isMounted) setLoading(false)
      }
    }

    fetchEvents()
    const handler = () => fetchEvents()
    window.addEventListener("events_changed", handler)
    return () => {
      isMounted = false
      window.removeEventListener("events_changed", handler)
    }
  }, [])

  return { events, loading }
}

export async function saveEvent(eventData: Omit<ChapterEvent, "id"> & { id?: string }): Promise<string> {
  const payload = {
    ...eventData,
    start_time: eventData.startTime || eventData.start_time,
    end_time: eventData.endTime || eventData.end_time,
    register_url: eventData.registerUrl || eventData.register_url,
    external_url: eventData.externalUrl || eventData.external_url,
    speaker_role: eventData.speakerRole || eventData.speaker_role,
  }

  let res: ChapterEvent
  if (eventData.id && !eventData.id.startsWith("new-")) {
    res = await eventsApi.update(eventData.id, payload)
  } else {
    res = await eventsApi.create(payload)
  }
  window.dispatchEvent(new Event("events_changed"))
  window.dispatchEvent(new Event("activity_changed"))
  return res.id
}

export async function deleteEvent(id: string): Promise<boolean> {
  await eventsApi.delete(id)
  window.dispatchEvent(new Event("events_changed"))
  window.dispatchEvent(new Event("activity_changed"))
  return true
}

export async function duplicateEvent(id: string): Promise<string> {
  const cloned = await eventsApi.duplicate(id)
  window.dispatchEvent(new Event("events_changed"))
  window.dispatchEvent(new Event("activity_changed"))
  return cloned.id
}

// =========================================================================
// 4. GALLERY DATA & HOOKS
// =========================================================================

export function useGallery() {
  const [gallery, setGallery] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchGallery = async () => {
      try {
        const list = await galleryApi.getAll()
        if (isMounted) {
          const normalized = list.map((g) => ({
            ...g,
            eventName: g.event_name || g.eventName,
          }))
          setGallery(normalized)
          setLoading(false)
        }
      } catch (err) {
        console.warn("Failed to load gallery from FastAPI:", err)
        if (isMounted) setLoading(false)
      }
    }

    fetchGallery()
    const handler = () => fetchGallery()
    window.addEventListener("gallery_changed", handler)
    return () => {
      isMounted = false
      window.removeEventListener("gallery_changed", handler)
    }
  }, [])

  return { gallery, loading }
}

export async function saveGalleryPhoto(photo: Omit<GalleryPhoto, "id"> & { id?: string }): Promise<string> {
  const payload = {
    ...photo,
    event_name: photo.eventName || photo.event_name,
  }

  let res: GalleryPhoto
  if (photo.id && !photo.id.startsWith("new-")) {
    res = await galleryApi.update(photo.id, payload)
  } else {
    res = await galleryApi.create(payload)
  }
  window.dispatchEvent(new Event("gallery_changed"))
  window.dispatchEvent(new Event("activity_changed"))
  return res.id
}

export async function deleteGalleryPhoto(id: string): Promise<boolean> {
  await galleryApi.delete(id)
  window.dispatchEvent(new Event("gallery_changed"))
  window.dispatchEvent(new Event("activity_changed"))
  return true
}

// =========================================================================
// 5. TEAM DIRECTORY CMS
// =========================================================================

export function useTeam() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchTeam = async () => {
      try {
        const list = await teamApi.getAll()
        if (isMounted) {
          const normalized = list.map((m) => ({
            ...m,
            teamType: (m.team_type || m.teamType || "Office Bearers") as any,
          }))
          setTeam(normalized)
          setLoading(false)
        }
      } catch (err) {
        console.warn("Failed to fetch team from FastAPI:", err)
        if (isMounted) setLoading(false)
      }
    }

    fetchTeam()
    const handler = () => fetchTeam()
    window.addEventListener("team_changed", handler)
    return () => {
      isMounted = false
      window.removeEventListener("team_changed", handler)
    }
  }, [])

  return { team, loading }
}

export async function saveTeamMember(member: Omit<TeamMember, "id"> & { id?: string }): Promise<string> {
  const payload = {
    ...member,
    team_type: member.teamType || member.team_type || "Office Bearers",
  }

  let res: TeamMember
  if (member.id && !member.id.startsWith("new-")) {
    res = await teamApi.update(member.id, payload)
  } else {
    res = await teamApi.create(payload)
  }
  window.dispatchEvent(new Event("team_changed"))
  window.dispatchEvent(new Event("activity_changed"))
  return res.id
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  await teamApi.delete(id)
  window.dispatchEvent(new Event("team_changed"))
  window.dispatchEvent(new Event("activity_changed"))
  return true
}

// =========================================================================
// 6. ANNOUNCEMENTS & ALERT BANNER CMS
// =========================================================================

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchAnnouncements = async () => {
      try {
        const list = await announcementsApi.getAll()
        if (isMounted) {
          const normalized = list.map((a) => ({
            ...a,
            ctaText: a.cta_text || a.ctaText,
            ctaUrl: a.cta_url || a.ctaUrl,
            startDate: a.start_date || a.startDate,
            expiryDate: a.expiry_date || a.expiryDate,
          }))
          setAnnouncements(normalized)
          setLoading(false)
        }
      } catch (err) {
        console.warn("Failed to load announcements from FastAPI:", err)
        if (isMounted) setLoading(false)
      }
    }

    fetchAnnouncements()
    const handler = () => fetchAnnouncements()
    window.addEventListener("announcements_changed", handler)
    return () => {
      isMounted = false
      window.removeEventListener("announcements_changed", handler)
    }
  }, [])

  return { announcements, loading }
}

export async function saveAnnouncement(ann: Omit<Announcement, "id" | "createdAt"> & { id?: string }): Promise<string> {
  const payload = {
    ...ann,
    cta_text: ann.ctaText || ann.cta_text,
    cta_url: ann.ctaUrl || ann.cta_url,
    start_date: ann.startDate || ann.start_date,
    expiry_date: ann.expiryDate || ann.expiry_date,
  }

  let res: Announcement
  if (ann.id && !ann.id.startsWith("new-")) {
    res = await announcementsApi.update(ann.id, payload)
  } else {
    res = await announcementsApi.create(payload)
  }
  window.dispatchEvent(new Event("announcements_changed"))
  window.dispatchEvent(new Event("activity_changed"))
  return res.id
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  await announcementsApi.delete(id)
  window.dispatchEvent(new Event("announcements_changed"))
  window.dispatchEvent(new Event("activity_changed"))
  return true
}

// =========================================================================
// 7. INQUIRIES & MEMBERSHIP APPLICATIONS INBOX
// =========================================================================

export function useContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchSubmissions = async () => {
      try {
        const list = await contactApi.getInquiries()
        if (isMounted) {
          const normalized = list.map((s) => ({
            ...s,
            type: (s.inquiry_type || s.type || "general") as any,
            timestamp: s.created_at || s.timestamp || "",
          }))
          setSubmissions(normalized)
          setLoading(false)
        }
      } catch (err) {
        console.warn("Could not fetch submissions from FastAPI:", err)
        if (isMounted) setLoading(false)
      }
    }

    fetchSubmissions()
    const handler = () => fetchSubmissions()
    window.addEventListener("inquiries_changed", handler)
    return () => {
      isMounted = false
      window.removeEventListener("inquiries_changed", handler)
    }
  }, [])

  return { submissions, loading }
}

export async function submitContactInquiry(data: Omit<ContactSubmission, "id" | "status" | "timestamp">) {
  const payload = {
    ...data,
    type: data.type || data.inquiry_type || "general",
  }
  const res = await contactApi.submit(payload)
  window.dispatchEvent(new Event("inquiries_changed"))
  return res.id
}

export async function updateSubmissionStatus(id: string, status: SubmissionStatus) {
  await contactApi.updateStatus(id, status)
  window.dispatchEvent(new Event("inquiries_changed"))
  window.dispatchEvent(new Event("activity_changed"))
  return true
}

export async function deleteSubmission(id: string) {
  await contactApi.delete(id)
  window.dispatchEvent(new Event("inquiries_changed"))
  window.dispatchEvent(new Event("activity_changed"))
  return true
}

// =========================================================================
// 7.5 NEWSLETTER SUBSCRIBERS
// =========================================================================

export function useNewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchSubs = async () => {
      try {
        const list = await newsletterApi.getAll()
        if (isMounted) {
          setSubscribers(list.map((s) => ({ ...s, timestamp: s.created_at || s.timestamp || "" })))
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) setLoading(false)
      }
    }

    fetchSubs()
    const handler = () => fetchSubs()
    window.addEventListener("newsletter_changed", handler)
    return () => {
      isMounted = false
      window.removeEventListener("newsletter_changed", handler)
    }
  }, [])

  return { subscribers, loading }
}

export async function subscribeToNewsletter(email: string): Promise<"ok" | "duplicate"> {
  try {
    await newsletterApi.subscribe(email)
    window.dispatchEvent(new Event("newsletter_changed"))
    return "ok"
  } catch (err) {
    return "duplicate"
  }
}

export async function deleteNewsletterSubscriber(id: string) {
  await newsletterApi.delete(id)
  window.dispatchEvent(new Event("newsletter_changed"))
  return true
}

// =========================================================================
// 8. CHAPTER INFO & ABOUT CONTENT CMS
// =========================================================================

export const DEFAULT_CHAPTER_INFO: ChapterInfoData = {
  chapterName: "IEEE Society on Social Implications of Technology — SSN Student Branch Chapter",
  tagline: "Technology and human responsibility for a sustainable and equitable world.",
  mission: "To advance the understanding of the social and ethical implications of technology among student engineers, researchers, and society at large through open discourse, rigorous research, and human-centric engineering.",
  vision: "A world where emerging technologies are ethically developed, universally accessible, and actively deployed to solve pressing social, environmental, and humanitarian challenges.",
  corePhilosophy: "SSIT's core philosophy has become the inspirational tag-line for the IEEE organization as a whole: 'Advancing Technology for Humanity'.",
  keyTenets: [
    "Technology is a fundamental resource for human development.",
    "Technology has intended and unintended consequences that must be anticipated.",
    "Technology can and must be harnessed for the good of humanity and the planet.",
  ],
  officialEmail: "ieeessitsb@ssn.edu.in",
  location: "SSN College of Engineering, Rajiv Gandhi Salai (OMR), Kalavakkam, Chennai 603110",
  chairName: "Varun Sudheer",
  chairEmail: "varun2410158@ssn.edu.in",
  socialLinks: {
    instagram: "https://instagram.com/ieee_ssit_ssn",
    linkedin: "https://linkedin.com/company/ssn-ieee-ssit",
    github: "https://github.com/PranavVasudevan/IEEE-SSIT",
  },
  focusAreas: [
    {
      title: "Environmental Impacts & Sustainability",
      desc: "Investigating the carbon footprint of compute clusters, life-cycle assessments of electronic waste, renewable micro-grids, and technological pathways to mitigate global climate disruption.",
      contactName: "Dr. K. S. Vijay",
      contactEmail: "vijay.env@ssn.edu.in",
      accent: "gold",
    },
    {
      title: "Universal Access to Technology",
      desc: "Addressing the digital divide by engineering low-cost, open-source educational hardware, assistive technologies for disabilities, and resilient rural connectivity solutions.",
      contactName: "Prof. S. Geetha",
      contactEmail: "geetha.access@ssn.edu.in",
      accent: "navy",
    },
    {
      title: "Ethics & Human Rights in AI",
      desc: "Interrogating bias in machine learning models, biometric surveillance risks, privacy-preserving cryptography, and the socio-legal accountability frameworks governing algorithmic decision systems.",
      contactName: "Dr. M. Arvind",
      contactEmail: "arvind.ethics@ssn.edu.in",
      accent: "ink",
    },
  ],
}

export function useChapterInfo() {
  const [chapterInfo, setChapterInfo] = useState<ChapterInfoData>(DEFAULT_CHAPTER_INFO)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchInfo = async () => {
      try {
        const res = await settingsApi.getChapterInfo()
        if (isMounted && res && res.value) {
          setChapterInfo({ ...DEFAULT_CHAPTER_INFO, ...res.value })
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setChapterInfo(DEFAULT_CHAPTER_INFO)
          setLoading(false)
        }
      }
    }

    fetchInfo()
    const handler = () => fetchInfo()
    window.addEventListener("chapter_info_changed", handler)
    return () => {
      isMounted = false
      window.removeEventListener("chapter_info_changed", handler)
    }
  }, [])

  return { chapterInfo, loading }
}

export async function saveChapterInfo(data: Partial<ChapterInfoData>): Promise<boolean> {
  await settingsApi.updateChapterInfo(data)
  window.dispatchEvent(new Event("chapter_info_changed"))
  window.dispatchEvent(new Event("activity_changed"))
  return true
}

// =========================================================================
// 9. MEMBERSHIP CONTENT & FAQS CMS
// =========================================================================

export const DEFAULT_MEMBERSHIP_CONTENT: MembershipContentData = {
  joinPortalUrl: "https://www.ieee.org/membership/join/index.html",
  steps: [
    {
      step: "01",
      title: "Join IEEE as a Student Member",
      desc: "Navigate to the official IEEE portal (ieee.org/join). Select Student Membership to avail the 50% global student discount.",
      linkText: "IEEE Student Portal ↗",
      linkUrl: "https://www.ieee.org/membership/join/index.html",
    },
    {
      step: "02",
      title: "Add SSIT Society Membership",
      desc: "During society selection in IEEE cart, search for 'Society on Social Implications of Technology' (SSIT) and add to membership.",
    },
    {
      step: "03",
      title: "Register with SSN Student Branch Chapter",
      desc: "Submit your IEEE Member Number via our Contact form to be formally inducted into the SSN SSIT Chapter roster and project teams.",
      linkText: "Submit Chapter Intake →",
      linkUrl: "/contact",
    },
  ],
  benefits: [
    {
      title: "IEEE Technology & Society Magazine",
      desc: "Complimentary digital subscription to the award-winning peer-reviewed IEEE T&S quarterly journal.",
    },
    {
      title: "ISTAS Global Conference Discounts",
      desc: "Substantial author & attendee discounts for the flagship IEEE International Symposium on Technology and Society.",
    },
    {
      title: "Leadership & Chapter Governance",
      desc: "Executive committee positions, conference chairing, and mentoring junior engineers in technical projects.",
    },
    {
      title: "Global Professional Network",
      desc: "Connect directly with ethicists, policy makers, technologists, and researchers across all IEEE regions.",
    },
  ],
  faqs: [
    {
      id: "faq-1",
      question: "Who is eligible to join the IEEE SSIT SSN Chapter?",
      answer: "All undergraduate, postgraduate, and research scholars across all departments (CSE, IT, ECE, EEE, Mech, Civil, BME, Chem) of SSN College of Engineering are warmly invited.",
      active: true,
      order: 1,
    },
    {
      id: "faq-2",
      question: "Do I need to be from an engineering background?",
      answer: "No! SSIT investigates the intersection of tech, ethics, law, and human rights. Multidisciplinary perspectives from mathematics, humanities, and design are vital.",
      active: true,
      order: 2,
    },
    {
      id: "faq-3",
      question: "How can I join the Web Development / Technical Team?",
      answer: "Submit your interest via the Contact page or talk directly to our Web Dev team leads during our annual recruitment drives!",
      active: true,
      order: 3,
    },
  ],
}

export function useMembershipContent() {
  const [membershipContent, setMembershipContent] = useState<MembershipContentData>(DEFAULT_MEMBERSHIP_CONTENT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchContent = async () => {
      try {
        const res = await settingsApi.getMembershipContent()
        if (isMounted && res && res.value) {
          setMembershipContent({ ...DEFAULT_MEMBERSHIP_CONTENT, ...res.value })
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setMembershipContent(DEFAULT_MEMBERSHIP_CONTENT)
          setLoading(false)
        }
      }
    }

    fetchContent()
    const handler = () => fetchContent()
    window.addEventListener("membership_info_changed", handler)
    return () => {
      isMounted = false
      window.removeEventListener("membership_info_changed", handler)
    }
  }, [])

  return { membershipContent, loading }
}

export async function saveMembershipContent(data: Partial<MembershipContentData>): Promise<boolean> {
  await settingsApi.updateMembershipContent(data)
  window.dispatchEvent(new Event("membership_info_changed"))
  window.dispatchEvent(new Event("activity_changed"))
  return true
}
