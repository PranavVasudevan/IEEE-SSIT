import { solid } from "@/styles/colors"

export function SectionLabel({
  children,
  center = false,
}: {
  children: string
  center?: boolean
}) {
  return (
    <p
      className={`font-sans-ui text-xs tracking-widest uppercase mb-3 ${
        center ? "text-center" : ""
      }`}
      style={{ color: solid("navy"), letterSpacing: "0.14em" }}
    >
      {children}
    </p>
  )
}
