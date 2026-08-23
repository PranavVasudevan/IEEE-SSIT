import { useState } from "react"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { leadership } from "@/data/ssit"
import { solid, tint, navySolid } from "@/styles/colors"
import { Icons } from "@/components/ui/Icons"
import { useTeam, useChapterInfo } from "@/firebase/firestore"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"
import { EmptyState } from "@/components/ui/EmptyState"
import { PersonCardSkeletonGrid } from "@/components/ui/Skeleton"
import ssitLogo from "@/assets/images/logo.jpg"

function getMemberInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export default function About() {
  useDocumentTitle("About")
  const [activeTab, setActiveTab] = useState<"overview" | "focus" | "leadership" | "team">("overview")
  const { team, loading: teamLoading } = useTeam()
  const { chapterInfo } = useChapterInfo()

  const webDevMembers = team.filter(m => m.teamType === "Web Development" && (m.active !== false))
  const execMembers = team.filter(m => m.teamType !== "Web Development" && (m.active !== false))

  return (
    <div className="pt-28 pb-20 px-4 md:px-8 space-y-12">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header with SSIT Emblem */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b" style={{ borderColor: tint("border", 0.6) }}>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <img
                src={ssitLogo}
                alt="IEEE SSIT Logo"
                className="h-12 w-auto object-contain rounded-lg p-1 bg-black/5 dark:bg-white/5 border border-black/10"
              />
              <div>
                <SectionLabel>About the Society</SectionLabel>
                <h1 className="font-display text-3xl md:text-5xl font-bold" style={{ color: solid("ink") }}>
                  Technology & Human Responsibility
                </h1>
              </div>
            </div>
          </div>

          {/* Interactive Sub-Tabs for rapid single-view navigation */}
          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl border" style={{ background: solid("bgWarm"), borderColor: tint("border", 0.6) }}>
            {[
              { id: "overview", label: "Overview & Mission", icon: Icons.About },
              { id: "focus", label: `Focus Areas (${chapterInfo.focusAreas.length})`, icon: Icons.Target },
              { id: "leadership", label: "Global Leadership", icon: Icons.Globe },
              { id: "team", label: `SSN Chapter Team (${team.length})`, icon: Icons.Users },
            ].map((tab) => {
              const IconComponent = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans-ui font-semibold transition-all duration-200 cursor-pointer"
                  style={{
                    background: isActive ? navySolid : "transparent",
                    color: isActive ? "#ffffff" : solid("muted"),
                    boxShadow: isActive ? `0 2px 8px ${tint("navy", 0.25)}` : "none",
                  }}
                >
                  <IconComponent size={13} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab 1: Overview & History */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-5 gap-8 items-start">
            <div className="md:col-span-3 space-y-6">
              <div className="p-6 md:p-8 rounded-3xl border space-y-4" style={{ background: solid("bgWarm"), borderColor: tint("border", 0.6) }}>
                <h2 className="font-display text-2xl font-bold" style={{ color: solid("ink") }}>
                  Our Mission & Purpose
                </h2>
                <p className="font-sans-ui leading-relaxed text-sm md:text-base font-light" style={{ color: solid("ink") }}>
                  {chapterInfo.mission}
                </p>
                <p className="font-sans-ui leading-relaxed text-xs md:text-sm" style={{ color: solid("muted") }}>
                  {chapterInfo.vision}
                </p>
              </div>

              <div className="p-6 md:p-8 rounded-3xl border space-y-4" style={{ background: solid("bgWarm"), borderColor: tint("border", 0.6) }}>
                <h3 className="font-display text-xl font-bold" style={{ color: solid("ink") }}>
                  Society History & Evolution
                </h3>
                <p className="font-sans-ui leading-relaxed text-sm" style={{ color: solid("muted") }}>
                  Over five decades, IEEE SSIT has stood as the premier international forum where engineers, policy-makers, and ethicists convene to address the unintended consequences and immense potential of technological progress.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border" style={{ borderColor: tint("border", 0.5), background: solid("bg") }}>
                    <div className="font-display font-extrabold text-2xl" style={{ color: solid("navy") }}>1972</div>
                    <div className="font-sans-ui text-xs" style={{ color: solid("muted") }}>TAB Committee Established</div>
                  </div>
                  <div className="p-4 rounded-xl border" style={{ borderColor: tint("border", 0.5), background: solid("bg") }}>
                    <div className="font-display font-extrabold text-2xl" style={{ color: solid("gold") }}>1982</div>
                    <div className="font-sans-ui text-xs" style={{ color: solid("muted") }}>Evolved to IEEE SSIT Society</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="p-6 md:p-8 rounded-3xl text-white space-y-4" style={{ background: navySolid }}>
                <div className="flex items-center gap-2 text-amber-300 text-xs font-sans-ui uppercase tracking-widest font-semibold">
                  <Icons.Shield size={14} /> SSIT Core Philosophy
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold italic leading-snug">
                  "{chapterInfo.corePhilosophy || chapterInfo.tagline}"
                </h3>
                <p className="font-sans-ui text-xs text-slate-300 leading-relaxed">
                  SSIT's core message has become the inspirational tag-line for the IEEE organization as a whole: <em>"Advancing Technology for Humanity"</em>.
                </p>
              </div>

              <div className="p-6 rounded-3xl border space-y-3" style={{ background: solid("bgWarm"), borderColor: tint("border", 0.6) }}>
                <h4 className="font-sans-ui text-xs uppercase tracking-widest font-bold" style={{ color: solid("navy") }}>
                  Key Tenets of Technology
                </h4>
                <ul className="space-y-2 font-sans-ui text-xs" style={{ color: solid("muted") }}>
                  {chapterInfo.keyTenets.map((tenet, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{tenet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Focus Areas (Dynamic from Firestore) */}
        {activeTab === "focus" && (
          <div className="space-y-6">
            <div className="max-w-2xl space-y-2">
              <h2 className="font-display text-2xl md:text-3xl font-bold" style={{ color: solid("ink") }}>
                Technical Activity Areas
              </h2>
              <p className="font-sans-ui text-sm" style={{ color: solid("muted") }}>
                Discover our technical working groups and reach out to respective domain coordinators.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapterInfo.focusAreas.map((area) => (
                <div
                  key={area.title}
                  className="p-7 rounded-2xl border flex flex-col justify-between space-y-4 group transition-all duration-300 hover:shadow-lg"
                  style={{
                    background: solid("bgWarm"),
                    borderColor: tint("border", 0.6),
                  }}
                >
                  <div className="space-y-3">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ background: solid(area.accent as any || "gold") }}
                    />
                    <h3 className="font-display font-bold text-lg" style={{ color: solid("ink") }}>
                      {area.title}
                    </h3>
                    <p className="font-sans-ui text-xs leading-relaxed" style={{ color: solid("muted") }}>
                      {area.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: tint("border", 0.5) }}>
                    <div>
                      <span className="block font-sans-ui font-semibold" style={{ color: solid("ink") }}>
                        {area.contactName}
                      </span>
                      <span className="text-[11px] font-mono" style={{ color: solid("muted") }}>
                        {area.contactEmail}
                      </span>
                    </div>
                    <a
                      href={`mailto:${area.contactEmail}?subject=Inquiry on ${area.title}`}
                      className="p-2 rounded-xl border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      style={{ borderColor: tint("border", 0.8) }}
                      title="Contact Chair"
                    >
                      <Icons.Mail size={14} className="text-amber-500" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Global Leadership */}
        {activeTab === "leadership" && (
          <div className="space-y-6">
            <div className="max-w-2xl space-y-2">
              <h2 className="font-display text-2xl md:text-3xl font-bold" style={{ color: solid("ink") }}>
                IEEE SSIT Global Leadership
              </h2>
              <p className="font-sans-ui text-sm" style={{ color: solid("muted") }}>
                Distinguished researchers, fellows, and ethicists directing SSIT global policy and standards.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadership.map((l) => (
                <div
                  key={l.role}
                  className="p-6 rounded-2xl border space-y-3"
                  style={{ background: solid("bgWarm"), borderColor: tint("border", 0.6) }}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans-ui font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                      {l.role}
                    </span>
                    <span className="text-xs font-mono" style={{ color: solid("muted") }}>
                      Term: {l.term}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl" style={{ color: solid("ink") }}>
                    {l.name}
                  </h3>
                  <a
                    href={`mailto:${l.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono hover:underline"
                    style={{ color: solid("navy") }}
                  >
                    <Icons.Mail size={13} /> {l.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: SSN Student Chapter Team & Web Dev Team */}
        {activeTab === "team" && (
          <div className="space-y-10">
            {/* Executive Committee */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold" style={{ color: solid("ink") }}>
                    Student Chapter Executive Committee
                  </h2>
                  <p className="font-sans-ui text-xs" style={{ color: solid("muted") }}>
                    SSN College of Engineering Student Branch Chapter Office Bearers
                  </p>
                </div>
              </div>

              {teamLoading ? (
                <PersonCardSkeletonGrid count={3} />
              ) : execMembers.length === 0 ? (
                <EmptyState icon={Icons.Users} title="Executive committee roster coming soon" />
              ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {execMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-6 rounded-2xl border flex items-start gap-4 shadow-sm group hover:border-amber-500/40 transition-colors"
                    style={{ background: solid("bgWarm"), borderColor: tint("border", 0.6) }}
                  >
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-14 h-14 rounded-2xl object-cover shrink-0 border"
                        style={{ borderColor: tint("border", 0.8) }}
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center font-display font-bold text-base tracking-wider border shadow-sm transition-transform group-hover:scale-105"
                        style={{
                          background: "linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(245, 158, 11, 0.15))",
                          borderColor: "rgba(245, 158, 11, 0.35)",
                          color: "rgb(217, 119, 6)",
                        }}
                      >
                        {getMemberInitials(member.name)}
                      </div>
                    )}
                    <div className="space-y-1 flex-1 min-w-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-sans-ui font-bold uppercase tracking-wider bg-blue-500/15 text-blue-700 dark:text-blue-300">
                        {member.role}
                      </span>
                      <h3 className="font-display font-bold text-base truncate" style={{ color: solid("ink") }}>
                        {member.name}
                      </h3>
                      <p className="font-sans-ui text-xs" style={{ color: solid("muted") }}>
                        {member.department} • {member.year}
                      </p>
                      {member.bio && (
                        <p className="font-sans-ui text-[11px] leading-tight pt-1 line-clamp-2" style={{ color: solid("muted") }}>
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>

            {/* Web Development Team (Core Developers) */}
            <div className="space-y-4 pt-6 border-t" style={{ borderColor: tint("border", 0.6) }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-2xl font-bold" style={{ color: solid("ink") }}>
                      Web Development & Engineering Team
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-sans-ui font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      {webDevMembers.length} Core Members
                    </span>
                  </div>
                  <p className="font-sans-ui text-xs" style={{ color: solid("muted") }}>
                    Building, maintaining, and architecting the IEEE SSIT SSN Chapter Portal and Content Management System.
                  </p>
                </div>
              </div>

              {teamLoading ? (
                <PersonCardSkeletonGrid count={3} />
              ) : webDevMembers.length === 0 ? (
                <EmptyState icon={Icons.Users} title="Web dev team roster coming soon" />
              ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {webDevMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-6 rounded-2xl border flex items-start gap-4 shadow-sm group hover:border-amber-500/40 transition-colors"
                    style={{ background: solid("bgWarm"), borderColor: tint("border", 0.6) }}
                  >
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-14 h-14 rounded-2xl object-cover shrink-0 border"
                        style={{ borderColor: tint("border", 0.8) }}
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center font-display font-bold text-base tracking-wider border shadow-sm transition-transform group-hover:scale-105"
                        style={{
                          background: "linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(245, 158, 11, 0.15))",
                          borderColor: "rgba(245, 158, 11, 0.35)",
                          color: "rgb(217, 119, 6)",
                        }}
                      >
                        {getMemberInitials(member.name)}
                      </div>
                    )}
                    <div className="space-y-1 flex-1 min-w-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-sans-ui font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300">
                        {member.role}
                      </span>
                      <h3 className="font-display font-bold text-base truncate" style={{ color: solid("ink") }}>
                        {member.name}
                      </h3>
                      <p className="font-sans-ui text-xs" style={{ color: solid("muted") }}>
                        {member.department} • {member.year}
                      </p>
                      <p className="font-sans-ui text-[11px] font-mono truncate" style={{ color: solid("navy") }}>
                        {member.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
