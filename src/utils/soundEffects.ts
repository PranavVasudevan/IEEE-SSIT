// Web Audio API Synthesizer for IEEE SSIT Interactive Shockwave & Navigation

let audioCtx: AudioContext | null = null
let isAudioUnlocked = false
let lastSoundTime = 0
const MIN_SOUND_INTERVAL_MS = 65 // Prevent duplicate trigger from touchstart + pointerdown + click on mobile

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

/**
 * Robust Mobile AudioContext Unlocker.
 * Mobile WebKit / Safari and Chrome require a direct user interaction gesture
 * (touchstart, touchend, pointerdown, or click) to initialize the hardware audio bus.
 * This runs once, unlocks the context by playing an inaudible 1-sample buffer,
 * and clears the event listeners.
 */
export function initMobileAudioUnlock(): void {
  if (typeof window === "undefined" || isAudioUnlocked) return

  const unlock = () => {
    try {
      const ctx = getAudioContext()
      if (!ctx) return

      if (ctx.state === "suspended") {
        ctx.resume().then(() => {
          // Play inaudible silent buffer to unlock iOS Safari hardware pipeline
          try {
            const buffer = ctx.createBuffer(1, 1, 22050)
            const source = ctx.createBufferSource()
            source.buffer = buffer
            source.connect(ctx.destination)
            source.start(0)
            isAudioUnlocked = true
          } catch {}
        }).catch(() => {})
      } else if (ctx.state === "running") {
        isAudioUnlocked = true
      }
    } catch {
      // Ignore if autoplay policy rejects before interaction
    }

    // Clean up one-time listeners once unlocked
    ["touchstart", "touchend", "pointerdown", "click"].forEach((evt) => {
      window.removeEventListener(evt, unlock)
      document.removeEventListener(evt, unlock)
    })
  }

  // Attach one-time listeners to window and document
  ["touchstart", "touchend", "pointerdown", "click"].forEach((evt) => {
    window.addEventListener(evt, unlock, { once: true, passive: true })
    document.addEventListener(evt, unlock, { once: true, passive: true })
  })
}

// Auto-initialize unlock listeners on client
if (typeof window !== "undefined") {
  initMobileAudioUnlock()
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

/**
 * General click/touch interactive shockwave sound effect.
 * Smooth pitch sweep with low-pass acoustic resonance.
 */
export function playShockwaveSound(isGold: boolean = false): void {
  if (!isSoundEnabled()) return

  // Deduplication / Debounce: prevent multiple sounds for one tap
  const nowMs = performance.now()
  if (nowMs - lastSoundTime < MIN_SOUND_INTERVAL_MS) return
  lastSoundTime = nowMs

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
    // Graceful fallback
  }
}

/**
 * Dedicated, distinct sound for navigation-tab clicks.
 * Crisp harmonic chime with pleasant crystal resonance (880Hz / 1320Hz),
 * acoustically distinct from the deep bass shockwave sound.
 */
export function playNavTabSound(): void {
  if (!isSoundEnabled()) return

  // Deduplication lock: prevent any other sound from firing during this tap
  const nowMs = performance.now()
  if (nowMs - lastSoundTime < MIN_SOUND_INTERVAL_MS) return
  lastSoundTime = nowMs

  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // Dual harmonic oscillator: fundamental (880Hz) + overtone (1320Hz)
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    filter.type = "bandpass"
    filter.frequency.setValueAtTime(1100, now)
    filter.Q.setValueAtTime(2.0, now)

    osc1.type = "sine"
    osc1.frequency.setValueAtTime(880, now)
    osc1.frequency.exponentialRampToValueAtTime(1046, now + 0.07) // A5 to C6 subtle lift

    osc2.type = "triangle"
    osc2.frequency.setValueAtTime(1320, now)
    osc2.frequency.exponentialRampToValueAtTime(1568, now + 0.07) // E6 to G6 harmonic

    // Snappy micro-attack with ultra-clean exponential decay
    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.11, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085)

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.09)
    osc2.stop(now + 0.09)
  } catch {
    // Graceful fallback
  }
}

/**
 * Distinct acoustic chime when the mobile navigation menu is opened.
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
    // Fallback
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
  playNavTabSound()
}
