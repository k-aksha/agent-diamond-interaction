export type AgentStateId =
  | "idle"
  | "understanding"
  | "planning"
  | "decomposing"
  | "prioritizing"
  | "selecting-tools"
  | "delegating"
  | "waiting-dependency"
  | "waiting-input"
  | "searching"
  | "analyzing"
  | "deciding"
  | "needs-approval"
  | "executing"
  | "validating"
  | "completed"
  | "paused"
  | "error"

export type Tone = "olive" | "rose" | "green"

export type Layout = "center" | "split" | "stack"

export type Expression = {
  smile: number
  smileWidth: number
  open: number
  browRaise: number
  browPinch: number
  eyeOpen: number
  lookX: number
  lookY: number
  cheek: number
  lean: number
}

export type MotionSpec = {
  float: number
  floatDuration: number
  blinkEvery: number
  scan: boolean
  nod: boolean
  walk: boolean
  reach: boolean
  conduct: boolean
  peace: boolean
  wave: boolean
  hat: boolean
  orbit: boolean
}

export type AgentState = {
  id: AgentStateId
  number: string
  name: string
  cue: string
  activity: string
  phase: string
  annotation: string
  tone: Tone
  extension: boolean
  layout: Layout
  expression: Expression
  motion: MotionSpec
}
