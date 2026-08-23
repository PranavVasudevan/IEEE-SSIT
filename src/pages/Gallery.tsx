import { useState } from "react"
import { SectionLabel } from "@/components/ui/SectionLabel"
import { solid, tint } from "@/styles/colors"
import { Icons } from "@/components/ui/Icons"
import { useGallery, GalleryPhoto } from "@/firebase/firestore"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"
import { EmptyState } from "@/components/ui/EmptyState"
import { Skeleton } from "@/components/ui/Skeleton"

export default function Gallery() {
  useDocumentTitle("Gallery")
  const { gallery, loading } = useGallery()
  const [selectedFilter, setSelectedFilter] = useState<string>("All")
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null)

  const categories = ["All", "Workshop", "Hackathon", "Symposium", "Campus"]

  const filteredPhotos = gallery.filter(photo => {
    if (selectedFilter === "All") return true
    return photo.category === selectedFilter
  })

  return (
    <div className="pt-28 pb-20 px-4 md:px-8 space-y-12">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header & Category Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b" style={{ borderColor: tint("border", 0.6) }}>
          <div>
            <SectionLabel>Photo Gallery</SectionLabel>
            <h1 className="font-display text-3xl md:text-5xl font-bold" style={{ color: solid("ink") }}>
              Life at IEEE SSIT SSN
            </h1>
            <p className="font-sans-ui text-xs md:text-sm mt-1" style={{ color: solid("muted") }}>
              Glimpses from workshops, symposiums, hackathons, and student technical sessions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-sans-ui font-semibold transition-all ${
                  selectedFilter === cat
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "border text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
                style={{ borderColor: tint("border", 0.6) }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <EmptyState
            icon={Icons.Gallery}
            title="No photos found"
            message={
              selectedFilter === "All"
                ? "The gallery is empty right now — check back after the next chapter event."
                : `No photos tagged "${selectedFilter}" yet. Try another category.`
            }
          />
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group relative overflow-hidden rounded-2xl border cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
              style={{
                borderColor: tint("border", 0.6),
                background: solid("bgWarm"),
              }}
            >
              <div className="h-60 overflow-hidden relative">
                <img
                  src={photo.url}
                  alt={photo.alt || photo.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-sans-ui font-semibold text-white bg-black/60 backdrop-blur-md">
                    {photo.category}
                  </span>
                  {photo.date && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-sans-ui font-semibold text-amber-200 bg-amber-950/70 backdrop-blur-md">
                      {photo.date}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm" style={{ color: solid("ink") }}>
                    {photo.label}
                  </h3>
                  {photo.alt && (
                    <p className="font-sans-ui text-xs truncate max-w-xs" style={{ color: solid("muted") }}>
                      {photo.alt}
                    </p>
                  )}
                </div>
                <span className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <Icons.Gallery size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Lightbox Modal */}
        {activePhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
            onClick={() => setActivePhoto(null)}
          >
            <div
              className="relative max-w-4xl w-full rounded-3xl overflow-hidden bg-slate-900 border border-white/20 shadow-2xl space-y-4 p-4 md:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950">
                    {activePhoto.category}
                  </span>
                  <span className="text-white font-display font-semibold text-lg">
                    {activePhoto.label}
                  </span>
                </div>
                <button
                  onClick={() => setActivePhoto(null)}
                  className="p-2 rounded-xl text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Icons.X size={18} />
                </button>
              </div>

              <div className="max-h-[65vh] overflow-hidden rounded-xl bg-black flex items-center justify-center">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.label}
                  className="max-h-[65vh] w-auto object-contain rounded-xl"
                />
              </div>

              {activePhoto.alt && (
                <p className="text-slate-300 font-sans-ui text-xs md:text-sm">
                  {activePhoto.alt}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
