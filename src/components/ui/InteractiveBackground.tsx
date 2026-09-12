import { useEffect, useRef } from "react"
import { useTheme } from "@/context/ThemeContext"
import { playShockwaveSound } from "@/utils/soundEffects"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseAlpha: number
  phase: number
  pulseSpeed: number
  isAccent: boolean
  dispX: number
  dispY: number
  energyPulse: number
}

interface Shockwave {
  id: number
  x: number
  y: number
  radius: number
  maxRadius: number
  speed: number
  life: number
  decay: number
  isGold: boolean
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { theme } = useTheme()
  const themeRef = useRef(theme)
  themeRef.current = theme

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    let animationFrameId: number
    let isVisible = !document.hidden
    let prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches
    }
    motionQuery.addEventListener("change", onMotionChange)

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      reinitNodes()
    }

    let nodes: Node[] = []
    let shockwaves: Shockwave[] = []
    let nextShockwaveId = 1

    const getTargetNodeCount = () => {
      const area = width * height
      // Mobile gets ~28-35 nodes, desktop gets ~55-75 nodes
      return Math.min(Math.max(Math.floor(area / 24000), 28), 75)
    }

    const reinitNodes = () => {
      const targetCount = getTargetNodeCount()
      if (nodes.length === 0) {
        nodes = Array.from({ length: targetCount }, () => createNode(width, height))
      } else if (nodes.length < targetCount) {
        while (nodes.length < targetCount) {
          nodes.push(createNode(width, height))
        }
      } else if (nodes.length > targetCount) {
        nodes.length = targetCount
      }
    }

    function createNode(w: number, h: number): Node {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 1.1 + Math.random() * 1.5,
        baseAlpha: 0.3 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.018,
        isAccent: Math.random() < 0.15, // IEEE SSIT Amber accent nodes
        dispX: 0,
        dispY: 0,
        energyPulse: 0,
      }
    }

    // Set initial size
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    ctx.scale(dpr, dpr)
    reinitNodes()

    // Global pointer down listener (mouse, pen, touch)
    const handlePointerDown = (e: PointerEvent) => {
      // Don't create shockwave if clicking inside devtools or invalid coords
      if (e.clientX < 0 || e.clientY < 0) return

      const isMobile = width < 768
      const maxRadius = isMobile
        ? Math.min(width * 0.45, 200)
        : Math.min(Math.max(width * 0.24, 180), 320)

      const isGold = Math.random() < 0.22 // ~22% shockwaves carry golden/amber warmth

      if (shockwaves.length >= 8) {
        shockwaves.shift()
      }

      playShockwaveSound(isGold)

      shockwaves.push({
        id: nextShockwaveId++,
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius,
        speed: isMobile ? 3.8 : 4.4,
        life: 1.0,
        decay: isMobile ? 0.022 : 0.018,
        isGold,
      })
    }

    window.addEventListener("pointerdown", handlePointerDown, { passive: true })

    const handleVisibilityChange = () => {
      isVisible = !document.hidden
      if (isVisible) {
        animationFrameId = requestAnimationFrame(render)
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    let resizeTimeout: number | undefined
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = window.setTimeout(resize, 100)
    }
    window.addEventListener("resize", handleResize)

    // Render loop
    const render = () => {
      if (!isVisible) return

      const isDark = themeRef.current === "dark"
      const maxConnectionDist = width < 768 ? 100 : 135
      const maxDistSq = maxConnectionDist * maxConnectionDist

      // 1. Draw ambient gradient background
      if (isDark) {
        const bgGrad = ctx.createRadialGradient(
          width * 0.32,
          height * 0.22,
          40,
          width * 0.5,
          height * 0.5,
          Math.max(width, height) * 0.88
        )
        bgGrad.addColorStop(0, "#0e1828") // subtle midnight slate cyan glow
        bgGrad.addColorStop(0.55, "#090d16") // deep IEEE slate
        bgGrad.addColorStop(1, "#060910") // deep obsidian edge
        ctx.fillStyle = bgGrad
      } else {
        const bgGrad = ctx.createRadialGradient(
          width * 0.35,
          height * 0.25,
          40,
          width * 0.5,
          height * 0.5,
          Math.max(width, height) * 0.85
        )
        bgGrad.addColorStop(0, "#f9f8f4")
        bgGrad.addColorStop(0.65, "#f4f1e9")
        bgGrad.addColorStop(1, "#eae6dd")
        ctx.fillStyle = bgGrad
      }
      ctx.fillRect(0, 0, width, height)

      // 2. Update and propagate shockwaves
      for (let sIdx = shockwaves.length - 1; sIdx >= 0; sIdx--) {
        const wave = shockwaves[sIdx]
        if (!prefersReducedMotion) {
          wave.radius += wave.speed
          wave.speed *= 0.988 // subtle fluid deceleration
          wave.life -= wave.decay
        } else {
          wave.life -= 0.04
        }

        if (wave.life <= 0 || wave.radius >= wave.maxRadius) {
          shockwaves.splice(sIdx, 1)
          continue
        }

        // Draw shockwave energy rings
        const ringAlpha = Math.max(0, wave.life)
        const crestWidth = Math.max(1, 2.5 * (1 - wave.radius / wave.maxRadius))

        // Outer wave crest
        ctx.beginPath()
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2)
        ctx.lineWidth = crestWidth
        if (isDark) {
          ctx.strokeStyle = wave.isGold
            ? `rgba(245, 158, 11, ${0.45 * ringAlpha})`
            : `rgba(56, 189, 248, ${0.42 * ringAlpha})`
        } else {
          ctx.strokeStyle = wave.isGold
            ? `rgba(178, 93, 66, ${0.35 * ringAlpha})`
            : `rgba(40, 75, 120, ${0.32 * ringAlpha})`
        }
        ctx.stroke()

        // Inner harmonic echo ring
        if (wave.radius > 20) {
          ctx.beginPath()
          ctx.arc(wave.x, wave.y, wave.radius * 0.9, 0, Math.PI * 2)
          ctx.lineWidth = 1
          if (isDark) {
            ctx.strokeStyle = wave.isGold
              ? `rgba(245, 158, 11, ${0.18 * ringAlpha})`
              : `rgba(56, 189, 248, ${0.16 * ringAlpha})`
          } else {
            ctx.strokeStyle = wave.isGold
              ? `rgba(178, 93, 66, ${0.14 * ringAlpha})`
              : `rgba(40, 75, 120, ${0.12 * ringAlpha})`
          }
          ctx.stroke()
        }

        // Faint radial energy bloom
        if (wave.radius > 10) {
          const bloom = ctx.createRadialGradient(
            wave.x,
            wave.y,
            Math.max(0, wave.radius * 0.7),
            wave.x,
            wave.y,
            wave.radius
          )
          if (isDark) {
            bloom.addColorStop(0, "rgba(56, 189, 248, 0)")
            bloom.addColorStop(
              1,
              wave.isGold
                ? `rgba(245, 158, 11, ${0.08 * ringAlpha})`
                : `rgba(56, 189, 248, ${0.07 * ringAlpha})`
            )
          } else {
            bloom.addColorStop(0, "rgba(40, 75, 120, 0)")
            bloom.addColorStop(
              1,
              wave.isGold
                ? `rgba(178, 93, 66, ${0.05 * ringAlpha})`
                : `rgba(40, 75, 120, ${0.05 * ringAlpha})`
            )
          }
          ctx.fillStyle = bloom
          ctx.beginPath()
          ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2)
          ctx.fill()
        }

        // Energy transfer to nearby nodes as wave crest touches them
        if (!prefersReducedMotion) {
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i]
            const dx = node.x - wave.x
            const dy = node.y - wave.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const diff = Math.abs(dist - wave.radius)

            if (diff < 26) {
              const pushFactor = (1 - diff / 26) * (1 - wave.radius / wave.maxRadius) * wave.life
              const angle = Math.atan2(dy, dx)
              const impulse = pushFactor * 2.6
              node.dispX += Math.cos(angle) * impulse
              node.dispY += Math.sin(angle) * impulse
              node.energyPulse = Math.min(1.0, node.energyPulse + pushFactor * 0.75)
            }
          }
        }
      }

      // 3. Update nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        if (!prefersReducedMotion) {
          node.x += node.vx
          node.y += node.vy
          node.phase += node.pulseSpeed

          // Gentle bounce at borders with soft margin
          const pad = 20
          if (node.x < -pad) node.x = width + pad
          else if (node.x > width + pad) node.x = -pad
          if (node.y < -pad) node.y = height + pad
          else if (node.y > height + pad) node.y = -pad

          // Spring damping of shockwave displacement
          node.dispX *= 0.92
          node.dispY *= 0.92
          node.energyPulse *= 0.94
        }
      }

      // 4. Draw network connection filaments
      ctx.lineWidth = 0.8
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i]
        const p1x = n1.x + n1.dispX
        const p1y = n1.y + n1.dispY

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j]
          const p2x = n2.x + n2.dispX
          const p2y = n2.y + n2.dispY

          const dx = p2x - p1x
          const dy = p2y - p1y
          const distSq = dx * dx + dy * dy

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq)
            const proximity = 1 - dist / maxConnectionDist
            const energyGlow = Math.max(n1.energyPulse, n2.energyPulse)
            const isAccentConn = n1.isAccent || n2.isAccent

            let lineAlpha: number
            if (isDark) {
              lineAlpha = proximity * (0.13 + energyGlow * 0.45)
            } else {
              lineAlpha = proximity * (0.09 + energyGlow * 0.3)
            }

            if (lineAlpha > 0.01) {
              ctx.beginPath()
              ctx.moveTo(p1x, p1y)
              ctx.lineTo(p2x, p2y)

              if (isDark) {
                if (isAccentConn) {
                  ctx.strokeStyle = `rgba(245, 158, 11, ${lineAlpha})`
                } else if (energyGlow > 0.2) {
                  ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha * 1.3})`
                } else {
                  ctx.strokeStyle = `rgba(125, 175, 230, ${lineAlpha})`
                }
              } else {
                if (isAccentConn) {
                  ctx.strokeStyle = `rgba(178, 93, 66, ${lineAlpha})`
                } else {
                  ctx.strokeStyle = `rgba(40, 60, 90, ${lineAlpha})`
                }
              }
              ctx.stroke()
            }
          }
        }
      }

      // 5. Draw nodes (particles)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const px = node.x + node.dispX
        const py = node.y + node.dispY

        const pulse = Math.sin(node.phase) * 0.25 + 0.75 // 0.5 to 1.0 breathing
        const alpha = Math.min(1.0, node.baseAlpha * pulse + node.energyPulse * 0.6)
        const rad = node.radius + node.energyPulse * 1.2

        // Outer glow on energy pulse
        if (node.energyPulse > 0.15) {
          ctx.beginPath()
          ctx.arc(px, py, rad * 3, 0, Math.PI * 2)
          if (isDark) {
            ctx.fillStyle = node.isAccent
              ? `rgba(245, 158, 11, ${node.energyPulse * 0.2})`
              : `rgba(56, 189, 248, ${node.energyPulse * 0.22})`
          } else {
            ctx.fillStyle = node.isAccent
              ? `rgba(178, 93, 66, ${node.energyPulse * 0.15})`
              : `rgba(40, 75, 120, ${node.energyPulse * 0.15})`
          }
          ctx.fill()
        }

        // Central node core
        ctx.beginPath()
        ctx.arc(px, py, rad, 0, Math.PI * 2)
        if (isDark) {
          if (node.isAccent) {
            ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`
          } else if (node.energyPulse > 0.2) {
            ctx.fillStyle = `rgba(125, 211, 252, ${alpha})`
          } else {
            ctx.fillStyle = `rgba(148, 195, 245, ${alpha})`
          }
        } else {
          if (node.isAccent) {
            ctx.fillStyle = `rgba(178, 93, 66, ${alpha})`
          } else {
            ctx.fillStyle = `rgba(35, 55, 80, ${alpha})`
          }
        }
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      motionQuery.removeEventListener("change", onMotionChange)
      clearTimeout(resizeTimeout)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
      style={{
        contain: "strict",
        transform: "translateZ(0)",
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}
