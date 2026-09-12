import { useState } from "react"
import { Link } from "react-router-dom"
import { Hero } from "@/components/sections/Hero"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { orgInfo, technicalActivityAreas } from "@/data/ssit"
import { solid } from "@/styles/colors"
import { Icons } from "@/components/ui/Icons"
import { useEvents } from "@/firebase/firestore"
import { CardSkeletonGrid } from "@/components/ui/Skeleton"

// Genuine Interactive Ethics Scenarios for student engagement
const ETHICS_SCENARIOS = [
  {
    id: "ai-hiring",
    topic: "Algorithmic Decision Making",
    question:
      "Should companies be legally prohibited from using autonomous AI algorithms in screening job applicants without direct human oversight?",
    optA: "Yes, automated screening poses unacceptable bias and discrimination risks.",
    optB: "No, automated screening reduces subjective human favoritism when audited.",
    votesA: 68,
    votesB: 32,
    context:
      "IEEE SSIT explores how algorithmic accountability standards protect civil liberties in professional systems.",
  },
  {
    id: "autonomous-systems",
    topic: "Autonomous Vehicle Dilemmas",
    question:
      "In unavoidable collision scenarios, should self-driving vehicles be programmed to minimize total casualties or prioritize vehicle occupants?",
    optA: "Minimize total casualties across all individuals involved.",
    optB: "Prioritize the protection of the vehicle occupants.",
    votesA: 81,
    votesB: 19,
    context:
      "Examining utilitarian ethics versus consumer duty in safety-critical automated infrastructure.",
  },
  {
    id: "biometric-surveillance",
    topic: "Biometric Data & Public Transit",
    question:
      "Should municipal transit authorities deploy real-time facial recognition in public hubs without active individual consent?",
    optA: "Prohibit real-time facial surveillance to uphold public privacy rights.",
    optB: "Permit under judicial oversight for active public safety protection.",
    votesA: 54,
    votesB: 46,
    context:
      "Balancing collective security against constitutional privacy and mass surveillance concerns.",
  },
]

