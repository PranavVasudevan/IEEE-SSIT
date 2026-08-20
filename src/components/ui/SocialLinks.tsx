import { socialLinks } from "@/data/ssit"
import { solid } from "@/styles/colors"

const icons = {
  instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  ),
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.5 10.2V17M7.5 7v.01M11.5 17v-4.2c0-1.4 1-2.3 2.2-2.3s2.1.9 2.1 2.3V17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
}

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socialLinks.map((s) =>
        s.href ? (
          <a
            key={s.platform}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.label}
            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 hover:opacity-70"
            style={{ color: solid("muted") }}
          >
            {icons[s.platform]}
          </a>
        ) : (
          <span
            key={s.platform}
            aria-label={`${s.label} — link coming soon`}
            title={`${s.label} — link coming soon`}
            className="flex items-center justify-center w-8 h-8 rounded-full opacity-40 cursor-not-allowed"
            style={{ color: solid("muted") }}
          >
            {icons[s.platform]}
          </span>
        ),
      )}
    </div>
  )
}
