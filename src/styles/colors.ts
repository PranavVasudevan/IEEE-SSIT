export type AccentToken = "navy" | "gold" | "purple" | "sky"

/** CSS var reference for a solid token color, e.g. solid("navy") -> "var(--c-navy)". */
export function solid(
  token: AccentToken | "ink" | "muted" | "bg" | "bgWarm" | "border",
): string {
  const map: Record<string, string> = {
    navy: "var(--c-navy)",
    gold: "var(--c-gold)",
    purple: "var(--c-purple)",
    sky: "var(--c-sky)",
    ink: "var(--c-ink)",
    muted: "var(--c-muted)",
    bg: "var(--c-bg)",
    bgWarm: "var(--c-bg-warm)",
    border: "var(--c-border)",
  }
  return map[token]
}

/** Text-safe navy variant (lighter in dark mode for contrast on near-black). */
export const navyText = "var(--c-navy-text)"

/** rgba() built from a token's rgb triplet, e.g. tint("navy", 0.08). */
export function tint(
  token: AccentToken | "ink" | "muted" | "bg" | "bgWarm" | "border" | "black",
  alpha: number,
): string {
  const map: Record<string, string> = {
    navy: "var(--c-navy-rgb)",
    gold: "var(--c-gold-rgb)",
    purple: "var(--c-purple-rgb)",
    sky: "var(--c-sky-rgb)",
    ink: "var(--c-ink-rgb)",
    bg: "var(--c-bg-rgb)",
    bgWarm: "var(--c-bg-warm-rgb)",
    border: "var(--c-border-rgb)",
    black: "var(--c-black-rgb)",
  }
  return `rgba(${map[token]}, ${alpha})`
}
