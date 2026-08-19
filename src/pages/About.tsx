import ssitLogo from "@/assets/images/ssit-logo.png"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { orgInfo, technicalActivityAreas, leadership } from "@/data/ssit"
import { solid, tint } from "@/styles/colors"

export default function About() {
  return (
    <div className="pt-32">
      <section className="py-16 px-3 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <img
            src={ssitLogo}
            alt="IEEE SSIT SSN Student Chapter"
            className="h-16 md:h-20 w-auto object-contain mb-6"
          />
          <SectionLabel>About SSIT</SectionLabel>
          <div className="grid md:grid-cols-5 gap-12 items-start">
            <div className="md:col-span-3">
              <h1
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
              </h1>
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
                className="font-sans-ui leading-relaxed mb-5"
                style={{
                  color: solid("muted"),
                  fontSize: "1rem",
                  fontWeight: 300,
                }}
              >
                {orgInfo.description}
              </p>
              <p
                className="font-sans-ui leading-relaxed"
                style={{
                  color: solid("muted"),
                  fontSize: "1rem",
                  fontWeight: 300,
                }}
              >
                {orgInfo.history}
              </p>
            </div>
            <div className="md:col-span-2 flex flex-col gap-4">
              <div
                className="p-6 rounded-xl"
                style={{
                  background: solid("bgWarm"),
                  border: `1px solid ${tint("border", 0.6)}`,
                }}
              >
                <p
                  className="font-sans-ui text-xs uppercase tracking-widest mb-2"
                  style={{ color: solid("navy"), letterSpacing: "0.1em" }}
                >
                  Mission
                </p>
                <p
                  className="font-sans-ui leading-relaxed"
                  style={{
                    color: solid("ink"),
                    fontSize: "0.9375rem",
                    fontWeight: 300,
                  }}
                >
                  {orgInfo.mission}
                </p>
              </div>
              <div
                className="p-6 rounded-xl"
                style={{ background: solid("navy") }}
              >
                <p
                  className="font-display italic"
                  style={{
                    color: "#F5F1EC",
                    fontSize: "1.05rem",
                    lineHeight: 1.4,
                  }}
                >
                  "{orgInfo.ssitTagline}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-20 px-3 md:px-8"
        style={{ background: solid("bgWarm") }}
      >
        <div className="max-w-[1600px] mx-auto">
          <SectionLabel>Focus areas</SectionLabel>
          <h2
            className="font-display mb-12"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: solid("ink"),
            }}
          >
            Technical activity areas
          </h2>
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px"
            style={{
              border: `1px solid ${tint("border", 0.6)}`,
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {technicalActivityAreas.map((area) => (
              <div
                key={area.title}
                className="p-7"
                style={{ background: solid("bg") }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mb-5"
                  style={{ background: solid(area.accent) }}
                />
                <h3
                  className="font-display font-semibold mb-3"
                  style={{
                    fontSize: "1.05rem",
                    color: solid("ink"),
                    lineHeight: 1.25,
                  }}
                >
                  {area.title}
                </h3>
                <p
                  className="font-sans-ui leading-relaxed mb-4"
                  style={{
                    color: solid("muted"),
                    fontSize: "0.875rem",
                    fontWeight: 300,
                  }}
                >
                  {area.desc}
                </p>
                <a
                  href={`mailto:${area.contactEmail}`}
                  className="font-sans-ui text-xs hover:underline"
                  style={{ color: solid("navy") }}
                >
                  {area.contactName}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-3 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <SectionLabel>Society leadership</SectionLabel>
          <h2
            className="font-display mb-10"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: solid("ink"),
            }}
          >
            IEEE SSIT global leadership
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
            {leadership.map((l) => (
              <div
                key={l.role}
                className="p-6 rounded-xl"
                style={{ border: `1px solid ${tint("border", 0.6)}` }}
              >
                <p
                  className="font-sans-ui text-xs uppercase tracking-widest mb-1"
                  style={{ color: solid("navy"), letterSpacing: "0.08em" }}
                >
                  {l.role} · {l.term}
                </p>
                <p
                  className="font-display font-semibold"
                  style={{ fontSize: "1.1rem", color: solid("ink") }}
                >
                  {l.name}
                </p>
                <a
                  href={`mailto:${l.email}`}
                  className="font-sans-ui text-xs hover:underline"
                  style={{ color: solid("muted") }}
                >
                  {l.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
