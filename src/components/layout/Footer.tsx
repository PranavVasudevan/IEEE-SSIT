import { Link } from "react-router-dom"
import ssitLogo from "@/assets/images/ssit-logo.png"
import { navLinks } from "@/data/ssit"
import { solid, tint } from "@/styles/colors"
import { SocialLinks } from "@/components/ui/SocialLinks"

export function Footer() {
  return (
    <footer className="px-5 md:px-10 pt-16 pb-8" style={{ borderTop: `1px solid ${tint("border", .72)}` }}>
      <div className="max-w-[1600px] mx-auto">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-10 pb-14">
          <div>
            <img src={ssitLogo} alt="IEEE SSIT" className="h-9 w-auto object-contain mb-5" />
            <p className="font-display text-3xl md:text-4xl leading-[.95] max-w-sm" style={{ color: solid("ink") }}>
              Technology, considered in its human context.
            </p>
          </div>
          <div>
            <p className="font-sans-ui text-[10px] uppercase tracking-[.16em] mb-4" style={{ color: solid("gold") }}>Explore</p>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => <Link key={link.to} to={link.to} className="font-sans-ui text-sm" style={{ color: solid("muted") }}>{link.label}</Link>)}
            </div>
          </div>
          <div>
            <p className="font-sans-ui text-[10px] uppercase tracking-[.16em] mb-4" style={{ color: solid("gold") }}>Based at</p>
            <p className="font-sans-ui text-sm leading-relaxed max-w-xs mb-5" style={{ color: solid("muted") }}>SSN College of Engineering<br />Chennai — 603 110<br />India</p>
            <SocialLinks />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-5" style={{ borderTop: `1px solid ${tint("border", .55)}` }}>
          <p className="font-sans-ui text-[10px] uppercase tracking-[.14em]" style={{ color: solid("muted") }}>IEEE SSIT · SSN Student Chapter</p>
          <p className="font-sans-ui text-[10px] uppercase tracking-[.14em]" style={{ color: solid("muted") }}>© 2026</p>
        </div>
      </div>
    </footer>
  )
}
