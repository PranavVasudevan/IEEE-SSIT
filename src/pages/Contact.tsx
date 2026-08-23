import { useState } from "react"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { SocialLinks } from "@/components/ui/SocialLinks"
import { contact } from "@/data/ssit"
import { solid, tint, navySolid } from "@/styles/colors"
import { Icons } from "@/components/ui/Icons"
import { submitContactInquiry } from "@/firebase/firestore"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    type: "membership" as "membership" | "general" | "speaker" | "sponsorship",
    interest: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return

    setSubmitting(true)
    try {
      await submitContactInquiry(formData)
      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        department: "",
        type: "membership",
        interest: "",
        message: "",
      })
    } catch (err) {
      console.error("Submission error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pt-28 pb-20 px-4 md:px-8 space-y-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact Info & Chapter Coordinates */}
          <div className="space-y-8">
            <div className="space-y-4">
              <SectionLabel>Reach Out</SectionLabel>
              <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight" style={{ color: solid("ink") }}>
                Connect with the IEEE SSIT SSN Secretariats
              </h1>
              <p className="font-sans-ui text-sm md:text-base leading-relaxed" style={{ color: solid("muted") }}>
                Whether you are a student exploring technology ethics, an academic interested in conference co-sponsorship, or looking to invite IEEE SSIT speakers to campus — we would love to hear from you.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Icons.Mail, label: "Official Chapter Email", value: contact.email, href: `mailto:${contact.email}` },
                { icon: Icons.Globe, label: "Global SSIT Website", value: contact.web, href: `https://${contact.web}` },
                { icon: Icons.Users, label: "Chapter Location", value: "SSN College of Engineering, Rajiv Gandhi Salai (OMR), Kalavakkam, Chennai — 603 110" },
              ].map((item, i) => {
                const IconComp = item.icon
                return (
                  <div
                    key={i}
                    className="p-5 rounded-2xl border flex items-start gap-4 shadow-sm"
                    style={{ background: solid("bgWarm"), borderColor: tint("border", 0.6) }}
                  >
                    <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                      <IconComp size={18} />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-sans-ui text-[11px] uppercase tracking-wider font-semibold" style={{ color: solid("muted") }}>
                        {item.label}
                      </span>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noreferrer" className="block font-sans-ui text-sm font-semibold hover:underline truncate" style={{ color: solid("navy") }}>
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-sans-ui text-sm leading-relaxed" style={{ color: solid("ink") }}>
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pt-2">
              <h3 className="font-sans-ui text-xs uppercase tracking-widest font-bold mb-3" style={{ color: solid("navy") }}>
                Follow Our Social Channels
              </h3>
              <SocialLinks />
            </div>
          </div>

          {/* Right: Interactive Application & Inquiry Form */}
          <div
            className="p-6 md:p-10 rounded-3xl border shadow-xl relative"
            style={{
              background: solid("bgWarm"),
              borderColor: tint("border", 0.7),
            }}
          >
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                  <Icons.Check size={32} />
                </div>
                <h3 className="font-display font-bold text-2xl" style={{ color: solid("ink") }}>
                  Inquiry Received!
                </h3>
                <p className="font-sans-ui text-sm max-w-md mx-auto" style={{ color: solid("muted") }}>
                  Thank you for reaching out to the IEEE SSIT SSN Student Branch. Our secretariat team will review your message and reply back to your SSN email shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl font-sans-ui text-xs font-semibold border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  style={{ borderColor: tint("border", 0.8), color: solid("ink") }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1 pb-2">
                  <h2 className="font-display font-bold text-2xl" style={{ color: solid("ink") }}>
                    Chapter Intake & Help Request
                  </h2>
                  <p className="font-sans-ui text-xs" style={{ color: solid("muted") }}>
                    Your message will be routed directly to the SSN Web Dev & Core Secretariat admin center.
                  </p>
                </div>

                {/* Inquiry Type Tabs */}
                <div className="space-y-1.5">
                  <label className="block font-sans-ui text-xs font-semibold" style={{ color: solid("navy") }}>
                    Inquiry Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "membership", label: "Join Chapter" },
                      { id: "general", label: "General Help" },
                      { id: "speaker", label: "Guest Speaker" },
                      { id: "sponsorship", label: "Sponsorship" },
                    ].map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setFormData({ ...formData, type: t.id as any })}
                        className={`py-2 px-3 rounded-xl text-xs font-sans-ui font-semibold transition-all border ${
                          formData.type === t.id
                            ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm"
                            : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="block font-sans-ui text-xs font-semibold" style={{ color: solid("navy") }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharruk V"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl font-sans-ui text-xs border outline-none focus:ring-2"
                    style={{ background: solid("bg"), borderColor: tint("border", 0.8), color: solid("ink") }}
                  />
                </div>

                {/* Email & Dept */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-sans-ui text-xs font-semibold" style={{ color: solid("navy") }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="yourname@ssn.edu.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl font-sans-ui text-xs border outline-none focus:ring-2"
                      style={{ background: solid("bg"), borderColor: tint("border", 0.8), color: solid("ink") }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-sans-ui text-xs font-semibold" style={{ color: solid("navy") }}>
                      Department & Year
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CSE — 3rd Year"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl font-sans-ui text-xs border outline-none focus:ring-2"
                      style={{ background: solid("bg"), borderColor: tint("border", 0.8), color: solid("ink") }}
                    />
                  </div>
                </div>

                {/* Focus Interest */}
                <div className="space-y-1">
                  <label className="block font-sans-ui text-xs font-semibold" style={{ color: solid("navy") }}>
                    Area of Interest
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AI Ethics, Assistive Tech, Web Dev Team"
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl font-sans-ui text-xs border outline-none focus:ring-2"
                    style={{ background: solid("bg"), borderColor: tint("border", 0.8), color: solid("ink") }}
                  />
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="block font-sans-ui text-xs font-semibold" style={{ color: solid("navy") }}>
                    Message / Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your background or inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl font-sans-ui text-xs border outline-none focus:ring-2 resize-none"
                    style={{ background: solid("bg"), borderColor: tint("border", 0.8), color: solid("ink") }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold text-white shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-50"
                  style={{ background: navySolid }}
                >
                  {submitting ? "Transmitting..." : "Submit Inquiry to Chapter"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
