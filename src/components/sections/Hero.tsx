import { Link } from "react-router-dom"
import ssitLogo from "@/assets/images/ssit-logo.jpeg"
import { useTypewriter } from "@/hooks/useTypewriter"
import { solid, tint } from "@/styles/colors"

export function Hero() {
  const typed = useTypewriter(
    ["Technology", "Society", "Innovation", "Ethics", "Tomorrow"],
    75,
    2200,
  )

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-20 px-3 md:px-8">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 60% 30%, ${tint("sky", 0.06)} 0%, transparent 70%)`,
        }}
      />

      <div className="relative w-full">
        {/* Eyebrow */}
        <div
          className="flex items-center gap-3 mb-8 animate-fade-in"
          style={{ animationDelay: "0.05s" }}
        >
          <span
            className="inline-block px-3 py-1 text-xs font-sans-ui tracking-widest uppercase rounded-full"
            style={{
              background: tint("navy", 0.08),
              color: solid("navy"),
              border: `1px solid ${tint("navy", 0.15)}`,
              letterSpacing: "0.12em",
            }}
          >
            IEEE · SSN Student Chapter
          </span>
          <span
            className="text-xs font-sans-ui"
            style={{ color: solid("muted"), letterSpacing: "0.05em" }}
          >
            Est. SSN College of Engineering
          </span>
        </div>

        {/* Display headline with typewriter */}
        <h1
          className="font-display animate-fade-up"
          style={{
            fontSize: "clamp(3rem, 9vw, 7.5rem)",
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: "-0.025em",
            animationDelay: "0.15s",
          }}
        >
          <span style={{ color: solid("ink") }}>Shaping the</span>
          <br />
          <span style={{ color: solid("gold"), fontStyle: "italic" }}>
            social
          </span>
          <span style={{ color: solid("ink") }}> future of </span>
          <br />
          <span
            style={{
              color: solid("navy"),
              borderBottom: `3px solid ${tint("navy", 0.25)}`,
              paddingBottom: "2px",
            }}
          >
            {typed}
          </span>
          <span
            className="cursor-blink inline-block ml-1"
            style={{
              width: "3px",
              height: "0.85em",
              background: solid("navy"),
              verticalAlign: "middle",
              borderRadius: "1px",
            }}
          />
        </h1>

        {/* Two-column below headline */}
        <div className="mt-16 grid md:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up" style={{ animationDelay: "0.35s" }}>
            <p
              className="font-sans-ui leading-relaxed mb-8"
              style={{
                color: solid("muted"),
                fontSize: "1.0625rem",
                fontWeight: 300,
              }}
            >
              IEEE SSIT SSN Student Chapter explores the profound intersection
              of technology and humanity. We foster critical inquiry, ethical
              practice, and meaningful dialogue around how technology shapes our
              world — and how we shape it back.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-sans-ui text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{
                  background: solid("navy"),
                  color: "#fff",
                  boxShadow: `0 4px 16px ${tint("navy", 0.28)}`,
                }}
              >
                Explore our work
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7h10M8 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                to="/activities"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-sans-ui text-sm font-medium border transition-all duration-200 hover:bg-ssit-bg-warm"
                style={{
                  color: solid("navy"),
                  borderColor: tint("navy", 0.25),
                }}
              >
                Our activities
              </Link>
            </div>

            <div
              className="mt-10 flex gap-8 pt-8"
              style={{ borderTop: `1px solid ${tint("border", 0.7)}` }}
            >
              {[
                { num: "1972", label: "TAB committee founded" },
                { num: "1982", label: "Established as IEEE SSIT" },
                { num: "6", label: "Technical activity areas" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="font-display"
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: 700,
                      color: solid("navy"),
                    }}
                  >
                    {s.num}
                  </div>
                  <div
                    className="text-xs font-sans-ui mt-0.5"
                    style={{ color: solid("muted"), letterSpacing: "0.03em" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex items-center justify-end animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            <img
              src={ssitLogo}
              alt="IEEE SSIT SSN Student Chapter"
              className="w-full max-w-sm md:max-w-md object-contain"
              style={{ opacity: 0.92 }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
