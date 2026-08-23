import { useState } from "react"
import { solid, tint, navySolid } from "@/styles/colors"
import { Icons } from "@/components/ui/Icons"
import {
  DEPARTMENT_OPTIONS,
  YEAR_OPTIONS,
  VERTICAL_CHOICE_1_OPTIONS,
  VERTICAL_CHOICE_2_OPTIONS,
  VERTICAL_CHOICE_3_OPTIONS,
  buildJoinFormPrefillUrl,
  type JoinFormValues,
} from "@/data/joinFormMapping"

const EMPTY_VALUES: JoinFormValues = {
  name: "",
  registerNumber: "",
  email: "",
  phone: "",
  department: "",
  year: "",
  ieeeMembershipNumber: "",
  verticalChoice1: "",
  whySuitable1: "",
  verticalChoice2: "",
  whySuitable2: "",
  verticalChoice3: "",
  whySuitable3: "",
  pastExperience: "",
  howYouSupport: "",
}

const inputStyle = {
  background: solid("bg"),
  borderColor: tint("border", 0.8),
  color: solid("ink"),
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="font-sans-ui text-xs font-semibold" style={{ color: solid("ink") }}>
        {label} {required && <span style={{ color: solid("gold") }}>*</span>}
      </span>
      {children}
    </label>
  )
}

interface JoinApplicationFormProps {
  ieeeJoinUrl: string
}

export function JoinApplicationForm({ ieeeJoinUrl }: JoinApplicationFormProps) {
  const [values, setValues] = useState<JoinFormValues>(EMPTY_VALUES)

  const set = <K extends keyof JoinFormValues>(key: K, value: string) =>
    setValues((v) => ({ ...v, [key]: value }))

  const canSubmit =
    values.name && values.registerNumber && values.email && values.phone && values.department && values.year

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    const url = buildJoinFormPrefillUrl(values)
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl text-sm font-sans-ui border outline-none focus:ring-2 transition-shadow"

  return (
    <div className="space-y-6">
      {/* IEEE Membership Prerequisite Banner */}
      <div
        className="p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ background: tint("gold", 0.1), borderColor: tint("gold", 0.3) }}
      >
        <div className="p-2.5 rounded-xl shrink-0" style={{ background: tint("gold", 0.15), color: solid("gold") }}>
          <Icons.AlertTriangle size={18} />
        </div>
        <div className="flex-1 space-y-1">
          <p className="font-sans-ui text-sm font-bold" style={{ color: solid("ink") }}>
            Active IEEE membership is required before applying
          </p>
          <p className="font-sans-ui text-xs leading-relaxed" style={{ color: solid("muted") }}>
            If you haven't joined IEEE yet, do that first — you'll need your membership number below, and a
            screenshot of your payment confirmation to upload as proof on the final step of the application.
          </p>
        </div>
        <a
          href={ieeeJoinUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-sans-ui text-xs uppercase tracking-wider font-semibold text-white whitespace-nowrap"
          style={{ background: navySolid }}
        >
          Join IEEE <Icons.ExternalLink size={12} />
        </a>
      </div>

      <form onSubmit={handleContinue} className="space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-base" style={{ color: solid("ink") }}>
            Your Details
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <input required value={values.name} onChange={(e) => set("name", e.target.value)} className={inputClass} style={inputStyle} />
            </Field>
            <Field label="Register Number" required>
              <input required value={values.registerNumber} onChange={(e) => set("registerNumber", e.target.value)} className={inputClass} style={inputStyle} />
            </Field>
            <Field label="College Email ID" required>
              <input required type="email" value={values.email} onChange={(e) => set("email", e.target.value)} className={inputClass} style={inputStyle} />
            </Field>
            <Field label="Phone Number" required>
              <input required type="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} style={inputStyle} />
            </Field>
            <Field label="Department" required>
              <select required value={values.department} onChange={(e) => set("department", e.target.value)} className={inputClass} style={inputStyle}>
                <option value="" disabled>Select department</option>
                {DEPARTMENT_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Year" required>
              <select required value={values.year} onChange={(e) => set("year", e.target.value)} className={inputClass} style={inputStyle}>
                <option value="" disabled>Select year</option>
                {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
            <Field label="IEEE Membership Number">
              <input value={values.ieeeMembershipNumber} onChange={(e) => set("ieeeMembershipNumber", e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. 9XXXXXXX" />
            </Field>
          </div>
        </div>

        {/* Vertical Preferences */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-base" style={{ color: solid("ink") }}>
            Vertical Preferences
          </h3>
          <p className="font-sans-ui text-xs" style={{ color: solid("muted") }}>
            Rank up to three verticals you'd like to contribute to, and tell us why you'd be a good fit for each.
          </p>

          {[
            { n: 1, choiceKey: "verticalChoice1" as const, whyKey: "whySuitable1" as const, options: VERTICAL_CHOICE_1_OPTIONS },
            { n: 2, choiceKey: "verticalChoice2" as const, whyKey: "whySuitable2" as const, options: VERTICAL_CHOICE_2_OPTIONS },
            { n: 3, choiceKey: "verticalChoice3" as const, whyKey: "whySuitable3" as const, options: VERTICAL_CHOICE_3_OPTIONS },
          ].map(({ n, choiceKey, whyKey, options }) => (
            <div key={n} className="p-4 rounded-xl border space-y-3" style={{ borderColor: tint("border", 0.6) }}>
              <Field label={`Vertical Choice ${n}`}>
                <select value={values[choiceKey]} onChange={(e) => set(choiceKey, e.target.value)} className={inputClass} style={inputStyle}>
                  <option value="">Select a vertical</option>
                  {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
              {values[choiceKey] && (
                <Field label="Why do you think you'd be suitable for that role?">
                  <textarea
                    value={values[whyKey]}
                    onChange={(e) => set(whyKey, e.target.value)}
                    rows={2}
                    className={`${inputClass} resize-none`}
                    style={inputStyle}
                  />
                </Field>
              )}
            </div>
          ))}
        </div>

        {/* Experience */}
        <div className="space-y-4">
          <Field label="What are some of your past experiences regarding the preferences you've filled?">
            <textarea value={values.pastExperience} onChange={(e) => set("pastExperience", e.target.value)} rows={2} className={`${inputClass} resize-none`} style={inputStyle} />
          </Field>
          <Field label="How will you support the goals of your preferred vertical?">
            <textarea value={values.howYouSupport} onChange={(e) => set("howYouSupport", e.target.value)} rows={2} className={`${inputClass} resize-none`} style={inputStyle} />
          </Field>
        </div>

        {/* Final reminder + submit */}
        <div className="p-4 rounded-xl border flex items-start gap-2.5" style={{ borderColor: tint("border", 0.6), background: solid("bgWarm") }}>
          <Icons.AlertTriangle size={15} className="shrink-0 mt-0.5" style={{ color: solid("gold") }} />
          <p className="font-sans-ui text-xs leading-relaxed" style={{ color: solid("muted") }}>
            "Continue" opens the official Google Form in a new tab with everything above already filled in. You'll
            just need to attach your IEEE/SSIT payment screenshot (and optionally a sample of prior work) and hit
            Submit there to finish.
          </p>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          style={{ background: navySolid }}
        >
          Continue to Application <Icons.ExternalLink size={13} />
        </button>
      </form>
    </div>
  )
}
