import { useState, useEffect } from "react"
import { initFirebaseSDK, isFirebaseConfigured } from "./config"
import { DEFAULT_ADMIN_EMAILS, normalizeEmail, isOfficialSSNEmail } from "./adminConfig"

// =========================================================================
// 1. ADMIN ALLOWLIST MANAGEMENT & METADATA
// =========================================================================

export interface AdminRecord {
  email: string
  addedBy?: string
  addedAt?: string
  active: boolean
}

const ALLOWLIST_LOCAL_KEY = "ieee_ssit_admin_allowlist_records"

export async function getAdminAllowlist(): Promise<string[]> {
  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.db) {
        const { doc, getDoc, setDoc, serverTimestamp } = await import("firebase/firestore")
        const docRef = doc(sdk.db, "admins", "allowlist")
        const snapshot = await getDoc(docRef)
        if (snapshot.exists() && Array.isArray(snapshot.data()?.emails)) {
          const list = snapshot.data()?.emails.map((e: string) => normalizeEmail(e))
          return Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...list]))
        } else {
          // Seed with the core 6 approved admins
          await setDoc(docRef, { emails: DEFAULT_ADMIN_EMAILS, updatedAt: serverTimestamp() })
          return DEFAULT_ADMIN_EMAILS
        }
      }
    } catch (err) {
      console.warn("Could not fetch allowlist from Firestore, using fallback:", err)
    }
  }

  const stored = localStorage.getItem(ALLOWLIST_LOCAL_KEY)
  if (stored) {
    try {
      const parsed: AdminRecord[] = JSON.parse(stored)
      const list = parsed.map(r => normalizeEmail(r.email))
      return Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...list]))
    } catch {}
  }
  return DEFAULT_ADMIN_EMAILS
}

export async function getAdminRecords(): Promise<AdminRecord[]> {
  const allowlist = await getAdminAllowlist()
  const stored = localStorage.getItem(ALLOWLIST_LOCAL_KEY)
  let existingRecords: AdminRecord[] = []
  if (stored) {
    try {
      existingRecords = JSON.parse(stored)
    } catch {}
  }

  return allowlist.map((email) => {
    const existing = existingRecords.find(r => r.email === email)
    return {
      email,
      addedBy: existing?.addedBy || "Core System Config",
      addedAt: existing?.addedAt || "2025-01-01",
      active: existing?.active ?? true,
    }
  })
}

export async function isEmailAllowlisted(email?: string | null): Promise<boolean> {
  const cleanEmail = normalizeEmail(email)
  if (!cleanEmail) return false

  if (!isOfficialSSNEmail(cleanEmail)) {
    return false
  }

  // Fast check: If in the 6 approved developer admins, immediately return true
  if (DEFAULT_ADMIN_EMAILS.includes(cleanEmail)) {
    return true
  }

  const list = await getAdminAllowlist()
  return list.includes(cleanEmail)
}

export async function addAdminEmail(email: string, addedByEmail = "System Lead"): Promise<boolean> {
  const clean = normalizeEmail(email)
  if (!isOfficialSSNEmail(clean)) return false

  const currentList = await getAdminAllowlist()
  if (!currentList.includes(clean)) {
    const updated = [...currentList, clean]
    await updateAdminAllowlist(updated)

    // Save record with audit metadata
    const records = await getAdminRecords()
    records.push({
      email: clean,
      addedBy: addedByEmail,
      addedAt: new Date().toISOString().split("T")[0],
      active: true,
    })
    localStorage.setItem(ALLOWLIST_LOCAL_KEY, JSON.stringify(records))
    await logAdminActivity("Added Admin", "admins", clean, `Added by ${addedByEmail}`)
    window.dispatchEvent(new Event("allowlist_changed"))
  }
  return true
}

export async function removeAdminEmail(emailToRemove: string, removedByEmail = "System Lead"): Promise<boolean> {
  const clean = normalizeEmail(emailToRemove)
  const currentList = await getAdminAllowlist()
  if (currentList.length <= 1) return false

  const updated = currentList.filter(e => e !== clean)
  await updateAdminAllowlist(updated)

  const records = await getAdminRecords()
  const filtered = records.filter(r => r.email !== clean)
  localStorage.setItem(ALLOWLIST_LOCAL_KEY, JSON.stringify(filtered))
  await logAdminActivity("Removed Admin", "admins", clean, `Removed by ${removedByEmail}`)
  window.dispatchEvent(new Event("allowlist_changed"))
  return true
}

export async function updateAdminAllowlist(emails: string[]): Promise<boolean> {
  const cleanEmails = Array.from(
    new Set(emails.map(e => normalizeEmail(e)).filter(e => isOfficialSSNEmail(e)))
  )

  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.db) {
        const { doc, setDoc, serverTimestamp } = await import("firebase/firestore")
        const docRef = doc(sdk.db, "admins", "allowlist")
        await setDoc(docRef, { emails: cleanEmails, updatedAt: serverTimestamp() })
      }
    } catch (err) {
      console.error("Failed to update Firestore allowlist:", err)
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
    let unsubscribe = () => {}

    const init = async () => {
      if (isFirebaseConfigured) {
        const sdk = await initFirebaseSDK()
        if (sdk && sdk.db) {
          const { doc, onSnapshot } = await import("firebase/firestore")
          const docRef = doc(sdk.db, "admins", "allowlist")
          unsubscribe = onSnapshot(docRef, async (docSnap) => {
            if (docSnap.exists() && Array.isArray(docSnap.data()?.emails)) {
              const list = docSnap.data()?.emails.map((e: string) => normalizeEmail(e))
              const combined = Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...list]))
              setEmails(combined)
            } else {
              setEmails(DEFAULT_ADMIN_EMAILS)
            }
            const recs = await getAdminRecords()
            setRecords(recs)
            setLoading(false)
          }, async () => {
            const res = await getAdminAllowlist()
            const recs = await getAdminRecords()
            setEmails(res)
            setRecords(recs)
            setLoading(false)
          })
          return
        }
      }

      getAdminAllowlist().then(async (res) => {
        const recs = await getAdminRecords()
        setEmails(res)
        setRecords(recs)
        setLoading(false)
      })

      const handler = () => {
        getAdminAllowlist().then(async (res) => {
          const recs = await getAdminRecords()
          setEmails(res)
          setRecords(recs)
        })
      }
      window.addEventListener("allowlist_changed", handler)
      return () => window.removeEventListener("allowlist_changed", handler)
    }

    init()

    return () => unsubscribe()
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
// 2. ACTIVITY LOGGING SYSTEM (Lightweight Firestore Audit Trail)
// =========================================================================

