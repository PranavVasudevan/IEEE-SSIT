import { useState, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth, logout } from "@/firebase/auth"
import {
  useEvents,
  saveEvent,
  deleteEvent,
  duplicateEvent,
  ChapterEvent,
  useGallery,
  saveGalleryPhoto,
  deleteGalleryPhoto,
  GalleryPhoto,
  useTeam,
  saveTeamMember,
  deleteTeamMember,
  TeamMember,
  useAdminAllowlist,
  useAnnouncements,
  saveAnnouncement,
  deleteAnnouncement,
  Announcement,
  useContactSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
  ContactSubmission,
  SubmissionStatus,
  useActivityLogs,
  useChapterInfo,
  saveChapterInfo,
  ChapterInfoData,
  useMembershipContent,
  saveMembershipContent,
  MembershipContentData,
  FAQItem,
  useNewsletterSubscribers,
  deleteNewsletterSubscriber,
} from "@/firebase/firestore"
import { storageApi } from "@/api/storage"
import { isOfficialSSNEmail } from "@/firebase/adminConfig"
import { solid, tint, navySolid } from "@/styles/colors"
import { Icons } from "@/components/ui/Icons"
import { useToast } from "@/components/ui/Toast"
import { ConfirmModal } from "@/components/ui/ConfirmModal"
import ssitLogo from "@/assets/images/ssit-logo.png"

type TabKey =
  | "dashboard"
  | "announcements"
  | "events"
  | "gallery"
  | "team"
  | "about_cms"
  | "membership_cms"
  | "inquiries"
  | "newsletter"
  | "applications"
  | "admins"
  | "activity_log"
  | "settings"

