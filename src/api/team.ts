import { apiClient } from "./client"

export interface TeamMember {
  id: string
  name: string
  role: string
  team_type: "Office Bearers" | "Web Development" | "Executive" | "Events" | "Design & Media" | "Editorial" | "Other"
  teamType?: string
  department?: string
  year: string
  email?: string
  chapter?: string
  quote?: string
  photo?: string
  linkedin?: string
  github?: string
  bio?: string
  order?: number
  active?: boolean
  created_at?: string
  updated_at?: string
}

export const teamApi = {
  getAll: () => apiClient<TeamMember[]>("/api/team"),
  getById: (id: string) => apiClient<TeamMember>(`/api/team/${id}`),
  create: (data: Partial<TeamMember>) =>
    apiClient<TeamMember>("/api/team", {
      method: "POST",
      body: JSON.stringify(data),
      requireAuth: true,
    }),
  update: (id: string, data: Partial<TeamMember>) =>
    apiClient<TeamMember>(`/api/team/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      requireAuth: true,
    }),
  delete: (id: string) =>
    apiClient<{ message: string; id: string }>(`/api/team/${id}`, {
      method: "DELETE",
      requireAuth: true,
    }),
  reorder: (items: Array<{ id: string; order: number }>) =>
    apiClient<{ message: string }>("/api/team/reorder", {
      method: "POST",
      body: JSON.stringify({ items }),
      requireAuth: true,
    }),
  uploadPhoto: async (id: string, file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return apiClient<TeamMember>(`/api/team/${id}/photo`, {
      method: "POST",
      body: formData,
      requireAuth: true,
    })
  },
}