export interface ActivityLog {
  id: string
  action: string
  category: "events" | "gallery" | "team" | "announcements" | "inquiries" | "admins" | "settings"
  targetTitle?: string
  adminEmail: string
  timestamp: string
  details?: string
}

const ACTIVITY_LOCAL_KEY = "ieee_ssit_activity_logs"

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "act-1",
    action: "Published Chapter Portal CMS",
    category: "settings",
    targetTitle: "Production Release 2025",
    adminEmail: "sharruk2470048@ssn.edu.in",
    timestamp: "2025-02-23 10:15",
    details: "Initialized real-time Firebase multi-admin architecture.",
  },
  {
    id: "act-2",
    action: "Added Event",
    category: "events",
    targetTitle: "AI Ethics & Algorithmic Bias in Healthcare",
    adminEmail: "nathaniel2470009@ssn.edu.in",
    timestamp: "2025-02-22 16:40",
    details: "Configured registration links and speaker profile.",
  },
  {
    id: "act-3",
    action: "Updated Admin Allowlist",
    category: "admins",
    targetTitle: "Core Developer Roster",
    adminEmail: "sharruk2470048@ssn.edu.in",
    timestamp: "2025-02-22 14:20",
    details: "Verified 6 active SSN developer email addresses.",
  },
]

