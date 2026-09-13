export interface GalleryPhotoData {
  id: string
  url: string
  alt: string
  label: string
  caption: string
  event_name?: string
  eventName?: string
  category: "Workshop" | "Symposium" | "Hackathon" | "Campus" | string
  date: string
  featured?: boolean
  order: number
}

export const CANONICAL_GALLERY_PHOTOS: GalleryPhotoData[] = [
  {
    id: "gal-3",
    url: "/ssit-group-photo.jpg",
    alt: "IEEE SPS and SSIT Inauguration SSN Student Branches 2026",
    label: "Chapter Inaugural Ceremony 2026",
    caption: "Official IEEE SPS and SSIT Chapter Inauguration at SSN College of Engineering with Chief Guest Mr. Veera Raghavan Seshadri.",
    category: "Symposium",
    date: "2026",
    featured: true,
    order: 1,
  },
  {
    id: "gal-1",
    url: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&h=550&fit=crop&auto=format",
    alt: "Students at computer workstations during a session",
    label: "Technical Workshop 2025",
    caption: "Hands-on AI ethics testing on real-world datasets.",
    event_name: "AI Ethics & Algorithmic Bias",
    eventName: "AI Ethics & Algorithmic Bias",
    category: "Workshop",
    date: "Feb 2025",
    featured: true,
    order: 2,
  },
  {
    id: "gal-2",
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=550&fit=crop&auto=format",
    alt: "Engineering student at a laptop",
    label: "Ethics in AI Research Session",
    caption: "Student researchers analyzing ethical implications.",
    category: "Symposium",
    date: "Jan 2025",
    order: 3,
  },
  {
    id: "gal-4",
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=1000&fit=crop&auto=format",
    alt: "LED technology panel",
    label: "Assistive Tech Demonstration",
    caption: "Smart assistive hardware prototype for visually impaired.",
    category: "Workshop",
    date: "Nov 2024",
    featured: true,
    order: 4,
  },
  {
    id: "gal-5",
    url: "https://images.unsplash.com/photo-1782388713336-fcb8aa6db8f0?w=800&h=550&fit=crop&auto=format",
    alt: "Two students collaborating at laptop",
    label: "Envision Hackathon Sprint",
    caption: "Teams building rural connectivity prototypes.",
    event_name: "Envision Hackathon",
    eventName: "Envision Hackathon",
    category: "Hackathon",
    date: "Oct 2024",
    order: 5,
  },
  {
    id: "gal-6",
    url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=550&fit=crop&auto=format",
    alt: "Student in lab with engineering equipment",
    label: "Hardware Sustainability Lab",
    caption: "Testing e-waste recycling and circular economy circuit boards.",
    category: "Campus",
    date: "Sep 2024",
    order: 6,
  },
]
