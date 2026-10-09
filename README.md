# Agent Diamond

Agent Diamond is a small React framework for a persistent agent. One champagne-glass diamond face stands for the agent. Product code sets a single state id. The face, the motion, and the surrounding UI all read that value.

The library covers sixteen steps of a real task, plus pause and recovery. Rose states wait on a person. Everything else is the agent acting, waiting on a system, or reporting a result.

## Run it

```bash
npm install
npm run dev
```

The site opens at [http://localhost:5173](http://localhost:5173). Node 20.19+ or 22.12+ is the version Vite expects.

| Path | What it shows |
| --- | --- |
| `/` | What the framework is |
| `/playground` | Every state, with transport controls |
| `/docs` | How to change a pose, a gesture, or a behavior |
| `/workspace` | One conversation where the roster, the face, and the inline card share a state |

`npm run build` typechecks and writes a static site to `dist`.

## Use the avatar

Any screen that shows the agent uses the same prop.

```tsx
import { AgentAvatar } from "./avatar/AgentAvatar"

<AgentAvatar state="planning" size={64} />
```

`state` is an `AgentStateId`. `size` is the pixel width of the face. `label` prints the state name under the diamond when you want it.

```tsx
import { AgentAvatar } from "./avatar/AgentAvatar"
import type { AgentStateId } from "./avatar/types"

export function Presence({ state }: { state: AgentStateId }) {
  return <AgentAvatar state={state} size={64} />
}
```

Do not pick keyframes in the screen. Pass the state. Transitions blend from the pose you leave to the pose you enter. When the system asks for reduced motion, loops stop and the pose stays, so the state is still readable.

The public exports live in `src/index.ts`:

- `AgentAvatar`
- `agentStates` and `agentStateMap`
- `backboneIds`
- `AgentState`, `AgentStateId`, and `Expression`
- `BehaviorCard`

## States

| Id | Name | What the agent is saying |
| --- | --- | --- |
| `idle` | Idle | I'm ready. |
| `understanding` | Understanding | I'm understanding what you mean. |
| `planning` | Planning | I'm figuring out how to solve this. |
| `decomposing` | Decomposing | I'm breaking this problem into manageable pieces. |
| `prioritizing` | Prioritizing | I'm deciding what should happen first. |
| `selecting-tools` | Selecting tools | I'm choosing the right capability for this task. |
| `delegating` | Delegating | I'm distributing the work. |
| `waiting-dependency` | Waiting for dependency | I'm waiting for something I need. |
| `waiting-input` | Waiting for input | I need you to clarify something. |
| `searching` | Searching / retrieving | I'm gathering the information I need. |
| `analyzing` | Analyzing | I'm making sense of the information. |
| `deciding` | Deciding | I've determined the best next action. |
| `needs-approval` | Needs approval | I'm ready, but I need your permission. |
| `executing` | Executing | I'm doing the work. |
| `validating` | Validating | I'm checking that the result is correct. |
| `completed` | Completed | The task is complete. |
| `paused` | Paused / interrupted | I've stopped at a safe checkpoint. Resume whenever you're ready. |
| `error` | Error / recovery | I couldn't retrieve a source. The saved work is intact, and nothing was published. |

`paused` and `error` are extensions. They do not approve themselves.

## Change a behavior

Each behavior is a record in `src/avatar/states.ts`. `expression` is the face. `motion` is how that face moves. Change the numbers and every avatar in that state updates.

```ts
{
  id: "planning",
  expression: face({
    smile: 1.2,
    smileWidth: 0.68,
    browRaise: 0.7,
    browPinch: -0.8,
    eyeOpen: 1.08,
  }),
  motion: move({
    walk: true,
    peace: true,
    float: 0,
  }),
}
```

Expression fields:

- `smile` and `smileWidth` bend the mouth. The smile is a stroke.
- `browRaise` lifts both brows. `browPinch` lifts the inner brows when positive, and the outer brows when negative.
- `eyeOpen`, `lookX`, and `lookY` set the gaze. `lean` tilts the head.

Motion fields:

- `float` and `floatDuration` are the idle drift. `blinkEvery` is the pause between blinks. `0` keeps the eyes open.
- `scan` moves the gaze. `nod` dips the head. `walk` strides left and right.
- `reach`, `conduct`, `peace`, `deliver`, `glasses`, `hat`, `orbit`, and `turn` turn on for that state only.

A few states own a gesture. Planning walks and holds a peace sign. Decomposing wears a hat. Selecting tools reaches for a chip. Delegating orbits three child agents, and the eyes follow them. Analyzing wears glasses, with the eyes drawn on top of the lenses. Needs approval conducts, turns, holds, then rotates through depth. Completed holds, turns through depth, morphs into a glass tick, then morphs back.

## Add a gesture

A gesture is a flag on the motion spec and a drawing in `src/avatar/Face.tsx`.

1. Add a boolean to `MotionSpec` in `src/avatar/types.ts`, and default it to `false` in `move()`.
2. Pass the flag into `Face` from `AgentAvatar`.
3. Draw it inside `Face`, and render it only when the flag is set.
4. Set the flag on the state that should use it.

A new gesture should respect reduced motion: show the reached pose, and skip the repeat.

## Add a behavior

1. Add an id to `AgentStateId` in `src/avatar/types.ts`.
2. Add a record to `agentStates` in `src/avatar/states.ts`, with a cue, a tone, and a layout.
3. If the state needs an inline card, add it to `cardsFor` in `src/workspace/cards.tsx`.

Backbone states are the task. Extensions are pause and error.

## Stack

Vite, React 19, and TypeScript. Motion comes from `motion/react`. Styles are plain CSS tokens in `src/styles.css`. There is no Tailwind setup. The face is an SVG rig. Motion is authored in code, because the design source has no keyframes.
