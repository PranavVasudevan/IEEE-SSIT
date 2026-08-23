import { useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { navLinks } from "@/data/ssit"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { solid, tint, navySolid } from "@/styles/colors"
import { Icons } from "@/components/ui/Icons"
import { useAnnouncements } from "@/firebase/firestore"
import { useAuth, logout } from "@/firebase/auth"
import ssitLogo from "@/assets/images/logo.jpg"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { announcements } = useAnnouncements()
  const { role, isAuthorizedAdmin, user } = useAuth()

  // Get active announcement if any
  const activeAnnouncement = announcements.find(a => a.active)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Dynamic Announcement Ticker */}
      {activeAnnouncement && (
        <div
          className="px-4 py-1.5 text-xs font-sans-ui flex items-center justify-between gap-3 text-center transition-all"
          style={{
            background: activeAnnouncement.priority === "high" 
              ? "linear-gradient(90deg, #b91c1c, #991b1b)" 
              : "linear-gradient(90deg, #1e3a8a, #0f172a)",
            color: "#ffffff",
          }}
        >
          <div className="max-w-[1600px] mx-auto flex items-center justify-center gap-2 flex-1 truncate px-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="font-medium truncate">{activeAnnouncement.text}</span>
            {activeAnnouncement.link && (
              <Link
                to={activeAnnouncement.link}
                className="underline underline-offset-2 ml-1 text-amber-200 hover:text-white shrink-0 text-[11px] font-semibold"
              >
                Learn More →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div
        style={{
          background: "rgba(var(--c-bg-rgb), 0.92)",
          backdropFilter: "blur(18px)",
          borderBottom: `1px solid ${tint("border", 0.7)}`,
          boxShadow: `0 4px 20px ${tint("black", 0.04)}`,
        }}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-[72px] flex items-center justify-between gap-4">
          {/* Logo & Chapter Brand */}
          <Link to="/" className="flex items-center gap-3.5 shrink-0 group" onClick={() => setOpen(false)}>
            <div className="relative p-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 group-hover:border-amber-500/40 transition-colors">
              <img
                src={ssitLogo}
                alt="IEEE SSIT SSN"
                className="h-9 w-auto object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none"
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-sm tracking-wide" style={{ color: solid("ink") }}>
                  IEEE SSIT
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-sans-ui uppercase tracking-wider font-semibold rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  SSN CE
                </span>
              </div>
              <span className="font-sans-ui text-[10px] tracking-wider uppercase" style={{ color: solid("muted") }}>
                Society on Social Implications of Tech
              </span>
            </div>
          </Link>

          {/* Navigation Links with Active Pills */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="px-4 py-1.5 rounded-full font-sans-ui text-[12px] uppercase tracking-[0.12em] font-semibold transition-all duration-200"
                  style={{
                    color: isActive ? "#ffffff" : solid("muted"),
                    background: isActive ? navySolid : "transparent",
                    boxShadow: isActive ? `0 2px 8px ${tint("navy", 0.3)}` : "none",
                  }}
                >
                  {link.label}
                </NavLink>
              )
            })}
          </nav>

          {/* User Status & Action CTAs */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {/* ROLE DISTINCTION IN UI */}
            {role === "admin" ? (
              /* Case 1: Approved Admin */
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans-ui font-medium border transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  borderColor: "rgba(16, 185, 129, 0.5)",
                  background: "rgba(16, 185, 129, 0.1)",
                  color: "#059669",
                }}
                title={`Admin CMS (${user?.email})`}
              >
                <Icons.Shield size={14} className="text-emerald-500" />
                <span className="hidden sm:inline">Admin CMS</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </Link>
            ) : role === "user" ? (
              /* Case 2: Normal Authenticated User (No Admin controls) */
              <div className="flex items-center gap-2">
                <span
                  className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono border"
                  style={{ borderColor: tint("border", 0.7), color: solid("muted"), background: solid("bgWarm") }}
                  title={user?.email || "Student Account"}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="max-w-[130px] truncate">{user?.email}</span>
                </span>
                <button
                  onClick={() => logout()}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-sans-ui font-semibold border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              /* Case 3: Unauthenticated Visitor */
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans-ui font-medium border transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  borderColor: tint("border", 0.8),
                  background: solid("bgWarm"),
                  color: solid("ink"),
                }}
                title="Admin Sign-In"
              >
                <Icons.Shield size={14} className="text-amber-500" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            {/* Join CTA */}
            <Link
              to="/membership"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-sans-ui text-xs uppercase tracking-[0.12em] font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 hover:opacity-95"
              style={{ background: navySolid }}
            >
              <Icons.Sparkles size={13} />
              Join Chapter
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg bg-black/5 dark:bg-white/5"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <Icons.X size={20} /> : (
                <div className="space-y-1.2">
                  <span className="block w-5 h-0.5" style={{ background: solid("ink") }} />
                  <span className="block w-5 h-0.5" style={{ background: solid("ink") }} />
                  <span className="block w-3.5 h-0.5" style={{ background: solid("ink") }} />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <div
            className="lg:hidden px-5 py-4 space-y-2 border-t"
            style={{
              borderTopColor: tint("border", 0.5),
              background: solid("bg"),
            }}
          >
            <div className="grid grid-cols-2 gap-2 pb-3">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-xs font-sans-ui uppercase tracking-wider font-semibold text-center transition-colors"
                    style={{
                      background: isActive ? navySolid : solid("bgWarm"),
                      color: isActive ? "#ffffff" : solid("ink"),
                      border: `1px solid ${tint("border", 0.5)}`,
                    }}
                  >
                    {link.label}
                  </NavLink>
                )
              })}
            </div>

            <div className="pt-2 border-t flex flex-col gap-2" style={{ borderTopColor: tint("border", 0.5) }}>
              <Link
                to="/membership"
                onClick={() => setOpen(false)}
                className="w-full py-2.5 rounded-lg text-center font-sans-ui text-xs uppercase tracking-wider font-semibold text-white"
                style={{ background: navySolid }}
              >
                Join Chapter
              </Link>
              {isAuthorizedAdmin ? (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setOpen(false)}
                  className="w-full py-2 rounded-lg text-center font-sans-ui text-xs font-medium border flex items-center justify-center gap-1.5"
                  style={{
                    borderColor: "rgba(16, 185, 129, 0.5)",
                    color: "#059669",
                    background: "rgba(16, 185, 129, 0.1)",
                  }}
                >
                  <Icons.Shield size={14} className="text-emerald-500" />
                  Open Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setOpen(false)}
                  className="w-full py-2 rounded-lg text-center font-sans-ui text-xs font-medium border flex items-center justify-center gap-1.5"
                  style={{
                    borderColor: tint("border", 0.8),
                    color: solid("ink"),
                    background: solid("bgWarm"),
                  }}
                >
                  <Icons.Shield size={14} className="text-amber-500" />
                  Web Dev Admin Sign-In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
