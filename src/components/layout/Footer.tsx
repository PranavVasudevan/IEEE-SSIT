import { Link } from "react-router-dom"
import { navLinks, orgInfo, contact } from "@/data/ssit"
import { SocialLinks } from "@/components/ui/SocialLinks"
import { solid, tint } from "@/styles/colors"
import { Icons } from "@/components/ui/Icons"

export function Footer() {
  return (
    <footer
      className="border-t mt-20 transition-colors duration-300"
      style={{
        background: solid("bgWarm"),
        borderColor: tint("border", 0.7),
      }}
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-wide" style={{ color: solid("ink") }}>
                IEEE SSIT
              </span>
              <span className="px-2 py-0.5 text-[10px] font-sans-ui uppercase tracking-wider font-semibold rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                SSN Student Chapter
              </span>
            </div>
            <p className="font-sans-ui text-xs leading-relaxed max-w-sm" style={{ color: solid("muted") }}>
              {orgInfo.description}
            </p>
            <p className="font-display italic text-xs" style={{ color: solid("gold") }}>
              "{orgInfo.ssitTagline}"
            </p>
            <div className="pt-2">
              <SocialLinks />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-sans-ui text-xs uppercase tracking-widest font-bold" style={{ color: solid("navy") }}>
              Navigation
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-sans-ui text-xs hover:underline hover:text-amber-500 transition-colors"
                    style={{ color: solid("muted") }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Global Affiliations */}
          <div className="space-y-3">
            <h4 className="font-sans-ui text-xs uppercase tracking-widest font-bold" style={{ color: solid("navy") }}>
              Resources
            </h4>
            <ul className="space-y-2 font-sans-ui text-xs" style={{ color: solid("muted") }}>
              <li>
                <a href="https://technologyandsociety.org" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                  Global SSIT Portal <Icons.ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="https://www.ieee.org" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                  IEEE.org <Icons.ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="https://www.ssn.edu.in" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                  SSN College of Engineering <Icons.ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a href="https://ieeexplore.ieee.org" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                  IEEE Xplore Digital Library <Icons.ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Admin */}
          <div className="space-y-3">
            <h4 className="font-sans-ui text-xs uppercase tracking-widest font-bold" style={{ color: solid("navy") }}>
              Chapter Secretariats
            </h4>
            <p className="font-sans-ui text-xs" style={{ color: solid("muted") }}>
              SSN College of Engineering, Rajiv Gandhi Salai (OMR), Kalavakkam, Chennai — 603 110
            </p>
            <p className="font-sans-ui text-xs font-mono" style={{ color: solid("ink") }}>
              {contact.email}
            </p>

          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 font-sans-ui text-xs"
          style={{ borderColor: tint("border", 0.5), color: solid("muted") }}
        >
          <p>© {new Date().getFullYear()} IEEE SSIT SSN Student Branch Chapter. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>IEEE: Advancing Technology for Humanity</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
