import { useState, useMemo, useEffect } from "react"
import { Link } from "react-router-dom"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { Icons } from "@/components/ui/Icons"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"
import {
  FLAGSHIP_2026_EVENTS,
  ARCHIVE_AND_SYMPOSIA_EVENTS,
  DetailedChapterEvent,
  isValidRegistrationUrl,
} from "@/data/chapterEventsData"

export default function Events() {
  useDocumentTitle("Chapter Events | IEEE SSIT SSN")

  const [activeFilter, setActiveFilter] = useState<"all" | "flagship" | "upcoming" | "completed">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<DetailedChapterEvent | null>(null)
  const [modalTab, setModalTab] = useState<"overview" | "rounds" | "rules">("overview")

  // Combine flagship 2026 events with archive events
  const allEvents = useMemo(() => {
    return [...FLAGSHIP_2026_EVENTS, ...ARCHIVE_AND_SYMPOSIA_EVENTS]
  }, [])

  // Filtered event list
  const filteredEvents = useMemo(() => {
    return allEvents.filter((ev) => {
      // Tab filter
      if (activeFilter === "flagship" && !ev.isFlagship) return false
      if (activeFilter === "upcoming" && ev.status !== "upcoming") return false
      if (activeFilter === "completed" && ev.status !== "completed") return false

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const titleMatch = ev.title.toLowerCase().includes(q)
        const subMatch = ev.subtitle?.toLowerCase().includes(q)
        const descMatch = ev.description.toLowerCase().includes(q)
        const trackMatch = ev.track?.toLowerCase().includes(q)
        const locMatch = ev.location.toLowerCase().includes(q)
        if (!titleMatch && !subMatch && !descMatch && !trackMatch && !locMatch) return false
      }
      return true
    })
  }, [allEvents, activeFilter, searchQuery])

  // ESC key closes event modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedEvent(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [selectedEvent])

  const openEventModal = (event: DetailedChapterEvent) => {
    setSelectedEvent(event)
    setModalTab("overview")
  }

  return (
    <div className="pt-28 md:pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto space-y-16">
      {/* 1. Header Banner & Status Matrix */}
      <div className="space-y-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
            IEEE SSIT STUDENT BRANCH CHAPTER · 2026 EVENT MATRIX
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
          SSN CHAPTER <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300">EVENT HUB</span>
        </h1>

        <p className="font-sans-ui text-sm md:text-base text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
          High-impact hackathons, algorithmic quests, and technology symposiums exploring the intersection of engineering excellence and societal responsibility.
        </p>

        {/* Status Callout Strip */}
        <div className="p-4 sm:p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Icons.Sparkles size={20} />
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
                Official Chapter Status · Spring 2026
              </div>
              <div className="font-display font-bold text-white text-base md:text-lg">
                2026 Flagship Registrations Opening Soon
              </div>
              <div className="font-sans-ui text-xs text-slate-400">
                Official Google Form submission links for Prompt-a-Thon & Digital Heist will be unlocked shortly.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30">
              UPCOMING SPRINT
            </span>
          </div>
        </div>
      </div>

      {/* 2. Flagship Events Priority Showcase */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <SectionLabel>2026 Main Events</SectionLabel>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-1">
              Flagship Challenges
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Priority spotlight on this season's signature IEEE SSIT SSN competitions.
            </p>
          </div>

          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            2 Signature Events
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {FLAGSHIP_2026_EVENTS.map((event) => {
            const isCyan = event.accentColor === "cyan"
            return (
              <div
                key={event.id}
                className={`relative rounded-3xl border p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-300 group hover:-translate-y-1 ${
                  isCyan
                    ? "border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 via-slate-900/60 to-slate-950/80 shadow-lg shadow-cyan-950/30 hover:border-cyan-400/70 hover:shadow-cyan-500/10"
                    : "border-amber-500/40 bg-gradient-to-b from-amber-950/20 via-slate-900/60 to-slate-950/80 shadow-lg shadow-amber-950/30 hover:border-amber-400/70 hover:shadow-amber-500/10"
                } backdrop-blur-xl`}
              >
                {/* Top Badge & Track */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase ${
                        isCyan
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {event.badge || "FLAGSHIP"}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-sans-ui font-semibold text-slate-300 bg-slate-800/80 border border-slate-700">
                      {event.category}
                    </span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 uppercase">
                    ● UPCOMING
                  </span>
                </div>

                {/* Event Heading & Tagline */}
                <div className="space-y-3">
                  <h3
                    className={`font-display text-2xl sm:text-3xl font-extrabold text-white transition-colors ${
                      isCyan ? "group-hover:text-cyan-300" : "group-hover:text-amber-300"
                    }`}
                  >
                    {event.title}
                  </h3>
                  <p className="font-sans-ui text-sm text-slate-300 font-light leading-relaxed">
                    {event.subtitle || event.description}
                  </p>
                </div>

                {/* Specs Matrix Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl border border-slate-800/80 bg-slate-950/60 font-mono text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 uppercase">Date</span>
                    <div className="text-white font-medium flex items-center gap-1.5">
                      <Icons.Calendar size={13} className={isCyan ? "text-cyan-400" : "text-amber-400"} />
                      <span>{event.date}</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 uppercase">Venue</span>
                    <div className="text-white font-medium flex items-center gap-1.5">
                      <Icons.MapPin size={13} className={isCyan ? "text-cyan-400" : "text-amber-400"} />
                      <span className="truncate">{event.location.split("/")[0]}</span>
                    </div>
                  </div>

                  <div className="space-y-0.5 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-500 uppercase">Squad Format</span>
                    <div className="text-white font-medium flex items-center gap-1.5">
                      <Icons.Users size={13} className={isCyan ? "text-cyan-400" : "text-amber-400"} />
                      <span className="truncate">{event.squadFormat || "Team"}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => openEventModal(event)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-semibold border border-slate-700 bg-slate-800/80 text-white hover:bg-slate-700 transition-all active:scale-[0.98]"
                  >
                    <Icons.BookOpen size={14} className={isCyan ? "text-cyan-400" : "text-amber-400"} />
                    <span>View Details & Rules</span>
                  </button>

                  {isValidRegistrationUrl(event.registerUrl) ? (
                    <a
                      href={event.registerUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold transition-all shadow-md active:scale-[0.98] ${
                        isCyan
                          ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-cyan-500/20"
                          : "bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-amber-500/20"
                      }`}
                    >
                      <span>Register Now →</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-semibold border border-slate-800 bg-slate-900/60 text-slate-400 cursor-not-allowed select-none"
                    >
                      <Icons.Clock size={14} className="text-amber-400/80" />
                      <span>Registration Opens Soon</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 3. Event Filter & Search Strip */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <SectionLabel>All Chapters & Symposia</SectionLabel>
            <h2 className="font-display text-2xl font-bold text-white mt-1">
              Events Matrix & Archives
            </h2>
          </div>

          <Link
            to="/activities"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View 2025 Global Conferences & Series</span> →
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Events" },
              { id: "flagship", label: "Flagship 2026" },
              { id: "upcoming", label: "Upcoming" },
              { id: "completed", label: "Concluded Archive" },
            ].map((tab) => {
              const isActive = activeFilter === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-sans-ui font-semibold transition-all ${
                    isActive
                      ? "bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                      : "border border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60"
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search event title, venue, track..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs font-sans-ui border border-slate-800 bg-slate-900/70 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/70"
            />
            <Icons.Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <Icons.X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Supplementary Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="p-12 rounded-3xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl text-center space-y-4 max-w-md mx-auto">
            <Icons.Calendar size={32} className="mx-auto text-slate-500" />
            <h3 className="font-display font-bold text-lg text-white">No Matching Events Found</h3>
            <p className="font-sans-ui text-xs text-slate-400">
              Try adjusting your search criteria or resetting filters to view all chapter initiatives.
            </p>
            <button
              onClick={() => {
                setActiveFilter("all")
                setSearchQuery("")
              }}
              className="px-4 py-2 rounded-xl text-xs font-sans-ui font-semibold border border-slate-700 bg-slate-800 text-white hover:bg-slate-700 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const isPast = event.status === "completed"
              return (
                <div
                  key={event.id}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 flex flex-col justify-between space-y-5 hover:border-slate-700 transition-all duration-300 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        {event.category}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                          isPast
                            ? "bg-slate-800/80 text-slate-400 border border-slate-700"
                            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {isPast ? "CONCLUDED" : "UPCOMING"}
                      </span>
                    </div>

                    <h4 className="font-display text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {event.title}
                    </h4>

                    <p className="font-sans-ui text-xs text-slate-400 font-light line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Icons.Calendar size={13} className="text-amber-400/80" />
                        <span>{event.date}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Icons.MapPin size={13} className="text-cyan-400/80" />
                        <span className="truncate max-w-[120px]">{event.location.split(",")[0]}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => openEventModal(event)}
                        className="flex-1 py-2 px-3 rounded-lg font-sans-ui text-[11px] font-semibold border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 transition-all text-center"
                      >
                        Details & Rules
                      </button>

                      {isValidRegistrationUrl(event.registerUrl) ? (
                        <a
                          href={event.registerUrl!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-lg font-sans-ui text-[11px] font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all text-center shadow-sm"
                        >
                          Register →
                        </a>
                      ) : isPast ? (
                        <span className="flex-1 py-2 px-3 rounded-lg font-sans-ui text-[11px] font-medium bg-slate-800/40 text-slate-500 border border-slate-800 text-center select-none">
                          Archived
                        </span>
                      ) : (
                        <span className="flex-1 py-2 px-3 rounded-lg font-sans-ui text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 text-center select-none">
                          Opens Soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* 4. Interactive Event Details Modal */}
      {selectedEvent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-700/80 bg-slate-900/95 shadow-2xl shadow-black/80 overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-7 border-b border-slate-800 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {selectedEvent.category}
                  </span>
                  {selectedEvent.isFlagship && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      FLAGSHIP 2026
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedEvent(null)}
                  aria-label="Close modal"
                  className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
                >
                  <Icons.X size={16} />
                </button>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {selectedEvent.title}
              </h3>
              {selectedEvent.subtitle && (
                <p className="font-sans-ui text-xs sm:text-sm text-slate-300 font-light">
                  {selectedEvent.subtitle}
                </p>
              )}
            </div>

            {/* Quick Specs Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-slate-950/60 border-b border-slate-800 font-mono text-[11px]">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">DATE & TIME</span>
                <span className="text-white font-medium truncate block">{selectedEvent.date}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">VENUE</span>
                <span className="text-white font-medium truncate block">{selectedEvent.location.split(",")[0]}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">SQUAD FORMAT</span>
                <span className="text-white font-medium truncate block">{selectedEvent.squadFormat || "Team"}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">AWARDS</span>
                <span className="text-amber-400 font-medium truncate block">{selectedEvent.prizePool || "Certificates"}</span>
              </div>
            </div>

            {/* Modal Internal Tabs */}
            <div className="flex border-b border-slate-800 px-6 pt-3 gap-2 bg-slate-900/60">
              {[
                { id: "overview", label: "Overview & Mission", icon: Icons.Target },
                { id: "rounds", label: "Rounds & Structure", icon: Icons.Sparkles },
                { id: "rules", label: "Rules & Guidelines", icon: Icons.Shield },
              ].map((tab) => {
                const isActive = modalTab === tab.id
                const IconComp = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id as any)}
                    className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-sans-ui font-semibold border-b-2 transition-all ${
                      isActive
                        ? "border-cyan-400 text-cyan-300"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <IconComp size={13} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Modal Tab Content Area */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 font-sans-ui text-sm text-slate-300">
              {modalTab === "overview" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 space-y-2">
                    <span className="text-xs font-mono font-semibold uppercase text-cyan-400">Event Briefing</span>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
                      {selectedEvent.overview || selectedEvent.description}
                    </p>
                  </div>

                  {selectedEvent.speaker && (
                    <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/40 flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                        <Icons.Mic size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase block">Featured Speaker / Mentor</span>
                        <span className="text-xs font-semibold text-white">{selectedEvent.speaker}</span>
                        {selectedEvent.speakerRole && (
                          <span className="text-xs text-slate-400 block">{selectedEvent.speakerRole}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {modalTab === "rounds" && (
                <div className="space-y-3">
                  {selectedEvent.rounds && selectedEvent.rounds.length > 0 ? (
                    selectedEvent.rounds.map((round, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-slate-800 bg-slate-950/50 space-y-1">
                        <span className="text-xs font-mono font-bold text-amber-400">{round.name}</span>
                        <p className="text-xs text-slate-400 leading-relaxed">{round.desc}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
                      Standard symposium session flow with technical presentation, code demonstrations, and Q&A jury review.
                    </div>
                  )}
                </div>
              )}

              {modalTab === "rules" && (
                <div className="space-y-3">
                  {selectedEvent.rules && selectedEvent.rules.length > 0 ? (
                    <ul className="space-y-2.5">
                      {selectedEvent.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>Open to all registered university delegates with valid college ID.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>Adherence to IEEE Code of Ethics and professional conduct is strictly enforced.</span>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-semibold border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-all"
              >
                Close
              </button>

              {isValidRegistrationUrl(selectedEvent.registerUrl) ? (
                <a
                  href={selectedEvent.registerUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shadow-md"
                >
                  <span>Register Now →</span>
                </a>
              ) : selectedEvent.status === "completed" ? (
                <span className="px-5 py-2.5 rounded-xl font-mono text-xs text-slate-500 uppercase">
                  Event Concluded
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-semibold border border-amber-500/30 bg-amber-500/10 text-amber-300">
                  <Icons.Clock size={13} />
                  <span>Registration Link Coming Soon</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
