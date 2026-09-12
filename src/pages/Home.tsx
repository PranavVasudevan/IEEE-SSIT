import { useState } from "react"
import { Link } from "react-router-dom"
import { Hero } from "@/components/sections/Hero"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { orgInfo, technicalActivityAreas } from "@/data/ssit"
import { solid, tint, navySolid } from "@/styles/colors"
import { Icons } from "@/components/ui/Icons"
import { useEvents } from "@/firebase/firestore"
import { EmptyState } from "@/components/ui/EmptyState"
import { CardSkeletonGrid } from "@/components/ui/Skeleton"

// Interactive Ethics Dilemma Widget
const DILEMMAS = [
  {
    id: "ai-bias",
    topic: "AI in Automated Hiring",
    question: "Should companies be legally prohibited from using autonomous AI algorithms in screening job applicants without human oversight?",
    optA: "Yes, algorithmic bias poses unacceptable civil rights risks.",
    optB: "No, AI reduces subjective human favoritism when properly audited.",
    votesA: 68,
    votesB: 32,
  },
  {
    id: "autonomous-vehicles",
    topic: "Autonomous Vehicle Ethics",
    question: "In unavoidable crash scenarios, should self-driving vehicles prioritize passenger survival or minimizing total casualties?",
    optA: "Minimize total casualties (Utilitarian approach).",
    optB: "Protect the vehicle passengers who purchased the vehicle.",
    votesA: 81,
    votesB: 19,
  },
  {
    id: "facial-rec",
    topic: "Public Surveillance & Privacy",
    question: "Should law enforcement use real-time biometric facial recognition in public transit hubs?",
    optA: "Ban real-time facial surveillance to protect public privacy.",
    optB: "Allow with judicial warrants for active threat prevention.",
    votesA: 54,
    votesB: 46,
  }
]

