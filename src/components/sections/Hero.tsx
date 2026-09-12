import { Link } from "react-router-dom"
import { solid, tint } from "@/styles/colors"
import { useTypewriter } from "@/hooks/useTypewriter"
import { orgInfo } from "@/data/ssit"

export function Hero() {
  const typedFocus = useTypewriter(
    ["Ethical Systems", "Human Responsibility", "Public Interest Tech", "Sustainable Progress"],
    90,
    1800
  )

  return (
    <section className="relative px-5 md:px-10 lg:px-12 pt-28 md:pt-36 pb-20 md:pb-28 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        {/* Institutional Chapter Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md animate-fade-up">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
            IEEE SSIT Student Branch Chapter · SSN CE
          </span>
        </div>

        {/* Primary Headline with Editorial Typography & Centered Axis */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1
            className="font-display text-[clamp(2.8rem,6.5vw,5.5rem)] leading-[1.08] font-bold tracking-tight text-white animate-fade-up"
            style={{ animationDelay: ".1s" }}
          >
            Shaping the social implications of{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 inline-block"
            >
              {typedFocus}
            </span>
            <span
              className="cursor-blink inline-block ml-1.5 h-[0.7em] w-[3px] align-baseline bg-amber-400"
            />
          </h1>

          <p
            className="font-sans-ui text-base md:text-xl text-slate-300 font-light leading-relaxed max-w-2xl mx-auto pt-2 animate-fade-up"
            style={{ animationDelay: ".18s" }}
          >
            {orgInfo.ssitTagline} — exploring the profound intersection of technology, engineering ethics, and human responsibility.
          </p>
        </div>

        {/* Primary CTAs */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 pt-2 animate-fade-up"
          style={{ animationDelay: ".24s" }}
        >
          <Link
            to="/activities"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shadow-lg hover:shadow-cyan-400/25 active:scale-95"
          >
            Explore Activities →
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold border border-slate-700 bg-slate-900/60 text-white hover:bg-slate-800/80 hover:border-slate-600 transition-all active:scale-95 backdrop-blur-md"
          >
            Chapter Story
          </Link>
          <Link
            to="/membership"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold text-amber-300 hover:text-amber-200 transition-colors"
          >
            Join IEEE SSIT ↗
          </Link>
        </div>

        {/* Institutional Milestones Rulers (Open Canvas, Centered, No Fake Boxes) */}
        <div
          className="pt-14 border-t border-slate-800/80 max-w-4xl mx-auto animate-fade-up"
          style={{ animationDelay: ".3s" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 text-left sm:text-center">
            <div className="space-y-1 sm:border-r border-slate-800/80 sm:pr-6">
              <div className="font-display text-3xl md:text-4xl font-extrabold text-cyan-400">
                1972
              </div>
              <div className="font-sans-ui text-xs font-semibold uppercase tracking-wider text-white">
                TAB Committee Founded
              </div>
              <div className="font-sans-ui text-xs text-slate-400 leading-snug">
                Committee on Social Implications of Technology established
              </div>
            </div>

            <div className="space-y-1 sm:border-r border-slate-800/80 sm:px-6">
              <div className="font-display text-3xl md:text-4xl font-extrabold text-amber-400">
                1982
              </div>
              <div className="font-sans-ui text-xs font-semibold uppercase tracking-wider text-white">
                SSIT Society Formed
              </div>
              <div className="font-sans-ui text-xs text-slate-400 leading-snug">
                Formally established as IEEE Society on Social Implications of Tech
              </div>
            </div>

            <div className="space-y-1 sm:pl-6">
              <div className="font-display text-3xl md:text-4xl font-extrabold text-cyan-400">
                06
              </div>
              <div className="font-sans-ui text-xs font-semibold uppercase tracking-wider text-white">
                Technical Working Areas
              </div>
              <div className="font-sans-ui text-xs text-slate-400 leading-snug">
                Interdisciplinary working groups addressing societal impact
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
