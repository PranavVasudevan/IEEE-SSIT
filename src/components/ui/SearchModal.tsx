import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { navLinks, technicalActivityAreas } from "@/data/ssit"
import { useEvents, useTeam } from "@/firebase/firestore"
import { solid, tint } from "@/styles/colors"
import { Icons } from "@/components/ui/Icons"

interface SearchResult {
  id: string
  title: string
  subtitle: string
  to: string
  icon: (props: { size?: number; className?: string }) => React.ReactNode
}

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { events } = useEvents()
  const { team } = useTeam()
  const [query, setQuery] = useState("")

  useEffect(() => {
    if (!open) setQuery("")
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    const pages: SearchResult[] = navLinks
      .filter(l => l.label.toLowerCase().includes(q))
      .map(l => ({ id: `page-${l.to}`, title: l.label, subtitle: "Page", to: l.to, icon: Icons.About }))

    const eventResults: SearchResult[] = events
      .filter(e => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q) || e.category.toLowerCase().includes(q))
      .slice(0, 5)
      .map(e => ({ id: `event-${e.id}`, title: e.title, subtitle: `${e.category} · ${e.date}`, to: "/activities", icon: Icons.Calendar }))

    const teamResults: SearchResult[] = team
      .filter(m => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q))
      .slice(0, 5)
      .map(m => ({ id: `team-${m.id}`, title: m.name, subtitle: m.role, to: "/about", icon: Icons.Users }))

    const focusResults: SearchResult[] = technicalActivityAreas
      .filter(a => a.title.toLowerCase().includes(q))
      .slice(0, 5)
      .map(a => ({ id: `focus-${a.title}`, title: a.title, subtitle: "Technical Activity Area", to: "/about", icon: Icons.Target }))

    return [...pages, ...eventResults, ...teamResults, ...focusResults]
  }, [query, events, team])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
        style={{ background: solid("bg"), borderColor: tint("border", 0.6) }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b" style={{ borderColor: tint("border", 0.5) }}>
          <Icons.Search size={16} style={{ color: solid("muted") }} />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, events, team members..."
            className="flex-1 py-3.5 bg-transparent outline-none font-sans-ui text-sm"
            style={{ color: solid("ink") }}
          />
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
            <Icons.X size={14} style={{ color: solid("muted") }} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === "" ? (
            <p className="p-6 text-center font-sans-ui text-xs" style={{ color: solid("muted") }}>
              Start typing to search the site.
            </p>
          ) : results.length === 0 ? (
            <p className="p-6 text-center font-sans-ui text-xs" style={{ color: solid("muted") }}>
              No results for "{query}".
            </p>
          ) : (
            <div className="p-2">
              {results.map((r) => {
                const Icon = r.icon
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      navigate(r.to)
                      onClose()
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: tint("navy", 0.1), color: solid("navy") }}
                    >
                      <Icon size={14} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-sans-ui text-sm font-semibold truncate" style={{ color: solid("ink") }}>
                        {r.title}
                      </span>
                      <span className="block font-sans-ui text-[11px] truncate" style={{ color: solid("muted") }}>
                        {r.subtitle}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div
          className="px-4 py-2.5 border-t flex items-center justify-between text-[10px] font-sans-ui uppercase tracking-wider"
          style={{ borderColor: tint("border", 0.5), color: solid("muted") }}
        >
          <span>IEEE SSIT SSN Search</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  )
}
