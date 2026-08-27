import { apiClient } from "./client"

export interface MembershipApplication {
  id: string
  name: string
  register_number: string
  registerNumber?: string
  email: string
  phone: string
  department: string
  year: string
  ieee_membership_number?: string
  ieeeMembershipNumber?: string
  vertical_choice_1?: string
  verticalChoice1?: string
  why_suitable_1?: string
  whySuitable1?: string
  vertical_choice_2?: string
  verticalChoice2?: string
  why_suitable_2?: string
  whySuitable2?: string
  vertical_choice_3?: string
  verticalChoice3?: string
  why_suitable_3?: string
  whySuitable3?: string
  past_experience?: string
  pastExperience?: string
  how_you_support?: string
  howYouSupport?: string
  proof_file_url?: string
  status: string
  created_at?: string
}

export const membershipApi = {
  apply: (data: Partial<MembershipApplication>) =>
    apiClient<MembershipApplication>("/api/membership/apply", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getApplications: () =>
    apiClient<MembershipApplication[]>("/api/membership/applications", { requireAuth: true }),
  updateStatus: (id: string, status: string) =>
    apiClient<MembershipApplication>(`/api/membership/applications/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
      requireAuth: true,
    }),
  delete: (id: string) =>
    apiClient<{ message: string; id: string }>(`/api/membership/applications/${id}`, {
      method: "DELETE",
      requireAuth: true,
    }),
}
