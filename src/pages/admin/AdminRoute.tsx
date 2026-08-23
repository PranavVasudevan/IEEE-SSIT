import { useState, useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/firebase/auth"

export function AdminRoute() {
  const { user, isAuthorizedAdmin, loading } = useAuth()
  const [timeoutExpired, setTimeoutExpired] = useState(false)

  useEffect(() => {
    // 3.5-second failsafe timer so the route never hangs in an infinite loading state
    const timer = setTimeout(() => {
      setTimeoutExpired(true)
    }, 3500)
    return () => clearTimeout(timer)
  }, [])

  if (loading && !timeoutExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="w-9 h-9 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-center space-y-1">
            <h3 className="font-display font-bold text-sm text-white">Verifying Admin Authorization</h3>
            <p className="font-sans-ui text-xs text-slate-400">Authenticating SSN Google credentials...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !isAuthorizedAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
