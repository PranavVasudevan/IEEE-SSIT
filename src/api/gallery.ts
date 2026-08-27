import { apiClient } from "./client"

export interface GalleryPhoto {
  id: string
  url: string
  alt?: string
  label: string
  caption?: string
  eventName?: string
  event_name?: string
  category: "Workshop" | "Hackathon" | "Symposium" | "Campus" | "Seminar" | "Other"
  date?: string
  featured?: boolean
  order?: number
  created_at?: string
}

export const galleryApi = {
  getAll: () => apiClient<GalleryPhoto[]>("/api/gallery"),
  create: (data: Partial<GalleryPhoto>) =>
    apiClient<GalleryPhoto>("/api/gallery", {
      method: "POST",
      body: JSON.stringify(data),
      requireAuth: true,
    }),
  update: (id: string, data: Partial<GalleryPhoto>) =>
    apiClient<GalleryPhoto>(`/api/gallery/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      requireAuth: true,
    }),
  delete: (id: string) =>
    apiClient<{ message: string; id: string }>(`/api/gallery/${id}`, {
      method: "DELETE",
      requireAuth: true,
    }),
}
