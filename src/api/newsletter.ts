import { apiClient } from "./client"

export interface NewsletterSubscriber {
  id: string
  email: string
  created_at?: string
  timestamp?: string
}

export const newsletterApi = {
  subscribe: (email: string) =>
    apiClient<NewsletterSubscriber>("/api/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  getAll: () => apiClient<NewsletterSubscriber[]>("/api/newsletter/subscribers", { requireAuth: true }),
  delete: (id: string) =>
    apiClient<{ message: string; id: string }>(`/api/newsletter/subscribers/${id}`, {
      method: "DELETE",
      requireAuth: true,
    }),
}
