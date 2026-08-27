import { apiClient } from "./client"

export interface ActivityLog {
  id: string
  action: string
  category: "events" | "gallery" | "team" | "announcements" | "inquiries" | "applications" | "admins" | "settings"
  targetTitle?: string
  target_title?: string
  adminEmail: string
  admin_email?: string
  timestamp?: string
  timestamp_str?: string
  details?: string
  created_at?: string
}

export const activityLogsApi = {
  getAll: (limit = 50) =>
    apiClient<ActivityLog[]>(`/api/activity-logs?limit=${limit}`, { requireAuth: true }),
}
