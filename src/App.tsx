import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/context/ThemeContext"
import { ToastProvider } from "@/components/ui/Toast"
import { Layout } from "@/components/layout/Layout"
import Home from "@/pages/Home"
import About from "@/pages/About"
import Activities from "@/pages/Activities"
import Membership from "@/pages/Membership"
import Gallery from "@/pages/Gallery"
import Contact from "@/pages/Contact"
import AdminLogin from "@/pages/admin/AdminLogin"
import AdminDashboard from "@/pages/admin/AdminDashboard"
import { AdminRoute } from "@/pages/admin/AdminRoute"

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Pages with Standard Layout Header & Footer */}
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="activities" element={<Activities />} />
              <Route path="membership" element={<Membership />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="contact" element={<Contact />} />
              
              {/* Admin Login Route */}
              <Route path="admin/login" element={<AdminLogin />} />

              {/* Protected Admin CMS Dashboard */}
              <Route element={<AdminRoute />}>
                <Route path="admin/dashboard" element={<AdminDashboard />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}
