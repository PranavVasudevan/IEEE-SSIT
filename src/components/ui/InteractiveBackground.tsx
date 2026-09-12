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

interface GlobeVertex {
  lat: number
  lon: number
  x: number
  y: number
  z: number
  screenX: number
  screenY: number
  projScale: number
  depthAlpha: number
  energy: number
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
    let scrollY = window.scrollY || 0

    const onScroll = () => {
      scrollY = window.scrollY || 0
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    // Generate 3D Geodesic SSIT Globe Vertices
    const numLat = 9
    const numLon = 14
    let globeVertices: GlobeVertex[] = []

    const buildGlobe = () => {
      globeVertices = []
      for (let i = 1; i < numLat; i++) {
        const lat = (Math.PI * i) / numLat - Math.PI / 2
        for (let j = 0; j < numLon; j++) {
          const lon = (2 * Math.PI * j) / numLon
          globeVertices.push({
            lat,
            lon,
            x: 0,
            y: 0,
            z: 0,
            screenX: 0,
            screenY: 0,
            projScale: 1,
            depthAlpha: 1,
            energy: 0,
          })
        }
      }
    }
    buildGlobe()

    let globeYaw = 0.4
    const globePitch = 0.28

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
      return Math.min(Math.max(Math.floor(area / 28000), 24), 60)
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
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: 1.0 + Math.random() * 1.5,
        baseAlpha: 0.25 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.018,
        isAccent: Math.random() < 0.16,
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

    // Cursor spotlight tracking
    let cursorX = width * 0.5
    let cursorY = height * 0.5
    let targetCursorX = width * 0.5
    let targetCursorY = height * 0.5
    let isCursorActive = false

    const handlePointerMove = (e: PointerEvent) => {
      targetCursorX = e.clientX
      targetCursorY = e.clientY
      isCursorActive = true
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })

    const handlePointerLeave = () => {
      isCursorActive = false
    }
    window.addEventListener("mouseleave", handlePointerLeave)

