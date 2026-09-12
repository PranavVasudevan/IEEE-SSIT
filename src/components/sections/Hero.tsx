import { Link } from "react-router-dom"
import { solid, tint } from "@/styles/colors"
import { useTypewriter } from "@/hooks/useTypewriter"
import ssitLogo from "@/assets/images/ssit-logo.png"

export function Hero() {
  const typed = useTypewriter(["technology", "society", "tomorrow"], 90, 1800)

  return (
    <section className="relative px-5 md:px-10 lg:px-12 pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Top Technical Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80 animate-fade-up">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-cyan-400">
                A student chapter of IEEE SSIT
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 tracking-wider">
              [ CHENNAI // SSN CE // LAT 12.75°N // LON 80.20°E ]
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span className="hidden sm:inline">FOUNDED UNDER TAB: 1972</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-amber-400 font-semibold">SSIT EST. 1982</span>
          </div>
        </div>

        {/* Main Hero Layered Grid */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left / Editorial Typography Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <p
                className="font-mono text-xs md:text-sm font-semibold uppercase tracking-[.25em] animate-fade-up"
                style={{ color: solid("gold"), animationDelay: ".08s" }}
              >
                Technology & society · Chennai
              </p>

              <h1
                className="font-display text-[clamp(3.8rem,8.5vw,8.2rem)] leading-[1.04] font-medium tracking-[-.04em] animate-fade-up"
                style={{ color: solid("ink"), animationDelay: ".15s" }}
              >
                Shaping the<br />
                <em className="italic" style={{ color: solid("gold") }}>social</em> future<br />
                of{" "}
                <span
                  className="relative inline-block"
                  style={{
                    color: solid("navy"),
                    borderBottom: `2px solid ${tint("navy", 0.6)}`,
                  }}
                >
                  {typed}
                </span>
                <span
                  className="cursor-blink inline-block ml-2 h-[.65em] w-[3px] align-baseline"
                  style={{ background: solid("gold") }}
                />
              </h1>
            </div>

            {/* Supporting Mission Block directly in hero flow */}
            <div className="max-w-xl space-y-4 pt-2">
              <p
                className="font-sans-ui text-base md:text-lg leading-relaxed text-slate-300 font-light"
                style={{ color: solid("ink") }}
              >
                We explore the profound intersection of technology and humanity through critical inquiry, ethical practice, and meaningful dialogue.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {["#EthicalEngineering", "#HumanCenteredAI", "#EquitableAccess", "#SustainableTech"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider text-cyan-400/90 border border-cyan-500/20 bg-cyan-950/40"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/25 active:scale-95"
              >
                Explore our work ↗
              </Link>
              <Link
                to="/membership"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all active:scale-95 backdrop-blur-md"
              >
                Join the chapter ↗
              </Link>
            </div>
          </div>

          {/* Right Column: High-Tech Chapter Matrix Console (5 Cols) */}
          <div className="lg:col-span-5 animate-fade-up lg:pt-2" style={{ animationDelay: ".25s" }}>
            <div
              className="relative p-7 md:p-9 rounded-3xl border border-cyan-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(14, 23, 42, 0.82) 0%, rgba(8, 14, 28, 0.88) 100%)",
                boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Corner Tech Markings */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-800 text-[10px] font-mono text-cyan-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  [ CHAPTER MATRIX // SSN CE ]
                </span>
                <span className="text-slate-500">SYS_ONLINE</span>
              </div>

              {/* Central SSIT Holographic Emblem Display */}
              <div className="relative py-6 flex items-center justify-center">
                {/* Orbital radar ring */}
                <div className="absolute w-56 h-56 rounded-full border border-cyan-500/20 border-dashed animate-[spin_60s_linear_infinite]" />
                <div className="absolute w-44 h-44 rounded-full border border-amber-500/20" />

                <img
                  src={ssitLogo}
                  alt="IEEE SSIT SSN Chapter Emblem"
                  className="max-h-36 w-auto object-contain drop-shadow-[0_10px_30px_rgba(56,189,248,0.3)] transition-transform duration-500 hover:scale-105 relative z-10"
                  style={{ mixBlendMode: "screen" }}
                />
              </div>

              {/* Status Spec Grid */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-left">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] font-mono text-cyan-400/80">[ AFFILIATION ]</div>
                  <div className="font-sans-ui text-xs font-semibold text-white mt-0.5">IEEE SSIT Global</div>
                  <div className="text-[10px] font-mono text-slate-500">Region 10 (Asia-Pacific)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] font-mono text-amber-400/80">[ STUDENT BRANCH ]</div>
                  <div className="font-sans-ui text-xs font-semibold text-white mt-0.5">SSN College of Eng.</div>
                  <div className="text-[10px] font-mono text-slate-500">Chennai, Tamil Nadu</div>
                </div>
              </div>

              {/* Bottom Quick Jump Link */}
              <div className="mt-4 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>INTERACTIVE 3D GLOBE ACTIVE</span>
                <Link to="/contact" className="text-cyan-400 hover:underline">
                  CONNECT WITH TEAM →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Open-Canvas Legacy Milestones Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center justify-between">
            {[
              { num: "1972", label: "TAB committee founded", sub: "Five decades of technology & society stewardship" },
              { num: "1982", label: "IEEE SSIT established", sub: "Global society on social implications" },
              { num: "06", label: "Technical activity areas", sub: "Interdisciplinary pillars from ethics to climate" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-start gap-4 group">
                <span className="font-display text-4xl md:text-5xl font-bold tracking-tight text-cyan-400 shrink-0">
                  {stat.num}
                </span>
                <div className="space-y-0.5">
                  <div className="font-sans-ui text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    {stat.label}
                  </div>
                  <div className="font-sans-ui text-[11px] text-slate-400 leading-snug">
                    {stat.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
