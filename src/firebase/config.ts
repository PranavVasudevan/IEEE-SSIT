// Firebase Configuration Module for IEEE SSIT SSN Student Branch
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
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
let dbInstance: any = null
let googleProviderInstance: any = null

export async function initFirebaseSDK() {
  if (!isFirebaseConfigured) return null
  if (appInstance) return { app: appInstance, auth: authInstance, db: dbInstance, googleProvider: googleProviderInstance }

  try {
    const { initializeApp, getApps, getApp } = await import("firebase/app")
    const { getAuth, GoogleAuthProvider } = await import("firebase/auth")
    const { getFirestore } = await import("firebase/firestore")

    appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    authInstance = getAuth(appInstance)
    dbInstance = getFirestore(appInstance)
    googleProviderInstance = new GoogleAuthProvider()
    googleProviderInstance.setCustomParameters({
      prompt: "select_account",
      hd: "ssn.edu.in",
    })
    return { app: appInstance, auth: authInstance, db: dbInstance, googleProvider: googleProviderInstance }
  } catch (err) {
    console.warn("Live Firebase SDK not loaded; using local reactive mock store:", err)
    return null
  }
}

export const app = appInstance
export const auth = authInstance
export const db = dbInstance
export const googleProvider = googleProviderInstance
