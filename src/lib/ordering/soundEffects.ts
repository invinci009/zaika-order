/**
 * Client-Side Audio & Sound Effects Engine for PM Zaika Ordering.
 *
 * Synthesizes pure Web Audio harmonics directly in the browser:
 * - 0ms network latency (no audio file requests, no CORS issues, no 404s).
 * - Full support across iOS Safari, Android Chrome, and Desktop browsers.
 * - Hardware-accelerated, polite volume levels with smooth exponential envelopes.
 * - Persistent mute preference toggle in localStorage.
 */

let sharedAudioContext: AudioContext | null = null

const SOUND_STORAGE_KEY = 'pmz_sound_effects_enabled'

/**
 * Check whether sound effects are enabled in user preferences (default: true).
 */
export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const val = localStorage.getItem(SOUND_STORAGE_KEY)
    if (val !== null) return val !== 'false'
  } catch {}
  return true
}

/**
 * Set sound effects preference.
 */
export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, enabled ? 'true' : 'false')
    window.dispatchEvent(new CustomEvent('pmz-sound-toggle', { detail: { enabled } }))
  } catch {}
}

/**
 * Toggle sound effects and return the new state.
 */
export function toggleSound(): boolean {
  const next = !isSoundEnabled()
  setSoundEnabled(next)
  return next
}

/**
 * Lazily initialize and resume the Web Audio Context on user gesture.
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!sharedAudioContext) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AC) {
        sharedAudioContext = new AC()
      }
    }
    if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
      sharedAudioContext.resume().catch(() => {})
    }
    return sharedAudioContext
  } catch {
    return null
  }
}

/**
 * 1. Add to Bag / Increment Sound
 * Crisp, pleasant golden double-tone chime (A5 880Hz -> E6 1320Hz).
 */
export function playAddToCartSound(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.14, now)
    masterGain.connect(ctx.destination)

    // First Ping: 880Hz (A5)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(880, now)
    gain1.gain.setValueAtTime(0.8, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
    osc1.connect(gain1)
    gain1.connect(masterGain)
    osc1.start(now)
    osc1.stop(now + 0.12)

    // Second Sparkle: 1320Hz (E6)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1320, now + 0.04)
    gain2.gain.setValueAtTime(0.65, now + 0.04)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
    osc2.connect(gain2)
    gain2.connect(masterGain)
    osc2.start(now + 0.04)
    osc2.stop(now + 0.18)
  } catch {}
}

/**
 * 2. Remove / Decrement Item Sound
 * Gentle subtle descending tap (520Hz -> 360Hz).
 */
export function playRemoveFromCartSound(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(520, now)
    osc.frequency.exponentialRampToValueAtTime(360, now + 0.08)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.08)
  } catch {}
}

/**
 * 3. Authentic Brass Dining Table Bell Chime
 * Resonant metallic multi-partial bell for "Call Steward" button.
 * Fundamental (Ab5 830Hz) + Second Harmonic (1661Hz) + Shimmer Overtones (2492Hz).
 */
export function playStewardBellSound(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.24, now)
    masterGain.connect(ctx.destination)

    // Fundamental Bell Body: 830.6Hz
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(830.6, now)
    gain1.gain.setValueAtTime(1.0, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2)
    osc1.connect(gain1)
    gain1.connect(masterGain)
    osc1.start(now)
    osc1.stop(now + 1.2)

    // Second Ring Harmonic: 1661.2Hz
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1661.2, now)
    gain2.gain.setValueAtTime(0.45, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
    osc2.connect(gain2)
    gain2.connect(masterGain)
    osc2.start(now)
    osc2.stop(now + 0.8)

    // High Shimmer Clapper Ping: 2491.8Hz
    const osc3 = ctx.createOscillator()
    const gain3 = ctx.createGain()
    osc3.type = 'triangle'
    osc3.frequency.setValueAtTime(2491.8, now)
    gain3.gain.setValueAtTime(0.25, now)
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
    osc3.connect(gain3)
    gain3.connect(masterGain)
    osc3.start(now)
    osc3.stop(now + 0.4)
  } catch {}
}

/**
 * 4. Celebratory Royal Order Placed Fanfare
 * Ascending 4-tone celebration (C5 523Hz -> E5 659Hz -> G5 784Hz -> C6 1046Hz).
 */
export function playOrderPlacedSound(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const notes = [
      { freq: 523.25, time: 0.0, dur: 0.14, gain: 0.16 }, // C5
      { freq: 659.25, time: 0.1, dur: 0.14, gain: 0.18 }, // E5
      { freq: 783.99, time: 0.2, dur: 0.16, gain: 0.20 }, // G5
      { freq: 1046.5, time: 0.32, dur: 0.65, gain: 0.25 }, // C6 (sustained royal root)
    ]

    const baseTime = ctx.currentTime

    notes.forEach(({ freq, time, dur, gain: vol }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = baseTime + time

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)

      gain.gain.setValueAtTime(vol, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(start)
      osc.stop(start + dur)
    })
  } catch {}
}

/**
 * 5. Micro-Haptic Click for Filter Tabs & Accordions
 */
export function playFilterClickSound(): void {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1150, now)

    gain.gain.setValueAtTime(0.05, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.025)
  } catch {}
}
