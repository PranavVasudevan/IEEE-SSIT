import { Link } from "react-router-dom"
import ssitLogo from "@/assets/images/ssit-logo.jpeg"
import { navLinks } from "@/data/ssit"
import { solid, tint } from "@/styles/colors"

export function Footer() {
  return (
    <footer
      className="py-10 px-3 md:px-8"
      style={{ borderTop: `1px solid ${tint("border", 0.6)}` }}
    >
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={ssitLogo}
            alt="SSIT"
            className="h-7 w-auto object-contain"
          />
          <span
            className="font-sans-ui text-xs"
            style={{ color: solid("muted"), fontWeight: 300 }}
          >
            IEEE SSIT · SSN Student Chapter
          </span>
        </div>
        <div className="flex gap-6 flex-wrap justify-center">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="font-sans-ui text-xs transition-colors hover:opacity-80"
              style={{ color: solid("muted"), fontWeight: 300 }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <p
          className="font-sans-ui text-xs"
          style={{ color: solid("muted"), fontWeight: 300 }}
        >
          © 2026 IEEE SSIT SSN
        </p>
      </div>
    </footer>
  )
}
