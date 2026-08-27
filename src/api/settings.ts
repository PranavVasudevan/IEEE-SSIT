import { apiClient } from "./client"

export interface FAQItem {
  id: string
  question: string
  answer: string
  active: boolean
  order: number
}

export interface ChapterInfoData {
  chapterName: string
  tagline: string
  mission: string
  vision: string
  corePhilosophy: string
  keyTenets: string[]
  officialEmail: string
  location: string
  chairName: string
  chairEmail: string
  socialLinks: {
    instagram?: string
    linkedin?: string
    github?: string
    twitter?: string
    youtube?: string
  }
  focusAreas: Array<{
    title: string
    desc: string
    contactName: string
    contactEmail: string
    accent: string
  }>
}

export interface MembershipContentData {
  joinPortalUrl: string
  brochureUrl?: string
  steps: Array<{
    step: string
    title: string
    desc: string
    linkText?: string
    linkUrl?: string
  }>
  benefits: Array<{
    title: string
    desc: string
  }>
  faqs: FAQItem[]
}

export const settingsApi = {
  getChapterInfo: () =>
    apiClient<{ key: string; value: ChapterInfoData }>("/api/settings/chapter_info"),
  updateChapterInfo: (data: Partial<ChapterInfoData>) =>
    apiClient<{ key: string; value: ChapterInfoData }>("/api/settings/chapter_info", {
      method: "PUT",
      body: JSON.stringify({ value: data }),
      requireAuth: true,
    }),
  getMembershipContent: () =>
    apiClient<{ key: string; value: MembershipContentData }>("/api/settings/membership_content"),
  updateMembershipContent: (data: Partial<MembershipContentData>) =>
    apiClient<{ key: string; value: MembershipContentData }>("/api/settings/membership_content", {
      method: "PUT",
      body: JSON.stringify({ value: data }),
      requireAuth: true,
    }),
}
