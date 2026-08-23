import { useState } from "react"
import { Link } from "react-router-dom"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { solid, tint, navySolid } from "@/styles/colors"
import { Icons } from "@/components/ui/Icons"
import { useMembershipContent } from "@/firebase/firestore"

export default function Membership() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const { membershipContent } = useMembershipContent()

  return (
    <div className="pt-28 pb-20 px-4 md:px-8 space-y-16">
      <div className="max-w-[1600px] mx-auto space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <SectionLabel>Student Membership</SectionLabel>
          <h1 className="font-display text-3xl md:text-5xl font-bold" style={{ color: solid("ink") }}>
            Empower Your Engineering Career with Purpose
          </h1>
          <p className="font-sans-ui text-sm md:text-base leading-relaxed" style={{ color: solid("muted") }}>
            Join a worldwide community of technologists who believe engineering excellence is defined by its positive impact on humanity and society.
          </p>
        </div>

        {/* 3-Step Visual Roadmap */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-bold" style={{ color: solid("ink") }}>
            How to Join IEEE SSIT in 3 Steps
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {membershipContent.steps.map((step, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl border flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
                style={{ background: solid("bgWarm"), borderColor: tint("border", 0.6) }}
              >
                <div className="space-y-3">
                  <span className="font-display font-extrabold text-4xl text-amber-500/40 group-hover:text-amber-500 transition-colors">
                    {step.step}
                  </span>
                  <h3 className="font-display font-bold text-lg" style={{ color: solid("ink") }}>
                    {step.title}
                  </h3>
                  <p className="font-sans-ui text-xs leading-relaxed" style={{ color: solid("muted") }}>
                    {step.desc}
                  </p>
                </div>

                <div className="pt-3 border-t" style={{ borderColor: tint("border", 0.5) }}>
                  {step.linkUrl?.startsWith("http") ? (
                    <a
                      href={step.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-sans-ui text-xs font-semibold hover:underline flex items-center gap-1"
                      style={{ color: solid("navy") }}
                    >
                      {step.linkText || "Open Portal →"} <Icons.ExternalLink size={12} />
                    </a>
                  ) : step.linkUrl ? (
                    <Link
                      to={step.linkUrl}
                      className="font-sans-ui text-xs font-semibold hover:underline flex items-center gap-1"
                      style={{ color: solid("navy") }}
                    >
                      {step.linkText || "Continue →"}
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Matrix */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-bold" style={{ color: solid("ink") }}>
            Why Join IEEE & SSIT?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {membershipContent.benefits.map((benefit, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border space-y-3"
                style={{ background: solid("bgWarm"), borderColor: tint("border", 0.6) }}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Icons.Check size={16} />
                </div>
                <h3 className="font-display font-bold text-base" style={{ color: solid("ink") }}>
                  {benefit.title}
                </h3>
                <p className="font-sans-ui text-xs leading-relaxed" style={{ color: solid("muted") }}>
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section (Dynamically loaded from Firestore) */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-bold" style={{ color: solid("ink") }}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {membershipContent.faqs.filter(f => f.active !== false).map((faq, idx) => (
              <div
                key={faq.id || idx}
                className="rounded-2xl border overflow-hidden transition-colors"
                style={{ background: solid("bgWarm"), borderColor: tint("border", 0.6) }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-display font-bold text-sm md:text-base flex items-center justify-between gap-4 cursor-pointer"
                  style={{ color: solid("ink") }}
                >
                  <span>{faq.question}</span>
                  <span className="text-amber-500 text-lg font-mono">
                    {openFaq === idx ? "−" : "+"}
                  </span>
                </button>

                {openFaq === idx && (
                  <div
                    className="p-5 pt-0 text-xs md:text-sm font-sans-ui leading-relaxed border-t"
                    style={{
                      borderTopColor: tint("border", 0.4),
                      color: solid("muted"),
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Join CTA Strip */}
        <div
          className="p-8 md:p-12 rounded-3xl text-white text-center space-y-6 relative overflow-hidden"
          style={{ background: navySolid }}
        >
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="font-display text-2xl md:text-4xl font-bold">
              Ready to Advance Technology for Humanity?
            </h2>
            <p className="font-sans-ui text-xs md:text-sm text-slate-300">
              Complete your membership onboarding today or contact our chapter coordinators with any questions.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={membershipContent.joinPortalUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold bg-amber-400 text-black hover:bg-amber-300 transition-colors shadow-lg active:scale-95 flex items-center gap-1.5"
            >
              Open IEEE Join Portal
              <Icons.ExternalLink size={13} />
            </a>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              Contact Chapter Office Bearers
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