    // Global pointer down listener (shockwave & sound ONLY on click/tap)
    const handlePointerDown = (e: PointerEvent) => {
      if (e.clientX < 0 || e.clientY < 0) return

      const target = e.target as HTMLElement | null
      if (target && target.closest("[data-no-shockwave='true']")) {
        return
      }

      targetCursorX = e.clientX
      targetCursorY = e.clientY
      cursorX = e.clientX
      cursorY = e.clientY
      isCursorActive = true

      const isMobile = width < 768
      const maxRadius = isMobile
        ? Math.min(width * 0.55, 240)
        : Math.min(Math.max(width * 0.28, 220), 400)

      const isGold = Math.random() < 0.25

      if (shockwaves.length >= 6) {
        shockwaves.shift()
      }

      playShockwaveSound(isGold)

      shockwaves.push({
        id: nextShockwaveId++,
        x: e.clientX,
        y: e.clientY,
        radius: 6,
        maxRadius,
        speed: isMobile ? 4.5 : 5.5,
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

      // Smooth cursor spotlight easing
      cursorX += (targetCursorX - cursorX) * 0.12
      cursorY += (targetCursorY - cursorY) * 0.12

      // 1. Base Atmospheric Nebula Gradient
      if (isDark) {
        const bgGrad = ctx.createRadialGradient(
          width * 0.5,
          height * 0.4 - scrollY * 0.15,
          50,
          width * 0.5,
          height * 0.5,
          Math.max(width, height) * 0.95
        )
        bgGrad.addColorStop(0, "#0a1324") // Deep electric midnight core
        bgGrad.addColorStop(0.35, "#060c18") // Midnight navy slate
        bgGrad.addColorStop(0.7, "#040710") // Obsidian space
        bgGrad.addColorStop(1, "#020307") // Deep void edge
        ctx.fillStyle = bgGrad
      } else {
        const bgGrad = ctx.createRadialGradient(
          width * 0.5,
          height * 0.4,
          50,
          width * 0.5,
          height * 0.5,
          Math.max(width, height) * 0.9
        )
        bgGrad.addColorStop(0, "#fbfaf7")
        bgGrad.addColorStop(0.6, "#f3f0e8")
        bgGrad.addColorStop(1, "#eae6dc")
        ctx.fillStyle = bgGrad
      }
      ctx.fillRect(0, 0, width, height)

      // 2. Interactive Cursor Spotlight / Torch (smoothly follows pointer movement)
      if (isCursorActive) {
        ctx.save()
        const torchRadius = isDark ? 320 : 260
        const torch = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, torchRadius)
        if (isDark) {
          torch.addColorStop(0, "rgba(56, 189, 248, 0.16)")
          torch.addColorStop(0.3, "rgba(56, 189, 248, 0.07)")
          torch.addColorStop(0.65, "rgba(14, 165, 233, 0.02)")
          torch.addColorStop(1, "rgba(0, 0, 0, 0)")
        } else {
          torch.addColorStop(0, "rgba(14, 165, 233, 0.14)")
          torch.addColorStop(0.4, "rgba(14, 165, 233, 0.05)")
          torch.addColorStop(1, "rgba(255, 255, 255, 0)")
        }
        ctx.fillStyle = torch
        ctx.beginPath()
        ctx.arc(cursorX, cursorY, torchRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // 3. Mathematical 3D Geodesic SSIT Wireframe Globe (Large, subtle, integrated)
      const isMobile = width < 768
      const globeRadius = Math.min(width, height) * (isMobile ? 0.48 : 0.55)
      // Centered / slightly offset for a majestic, balanced backdrop
      const globeCx = width * (isMobile ? 0.5 : 0.58)
      const globeCy = height * (isMobile ? 0.38 : 0.46) - scrollY * 0.18

      if (!prefersReducedMotion) {
        globeYaw += 0.0014
      }

      // 3a. Volumetric Globe Radial Glow
      if (isDark) {
        const glow = ctx.createRadialGradient(
          globeCx,
          globeCy,
          10,
          globeCx,
          globeCy,
          globeRadius * 1.3
        )
        glow.addColorStop(0, "rgba(56, 189, 248, 0.12)")
        glow.addColorStop(0.4, "rgba(14, 165, 233, 0.05)")
        glow.addColorStop(0.8, "rgba(245, 158, 11, 0.02)")
        glow.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(globeCx, globeCy, globeRadius * 1.3, 0, Math.PI * 2)
        ctx.fill()
      }

      // 3b. Transform 3D Vertices
      const fov = 650
      const cosPitch = Math.cos(globePitch)
      const sinPitch = Math.sin(globePitch)
      const cosYaw = Math.cos(globeYaw)
      const sinYaw = Math.sin(globeYaw)

      for (let i = 0; i < globeVertices.length; i++) {
        const v = globeVertices[i]
        // Base spherical coordinates
        const x0 = globeRadius * Math.cos(v.lat) * Math.sin(v.lon)
        const y0 = globeRadius * Math.sin(v.lat)
        const z0 = globeRadius * Math.cos(v.lat) * Math.cos(v.lon)

        // Rotate around Y axis (Yaw)
        const x1 = x0 * cosYaw - z0 * sinYaw
        const z1 = x0 * sinYaw + z0 * cosYaw

        // Rotate around X axis (Pitch)
        const y2 = y0 * cosPitch - z1 * sinPitch
        const z2 = y0 * sinPitch + z1 * cosPitch

        v.x = x1
        v.y = y2
        v.z = z2

        // Perspective projection
        const scale = fov / (fov + z2)
        v.screenX = globeCx + x1 * scale
        v.screenY = globeCy + y2 * scale
        v.projScale = scale

        // Depth cue: front vertices are bright, back are soft
        const normZ = z2 / globeRadius // -1 to 1
        v.depthAlpha = normZ > 0 ? 0.25 + normZ * 0.45 : Math.max(0.04, 0.25 + normZ * 0.2)

        // Damped energy pulse recovery
        v.energy *= 0.94
      }

      // 3c. Draw Globe Latitude Rings
      ctx.lineWidth = 0.9
      for (let i = 1; i < numLat; i++) {
        const startIndex = (i - 1) * numLon
        ctx.beginPath()
        for (let j = 0; j <= numLon; j++) {
          const idx = startIndex + (j % numLon)
          const pt = globeVertices[idx]
          if (j === 0) ctx.moveTo(pt.screenX, pt.screenY)
          else ctx.lineTo(pt.screenX, pt.screenY)
        }
        if (isDark) {
          ctx.strokeStyle = `rgba(56, 189, 248, 0.14)`
        } else {
          ctx.strokeStyle = `rgba(40, 75, 120, 0.12)`
        }
        ctx.stroke()
      }

      // 3d. Draw Globe Longitude Meridians
      for (let j = 0; j < numLon; j++) {
        ctx.beginPath()
        for (let i = 1; i < numLat; i++) {
          const idx = (i - 1) * numLon + j
          const pt = globeVertices[idx]
          if (i === 1) ctx.moveTo(pt.screenX, pt.screenY)
          else ctx.lineTo(pt.screenX, pt.screenY)
        }
        if (isDark) {
          ctx.strokeStyle = `rgba(125, 185, 245, 0.12)`
        } else {
          ctx.strokeStyle = `rgba(40, 75, 120, 0.1)`
        }
        ctx.stroke()
      }

      // 3e. Draw Globe Vertices (Nodes) with Energy Glow
      for (let i = 0; i < globeVertices.length; i++) {
        const v = globeVertices[i]
        // Only render vertices on the visible half or faint on rear
        if (v.z > -globeRadius * 0.35) {
          const totalAlpha = Math.min(1.0, v.depthAlpha + v.energy * 0.6)
          const nodeRad = (v.z > 0 ? 1.6 : 1.1) * v.projScale + v.energy * 2.0

          if (v.energy > 0.1) {
            ctx.beginPath()
            ctx.arc(v.screenX, v.screenY, nodeRad * 3.2, 0, Math.PI * 2)
            ctx.fillStyle = isDark
              ? `rgba(56, 189, 248, ${v.energy * 0.3})`
              : `rgba(40, 75, 120, ${v.energy * 0.2})`
            ctx.fill()
          }

          ctx.beginPath()
          ctx.arc(v.screenX, v.screenY, nodeRad, 0, Math.PI * 2)
          if (isDark) {
            ctx.fillStyle =
              v.energy > 0.2
                ? `rgba(245, 158, 11, ${totalAlpha})`
                : `rgba(56, 189, 248, ${totalAlpha})`
          } else {
            ctx.fillStyle = `rgba(30, 58, 138, ${totalAlpha})`
          }
          ctx.fill()
        }
      }

      // 4. Update and Propagate Interactive Shockwaves
      for (let sIdx = shockwaves.length - 1; sIdx >= 0; sIdx--) {
        const wave = shockwaves[sIdx]
        if (!prefersReducedMotion) {
          wave.radius += wave.speed
          wave.speed *= 0.988
          wave.life -= wave.decay
        } else {
          wave.life -= 0.04
        }

        if (wave.life <= 0 || wave.radius >= wave.maxRadius) {
          shockwaves.splice(sIdx, 1)
          continue
        }

        const ringAlpha = Math.max(0, wave.life)
        const crestWidth = Math.max(1, 2.8 * (1 - wave.radius / wave.maxRadius))

        // Main Wave Crest
        ctx.beginPath()
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2)
        ctx.lineWidth = crestWidth
        if (isDark) {
          ctx.strokeStyle = wave.isGold
            ? `rgba(245, 158, 11, ${0.48 * ringAlpha})`
            : `rgba(56, 189, 248, ${0.45 * ringAlpha})`
        } else {
          ctx.strokeStyle = wave.isGold
            ? `rgba(178, 93, 66, ${0.38 * ringAlpha})`
            : `rgba(40, 75, 120, ${0.35 * ringAlpha})`
        }
        ctx.stroke()

        // Harmonic Echo Ring
        if (wave.radius > 24) {
          ctx.beginPath()
          ctx.arc(wave.x, wave.y, wave.radius * 0.88, 0, Math.PI * 2)
          ctx.lineWidth = 1
          if (isDark) {
            ctx.strokeStyle = wave.isGold
              ? `rgba(245, 158, 11, ${0.2 * ringAlpha})`
              : `rgba(56, 189, 248, ${0.18 * ringAlpha})`
          } else {
            ctx.strokeStyle = `rgba(40, 75, 120, ${0.15 * ringAlpha})`
          }
          ctx.stroke()
        }

        // Energy Transfer to 3D Globe Vertices
        for (let i = 0; i < globeVertices.length; i++) {
          const gv = globeVertices[i]
          const dx = gv.screenX - wave.x
          const dy = gv.screenY - wave.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const diff = Math.abs(dist - wave.radius)
          if (diff < 32) {
            const push = (1 - diff / 32) * wave.life
            gv.energy = Math.min(1.0, gv.energy + push * 0.8)
          }
        }

        // Energy Transfer to Constellation Nodes
        if (!prefersReducedMotion) {
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i]
            const dx = node.x - wave.x
            const dy = node.y - wave.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const diff = Math.abs(dist - wave.radius)

            if (diff < 28) {
              const pushFactor = (1 - diff / 28) * (1 - wave.radius / wave.maxRadius) * wave.life
              const angle = Math.atan2(dy, dx)
              const impulse = pushFactor * 2.8
              node.dispX += Math.cos(angle) * impulse
              node.dispY += Math.sin(angle) * impulse
              node.energyPulse = Math.min(1.0, node.energyPulse + pushFactor * 0.8)
            }
          }
        }
      }

      // 5. Update Constellation Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (!prefersReducedMotion) {
          node.x += node.vx
          node.y += node.vy
          node.phase += node.pulseSpeed

          const pad = 24
          if (node.x < -pad) node.x = width + pad
          else if (node.x > width + pad) node.x = -pad
          if (node.y < -pad) node.y = height + pad
          else if (node.y > height + pad) node.y = -pad

          node.dispX *= 0.92
          node.dispY *= 0.92
          node.energyPulse *= 0.94
        }
      }

      // 6. Draw Constellation Connection Filaments
      const maxConnDist = isMobile ? 95 : 130
      const maxConnDistSq = maxConnDist * maxConnDist
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

          if (distSq < maxConnDistSq) {
            const dist = Math.sqrt(distSq)
            const proximity = 1 - dist / maxConnDist
            const energyGlow = Math.max(n1.energyPulse, n2.energyPulse)
            const isAccent = n1.isAccent || n2.isAccent

            let lineAlpha = isDark
              ? proximity * (0.12 + energyGlow * 0.4)
              : proximity * (0.08 + energyGlow * 0.3)

            if (lineAlpha > 0.01) {
              ctx.beginPath()
              ctx.moveTo(p1x, p1y)
              ctx.lineTo(p2x, p2y)
              if (isDark) {
                ctx.strokeStyle = isAccent
                  ? `rgba(245, 158, 11, ${lineAlpha})`
                  : `rgba(56, 189, 248, ${lineAlpha})`
              } else {
                ctx.strokeStyle = `rgba(40, 75, 120, ${lineAlpha})`
              }
              ctx.stroke()
            }
          }
        }
      }

      // 7. Draw Constellation Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const px = node.x + node.dispX
        const py = node.y + node.dispY

        const pulse = Math.sin(node.phase) * 0.25 + 0.75
        const alpha = Math.min(1.0, node.baseAlpha * pulse + node.energyPulse * 0.6)
        const rad = node.radius + node.energyPulse * 1.2

        if (node.energyPulse > 0.15) {
          ctx.beginPath()
          ctx.arc(px, py, rad * 3, 0, Math.PI * 2)
          ctx.fillStyle = node.isAccent
            ? `rgba(245, 158, 11, ${node.energyPulse * 0.22})`
            : `rgba(56, 189, 248, ${node.energyPulse * 0.25})`
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(px, py, rad, 0, Math.PI * 2)
        if (isDark) {
          ctx.fillStyle = node.isAccent
            ? `rgba(245, 158, 11, ${alpha})`
            : `rgba(125, 211, 252, ${alpha})`
        } else {
          ctx.fillStyle = `rgba(35, 55, 80, ${alpha})`
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
      window.removeEventListener("scroll", onScroll)
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