export default function Home() {
  const { events, loading: eventsLoading } = useEvents()
  const upcomingEvents = events.filter((e) => e.status === "upcoming")
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0)
  const [userVoted, setUserVoted] = useState<Record<string, "A" | "B">>({})

  const currentScenario = ETHICS_SCENARIOS[selectedScenarioIdx]
  const hasVoted = userVoted[currentScenario.id] !== undefined

  const handleVote = (choice: "A" | "B") => {
    setUserVoted((prev) => ({ ...prev, [currentScenario.id]: choice }))
  }

  return (
    <div className="space-y-28 md:space-y-36 relative z-10">
      {/* 1. Centered Institutional Hero */}
      <Hero />

      {/* 2. Centered Impact & Global Heritage Metrics */}
      <section className="px-5 md:px-10 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <SectionLabel>Global Society Impact</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
              Five Decades of Technological Stewardship
            </h2>
            <p className="font-sans-ui text-sm md:text-base text-slate-300 font-light leading-relaxed">
              Empowering engineers, students, and citizens to understand and guide the social implications of technology.
            </p>
          </div>

          <div className="py-8 border-y border-slate-800/80">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {[
                {
                  num: "50+",
                  label: "Years of Heritage",
                  desc: "Founded under TAB in 1972 · Society since 1982",
                  accent: "text-cyan-400",
                },
                {
                  num: "6",
                  label: "Technical Working Areas",
                  desc: "Covering ethics, climate, AI & digital access",
                  accent: "text-amber-400",
                },
                {
                  num: "8+",
                  label: "Sponsored Conferences",
                  desc: "Flagship symposiums including ISTAS & ETHICS",
                  accent: "text-cyan-400",
                },
                {
                  num: "100%",
                  label: "Student Driven",
                  desc: "SSN CE Student Branch Chapter initiatives",
                  accent: "text-amber-400",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="space-y-2 text-center lg:border-r border-slate-800/60 last:border-r-0 px-3"
                >
                  <div className={`font-display font-bold text-4xl md:text-5xl tracking-tight ${stat.accent}`}>
                    {stat.num}
                  </div>
                  <div className="font-sans-ui font-semibold text-sm md:text-base text-white">
                    {stat.label}
                  </div>
                  <div className="font-sans-ui text-xs text-slate-400 leading-relaxed max-w-[200px] mx-auto">
                    {stat.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Technical Activity Areas (Structured Grid) */}
      <section className="px-5 md:px-10 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <SectionLabel>Core Focus</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
              Technical Activity Areas
            </h2>
            <p className="font-sans-ui text-sm md:text-base text-slate-300 font-light leading-relaxed">
              Six working groups driving research, ethical guidelines, and responsible engineering standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicalActivityAreas.map((area) => (
              <div
                key={area.title}
                className="p-7 md:p-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl flex flex-col justify-between space-y-6 hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: solid(area.accent) }}
                    />
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                      Working Group
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white leading-snug">
                    {area.title}
                  </h3>
                  <p className="font-sans-ui text-xs md:text-sm text-slate-300 font-light leading-relaxed">
                    {area.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-sans-ui text-slate-400">
                    Coordinator: <strong className="text-white font-medium">{area.contactName}</strong>
                  </span>
                  <a
                    href={`mailto:${area.contactEmail}`}
                    className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Email <Icons.Mail size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Upcoming Chapter Events & Programs */}
      <section className="px-5 md:px-10 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <SectionLabel>Programs & Symposia</SectionLabel>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight mt-1">
                Upcoming Chapter Events
              </h2>
            </div>
            <Link
              to="/activities"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View All Activities & Calendar →
            </Link>
          </div>

          {eventsLoading ? (
            <CardSkeletonGrid count={3} />
          ) : upcomingEvents.length === 0 ? (
            <div className="p-10 md:p-14 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-xl text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Icons.Calendar size={26} />
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                Upcoming events will be announced shortly
              </h3>
              <p className="font-sans-ui text-xs md:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
                Explore our past symposia, conference calendar, and student workshops in the activities portal.
              </p>
              <div className="pt-2">
                <Link
                  to="/activities"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-md"
                >
                  Explore Chapter Activities →
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-7 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                      <Icons.Calendar size={13} />
                      <span>{event.date}</span>
                    </div>
                    <h3 className="font-display font-bold text-xl text-white">
                      {event.title}
                    </h3>
                    <p className="font-sans-ui text-xs md:text-sm text-slate-300 line-clamp-3 font-light leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">
                      {event.location || "SSN Campus"}
                    </span>
                    {event.registerUrl ? (
                      <a
                        href={event.registerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-lg text-xs font-sans-ui font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all"
                      >
                        Register
                      </a>
                    ) : (
                      <Link
                        to="/activities"
                        className="px-4 py-2 rounded-lg text-xs font-sans-ui font-semibold border border-slate-700 text-white hover:bg-white/5 transition-colors"
                      >
                        Details
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Ethics Dilemma in Practice (Centered, Genuine) */}
      <section className="px-5 md:px-10 lg:px-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <SectionLabel>Ethics in Practice</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
              Technology & Human Dilemmas
            </h2>
            <p className="font-sans-ui text-sm md:text-base text-slate-300 font-light leading-relaxed">
              Real dilemmas facing engineers and society today. Select a topic and vote to see how your perspective compares with peers.
            </p>
          </div>

          <div className="p-8 md:p-12 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-2xl shadow-2xl space-y-8">
            {/* Topic Selection Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {ETHICS_SCENARIOS.map((scenario, idx) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenarioIdx(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-sans-ui font-medium transition-all ${
                    selectedScenarioIdx === idx
                      ? "bg-cyan-400 text-slate-950 font-bold shadow-md"
                      : "bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700"
                  }`}
                >
                  {scenario.topic}
                </button>
              ))}
            </div>

            {/* Scenario Question */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h3 className="font-display font-semibold text-xl md:text-2xl text-white leading-snug">
                "{currentScenario.question}"
              </h3>
              <p className="font-sans-ui text-xs text-slate-400">
                {currentScenario.context}
              </p>
            </div>

            {/* Voting Options */}
            <div className="space-y-4 max-w-2xl mx-auto">
              {/* Option A */}
              <button
                onClick={() => handleVote("A")}
                className={`w-full p-5 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                  userVoted[currentScenario.id] === "A"
                    ? "border-amber-400 bg-amber-500/15"
                    : "border-slate-800 bg-slate-900/70 hover:bg-slate-800/80 hover:border-slate-700"
                }`}
              >
                {hasVoted && (
                  <div
                    className="absolute inset-0 bg-amber-500/20 pointer-events-none transition-all duration-700"
                    style={{ width: `${currentScenario.votesA}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between gap-4 text-sm font-sans-ui">
                  <span className="font-medium text-white">{currentScenario.optA}</span>
                  {hasVoted && (
                    <span className="font-bold font-mono text-amber-300 shrink-0 text-lg">
                      {currentScenario.votesA}%
                    </span>
                  )}
                </div>
              </button>

              {/* Option B */}
              <button
                onClick={() => handleVote("B")}
                className={`w-full p-5 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                  userVoted[currentScenario.id] === "B"
                    ? "border-cyan-400 bg-cyan-500/15"
                    : "border-slate-800 bg-slate-900/70 hover:bg-slate-800/80 hover:border-slate-700"
                }`}
              >
                {hasVoted && (
                  <div
                    className="absolute inset-0 bg-cyan-500/20 pointer-events-none transition-all duration-700"
                    style={{ width: `${currentScenario.votesB}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between gap-4 text-sm font-sans-ui">
                  <span className="font-medium text-white">{currentScenario.optB}</span>
                  {hasVoted && (
                    <span className="font-bold font-mono text-cyan-300 shrink-0 text-lg">
                      {currentScenario.votesB}%
                    </span>
                  )}
                </div>
              </button>
            </div>

            <div className="text-center pt-2">
              <span className="font-sans-ui text-xs text-slate-400">
                {hasVoted
                  ? "Thank you for participating. Explore our technical activity areas to learn more."
                  : "Click an option above to submit your perspective."}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Founding Principle / Melvin Kranzberg Quote */}
      <section className="px-5 md:px-10 lg:px-12 pb-24">
        <div className="max-w-4xl mx-auto text-center space-y-8 py-14 px-6 md:px-12 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl">
          <blockquote className="font-display italic text-2xl md:text-3xl lg:text-4xl leading-relaxed text-white">
            "{orgInfo.quote}"
          </blockquote>

          <p className="font-sans-ui text-xs md:text-sm text-amber-300 uppercase tracking-widest font-semibold">
            — {orgInfo.quoteAttribution}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/membership"
              className="px-7 py-3.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shadow-md active:scale-95"
            >
              Join SSIT SSN Chapter →
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-semibold border border-slate-700 text-white hover:bg-slate-800/80 transition-all active:scale-95"
            >
              Contact Secretariat
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
