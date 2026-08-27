import { apiClient } from "./client"

export interface ChapterEvent {
  id: string
  title: string
  category: "Workshop" | "Hackathon" | "Symposium" | "Seminar" | "Conference" | "Webinar" | "Chapter Event" | "Other"
  date: string
  startTime?: string
  endTime?: string
  time?: string
  start_time?: string
  end_time?: string
  location: string
  mode: "In-Person" | "Online" | "Hybrid"
  description: string
  image?: string
  registerUrl?: string
  externalUrl?: string
  register_url?: string
  external_url?: string
  speaker?: string
  speakerRole?: string
  speaker_role?: string
  deadline?: string
  featured?: boolean
  status: "upcoming" | "completed"
  published?: boolean
  created_at?: string
  updated_at?: string
}

export const eventsApi = {
  getAll: () => apiClient<ChapterEvent[]>("/api/events"),
  getById: (id: string) => apiClient<ChapterEvent>(`/api/events/${id}`),
  create: (data: Partial<ChapterEvent>) =>
    apiClient<ChapterEvent>("/api/events", {
      method: "POST",
      body: JSON.stringify(data),
      requireAuth: true,
    }),
  update: (id: string, data: Partial<ChapterEvent>) =>
    apiClient<ChapterEvent>(`/api/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      requireAuth: true,
    }),
  delete: (id: string) =>
    apiClient<{ message: string; id: string }>(`/api/events/${id}`, {
      method: "DELETE",
      requireAuth: true,
    }),
  duplicate: (id: string) =>
    apiClient<ChapterEvent>(`/api/events/${id}/duplicate`, {
      method: "POST",
      requireAuth: true,
    }),
}
