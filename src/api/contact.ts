import { apiClient } from "./client"

export type SubmissionStatus =
  | "new"
  | "reviewed"
  | "resolved"
  | "archived"
  | "under_review"
  | "approved"
  | "rejected"
  | "contacted"

export interface ContactSubmission {
  id: string
  name: string
  email: string
  department?: string
  year?: string
  inquiry_type?: string
  type?: "membership" | "general" | "speaker" | "sponsorship"
  interest?: string
  ieee_member?: string
  ssit_member?: string
  ieeeMember?: string
  ssitMember?: string
  message: string
  status: SubmissionStatus
  created_at?: string
  timestamp?: string
}

export const contactApi = {
  submit: (data: Omit<ContactSubmission, "id" | "status" | "created_at" | "timestamp">) =>
    apiClient<ContactSubmission>("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getInquiries: () => apiClient<ContactSubmission[]>("/api/contact/inquiries", { requireAuth: true }),
  updateStatus: (id: string, status: SubmissionStatus) =>
    apiClient<ContactSubmission>(`/api/contact/inquiries/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
      requireAuth: true,
    }),
  delete: (id: string) =>
    apiClient<{ message: string; id: string }>(`/api/contact/inquiries/${id}`, {
      method: "DELETE",
      requireAuth: true,
    }),
}
