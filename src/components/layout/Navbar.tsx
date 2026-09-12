import { useEffect, useState, useRef } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { navLinks } from "@/data/ssit"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { SoundToggle } from "@/components/ui/SoundToggle"
import { solid, tint, navySolid } from "@/styles/colors"
import { Icons } from "@/components/ui/Icons"
import { useAnnouncements } from "@/firebase/firestore"
import { SearchModal } from "@/components/ui/SearchModal"
import ssitLogo from "@/assets/images/ssit-logo.png"
import {
  playMenuOpenSound,
  playMenuCloseSound,
  playNavTabSound,
} from "@/utils/soundEffects"

const mobileNavLinks = [
  { label: "Home", to: "/", icon: Icons.Home },
  { label: "About", to: "/about", icon: Icons.About },
  { label: "Events", to: "/events", icon: Icons.Calendar },
  { label: "Activities", to: "/activities", icon: Icons.Flag },
  { label: "Membership", to: "/membership", icon: Icons.Users },
  { label: "Gallery", to: "/gallery", icon: Icons.Gallery },
  { label: "Contact", to: "/contact", icon: Icons.Mail },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const { announcements } = useAnnouncements()

  const activeTabRef = useRef<HTMLAnchorElement | null>(null)
  const tabsContainerRef = useRef<HTMLDivElement | null>(null)

  // Smoothly center the active tab in the mobile scroll container
  useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      const container = tabsContainerRef.current
      const tab = activeTabRef.current
      const left = tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2
      container.scrollTo({ left: Math.max(0, left), behavior: "smooth" })
    }
  }, [location.pathname])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === "Escape" && open) {
        playMenuCloseSound()
        setOpen(false)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  // Close drawer when route changes
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const toggleMenu = () => {
    if (!open) {
      playMenuOpenSound()
      setOpen(true)
    } else {
      playMenuCloseSound()
      setOpen(false)
    }
  }

  const handleNavTabClick = () => {
    playNavTabSound()
    setOpen(false)
  }

  const handleBackdropClick = () => {
    playMenuCloseSound()
    setOpen(false)
  }

  // Get live active announcement if published by an admin
  const activeAnnouncement = announcements.find(
    (a) => a.active && a.status === "active" && (!a.expiryDate || new Date(a.expiryDate) >= new Date())
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Dynamic Announcement Ticker (Only renders if an active, non-expired announcement exists) */}
      {activeAnnouncement && (
        <div
          className="px-4 py-1.5 text-xs font-sans-ui flex items-center justify-between gap-3 text-center transition-all"
          style={{
            background:
              activeAnnouncement.priority === "high"
                ? "linear-gradient(90deg, #b91c1c, #991b1b)"
                : "linear-gradient(90deg, #1e3a8a, #0f172a)",
            color: "#ffffff",
          }}
        >
          <div className="max-w-[1600px] mx-auto flex items-center justify-center gap-2 flex-1 truncate px-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="font-medium truncate">{activeAnnouncement.text}</span>
            {activeAnnouncement.ctaUrl && (
              <Link
                to={activeAnnouncement.ctaUrl}
                className="underline underline-offset-2 ml-1 text-amber-200 hover:text-white shrink-0 text-[11px] font-semibold"
              >
                {activeAnnouncement.ctaText || "Learn More"} →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div
        className="rounded-b-2xl transition-all duration-300"
        style={{
          background: "rgba(var(--c-bg-rgb), 0.88)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: `1px solid rgba(56, 189, 248, 0.18)`,
          boxShadow: `0 8px 32px -4px rgba(0, 0, 0, 0.35)`,
        }}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-14 sm:h-16 lg:h-[72px] flex items-center justify-between gap-4">
          {/* Logo & Chapter Brand */}
          <Link to="/" className="flex items-center gap-3.5 shrink-0 group" onClick={() => setOpen(false)}>
            <div className="relative p-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 group-hover:border-amber-500/40 transition-colors">
              <img
                src={ssitLogo}
                alt="IEEE SSIT SSN"
                className="h-8 sm:h-9 w-auto object-contain rounded"
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
              <span className="font-sans-ui text-[9px] sm:text-[10px] tracking-wider uppercase truncate max-w-[180px] sm:max-w-none" style={{ color: solid("muted") }}>
                Society on Social Implications of Tech
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Active Pills */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            {navLinks.map((link) => {
              const isActive =
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname === link.to || location.pathname.startsWith(link.to + "/")
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  data-nav-tab="true"
                  data-no-shockwave="true"
                  onClick={handleNavTabClick}
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

          {/* Actions: Search, Sound, Theme, Join & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              data-no-shockwave="true"
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-colors duration-200 hover:opacity-80"
              style={{ color: solid("navy") }}
            >
              <Icons.Search size={15} />
            </button>

            <SoundToggle />
            <ThemeToggle />

            {/* Join CTA */}
            <Link
              to="/membership"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-sans-ui text-xs uppercase tracking-[0.12em] font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 hover:opacity-95"
              style={{ background: navySolid }}
            >
              Join Chapter
            </Link>

            {/* Mobile Hamburger / Quick Drawer Button */}
            <button
              type="button"
              data-no-shockwave="true"
              onClick={toggleMenu}
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              className={`lg:hidden p-2 rounded-xl border transition-all duration-200 flex items-center justify-center ${
                open
                  ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-300 shadow-md shadow-cyan-500/10"
                  : "border-slate-800 bg-black/10 dark:bg-white/5 text-slate-300 hover:text-white hover:border-slate-700 active:scale-95"
              }`}
            >
              {open ? (
                <Icons.X size={17} />
              ) : (
                <div className="w-4 h-3 flex flex-col justify-between py-0.5">
                  <span className="block w-4 h-0.5 rounded-full bg-current" />
                  <span className="block w-2.5 h-0.5 rounded-full bg-current ml-auto" />
                  <span className="block w-4 h-0.5 rounded-full bg-current" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Tabs (IgniteX-inspired, SSIT styled, always visible) */}
        <div
          data-no-shockwave="true"
          className="lg:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl"
          style={{
            borderBottom: "1px solid rgba(56, 189, 248, 0.12)",
          }}
        >
          <div
            ref={tabsContainerRef}
            className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar scroll-smooth"
            style={{
              WebkitOverflowScrolling: "touch",
            }}
            aria-label="Mobile Horizontal Navigation"
          >
            {mobileNavLinks.map((link) => {
              const isActive =
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname === link.to || location.pathname.startsWith(link.to + "/")
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  data-nav-tab="true"
                  data-no-shockwave="true"
                  onClick={handleNavTabClick}
                  ref={isActive ? activeTabRef : null}
                  className={`px-3.5 py-1.5 rounded-full font-sans-ui text-[11px] uppercase tracking-[0.14em] font-bold shrink-0 transition-all duration-200 select-none flex items-center gap-1.5 ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 scale-[1.02] border border-cyan-300/40"
                      : "text-slate-300 hover:text-white hover:bg-white/5 active:bg-white/10"
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />}
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer Panel */}
        <div
          data-no-shockwave="true"
          className="lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out border-t border-cyan-500/20"
          style={{
            maxHeight: open ? "560px" : "0px",
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
          }}
        >
          <div className="px-5 py-5 space-y-3 rounded-b-2xl bg-slate-950/98 backdrop-blur-2xl">
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-slate-400 font-semibold px-2">
              Full Navigation Menu
            </div>

            <nav className="flex flex-col space-y-1.5" aria-label="Mobile Drawer Navigation">
              {mobileNavLinks.map((link) => {
                const isActive =
                  link.to === "/"
                    ? location.pathname === "/"
                    : location.pathname === link.to || location.pathname.startsWith(link.to + "/")
                const IconComponent = link.icon
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    data-nav-tab="true"
                    data-no-shockwave="true"
                    onClick={handleNavTabClick}
                    className={`px-4 py-3 rounded-xl font-sans-ui text-xs uppercase tracking-wider font-semibold flex items-center justify-between transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-transparent text-cyan-300 border-l-2 border-cyan-400 font-bold shadow-sm shadow-cyan-500/10"
                        : "text-slate-300 hover:text-white hover:bg-white/5 active:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent
                        size={16}
                        className={isActive ? "text-cyan-400" : "text-slate-500"}
                      />
                      <span>{link.label}</span>
                    </div>

                    {isActive ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-cyan-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-slate-600 text-xs">→</span>
                    )}
                  </NavLink>
                )
              })}
            </nav>

            {/* Mobile Action Footer */}
            <div className="pt-3 border-t border-slate-800/80">
              <Link
                to="/membership"
                data-no-shockwave="true"
                onClick={handleNavTabClick}
                className="w-full py-3 rounded-xl text-center font-sans-ui text-xs uppercase tracking-wider font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:opacity-95 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span>Join Chapter</span>
                <span className="text-slate-900 font-bold">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {open && (
        <div
          data-no-shockwave="true"
          className="fixed inset-0 top-[110px] z-40 bg-black/65 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
