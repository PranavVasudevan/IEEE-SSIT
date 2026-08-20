import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { navLinks } from "@/data/ssit"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { solid, tint, navySolid } from "@/styles/colors"
import ssitLogo from "@/assets/images/ssit-logo.png"

export function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50" style={{ background: "rgba(var(--c-bg-rgb), .94)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${tint("border", .72)}` }}>
      <div className="max-w-[1600px] mx-auto px-5 md:px-10 h-[74px] flex items-center justify-between gap-8">
        <Link to="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
          <img src={ssitLogo} alt="IEEE SSIT SSN Student Chapter" className="h-8 w-auto object-contain" />
          <span className="hidden sm:block font-sans-ui text-[10px] uppercase tracking-[.18em] leading-tight" style={{ color: solid("ink") }}>
            IEEE SSIT<br /><span style={{ color: solid("muted") }}>SSN Student Chapter</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className="font-sans-ui text-[11px] uppercase tracking-[.14em]" style={({ isActive }) => ({ color: isActive ? solid("gold") : solid("muted"), fontWeight: 600 })}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/membership" className="hidden sm:inline-flex items-center px-4 py-2 font-sans-ui text-[11px] uppercase tracking-[.14em]" style={{ background: navySolid, color: "#fff" }}>
            Join chapter
          </Link>
          <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <span className="block w-5 h-px mb-1.5" style={{ background: solid("ink"), transform: open ? "translateY(4px) rotate(45deg)" : undefined }} />
            <span className="block w-5 h-px" style={{ background: solid("ink"), transform: open ? "rotate(-45deg)" : undefined }} />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden px-5 pb-5 pt-2" style={{ borderTop: `1px solid ${tint("border", .55)}`, background: solid("bg") }}>
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="py-3 font-sans-ui text-xs uppercase tracking-[.14em]" style={({ isActive }) => ({ color: isActive ? solid("gold") : solid("ink"), borderBottom: `1px solid ${tint("border", .45)}` })}>
                {link.label}
              </NavLink>
            ))}
            <Link to="/membership" onClick={() => setOpen(false)} className="mt-4 py-3 text-center font-sans-ui text-xs uppercase tracking-[.14em]" style={{ background: navySolid, color: "#fff" }}>
              Join chapter
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
