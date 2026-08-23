import { useState } from "react"
import { SectionLabel } from "@/components/ui/SectionLabel"
import {
  conferenceSeries,
  conferenceCalendar2025,
  publications,
  standardsNote,
  socialChannelsNote,
} from "@/data/ssit"
import { solid, tint, navySolid } from "@/styles/colors"
import { Icons } from "@/components/ui/Icons"
import { useEvents } from "@/firebase/firestore"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"
import { EmptyState } from "@/components/ui/EmptyState"
import { CardSkeletonGrid } from "@/components/ui/Skeleton"

export default function Activities() {
  useDocumentTitle("Activities")
  const { events, loading: eventsLoading } = useEvents()
  const [activeTab, setActiveTab] = useState<"calendar" | "flagship" | "publications" | "chapterEvents">("calendar")
  const [calendarSearch, setCalendarSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [eventsView, setEventsView] = useState<"upcoming" | "past">("upcoming")

  const filteredCalendar = conferenceCalendar2025.filter(ev =>
    ev.name.toLowerCase().includes(calendarSearch.toLowerCase()) ||
    ev.location.toLowerCase().includes(calendarSearch.toLowerCase())
  )

  const filteredEvents = events.filter(e => {
    if (eventsView === "upcoming" && e.status !== "upcoming") return false
    if (eventsView === "past" && e.status !== "completed") return false
    if (selectedCategory === "All") return true
    return e.category === selectedCategory
  })

  return (
    <div className="pt-28 pb-20 px-4 md:px-8 space-y-12">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header & Sub-Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b" style={{ borderColor: tint("border", 0.6) }}>
          <div>
            <SectionLabel>Society Programs & Research</SectionLabel>
            <h1 className="font-display text-3xl md:text-5xl font-bold" style={{ color: solid("ink") }}>
              Conferences, Events & Publications
            </h1>
          </div>

          {/* Quick Sub-Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl border" style={{ background: solid("bgWarm"), borderColor: tint("border", 0.6) }}>
            {[
              { id: "calendar", label: "2025 Global Calendar", icon: Icons.Calendar },
              { id: "flagship", label: "Flagship Series", icon: Icons.Flag },
              { id: "chapterEvents", label: "Chapter Events", icon: Icons.Users },
              { id: "publications", label: "Publications & Standards", icon: Icons.BookOpen },
            ].map((tab) => {
              const IconComponent = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans-ui font-semibold transition-all duration-200"
                  style={{
                    background: isActive ? navySolid : "transparent",
                    color: isActive ? "#ffffff" : solid("muted"),
                    boxShadow: isActive ? `0 2px 8px ${tint("navy", 0.25)}` : "none",
                  }}
                >
                  <IconComponent size={13} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab 1: 2025 Calendar */}
        {activeTab === "calendar" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="font-sans-ui text-xs md:text-sm" style={{ color: solid("muted") }}>
                Global IEEE SSIT sponsored and co-sponsored international conferences across 2025.
              </p>
              <div className="relative max-w-xs w-full">
                <input
                  type="text"
                  placeholder="Search by conference or country..."
                  value={calendarSearch}
                  onChange={(e) => setCalendarSearch(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 rounded-xl text-xs font-sans-ui border outline-none focus:ring-2"
                  style={{ background: solid("bgWarm"), borderColor: tint("border", 0.8), color: solid("ink") }}
                />
                {calendarSearch && (
                  <button onClick={() => setCalendarSearch("")} className="absolute right-2.5 top-2.5 text-slate-400">
                    <Icons.X size={12} />
                  </button>
                )}
              </div>
            </div>

            {filteredCalendar.length === 0 ? (
              <EmptyState
                icon={Icons.Calendar}
                title="No conferences match your search"
                message={`Nothing found for "${calendarSearch}". Try a different conference name or country.`}
              />
            ) : (
            <div
              className="rounded-2xl border overflow-hidden shadow-sm"
              style={{ borderColor: tint("border", 0.6) }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans-ui text-xs">
                  <thead style={{ background: solid("bgWarm"), borderBottom: `1px solid ${tint("border", 0.6)}` }}>
                    <tr>
                      <th className="p-4 font-bold uppercase tracking-wider text-[11px]" style={{ color: solid("navy") }}>Dates</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-[11px]" style={{ color: solid("navy") }}>Conference Name</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-[11px]" style={{ color: solid("navy") }}>Location</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-[11px] text-right" style={{ color: solid("navy") }}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: tint("border", 0.4) }}>
                    {filteredCalendar.map((ev, i) => (
                      <tr key={i} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ background: solid("bg") }}>
                        <td className="p-4 font-mono font-medium whitespace-nowrap" style={{ color: solid("gold") }}>
                          {ev.dates}
                        </td>
                        <td className="p-4 font-display font-semibold text-sm" style={{ color: solid("ink") }}>
                          {ev.name}
                        </td>
                        <td className="p-4 whitespace-nowrap" style={{ color: solid("muted") }}>
                          <span className="inline-flex items-center gap-1">
                            <Icons.MapPin size={12} /> {ev.location}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <a
                            href="https://www.technologyandsociety.org"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold border hover:bg-black/5 dark:hover:bg-white/5"
                            style={{ borderColor: tint("border", 0.8), color: solid("ink") }}
                          >
                            Details <Icons.ExternalLink size={11} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </div>
        )}

        {/* Tab 2: Flagship Conferences */}
        {activeTab === "flagship" && (
          <div className="space-y-6">
            <p className="font-sans-ui text-sm" style={{ color: solid("muted") }}>
              IEEE SSIT's marquee conference series tackling global challenges from digital inclusion to ethical AI standards.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {conferenceSeries.map((c) => (
                <div
                  key={c.acronym}
                  className="p-6 rounded-2xl border flex flex-col justify-between space-y-4 shadow-sm"
                  style={{ background: solid("bgWarm"), borderColor: tint("border", 0.6) }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-xs font-sans-ui font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300">
                        {c.acronym}
                      </span>
                      {c.note && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-sans-ui uppercase tracking-wider font-bold text-amber-500">
                          <Icons.Flag size={10} /> Flagship
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-base leading-snug" style={{ color: solid("ink") }}>
                      {c.name}
                    </h3>
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: tint("border", 0.5) }}>
                    <span className="font-sans-ui text-[11px]" style={{ color: solid("muted") }}>
                      IEEE TAB / SSIT Sponsor
                    </span>
                    <a
                      href="https://www.technologyandsociety.org"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline flex items-center gap-1 font-semibold"
                      style={{ color: solid("navy") }}
                    >
                      Series Hub <Icons.ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Chapter Events (Firestore Synced) */}
        {activeTab === "chapterEvents" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {["All", "Workshop", "Symposium", "Hackathon", "Panel Discussion"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-sans-ui font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-amber-500 text-slate-950 shadow-sm"
                        : "border text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                    style={{ borderColor: tint("border", 0.6) }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex gap-1 p-1 rounded-xl border" style={{ borderColor: tint("border", 0.6), background: solid("bgWarm") }}>
                {(["upcoming", "past"] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => setEventsView(view)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-sans-ui font-semibold uppercase tracking-wider transition-all"
                    style={{
                      background: eventsView === view ? navySolid : "transparent",
                      color: eventsView === view ? "#ffffff" : solid("muted"),
                    }}
                  >
                    {view === "upcoming" ? "Upcoming" : "Past Events"}
                  </button>
                ))}
              </div>
            </div>

            {eventsLoading ? (
              <CardSkeletonGrid count={3} />
            ) : filteredEvents.length === 0 ? (
              <EmptyState
                icon={eventsView === "past" ? Icons.Clock : Icons.Calendar}
                title={eventsView === "past" ? "No past events archived yet" : "No upcoming events in this category"}
                message={
                  eventsView === "past"
                    ? "Completed chapter events will show up here once they've wrapped."
                    : "Try a different category, or check back soon — new events are added regularly."
                }
              />
            ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl"
                  style={{ background: solid("bgWarm"), borderColor: tint("border", 0.6) }}
                >
                  {event.image && (
                    <div className="h-44 overflow-hidden relative">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans-ui font-semibold text-white bg-black/60 backdrop-blur-md">
                          {event.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans-ui font-bold uppercase tracking-wider ${
                          event.status === "upcoming" ? "bg-emerald-500/90 text-white" : "bg-slate-700/90 text-slate-200"
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-sans-ui" style={{ color: solid("gold") }}>
                        <Icons.Calendar size={13} />
                        <span className="font-medium">{event.date}</span>
                      </div>
                      <h3 className="font-display font-bold text-base" style={{ color: solid("ink") }}>
                        {event.title}
                      </h3>
                      <p className="font-sans-ui text-xs leading-relaxed line-clamp-3" style={{ color: solid("muted") }}>
                        {event.description}
                      </p>
                      {event.speaker && (
                        <p className="font-sans-ui text-[11px] font-medium flex items-center gap-1" style={{ color: solid("navy") }}>
                          <Icons.Mic size={11} /> {event.speaker}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: tint("border", 0.5) }}>
                      <span className="text-[11px] flex items-center gap-1" style={{ color: solid("muted") }}>
                        <Icons.MapPin size={11} /> {event.location}
                      </span>
                      {event.registerUrl && (
                        <a
                          href={event.registerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg text-xs font-sans-ui font-semibold text-white transition-opacity hover:opacity-90"
                          style={{ background: navySolid }}
                        >
                          Register
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* Tab 4: Publications & Standards */}
        {activeTab === "publications" && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              {publications.map((p) => (
                <div
                  key={p.title}
                  className="p-6 rounded-2xl border flex flex-col justify-between space-y-4 shadow-sm"
                  style={{ background: solid("bgWarm"), borderColor: tint("border", 0.6) }}
                >
                  <div className="space-y-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-sans-ui font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300">
                      IEEE Publication
                    </span>
                    <h3 className="font-display font-bold text-lg leading-snug" style={{ color: solid("ink") }}>
                      {p.title}
                    </h3>
                    <p className="font-sans-ui text-xs leading-relaxed" style={{ color: solid("muted") }}>
                      {p.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t" style={{ borderColor: tint("border", 0.5) }}>
                    <a
                      href="https://ieeexplore.ieee.org"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-sans-ui font-semibold hover:underline"
                      style={{ color: solid("navy") }}
                    >
                      Browse on IEEE Xplore <Icons.ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Standards & Channels banner */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 md:p-8 rounded-3xl border space-y-3" style={{ background: solid("bgWarm"), borderColor: tint("border", 0.6) }}>
                <h3 className="font-display font-bold text-lg" style={{ color: solid("ink") }}>
                  Ethically Aligned Standards
                </h3>
                <p className="font-sans-ui text-xs leading-relaxed" style={{ color: solid("muted") }}>
                  {standardsNote} SSIT members participate directly in standard-setting committees on AI transparency, biometric safety, and digital ethics.
                </p>
              </div>

              <div className="p-6 md:p-8 rounded-3xl border space-y-3" style={{ background: solid("bgWarm"), borderColor: tint("border", 0.6) }}>
                <h3 className="font-display font-bold text-lg" style={{ color: solid("ink") }}>
                  Multimedia & Social Channels
                </h3>
                <p className="font-sans-ui text-xs leading-relaxed" style={{ color: solid("muted") }}>
                  {socialChannelsNote} Catch chapter recordings, student tech talks, and podcasts covering socio-technical issues.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
