import { useEffect, useId, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
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
  wave: boolean
  hat: boolean
  orbit: boolean
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
        <rect x="-13" y="-13" width="26" height="26" rx="8" fill="#f6ead8" stroke="#ead9bf" strokeWidth="0.8" />
      </g>
      <ellipse cx="-4.2" cy="-1.2" rx="1.45" ry="1.8" fill="#3c322b" />
      <ellipse cx="4.2" cy="-1.2" rx="1.45" ry="1.8" fill="#3c322b" />
      <path d="M-4.2 4 Q0 6.4 4.2 4" fill="none" stroke="#4a3d34" strokeWidth="0.9" strokeLinecap="round" />
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
      <ellipse cx="77.5" cy="24" rx="32" ry="8" fill="#3c322b" />
      <path d="M56 22C56 8 65 1 77.5 1C90 1 99 8 99 22Z" fill="#4a3d34" />
      <path d="M62 19C64 10 70 6 77.5 6C85 6 91 10 93 19Z" fill="#5a483c" />
      <rect x="60" y="16.5" width="35" height="4.5" rx="1.4" fill="#f3e4cd" />
    </g>
  )
}

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
    opacity: 0.28 + (i % 3) * 0.1,
  }
})

export function Face({ expression, blinkEvery, lookX, scan, nod, reach, conduct, peace, wave, hat, orbit }: FaceProps) {
  const reduce = useReducedMotion()
  const [closed, setClosed] = useState(false)
  const gradientId = useId().replace(/:/g, "")
  const bodyFill = `satin-body-${gradientId}`
  const shadeFill = `satin-shade-${gradientId}`
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
    <svg className="face" viewBox={orbit ? "-24 -10 203 176" : "0 0 155 156"} role="img" aria-hidden="true">
      <defs>
        <radialGradient id={bodyFill} cx="32%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#fffaf4" />
          <stop offset="42%" stopColor="#f3e4cd" />
          <stop offset="100%" stopColor="#e4cfae" />
        </radialGradient>
        <linearGradient id={shadeFill} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="46%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#c9aa78" stopOpacity="0.28" />
        </linearGradient>
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
            {orbit ? <OrbitingChildren layer="back" reduce={Boolean(reduce)} /> : null}
            <g transform="translate(77.5 76) rotate(45)">
              <g clipPath={`url(#${faceClip})`}>
                <rect x="-52" y="-52" width="104" height="104" rx="34" fill={`url(#${bodyFill})`} />
                <rect x="-52" y="-52" width="104" height="104" rx="34" fill={`url(#${shadeFill})`} />
                <ellipse cx="-16" cy="-22" rx="26" ry="14" fill="#fff" opacity="0.42" />
                {edgeSpray.map((dot) => (
                  <circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r={dot.r} fill="#9a7d58" opacity={dot.opacity} />
                ))}
              </g>
              <rect x="-52" y="-52" width="104" height="104" rx="34" fill="none" stroke="#ead9bf" strokeWidth="1.2" />
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
              <Eye cx={53.5} scaleY={eyeScale} lookX={expression.lookX} lookY={expression.lookY} />
              <Eye cx={102.5} scaleY={eyeScale} lookX={expression.lookX} lookY={expression.lookY} />
            </motion.g>

            <motion.path
              d={browPath("left", expression.browRaise, expression.browPinch)}
              animate={{ d: browPath("left", expression.browRaise, expression.browPinch) }}
              transition={spring}
              stroke="#4a3d34"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
            <motion.path
              d={browPath("right", expression.browRaise, expression.browPinch)}
              animate={{ d: browPath("right", expression.browRaise, expression.browPinch) }}
              transition={spring}
              stroke="#4a3d34"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />

            <motion.path
              d={smilePath(expression.smile, expression.smileWidth)}
              animate={{ d: smilePath(expression.smile, expression.smileWidth) }}
              transition={spring}
              stroke="#4a3d34"
              strokeWidth="3.1"
              strokeLinecap="round"
              fill="none"
            />
            {orbit ? <OrbitingChildren layer="front" reduce={Boolean(reduce)} /> : null}
            {reach ? <SelectingHand reduce={Boolean(reduce)} /> : null}
            {conduct ? <ConductingHands reduce={Boolean(reduce)} /> : null}
            {peace ? <PeaceHand reduce={Boolean(reduce)} /> : null}
            {wave ? <WaveHand reduce={Boolean(reduce)} /> : null}
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
      <ellipse cx="12" cy="20" rx="8" ry="5.5" fill="#e4c4a2" />
      <ellipse cx="12" cy="14" rx="7.2" ry="6" fill="#f3d7b6" stroke="#c4a484" strokeWidth="0.8" />
      <rect x="9" y="4" width="6" height="12" rx="3" fill="#f6e2cc" stroke="#c4a484" strokeWidth="0.7" />
      {baton ? (
        <>
          <rect x="11" y="-12" width="2.1" height="18" rx="1" fill="#4a3d34" />
          <circle cx="12.05" cy="-12" r="1.7" fill="#4a3d34" />
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
        <ellipse cx="14" cy="30" rx="9" ry="7" fill="#f3d7b6" stroke="#c4a484" strokeWidth="0.8" />
        <rect x="6" y="6" width="5.4" height="20" rx="2.7" transform="rotate(-22 8.7 26)" fill="#f6e2cc" stroke="#c4a484" strokeWidth="0.7" />
        <rect x="16" y="6" width="5.4" height="20" rx="2.7" transform="rotate(22 18.7 26)" fill="#f6e2cc" stroke="#c4a484" strokeWidth="0.7" />
      </motion.g>
    </g>
  )
}

function WaveHand({ reduce }: { reduce: boolean }) {
  return (
    <g transform="translate(108 14)">
      <motion.g
        style={{ transformOrigin: "14px 32px" }}
        animate={reduce ? { rotate: -16 } : { rotate: [-32, 24, -32] }}
        transition={reduce ? { duration: 0.2 } : { duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="14" cy="34" rx="9" ry="7" fill="#e4c4a2" />
        <rect x="6" y="16" width="16" height="16" rx="7" fill="#f3d7b6" stroke="#c4a484" strokeWidth="0.8" />
        <rect x="7" y="2" width="4.2" height="18" rx="2.1" fill="#f6e2cc" stroke="#c4a484" strokeWidth="0.6" />
        <rect x="12" y="0" width="4.2" height="20" rx="2.1" fill="#f6e2cc" stroke="#c4a484" strokeWidth="0.6" />
        <rect x="17" y="2" width="4.2" height="18" rx="2.1" fill="#f6e2cc" stroke="#c4a484" strokeWidth="0.6" />
      </motion.g>
    </g>
  )
}

function SelectingHand({ reduce }: { reduce: boolean }) {
  const cycle = reduce ? { duration: 0.2 } : reachCycle
  return (
    <g>
      <g transform="translate(124 118)">
        <rect width="20" height="16" rx="5" fill="#fffdfa" stroke="#817453" strokeWidth="1.5" />
        <motion.circle
          cx="10"
          cy="8"
          r="3.4"
          fill="#817453"
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
          <path d="M4 14c0-5 7-7 11-3l-1 9c-3 3-10 2-10-6z" fill="#e4c4a2" />
          <path
            d="M10 13c0-6 8-8 12-4 4-3 10 1 8 6 4 0 6 6 1 8-3 4-14 5-18 1-4-2-3-8-3-11z"
            fill="#f3d7b6"
            stroke="#c4a484"
            strokeWidth="0.9"
          />
          <motion.g
            style={{ transformOrigin: "22px 12px" }}
            animate={reduce ? { rotate: 6 } : { rotate: [2, -4, 16, -4, 2] }}
            transition={cycle}
          >
            <rect x="20" y="6" width="20" height="7.2" rx="3.6" fill="#f6e2cc" stroke="#c4a484" strokeWidth="0.8" />
          </motion.g>
        </g>
      </motion.g>
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
      <ellipse cx={cx} cy="66.5" rx="6.4" ry="8" fill="#3c322b" />
      <ellipse cx={glintX} cy={glintY} rx="1.55" ry="1.9" fill="#fffefb" />
    </motion.g>
  )
}