export async function logAdminActivity(
  action: string,
  category: ActivityLog["category"],
  targetTitle?: string,
  details?: string,
  adminEmail = "Current Admin"
): Promise<string> {
  const now = new Date()
  const timestamp = `${now.toISOString().split("T")[0]} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  const id = `act-${Date.now()}`
  const logItem: ActivityLog = {
    id,
    action,
    category,
    targetTitle,
    adminEmail,
    timestamp,
    details,
  }

  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.db) {
        const { collection, addDoc } = await import("firebase/firestore")
        await addDoc(collection(sdk.db, "activity_logs"), logItem)
      }
    } catch (e) {
      console.warn("Could not log to Firestore activity collection:", e)
    }
  }

  const stored = localStorage.getItem(ACTIVITY_LOCAL_KEY)
  let list: ActivityLog[] = stored ? JSON.parse(stored) : [...INITIAL_ACTIVITY_LOGS]
  list.unshift(logItem)
  if (list.length > 50) list = list.slice(0, 50)
  localStorage.setItem(ACTIVITY_LOCAL_KEY, JSON.stringify(list))
  window.dispatchEvent(new Event("activity_changed"))
  return id
}

export function useActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe = () => {}

    const init = async () => {
      if (isFirebaseConfigured) {
        const sdk = await initFirebaseSDK()
        if (sdk && sdk.db) {
          const { collection, query, orderBy, limit, onSnapshot } = await import("firebase/firestore")
          const q = query(collection(sdk.db, "activity_logs"), orderBy("timestamp", "desc"), limit(40))
          unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
              const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityLog))
              setLogs(items)
            } else {
              setLogs(INITIAL_ACTIVITY_LOGS)
            }
            setLoading(false)
          }, () => loadFromLocal())
          return
        }
      }

      loadFromLocal()
    }

    function loadFromLocal() {
      const stored = localStorage.getItem(ACTIVITY_LOCAL_KEY)
      if (stored) {
        try {
          setLogs(JSON.parse(stored))
        } catch {
          setLogs(INITIAL_ACTIVITY_LOGS)
        }
      } else {
        localStorage.setItem(ACTIVITY_LOCAL_KEY, JSON.stringify(INITIAL_ACTIVITY_LOGS))
        setLogs(INITIAL_ACTIVITY_LOGS)
      }
      setLoading(false)
    }

    init()

    const handler = () => loadFromLocal()
    window.addEventListener("activity_changed", handler)
    return () => {
      unsubscribe()
      window.removeEventListener("activity_changed", handler)
    }
  }, [])

  return { logs, loading }
}

// =========================================================================
// 3. EVENTS DATA & ADVANCED CMS HOOKS
// =========================================================================

export interface ChapterEvent {
  id: string
  title: string
  category: "Workshop" | "Hackathon" | "Symposium" | "Seminar" | "Conference" | "Webinar" | "Chapter Event" | "Other"
  date: string
  startTime?: string
  endTime?: string
  time?: string
  location: string
  mode: "In-Person" | "Online" | "Hybrid"
  description: string
  image?: string
  registerUrl?: string
  externalUrl?: string
  speaker?: string
  speakerRole?: string
  deadline?: string
  featured?: boolean
  status: "upcoming" | "completed"
  published?: boolean
  createdAt?: string
}

export const INITIAL_EVENTS: ChapterEvent[] = [
  {
    id: "ev-1",
    title: "AI Ethics & Algorithmic Bias in Healthcare Systems",
    category: "Workshop",
    date: "March 15, 2025",
    time: "2:00 PM – 4:30 PM",
    startTime: "14:00",
    endTime: "16:30",
    location: "SSN Central Auditorium / Hybrid",
    mode: "Hybrid",
    description: "An interactive hands-on workshop examining algorithmic transparency, bias mitigation in diagnostic models, and the ethical responsibility of engineers deploying AI in critical healthcare infrastructure.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop&auto=format",
    registerUrl: "https://forms.gle/ssnieee-ai-ethics-2025",
    speaker: "Dr. K. Swaminathan",
    speakerRole: "IIT Madras AI Ethics Lab Lead",
    deadline: "March 14, 2025",
    featured: true,
    status: "upcoming",
    published: true,
  },
  {
    id: "ev-2",
    title: "Envision 2025: Tech for Humanity National Hackathon",
    category: "Hackathon",
    date: "April 11–12, 2025",
    time: "36-Hour Hackathon",
    startTime: "09:00",
    endTime: "18:00",
    location: "SSN Innovation & Incubation Centre",
    mode: "In-Person",
    description: "Annual national level hackathon focused on sustainable energy solutions, assistive technologies for disabilities, and reducing the rural digital divide. Cash prizes worth 1.5 Lakhs.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop&auto=format",
    registerUrl: "https://unstop.com/hackathons/envision-2025-ssn",
    speaker: "IEEE SSIT Madras Section Mentors",
    speakerRole: "Industry Advisory Committee",
    deadline: "April 05, 2025",
    featured: true,
    status: "upcoming",
    published: true,
  },
  {
    id: "ev-3",
    title: "Universal Digital Inclusion: Bridging Rural Connectivity",
    category: "Chapter Event",
    date: "January 24, 2025",
    time: "3:30 PM – 5:00 PM",
    startTime: "15:30",
    endTime: "17:00",
    location: "Mini Auditorium, SSN CE",
    mode: "In-Person",
    description: "Distinguished panel discussion exploring mesh networking, low-power satellite terminals, and educational access in underserved rural communities across Tamil Nadu.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop&auto=format",
    speaker: "Prof. S. Ramanathan & Panel",
    speakerRole: "Senior Members, IEEE",
    status: "completed",
    published: true,
  },
  {
    id: "ev-4",
    title: "IEEE ISTAS 2025 Chapter Preview & Paper Writing Sprint",
    category: "Symposium",
    date: "May 2, 2025",
    time: "10:00 AM – 1:00 PM",
    startTime: "10:00",
    endTime: "13:00",
    location: "ECE Seminar Hall, SSN",
    mode: "In-Person",
    description: "Mentorship sprint guiding student researchers to prepare, format, and submit conference papers for IEEE International Symposium on Technology and Society (ISTAS 2025).",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop&auto=format",
    registerUrl: "https://forms.gle/ssn-istas-paper-sprint",
    deadline: "April 28, 2025",
    featured: false,
    status: "upcoming",
    published: true,
  }
]

const EVENTS_LOCAL_KEY = "ieee_ssit_events"

export function useEvents() {
  const [events, setEvents] = useState<ChapterEvent[]>(INITIAL_EVENTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe = () => {}

    const init = async () => {
      if (isFirebaseConfigured) {
        const sdk = await initFirebaseSDK()
        if (sdk && sdk.db) {
          const { collection, query, orderBy, onSnapshot } = await import("firebase/firestore")
          const q = query(collection(sdk.db, "events"), orderBy("date", "desc"))
          unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
              const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChapterEvent))
              setEvents(list)
            } else {
              setEvents(INITIAL_EVENTS)
            }
            setLoading(false)
          }, () => loadFromLocal())
          return
        }
      }

      loadFromLocal()
    }

    function loadFromLocal() {
      const stored = localStorage.getItem(EVENTS_LOCAL_KEY)
      if (stored) {
        try {
          setEvents(JSON.parse(stored))
        } catch {
          setEvents(INITIAL_EVENTS)
        }
      } else {
        localStorage.setItem(EVENTS_LOCAL_KEY, JSON.stringify(INITIAL_EVENTS))
        setEvents(INITIAL_EVENTS)
      }
      setLoading(false)
    }

    init()

    const handler = () => loadFromLocal()
    window.addEventListener("events_changed", handler)
    return () => {
      unsubscribe()
      window.removeEventListener("events_changed", handler)
    }
  }, [])

  return { events, loading }
}

export async function saveEvent(eventData: Omit<ChapterEvent, "id"> & { id?: string }): Promise<string> {
  const isNew = !eventData.id
  const id = eventData.id || `ev-${Date.now()}`
  const fullEvent: ChapterEvent = {
    ...eventData,
    id,
    published: eventData.published ?? true,
    createdAt: eventData.createdAt || new Date().toISOString(),
  }

  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.db) {
        const { doc, setDoc } = await import("firebase/firestore")
        await setDoc(doc(sdk.db, "events", id), fullEvent, { merge: true })
      }
    } catch (e) {
      console.warn("Firestore save event failed, saved locally:", e)
    }
  }

  // Local sync
  const stored = localStorage.getItem(EVENTS_LOCAL_KEY)
  let list: ChapterEvent[] = stored ? JSON.parse(stored) : [...INITIAL_EVENTS]
  const idx = list.findIndex(e => e.id === id)
  if (idx >= 0) {
    list[idx] = fullEvent
  } else {
    list.unshift(fullEvent)
  }
  localStorage.setItem(EVENTS_LOCAL_KEY, JSON.stringify(list))
  await logAdminActivity(
    isNew ? "Created Event" : "Updated Event",
    "events",
    fullEvent.title,
    `Category: ${fullEvent.category}, Mode: ${fullEvent.mode}`
  )
  window.dispatchEvent(new Event("events_changed"))
  return id
}

export async function deleteEvent(id: string): Promise<boolean> {
  const stored = localStorage.getItem(EVENTS_LOCAL_KEY)
  let deletedTitle = id
  if (stored) {
    const list: ChapterEvent[] = JSON.parse(stored)
    const target = list.find(e => e.id === id)
    if (target) deletedTitle = target.title
  }

  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.db) {
        const { doc, deleteDoc } = await import("firebase/firestore")
        await deleteDoc(doc(sdk.db, "events", id))
      }
    } catch (e) {}
  }

  if (stored) {
    let list: ChapterEvent[] = JSON.parse(stored)
    list = list.filter(e => e.id !== id)
    localStorage.setItem(EVENTS_LOCAL_KEY, JSON.stringify(list))
    await logAdminActivity("Deleted Event", "events", deletedTitle)
    window.dispatchEvent(new Event("events_changed"))
  }
  return true
}

export async function duplicateEvent(id: string): Promise<string> {
  const stored = localStorage.getItem(EVENTS_LOCAL_KEY)
  let targetEvent = INITIAL_EVENTS.find(e => e.id === id)
  if (stored) {
    const list: ChapterEvent[] = JSON.parse(stored)
    const found = list.find(e => e.id === id)
    if (found) targetEvent = found
  }

  if (!targetEvent) return ""

  const newId = `ev-${Date.now()}`
  const cloned: ChapterEvent = {
    ...targetEvent,
    id: newId,
    title: `${targetEvent.title} (Copy)`,
    featured: false,
    status: "upcoming",
    createdAt: new Date().toISOString(),
  }

  return saveEvent(cloned)
}

// =========================================================================
// 4. GALLERY DATA & HOOKS
// =========================================================================

export interface GalleryPhoto {
  id: string
  url: string
  alt: string
  label: string
  caption?: string
  eventName?: string
  category: "Workshop" | "Hackathon" | "Symposium" | "Campus" | "Seminar" | "Other"
  date?: string
  featured?: boolean
  order?: number
}

export const INITIAL_GALLERY: GalleryPhoto[] = [
  {
    id: "gal-1",
    url: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&h=550&fit=crop&auto=format",
    alt: "Students at computer workstations during a session",
    label: "Technical Workshop 2025",
    caption: "Hands-on AI ethics testing on real-world datasets.",
    eventName: "AI Ethics & Algorithmic Bias",
    category: "Workshop",
    date: "Feb 2025",
    featured: true,
    order: 1,
  },
  {
    id: "gal-2",
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=550&fit=crop&auto=format",
    alt: "Engineering student at a laptop",
    label: "Ethics in AI Research Session",
    caption: "Student researchers analyzing ethical implications.",
    category: "Symposium",
    date: "Jan 2025",
    order: 2,
  },
  {
    id: "gal-3",
    url: "https://images.unsplash.com/photo-1778876088509-982115d463ef?w=800&h=550&fit=crop&auto=format",
    alt: "Audience in SSN lecture hall",
    label: "Chapter Inaugural Symposium",
    caption: "Over 200 students attending the chapter inauguration.",
    category: "Symposium",
    date: "Jan 2025",
    featured: true,
    order: 3,
  },
  {
    id: "gal-4",
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=1000&fit=crop&auto=format",
    alt: "LED technology panel",
    label: "Assistive Tech Demonstration",
    caption: "Smart assistive hardware prototype for visually impaired.",
    category: "Workshop",
    date: "Nov 2024",
    featured: true,
    order: 4,
  },
  {
    id: "gal-5",
    url: "https://images.unsplash.com/photo-1782388713336-fcb8aa6db8f0?w=800&h=550&fit=crop&auto=format",
    alt: "Two students collaborating at laptop",
    label: "Envision Hackathon Sprint",
    caption: "Teams building rural connectivity prototypes.",
    eventName: "Envision Hackathon",
    category: "Hackathon",
    date: "Oct 2024",
    order: 5,
  },
  {
    id: "gal-6",
    url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=550&fit=crop&auto=format",
    alt: "Student in lab with engineering equipment",
    label: "Hardware Sustainability Lab",
    caption: "Testing e-waste recycling and circular economy circuit boards.",
    category: "Campus",
    date: "Sep 2024",
    order: 6,
  },
]

const GALLERY_LOCAL_KEY = "ieee_ssit_gallery"

export function useGallery() {
  const [gallery, setGallery] = useState<GalleryPhoto[]>(INITIAL_GALLERY)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe = () => {}

    const init = async () => {
      if (isFirebaseConfigured) {
        const sdk = await initFirebaseSDK()
        if (sdk && sdk.db) {
          const { collection, onSnapshot } = await import("firebase/firestore")
          unsubscribe = onSnapshot(collection(sdk.db, "gallery"), (snapshot) => {
            if (!snapshot.empty) {
              const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryPhoto))
              setGallery(list)
            } else {
              setGallery(INITIAL_GALLERY)
            }
            setLoading(false)
          }, () => loadFromLocal())
          return
        }
      }

      loadFromLocal()
    }

    function loadFromLocal() {
      const stored = localStorage.getItem(GALLERY_LOCAL_KEY)
      if (stored) {
        try {
          setGallery(JSON.parse(stored))
        } catch {
          setGallery(INITIAL_GALLERY)
        }
      } else {
        localStorage.setItem(GALLERY_LOCAL_KEY, JSON.stringify(INITIAL_GALLERY))
        setGallery(INITIAL_GALLERY)
      }
      setLoading(false)
    }

    init()

    const handler = () => loadFromLocal()
    window.addEventListener("gallery_changed", handler)
    return () => {
      unsubscribe()
      window.removeEventListener("gallery_changed", handler)
    }
  }, [])

  return { gallery, loading }
}

export async function saveGalleryPhoto(photo: Omit<GalleryPhoto, "id"> & { id?: string }) {
  const isNew = !photo.id
  const id = photo.id || `gal-${Date.now()}`
  const fullPhoto: GalleryPhoto = { ...photo, id }

  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.db) {
        const { doc, setDoc } = await import("firebase/firestore")
        await setDoc(doc(sdk.db, "gallery", id), fullPhoto, { merge: true })
      }
    } catch (e) {}
  }

  const stored = localStorage.getItem(GALLERY_LOCAL_KEY)
  let list: GalleryPhoto[] = stored ? JSON.parse(stored) : [...INITIAL_GALLERY]
  const idx = list.findIndex(p => p.id === id)
  if (idx >= 0) {
    list[idx] = fullPhoto
  } else {
    list.unshift(fullPhoto)
  }
  localStorage.setItem(GALLERY_LOCAL_KEY, JSON.stringify(list))
  await logAdminActivity(
    isNew ? "Added Gallery Photo" : "Updated Gallery Photo",
    "gallery",
    fullPhoto.label
  )
  window.dispatchEvent(new Event("gallery_changed"))
  return id
}

export async function deleteGalleryPhoto(id: string) {
  const stored = localStorage.getItem(GALLERY_LOCAL_KEY)
  let deletedLabel = id
  if (stored) {
    const list: GalleryPhoto[] = JSON.parse(stored)
    const target = list.find(p => p.id === id)
    if (target) deletedLabel = target.label
  }

  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.db) {
        const { doc, deleteDoc } = await import("firebase/firestore")
        await deleteDoc(doc(sdk.db, "gallery", id))
      }
    } catch (e) {}
  }

  if (stored) {
    let list: GalleryPhoto[] = JSON.parse(stored)
    list = list.filter(p => p.id !== id)
    localStorage.setItem(GALLERY_LOCAL_KEY, JSON.stringify(list))
    await logAdminActivity("Deleted Gallery Photo", "gallery", deletedLabel)
    window.dispatchEvent(new Event("gallery_changed"))
  }
  return true
}

// =========================================================================
// 5. TEAM DIRECTORY CMS
// =========================================================================

export interface TeamMember {
  id: string
  name: string
  role: string
  teamType: "Executive" | "Web Development" | "Events" | "Design & Media" | "Editorial" | "Other"
  department: string
  year: string
  email: string
  photo?: string
  linkedin?: string
  github?: string
  bio?: string
  order?: number
  active?: boolean
}

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: "team-1",
    name: "Sharruk",
    role: "Web Development Member",
    teamType: "Web Development",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    email: "sharruk2470048@ssn.edu.in",
    photo: "",
    bio: "Passionate about full-stack engineering, reactive systems, and ethical computing.",
    order: 1,
    active: true,
  },
  {
    id: "team-2",
    name: "Nathaniel",
    role: "Full-Stack Developer",
    teamType: "Web Development",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    email: "nathaniel2470009@ssn.edu.in",
    photo: "",
    bio: "Architecting cloud workflows, database security rules, and real-time state synchronization.",
    order: 2,
    active: true,
  },
  {
    id: "team-3",
    name: "Shriram",
    role: "Backend & Systems Developer",
    teamType: "Web Development",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    email: "shriram2410046@ssn.edu.in",
    photo: "",
    bio: "Focused on API resilience, performance metrics, and database access control.",
    order: 3,
    active: true,
  },
  {
    id: "team-4",
    name: "Varun",
    role: "Frontend Developer",
    teamType: "Web Development",
    department: "Information Technology",
    year: "3rd Year",
    email: "varun2410158@ssn.edu.in",
    photo: "",
    bio: "Developing responsive UI components, animations, and accessible web experiences.",
    order: 4,
    active: true,
  },
  {
    id: "team-5",
    name: "Harshika",
    role: "UI/UX & Frontend Developer",
    teamType: "Web Development",
    department: "Biomedical Engineering",
    year: "3rd Year",
    email: "harshika2410326@ssn.edu.in",
    photo: "",
    bio: "Crafting beautiful, accessible digital design experiences and design tokens for IEEE SSIT.",
    order: 5,
    active: true,
  },
  {
    id: "team-6",
    name: "Vedika",
    role: "Web Operations & QA Lead",
    teamType: "Web Development",
    department: "Electronics & Communication Engineering",
    year: "3rd Year",
    email: "vedika2410432@ssn.edu.in",
    photo: "",
    bio: "Testing end-to-end user flows, content governance, and cross-browser responsiveness.",
    order: 6,
    active: true,
  },
  {
    id: "team-6b",
    name: "Harshini",
    role: "Full-Stack Developer",
    teamType: "Web Development",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    email: "harshini2410197@ssn.edu.in",
    photo: "",
    bio: "Contributing to portal architecture, component systems, and database integrations.",
    order: 7,
    active: true,
  },
  {
    id: "team-6c",
    name: "Pranav",
    role: "Web Development Engineer",
    teamType: "Web Development",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    email: "pranav2410328@ssn.edu.in",
    photo: "",
    bio: "Building robust cloud workflows, interactive UI features, and performance optimizations.",
    order: 8,
    active: true,
  },
  {
    id: "team-7",
    name: "Aaditya Narayanan",
    role: "Chapter Chair",
    teamType: "Executive",
    department: "Electronics & Communication Engineering",
    year: "4th Year",
    email: "chair.ssit@ssn.edu.in",
    photo: "",
    bio: "Advocating for student engagement in ethical tech standards and sustainable innovation.",
    order: 9,
    active: true,
  },
  {
    id: "team-8",
    name: "Kavya Ramesh",
    role: "Vice Chair",
    teamType: "Executive",
    department: "Information Technology",
    year: "3rd Year",
    email: "vicechair.ssit@ssn.edu.in",
    photo: "",
    bio: "Organizing workshops on AI bias, privacy preservation, and social implications.",
    order: 10,
    active: true,
  },
]

const TEAM_LOCAL_KEY = "ieee_ssit_team_v2"

export function useTeam() {
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe = () => {}

    const init = async () => {
      if (isFirebaseConfigured) {
        const sdk = await initFirebaseSDK()
        if (sdk && sdk.db) {
          const { collection, onSnapshot } = await import("firebase/firestore")
          unsubscribe = onSnapshot(collection(sdk.db, "team"), (snapshot) => {
            if (!snapshot.empty) {
              const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember))
              setTeam(list)
            } else {
              setTeam(INITIAL_TEAM)
            }
            setLoading(false)
          }, () => loadFromLocal())
          return
        }
      }

      loadFromLocal()
    }

    function loadFromLocal() {
      const stored = localStorage.getItem(TEAM_LOCAL_KEY)
      if (stored) {
        try {
          setTeam(JSON.parse(stored))
        } catch {
          setTeam(INITIAL_TEAM)
        }
      } else {
        localStorage.setItem(TEAM_LOCAL_KEY, JSON.stringify(INITIAL_TEAM))
        setTeam(INITIAL_TEAM)
      }
      setLoading(false)
    }

    init()

    const handler = () => loadFromLocal()
    window.addEventListener("team_changed", handler)
    return () => {
      unsubscribe()
      window.removeEventListener("team_changed", handler)
    }
  }, [])

  return { team, loading }
}

export async function saveTeamMember(member: Omit<TeamMember, "id"> & { id?: string }) {
  const isNew = !member.id
  const id = member.id || `team-${Date.now()}`
  const fullMember: TeamMember = {
    ...member,
    id,
    active: member.active ?? true,
    order: member.order ?? 10,
  }

  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.db) {
        const { doc, setDoc } = await import("firebase/firestore")
        await setDoc(doc(sdk.db, "team", id), fullMember, { merge: true })
      }
    } catch (e) {}
  }

  const stored = localStorage.getItem(TEAM_LOCAL_KEY)
  let list: TeamMember[] = stored ? JSON.parse(stored) : [...INITIAL_TEAM]
  const idx = list.findIndex(m => m.id === id)
  if (idx >= 0) {
    list[idx] = fullMember
  } else {
    list.push(fullMember)
  }
  localStorage.setItem(TEAM_LOCAL_KEY, JSON.stringify(list))
  await logAdminActivity(
    isNew ? "Added Team Member" : "Updated Team Member",
    "team",
    `${fullMember.name} (${fullMember.role})`
  )
  window.dispatchEvent(new Event("team_changed"))
  return id
}

export async function deleteTeamMember(id: string) {
  const stored = localStorage.getItem(TEAM_LOCAL_KEY)
  let deletedName = id
  if (stored) {
    const list: TeamMember[] = JSON.parse(stored)
    const target = list.find(m => m.id === id)
    if (target) deletedName = `${target.name} (${target.role})`
  }

  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.db) {
        const { doc, deleteDoc } = await import("firebase/firestore")
        await deleteDoc(doc(sdk.db, "team", id))
      }
    } catch (e) {}
  }

  if (stored) {
    let list: TeamMember[] = JSON.parse(stored)
    list = list.filter(m => m.id !== id)
    localStorage.setItem(TEAM_LOCAL_KEY, JSON.stringify(list))
    await logAdminActivity("Removed Team Member", "team", deletedName)
    window.dispatchEvent(new Event("team_changed"))
  }
  return true
}

// =========================================================================
// 6. ANNOUNCEMENTS & ALERT BANNER CMS
// =========================================================================

export interface Announcement {
  id: string
  text: string
  ctaText?: string
  ctaUrl?: string
  priority: "high" | "normal" | "info"
  status: "active" | "draft" | "scheduled" | "expired"
  startDate?: string
  expiryDate?: string
  active: boolean
  createdAt: string
  updatedAt?: string
}

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-2",
    text: "SSIT Student Chapter Call for Core Committee & Web Dev Volunteers for Academic Year 2025–26.",
    ctaText: "Join Team",
    ctaUrl: "/membership",
    priority: "normal",
    status: "active",
    active: false,
    createdAt: "2025-02-18",
    startDate: "2025-02-18",
  },
]

const ANNOUNCEMENTS_LOCAL_KEY = "ieee_ssit_announcements"

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe = () => {}

    const init = async () => {
      if (isFirebaseConfigured) {
        const sdk = await initFirebaseSDK()
        if (sdk && sdk.db) {
          const { collection, onSnapshot } = await import("firebase/firestore")
          unsubscribe = onSnapshot(collection(sdk.db, "announcements"), (snapshot) => {
            if (!snapshot.empty) {
              const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement))
              setAnnouncements(list)
            } else {
              setAnnouncements(INITIAL_ANNOUNCEMENTS)
            }
            setLoading(false)
          }, () => loadFromLocal())
          return
        }
      }

      loadFromLocal()
    }

    function loadFromLocal() {
      const stored = localStorage.getItem(ANNOUNCEMENTS_LOCAL_KEY)
      if (stored) {
        try {
          setAnnouncements(JSON.parse(stored))
        } catch {
          setAnnouncements(INITIAL_ANNOUNCEMENTS)
        }
      } else {
        localStorage.setItem(ANNOUNCEMENTS_LOCAL_KEY, JSON.stringify(INITIAL_ANNOUNCEMENTS))
        setAnnouncements(INITIAL_ANNOUNCEMENTS)
      }
      setLoading(false)
    }

    init()

    const handler = () => loadFromLocal()
    window.addEventListener("announcements_changed", handler)
    return () => {
      unsubscribe()
      window.removeEventListener("announcements_changed", handler)
    }
  }, [])

  return { announcements, loading }
}

export async function saveAnnouncement(ann: Omit<Announcement, "id" | "createdAt"> & { id?: string }) {
  const isNew = !ann.id
  const id = ann.id || `ann-${Date.now()}`
  const full: Announcement = {
    ...ann,
    id,
    active: ann.active ?? true,
    status: ann.status ?? (ann.active ? "active" : "draft"),
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  }

  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.db) {
        const { doc, setDoc } = await import("firebase/firestore")
        await setDoc(doc(sdk.db, "announcements", id), full, { merge: true })
      }
    } catch (e) {}
  }

  const stored = localStorage.getItem(ANNOUNCEMENTS_LOCAL_KEY)
  let list: Announcement[] = stored ? JSON.parse(stored) : [...INITIAL_ANNOUNCEMENTS]
  const idx = list.findIndex(a => a.id === id)
  if (idx >= 0) {
    list[idx] = full
  } else {
    list.unshift(full)
  }
  localStorage.setItem(ANNOUNCEMENTS_LOCAL_KEY, JSON.stringify(list))
  await logAdminActivity(
    isNew ? "Published Announcement" : "Updated Announcement",
    "announcements",
    full.text.substring(0, 45) + "..."
  )
  window.dispatchEvent(new Event("announcements_changed"))
  return id
}

export async function deleteAnnouncement(id: string) {
  const stored = localStorage.getItem(ANNOUNCEMENTS_LOCAL_KEY)
  let deletedText = id
  if (stored) {
    const list: Announcement[] = JSON.parse(stored)
    const target = list.find(a => a.id === id)
    if (target) deletedText = target.text.substring(0, 40) + "..."
  }

  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.db) {
        const { doc, deleteDoc } = await import("firebase/firestore")
        await deleteDoc(doc(sdk.db, "announcements", id))
      }
    } catch (e) {}
  }

  if (stored) {
    let list: Announcement[] = JSON.parse(stored)
    list = list.filter(a => a.id !== id)
    localStorage.setItem(ANNOUNCEMENTS_LOCAL_KEY, JSON.stringify(list))
    await logAdminActivity("Deleted Announcement", "announcements", deletedText)
    window.dispatchEvent(new Event("announcements_changed"))
  }
  return true
}

// =========================================================================
// 7. INQUIRIES & MEMBERSHIP APPLICATIONS INBOX
// =========================================================================

export type SubmissionStatus =
  | "new"
  | "reviewed"
  | "resolved"
  | "archived"
  | "under_review"
  | "approved"
  | "rejected"
  | "contacted"

export interface ContactSubmission {
  id: string
  name: string
  email: string
  department: string
  year?: string
  type: "membership" | "general" | "speaker" | "sponsorship"
  interest?: string
  ieeeMember?: string
  ssitMember?: string
  message: string
  status: SubmissionStatus
  timestamp: string
}

const CONTACT_LOCAL_KEY = "ieee_ssit_inquiries"

export const INITIAL_SUBMISSIONS: ContactSubmission[] = [
  {
    id: "sub-1",
    name: "Siddharth V.",
    email: "siddharth2310022@ssn.edu.in",
    department: "ECE",
    year: "2nd Year",
    type: "membership",
    interest: "Universal Access to Technology & Assistive Hardware",
    ieeeMember: "Yes",
    ssitMember: "Pending",
    message: "I would like to join the SSIT chapter and contribute to the assistive technology hardware projects.",
    status: "new",
    timestamp: "2025-02-22 14:30",
  },
  {
    id: "sub-2",
    name: "Meera Krishnan",
    email: "meera2210105@ssn.edu.in",
    department: "IT",
    year: "3rd Year",
    type: "general",
    interest: "AI Ethics & Algorithmic Transparency",
    message: "Can students from non-circuit branches volunteer for the Envision 2025 hackathon organizing committee?",
    status: "reviewed",
    timestamp: "2025-02-21 11:15",
  },
  {
    id: "sub-3",
    name: "Rohit Anand",
    email: "rohit2410881@ssn.edu.in",
    department: "CSE",
    year: "1st Year",
    type: "membership",
    interest: "Human-Centered Computing & Sustainable Tech",
    ieeeMember: "No",
    ssitMember: "No",
    message: "Interested in learning web development and AI governance. How do I complete student branch registration?",
    status: "under_review",
    timestamp: "2025-02-20 09:45",
  }
]

export function useContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(INITIAL_SUBMISSIONS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe = () => {}

    const init = async () => {
      if (isFirebaseConfigured) {
        const sdk = await initFirebaseSDK()
        if (sdk && sdk.db) {
          const { collection, onSnapshot } = await import("firebase/firestore")
          unsubscribe = onSnapshot(collection(sdk.db, "contact_inquiries"), (snapshot) => {
            if (!snapshot.empty) {
              const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactSubmission))
              setSubmissions(list)
            } else {
              setSubmissions(INITIAL_SUBMISSIONS)
            }
            setLoading(false)
          }, () => loadFromLocal())
          return
        }
      }

      loadFromLocal()
    }

    function loadFromLocal() {
      const stored = localStorage.getItem(CONTACT_LOCAL_KEY)
      if (stored) {
        try {
          setSubmissions(JSON.parse(stored))
        } catch {
          setSubmissions(INITIAL_SUBMISSIONS)
        }
      } else {
        localStorage.setItem(CONTACT_LOCAL_KEY, JSON.stringify(INITIAL_SUBMISSIONS))
        setSubmissions(INITIAL_SUBMISSIONS)
      }
      setLoading(false)
    }

    init()

    const handler = () => loadFromLocal()
    window.addEventListener("inquiries_changed", handler)
    return () => {
      unsubscribe()
      window.removeEventListener("inquiries_changed", handler)
    }
  }, [])

  return { submissions, loading }
}

export async function submitContactInquiry(data: Omit<ContactSubmission, "id" | "status" | "timestamp">) {
  const now = new Date()
  const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  const id = `sub-${Date.now()}`
  const submission: ContactSubmission = {
    ...data,
    id,
    status: "new",
    timestamp,
  }

  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.db) {
        const { collection, addDoc } = await import("firebase/firestore")
        await addDoc(collection(sdk.db, "contact_inquiries"), submission)
      }
    } catch (e) {}
  }

  const stored = localStorage.getItem(CONTACT_LOCAL_KEY)
  let list: ContactSubmission[] = stored ? JSON.parse(stored) : [...INITIAL_SUBMISSIONS]
  list.unshift(submission)
  localStorage.setItem(CONTACT_LOCAL_KEY, JSON.stringify(list))
  window.dispatchEvent(new Event("inquiries_changed"))
  return id
}

export async function updateSubmissionStatus(id: string, status: SubmissionStatus) {
  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.db) {
        const { doc, updateDoc } = await import("firebase/firestore")
        await updateDoc(doc(sdk.db, "contact_inquiries", id), { status })
      }
    } catch (e) {}
  }

  const stored = localStorage.getItem(CONTACT_LOCAL_KEY)
  if (stored) {
    let list: ContactSubmission[] = JSON.parse(stored)
    const item = list.find(s => s.id === id)
    if (item) {
      item.status = status
      await logAdminActivity("Updated Inquiry Status", "inquiries", item.name, `Marked as ${status}`)
    }
    localStorage.setItem(CONTACT_LOCAL_KEY, JSON.stringify(list))
    window.dispatchEvent(new Event("inquiries_changed"))
  }
  return true
}

export async function deleteSubmission(id: string) {
  const stored = localStorage.getItem(CONTACT_LOCAL_KEY)
  let deletedName = id
  if (stored) {
    const list: ContactSubmission[] = JSON.parse(stored)
    const target = list.find(s => s.id === id)
    if (target) deletedName = target.name
  }

  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.db) {
        const { doc, deleteDoc } = await import("firebase/firestore")
        await deleteDoc(doc(sdk.db, "contact_inquiries", id))
      }
    } catch (e) {}
  }

  if (stored) {
    let list: ContactSubmission[] = JSON.parse(stored)
    list = list.filter(s => s.id !== id)
    localStorage.setItem(CONTACT_LOCAL_KEY, JSON.stringify(list))
    await logAdminActivity("Deleted Inquiry", "inquiries", deletedName)
    window.dispatchEvent(new Event("inquiries_changed"))
  }
  return true
}

// =========================================================================
// 8. CHAPTER INFO & ABOUT CONTENT CMS (`settings/chapter_info`)
// =========================================================================

export interface ChapterInfoData {
  chapterName: string
  tagline: string
  mission: string
  vision: string
  corePhilosophy: string
  keyTenets: string[]
  officialEmail: string
  location: string
  chairName: string
  chairEmail: string
  socialLinks: {
    instagram?: string
    linkedin?: string
    github?: string
    twitter?: string
    youtube?: string
  }
  focusAreas: Array<{
    title: string
    desc: string
    contactName: string
    contactEmail: string
    accent: string
  }>
}

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
  officialEmail: "ssit@ssn.edu.in",
  location: "SSN College of Engineering, Rajiv Gandhi Salai (OMR), Kalavakkam, Chennai 603110",
  chairName: "Aaditya Narayanan",
  chairEmail: "chair.ssit@ssn.edu.in",
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

const CHAPTER_INFO_LOCAL_KEY = "ieee_ssit_chapter_info"

export function useChapterInfo() {
  const [chapterInfo, setChapterInfo] = useState<ChapterInfoData>(DEFAULT_CHAPTER_INFO)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe = () => {}

    const init = async () => {
      if (isFirebaseConfigured) {
        const sdk = await initFirebaseSDK()
        if (sdk && sdk.db) {
          const { doc, onSnapshot } = await import("firebase/firestore")
          const docRef = doc(sdk.db, "settings", "chapter_info")
          unsubscribe = onSnapshot(docRef, (snap) => {
            if (snap.exists()) {
              setChapterInfo({ ...DEFAULT_CHAPTER_INFO, ...snap.data() })
            } else {
              setChapterInfo(DEFAULT_CHAPTER_INFO)
            }
            setLoading(false)
          }, () => loadFromLocal())
          return
        }
      }

      loadFromLocal()
    }

    function loadFromLocal() {
      const stored = localStorage.getItem(CHAPTER_INFO_LOCAL_KEY)
      if (stored) {
        try {
          setChapterInfo({ ...DEFAULT_CHAPTER_INFO, ...JSON.parse(stored) })
        } catch {
          setChapterInfo(DEFAULT_CHAPTER_INFO)
        }
      } else {
        setChapterInfo(DEFAULT_CHAPTER_INFO)
      }
      setLoading(false)
    }

    init()

    const handler = () => loadFromLocal()
    window.addEventListener("chapter_info_changed", handler)
    return () => {
      unsubscribe()
      window.removeEventListener("chapter_info_changed", handler)
    }
  }, [])

  return { chapterInfo, loading }
}

export async function saveChapterInfo(data: Partial<ChapterInfoData>): Promise<boolean> {
  const merged: ChapterInfoData = { ...DEFAULT_CHAPTER_INFO, ...data }

  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.db) {
        const { doc, setDoc } = await import("firebase/firestore")
        await setDoc(doc(sdk.db, "settings", "chapter_info"), merged, { merge: true })
      }
    } catch (e) {
      console.warn("Firestore save chapter info failed, saved locally:", e)
    }
  }

  localStorage.setItem(CHAPTER_INFO_LOCAL_KEY, JSON.stringify(merged))
  await logAdminActivity("Updated Chapter Information", "settings", "Mission, Vision & Focus Areas")
  window.dispatchEvent(new Event("chapter_info_changed"))
  return true
}

// =========================================================================
// 9. MEMBERSHIP CONTENT & FAQS CMS (`settings/membership_content`)
// =========================================================================

export interface FAQItem {
  id: string
  question: string
  answer: string
  active: boolean
  order: number
}

export interface MembershipContentData {
  joinPortalUrl: string
  brochureUrl?: string
  steps: Array<{
    step: string
    title: string
    desc: string
    linkText?: string
    linkUrl?: string
  }>
  benefits: Array<{
    title: string
    desc: string
  }>
  faqs: FAQItem[]
}

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

const MEMBERSHIP_INFO_LOCAL_KEY = "ieee_ssit_membership_info"

export function useMembershipContent() {
  const [membershipContent, setMembershipContent] = useState<MembershipContentData>(DEFAULT_MEMBERSHIP_CONTENT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe = () => {}

    const init = async () => {
      if (isFirebaseConfigured) {
        const sdk = await initFirebaseSDK()
        if (sdk && sdk.db) {
          const { doc, onSnapshot } = await import("firebase/firestore")
          const docRef = doc(sdk.db, "settings", "membership_content")
          unsubscribe = onSnapshot(docRef, (snap) => {
            if (snap.exists()) {
              setMembershipContent({ ...DEFAULT_MEMBERSHIP_CONTENT, ...snap.data() })
            } else {
              setMembershipContent(DEFAULT_MEMBERSHIP_CONTENT)
            }
            setLoading(false)
          }, () => loadFromLocal())
          return
        }
      }

      loadFromLocal()
    }

    function loadFromLocal() {
      const stored = localStorage.getItem(MEMBERSHIP_INFO_LOCAL_KEY)
      if (stored) {
        try {
          setMembershipContent({ ...DEFAULT_MEMBERSHIP_CONTENT, ...JSON.parse(stored) })
        } catch {
          setMembershipContent(DEFAULT_MEMBERSHIP_CONTENT)
        }
      } else {
        setMembershipContent(DEFAULT_MEMBERSHIP_CONTENT)
      }
      setLoading(false)
    }

    init()

    const handler = () => loadFromLocal()
    window.addEventListener("membership_info_changed", handler)
    return () => {
      unsubscribe()
      window.removeEventListener("membership_info_changed", handler)
    }
  }, [])

  return { membershipContent, loading }
}

export async function saveMembershipContent(data: Partial<MembershipContentData>): Promise<boolean> {
  const merged: MembershipContentData = { ...DEFAULT_MEMBERSHIP_CONTENT, ...data }

  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.db) {
        const { doc, setDoc } = await import("firebase/firestore")
        await setDoc(doc(sdk.db, "settings", "membership_content"), merged, { merge: true })
      }
    } catch (e) {
      console.warn("Firestore save membership content failed, saved locally:", e)
    }
  }

  localStorage.setItem(MEMBERSHIP_INFO_LOCAL_KEY, JSON.stringify(merged))
  await logAdminActivity("Updated Membership Content & FAQs", "settings", "Steps, Benefits & FAQ Items")
  window.dispatchEvent(new Event("membership_info_changed"))
  return true
}