export default function Home() {
  const { events, loading: eventsLoading } = useEvents()
  const upcomingEvents = events.filter(e => e.status === "upcoming")
  const [selectedDilemmaIdx, setSelectedDilemmaIdx] = useState(0)
  const [userVoted, setUserVoted] = useState<Record<string, "A" | "B">>({})

  const currentDilemma = DILEMMAS[selectedDilemmaIdx]
  const hasVoted = userVoted[currentDilemma.id] !== undefined

  const handleVote = (choice: "A" | "B") => {
    setUserVoted(prev => ({ ...prev, [currentDilemma.id]: choice }))
  }

  return (
    <div className="space-y-24 md:space-y-36">
      <Hero />

      {/* Quick Navigation / Single-View Tab Strip */}
      <section className="px-4 md:px-8 -mt-8">
        <div className="max-w-[1600px] mx-auto">
          <div
            className="p-3 md:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 border shadow-lg backdrop-blur-xl"
            style={{
              background: "rgba(15, 23, 42, 0.72)",
              borderColor: "rgba(56, 189, 248, 0.2)",
              boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex items-center gap-2.5 px-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-sans-ui text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Explore Chapter Matrix
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: "Overview & Mission", to: "/about", icon: Icons.About },
                { label: "Conferences & Events", to: "/activities", icon: Icons.Calendar },
                { label: "Membership Benefits", to: "/membership", icon: Icons.Users },
                { label: "Photo Gallery", to: "/gallery", icon: Icons.Gallery },
                { label: "Contact Secretariats", to: "/contact", icon: Icons.Mail },
              ].map((tab) => {
                const IconComponent = tab.icon
                return (
                  <Link
                    key={tab.to}
                    to={tab.to}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans-ui font-semibold border transition-all duration-200 hover:scale-105 hover:bg-cyan-500/10 hover:border-cyan-500/40 active:scale-95"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      background: "rgba(15, 23, 42, 0.6)",
                      color: solid("ink"),
                    }}
                  >
                    <IconComponent size={14} className="text-amber-400" />
                    <span>{tab.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Metrics / Impact Counter */}
      <section className="px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 md:p-12 rounded-3xl border shadow-xl backdrop-blur-xl relative overflow-hidden"
            style={{
              background: "rgba(15, 23, 42, 0.68)",
              borderColor: "rgba(56, 189, 248, 0.2)",
              boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)",
            }}
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            {[
              { num: "50+", label: "Years of Global Legacy", sub: "Est. 1972 (TAB) / 1982 (SSIT)", tag: "HERITAGE" },
              { num: "6", label: "Core Technical Domains", sub: "Ethics, Climate, Access & AI", tag: "DOMAINS" },
              { num: "8+", label: "International Conferences", sub: "ISTAS, ETHICS, GHTC & more", tag: "SYMPOSIUMS" },
              { num: "100%", label: "Student Empowered", sub: "SSN CE Student Branch Chapter", tag: "CHAPTER" },
            ].map((stat, i) => (
              <div key={i} className="p-4 md:p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-2 relative group hover:border-cyan-500/30 transition-colors">
                <div className="text-[9px] font-mono tracking-widest text-cyan-500/70">[ {stat.tag} ]</div>
                <div className="font-display font-extrabold text-3xl md:text-5xl tracking-tight" style={{ color: solid("navy") }}>
                  {stat.num}
                </div>
                <div className="font-sans-ui font-semibold text-xs md:text-sm" style={{ color: solid("ink") }}>
                  {stat.label}
                </div>
                <div className="font-sans-ui text-[11px] leading-relaxed" style={{ color: solid("muted") }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Spotlight Carousel / Grid */}
      <section className="px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <SectionLabel>Live Programs</SectionLabel>
              <h2 className="font-display text-2xl md:text-4xl font-bold mt-1" style={{ color: solid("ink") }}>
                Upcoming Chapter Events & Workshops
              </h2>
            </div>
            <Link
              to="/activities"
              className="px-4 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 font-sans-ui text-xs uppercase tracking-wider font-semibold hover:bg-cyan-500/20 text-cyan-400 flex items-center gap-1.5 transition-all"
            >
              View Full 2025 Calendar →
            </Link>
          </div>

          {eventsLoading ? (
            <CardSkeletonGrid count={3} />
          ) : upcomingEvents.length === 0 ? (
            <EmptyState
              icon={Icons.Calendar}
              title="No upcoming events right now"
              message="New workshops and conferences are added regularly — check the full calendar or follow our socials for updates."
              action={
                <Link
                  to="/activities"
                  className="mt-1 px-4 py-2 rounded-lg font-sans-ui text-xs uppercase tracking-wider font-semibold text-white"
                  style={{ background: navySolid }}
                >
                  View Full Calendar
                </Link>
              }
            />
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="rounded-3xl border overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 backdrop-blur-xl"
                style={{
                  background: "rgba(15, 23, 42, 0.72)",
                  borderColor: "rgba(56, 189, 248, 0.2)",
                  boxShadow: "0 15px 35px -10px rgba(0, 0, 0, 0.5)",
                }}
              >
                {event.image && (
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-sans-ui font-semibold text-white bg-black/70 border border-white/20 backdrop-blur-md">
                        {event.category}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[11px] font-sans-ui font-semibold text-amber-200 bg-amber-950/80 border border-amber-500/30 backdrop-blur-md">
                        {event.mode}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-sans-ui" style={{ color: solid("gold") }}>
                      <Icons.Calendar size={13} />
                      <span className="font-semibold">{event.date}</span>
                      {event.time && <span>• {event.time}</span>}
                    </div>
                    <h3 className="font-display font-bold text-xl leading-snug" style={{ color: solid("ink") }}>
                      {event.title}
                    </h3>
                    <p className="font-sans-ui text-xs md:text-sm leading-relaxed line-clamp-3" style={{ color: solid("muted") }}>
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between gap-3" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
                    <span className="font-sans-ui text-xs truncate flex items-center gap-1.5" style={{ color: solid("muted") }}>
                      <Icons.MapPin size={12} className="shrink-0 text-amber-400" /> {event.location}
                    </span>
                    {event.registerUrl ? (
                      <a
                        href={event.registerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl text-xs font-sans-ui font-semibold text-white transition-opacity hover:opacity-90 shrink-0 shadow-md"
                        style={{ background: navySolid }}
                      >
                        Register
                      </a>
                    ) : (
                      <Link
                        to="/activities"
                        className="px-4 py-2 rounded-xl text-xs font-sans-ui font-semibold border transition-colors shrink-0 hover:bg-white/5"
                        style={{ borderColor: "rgba(255, 255, 255, 0.2)", color: solid("ink") }}
                      >
                        Details
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Interactive Tech Ethics Dilemma Hub */}
      <section className="px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div
            className="p-8 md:p-14 rounded-3xl border shadow-2xl relative overflow-hidden backdrop-blur-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(10, 30, 60, 0.92) 100%)",
              color: "#ffffff",
              borderColor: "rgba(56, 189, 248, 0.25)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
            }}
          >
            <div className="grid md:grid-cols-5 gap-10 items-center">
              <div className="md:col-span-2 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans-ui font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                  <Icons.MessageCircle size={13} />
                  Interactive IEEE SSIT Forum
                </div>
                <h2 className="font-display text-2xl md:text-4xl font-bold leading-tight">
                  Technology & Ethics Dilemma
                </h2>
                <p className="font-sans-ui text-sm text-slate-300 leading-relaxed">
                  Engineers shape human destiny. Vote on real-world socio-technical dilemmas facing our generation and see how your peers at SSN CE vote.
                </p>

                {/* Topic selector */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {DILEMMAS.map((d, idx) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDilemmaIdx(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-sans-ui font-semibold transition-all ${
                        selectedDilemmaIdx === idx
                          ? "bg-amber-400 text-slate-950 font-bold shadow-md scale-105"
                          : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                      }`}
                    >
                      {d.topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dilemma Voting Card */}
              <div className="md:col-span-3 bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/15 space-y-6 shadow-inner">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-amber-300 font-mono font-semibold">
                    Case Study #{selectedDilemmaIdx + 1}
                  </span>
                  <h3 className="font-display font-semibold text-lg md:text-xl text-white leading-snug">
                    {currentDilemma.question}
                  </h3>
                </div>

                <div className="space-y-3">
                  {/* Option A */}
                  <button
                    onClick={() => handleVote("A")}
                    className={`w-full p-4.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      userVoted[currentDilemma.id] === "A" ? "border-amber-400 bg-amber-500/20 shadow-md" : "border-white/15 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {hasVoted && (
                      <div
                        className="absolute inset-0 bg-amber-500/20 pointer-events-none transition-all duration-1000"
                        style={{ width: `${currentDilemma.votesA}%` }}
                      />
                    )}
                    <div className="relative flex items-center justify-between gap-4 text-sm font-sans-ui">
                      <span className="font-medium text-white">{currentDilemma.optA}</span>
                      {hasVoted && (
                        <span className="font-bold font-mono text-amber-300 shrink-0 text-base">
                          {currentDilemma.votesA}%
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Option B */}
                  <button
                    onClick={() => handleVote("B")}
                    className={`w-full p-4.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      userVoted[currentDilemma.id] === "B" ? "border-cyan-400 bg-cyan-500/20 shadow-md" : "border-white/15 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {hasVoted && (
                      <div
                        className="absolute inset-0 bg-cyan-500/20 pointer-events-none transition-all duration-1000"
                        style={{ width: `${currentDilemma.votesB}%` }}
                      />
                    )}
                    <div className="relative flex items-center justify-between gap-4 text-sm font-sans-ui">
                      <span className="font-medium text-white">{currentDilemma.optB}</span>
                      {hasVoted && (
                        <span className="font-bold font-mono text-cyan-300 shrink-0 text-base">
                          {currentDilemma.votesB}%
                        </span>
                      )}
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-sans-ui pt-2">
                  <span className="flex items-center gap-1.5">
                    {hasVoted && <Icons.Check size={13} className="text-emerald-400" />}
                    {hasVoted ? "Vote recorded" : "Click an option to cast your vote"}
                  </span>
                  <Link to="/about" className="text-amber-300 hover:underline font-semibold">
                    Explore IEEE SSIT Ethics Standards →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Activity Areas Spotlight */}
      <section className="px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <SectionLabel>Core Domains</SectionLabel>
            <h2 className="font-display text-2xl md:text-4xl font-bold" style={{ color: solid("ink") }}>
              IEEE SSIT Technical Activity Areas
            </h2>
            <p className="font-sans-ui text-sm" style={{ color: solid("muted") }}>
              Six interdisciplinary pillars driving ethical technology research and human advancement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technicalActivityAreas.map((area) => (
              <div
                key={area.title}
                className="p-7 md:p-8 rounded-3xl border flex flex-col justify-between space-y-5 group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 backdrop-blur-xl"
                style={{
                  background: "rgba(15, 23, 42, 0.72)",
                  borderColor: "rgba(56, 189, 248, 0.2)",
                  boxShadow: "0 15px 35px -10px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ background: solid(area.accent) }}
                    />
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-cyan-500/80">
                      [ DOMAIN // ACTIVE ]
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl leading-snug" style={{ color: solid("ink") }}>
                    {area.title}
                  </h3>
                  <p className="font-sans-ui text-xs md:text-sm leading-relaxed" style={{ color: solid("muted") }}>
                    {area.desc}
                  </p>
                </div>

                <div className="pt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
                  <span className="font-sans-ui font-medium" style={{ color: solid("navy") }}>
                    Lead: {area.contactName}
                  </span>
                  <a
                    href={`mailto:${area.contactEmail}`}
                    className="hover:underline flex items-center gap-1 font-mono text-xs font-semibold"
                    style={{ color: solid("gold") }}
                  >
                    Email <Icons.Mail size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote & Membership CTA */}
      <section className="px-4 md:px-8 pb-16">
        <div className="max-w-[1600px] mx-auto">
          <div
            className="p-10 md:p-16 rounded-3xl text-center space-y-8 border shadow-2xl backdrop-blur-2xl relative overflow-hidden"
            style={{
              background: "rgba(15, 23, 42, 0.85)",
              color: "#ffffff",
              borderColor: "rgba(56, 189, 248, 0.3)",
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7)",
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <blockquote className="font-display italic text-xl md:text-3xl max-w-3xl mx-auto leading-relaxed text-slate-100 relative z-10">
              "{orgInfo.quote}"
            </blockquote>
            <p className="font-sans-ui text-xs text-amber-300 uppercase tracking-widest font-semibold relative z-10">
              — {orgInfo.quoteAttribution}
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-5 relative z-10">
              <Link
                to="/membership"
                className="px-7 py-3.5 rounded-2xl font-sans-ui text-xs uppercase tracking-wider font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                Join SSIT SSN Chapter
              </Link>
              <Link
                to="/contact"
                className="px-7 py-3.5 rounded-2xl font-sans-ui text-xs uppercase tracking-wider font-semibold border border-white/30 text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
              >
                Submit Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
