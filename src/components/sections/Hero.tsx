import { Link } from "react-router-dom"
import { solid, tint } from "@/styles/colors"
import { useTypewriter } from "@/hooks/useTypewriter"
import ssitLogo from "@/assets/images/ssit-logo.png"

export function Hero() {
  const typed = useTypewriter(["technology", "society", "tomorrow"], 90, 1800)
  return (
    <section className="px-5 md:px-10 pt-12 md:pt-20 pb-20 md:pb-28">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-[1.12fr_.88fr] gap-12 lg:gap-20 items-start">
          <div>
            <div className="flex items-center gap-3 mb-12 animate-fade-up">
              <img src={ssitLogo} alt="IEEE SSIT" className="h-9 w-auto object-contain" />
              <span className="font-sans-ui text-[10px] uppercase tracking-[.18em]" style={{ color: solid("muted") }}>A student chapter of IEEE SSIT</span>
            </div>
            <p className="font-sans-ui text-[10px] uppercase tracking-[.18em] mb-5 animate-fade-up" style={{ color: solid("gold"), animationDelay: ".08s" }}>Technology & society · Chennai</p>
            <h1 className="font-display text-[clamp(4.5rem,11vw,10.5rem)] leading-[1.1] font-medium tracking-[-.045em] animate-fade-up" style={{ color: solid("ink"), animationDelay: ".15s" }}>
              Shaping the<br /><em style={{ color: solid("gold") }}>social</em> future<br />of <span style={{ color: solid("navy"), borderBottom: `1px solid ${tint("navy", .45)}` }}>{typed}</span><span className="cursor-blink inline-block ml-2 h-[.62em] w-[2px] align-baseline" style={{ background: solid("gold") }} />
            </h1>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: ".3s" }}>
            <div
              className="relative aspect-[4/5] overflow-hidden mb-6 flex items-center justify-center"
              style={{ background: solid("bgWarm"), border: `1px dashed ${tint("border", 0.9)}` }}
            >
              <span className="font-sans-ui text-xs uppercase tracking-[.14em] text-center px-6" style={{ color: solid("muted") }}>
                Chapter photo coming soon
              </span>
            </div>
            <p className="font-sans-ui text-sm md:text-base leading-relaxed max-w-md" style={{ color: solid("muted") }}>We explore the profound intersection of technology and humanity through critical inquiry, ethical practice, and meaningful dialogue.</p>
          </div>
        </div>
        <div className="mt-16 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ borderTop: `1px solid ${tint("border", .8)}` }}>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {[{ num: "1972", label: "TAB committee founded" }, { num: "1982", label: "IEEE SSIT established" }, { num: "06", label: "Technical activity areas" }].map((stat) => <div key={stat.label} className="flex items-baseline gap-2"><span className="font-display text-2xl" style={{ color: solid("ink") }}>{stat.num}</span><span className="font-sans-ui text-[10px] uppercase tracking-[.12em]" style={{ color: solid("muted") }}>{stat.label}</span></div>)}
          </div>
          <div className="flex gap-5 font-sans-ui text-[11px] uppercase tracking-[.14em]">
            <Link to="/about" style={{ color: solid("navy") }}>Explore our work ↗</Link>
            <Link to="/membership" style={{ color: solid("gold") }}>Join the chapter ↗</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
