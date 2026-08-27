import { apiClient } from "./client"

export interface FileUploadResponse {
  url: string
  path: string
  filename: string
  bucket: string
}

export const storageApi = {
  uploadFile: async (file: File, folder: "team" | "gallery" | "events" | "branding" | "applications" | "general" = "general") => {
    const formData = new FormData()
    formData.append("file", file)
    return apiClient<FileUploadResponse>(`/api/storage/upload?folder=${folder}`, {
      method: "POST",
      body: formData,
      requireAuth: true,
    })
  },
}
