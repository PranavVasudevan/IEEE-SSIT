import { SectionLabel } from "@/components/ui/SectionLabel"
import {
  conferenceSeries,
  conferenceCalendar2025,
  publications,
  standardsNote,
  socialChannelsNote,
} from "@/data/ssit"
import { solid, tint } from "@/styles/colors"

export default function Activities() {
  return (
    <div className="pt-32">
      <section className="py-16 px-3 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <SectionLabel>What we do</SectionLabel>
          <h1
            className="font-display mb-6"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: solid("ink"),
            }}
          >
            Conferences, publications & standards
          </h1>
          <p
            className="font-sans-ui leading-relaxed max-w-2xl"
            style={{ color: solid("muted"), fontSize: "1rem", fontWeight: 300 }}
          >
            IEEE SSIT sponsors and co-sponsors a recurring series of
            international conferences, peer-reviewed publications, and standards
            work. Chapter members gain direct access to all of it.
          </p>
        </div>
      </section>

      {/* Conference series */}
      <section
        className="py-20 px-3 md:px-8"
        style={{ background: solid("bgWarm") }}
      >
        <div className="max-w-[1600px] mx-auto">
          <h2
            className="font-display mb-10"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: 700,
              color: solid("ink"),
            }}
          >
            Conference series
          </h2>
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px"
            style={{
              border: `1px solid ${tint("border", 0.6)}`,
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {conferenceSeries.map((c) => (
              <div
                key={c.acronym}
                className="p-7"
                style={{ background: solid("bg") }}
              >
                <span
                  className="inline-block px-2.5 py-1 text-xs font-sans-ui rounded-full mb-4"
                  style={{
                    background: tint("navy", 0.08),
                    color: solid("navy"),
                    border: `1px solid ${tint("navy", 0.15)}`,
                  }}
                >
                  {c.acronym}
                </span>
                <h3
                  className="font-display font-semibold mb-1"
                  style={{
                    fontSize: "1rem",
                    color: solid("ink"),
                    lineHeight: 1.3,
                  }}
                >
                  {c.name}
                </h3>
                {c.note && (
                  <p
                    className="font-sans-ui text-xs mt-2"
                    style={{ color: solid("gold"), fontWeight: 500 }}
                  >
                    {c.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2025 calendar reference */}
      <section className="py-20 px-3 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 700,
                color: solid("ink"),
              }}
            >
              2025 global conference calendar
            </h2>
            <span
              className="font-sans-ui text-xs"
              style={{ color: solid("muted"), fontWeight: 300 }}
            >
              Reference — see technologyandsociety.org for the current schedule
            </span>
          </div>
          <div
            className="flex flex-col gap-0"
            style={{
              border: `1px solid ${tint("border", 0.6)}`,
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {conferenceCalendar2025.map((ev, i) => (
              <div
                key={ev.name}
                className="flex items-center gap-6 p-5 flex-wrap"
                style={{
                  background: solid("bgWarm"),
                  borderBottom:
                    i < conferenceCalendar2025.length - 1
                      ? `1px solid ${tint("border", 0.5)}`
                      : "none",
                }}
              >
                <span
                  className="font-sans-ui text-xs shrink-0 w-24"
                  style={{ color: solid("navy"), fontWeight: 500 }}
                >
                  {ev.dates}
                </span>
                <span
                  className="font-display font-semibold flex-1 min-w-[200px]"
                  style={{ fontSize: "0.95rem", color: solid("ink") }}
                >
                  {ev.name}
                </span>
                <span
                  className="font-sans-ui text-xs"
                  style={{ color: solid("muted"), fontWeight: 300 }}
                >
                  {ev.location}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section
        className="py-20 px-3 md:px-8"
        style={{ background: solid("bgWarm") }}
      >
        <div className="max-w-[1600px] mx-auto">
          <h2
            className="font-display mb-10"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: 700,
              color: solid("ink"),
            }}
          >
            Publications
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {publications.map((p) => (
              <div
                key={p.title}
                className="p-6 rounded-xl"
                style={{
                  background: solid("bg"),
                  border: `1px solid ${tint("border", 0.6)}`,
                }}
              >
                <h3
                  className="font-display font-semibold mb-2"
                  style={{ fontSize: "1rem", color: solid("ink") }}
                >
                  {p.title}
                </h3>
                <p
                  className="font-sans-ui leading-relaxed"
                  style={{
                    color: solid("muted"),
                    fontSize: "0.875rem",
                    fontWeight: 300,
                  }}
                >
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards + social */}
      <section className="py-20 px-3 md:px-8">
        <div className="w-full grid md:grid-cols-2 gap-8">
          <div
            className="p-8 rounded-xl"
            style={{ border: `1px solid ${tint("border", 0.6)}` }}
          >
            <p
              className="font-sans-ui text-xs uppercase tracking-widest mb-3"
              style={{ color: solid("navy"), letterSpacing: "0.1em" }}
            >
              Standards
            </p>
            <p
              className="font-sans-ui leading-relaxed"
              style={{
                color: solid("ink"),
                fontSize: "0.9375rem",
                fontWeight: 300,
              }}
            >
              {standardsNote}
            </p>
          </div>
          <div
            className="p-8 rounded-xl"
            style={{ border: `1px solid ${tint("border", 0.6)}` }}
          >
            <p
              className="font-sans-ui text-xs uppercase tracking-widest mb-3"
              style={{ color: solid("navy"), letterSpacing: "0.1em" }}
            >
              Social channels
            </p>
            <p
              className="font-sans-ui leading-relaxed"
              style={{
                color: solid("ink"),
                fontSize: "0.9375rem",
                fontWeight: 300,
              }}
            >
              {socialChannelsNote}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
