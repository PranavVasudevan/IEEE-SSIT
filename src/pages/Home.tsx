import { Link } from "react-router-dom"
import { Hero } from "@/components/sections/Hero"
import { PullQuote } from "@/components/sections/PullQuote"
import { Partners } from "@/components/sections/Partners"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { orgInfo, technicalActivityAreas } from "@/data/ssit"
import { solid, tint } from "@/styles/colors"

const explore = [
  {
    to: "/activities",
    tag: "Programs",
    title: "Conferences & publications",
    desc: "ISTAS, ETHICS, GHTC and more — plus the Transactions on Technology & Society and Technology & Society Magazine.",
    accent: "navy" as const,
  },
  {
    to: "/membership",
    tag: "Community",
    title: "Membership benefits",
    desc: "Networking, publication access, conference discounts, and volunteer opportunities across the global SSIT network.",
    accent: "gold" as const,
  },
  {
    to: "/gallery",
    tag: "Chapter",
    title: "Life at SSIT",
    desc: "A look at workshops, symposiums, and chapter activity at SSN College of Engineering.",
    accent: "purple" as const,
  },
]

export default function Home() {
  return (
    <div>
      <Hero />

      {/* About teaser */}
      <section
        id="about"
        className="py-28 px-3 md:px-8"
        style={{ background: solid("bgWarm") }}
      >
        <div className="max-w-[1600px] mx-auto">
          <SectionLabel>About SSIT</SectionLabel>
          <div className="grid md:grid-cols-5 gap-12 items-start">
            <div className="md:col-span-3">
              <h2
                className="font-display mb-6"
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: solid("ink"),
                }}
              >
                Technology carries profound{" "}
                <em style={{ color: solid("gold") }}>social responsibility.</em>
              </h2>
              <p
                className="font-sans-ui leading-relaxed mb-5"
                style={{
                  color: solid("muted"),
                  fontSize: "1rem",
                  fontWeight: 300,
                }}
              >
                The IEEE Society on Social Implications of Technology (SSIT) is
                a community of engineers, scientists, and technologists united
                by the belief that technology cannot be separated from its human
                context. Our SSN Student Chapter brings that mission to life on
                campus.
              </p>
              <p
                className="font-sans-ui leading-relaxed"
                style={{
                  color: solid("muted"),
                  fontSize: "1rem",
                  fontWeight: 300,
                }}
              >
                {orgInfo.description}
              </p>
              <Link
                to="/about"
                className="inline-block mt-6 font-sans-ui text-sm underline underline-offset-4"
                style={{ color: solid("navy") }}
              >
                Read more about SSIT →
              </Link>
            </div>
            <div className="md:col-span-2 flex flex-col gap-4">
              {technicalActivityAreas.slice(0, 3).map((area) => (
                <div
                  key={area.title}
                  className="p-5 rounded-xl"
                  style={{
                    background: solid("bg"),
                    border: `1px solid ${tint("border", 0.6)}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="inline-block w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ background: solid(area.accent) }}
                    />
                    <div>
                      <p
                        className="font-sans-ui font-medium text-sm"
                        style={{ color: solid("navy") }}
                      >
                        {area.title}
                      </p>
                      <p
                        className="font-sans-ui text-xs mt-1 leading-relaxed"
                        style={{ color: solid("muted") }}
                      >
                        {area.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Explore grid */}
      <section className="py-28 px-3 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <SectionLabel>Explore</SectionLabel>
          <h2
            className="font-display mb-14"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: solid("ink"),
            }}
          >
            What's inside
          </h2>
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px"
            style={{
              border: `1px solid ${tint("border", 0.6)}`,
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {explore.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="p-7 group transition-colors duration-200 hover:bg-ssit-bg-warm block"
                style={{ background: solid("bgWarm") }}
              >
                <span
                  className="inline-block px-2.5 py-1 text-xs font-sans-ui rounded-full mb-5"
                  style={{
                    background: tint(item.accent, 0.08),
                    color: solid(item.accent),
                    border: `1px solid ${tint(item.accent, 0.13)}`,
                  }}
                >
                  {item.tag}
                </span>
                <h3
                  className="font-display font-semibold mb-3"
                  style={{
                    fontSize: "1.15rem",
                    color: solid("ink"),
                    lineHeight: 1.25,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="font-sans-ui leading-relaxed"
                  style={{
                    color: solid("muted"),
                    fontSize: "0.875rem",
                    fontWeight: 300,
                  }}
                >
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PullQuote />
      <Partners />
    </div>
  )
}
