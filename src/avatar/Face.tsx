import { useEffect, useId, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import type { CSSProperties } from "react"
import type { Expression } from "./types"

type FaceProps = {
  expression: Expression
  blinkEvery: number
  lookX: number
  scan: boolean
  nod: boolean
  reach: boolean
  conduct: boolean
  peace: boolean
  deliver: boolean
  glasses: boolean
  hat: boolean
  orbit: boolean
  turn: boolean
}

function smilePath(curve: number, width: number) {
  const half = 7 + width * 16
  const y = 98
  const control = (y + curve * 18).toFixed(2)
  return `M ${(78 - half).toFixed(2)} ${y} Q 78 ${control} ${(78 + half).toFixed(2)} ${y}`
}

function browPath(side: "left" | "right", raise: number, pinch: number) {
  const y = 55 - raise * 1.7
  const inner = pinch * 4.2
  const outer = pinch * -1.4
  if (side === "left") {
    return `M 43 ${(y + outer).toFixed(2)} Q 53 ${(y - inner * 0.25).toFixed(2)} 64 ${(y - inner).toFixed(2)}`
  }
  return `M 91 ${(y - inner).toFixed(2)} Q 102 ${(y - inner * 0.25).toFixed(2)} 112 ${(y + outer).toFixed(2)}`
}

const spring = { type: "spring" as const, stiffness: 170, damping: 18 }
const orbitCycle = { duration: 5.2, repeat: Infinity, ease: "linear" as const }
const orbitSteps = 24

function orbitSample(index: number, phase: number) {
  const angle = ((index / orbitSteps) + phase) * Math.PI * 2
  const front = Math.sin(angle)
  return {
    x: 77.5 + Math.cos(angle) * 68,
    y: 78 + front * 42,
    scale: 1.05 + front * 0.22,
    front,
  }
}

function orbitTrack(phase: number, layer: "back" | "front") {
  const frames = Array.from({ length: orbitSteps + 1 }, (_, index) => orbitSample(index, phase))
  return {
    x: frames.map((frame) => frame.x),
    y: frames.map((frame) => frame.y),
    scale: frames.map((frame) => frame.scale),
    opacity: frames.map((frame) => {
      const depth = layer === "front" ? frame.front : -frame.front
      return Math.max(0, Math.min(1, depth * 2.4 + 0.08))
    }),
  }
}

function ChildAgent() {
  return (
    <g>
      <g transform="rotate(45)">
        <rect x="-13" y="-13" width="26" height="26" rx="8" fill="var(--g-skin)" stroke="var(--g-rim)" strokeWidth="1.1" />
      </g>
      <ellipse cx="-4.2" cy="-1.2" rx="1.45" ry="1.8" fill="var(--g-eye)" />
      <ellipse cx="4.2" cy="-1.2" rx="1.45" ry="1.8" fill="var(--g-eye)" />
      <path d="M-4.2 4 Q0 6.4 4.2 4" fill="none" stroke="var(--g-ink)" strokeWidth="0.9" strokeLinecap="round" />
    </g>
  )
}

function OrbitingChildren({ layer, reduce }: { layer: "back" | "front"; reduce: boolean }) {
  const phases = [0, 0.33, 0.66]
  return (
    <>
      {phases.map((phase) => {
        const held = orbitSample(0, phase)
        const track = orbitTrack(phase, layer)
        const parked = layer === "front" ? held.front > 0 : held.front <= 0
        return (
          <motion.g
            key={`${layer}-${phase}`}
            animate={
              reduce
                ? { x: held.x, y: held.y, scale: 0.9, opacity: parked ? 1 : 0 }
                : track
            }
            transition={reduce ? { duration: 0.2 } : orbitCycle}
          >
            <ChildAgent />
          </motion.g>
        )
      })}
    </>
  )
}

function Hat() {
  return (
    <g>
      <ellipse cx="77.5" cy="24" rx="32" ry="8" fill="var(--g-skin-deep)" stroke="var(--g-rim)" strokeWidth="1.2" />
      <path d="M56 22C56 8 65 1 77.5 1C90 1 99 8 99 22Z" fill="var(--g-skin)" stroke="var(--g-rim)" strokeWidth="1.1" />
      <path d="M62 19C64 10 70 6 77.5 6C85 6 91 10 93 19Z" fill="var(--g-skin-deep)" />
      <rect x="60" y="16.5" width="35" height="4.5" rx="1.4" fill="var(--g-rim)" />
    </g>
  )
}

const glass: { body: [string, string, string]; highlight: number; depth: string; vars: CSSProperties } = {
  body: ["rgba(255,255,255,0.42)", "rgba(255,255,255,0.08)", "rgba(150, 214, 184, 0.32)"],
  highlight: 0.82,
  depth: "rgba(16, 140, 96, 0.22)",
  vars: {
    "--g-ink": "#143028",
    "--g-eye": "#0c141c",
    "--g-glint": "#ffffff",
    "--g-skin": "rgba(255,255,255,0.62)",
    "--g-skin-deep": "rgba(170, 220, 196, 0.55)",
    "--g-skin-stroke": "rgba(20, 110, 80, 0.4)",
    "--g-rim": "#149e6a",
  } as CSSProperties,
}

const spark = ["#6ee7b7", "#b7f07a", "#10b981", "#ffffff"]

const edgeSpray = Array.from({ length: 22 }, (_, i) => {
  const along = (i * 0.37) % 1
  const depth = 1.2 + (i % 4) * 2.1
  const onLowerRim = i % 2 === 0
  const x = onLowerRim ? 51 - depth : 46 - along * 34
  const y = onLowerRim ? -44 + along * 36 : -51 + depth
  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
    r: i % 5 === 0 ? 1.05 : 0.55,
    opacity: 0.35 + (i % 3) * 0.15,
    fill: spark[i % spark.length],
  }
})

