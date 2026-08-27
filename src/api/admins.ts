import { apiClient } from "./client"

export interface AdminRecord {
  id?: string
  email: string
  added_by?: string
  addedBy?: string
  addedAt?: string
  active: boolean
}

export const adminsApi = {
  getAll: () => apiClient<AdminRecord[]>("/api/admins", { requireAuth: true }),
  add: (email: string) =>
    apiClient<AdminRecord>("/api/admins", {
      method: "POST",
      body: JSON.stringify({ email }),
      requireAuth: true,
    }),
  remove: (email: string) =>
    apiClient<{ message: string; email: string }>(`/api/admins/${encodeURIComponent(email)}`, {
      method: "DELETE",
      requireAuth: true,
    }),
}
