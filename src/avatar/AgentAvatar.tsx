import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Face } from "./Face"
import { agentStateMap } from "./states"
import type { AgentStateId } from "./types"

type AgentAvatarProps = {
  state: AgentStateId
  size?: number
  label?: boolean
}

export function AgentAvatar({ state, size = 156, label = false }: AgentAvatarProps) {
  const spec = agentStateMap[state]
  const reduce = useReducedMotion()
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (state !== "error" || reduce) return
    setShake(true)
    const timer = window.setTimeout(() => setShake(false), 480)
    return () => window.clearTimeout(timer)
  }, [state, reduce])

  const walking = spec.motion.walk && !reduce
  const float = reduce || walking ? 0 : spec.motion.float
  const stride = walking ? Math.max(12, size * 0.2) : 0
  const hop = walking ? Math.max(4, size * 0.07) : 0
  const walkCycle = {
    duration: 1.7,
    repeat: Infinity,
    ease: "easeInOut" as const,
  }

  return (
    <div
      className="agent-avatar"
      data-state={state}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ? `${spec.name}. ${spec.cue}` : undefined}
      aria-hidden={label ? undefined : true}
    >
      <motion.div
        className="agent-avatar__shake"
        animate={
          walking
            ? { x: [-stride, 0, stride, 0, -stride], rotate: [-8, 0, 8, 0, -8] }
            : { x: shake ? [0, -3.5, 3.5, -2, 1.5, 0] : 0, rotate: 0 }
        }
        transition={walking ? walkCycle : { duration: 0.46, ease: "easeInOut" }}
      >
        <motion.div
          className="agent-avatar__float"
          animate={{ y: walking ? [0, -hop, 0, -hop, 0] : float === 0 ? 0 : [0, -float, 0] }}
          transition={
            walking
              ? walkCycle
              : {
                  duration: spec.motion.floatDuration,
                  repeat: float === 0 ? 0 : Infinity,
                  ease: "easeInOut",
                }
          }
        >
          <Face
            expression={spec.expression}
            blinkEvery={spec.motion.blinkEvery}
            lookX={spec.expression.lookX}
            scan={spec.motion.scan}
            nod={spec.motion.nod}
            reach={spec.motion.reach}
            conduct={spec.motion.conduct}
            peace={spec.motion.peace}
            wave={spec.motion.wave}
            hat={spec.motion.hat}
            orbit={spec.motion.orbit}
          />
        </motion.div>
      </motion.div>
      <motion.div
        className="agent-avatar__shadow"
        animate={
          walking
            ? {
                x: [-stride, 0, stride, 0, -stride],
                scaleX: [1, 0.7, 1, 0.7, 1],
                opacity: [0.42, 0.2, 0.42, 0.2, 0.42],
              }
            : reduce
              ? { scaleX: 1, opacity: 0.38, x: 0 }
              : { scaleX: [1, 0.78, 1], opacity: [0.42, 0.22, 0.42], x: 0 }
        }
        transition={
          walking
            ? walkCycle
            : {
                duration: spec.motion.floatDuration,
                repeat: reduce ? 0 : Infinity,
                ease: "easeInOut",
              }
        }
      />
    </div>
  )
}
