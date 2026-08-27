import { apiClient } from "./client"

export interface Announcement {
  id: string
  text: string
  ctaText?: string
  ctaUrl?: string
  cta_text?: string
  cta_url?: string
  priority: "high" | "normal" | "info"
  status: "active" | "draft" | "scheduled" | "expired"
  startDate?: string
  expiryDate?: string
  start_date?: string
  expiry_date?: string
  active: boolean
  createdAt?: string
  created_at?: string
  updatedAt?: string
}

export const announcementsApi = {
  getAll: () => apiClient<Announcement[]>("/api/announcements"),
  create: (data: Partial<Announcement>) =>
    apiClient<Announcement>("/api/announcements", {
      method: "POST",
      body: JSON.stringify(data),
      requireAuth: true,
    }),
  update: (id: string, data: Partial<Announcement>) =>
    apiClient<Announcement>(`/api/announcements/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      requireAuth: true,
    }),
  delete: (id: string) =>
    apiClient<{ message: string; id: string }>(`/api/announcements/${id}`, {
      method: "DELETE",
      requireAuth: true,
    }),
}
