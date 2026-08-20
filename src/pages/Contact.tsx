import { SectionLabel } from "@/components/ui/SectionLabel"
import { SocialLinks } from "@/components/ui/SocialLinks"
import { contact } from "@/data/ssit"
import { solid, tint, navySolid, navySolidTint } from "@/styles/colors"

const contactLines = [
  { icon: "✉", label: contact.email, href: `mailto:${contact.email}` },
  { icon: "⌖", label: contact.location, href: undefined },
  { icon: "🌐", label: contact.web, href: `https://${contact.web}` },
]

export default function Contact() {
  return (
    <section className="pt-32 pb-28 px-3 md:px-8">
      <div className="w-full grid md:grid-cols-2 gap-16 items-start">
        <div>
          <SectionLabel>Get involved</SectionLabel>
          <h1
            className="font-display mb-6"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: solid("ink"),
            }}
          >
            Ready to shape technology's future?
          </h1>
          <p
            className="font-sans-ui leading-relaxed mb-8"
            style={{
              color: solid("muted"),
              fontSize: "0.9375rem",
              fontWeight: 300,
            }}
          >
            Whether you are a student passionate about technology's societal
            role, an academic with research to share, or a professional looking
            to mentor the next generation — SSIT SSN welcomes you.
          </p>
          <div className="flex flex-col gap-3">
            {contactLines.map((c) =>
              c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  className="flex items-start gap-3 hover:opacity-80"
                >
                  <span
                    className="text-sm mt-0.5"
                    style={{ color: solid("gold") }}
                  >
                    {c.icon}
                  </span>
                  <span
                    className="font-sans-ui text-sm"
                    style={{ color: solid("muted"), fontWeight: 300 }}
                  >
                    {c.label}
                  </span>
                </a>
              ) : (
                <div key={c.label} className="flex items-start gap-3">
                  <span
                    className="text-sm mt-0.5"
                    style={{ color: solid("gold") }}
                  >
                    {c.icon}
                  </span>
                  <span
                    className="font-sans-ui text-sm"
                    style={{ color: solid("muted"), fontWeight: 300 }}
                  >
                    {c.label}
                  </span>
                </div>
              ),
            )}
          </div>
          <div className="mt-8">
            <p
              className="font-sans-ui text-xs uppercase tracking-widest mb-3"
              style={{ color: solid("navy"), letterSpacing: "0.1em" }}
            >
              Follow the chapter
            </p>
            <SocialLinks />
          </div>
        </div>

        {/* Form */}
        <form
          className="p-8 rounded-2xl"
          style={{
            background: solid("bgWarm"),
            border: `1px solid ${tint("border", 0.7)}`,
            boxShadow: `0 4px 24px ${tint("navy", 0.06)}`,
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <h2
            className="font-display font-semibold mb-6"
            style={{ fontSize: "1.15rem", color: solid("ink") }}
          >
            Join the chapter
          </h2>
          {[
            { label: "Full name", placeholder: "Your full name", type: "text" },
            {
              label: "Email address",
              placeholder: "you@ssn.edu.in",
              type: "email",
            },
            {
              label: "Department & Year",
              placeholder: "e.g. CSE — 3rd Year",
              type: "text",
            },
          ].map((field) => (
            <div key={field.label} className="mb-4">
              <label
                className="block font-sans-ui text-xs mb-1.5"
                style={{
                  color: solid("navy"),
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                }}
              >
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                className="w-full px-4 py-2.5 rounded-xl font-sans-ui text-sm outline-none transition-all duration-200 focus:ring-2"
                style={{
                  background: solid("bg"),
                  border: `1px solid ${tint("border", 0.7)}`,
                  color: solid("ink"),
                  fontWeight: 300,
                }}
              />
            </div>
          ))}
          <div className="mb-5">
            <label
              className="block font-sans-ui text-xs mb-1.5"
              style={{
                color: solid("navy"),
                fontWeight: 500,
                letterSpacing: "0.03em",
              }}
            >
              Area of interest
            </label>
            <textarea
              rows={3}
              placeholder="Tell us what draws you to technology ethics..."
              className="w-full px-4 py-2.5 rounded-xl font-sans-ui text-sm outline-none resize-none transition-all duration-200"
              style={{
                background: solid("bg"),
                border: `1px solid ${tint("border", 0.7)}`,
                color: solid("ink"),
                fontWeight: 300,
              }}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-sans-ui text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: navySolid,
              color: "#fff",
              boxShadow: `0 4px 16px ${navySolidTint(0.28)}`,
            }}
          >
            Submit application
          </button>
        </form>
      </div>
    </section>
  )
}
