import { Link } from "react-router-dom"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { membershipBenefits, membershipCategories, contact } from "@/data/ssit"
import { solid, tint } from "@/styles/colors"

export default function Membership() {
  return (
    <div className="pt-32">
      <section className="py-16 px-3 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <SectionLabel>Get involved</SectionLabel>
          <h1
            className="font-display mb-6"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: solid("ink"),
            }}
          >
            Join the community
          </h1>
          <p
            className="font-sans-ui leading-relaxed max-w-2xl mb-8"
            style={{ color: solid("muted"), fontSize: "1rem", fontWeight: 300 }}
          >
            Join the community of IEEE members who are deeply concerned with how
            technology impacts the world, and how the application of technology
            can improve the world. Discounts are available for members in
            developing countries.
          </p>
          <div className="flex flex-wrap gap-3">
            {membershipCategories.map((c) => (
              <span
                key={c}
                className="px-3 py-1.5 text-xs font-sans-ui rounded-full"
                style={{
                  background: tint("navy", 0.08),
                  color: solid("navy"),
                  border: `1px solid ${tint("navy", 0.15)}`,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

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
            Benefits of membership
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {membershipBenefits.map((b) => (
              <div
                key={b.title}
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
                  {b.title}
                </h3>
                <p
                  className="font-sans-ui leading-relaxed"
                  style={{
                    color: solid("muted"),
                    fontSize: "0.875rem",
                    fontWeight: 300,
                  }}
                >
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-3 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="font-display mb-4"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: 700,
              color: solid("ink"),
            }}
          >
            Ready to join?
          </h2>
          <p
            className="font-sans-ui leading-relaxed mb-8"
            style={{
              color: solid("muted"),
              fontSize: "0.9375rem",
              fontWeight: 300,
            }}
          >
            Join SSIT at {contact.ieeeJoin} and choose SSIT as one of your
            technical societies, or learn more at {contact.joinWeb}.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-sans-ui text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: solid("navy"),
              color: "#fff",
              boxShadow: `0 4px 16px ${tint("navy", 0.28)}`,
            }}
          >
            Contact the chapter
          </Link>
        </div>
      </section>
    </div>
  )
}