export function Face({ expression, blinkEvery, lookX, scan, nod, reach, conduct, peace, deliver, glasses, hat, orbit, turn }: FaceProps) {
  const reduce = useReducedMotion()
  const [closed, setClosed] = useState(false)
  const gradientId = useId().replace(/:/g, "")
  const bodyFill = `satin-body-${gradientId}`
  const shadeFill = `satin-shade-${gradientId}`
  const depthFill = `glass-depth-${gradientId}`
  const refract = `glass-refract-${gradientId}`
  const faceClip = `face-clip-${gradientId}`

  useEffect(() => {
    if (reduce || blinkEvery <= 0) {
      setClosed(false)
      return
    }

    let alive = true
    let wait = 0
    let reopen = 0

    const schedule = () => {
      const pause = blinkEvery * (0.75 + Math.random() * 0.5)
      wait = window.setTimeout(() => {
        if (!alive) return
        setClosed(true)
        reopen = window.setTimeout(() => {
          if (!alive) return
          setClosed(false)
          schedule()
        }, 110)
      }, pause)
    }

    schedule()
    return () => {
      alive = false
      window.clearTimeout(wait)
      window.clearTimeout(reopen)
    }
  }, [blinkEvery, reduce])

  const eyeScale = closed ? 0.08 : expression.eyeOpen
  const gazeX = reduce || !scan ? lookX : [lookX - 3.5, lookX + 3.5, lookX - 3.5]
  const follow = orbit && !reduce ? orbitTrack(0, "front") : null
  const followX = follow ? follow.x.map((value) => (value - 77.5) * 0.11) : gazeX
  const followY = follow ? follow.y.map((value) => (value - 78) * 0.14) : expression.lookY * 1.15

  return (
    <svg
      className="face"
      viewBox={orbit ? "-24 -10 203 176" : "0 0 155 156"}
      role="img"
      aria-hidden="true"
      style={{ ...glass.vars, perspective: turn || deliver ? "520px" : undefined }}
    >
      <defs>
        <radialGradient id={bodyFill} cx="32%" cy="28%" r="78%">
          <stop offset="0%" stopColor={glass.body[0]} />
          <stop offset="46%" stopColor={glass.body[1]} />
          <stop offset="100%" stopColor={glass.body[2]} />
        </radialGradient>
        <radialGradient id={shadeFill} cx="22%" cy="16%" r="72%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="18%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="46%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="78%" stopColor="#6ee7b7" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.28" />
        </radialGradient>
        <linearGradient id={depthFill} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor={glass.depth} />
        </linearGradient>
        <filter id={refract} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <clipPath id={faceClip}>
          <rect x="-52" y="-52" width="104" height="104" rx="34" />
        </clipPath>
      </defs>

      <g transform="translate(77.5 76)">
        <motion.g animate={{ rotate: expression.lean }} transition={spring}>
          <motion.g
            animate={reduce || !nod ? { y: 0 } : { y: [0, 5, 0] }}
            transition={
              nod && !reduce
                ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                : spring
            }
          >
          <g transform="translate(-77.5 -76)">
            <motion.g
              className={turn ? "face-turn" : undefined}
              style={{ transformOrigin: "77.5px 76px", transformBox: "view-box" }}
              animate={
                turn && !reduce
                  ? { rotate: [0, 18, 18, 0], rotateY: [0, 0, 0, 360] }
                  : { rotate: 0, rotateY: 0 }
              }
              transition={
                turn && !reduce
                  ? { duration: 4.6, repeat: Infinity, times: [0, 0.28, 0.52, 1], ease: ["easeOut", "linear", "easeInOut"] }
                  : { duration: 0.2 }
              }
            >
            <motion.g
              className={deliver ? "face-deliver" : undefined}
              style={{ transformOrigin: "77.5px 76px", transformBox: "view-box" }}
              animate={
                deliver && !reduce
                  ? {
                      rotateY: [0, 0, 360, 360, 360, 0],
                      opacity: [1, 1, 1, 0, 0, 1],
                      scale: [1, 1, 1, 0.82, 0.82, 1],
                    }
                  : { rotateY: 0, opacity: 1, scale: 1 }
              }
              transition={deliver && !reduce ? deliverCycle : { duration: 0.2 }}
            >
            {orbit ? <OrbitingChildren layer="back" reduce={Boolean(reduce)} /> : null}
            <g transform="translate(77.5 76) rotate(45)">
              <g clipPath={`url(#${faceClip})`}>
                <rect x="-52" y="-52" width="104" height="104" rx="34" fill={`url(#${bodyFill})`} />
                <rect x="-52" y="-52" width="104" height="104" rx="34" fill={`url(#${depthFill})`} />
                <rect x="-52" y="-52" width="104" height="104" rx="34" fill={`url(#${shadeFill})`} />
                <ellipse cx="-18" cy="-24" rx="22" ry="11" fill="#fff" opacity={glass.highlight} />
                <ellipse cx="-24" cy="-28" rx="7" ry="3.2" fill="#fff" opacity="0.9" />
                {edgeSpray.map((dot) => (
                  <circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r={dot.r} fill={dot.fill} opacity={dot.opacity} />
                ))}
              </g>
              <g filter={`url(#${refract})`} opacity="0.85">
                <rect x="-52" y="-52" width="104" height="104" rx="34" fill="none" stroke="#6ee7b7" strokeWidth="1.15" opacity="0.7" transform="translate(1.6 -1.1)" />
                <rect x="-52" y="-52" width="104" height="104" rx="34" fill="none" stroke="#b7f07a" strokeWidth="0.8" opacity="0.28" transform="translate(0.2 1.3)" />
                <rect x="-52" y="-52" width="104" height="104" rx="34" fill="none" stroke="#10b981" strokeWidth="1.15" opacity="0.55" transform="translate(-1.5 0.9)" />
              </g>
              <rect x="-52" y="-52" width="104" height="104" rx="34" fill="none" stroke="#ffffff" strokeWidth="0.65" opacity="0.42" />
            </g>
            {hat ? <Hat /> : null}

            <motion.g
              animate={{ x: followX, y: followY }}
              transition={
                follow
                  ? orbitCycle
                  : scan && !reduce
                    ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
                    : spring
              }
            >
              {glasses ? <Glasses /> : null}
              <Eye cx={53.5} scaleY={eyeScale} lookX={expression.lookX} lookY={expression.lookY} />
              <Eye cx={102.5} scaleY={eyeScale} lookX={expression.lookX} lookY={expression.lookY} />
            </motion.g>

            <motion.path
              d={browPath("left", expression.browRaise, expression.browPinch)}
              animate={{ d: browPath("left", expression.browRaise, expression.browPinch) }}
              transition={spring}
              stroke="var(--g-ink)"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
            <motion.path
              d={browPath("right", expression.browRaise, expression.browPinch)}
              animate={{ d: browPath("right", expression.browRaise, expression.browPinch) }}
              transition={spring}
              stroke="var(--g-ink)"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />

            <motion.path
              d={smilePath(expression.smile, expression.smileWidth)}
              animate={{ d: smilePath(expression.smile, expression.smileWidth) }}
              transition={spring}
              stroke="var(--g-ink)"
              strokeWidth="3.1"
              strokeLinecap="round"
              fill="none"
            />
            {orbit ? <OrbitingChildren layer="front" reduce={Boolean(reduce)} /> : null}
            {reach ? <SelectingHand reduce={Boolean(reduce)} /> : null}
            {conduct ? <ConductingHands reduce={Boolean(reduce)} /> : null}
            {peace ? <PeaceHand reduce={Boolean(reduce)} /> : null}
            </motion.g>
            {deliver && !reduce ? <GlassTick bodyFill={bodyFill} shadeFill={shadeFill} /> : null}
            </motion.g>
          </g>
          </motion.g>
        </motion.g>
      </g>
    </svg>
  )
}

