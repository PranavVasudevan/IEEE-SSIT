import { SectionLabel } from "@/components/ui/SectionLabel"
import { solid, tint } from "@/styles/colors"

const affiliations = [
  { name: "IEEE", sub: "Parent Organization" },
  { name: "IEEE SSIT", sub: "Society on Social Implications of Technology" },
  { name: "SSN College of Engineering", sub: "Host Institution" },
]

export function Partners() {
  return (
    <section className="py-20 px-3 md:px-8">
      <div className="max-w-[1600px] mx-auto">
        <SectionLabel center>Affiliated with</SectionLabel>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
          {affiliations.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center px-6 py-4 rounded-xl transition-colors duration-200 hover:bg-ssit-bg-warm"
              style={{ border: `1px solid ${tint("border", 0.6)}` }}
            >
              <span
                className="font-display font-bold"
                style={{ fontSize: "1rem", color: solid("navy") }}
              >
                {p.name}
              </span>
              <span
                className="font-sans-ui text-xs mt-0.5"
                style={{ color: solid("muted"), fontWeight: 300 }}
              >
                {p.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
