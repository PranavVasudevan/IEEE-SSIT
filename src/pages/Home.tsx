import { useState } from "react"
import { Link } from "react-router-dom"
import { Hero } from "@/components/sections/Hero"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { orgInfo, technicalActivityAreas } from "@/data/ssit"
import { solid, tint, navySolid } from "@/styles/colors"
import { Icons } from "@/components/ui/Icons"
import { useEvents } from "@/firebase/firestore"

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
  const { events } = useEvents()
  const upcomingEvents = events.filter(e => e.status === "upcoming")
  const [selectedDilemmaIdx, setSelectedDilemmaIdx] = useState(0)
  const [userVoted, setUserVoted] = useState<Record<string, "A" | "B">>({})

  const currentDilemma = DILEMMAS[selectedDilemmaIdx]
  const hasVoted = userVoted[currentDilemma.id] !== undefined

  const handleVote = (choice: "A" | "B") => {
    setUserVoted(prev => ({ ...prev, [currentDilemma.id]: choice }))
  }

  return (
    <div className="space-y-16 md:space-y-24">
      <Hero />

      {/* Quick Navigation / Single-View Tab Strip (inspired by Photonics reference) */}
      <section className="px-4 md:px-8 -mt-6">
        <div className="max-w-[1600px] mx-auto">
          <div
            className="p-3 md:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 border shadow-sm"
            style={{
              background: solid("bgWarm"),
              borderColor: tint("border", 0.7),
            }}
          >
            <div className="flex items-center gap-2 px-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-sans-ui text-xs font-bold uppercase tracking-wider" style={{ color: solid("navy") }}>
                Explore Chapter
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
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans-ui font-medium border transition-all duration-200 hover:scale-105 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
                    style={{
                      borderColor: tint("border", 0.6),
                      background: solid("bg"),
                      color: solid("ink"),
                    }}
                  >
                    <IconComponent size={14} className="text-amber-500" />
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
            className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-3xl border shadow-sm"
            style={{
              background: "linear-gradient(135deg, rgba(30, 58, 138, 0.04) 0%, rgba(217, 119, 6, 0.04) 100%)",
              borderColor: tint("border", 0.6),
            }}
          >
            {[
              { num: "50+", label: "Years of Global Legacy", sub: "Est. 1972 (TAB) / 1982 (SSIT)" },
              { num: "6", label: "Core Technical Domains", sub: "Ethics, Climate, Access & AI" },
              { num: "8+", label: "International Conferences", sub: "ISTAS, ETHICS, GHTC & more" },
              { num: "100%", label: "Student Empowered", sub: "SSN CE Student Branch Chapter" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-3 space-y-1">
                <div className="font-display font-extrabold text-3xl md:text-5xl" style={{ color: solid("navy") }}>
                  {stat.num}
                </div>
                <div className="font-sans-ui font-semibold text-xs md:text-sm" style={{ color: solid("ink") }}>
                  {stat.label}
                </div>
                <div className="font-sans-ui text-[11px]" style={{ color: solid("muted") }}>
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
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <SectionLabel>Live Programs</SectionLabel>
              <h2 className="font-display text-2xl md:text-4xl font-bold" style={{ color: solid("ink") }}>
                Upcoming Chapter Events & Workshops
              </h2>
            </div>
            <Link
              to="/activities"
              className="font-sans-ui text-xs uppercase tracking-wider font-semibold hover:underline flex items-center gap-1"
              style={{ color: solid("navy") }}
            >
              View Full 2025 Calendar →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{
                  background: solid("bgWarm"),
                  borderColor: tint("border", 0.6),
                }}
              >
                {event.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-sans-ui font-semibold text-white bg-black/60 backdrop-blur-md">
                        {event.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-sans-ui font-semibold text-amber-200 bg-amber-900/80 backdrop-blur-md">
                        {event.mode}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-sans-ui" style={{ color: solid("gold") }}>
                      <Icons.Calendar size={13} />
                      <span className="font-medium">{event.date}</span>
                      {event.time && <span>• {event.time}</span>}
                    </div>
                    <h3 className="font-display font-bold text-lg leading-snug" style={{ color: solid("ink") }}>
                      {event.title}
                    </h3>
                    <p className="font-sans-ui text-xs leading-relaxed line-clamp-3" style={{ color: solid("muted") }}>
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between gap-3" style={{ borderColor: tint("border", 0.5) }}>
                    <span className="font-sans-ui text-[11px] truncate flex items-center gap-1" style={{ color: solid("muted") }}>
                      <Icons.MapPin size={11} className="shrink-0" /> {event.location}
                    </span>
                    {event.registerUrl ? (
                      <a
                        href={event.registerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-lg text-xs font-sans-ui font-semibold text-white transition-opacity hover:opacity-90 shrink-0"
                        style={{ background: navySolid }}
                      >
                        Register
                      </a>
                    ) : (
                      <Link
                        to="/activities"
                        className="px-3.5 py-1.5 rounded-lg text-xs font-sans-ui font-semibold border transition-colors shrink-0"
                        style={{ borderColor: tint("border", 0.8), color: solid("ink") }}
                      >
                        Details
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Tech Ethics Dilemma Hub */}
      <section className="px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div
            className="p-8 md:p-12 rounded-3xl border shadow-lg relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.95) 100%)",
              color: "#ffffff",
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-2 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-sans-ui font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-sans-ui font-semibold transition-all ${
                        selectedDilemmaIdx === idx
                          ? "bg-amber-500 text-slate-950 font-bold"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {d.topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dilemma Voting Card */}
              <div className="md:col-span-3 bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/15 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-amber-300 font-mono font-semibold">
                    Case Study #{selectedDilemmaIdx + 1}
                  </span>
                  <h3 className="font-display font-semibold text-lg md:text-xl text-white">
                    {currentDilemma.question}
                  </h3>
                </div>

                <div className="space-y-3">
                  {/* Option A */}
                  <button
                    onClick={() => handleVote("A")}
                    className={`w-full p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
                      userVoted[currentDilemma.id] === "A" ? "border-amber-400 bg-amber-500/20" : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {hasVoted && (
                      <div
                        className="absolute inset-0 bg-amber-500/20 pointer-events-none transition-all duration-1000"
                        style={{ width: `${currentDilemma.votesA}%` }}
                      />
                    )}
                    <div className="relative flex items-center justify-between gap-3 text-sm font-sans-ui">
                      <span className="font-medium text-white">{currentDilemma.optA}</span>
                      {hasVoted && (
                        <span className="font-bold font-mono text-amber-300 shrink-0">
                          {currentDilemma.votesA}%
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Option B */}
                  <button
                    onClick={() => handleVote("B")}
                    className={`w-full p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
                      userVoted[currentDilemma.id] === "B" ? "border-blue-400 bg-blue-500/20" : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {hasVoted && (
                      <div
                        className="absolute inset-0 bg-blue-500/20 pointer-events-none transition-all duration-1000"
                        style={{ width: `${currentDilemma.votesB}%` }}
                      />
                    )}
                    <div className="relative flex items-center justify-between gap-3 text-sm font-sans-ui">
                      <span className="font-medium text-white">{currentDilemma.optB}</span>
                      {hasVoted && (
                        <span className="font-bold font-mono text-blue-300 shrink-0">
                          {currentDilemma.votesB}%
                        </span>
                      )}
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-sans-ui pt-2">
                  <span className="flex items-center gap-1">
                    {hasVoted && <Icons.Check size={12} className="text-emerald-400" />}
                    {hasVoted ? "Vote recorded" : "Click an option to cast your vote"}
                  </span>
                  <Link to="/about" className="text-amber-300 hover:underline">
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
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <SectionLabel>Core Domains</SectionLabel>
            <h2 className="font-display text-2xl md:text-4xl font-bold" style={{ color: solid("ink") }}>
              IEEE SSIT Technical Activity Areas
            </h2>
            <p className="font-sans-ui text-sm" style={{ color: solid("muted") }}>
              Six interdisciplinary pillars driving ethical technology research and human advancement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicalActivityAreas.map((area) => (
              <div
                key={area.title}
                className="p-6 rounded-2xl border flex flex-col justify-between space-y-4 group transition-all duration-300 hover:shadow-lg"
                style={{
                  background: solid("bgWarm"),
                  borderColor: tint("border", 0.6),
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: solid(area.accent) }}
                    />
                    <span className="text-[11px] font-sans-ui font-semibold uppercase tracking-wider" style={{ color: solid("muted") }}>
                      IEEE SSIT Technical Area
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg leading-snug" style={{ color: solid("ink") }}>
                    {area.title}
                  </h3>
                  <p className="font-sans-ui text-xs leading-relaxed" style={{ color: solid("muted") }}>
                    {area.desc}
                  </p>
                </div>

                <div className="pt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: tint("border", 0.5) }}>
                  <span className="font-sans-ui font-medium" style={{ color: solid("navy") }}>
                    Lead: {area.contactName}
                  </span>
                  <a
                    href={`mailto:${area.contactEmail}`}
                    className="hover:underline flex items-center gap-1 font-mono text-[11px]"
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
      <section className="px-4 md:px-8 pb-12">
        <div className="max-w-[1600px] mx-auto">
          <div
            className="p-8 md:p-14 rounded-3xl text-center space-y-6 border"
            style={{
              background: navySolid,
              color: "#ffffff",
              borderColor: "rgba(255, 255, 255, 0.15)",
            }}
          >
            <blockquote className="font-display italic text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed text-slate-100">
              "{orgInfo.quote}"
            </blockquote>
            <p className="font-sans-ui text-xs text-amber-300 uppercase tracking-widest font-semibold">
              — {orgInfo.quoteAttribution}
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/membership"
                className="px-6 py-3 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all shadow-md active:scale-95"
              >
                Join SSIT SSN Chapter
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-semibold border border-white/30 text-white hover:bg-white/10 transition-all active:scale-95"
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