const reachCycle = { duration: 1.8, repeat: Infinity, ease: "easeInOut" as const }
const beatCycle = { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const, times: [0, 0.2, 0.45, 0.7, 1] }

function ConductingHands({ reduce }: { reduce: boolean }) {
  const cycle = reduce ? { duration: 0.2 } : beatCycle
  return (
    <g>
      <g transform="translate(18 108)">
        <motion.g
          style={{ transformOrigin: "12px 16px" }}
          animate={reduce ? { x: 0, y: 12, rotate: 14 } : { x: [0, 2, -14, 10, 0], y: [-2, 16, 5, -12, -2], rotate: [-6, 16, -4, -18, -6] }}
          transition={cycle}
        >
          <ConductHand baton />
        </motion.g>
      </g>
      <g transform="translate(112 112)">
        <motion.g
          style={{ transformOrigin: "14px 16px" }}
          animate={reduce ? { x: 4, y: 6, rotate: -8 } : { x: [0, 12, 2, -10, 0], y: [6, -8, 12, 0, 6], rotate: [8, -14, 12, -4, 8] }}
          transition={cycle}
        >
          <ConductHand />
        </motion.g>
      </g>
    </g>
  )
}

function ConductHand({ baton = false }: { baton?: boolean }) {
  return (
    <g>
      <ellipse cx="12" cy="20" rx="8" ry="5.5" fill="var(--g-skin-deep)" />
      <ellipse cx="12" cy="14" rx="7.2" ry="6" fill="var(--g-skin)" stroke="var(--g-skin-stroke)" strokeWidth="0.8" />
      <rect x="9" y="4" width="6" height="12" rx="3" fill="var(--g-skin)" stroke="var(--g-skin-stroke)" strokeWidth="0.7" />
      {baton ? (
        <>
          <rect x="11" y="-12" width="2.1" height="18" rx="1" fill="var(--g-ink)" />
          <circle cx="12.05" cy="-12" r="1.7" fill="var(--g-ink)" />
        </>
      ) : null}
    </g>
  )
}

