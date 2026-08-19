import { orgInfo } from "@/data/ssit"
import { solid } from "@/styles/colors"

export function PullQuote() {
  return (
    <section
      className="py-24 px-3 md:px-8"
      style={{ background: solid("navy") }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <div
          className="font-display italic mb-6"
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.75rem)",
            color: "#F5F1EC",
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          "{orgInfo.quote}"
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-px" style={{ background: solid("gold") }} />
          <p
            className="font-sans-ui text-sm"
            style={{ color: "rgba(245,241,236,0.65)", fontWeight: 300 }}
          >
            {orgInfo.quoteAttribution}
          </p>
          <div className="w-8 h-px" style={{ background: solid("gold") }} />
        </div>
      </div>
    </section>
  )
}
