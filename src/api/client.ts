import { initFirebaseSDK, isFirebaseConfigured } from "@/firebase/config"

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL !== undefined
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.DEV
    ? "http://localhost:8000"
    : ""
).replace(/\/$/, "")

async function getAuthToken(): Promise<string | null> {
  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.auth && sdk.auth.currentUser) {
        return await sdk.auth.currentUser.getIdToken()
      }
    } catch (e) {
      console.warn("Could not retrieve Firebase ID token:", e)
    }
  }
  
  // Fallback dev mock token from localStorage if present
  const mockUser = localStorage.getItem("ieee_ssit_mock_auth_user")
  if (mockUser) {
    try {
      const parsed = JSON.parse(mockUser)
      // Encode email in a simple mock JWT structure for dev
      const payload = btoa(JSON.stringify({ email: parsed.email, name: parsed.displayName, uid: parsed.uid }))
      return `mock.${payload}.dev`
    } catch {}
  }
  return null
}

export interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean
}

export async function apiClient<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
  const headers = new Headers(options.headers || {})

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  const token = await getAuthToken()
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`
      try {
        const errorData = await response.json()
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === "string" ? errorData.detail : JSON.stringify(errorData.detail)
        }
      } catch {
        errorMessage = response.statusText || errorMessage
      }
      throw new Error(errorMessage)
    }

    if (response.status === 204) {
      return {} as T
    }

    return (await response.json()) as T
  } catch (err: any) {
    console.error(`API Error on [${options.method || "GET"}] ${endpoint}:`, err)
    throw err
  }
}
