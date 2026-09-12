// Web Audio API Synthesizer for IEEE SSIT Interactive Shockwave

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

const SOUND_STORAGE_KEY = "ssit-sound-enabled"

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true
  const val = localStorage.getItem(SOUND_STORAGE_KEY)
  return val === null ? true : val === "true"
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return
  localStorage.setItem(SOUND_STORAGE_KEY, String(enabled))
  window.dispatchEvent(new CustomEvent("ssit-sound-change", { detail: { enabled } }))
}

export function playShockwaveSound(isGold: boolean = false): void {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // 1. Primary oscillator: smooth pitch frequency sweep
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    // 2. Low-pass filter for smooth acoustic warmth
    const filter = ctx.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.setValueAtTime(isGold ? 1200 : 950, now)
    filter.frequency.exponentialRampToValueAtTime(140, now + 0.12)

    osc.type = isGold ? "triangle" : "sine"
    const startFreq = isGold ? 420 : 360
    const endFreq = isGold ? 110 : 85
    osc.frequency.setValueAtTime(startFreq, now)
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.12)

    // 3. Crisp envelope: fast micro-attack and smooth exponential decay
    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.14)
  } catch {
    // Graceful fallback if audio is not permitted yet
  }
}

/**
 * Distinct acoustic chime when the mobile navigation menu is opened.
 * Soft, rising frequency pair with warm resonance.
 */
export function playMenuOpenSound(): void {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    filter.type = "lowpass"
    filter.frequency.setValueAtTime(1400, now)

    osc.type = "sine"
    osc.frequency.setValueAtTime(460, now)
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.11)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.09, now + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.13)
  } catch {
    // Fallback if browser audio policy prevents immediate playback
  }
}

/**
 * Distinct soft descending tone when the mobile navigation menu is closed.
 */
export function playMenuCloseSound(): void {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    filter.type = "lowpass"
    filter.frequency.setValueAtTime(1100, now)

    osc.type = "sine"
    osc.frequency.setValueAtTime(620, now)
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.09)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.07, now + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.10)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.11)
  } catch {
    // Fallback
  }
}

/**
 * Subtle confirmation ping when a navigation route inside the mobile menu is tapped.
 */
export function playMenuSelectSound(): void {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "triangle"
    osc.frequency.setValueAtTime(840, now)
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.06)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.08, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.08)
  } catch {
    // Fallback
  }
}

