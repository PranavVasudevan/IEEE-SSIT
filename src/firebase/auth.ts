import { useState, useEffect } from "react"
import { initFirebaseSDK, isFirebaseConfigured } from "./config"
import { isEmailAllowlisted } from "./firestore"
import { UserRole, normalizeEmail, isOfficialSSNEmail, DEFAULT_ADMIN_EMAILS } from "./adminConfig"

export interface AdminUser {
  email: string
  displayName?: string
  photoURL?: string
  uid?: string
}

export interface AuthState {
  user: AdminUser | null
  loading: boolean
  role: UserRole
  isAuthorizedAdmin: boolean
  isSSNUser: boolean
  adminEmail: string | null
  error: string | null
}

const MOCK_AUTH_STORAGE_KEY = "ieee_ssit_mock_auth_user"

export async function loginWithGoogle(): Promise<{
  user: AdminUser | null
  role: UserRole
  isAuthorized: boolean
  error?: string
}> {
  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.auth && sdk.googleProvider) {
        const { signInWithPopup } = await import("firebase/auth")
        const result = await signInWithPopup(sdk.auth, sdk.googleProvider)
        const email = normalizeEmail(result.user.email)
        const isAllowed = await isEmailAllowlisted(email)
        const role: UserRole = isAllowed ? "admin" : "user"

        const userObj: AdminUser = {
          email: result.user.email || "",
          displayName: result.user.displayName || "SSN User",
          photoURL: result.user.photoURL || undefined,
          uid: result.user.uid,
        }

        return {
          user: userObj,
          role,
          isAuthorized: isAllowed,
        }
      }
    } catch (err: any) {
      console.error("Firebase Google Sign-In Error:", err)
      return {
        user: null,
        role: "visitor",
        isAuthorized: false,
        error: err.message || "Failed to sign in with Google",
      }
    }
  }

  // Fallback Dev / Offline Google Login (Defaulting to the approved admin email)
  const defaultAdminUser: AdminUser = {
    email: "sharruk2470048@ssn.edu.in",
    displayName: "Sharruk (Web Dev Admin)",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
    uid: "mock-admin-uid-1",
  }
  localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(defaultAdminUser))
  window.dispatchEvent(new Event("auth_state_changed"))
  const isAllowed = await isEmailAllowlisted(defaultAdminUser.email)
  return {
    user: defaultAdminUser,
    role: isAllowed ? "admin" : "user",
    isAuthorized: isAllowed,
  }
}

export async function simulateLoginWithEmail(email: string, name = "SSN User") {
  const cleanEmail = normalizeEmail(email)
  const mockUser: AdminUser = {
    email: cleanEmail,
    displayName: name,
    photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    uid: `mock-uid-${Date.now()}`,
  }
  localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(mockUser))
  window.dispatchEvent(new Event("auth_state_changed"))
  const isAllowed = await isEmailAllowlisted(cleanEmail)
  return {
    user: mockUser,
    role: (isAllowed ? "admin" : "user") as UserRole,
    isAuthorized: isAllowed,
  }
}

export async function logout(): Promise<void> {
  if (isFirebaseConfigured) {
    try {
      const sdk = await initFirebaseSDK()
      if (sdk && sdk.auth) {
        const { signOut } = await import("firebase/auth")
        await signOut(sdk.auth)
      }
    } catch {}
  }
  localStorage.removeItem(MOCK_AUTH_STORAGE_KEY)
  window.dispatchEvent(new Event("auth_state_changed"))
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<UserRole>("visitor")
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribe = () => {}
    let isMounted = true

    const evaluateUserRole = async (currentUser: AdminUser | null) => {
      if (!isMounted) return
      if (currentUser && currentUser.email) {
        const email = normalizeEmail(currentUser.email)
        setUser(currentUser)
        try {
          // Fast check: If in core hardcoded admins, immediately authorize
          if (DEFAULT_ADMIN_EMAILS.includes(email)) {
            setRole("admin")
            setIsAuthorizedAdmin(true)
            setError(null)
          } else {
            const isAllowed = await isEmailAllowlisted(email)
            if (isAllowed) {
              setRole("admin")
              setIsAuthorizedAdmin(true)
              setError(null)
            } else {
              setRole("user")
              setIsAuthorizedAdmin(false)
              if (!isOfficialSSNEmail(email)) {
                setError(`Access Restricted: ${email} is not an official @ssn.edu.in email address.`)
              } else {
                setError(`Access Restricted: ${email} is an SSN account, but not listed in the authorized Web Dev Admin roster.`)
              }
            }
          }
        } catch (e: any) {
          console.error("Allowlist verification error:", e)
          // Fallback to local admin check
          if (DEFAULT_ADMIN_EMAILS.includes(email)) {
            setRole("admin")
            setIsAuthorizedAdmin(true)
          } else {
            setRole("user")
            setIsAuthorizedAdmin(false)
          }
        }
      } else {
        setUser(null)
        setRole("visitor")
        setIsAuthorizedAdmin(false)
        setError(null)
      }
      if (isMounted) setLoading(false)
    }

    const initAuth = async () => {
      try {
        if (isFirebaseConfigured) {
          const sdk = await initFirebaseSDK()
          if (sdk && sdk.auth) {
            const { onAuthStateChanged } = await import("firebase/auth")
            unsubscribe = onAuthStateChanged(
              sdk.auth,
              async (fbUser) => {
                if (fbUser) {
                  await evaluateUserRole({
                    email: fbUser.email || "",
                    displayName: fbUser.displayName || undefined,
                    photoURL: fbUser.photoURL || undefined,
                    uid: fbUser.uid,
                  })
                } else {
                  await evaluateUserRole(null)
                }
              },
              (authError) => {
                console.error("Firebase auth state listener error:", authError)
                evaluateUserRole(null)
              }
            )
            return
          }
        }
      } catch (err) {
        console.error("Failed to initialize Firebase Auth:", err)
      }

      // Local storage mock / dev auth load
      const loadMockUser = async () => {
        const stored = localStorage.getItem(MOCK_AUTH_STORAGE_KEY)
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            await evaluateUserRole(parsed)
          } catch {
            await evaluateUserRole(null)
          }
        } else {
          await evaluateUserRole(null)
        }
      }

      loadMockUser()
      const handler = () => loadMockUser()
      window.addEventListener("auth_state_changed", handler)
      window.addEventListener("allowlist_changed", handler)
      return () => {
        window.removeEventListener("auth_state_changed", handler)
        window.removeEventListener("allowlist_changed", handler)
      }
    }

    initAuth()

    // Safety timeout: ensure loading is resolved within 2.5s in all environments
    const safetyTimer = setTimeout(() => {
      if (isMounted) setLoading(false)
    }, 2500)

    return () => {
      isMounted = false
      clearTimeout(safetyTimer)
      unsubscribe()
    }
  }, [])

  return {
    user,
    loading,
    role,
    isAuthorizedAdmin,
    isSSNUser: isOfficialSSNEmail(user?.email),
    adminEmail: isAuthorizedAdmin ? user?.email || null : null,
    error,
  }
}