function PeaceHand({ reduce }: { reduce: boolean }) {
  return (
    <g transform="translate(112 18)">
      <motion.g
        style={{ transformOrigin: "14px 28px" }}
        animate={reduce ? { rotate: -8 } : { rotate: [-10, 8, -10] }}
        transition={reduce ? { duration: 0.2 } : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="14" cy="30" rx="9" ry="7" fill="var(--g-skin)" stroke="var(--g-skin-stroke)" strokeWidth="0.8" />
        <rect x="6" y="6" width="5.4" height="20" rx="2.7" transform="rotate(-22 8.7 26)" fill="var(--g-skin)" stroke="var(--g-skin-stroke)" strokeWidth="0.7" />
        <rect x="16" y="6" width="5.4" height="20" rx="2.7" transform="rotate(22 18.7 26)" fill="var(--g-skin)" stroke="var(--g-skin-stroke)" strokeWidth="0.7" />
      </motion.g>
    </g>
  )
}

const deliverCycle = {
  duration: 7.2,
  repeat: Infinity,
  times: [0, 0.16, 0.42, 0.56, 0.76, 1],
  ease: "easeInOut" as const,
}

const tickPath = "M34 82 L62 112 L126 38"

function GlassTick({ bodyFill, shadeFill }: { bodyFill: string; shadeFill: string }) {
  const stroke = {
    d: tickPath,
    fill: "none" as const,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }
  return (
    <motion.g
      className="face-tick"
      style={{ transformOrigin: "77.5px 76px", transformBox: "view-box" }}
      animate={{ opacity: [0, 0, 0, 1, 1, 0], scale: [0.68, 0.68, 0.68, 1, 1, 0.68] }}
      transition={deliverCycle}
    >
      <path {...stroke} stroke="#f4fff9" strokeWidth="30" />
      <path {...stroke} stroke={`url(#${bodyFill})`} strokeWidth="30" />
      <path {...stroke} stroke={`url(#${shadeFill})`} strokeWidth="30" />
      <path {...stroke} stroke="#ffffff" strokeWidth="9" opacity={0.55} transform="translate(-2.2 -2.8)" />
      <path {...stroke} stroke="#6ee7b7" strokeWidth="2.4" opacity={0.85} transform="translate(1.4 -1)" />
      <path {...stroke} stroke="#10b981" strokeWidth="2.4" opacity={0.75} transform="translate(-1.4 1)" />
    </motion.g>
  )
}

function SelectingHand({ reduce }: { reduce: boolean }) {
  const cycle = reduce ? { duration: 0.2 } : reachCycle
  return (
    <g>
      <g transform="translate(124 118)">
        <rect width="20" height="16" rx="5" fill="var(--g-skin)" stroke="var(--g-ink)" strokeWidth="1.5" />
        <motion.circle
          cx="10"
          cy="8"
          r="3.4"
          fill="var(--g-ink)"
          style={{ transformOrigin: "10px 8px" }}
          animate={reduce ? { scale: 1 } : { scale: [0.75, 0.75, 0.45, 1.15, 0.75] }}
          transition={cycle}
        />
      </g>
      <motion.g
        animate={reduce ? { x: 10, y: 2 } : { x: [0, 9, 13, 9, 0], y: [3, 0, 3, 0, 3] }}
        transition={cycle}
      >
        <g transform="translate(98 108) rotate(24)">
          <path d="M4 14c0-5 7-7 11-3l-1 9c-3 3-10 2-10-6z" fill="var(--g-skin-deep)" />
          <path
            d="M10 13c0-6 8-8 12-4 4-3 10 1 8 6 4 0 6 6 1 8-3 4-14 5-18 1-4-2-3-8-3-11z"
            fill="var(--g-skin)"
            stroke="var(--g-skin-stroke)"
            strokeWidth="0.9"
          />
          <motion.g
            style={{ transformOrigin: "22px 12px" }}
            animate={reduce ? { rotate: 6 } : { rotate: [2, -4, 16, -4, 2] }}
            transition={cycle}
          >
            <rect x="20" y="6" width="20" height="7.2" rx="3.6" fill="var(--g-skin)" stroke="var(--g-skin-stroke)" strokeWidth="0.8" />
          </motion.g>
        </g>
      </motion.g>
    </g>
  )
}

function Glasses() {
  return (
    <g>
      <rect x="39" y="53" width="30" height="27" rx="11" fill="rgba(255,255,255,0.22)" stroke="var(--g-rim)" strokeWidth="1.7" />
      <rect x="88" y="53" width="30" height="27" rx="11" fill="rgba(255,255,255,0.22)" stroke="var(--g-rim)" strokeWidth="1.7" />
      <path d="M69 66.5H88" fill="none" stroke="var(--g-rim)" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M39 62H30" fill="none" stroke="var(--g-rim)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M118 62H127" fill="none" stroke="var(--g-rim)" strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="47" cy="59" rx="6" ry="2" fill="#fff" opacity="0.55" />
      <ellipse cx="96" cy="59" rx="6" ry="2" fill="#fff" opacity="0.55" />
    </g>
  )
}

function Eye({ cx, scaleY, lookX, lookY }: { cx: number; scaleY: number; lookX: number; lookY: number }) {
  const glintX = cx - 2.1 + Math.max(-1.8, Math.min(1.8, lookX * 0.22))
  const glintY = 63.2 + Math.max(-1.6, Math.min(1.6, lookY * 0.18))
  return (
    <motion.g
      style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
      animate={{ scaleY }}
      transition={{ duration: scaleY < 0.2 ? 0.06 : 0.14, ease: "easeOut" }}
    >
      <ellipse cx={cx} cy="66.5" rx="6.4" ry="8" fill="var(--g-eye)" />
      <ellipse cx={glintX} cy={glintY} rx="1.55" ry="1.9" fill="var(--g-glint)" />
    </motion.g>
  )
}
