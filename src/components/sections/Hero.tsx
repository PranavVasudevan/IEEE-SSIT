import { Link } from "react-router-dom"
import { solid, tint } from "@/styles/colors"
import { useTypewriter } from "@/hooks/useTypewriter"
import ssitLogo from "@/assets/images/ssit-logo.png"

export function Hero() {
  const typed = useTypewriter(["technology", "society", "tomorrow"], 90, 1800)
  return (
    <section className="px-5 md:px-10 pt-20 md:pt-28 pb-20 md:pb-32">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-[1.12fr_.88fr] gap-12 lg:gap-24 items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-sans-ui text-[10px] font-bold uppercase tracking-[.18em] text-cyan-400">
                  A student chapter of IEEE SSIT
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500 hidden sm:inline">[ CHENNAI // SSN CE ]</span>
            </div>

            <p
              className="font-sans-ui text-[11px] font-semibold uppercase tracking-[.2em] mb-6 animate-fade-up"
              style={{ color: solid("gold"), animationDelay: ".08s" }}
            >
              Technology & society · Chennai
            </p>

            <h1
              className="font-display text-[clamp(4.2rem,10.5vw,9.5rem)] leading-[1.08] font-medium tracking-[-.045em] animate-fade-up"
              style={{ color: solid("ink"), animationDelay: ".15s" }}
            >
              Shaping the<br />
              <em style={{ color: solid("gold") }}>social</em> future<br />
              of <span style={{ color: solid("navy"), borderBottom: `2px solid ${tint("navy", .45)}` }}>{typed}</span>
              <span className="cursor-blink inline-block ml-2 h-[.62em] w-[2px] align-baseline" style={{ background: solid("gold") }} />
            </h1>
          </div>

          <div className="animate-fade-up lg:pt-6" style={{ animationDelay: ".3s" }}>
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-8 flex items-center justify-center p-8 md:p-12 transition-all duration-300 hover:scale-[1.01] group backdrop-blur-xl"
              style={{
                background: "rgba(15, 23, 42, 0.72)",
                border: "1px solid rgba(56, 189, 248, 0.25)",
                boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
              }}
            >
              <div className="absolute top-3 left-3 text-[10px] font-mono text-cyan-500/60">[ CHAPTER // EMBLEM ]</div>
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-cyan-400/50" />
              <div className="absolute bottom-3 left-3 text-[9px] font-mono text-slate-500">SSIT SSN ARCHIVE</div>
              <div className="absolute bottom-3 right-3 text-[9px] font-mono text-slate-500">EST. 2021</div>

              <img
                src={ssitLogo}
                alt="IEEE SSIT SSN Chapter Emblem"
                className="max-h-[85%] max-w-[85%] object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
              <p className="font-sans-ui text-sm md:text-base leading-relaxed" style={{ color: solid("muted") }}>
                We explore the profound intersection of technology and humanity through critical inquiry, ethical practice, and meaningful dialogue.
              </p>
            </div>
          </div>
        </div>

        <div
          className="mt-20 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-8 rounded-2xl p-6 border border-slate-800/80 backdrop-blur-xl"
          style={{ background: "rgba(15, 23, 42, 0.65)" }}
        >
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {[
              { num: "1972", label: "TAB committee founded" },
              { num: "1982", label: "IEEE SSIT established" },
              { num: "06", label: "Technical activity areas" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold" style={{ color: solid("ink") }}>
                  {stat.num}
                </span>
                <span className="font-sans-ui text-[10px] uppercase tracking-[.14em]" style={{ color: solid("muted") }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 font-sans-ui text-xs uppercase tracking-[.16em] font-semibold">
            <Link
              to="/about"
              className="px-4 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all"
            >
              Explore our work ↗
            </Link>
            <Link
              to="/membership"
              className="px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all"
            >
              Join the chapter ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
