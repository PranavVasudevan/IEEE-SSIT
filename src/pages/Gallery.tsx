import conferencePhoto from "@/assets/images/conference-photo.png"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { solid, tint } from "@/styles/colors"

const photos = [
  {
    url: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&h=400&fit=crop&auto=format",
    alt: "Students at computer workstations during a session",
    label: "Technical Workshop",
  },
  {
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop&auto=format",
    alt: "Engineering student at a laptop",
    label: "Research Session",
  },
  {
    url: "https://images.unsplash.com/photo-1778876088509-982115d463ef?w=600&h=400&fit=crop&auto=format",
    alt: "Audience in lecture hall",
    label: "Chapter Symposium",
  },
  {
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=800&fit=crop&auto=format",
    alt: "LED technology panel",
    label: "Technology Expo",
  },
  {
    url: "https://images.unsplash.com/photo-1782388713336-fcb8aa6db8f0?w=600&h=400&fit=crop&auto=format",
    alt: "Two students collaborating at laptop",
    label: "Team Collaboration",
  },
  {
    url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop&auto=format",
    alt: "Student in lab coat with engineering equipment",
    label: "Lab Session",
  },
]

export default function Gallery() {
  return (
    <div className="pt-32 pb-20 px-3 md:px-8">
      <div className="max-w-[1600px] mx-auto">
        <SectionLabel>Gallery</SectionLabel>
        <h1
          className="font-display mb-12"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: solid("ink"),
          }}
        >
          Life at SSIT
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-xl ${
                i === 3 ? "row-span-2" : ""
              }`}
              style={{
                border: `1px solid ${tint("border", 0.5)}`,
                boxShadow: `0 2px 12px ${tint("black", 0.04)}`,
              }}
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  i === 3 ? "h-full min-h-[400px]" : "h-48 md:h-52"
                }`}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
                style={{
                  background: `linear-gradient(to top, ${tint("navy", 0.75)} 0%, transparent 60%)`,
                }}
              >
                <span
                  className="font-sans-ui text-xs text-white"
                  style={{ fontWeight: 400 }}
                >
                  {photo.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Conference photo — full width feature */}
        <div
          className="mt-4 relative rounded-xl overflow-hidden group"
          style={{ border: `1px solid ${tint("border", 0.5)}` }}
        >
          <img
            src={conferencePhoto}
            alt="Envision Hackathon at SSN College of Engineering"
            className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: "center top" }}
          />
          <div
            className="absolute inset-0 flex items-end p-6"
            style={{
              background: `linear-gradient(to top, ${tint("navy", 0.85)} 0%, transparent 55%)`,
            }}
          >
            <div>
              <span
                className="inline-block px-2.5 py-1 text-xs font-sans-ui rounded-full mb-2"
                style={{
                  background: tint("gold", 0.9),
                  color: solid("ink"),
                  fontWeight: 500,
                }}
              >
                Featured Event
              </span>
              <h3
                className="font-display text-white font-bold"
                style={{ fontSize: "1.5rem" }}
              >
                Envision Hackathon
              </h3>
              <p className="font-sans-ui text-white/75 text-sm mt-1">
                SSN College of Engineering
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
