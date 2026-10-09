import type { AgentStateId } from "../avatar/types"

export type Thread = {
  id: AgentStateId
  user: string
  bot: string
  when: string
}

export const threads: Record<AgentStateId, Thread> = {
  idle: {
    id: "idle",
    user: "",
    bot: "I'm ready.",
    when: "Now",
  },
  understanding: {
    id: "understanding",
    user: "Move Friday’s design review and tell the team why.",
    bot: "I'm understanding what you mean.",
    when: "2m",
  },
  planning: {
    id: "planning",
    user: "Get the Friday deck ready for a yes.",
    bot: "I'm figuring out how to solve this.",
    when: "2m",
  },
  decomposing: {
    id: "decomposing",
    user: "Don’t do it as one lump. Break it up.",
    bot: "I'm breaking this problem into manageable pieces.",
    when: "3m",
  },
  prioritizing: {
    id: "prioritizing",
    user: "Something has to happen first.",
    bot: "I'm deciding what should happen first.",
    when: "3m",
  },
  "selecting-tools": {
    id: "selecting-tools",
    user: "Use whatever you need. Just pick the right one.",
    bot: "I'm choosing the right capability for this task.",
    when: "4m",
  },
  delegating: {
    id: "delegating",
    user: "Check in with everyone for me.",
    bot: "I'm distributing the work.",
    when: "4m",
  },
  "waiting-dependency": {
    id: "waiting-dependency",
    user: "Send it once the CRM write is back.",
    bot: "I'm waiting for something I need.",
    when: "6m",
  },
  "waiting-input": {
    id: "waiting-input",
    user: "Draft the follow-up, but check the tone with me.",
    bot: "I need you to clarify something.",
    when: "7m",
  },
  searching: {
    id: "searching",
    user: "What did we promise Acme on pricing?",
    bot: "I'm gathering the information I need.",
    when: "8m",
  },
  analyzing: {
    id: "analyzing",
    user: "Make sense of the three competitor decks.",
    bot: "I'm making sense of the information.",
    when: "9m",
  },
  deciding: {
    id: "deciding",
    user: "So what should we do?",
    bot: "I've determined the best next action.",
    when: "9m",
  },
  "needs-approval": {
    id: "needs-approval",
    user: "Send the Friday note when it’s ready.",
    bot: "I'm ready, but I need your permission.",
    when: "10m",
  },
  executing: {
    id: "executing",
    user: "Go ahead.",
    bot: "I'm doing the work.",
    when: "11m",
  },
  validating: {
    id: "validating",
    user: "Make sure nothing half-sent went out.",
    bot: "I'm checking that the result is correct.",
    when: "12m",
  },
  completed: {
    id: "completed",
    user: "Go ahead.",
    bot: "The task is complete.",
    when: "14m",
  },
  paused: {
    id: "paused",
    user: "Hold there.",
    bot: "I've stopped at a safe checkpoint. Resume whenever you're ready.",
    when: "Held",
  },
  error: {
    id: "error",
    user: "Pull the source and publish the note.",
    bot: "I couldn't retrieve a source. The saved work is intact, and nothing was published.",
    when: "Now",
  },
}

export const routines = [
  { name: "Morning briefing", when: "Every day at 8:00 AM", paused: false },
  { name: "Inbox cleanup", when: "Weekdays at 6:00 PM", paused: false },
  { name: "Weekly team update", when: "Paused", paused: true },
]
