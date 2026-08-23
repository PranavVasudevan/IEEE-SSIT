import { Icons } from "./Icons"
import { solid, tint } from "@/styles/colors"

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDanger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="max-w-md w-full p-6 md:p-8 rounded-3xl border shadow-2xl space-y-5 animate-scale-up"
        style={{
          background: solid("bgWarm"),
          borderColor: isDanger ? "rgba(239, 68, 68, 0.4)" : tint("border", 0.8),
        }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`p-3 rounded-2xl border ${
              isDanger
                ? "bg-red-500/15 border-red-500/30 text-red-500"
                : "bg-amber-500/15 border-amber-500/30 text-amber-500"
            }`}
          >
            {isDanger ? <Icons.Trash size={22} /> : <Icons.Shield size={22} />}
          </div>
          <div>
            <h4 className="font-display font-bold text-lg" style={{ color: solid("ink") }}>
              {title}
            </h4>
            <p className="font-sans-ui text-xs" style={{ color: solid("muted") }}>
              Please review this action before proceeding.
            </p>
          </div>
        </div>

        <p className="font-sans-ui text-xs leading-relaxed" style={{ color: solid("muted") }}>
          {message}
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t" style={{ borderColor: tint("border", 0.5) }}>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-xs font-sans-ui font-semibold border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            style={{ borderColor: tint("border", 0.8), color: solid("ink") }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-xs font-sans-ui font-bold text-white transition-transform active:scale-95 shadow-md ${
              isDanger ? "bg-red-600 hover:bg-red-500" : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
