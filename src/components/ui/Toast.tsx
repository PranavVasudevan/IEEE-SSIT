import React, { createContext, useContext, useState, useCallback } from "react"
import { Icons } from "./Icons"

export type ToastType = "success" | "error" | "info" | "warning"

export interface ToastMessage {
  id: string
  title: string
  message?: string
  type: ToastType
}

interface ToastContextType {
  showToast: (title: string, type?: ToastType, message?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((title: string, type: ToastType = "success", message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    const newToast: ToastMessage = { id, title, message, type }
    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render Portal */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((toast) => {
          let bg = "bg-slate-900/95 border-slate-700 text-white"
          let icon = <Icons.Check size={18} className="text-emerald-400 shrink-0" />

          if (toast.type === "success") {
            bg = "bg-emerald-950/90 border-emerald-500/40 text-emerald-100"
            icon = <Icons.Check size={18} className="text-emerald-400 shrink-0" />
          } else if (toast.type === "error") {
            bg = "bg-red-950/90 border-red-500/40 text-red-100"
            icon = <Icons.X size={18} className="text-red-400 shrink-0" />
          } else if (toast.type === "warning") {
            bg = "bg-amber-950/90 border-amber-500/40 text-amber-100"
            icon = <Icons.Shield size={18} className="text-amber-400 shrink-0" />
          } else if (toast.type === "info") {
            bg = "bg-blue-950/90 border-blue-500/40 text-blue-100"
            icon = <Icons.Bell size={18} className="text-blue-400 shrink-0" />
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all duration-300 animate-slide-up ${bg}`}
            >
              {icon}
              <div className="flex-1 min-w-0">
                <h5 className="font-sans-ui text-xs font-bold leading-snug">{toast.title}</h5>
                {toast.message && (
                  <p className="font-sans-ui text-[11px] opacity-80 leading-relaxed mt-0.5">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-60 hover:opacity-100 p-0.5 text-xs transition-opacity"
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
