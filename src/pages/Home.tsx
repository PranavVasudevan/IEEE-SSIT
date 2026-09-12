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
    question:
      "Should companies be legally prohibited from using autonomous AI algorithms in screening job applicants without human oversight?",
    optA: "Yes, algorithmic bias poses unacceptable civil rights risks.",
    optB: "No, AI reduces subjective human favoritism when properly audited.",
    votesA: 68,
    votesB: 32,
  },
  {
    id: "autonomous-vehicles",
    topic: "Autonomous Vehicle Ethics",
    question:
      "In unavoidable crash scenarios, should self-driving vehicles prioritize passenger survival or minimizing total casualties?",
    optA: "Minimize total casualties (Utilitarian approach).",
    optB: "Protect the vehicle passengers who purchased the vehicle.",
    votesA: 81,
    votesB: 19,
  },
  {
    id: "facial-rec",
    topic: "Public Surveillance & Privacy",
    question:
      "Should law enforcement use real-time biometric facial recognition in public transit hubs?",
    optA: "Ban real-time facial surveillance to protect public privacy.",
    optB: "Allow with judicial warrants for active threat prevention.",
    votesA: 54,
    votesB: 46,
  },
]

export default function Home() {
  const { events, loading: eventsLoading } = useEvents()
  const upcomingEvents = events.filter((e) => e.status === "upcoming")
  const [selectedDilemmaIdx, setSelectedDilemmaIdx] = useState(0)
  const [userVoted, setUserVoted] = useState<Record<string, "A" | "B">>({})

  const currentDilemma = DILEMMAS[selectedDilemmaIdx]
  const hasVoted = userVoted[currentDilemma.id] !== undefined

  const handleVote = (choice: "A" | "B") => {
    setUserVoted((prev) => ({ ...prev, [currentDilemma.id]: choice }))
  }

  // Split technical activity areas into flagship domain + complementary domains
  const flagshipDomain = technicalActivityAreas[0]
  const otherDomains = technicalActivityAreas.slice(1)

  return (
    <div className="space-y-24 md:space-y-36 relative z-10">
      <Hero />

      {/* 1. Architectural Navigation Pathway Spine */}
      <section className="px-5 md:px-10 lg:px-12 -mt-10">
        <div className="max-w-[1600px] mx-auto">
          <div
            className="p-4 md:p-5 rounded-2xl border border-cyan-500/25 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4"
            style={{
              background: "rgba(11, 18, 32, 0.78)",
              boxShadow: "0 15px 35px -10px rgba(0,0,0,0.6)",
            }}
          >
            <div className="flex items-center gap-3 px-2 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-[.18em] text-cyan-400">
                [ CHAPTER MATRIX // NAV ]
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 w-full">
              {[
                { label: "Overview & Mission", to: "/about", code: "01", icon: Icons.About },
                { label: "Conferences & Events", to: "/activities", code: "02", icon: Icons.Calendar },
                { label: "Membership Benefits", to: "/membership", code: "03", icon: Icons.Users },
                { label: "Photo Gallery", to: "/gallery", code: "04", icon: Icons.Gallery },
                { label: "Contact Secretariats", to: "/contact", code: "05", icon: Icons.Mail },
              ].map((tab) => {
                const IconComponent = tab.icon
                return (
                  <Link
                    key={tab.to}
                    to={tab.to}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-sans-ui font-medium border border-slate-700/60 bg-slate-900/50 hover:border-cyan-500/50 hover:bg-cyan-950/40 text-slate-200 hover:text-white transition-all duration-200 active:scale-95"
                  >
                    <span className="text-[10px] font-mono text-amber-400">{tab.code}.</span>
                    <IconComponent size={13} className="text-cyan-400" />
                    <span>{tab.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Open-Canvas Panoramic Impact Metrics (NOT trapped in a repetitive box!) */}
      <section className="px-5 md:px-10 lg:px-12">
        <div className="max-w-[1600px] mx-auto py-10 border-y border-slate-800/80">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              {
                num: "50+",
                label: "Years of Global Legacy",
                sub: "Est. 1972 (TAB) / 1982 (SSIT)",
                tag: "GLOBAL HERITAGE",
                accent: "text-cyan-400",
              },
              {
                num: "6",
                label: "Core Technical Domains",
                sub: "Ethics, Climate, Access & AI",
                tag: "RESEARCH PILLARS",
                accent: "text-amber-400",
              },
              {
                num: "8+",
                label: "International Conferences",
                sub: "ISTAS, ETHICS, GHTC & more",
                tag: "ANNUAL SYMPOSIA",
                accent: "text-cyan-400",
              },
              {
                num: "100%",
                label: "Student Empowered",
                sub: "SSN CE Student Branch Chapter",
                tag: "STUDENT LEADERSHIP",
                accent: "text-amber-400",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="space-y-3 relative pr-4 lg:border-r border-slate-800/60 last:border-r-0 group"
              >
                <div className="text-[10px] font-mono tracking-widest text-slate-400">
                  [ {stat.tag} ]
                </div>
                <div className={`font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight ${stat.accent}`}>
                  {stat.num}
                </div>
                <div className="space-y-1">
                  <div className="font-sans-ui font-semibold text-sm md:text-base text-white">
                    {stat.label}
                  </div>
                  <div className="font-sans-ui text-xs text-slate-400 leading-relaxed">
                    {stat.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Upcoming Events Spotlight */}
      <section className="px-5 md:px-10 lg:px-12">
        <div className="max-w-[1600px] mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <SectionLabel>Live Programs</SectionLabel>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-1">
                Upcoming Chapter Events & Workshops
              </h2>
            </div>
            <Link
              to="/activities"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/40 transition-all"
            >
              View Full 2025 Calendar →
            </Link>
          </div>

          {eventsLoading ? (
            <CardSkeletonGrid count={3} />
          ) : upcomingEvents.length === 0 ? (
            <div className="p-8 md:p-12 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl text-center space-y-4">
              <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Icons.Calendar size={28} />
              </div>
              <h3 className="font-display font-bold text-xl text-white">No upcoming events right now</h3>
              <p className="font-sans-ui text-xs md:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                New workshops and conferences are added regularly — check the full calendar or follow our socials for updates.
              </p>
              <div className="pt-2">
                <Link
                  to="/activities"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-md"
                >
                  View Full Calendar
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="rounded-3xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-xl overflow-hidden flex flex-col group hover:border-cyan-500/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl"
                >
                  {event.image && (
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold text-white bg-slate-950/80 border border-white/20 backdrop-blur-md">
                          {event.category}
                        </span>
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold text-amber-300 bg-amber-950/80 border border-amber-500/30 backdrop-blur-md">
                          {event.mode}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                        <Icons.Calendar size={13} />
                        <span>{event.date}</span>
                        {event.time && <span>• {event.time}</span>}
                      </div>
                      <h3 className="font-display font-bold text-xl text-white leading-snug">
                        {event.title}
                      </h3>
                      <p className="font-sans-ui text-xs md:text-sm text-slate-300 leading-relaxed line-clamp-3 font-light">
                        {event.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                      <span className="font-sans-ui text-xs text-slate-400 truncate flex items-center gap-1.5">
                        <Icons.MapPin size={12} className="shrink-0 text-amber-400" /> {event.location}
                      </span>
                      {event.registerUrl ? (
                        <a
                          href={event.registerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl text-xs font-sans-ui font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shrink-0 shadow-md"
                        >
                          Register
                        </a>
                      ) : (
                        <Link
                          to="/activities"
                          className="px-4 py-2 rounded-xl text-xs font-sans-ui font-semibold border border-slate-700 text-white hover:bg-white/5 transition-colors shrink-0"
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

      {/* 4. Interactive Tech Ethics Dilemma: Global Ethics Decision Terminal */}
      <section className="px-5 md:px-10 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div
            className="p-8 md:p-14 rounded-3xl border border-cyan-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(14, 23, 42, 0.94) 0%, rgba(6, 12, 24, 0.96) 100%)",
              boxShadow: "0 30px 70px -15px rgba(0, 0, 0, 0.7)",
            }}
          >
            {/* Top Terminal Status Line */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-slate-800 text-[10px] font-mono">
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                [ ETHICS DECISION PROTOCOL // CASE AUDIT ]
              </div>
              <div className="text-slate-400">STATUS: INTERACTIVE INQUIRY // PEER CONSENSUS RECORDING</div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  <Icons.MessageCircle size={13} />
                  Interactive IEEE SSIT Forum
                </div>
                <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight">
                  Technology & Ethics Dilemma
                </h2>
                <p className="font-sans-ui text-sm md:text-base text-slate-300 leading-relaxed font-light">
                  Engineers shape human destiny. Vote on real-world socio-technical dilemmas facing our generation and see how your peers at SSN CE vote.
                </p>

                {/* Topic Selector Terminal Switches */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                    SELECT INQUIRY TOPIC:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {DILEMMAS.map((d, idx) => (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDilemmaIdx(idx)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                          selectedDilemmaIdx === idx
                            ? "bg-amber-400 text-slate-950 font-bold shadow-lg scale-105"
                            : "bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        0{idx + 1}. {d.topic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dilemma Terminal Card */}
              <div className="lg:col-span-7 p-7 md:p-9 rounded-3xl border border-slate-700/80 bg-slate-950/60 backdrop-blur-xl space-y-6 shadow-inner">
                <div className="space-y-2 pb-4 border-b border-slate-800">
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-mono font-semibold">
                    [ CASE STUDY #{selectedDilemmaIdx + 1} // ACTIVE QUERY ]
                  </span>
                  <h3 className="font-display font-semibold text-xl md:text-2xl text-white leading-snug">
                    {currentDilemma.question}
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Option A */}
                  <button
                    onClick={() => handleVote("A")}
                    className={`w-full p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      userVoted[currentDilemma.id] === "A"
                        ? "border-amber-400 bg-amber-500/20 shadow-md"
                        : "border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-700"
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
                        <span className="font-bold font-mono text-amber-300 shrink-0 text-lg">
                          {currentDilemma.votesA}%
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Option B */}
                  <button
                    onClick={() => handleVote("B")}
                    className={`w-full p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      userVoted[currentDilemma.id] === "B"
                        ? "border-cyan-400 bg-cyan-500/20 shadow-md"
                        : "border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-700"
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
                        <span className="font-bold font-mono text-cyan-300 shrink-0 text-lg">
                          {currentDilemma.votesB}%
                        </span>
                      )}
                    </div>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-sans-ui pt-2">
                  <span className="flex items-center gap-1.5 font-mono">
                    {hasVoted && <Icons.Check size={13} className="text-emerald-400" />}
                    {hasVoted ? "Vote recorded in chapter ledger" : "Click an option to cast your vote"}
                  </span>
                  <Link to="/about" className="text-amber-400 hover:underline font-semibold font-mono">
                    Explore IEEE SSIT Ethics Standards →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Technical Activity Areas (Asymmetric Bento Hierarchy Layout) */}
      <section className="px-5 md:px-10 lg:px-12">
        <div className="max-w-[1600px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <SectionLabel>Core Domains</SectionLabel>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mt-1">
                IEEE SSIT Technical Activity Areas
              </h2>
            </div>
            <p className="font-sans-ui text-sm text-slate-300 max-w-md leading-relaxed font-light">
              Six interdisciplinary pillars driving ethical technology research and human advancement.
            </p>
          </div>

          {/* Asymmetric Bento Layout: Featured Flagship (Top wide) + Complementary Bento (Bottom grid) */}
          <div className="space-y-8">
            {/* Flagship Domain Spotlight */}
            <div
              className="p-8 md:p-12 rounded-3xl border border-cyan-500/30 backdrop-blur-2xl relative overflow-hidden shadow-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(14, 23, 42, 0.85) 0%, rgba(8, 14, 28, 0.9) 100%)",
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-cyan-400" />
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
                      [ FLAGSHIP TECHNICAL DOMAIN // 01 ]
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-2xl md:text-4xl text-white">
                    {flagshipDomain.title}
                  </h3>
                  <p className="font-sans-ui text-sm md:text-base text-slate-300 leading-relaxed font-light">
                    {flagshipDomain.desc}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 lg:min-w-[320px] space-y-4">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    DOMAIN LEADERSHIP
                  </div>
                  <div className="font-sans-ui text-base font-bold text-white">
                    {flagshipDomain.contactName}
                  </div>
                  <a
                    href={`mailto:${flagshipDomain.contactEmail}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/25 transition-all"
                  >
                    Email Domain Secretariat <Icons.Mail size={12} />
                  </a>
                </div>
              </div>
            </div>

            {/* 5 Complementary Domains Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherDomains.map((area, idx) => (
                <div
                  key={area.title}
                  className="p-7 rounded-3xl border border-slate-800/90 bg-slate-900/50 backdrop-blur-xl flex flex-col justify-between space-y-6 group hover:border-cyan-500/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: solid(area.accent) }}
                      />
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                        [ DOMAIN // 0{idx + 2} ]
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-xl text-white leading-snug">
                      {area.title}
                    </h4>
                    <p className="font-sans-ui text-xs md:text-sm text-slate-300 leading-relaxed font-light">
                      {area.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="font-sans-ui font-medium text-slate-300">
                      Lead: {area.contactName}
                    </span>
                    <a
                      href={`mailto:${area.contactEmail}`}
                      className="hover:underline flex items-center gap-1 font-mono text-xs font-semibold text-amber-400"
                    >
                      Email <Icons.Mail size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Open-Canvas Panoramic Community Pledge (Quote & Action) */}
      <section className="px-5 md:px-10 lg:px-12 pb-20">
        <div className="max-w-[1600px] mx-auto">
          <div
            className="p-10 md:p-20 rounded-3xl text-center space-y-8 border border-cyan-500/30 backdrop-blur-2xl relative overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(145deg, rgba(14, 23, 42, 0.88) 0%, rgba(6, 10, 20, 0.94) 100%)",
              boxShadow: "0 30px 80px -20px rgba(0, 0, 0, 0.8)",
            }}
          >
            <div className="text-[10px] font-mono tracking-widest text-cyan-400">
              [ IEEE SSIT // COMMUNITY PLEDGE ]
            </div>

            <blockquote className="font-display italic text-2xl md:text-4xl lg:text-5xl max-w-4xl mx-auto leading-relaxed text-white relative z-10">
              "{orgInfo.quote}"
            </blockquote>

            <p className="font-mono text-xs md:text-sm text-amber-400 uppercase tracking-widest font-semibold relative z-10">
              — {orgInfo.quoteAttribution}
            </p>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-5 relative z-10">
              <Link
                to="/membership"
                className="px-8 py-4 rounded-2xl font-sans-ui text-xs uppercase tracking-wider font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                Join SSIT SSN Chapter
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 rounded-2xl font-sans-ui text-xs uppercase tracking-wider font-semibold border border-white/30 text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
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
