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
