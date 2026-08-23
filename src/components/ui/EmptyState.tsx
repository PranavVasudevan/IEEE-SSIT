import type { ReactNode } from "react"
import { solid, tint } from "@/styles/colors"
import { Icons, type IconProps } from "@/components/ui/Icons"

interface EmptyStateProps {
  icon?: (props: IconProps) => ReactNode
  title: string
  message?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon = Icons.About, title, message, action }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center gap-3 py-16 px-6 rounded-2xl border"
      style={{ borderColor: tint("border", 0.6), background: solid("bgWarm") }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: tint("navy", 0.1), color: solid("navy") }}
      >
        <Icon size={20} />
      </div>
      <h3 className="font-display font-bold text-base" style={{ color: solid("ink") }}>
        {title}
      </h3>
      {message && (
        <p className="font-sans-ui text-xs max-w-sm" style={{ color: solid("muted") }}>
          {message}
        </p>
      )}
      {action}
    </div>
  )
}
