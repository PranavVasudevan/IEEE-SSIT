import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { solid } from "@/styles/colors"

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen relative z-10 flex flex-col">
      <Navbar />
      <main className="flex-1 relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
