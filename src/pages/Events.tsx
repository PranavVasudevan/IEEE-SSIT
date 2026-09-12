import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { solid, tint, navySolid } from "@/styles/colors"
import { Icons } from "@/components/ui/Icons"
import { useEvents } from "@/firebase/firestore"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"
import { EmptyState } from "@/components/ui/EmptyState"
import { CardSkeletonGrid } from "@/components/ui/Skeleton"

export default function Events() {
  useDocumentTitle("Chapter Events")
  const { events, loading: eventsLoading } = useEvents()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [eventsView, setEventsView] = useState<"upcoming" | "past">("upcoming")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (eventsView === "upcoming" && e.status !== "upcoming") return false
      if (eventsView === "past" && e.status !== "completed") return false
      if (selectedCategory !== "All" && e.category !== selectedCategory) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const titleMatch = e.title?.toLowerCase().includes(q)
        const descMatch = e.description?.toLowerCase().includes(q)
        const speakerMatch = e.speaker?.toLowerCase().includes(q)
        const locMatch = e.location?.toLowerCase().includes(q)
        if (!titleMatch && !descMatch && !speakerMatch && !locMatch) return false
      }
      return true
    })
  }, [events, eventsView, selectedCategory, searchQuery])

  const upcomingCount = useMemo(() => events.filter((e) => e.status === "upcoming").length, [events])
  const pastCount = useMemo(() => events.filter((e) => e.status === "completed").length, [events])

  return (
    <div className="pt-28 pb-20 px-4 md:px-8 space-y-12">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <SectionLabel>IEEE SSIT SSN Programs</SectionLabel>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight mt-1">
              Chapter Events & Symposia
            </h1>
            <p className="font-sans-ui text-xs md:text-sm text-slate-400 mt-2 max-w-xl">
              Workshops, technical guest lectures, hackathons, and symposiums hosted by the IEEE SSIT SSN Student Branch Chapter.
            </p>
          </div>

          <Link
            to="/activities"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-sans-ui font-semibold border border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-600 transition-all backdrop-blur-md shrink-0"
          >
            <Icons.Calendar size={14} className="text-cyan-400" />
            <span>Global 2025 Calendar & Series →</span>
          </Link>
        </div>

        {/* Filter & View Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {["All", "Workshop", "Symposium", "Hackathon", "Panel Discussion"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-sans-ui font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-cyan-400 text-slate-950 shadow-md font-bold"
                    : "border border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Upcoming/Past Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-7 py-1.5 rounded-xl text-xs font-sans-ui border border-slate-800 bg-slate-900/60 text-white outline-none focus:border-cyan-500/60 w-40 sm:w-48 placeholder:text-slate-500"
              />
              <Icons.Search size={13} className="absolute left-2.5 top-2.5 text-slate-500" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                >
                  <Icons.X size={12} />
                </button>
              )}
            </div>

            <div className="flex gap-1 p-1 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
              <button
                onClick={() => setEventsView("upcoming")}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans-ui font-semibold uppercase tracking-wider transition-all ${
                  eventsView === "upcoming"
                    ? "bg-cyan-400 text-slate-950 shadow-sm font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Upcoming ({upcomingCount})
              </button>
              <button
                onClick={() => setEventsView("past")}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans-ui font-semibold uppercase tracking-wider transition-all ${
                  eventsView === "past"
                    ? "bg-cyan-400 text-slate-950 shadow-sm font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Past ({pastCount})
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {eventsLoading ? (
          <CardSkeletonGrid count={3} />
        ) : filteredEvents.length === 0 ? (
          <div className="p-10 md:p-16 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Icons.Calendar size={26} />
            </div>
            <h3 className="font-display font-bold text-xl text-white">
              {eventsView === "past" ? "No Past Events Found" : "No Upcoming Events in this View"}
            </h3>
            <p className="font-sans-ui text-xs md:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
              {eventsView === "past"
                ? "Concluded chapter symposia and workshops will appear in the archive once completed."
                : "New chapter technical workshops and guest lectures are announced regularly. Check back soon!"}
            </p>
            {eventsView === "upcoming" && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedCategory("All")
                    setSearchQuery("")
                    setEventsView("past")
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-semibold border border-slate-700 bg-slate-800/80 text-white hover:bg-slate-700 transition-all"
                >
                  Browse Concluded Events ({pastCount}) →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-slate-800/90 bg-slate-900/40 backdrop-blur-xl overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/40"
              >
                {event.image && (
                  <div className="h-48 overflow-hidden relative border-b border-slate-800">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans-ui font-semibold text-white bg-slate-950/75 backdrop-blur-md border border-white/10">
                        {event.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-sans-ui font-bold uppercase tracking-wider ${
                          event.status === "upcoming"
                            ? "bg-emerald-500/90 text-white"
                            : "bg-slate-700/90 text-slate-200"
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                      <Icons.Calendar size={13} />
                      <span>{event.date}</span>
                      {event.time && <span className="text-slate-400">· {event.time}</span>}
                    </div>

                    <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                      {event.title}
                    </h3>

                    <p className="font-sans-ui text-xs text-slate-300 font-light leading-relaxed line-clamp-3">
                      {event.description}
                    </p>

                    {event.speaker && (
                      <p className="font-sans-ui text-[11px] font-medium text-cyan-400 flex items-center gap-1.5 pt-1">
                        <Icons.Mic size={12} />
                        <span>
                          {event.speaker}
                          {event.speaker_role ? ` (${event.speaker_role})` : ""}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Icons.MapPin size={11} className="text-slate-500" />
                      <span className="truncate max-w-[140px]">{event.location || "SSN Campus"}</span>
                    </span>

                    {event.registerUrl ? (
                      <a
                        href={event.registerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-lg text-xs font-sans-ui font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all font-bold shadow-sm"
                      >
                        Register →
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                        {event.status === "upcoming" ? "Open Session" : "Concluded"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
