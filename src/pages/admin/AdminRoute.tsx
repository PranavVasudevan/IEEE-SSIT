import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/firebase/auth"
import { solid } from "@/styles/colors"

export function AdminRoute() {
  const { user, isAuthorizedAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-sans-ui text-xs font-semibold" style={{ color: solid("muted") }}>
            Authenticating Web Dev Admin...
          </span>
        </div>
      </div>
    )
  }

  if (!user || !isAuthorizedAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
