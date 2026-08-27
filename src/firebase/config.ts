// Firebase Authentication Configuration Module for IEEE SSIT SSN Student Branch
// Note: Firebase is STRICTLY used for Google Sign-In and Admin Identity Verification.
// Database operations are handled by FastAPI + PostgreSQL, and file storage by Supabase Storage.

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.apiKey.length > 5
)

// Dynamic instance handles
let appInstance: any = null
let authInstance: any = null
let googleProviderInstance: any = null

export async function initFirebaseSDK() {
  if (!isFirebaseConfigured) return null
  if (appInstance) return { app: appInstance, auth: authInstance, googleProvider: googleProviderInstance }

  try {
    const { initializeApp, getApps, getApp } = await import("firebase/app")
    const { getAuth, GoogleAuthProvider } = await import("firebase/auth")

    appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    authInstance = getAuth(appInstance)
    googleProviderInstance = new GoogleAuthProvider()
    googleProviderInstance.setCustomParameters({
      prompt: "select_account",
      hd: "ssn.edu.in",
    })
    return { app: appInstance, auth: authInstance, googleProvider: googleProviderInstance }
  } catch (err) {
    console.warn("Live Firebase Auth SDK not loaded; using dev auth fallback:", err)
    return null
  }
}

export const app = appInstance
export const auth = authInstance
export const googleProvider = googleProviderInstance
