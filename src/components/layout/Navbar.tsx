import { useEffect, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { navLinks } from "@/data/ssit"
import { solid, tint } from "@/styles/colors"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 md:px-10">
      <nav
        className="flex items-center gap-1 px-2 py-2 rounded-full transition-all duration-300"
        style={{
          background: scrolled ? tint("bg", 0.95) : tint("bg", 0.82),
          backdropFilter: "blur(16px)",
          border: `1px solid ${tint("border", 0.75)}`,
          boxShadow: scrolled
            ? `0 6px 28px ${tint("navy", 0.1)}, 0 1px 4px ${tint("black", 0.06)}`
            : `0 2px 14px ${tint("navy", 0.06)}`,
        }}
      >
        {/* Desktop links */}
        <ul className="hidden md:flex items-center">
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className="px-4 py-2 text-sm font-sans-ui transition-colors duration-200 rounded-full hover:bg-ssit-bg-warm"
                style={({ isActive }) => ({
                  color: isActive ? solid("navy") : solid("muted"),
                  fontWeight: isActive ? 500 : 400,
                  letterSpacing: "0.01em",
                })}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div
          className="hidden md:block w-px h-5 mx-1"
          style={{ background: tint("border", 0.9) }}
        />

        <ThemeToggle />

        {/* CTA */}
        <Link
          to="/membership"
          className="hidden md:inline-flex items-center gap-1.5 px-5 py-2 ml-1 text-sm font-sans-ui rounded-full transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{
            background: solid("navy"),
            color: "#fff",
            fontWeight: 500,
            letterSpacing: "0.01em",
          }}
        >
          Join Chapter
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden mx-2 p-2 rounded-full hover:bg-ssit-bg-warm transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span
              className={`block h-px transition-all duration-300 ${
                open ? "rotate-45 translate-y-2" : ""
              }`}
              style={{ background: solid("ink") }}
            />
            <span
              className={`block h-px transition-all duration-300 ${
                open ? "opacity-0 scale-x-0" : ""
              }`}
              style={{ background: solid("ink") }}
            />
            <span
              className={`block h-px transition-all duration-300 ${
                open ? "-rotate-45 -translate-y-2" : ""
              }`}
              style={{ background: solid("ink") }}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden absolute top-full mt-2 left-6 right-6 rounded-2xl p-3 flex flex-col gap-1"
          style={{
            background: tint("bg", 0.97),
            border: `1px solid ${tint("border", 0.7)}`,
            boxShadow: `0 8px 32px ${tint("navy", 0.1)}`,
            backdropFilter: "blur(12px)",
          }}
        >
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 text-sm font-sans-ui rounded-xl hover:bg-ssit-bg-warm transition-colors"
              style={({ isActive }) => ({
                color: isActive ? solid("navy") : solid("ink"),
              })}
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/membership"
            onClick={() => setOpen(false)}
            className="mt-1 px-4 py-2.5 text-sm font-sans-ui text-center rounded-xl"
            style={{
              background: solid("navy"),
              color: "#fff",
              fontWeight: 500,
            }}
          >
            Join Chapter
          </Link>
        </div>
      )}
    </header>
  )
}