export default function AdminDashboard() {
  const { user, isAuthorizedAdmin } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Data Hooks
  const { events, loading: eventsLoading } = useEvents()
  const { gallery, loading: galleryLoading } = useGallery()
  const { team, loading: teamLoading } = useTeam()
  const { emails: allowlistEmails, records: adminRecords, addAdmin, removeAdmin } = useAdminAllowlist()
  const { announcements, loading: announcementsLoading } = useAnnouncements()
  const { submissions, loading: submissionsLoading } = useContactSubmissions()
  const { subscribers, loading: subscribersLoading } = useNewsletterSubscribers()
  const { logs } = useActivityLogs()
  const { chapterInfo } = useChapterInfo()
  const { membershipContent } = useMembershipContent()
  const updateChapterInfo = saveChapterInfo
  const updateMembershipContent = saveMembershipContent

  // Search & Filter States
  const [eventSearch, setEventSearch] = useState("")
  const [eventCategoryFilter, setEventCategoryFilter] = useState("all")
  const [eventStatusFilter, setEventStatusFilter] = useState("all")
  const [eventViewMode, setEventViewMode] = useState<"grid" | "table">("grid")

  const [gallerySearch, setGallerySearch] = useState("")
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState("all")

  const [teamSearch, setTeamSearch] = useState("")
  const [teamTypeFilter, setTeamTypeFilter] = useState("all")

  const [inquirySearch, setInquirySearch] = useState("")
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>("all")
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState<string>("all")

  const [adminSearch, setAdminSearch] = useState("")
  const [activitySearch, setActivitySearch] = useState("")

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    isDanger?: boolean
    onConfirm: () => void
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  })

  // Modals & Form States
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<ChapterEvent | null>(null)
  const [eventForm, setEventForm] = useState<Partial<ChapterEvent>>({
    title: "",
    category: "Workshop",
    date: "",
    time: "",
    startTime: "",
    endTime: "",
    location: "SSN College of Engineering",
    mode: "In-Person",
    description: "",
    image: "",
    registerUrl: "",
    externalUrl: "",
    speaker: "",
    speakerRole: "",
    deadline: "",
    featured: false,
    status: "upcoming",
    published: true,
  })

  const [galleryModalOpen, setGalleryModalOpen] = useState(false)
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryPhoto>>({
    url: "",
    label: "",
    caption: "",
    eventName: "",
    category: "Workshop",
    date: "",
    alt: "",
    featured: false,
    order: 1,
  })

  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [announcementForm, setAnnouncementForm] = useState<Partial<Announcement>>({
    text: "",
    ctaText: "Learn More",
    ctaUrl: "",
    priority: "normal",
    status: "active",
    startDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    active: true,
  })

  const [teamModalOpen, setTeamModalOpen] = useState(false)
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null)
  const [uploadingTeamPhoto, setUploadingTeamPhoto] = useState(false)
  const [uploadingGalleryPhoto, setUploadingGalleryPhoto] = useState(false)
  const [uploadingEventImage, setUploadingEventImage] = useState(false)
  const [teamForm, setTeamForm] = useState<Partial<TeamMember>>({
    name: "",
    role: "",
    teamType: "Office Bearers",
    department: "",
    year: "BME III Year",
    chapter: "SSIT_2026",
    quote: "",
    email: "",
    bio: "",
    photo: "",
    linkedin: "",
    github: "",
    active: true,
    order: 1,
  })

  const [addAdminModalOpen, setAddAdminModalOpen] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState("")

  const [selectedInquiry, setSelectedInquiry] = useState<ContactSubmission | null>(null)

  // Chapter Info Form State
  const [chapterForm, setChapterForm] = useState<ChapterInfoData>(chapterInfo)
  const [chapterFormDirty, setChapterFormDirty] = useState(false)

  // Membership Form State
  const [membershipForm, setMembershipForm] = useState<MembershipContentData>(membershipContent)
  const [faqModalOpen, setFaqModalOpen] = useState(false)
  const [faqForm, setFaqForm] = useState<Partial<FAQItem>>({
    question: "",
    answer: "",
    active: true,
    order: 1,
  })

  // Counters
  const pendingInquiriesCount = submissions.filter(s => s.status === "new").length
  const membershipApps = submissions.filter(s => s.type === "membership")
  const pendingAppsCount = membershipApps.filter(s => s.status === "new" || s.status === "under_review").length
  const activeAnnouncementsCount = announcements.filter(a => a.active).length
  const upcomingEventsCount = events.filter(e => e.status === "upcoming").length
  const upcomingEvents = useMemo(() => events.filter(e => e.status === "upcoming"), [events])

  // ==========================================
  // FILTERED DATA SELECTORS
  // ==========================================
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
        e.location.toLowerCase().includes(eventSearch.toLowerCase()) ||
        (e.speaker && e.speaker.toLowerCase().includes(eventSearch.toLowerCase()))
      const matchesCat = eventCategoryFilter === "all" || e.category === eventCategoryFilter
      const matchesStatus = eventStatusFilter === "all" || e.status === eventStatusFilter
      return matchesSearch && matchesCat && matchesStatus
    })
  }, [events, eventSearch, eventCategoryFilter, eventStatusFilter])

  const filteredGallery = useMemo(() => {
    return gallery.filter((p) => {
      const matchesSearch =
        p.label.toLowerCase().includes(gallerySearch.toLowerCase()) ||
        (p.caption && p.caption.toLowerCase().includes(gallerySearch.toLowerCase()))
      const matchesCat = galleryCategoryFilter === "all" || p.category === galleryCategoryFilter
      return matchesSearch && matchesCat
    })
  }, [gallery, gallerySearch, galleryCategoryFilter])

  const filteredTeam = useMemo(() => {
    return team
      .filter((m) => {
        const matchesSearch =
          m.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
          m.role.toLowerCase().includes(teamSearch.toLowerCase()) ||
          (m.department && m.department.toLowerCase().includes(teamSearch.toLowerCase())) ||
          (m.email && m.email.toLowerCase().includes(teamSearch.toLowerCase()))
        const matchesType = teamTypeFilter === "all" || m.teamType === teamTypeFilter
        return matchesSearch && matchesType
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [team, teamSearch, teamTypeFilter])

  const filteredInquiries = useMemo(() => {
    return submissions.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        s.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        s.message.toLowerCase().includes(inquirySearch.toLowerCase())
      const matchesStatus = inquiryStatusFilter === "all" || s.status === inquiryStatusFilter
      const matchesType = inquiryTypeFilter === "all" || s.type === inquiryTypeFilter
      return matchesSearch && matchesStatus && matchesType
    })
  }, [submissions, inquirySearch, inquiryStatusFilter, inquiryTypeFilter])

  const filteredApplications = useMemo(() => {
    return membershipApps.filter((s) => {
      return (
        s.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        s.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        s.department.toLowerCase().includes(inquirySearch.toLowerCase())
      )
    })
  }, [membershipApps, inquirySearch])

  const filteredAdmins = useMemo(() => {
    return adminRecords.filter((r) => {
      return r.email.toLowerCase().includes(adminSearch.toLowerCase())
    })
  }, [adminRecords, adminSearch])

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      return (
        l.action.toLowerCase().includes(activitySearch.toLowerCase()) ||
        (l.targetTitle && l.targetTitle.toLowerCase().includes(activitySearch.toLowerCase())) ||
        l.adminEmail.toLowerCase().includes(activitySearch.toLowerCase())
      )
    })
  }, [logs, activitySearch])

  // ==========================================
  // CRUD HANDLERS
  // ==========================================

  // --- EVENTS ---
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventForm.title || !eventForm.date) {
      showToast("Title and Date are required.", "warning")
      return
    }
    try {
      await saveEvent(eventForm as ChapterEvent)
      showToast(editingEvent ? "Event updated successfully!" : "New event published successfully!", "success")
      setEventModalOpen(false)
      setEditingEvent(null)
    } catch (err: any) {
      showToast("Failed to save event.", "error", err.message)
    }
  }

  const handleDeleteEventClick = (event: ChapterEvent) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Chapter Event",
      message: `Are you sure you want to permanently delete "${event.title}"? This action cannot be undone.`,
      isDanger: true,
      onConfirm: async () => {
        await deleteEvent(event.id)
        showToast("Event deleted successfully.", "info")
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
      },
    })
  }

  const handleDuplicateEvent = async (id: string) => {
    try {
      await duplicateEvent(id)
      showToast("Event duplicated successfully.", "success")
    } catch (err: any) {
      showToast("Failed to duplicate event.", "error")
    }
  }

  // --- GALLERY ---
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!galleryForm.url || !galleryForm.label) {
      showToast("Photo URL and Caption are required.", "warning")
      return
    }
    try {
      await saveGalleryPhoto(galleryForm as GalleryPhoto)
      showToast("Gallery photo saved successfully!", "success")
      setGalleryModalOpen(false)
      setGalleryForm({ url: "", label: "", caption: "", eventName: "", category: "Workshop", date: "", alt: "", featured: false, order: 1 })
    } catch (err: any) {
      showToast("Failed to save gallery photo.", "error")
    }
  }

  const handleDeleteGalleryClick = (photo: GalleryPhoto) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Gallery Photo",
      message: `Are you sure you want to remove "${photo.label}" from the chapter gallery?`,
      isDanger: true,
      onConfirm: async () => {
        await deleteGalleryPhoto(photo.id)
        showToast("Gallery photo deleted.", "info")
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
      },
    })
  }

  // --- ANNOUNCEMENTS ---
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!announcementForm.text) {
      showToast("Announcement text is required.", "warning")
      return
    }
    try {
      await saveAnnouncement(announcementForm as Announcement)
      showToast(editingAnnouncement ? "Announcement updated!" : "Announcement published to top ticker!", "success")
      setAnnouncementModalOpen(false)
      setEditingAnnouncement(null)
      setAnnouncementForm({ text: "", ctaText: "Learn More", ctaUrl: "", priority: "normal", status: "active", startDate: new Date().toISOString().split("T")[0], expiryDate: "", active: true })
    } catch (err: any) {
      showToast("Failed to save announcement.", "error")
    }
  }

  const handleDeleteAnnouncementClick = (ann: Announcement) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Announcement",
      message: `Remove this announcement from the alert ticker banner?`,
      isDanger: true,
      onConfirm: async () => {
        await deleteAnnouncement(ann.id)
        showToast("Announcement deleted.", "info")
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
      },
    })
  }

  // --- TEAM ---
  const getMemberInitials = (name?: string) => {
    const parts = (name || "").trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return (name || "TM").slice(0, 2).toUpperCase()
  }

  const handleTeamImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      showToast("File Size Limit", "warning", "Please select an image under 10MB.")
      return
    }
    setUploadingTeamPhoto(true)
    try {
      const res = await storageApi.uploadFile(file, "team")
      setTeamForm((prev) => ({ ...prev, photo: res.url }))
      showToast("Photo uploaded to Supabase Storage!", "success")
    } catch (err: any) {
      showToast("Failed to upload photo", "error", err.message)
    } finally {
      setUploadingTeamPhoto(false)
    }
  }

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      showToast("File Size Limit", "warning", "Please select an image under 10MB.")
      return
    }
    setUploadingGalleryPhoto(true)
    try {
      const res = await storageApi.uploadFile(file, "gallery")
      setGalleryForm((prev) => ({ ...prev, url: res.url }))
      showToast("Photo uploaded to Supabase Storage!", "success")
    } catch (err: any) {
      showToast("Failed to upload photo", "error", err.message)
    } finally {
      setUploadingGalleryPhoto(false)
    }
  }

  const handleEventImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      showToast("File Size Limit", "warning", "Please select an image under 10MB.")
      return
    }
    setUploadingEventImage(true)
    try {
      const res = await storageApi.uploadFile(file, "events")
      setEventForm((prev) => ({ ...prev, image: res.url }))
      showToast("Cover image uploaded to Supabase Storage!", "success")
    } catch (err: any) {
      showToast("Failed to upload cover image", "error", err.message)
    } finally {
      setUploadingEventImage(false)
    }
  }

  const handleMoveTeamMember = async (member: TeamMember, direction: "up" | "down") => {
    const sorted = [...team].sort((a, b) => (a.order || 0) - (b.order || 0))
    const idx = sorted.findIndex(m => m.id === member.id)
    if (idx === -1) return
    if (direction === "up" && idx > 0) {
      const prev = sorted[idx - 1]
      const tempOrder = prev.order || idx
      prev.order = member.order || (idx + 1)
      member.order = tempOrder
      await saveTeamMember(member)
      await saveTeamMember(prev)
      showToast(`Moved ${member.name} up.`, "info")
    } else if (direction === "down" && idx < sorted.length - 1) {
      const next = sorted[idx + 1]
      const tempOrder = next.order || (idx + 2)
      next.order = member.order || (idx + 1)
      member.order = tempOrder
      await saveTeamMember(member)
      await saveTeamMember(next)
      showToast(`Moved ${member.name} down.`, "info")
    }
  }

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamForm.name || !teamForm.role) {
      showToast("Name and Position are required.", "warning")
      return
    }
    try {
      const memberToSave = {
        ...teamForm,
        quote: teamForm.quote || teamForm.bio || "",
        bio: teamForm.bio || teamForm.quote || "",
        chapter: teamForm.chapter || "SSIT_2026",
      }
      await saveTeamMember(memberToSave as TeamMember)
      showToast(editingTeamMember ? "Team member updated!" : "New team member added to directory!", "success")
      setTeamModalOpen(false)
      setEditingTeamMember(null)
      setTeamForm({ name: "", role: "", teamType: "Office Bearers", department: "", year: "", chapter: "SSIT_2026", quote: "", email: "", bio: "", photo: "", linkedin: "", github: "", active: true, order: 1 })
    } catch (err: any) {
      showToast("Failed to save team member.", "error")
    }
  }

  const handleDeleteTeamClick = (member: TeamMember) => {
    setConfirmModal({
      isOpen: true,
      title: "Remove Team Member",
      message: `Remove ${member.name} (${member.role}) from the public chapter roster?`,
      isDanger: true,
      onConfirm: async () => {
        await deleteTeamMember(member.id)
        showToast("Team member removed.", "info")
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
      },
    })
  }

  // --- ADMINS ---
  const handleAddAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdminEmail) return
    const clean = newAdminEmail.toLowerCase().trim()
    if (!isOfficialSSNEmail(clean)) {
      showToast("Access Restricted", "error", "Only official @ssn.edu.in accounts can be added as administrators.")
      return
    }
    try {
      await addAdmin(clean, user?.email || "Lead Admin")
      showToast("Administrator Added!", "success", `${clean} is now authorized to access the CMS.`)
      setNewAdminEmail("")
      setAddAdminModalOpen(false)
    } catch (err: any) {
      showToast("Failed to add administrator.", "error", err?.message)
    }
  }

  const handleRemoveAdminClick = (email: string) => {
    if (allowlistEmails.length <= 1) {
      showToast("Operation Denied", "warning", "At least one administrator must remain on the allowlist.")
      return
    }
    setConfirmModal({
      isOpen: true,
      title: "Revoke Admin Privileges",
      message: `Revoke administrator access for ${email}? They will no longer be able to log in to /admin/dashboard.`,
      isDanger: true,
      onConfirm: async () => {
        try {
          await removeAdmin(email, user?.email || "Lead Admin")
          showToast("Administrator access revoked.", "info")
        } catch (err: any) {
          showToast("Failed to revoke admin", "error", err?.message)
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
      },
    })
  }

  // --- INQUIRIES & APPLICATIONS ---
  const handleStatusChange = async (id: string, newStatus: SubmissionStatus) => {
    try {
      await updateSubmissionStatus(id, newStatus)
      showToast("Status updated successfully!", "success")
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null)
      }
    } catch (err: any) {
      showToast("Failed to update status.", "error", err?.message)
    }
  }

  const handleDeleteInquiryClick = (inq: ContactSubmission) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Inquiry",
      message: `Permanently delete message from ${inq.name}?`,
      isDanger: true,
      onConfirm: async () => {
        try {
          await deleteSubmission(inq.id)
          showToast("Inquiry deleted.", "info")
        } catch (err: any) {
          showToast("Failed to delete inquiry", "error", err?.message)
        }
        setSelectedInquiry(null)
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
      },
    })
  }

  // --- CHAPTER & MEMBERSHIP CMS ---
  const handleSaveChapterInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateChapterInfo(chapterForm)
      showToast("Chapter information & focus areas updated live!", "success")
      setChapterFormDirty(false)
    } catch (err: any) {
      showToast("Failed to save chapter information.", "error", err?.message)
    }
  }

  const handleSaveMembershipInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateMembershipContent(membershipForm)
      showToast("Membership roadmap & benefits updated live!", "success")
    } catch (err: any) {
      showToast("Failed to save membership content.", "error", err?.message)
    }
  }

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!faqForm.question || !faqForm.answer) return
    const id = faqForm.id || `faq-${Date.now()}`
    const fullFaq: FAQItem = {
      id,
      question: faqForm.question,
      answer: faqForm.answer,
      active: faqForm.active ?? true,
      order: faqForm.order ?? membershipForm.faqs.length + 1,
    }
    const existing = [...membershipForm.faqs]
    const idx = existing.findIndex(f => f.id === id)
    if (idx >= 0) {
      existing[idx] = fullFaq
    } else {
      existing.push(fullFaq)
    }
    const updated = { ...membershipForm, faqs: existing }
    setMembershipForm(updated)
    await updateMembershipContent(updated)
    showToast("FAQ saved successfully!", "success")
    setFaqModalOpen(false)
    setFaqForm({ question: "", answer: "", active: true, order: 1 })
  }

  const handleDeleteFaq = async (faqId: string) => {
    const updated = {
      ...membershipForm,
      faqs: membershipForm.faqs.filter(f => f.id !== faqId),
    }
    setMembershipForm(updated)
    await updateMembershipContent(updated)
    showToast("FAQ removed.", "info")
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans-ui selection:bg-amber-500 selection:text-black">
      {/* GLOBAL CONFIRM MODAL */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        isDanger={confirmModal.isDanger}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      {/* =========================================================================
          1. PROFESSIONAL CMS SIDEBAR NAVIGATION
         ========================================================================= */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
          {/* Sidebar Chapter Branding */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-105 transition-transform">
                <img src={ssitLogo} alt="IEEE SSIT" className="h-6 w-auto object-contain rounded" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display font-bold text-sm tracking-wide text-white truncate">
                  IEEE SSIT CMS
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-semibold uppercase tracking-wider">
                  SSN Student Branch
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white"
            >
              <Icons.X size={18} />
            </button>
          </div>

          {/* Nav Categories */}
          <div className="p-3 space-y-6 flex-1">
            {/* Group 1: Overview */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Overview
              </span>
              <button
                onClick={() => {
                  setActiveTab("dashboard")
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "dashboard"
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icons.Home size={16} />
                  <span>Dashboard Home</span>
                </div>
              </button>
            </div>

            {/* Group 2: Website Content */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Website Content
              </span>

              {[
                { id: "announcements", label: "Announcements", icon: Icons.Bell, count: activeAnnouncementsCount, countColor: "bg-amber-500/20 text-amber-400" },
                { id: "events", label: "Chapter Events", icon: Icons.Calendar, count: events.length },
                { id: "gallery", label: "Photo Gallery", icon: Icons.Gallery, count: gallery.length },
                { id: "team", label: "Student Team", icon: Icons.Users, count: team.length },
                { id: "about_cms", label: "About & Focus Areas", icon: Icons.About },
                { id: "membership_cms", label: "Membership & FAQs", icon: Icons.BookOpen },
              ].map((item) => {
                const IconComp = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm"
                        : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp size={16} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${item.countColor || "bg-slate-800 text-slate-400"}`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Group 3: Communication */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Communication
              </span>

              <button
                onClick={() => {
                  setActiveTab("inquiries")
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "inquiries"
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icons.Mail size={16} />
                  <span>Contact Inbox</span>
                </div>
                {pendingInquiriesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/20 text-red-400 animate-pulse">
                    {pendingInquiriesCount} new
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab("newsletter")
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "newsletter"
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icons.MessageCircle size={16} />
                  <span>Newsletter</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                  {subscribers.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("applications")
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "applications"
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icons.Users size={16} />
                  <span>Member Intakes</span>
                </div>
                {pendingAppsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400">
                    {pendingAppsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Group 4: Administration */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Administration
              </span>

              <button
                onClick={() => {
                  setActiveTab("admins")
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "admins"
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icons.Shield size={16} />
                  <span>Admins & Permissions</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400">
                  {allowlistEmails.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("activity_log")
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "activity_log"
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icons.Globe size={16} />
                  <span>Activity Audit Log</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab("settings")
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "settings"
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icons.Edit size={16} />
                  <span>Site Metadata</span>
                </div>
              </button>
            </div>
          </div>

          {/* Logged In Admin Profile & Sign Out */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-bold flex items-center justify-center text-xs shrink-0 shadow-md">
                {user?.displayName ? user.displayName.charAt(0) : "A"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-sans-ui text-xs font-bold text-white truncate">
                    {user?.displayName || "Web Dev Admin"}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                </div>
                <p className="text-[10px] font-mono text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Link
                to="/"
                target="_blank"
                className="flex-1 py-1.5 rounded-lg text-center font-sans-ui text-[11px] font-semibold border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors flex items-center justify-center gap-1"
              >
                <span>Live Site</span>
                <span>↗</span>
              </Link>
              <button
                onClick={() => {
                  logout()
                  navigate("/admin/login")
                }}
                className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/15 transition-colors"
                title="Sign Out"
              >
                <Icons.LogOut size={15} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* =========================================================================
          2. MAIN CMS CONTENT AREA
         ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header Bar */}
        <div className="lg:hidden p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-800 text-white"
            >
              <Icons.Shield size={18} />
            </button>
            <span className="font-display font-bold text-sm text-white">
              IEEE SSIT CMS
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Admin
          </span>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* =====================================================================
              TAB 1: DASHBOARD OVERVIEW
             ===================================================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in">
              {/* Top Banner with Admin Welcome */}
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Content Management System
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      ● Live Sync Active
                    </span>
                  </div>
                  <h1 className="font-display text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                    Welcome, {user?.displayName || "Web Dev Lead"}
                  </h1>
                  <p className="font-sans-ui text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
                    Manage chapter workshops, gallery media, active announcements, team directory, and incoming student applications from this portal.
                  </p>
                </div>
              </div>

              {/* 8 Metric Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Upcoming Events", count: upcomingEventsCount, sub: `${events.length} Total Registered`, icon: Icons.Calendar, color: "text-blue-400", border: "hover:border-blue-500/40", to: "events" },
                  { title: "Gallery Photos", count: gallery.length, sub: "High-Res Moments", icon: Icons.Gallery, color: "text-purple-400", border: "hover:border-purple-500/40", to: "gallery" },
                  { title: "Pending Inquiries", count: pendingInquiriesCount, sub: `${submissions.length} Total Submissions`, icon: Icons.Mail, color: "text-red-400", border: "hover:border-red-500/40", to: "inquiries" },
                  { title: "Active Ticker Alerts", count: activeAnnouncementsCount, sub: "Live in Top Banner", icon: Icons.Bell, color: "text-amber-400", border: "hover:border-amber-500/40", to: "announcements" },
                  { title: "Team Members", count: team.length, sub: "Chapter Executive & Web", icon: Icons.Users, color: "text-emerald-400", border: "hover:border-emerald-500/40", to: "team" },
                  { title: "Member Applications", count: membershipApps.length, sub: `${pendingAppsCount} Requiring Action`, icon: Icons.User, color: "text-cyan-400", border: "hover:border-cyan-500/40", to: "applications" },
                  { title: "Authorized Admins", count: allowlistEmails.length, sub: "Official SSN Roster", icon: Icons.Shield, color: "text-amber-400", border: "hover:border-amber-500/40", to: "admins" },
                  { title: "Audit Trail Logs", count: logs.length, sub: "Recent Recorded Actions", icon: Icons.Globe, color: "text-slate-400", border: "hover:border-slate-500/40", to: "activity_log" },
                ].map((stat, i) => {
                  const IconComp = stat.icon
                  return (
                    <div
                      key={i}
                      onClick={() => setActiveTab(stat.to as any)}
                      className={`p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${stat.border}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-sans-ui text-xs font-semibold text-slate-400">
                          {stat.title}
                        </span>
                        <div className={`p-2 rounded-xl bg-slate-800/80 ${stat.color}`}>
                          <IconComp size={16} />
                        </div>
                      </div>
                      <div className="font-display font-extrabold text-2xl text-white">
                        {stat.count}
                      </div>
                      <span className="text-[11px] font-sans-ui text-slate-400">
                        {stat.sub}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Quick Action Shortcuts Panel */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h3 className="font-display font-bold text-lg text-white">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => {
                      setEditingEvent(null)
                      setEventForm({
                        title: "",
                        category: "Workshop",
                        date: "",
                        time: "",
                        startTime: "",
                        endTime: "",
                        location: "SSN Central Auditorium",
                        mode: "In-Person",
                        description: "",
                        featured: true,
                        status: "upcoming",
                        published: true,
                      })
                      setEventModalOpen(true)
                    }}
                    className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left font-sans-ui text-xs font-semibold text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Icons.Plus size={16} className="text-amber-400" />
                    <span>Create Event</span>
                  </button>

                  <button
                    onClick={() => setGalleryModalOpen(true)}
                    className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left font-sans-ui text-xs font-semibold text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Icons.Gallery size={16} className="text-purple-400" />
                    <span>Upload Gallery Media</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingAnnouncement(null)
                      setAnnouncementForm({
                        text: "",
                        ctaText: "Register Now",
                        ctaUrl: "",
                        priority: "normal",
                        status: "active",
                        startDate: new Date().toISOString().split("T")[0],
                        expiryDate: "",
                        active: true,
                      })
                      setAnnouncementModalOpen(true)
                    }}
                    className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left font-sans-ui text-xs font-semibold text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Icons.Bell size={16} className="text-blue-400" />
                    <span>Broadcast Alert</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("inquiries")}
                    className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left font-sans-ui text-xs font-semibold text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Icons.Mail size={16} className="text-emerald-400" />
                    <span>Review Inbox ({pendingInquiriesCount})</span>
                  </button>
                </div>
              </div>

              {/* Two Column Layout: Recent Activity & Upcoming Events */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity Audit Feed */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icons.Globe size={18} className="text-amber-400" />
                      <h3 className="font-display font-bold text-base text-white">
                        Recent Activity Log
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab("activity_log")}
                      className="text-xs font-sans-ui font-semibold text-amber-400 hover:underline cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {logs.slice(0, 4).map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white truncate">{log.action}</span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-slate-800 text-slate-300">
                              {log.category}
                            </span>
                          </div>
                          {log.targetTitle && (
                            <p className="text-[11px] font-sans-ui text-amber-400/90 truncate">
                              "{log.targetTitle}"
                            </p>
                          )}
                          <p className="text-[10px] font-mono text-slate-400 truncate">
                            By {log.adminEmail}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {log.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Events Spotlight */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icons.Calendar size={18} className="text-blue-400" />
                      <h3 className="font-display font-bold text-base text-white">
                        Upcoming Chapter Events
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab("events")}
                      className="text-xs font-sans-ui font-semibold text-amber-400 hover:underline cursor-pointer"
                    >
                      Manage Events →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {upcomingEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400">
                              {event.category}
                            </span>
                            <span className="text-[11px] font-sans-ui text-slate-400 font-semibold truncate">
                              {event.date}
                            </span>
                          </div>
                          <h4 className="font-display font-bold text-xs text-white truncate">
                            {event.title}
                          </h4>
                          <p className="text-[10px] font-sans-ui text-slate-400 truncate flex items-center gap-1">
                            <Icons.MapPin size={10} className="shrink-0" /> {event.location} • {event.mode}
                          </p>
                        </div>

                        <span className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                          Upcoming
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 2: ANNOUNCEMENT MANAGER
             ===================================================================== */}
          {activeTab === "announcements" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    Announcement & Ticker CMS
                  </h2>
                  <p className="font-sans-ui text-xs text-slate-400">
                    Broadcast urgent alerts, registration deadlines, and news to the top banner across the website.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingAnnouncement(null)
                    setAnnouncementForm({
                      text: "",
                      ctaText: "Learn More",
                      ctaUrl: "",
                      priority: "normal",
                      status: "active",
                      startDate: new Date().toISOString().split("T")[0],
                      expiryDate: "",
                      active: true,
                    })
                    setAnnouncementModalOpen(true)
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold text-black bg-amber-400 hover:bg-amber-300 shadow-md active:scale-95 cursor-pointer"
                >
                  <Icons.Plus size={14} /> New Announcement
                </button>
              </div>

              {/* Live Preview Widget */}
              {announcements.find(a => a.active) && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    ● Live Website Top Banner Preview:
                  </span>
                  <div
                    className="p-3 rounded-xl flex items-center justify-between gap-3 text-xs text-white"
                    style={{
                      background: announcements.find(a => a.active)?.priority === "high"
                        ? "linear-gradient(90deg, #991b1b, #7f1d1d)"
                        : "linear-gradient(90deg, #1e3a8a, #0f172a)",
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                      <span className="font-medium truncate">{announcements.find(a => a.active)?.text}</span>
                    </div>
                    {announcements.find(a => a.active)?.ctaUrl && (
                      <span className="text-amber-200 underline font-semibold text-[11px] shrink-0">
                        {announcements.find(a => a.active)?.ctaText || "Learn More"} →
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Announcements List */}
              <div className="space-y-3">
                {announcements.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                    <Icons.Bell size={32} className="text-slate-600 mx-auto" />
                    <h4 className="font-display font-bold text-white">No Announcements Published</h4>
                    <p className="text-xs text-slate-400">Post a new announcement to show an alert banner on the public site.</p>
                  </div>
                ) : (
                  announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            ann.priority === "high" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                          }`}>
                            {ann.priority} Alert
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            ann.active ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                          }`}>
                            {ann.active ? "Active" : "Draft / Inactive"}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">Created: {ann.createdAt}</span>
                          {ann.expiryDate && (
                            <span className="text-[11px] font-mono text-slate-400">Expires: {ann.expiryDate}</span>
                          )}
                        </div>
                        <p className="font-sans-ui text-sm font-medium text-white">{ann.text}</p>
                        {ann.ctaUrl && (
                          <p className="text-xs font-mono text-amber-400 truncate">
                            CTA: {ann.ctaText || "Learn More"} ({ann.ctaUrl})
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => saveAnnouncement({ ...ann, active: !ann.active })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-sans-ui font-semibold cursor-pointer ${
                            ann.active ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                        >
                          {ann.active ? "Deactivate" : "Publish"}
                        </button>
                        <button
                          onClick={() => {
                            setEditingAnnouncement(ann)
                            setAnnouncementForm(ann)
                            setAnnouncementModalOpen(true)
                          }}
                          className="p-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer"
                          title="Edit Announcement"
                        >
                          <Icons.Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteAnnouncementClick(ann)}
                          className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/15 cursor-pointer"
                          title="Delete Announcement"
                        >
                          <Icons.Trash size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 3: EVENTS MANAGER
             ===================================================================== */}
          {activeTab === "events" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    Chapter Events CMS
                  </h2>
                  <p className="font-sans-ui text-xs text-slate-400">
                    Publish, duplicate, edit, or archive chapter workshops, symposiums, guest lectures, and hackathons.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingEvent(null)
                    setEventForm({
                      title: "",
                      category: "Workshop",
                      date: "",
                      time: "",
                      startTime: "",
                      endTime: "",
                      location: "SSN Central Auditorium",
                      mode: "In-Person",
                      description: "",
                      featured: true,
                      status: "upcoming",
                      published: true,
                    })
                    setEventModalOpen(true)
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold text-black bg-amber-400 hover:bg-amber-300 shadow-md active:scale-95 cursor-pointer"
                >
                  <Icons.Plus size={14} /> Add Event
                </button>
              </div>

              {/* Search & Filters Strip */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
                  <input
                    type="text"
                    placeholder="Search events by title, speaker, or location..."
                    value={eventSearch}
                    onChange={(e) => setEventSearch(e.target.value)}
                    className="px-3.5 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 min-w-[220px] flex-1"
                  />

                  <select
                    value={eventCategoryFilter}
                    onChange={(e) => setEventCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-300 outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Symposium">Symposium</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Conference">Conference</option>
                    <option value="Chapter Event">Chapter Event</option>
                  </select>

                  <select
                    value={eventStatusFilter}
                    onChange={(e) => setEventStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-300 outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed / Past</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setEventViewMode("grid")}
                    className={`p-1.5 rounded-lg text-xs ${eventViewMode === "grid" ? "bg-slate-800 text-amber-400" : "text-slate-400"}`}
                    title="Grid View"
                  >
                    <Icons.Gallery size={14} />
                  </button>
                  <button
                    onClick={() => setEventViewMode("table")}
                    className={`p-1.5 rounded-lg text-xs ${eventViewMode === "table" ? "bg-slate-800 text-amber-400" : "text-slate-400"}`}
                    title="Table View"
                  >
                    <Icons.About size={14} />
                  </button>
                </div>
              </div>

              {/* Events Display */}
              {filteredEvents.length === 0 ? (
                <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                  <Icons.Calendar size={32} className="text-slate-600 mx-auto" />
                  <h4 className="font-display font-bold text-white">No Matching Events Found</h4>
                  <p className="text-xs text-slate-400">Try clearing search filters or create a new chapter event.</p>
                </div>
              ) : eventViewMode === "grid" ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            {event.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            event.status === "upcoming" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                          }`}>
                            {event.status}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-base text-white leading-snug">
                          {event.title}
                        </h3>
                        <p className="text-xs text-amber-400 font-sans-ui font-semibold flex items-center gap-1">
                          <Icons.Calendar size={12} /> {event.date} {event.time && `• ${event.time}`}
                        </p>
                        <p className="text-xs text-slate-400 font-sans-ui line-clamp-2">
                          {event.description}
                        </p>
                        {event.speaker && (
                          <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                            <Icons.Mic size={11} /> Speaker: {event.speaker}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingEvent(event)
                              setEventForm(event)
                              setEventModalOpen(true)
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-sans-ui font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDuplicateEvent(event.id)}
                            className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
                            title="Duplicate Event"
                          >
                            <Icons.Copy size={13} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteEventClick(event)}
                          className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/15 cursor-pointer"
                          title="Delete Event"
                        >
                          <Icons.Trash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Title</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Date & Venue</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredEvents.map((event) => (
                        <tr key={event.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5 font-bold text-white">{event.title}</td>
                          <td className="p-3.5 text-amber-400 font-mono">{event.category}</td>
                          <td className="p-3.5 text-slate-300">{event.date} • {event.location}</td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              event.status === "upcoming" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                            }`}>
                              {event.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-1.5">
                            <button
                              onClick={() => {
                                setEditingEvent(event)
                                setEventForm(event)
                                setEventModalOpen(true)
                              }}
                              className="p-1 text-slate-300 hover:text-white"
                            >
                              <Icons.Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteEventClick(event)}
                              className="p-1 text-red-400 hover:text-red-300"
                            >
                              <Icons.Trash size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              TAB 4: GALLERY MANAGER
             ===================================================================== */}
          {activeTab === "gallery" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    Gallery Media CMS
                  </h2>
                  <p className="font-sans-ui text-xs text-slate-400">
                    Upload and categorize photo moments from symposiums, hackathons, and technical workshops.
                  </p>
                </div>

                <button
                  onClick={() => setGalleryModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold text-black bg-amber-400 hover:bg-amber-300 shadow-md active:scale-95 cursor-pointer"
                >
                  <Icons.Plus size={14} /> Add Gallery Image
                </button>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredGallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden flex flex-col justify-between relative group hover:border-amber-500/50 transition-colors shadow-sm"
                  >
                    <div className="h-40 overflow-hidden relative bg-slate-950">
                      <img src={photo.url} alt={photo.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <button
                        onClick={() => handleDeleteGalleryClick(photo)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-red-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                        title="Delete Photo"
                      >
                        <Icons.Trash size={13} />
                      </button>
                      {photo.featured && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500 text-black">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-3 space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-amber-400">
                        {photo.category}
                      </span>
                      <h4 className="font-display font-semibold text-xs text-white truncate">
                        {photo.label}
                      </h4>
                      {photo.date && (
                        <p className="text-[10px] font-mono text-slate-400">{photo.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 5: TEAM MANAGER
             ===================================================================== */}
          {activeTab === "team" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    Student Chapter Team CMS
                  </h2>
                  <p className="font-sans-ui text-xs text-slate-400">
                    Manage Web Development engineers, executive committee office bearers, and technical leads displayed on the About page.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingTeamMember(null)
                    setTeamForm({
                      name: "",
                      role: "",
                      teamType: "Office Bearers",
                      department: "",
                      year: "BME III Year",
                      chapter: "SSIT_2026",
                      quote: "",
                      email: "",
                      bio: "",
                      photo: "",
                      active: true,
                      order: team.length + 1,
                    })
                    setTeamModalOpen(true)
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold text-black bg-amber-400 hover:bg-amber-300 shadow-md active:scale-95 cursor-pointer"
                >
                  <Icons.Plus size={14} /> Add Team Member
                </button>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Icons.Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by name, role, department, or email..."
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                  {["all", "Office Bearers", "Web Development", "Executive", "Events", "Design & Media", "Editorial"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setTeamTypeFilter(type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        teamTypeFilter === type
                          ? "bg-amber-400 text-black font-bold shadow-sm"
                          : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      {type === "all" ? "All Groups" : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Team Roster Grid */}
              {filteredTeam.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <Icons.Users size={32} className="mx-auto text-slate-600" />
                  <h4 className="font-display font-bold text-sm text-slate-300">No team members match the search</h4>
                  <p className="text-xs text-slate-500">Try adjusting your search criteria or add a new team member.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTeam.map((member) => (
                    <div
                      key={member.id}
                      className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3.5 shadow-sm hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start gap-3.5">
                        {member.photo && member.photo.trim() !== "" ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0"
                          />
                        ) : (
                          <div
                            className="w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center font-display font-bold text-base tracking-wider border shadow-sm"
                            style={{
                              background: member.teamType === "Office Bearers"
                                ? "linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(245, 158, 11, 0.3))"
                                : "linear-gradient(135deg, rgba(14, 165, 233, 0.3), rgba(99, 102, 241, 0.3))",
                              borderColor: member.teamType === "Office Bearers" ? "rgba(245, 158, 11, 0.4)" : "rgba(14, 165, 233, 0.4)",
                              color: member.teamType === "Office Bearers" ? "rgb(251, 191, 36)" : "rgb(56, 189, 248)",
                            }}
                          >
                            {getMemberInitials(member.name)}
                          </div>
                        )}

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider border ${
                              member.teamType === "Office Bearers"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                : "bg-sky-500/20 text-sky-300 border-sky-500/30"
                            }`}>
                              {member.teamType}
                            </span>
                            {member.order !== undefined && (
                              <span className="text-[10px] font-mono text-slate-500">#{member.order}</span>
                            )}
                          </div>
                          <h4 className="font-display font-bold text-sm text-white truncate">
                            {member.name}
                          </h4>
                          <p className="text-xs text-amber-300 font-sans-ui truncate">{member.role}</p>
                          <p className="text-[11px] text-slate-400 font-sans-ui truncate">
                            {member.year}
                          </p>
                          {member.email ? (
                            <p className="text-[10px] font-mono text-slate-400 truncate">{member.email}</p>
                          ) : (
                            <p className="text-[10px] font-mono text-slate-600 italic">No email set</p>
                          )}
                        </div>
                      </div>

                      {(member.quote || member.bio) && (
                        <p className="text-[11px] text-slate-300 line-clamp-2 italic font-sans-ui p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                          “{member.quote || member.bio}”
                        </p>
                      )}

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        {/* Reorder Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveTeamMember(member, "up")}
                            className="p-1 rounded-lg border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 text-xs cursor-pointer"
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleMoveTeamMember(member, "down")}
                            className="p-1 rounded-lg border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 text-xs cursor-pointer"
                            title="Move Down"
                          >
                            ▼
                          </button>
                        </div>

                        {/* Edit and Delete Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingTeamMember(member)
                              setTeamForm(member)
                              setTeamModalOpen(true)
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-sans-ui font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTeamClick(member)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Remove Member"
                          >
                            <Icons.Trash size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              TAB 6: ABOUT & FOCUS AREAS CMS
             ===================================================================== */}
          {activeTab === "about_cms" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  Chapter Information & Mission CMS
                </h2>
                <p className="font-sans-ui text-xs text-slate-400">
                  Update the official mission, vision, philosophy, and focus working groups displayed on the About page.
                </p>
              </div>

              <form onSubmit={handleSaveChapterInfo} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-amber-400">Chapter Title</label>
                    <input
                      type="text"
                      value={chapterForm.chapterName}
                      onChange={(e) => {
                        setChapterForm({ ...chapterForm, chapterName: e.target.value })
                        setChapterFormDirty(true)
                      }}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-amber-400">Tagline</label>
                    <input
                      type="text"
                      value={chapterForm.tagline}
                      onChange={(e) => {
                        setChapterForm({ ...chapterForm, tagline: e.target.value })
                        setChapterFormDirty(true)
                      }}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Mission Statement</label>
                  <textarea
                    rows={3}
                    value={chapterForm.mission}
                    onChange={(e) => {
                      setChapterForm({ ...chapterForm, mission: e.target.value })
                      setChapterFormDirty(true)
                    }}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Vision Statement</label>
                  <textarea
                    rows={3}
                    value={chapterForm.vision}
                    onChange={(e) => {
                      setChapterForm({ ...chapterForm, vision: e.target.value })
                      setChapterFormDirty(true)
                    }}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-sans-ui text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 shadow-md cursor-pointer"
                  >
                    Save Chapter Information
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =====================================================================
              TAB 7: MEMBERSHIP & FAQS CMS
             ===================================================================== */}
          {activeTab === "membership_cms" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  Membership Content & FAQs CMS
                </h2>
                <p className="font-sans-ui text-xs text-slate-400">
                  Manage the 3-step membership roadmap, member benefits, external IEEE URLs, and chapter FAQs.
                </p>
              </div>

              {/* Membership Form */}
              <form onSubmit={handleSaveMembershipInfo} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Official IEEE Portal Join Link</label>
                  <input
                    type="url"
                    value={membershipForm.joinPortalUrl}
                    onChange={(e) => setMembershipForm({ ...membershipForm, joinPortalUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 cursor-pointer"
                  >
                    Save Portal Links
                  </button>
                </div>
              </form>

              {/* FAQs Section */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-white">
                    Frequently Asked Questions ({membershipForm.faqs.length})
                  </h3>
                  <button
                    onClick={() => {
                      setFaqForm({ question: "", answer: "", active: true, order: membershipForm.faqs.length + 1 })
                      setFaqModalOpen(true)
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 cursor-pointer"
                  >
                    + Add FAQ
                  </button>
                </div>

                <div className="space-y-3">
                  {membershipForm.faqs.map((faq) => (
                    <div key={faq.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-xs text-white">{faq.question}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{faq.answer}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-1.5 text-red-400 hover:text-red-300"
                        title="Delete FAQ"
                      >
                        <Icons.Trash size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 8: INQUIRIES & CONTACT INBOX
             ===================================================================== */}
          {activeTab === "inquiries" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    Contact & Help Inbox
                  </h2>
                  <p className="font-sans-ui text-xs text-slate-400">
                    Incoming general inquiries, speaker invitations, and sponsorship requests submitted via /contact.
                  </p>
                </div>
              </div>

              {/* Status Filter Badges */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: `All (${submissions.length})` },
                  { id: "new", label: `New (${submissions.filter(s => s.status === "new").length})` },
                  { id: "reviewed", label: `Reviewed (${submissions.filter(s => s.status === "reviewed").length})` },
                  { id: "resolved", label: `Resolved (${submissions.filter(s => s.status === "resolved").length})` },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setInquiryStatusFilter(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      inquiryStatusFilter === s.id
                        ? "bg-amber-400 text-black font-bold"
                        : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Inquiries List */}
              <div className="space-y-3">
                {filteredInquiries.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                    <Icons.Mail size={32} className="text-slate-600 mx-auto" />
                    <h4 className="font-display font-bold text-white">No Messages Found</h4>
                    <p className="text-xs text-slate-400">The inbox is currently clear for this filter.</p>
                  </div>
                ) : (
                  filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-sm hover:border-slate-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <h4 className="font-display font-bold text-sm text-white">{inq.name}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            {inq.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={inq.status}
                            onChange={(e) => handleStatusChange(inq.id, e.target.value as SubmissionStatus)}
                            className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-slate-950 border border-slate-800 text-slate-300 outline-none"
                          >
                            <option value="new">Status: New</option>
                            <option value="reviewed">Status: Reviewed</option>
                            <option value="resolved">Status: Resolved</option>
                            <option value="archived">Status: Archived</option>
                          </select>

                          <a
                            href={`mailto:${inq.email}?subject=IEEE SSIT SSN Chapter Response to Your Inquiry`}
                            className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                            title="Reply via Email"
                          >
                            <Icons.Mail size={14} />
                          </a>

                          <button
                            onClick={() => handleDeleteInquiryClick(inq)}
                            className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/15"
                            title="Delete Inquiry"
                          >
                            <Icons.Trash size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-2 text-xs text-slate-400 font-sans-ui">
                        <p className="flex items-center gap-1.5"><Icons.Mail size={12} /> <strong className="font-mono text-slate-200">{inq.email}</strong></p>
                        <p className="flex items-center gap-1.5"><Icons.GraduationCap size={12} /> {inq.department || "General"}</p>
                        <p className="flex items-center gap-1.5"><Icons.Clock size={12} /> {inq.timestamp}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950 text-xs text-slate-300 leading-relaxed font-sans-ui border border-slate-800/60">
                        {inq.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 8.5: NEWSLETTER SUBSCRIBERS
             ===================================================================== */}
          {activeTab === "newsletter" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    Newsletter Subscribers
                  </h2>
                  <p className="font-sans-ui text-xs text-slate-400">
                    Emails collected from the footer signup form. {subscribers.length} total.
                  </p>
                </div>
                {subscribers.length > 0 && (
                  <button
                    onClick={() => {
                      const csv = "email,subscribed_at\n" + subscribers.map(s => `${s.email},${s.timestamp}`).join("\n")
                      const blob = new Blob([csv], { type: "text/csv" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = "newsletter_subscribers.csv"
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-sans-ui font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                  >
                    Export CSV
                  </button>
                )}
              </div>

              {subscribersLoading ? (
                <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
                  Loading subscribers...
                </div>
              ) : subscribers.length === 0 ? (
                <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                  <Icons.MessageCircle size={32} className="text-slate-600 mx-auto" />
                  <h4 className="font-display font-bold text-white">No Subscribers Yet</h4>
                  <p className="text-xs text-slate-400">Emails submitted via the site footer will appear here.</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="divide-y divide-slate-800">
                    {subscribers.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between gap-3 p-4 bg-slate-900/60 hover:bg-slate-900 transition-colors">
                        <span className="font-mono text-xs text-slate-200 truncate">{sub.email}</span>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[11px] text-slate-500">{new Date(sub.timestamp).toLocaleDateString()}</span>
                          <button
                            onClick={async () => {
                              await deleteNewsletterSubscriber(sub.id)
                              showToast("Subscriber removed", "success")
                            }}
                            className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/15"
                            title="Remove Subscriber"
                          >
                            <Icons.Trash size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              TAB 9: MEMBERSHIP APPLICATIONS PIPELINE
             ===================================================================== */}
          {activeTab === "applications" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  Membership Intake Pipeline
                </h2>
                <p className="font-sans-ui text-xs text-slate-400">
                  Student membership registration submissions received from the /contact form.
                </p>
              </div>

              <div className="space-y-3">
                {filteredApplications.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                    <Icons.Users size={32} className="text-slate-600 mx-auto" />
                    <h4 className="font-display font-bold text-white">No Membership Applications Yet</h4>
                    <p className="text-xs text-slate-400">Students applying through the membership form will appear here.</p>
                  </div>
                ) : (
                  filteredApplications.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <h4 className="font-display font-bold text-sm text-white">{app.name}</h4>
                          <p className="text-xs font-mono text-slate-400">{app.email} • {app.department}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value as SubmissionStatus)}
                            className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-slate-950 border border-slate-800 text-slate-300 outline-none"
                          >
                            <option value="new">Status: New</option>
                            <option value="under_review">Status: Under Review</option>
                            <option value="approved">Status: Approved</option>
                            <option value="contacted">Status: Contacted</option>
                            <option value="rejected">Status: Rejected</option>
                          </select>

                          <a
                            href={`mailto:${app.email}?subject=IEEE SSIT SSN Chapter Membership Application`}
                            className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                          >
                            <Icons.Mail size={14} />
                          </a>
                        </div>
                      </div>

                      {app.interest && (
                        <p className="text-xs text-amber-400 font-sans-ui">
                          <strong>Area of Interest:</strong> {app.interest}
                        </p>
                      )}

                      <div className="p-3.5 rounded-xl bg-slate-950 text-xs text-slate-300 leading-relaxed font-sans-ui border border-slate-800/60">
                        {app.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 10: ADMINS & PERMISSIONS
             ===================================================================== */}
          {activeTab === "admins" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    Authorized Administrator Roster
                  </h2>
                  <p className="font-sans-ui text-xs text-slate-400">
                    Only these official @ssn.edu.in accounts are granted the Admin role to modify chapter content.
                  </p>
                </div>

                <button
                  onClick={() => setAddAdminModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold text-black bg-amber-400 hover:bg-amber-300 shadow-md active:scale-95 cursor-pointer"
                >
                  <Icons.Plus size={14} /> Add Admin Email
                </button>
              </div>

              {/* Admins Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">#</th>
                      <th className="p-3.5">Admin Email</th>
                      <th className="p-3.5">Added By</th>
                      <th className="p-3.5">Date Added</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredAdmins.map((adm, idx) => (
                      <tr key={adm.email} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-mono text-slate-500">{idx + 1}</td>
                        <td className="p-3.5 font-mono font-bold text-white">{adm.email}</td>
                        <td className="p-3.5 text-slate-400">{adm.addedBy || "Core System"}</td>
                        <td className="p-3.5 text-slate-400 font-mono">{adm.addedAt || "2025-01-01"}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Active Admin
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleRemoveAdminClick(adm.email)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                            title="Revoke Admin"
                          >
                            <Icons.Trash size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 11: ACTIVITY LOG
             ===================================================================== */}
          {activeTab === "activity_log" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    Activity Audit Log
                  </h2>
                  <p className="font-sans-ui text-xs text-slate-400">
                    Chronological audit trail of all content and permission changes made in this dashboard.
                  </p>
                </div>

                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  className="px-3.5 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-2.5">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{log.action}</span>
                        <span className="px-2 py-0.2 rounded text-[10px] font-mono uppercase bg-amber-500/15 text-amber-400">
                          {log.category}
                        </span>
                      </div>
                      {log.targetTitle && (
                        <p className="text-xs text-slate-300 font-sans-ui">"{log.targetTitle}"</p>
                      )}
                      {log.details && (
                        <p className="text-[11px] text-slate-400 font-sans-ui">{log.details}</p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-mono text-slate-300">{log.adminEmail}</p>
                      <p className="text-[10px] font-mono text-slate-400">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 12: SETTINGS & METADATA
             ===================================================================== */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  System Settings & Security Metadata
                </h2>
                <p className="font-sans-ui text-xs text-slate-400">
                  Review Firebase project connection status and security policy parameters.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h3 className="font-display font-bold text-base text-white">
                  Backend Architecture & Storage Status
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Authentication</span>
                    <p className="font-bold text-white font-mono">Firebase Google OAuth</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">REST API Layer</span>
                    <p className="font-bold text-emerald-400 font-mono">FastAPI (Connected)</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Application Database</span>
                    <p className="font-bold text-emerald-400 font-mono">PostgreSQL (SQLAlchemy)</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Asset Storage</span>
                    <p className="font-bold text-amber-400 font-mono">Supabase Storage (ieee-ssit-assets)</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Admin Authorization</span>
                    <p className="font-bold text-amber-400 font-mono">Server-side @ssn.edu.in Token Validation</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Audit Trail</span>
                    <p className="font-bold text-white font-mono">PostgreSQL activity_logs</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* =========================================================================
          MODALS & DRAWERS
         ========================================================================= */}

      {/* EVENT MODAL */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-2xl w-full p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-display font-bold text-xl text-white">
                {editingEvent ? "Edit Chapter Event" : "Create New Chapter Event"}
              </h3>
              <button onClick={() => setEventModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <Icons.X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-amber-400">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Ethics in Healthcare"
                  value={eventForm.title || ""}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Symposium">Symposium</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Conference">Conference</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Chapter Event">Chapter Event</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Mode</label>
                  <select
                    value={eventForm.mode}
                    onChange={(e) => setEventForm({ ...eventForm, mode: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                  >
                    <option value="In-Person">In-Person</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. March 15, 2025"
                    value={eventForm.date || ""}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Time Range</label>
                  <input
                    type="text"
                    placeholder="e.g. 2:00 PM – 4:30 PM"
                    value={eventForm.time || ""}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Venue / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. SSN Central Auditorium"
                    value={eventForm.location || ""}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Registration Deadline</label>
                  <input
                    type="text"
                    placeholder="e.g. March 14, 2025"
                    value={eventForm.deadline || ""}
                    onChange={(e) => setEventForm({ ...eventForm, deadline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Speaker Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. K. Swaminathan"
                    value={eventForm.speaker || ""}
                    onChange={(e) => setEventForm({ ...eventForm, speaker: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Speaker Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. IIT Madras AI Ethics Lab"
                    value={eventForm.speakerRole || ""}
                    onChange={(e) => setEventForm({ ...eventForm, speakerRole: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-amber-400">Registration URL (Google Form / Unstop)</label>
                <input
                  type="url"
                  placeholder="https://forms.gle/..."
                  value={eventForm.registerUrl || ""}
                  onChange={(e) => setEventForm({ ...eventForm, registerUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-amber-400">Cover Image</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="url"
                    placeholder="Image URL or upload below..."
                    value={eventForm.image || ""}
                    onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                  <label className="relative flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 cursor-pointer text-center">
                    {uploadingEventImage ? "Uploading to Storage..." : "📁 Upload to Supabase Storage"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEventImageUpload}
                      disabled={uploadingEventImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-amber-400">Event Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed description, agenda, and takeaways..."
                  value={eventForm.description || ""}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <label className="flex items-center gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={eventForm.featured || false}
                    onChange={(e) => setEventForm({ ...eventForm, featured: e.target.checked })}
                    className="rounded text-amber-400"
                  />
                  <span>Feature on Homepage Spotlight</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEventModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300"
                  >
                    Save Event
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY MODAL */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-xl text-white">Add Photo to Gallery</h3>
            <form onSubmit={handleSaveGallery} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-amber-400">Photo Caption *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Ethics Technical Workshop"
                  value={galleryForm.label || ""}
                  onChange={(e) => setGalleryForm({ ...galleryForm, label: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-amber-400">Photo Source *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="url"
                    required
                    placeholder="Image URL or upload below..."
                    value={galleryForm.url || ""}
                    onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                  <label className="relative flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 cursor-pointer text-center">
                    {uploadingGalleryPhoto ? "Uploading to Storage..." : "📁 Upload to Supabase Storage"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryImageUpload}
                      disabled={uploadingGalleryPhoto}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Category</label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Symposium">Symposium</option>
                    <option value="Campus">Campus</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Feb 2025"
                    value={galleryForm.date || ""}
                    onChange={(e) => setGalleryForm({ ...galleryForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300"
                >
                  Add Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT MODAL */}
      {announcementModalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-xl text-white">
              {editingAnnouncement ? "Edit Announcement" : "Broadcast Announcement"}
            </h3>

            <form onSubmit={handleSaveAnnouncement} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-amber-400">Announcement Text *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Registrations open for Envision 2025 Hackathon!"
                  value={announcementForm.text || ""}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, text: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Button CTA Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Register Now"
                    value={announcementForm.ctaText || ""}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, ctaText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">CTA Link / URL</label>
                  <input
                    type="text"
                    placeholder="e.g. /activities or https://..."
                    value={announcementForm.ctaUrl || ""}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, ctaUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Priority Banner</label>
                  <select
                    value={announcementForm.priority}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                  >
                    <option value="normal">Normal (Navy Banner)</option>
                    <option value="high">High Alert (Red Banner)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Expiry Date</label>
                  <input
                    type="date"
                    value={announcementForm.expiryDate || ""}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAnnouncementModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEAM MODAL */}
      {teamModalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl text-white">
                {editingTeamMember ? "Edit Team Member" : "Add Team Member"}
              </h3>
              <button
                onClick={() => setTeamModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <Icons.X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTeam} className="space-y-4">
              {/* Live Avatar Preview & Photo Controls */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                {teamForm.photo && teamForm.photo.trim() !== "" ? (
                  <img
                    src={teamForm.photo}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover border border-amber-500/40 shrink-0"
                  />
                ) : (
                  <div
                    className="w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center font-display font-bold text-xl tracking-wider border shadow-sm"
                    style={{
                      background: "linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(245, 158, 11, 0.2))",
                      borderColor: "rgba(245, 158, 11, 0.4)",
                      color: "rgb(251, 191, 36)",
                    }}
                  >
                    {getMemberInitials(teamForm.name)}
                  </div>
                )}

                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block">
                    {teamForm.photo ? "Custom Photo Active" : "Clean Placeholder Avatar"}
                  </span>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {teamForm.photo
                      ? "Custom photo is set. You can change or reset to placeholder below."
                      : "No photo set. Clean initials avatar will be shown on the public site."}
                  </p>
                  {teamForm.photo && (
                    <button
                      type="button"
                      onClick={() => setTeamForm({ ...teamForm, photo: "" })}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-sans-ui font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 cursor-pointer"
                    >
                      Remove Photo & Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Basic Details */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-amber-400">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S. Varun"
                  value={teamForm.name || ""}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Position / Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chair or Head"
                    value={teamForm.role || ""}
                    onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Team Group</label>
                  <select
                    value={teamForm.teamType}
                    onChange={(e) => setTeamForm({ ...teamForm, teamType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500/50"
                  >
                    <option value="Office Bearers">Office Bearers</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Executive">Executive</option>
                    <option value="Events">Events</option>
                    <option value="Design & Media">Design & Media</option>
                    <option value="Editorial">Editorial</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Academic Year *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BME III Year or M.Tech CSE III Year"
                    value={teamForm.year || ""}
                    onChange={(e) => setTeamForm({ ...teamForm, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Chapter Roster</label>
                  <input
                    type="text"
                    placeholder="e.g. SSIT_2026"
                    value={teamForm.chapter || "SSIT_2026"}
                    onChange={(e) => setTeamForm({ ...teamForm, chapter: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Official SSN Email (if known)</label>
                  <input
                    type="email"
                    placeholder="e.g. varun2410158@ssn.edu.in"
                    value={teamForm.email || ""}
                    onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-amber-400">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 1"
                    value={teamForm.order || 1}
                    onChange={(e) => setTeamForm({ ...teamForm, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* Photo Input (URL or Local File Upload) */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <label className="block text-xs font-semibold text-amber-400">Profile Photo Options</label>
                
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400">Option 1: Image URL</span>
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={teamForm.photo || ""}
                    onChange={(e) => setTeamForm({ ...teamForm, photo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400">
                    {uploadingTeamPhoto ? "Uploading photo to Supabase Storage..." : "Option 2: Upload Photo to Supabase Storage"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTeamImageUpload}
                    disabled={uploadingTeamPhoto}
                    className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-300 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-400 file:text-black hover:file:bg-amber-300 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-amber-400">Quote / Bio *</label>
                <textarea
                  rows={2}
                  placeholder='e.g. "Some inherit a league. Some dare to build one. I choose to be."'
                  value={teamForm.quote || teamForm.bio || ""}
                  onChange={(e) => setTeamForm({ ...teamForm, quote: e.target.value, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setTeamModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 cursor-pointer"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ADMIN MODAL */}
      {addAdminModalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-xl text-white">
              Authorize New Administrator
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter the student's official <strong>@ssn.edu.in</strong> Google account. They will be granted full CMS permissions.
            </p>

            <form onSubmit={handleAddAdminSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-amber-400">Student Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. username@ssn.edu.in"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddAdminModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300"
                >
                  Grant Admin Privileges
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ MODAL */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-xl text-white">Add Chapter FAQ</h3>
            <form onSubmit={handleSaveFaq} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-amber-400">Question</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Who is eligible to join SSIT?"
                  value={faqForm.question || ""}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-amber-400">Answer</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Clear answer for prospective students..."
                  value={faqForm.answer || ""}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-800 text-white outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFaqModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
