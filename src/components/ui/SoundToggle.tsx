import { useState, useEffect } from "react"
import { isSoundEnabled, setSoundEnabled, playShockwaveSound } from "@/utils/soundEffects"
import { solid } from "@/styles/colors"

export function SoundToggle() {
  const [enabled, setEnabled] = useState<boolean>(isSoundEnabled)

  useEffect(() => {
    const handleSoundChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled: boolean }>
      if (customEvent.detail) {
        setEnabled(customEvent.detail.enabled)
      }
    }
    window.addEventListener("ssit-sound-change", handleSoundChange)
    return () => window.removeEventListener("ssit-sound-change", handleSoundChange)
  }, [])

  const toggle = () => {
    const next = !enabled
    setEnabled(next)
    setSoundEnabled(next)
    if (next) {
      playShockwaveSound(true)
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? "Mute interactive touch audio" : "Enable interactive touch audio"}
      title={enabled ? "Sound FX: ON (Click to mute)" : "Sound FX: OFF (Click to unmute)"}
      className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:opacity-80 relative group"
      style={{ color: solid("navy") }}
    >
      {enabled ? (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-50"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  )
}
