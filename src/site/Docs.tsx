import { AgentAvatar } from "../avatar/AgentAvatar"
import { CodeBlock } from "./CodeBlock"
import { githubUrl } from "./nav"

export function Docs() {
  return (
    <main className="docs">
      <p className="kicker">Documentation</p>
      <h1>Change a state, and the avatar changes with it.</h1>
      <p className="docs__lede">
        Agent Diamond is a state map plus one face component. Product code sets the state. Expression and motion are data, so a new behavior does not require a new animation framework.
      </p>

      <section>
        <h2>Set the state</h2>
        <p>Any surface that shows the agent uses the same prop. The workspace, the playground, and a chat header all stay aligned.</p>
        <div className="docs__example">
          <AgentAvatar state="idle" size={96} />
          <CodeBlock
            code={`import { AgentAvatar } from "./avatar/AgentAvatar"
import type { AgentStateId } from "./avatar/types"

export function Presence({ state }: { state: AgentStateId }) {
  return <AgentAvatar state={state} size={64} />
}`}
          />
        </div>
      </section>

      <section>
        <h2>Edit the pose</h2>
        <p>
          Each behavior lives in <code>src/avatar/states.ts</code>. <code>expression</code> is the face. <code>motion</code> is how that face moves.           Change the numbers, and every avatar in that state updates.
        </p>
        <div className="docs__example">
          <AgentAvatar state="planning" size={120} />
          <CodeBlock
            code={`{
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
}`}
          />
        </div>
      </section>

      <section>
        <h2>What you can change</h2>
        <div className="docs__grid">
          <article>
            <h3>Expression</h3>
            <p><code>smile</code> and <code>smileWidth</code> bend the mouth.</p>
            <p><code>browRaise</code> lifts both brows. <code>browPinch</code> lifts the inner brows when positive, and the outer brows when negative.</p>
            <p><code>eyeOpen</code>, <code>lookX</code>, and <code>lookY</code> set the gaze. <code>lean</code> tilts the head.</p>
          </article>
          <article>
            <h3>Motion</h3>
            <p><code>float</code> and <code>floatDuration</code> are the idle drift. <code>blinkEvery</code> is the pause between blinks. <code>0</code> keeps the eyes open.</p>
            <p><code>scan</code> moves the gaze. <code>nod</code> dips the head. <code>walk</code> strides left and right.</p>
            <p><code>reach</code>, <code>conduct</code>, <code>peace</code>, <code>deliver</code>, <code>glasses</code>, <code>hat</code>, <code>orbit</code>, and <code>turn</code> turn on for that state only. Orbit sends child agents around the face, and the eyes follow them. Needs approval turns, holds, then rotates through depth. Completed holds, turns through depth, morphs into a glass tick, then morphs back. Analyzing wears glasses, with the eyes drawn on top of the lenses.</p>
          </article>
        </div>
      </section>

      <section>
        <h2>Add a gesture</h2>
        <p>A gesture is a flag on the motion spec and a drawing in <code>src/avatar/Face.tsx</code>. Turn the flag on for one state. The others stay unchanged. Decomposing wears the hat.</p>
        <AgentAvatar state="decomposing" size={120} />
        <ol>
          <li>Add a boolean to <code>MotionSpec</code> in <code>src/avatar/types.ts</code>, and default it to <code>false</code> in <code>move()</code>.</li>
          <li>Pass the flag into <code>Face</code> from <code>AgentAvatar</code>.</li>
          <li>Draw the hand inside <code>Face</code>, and render it only when the flag is set.</li>
          <li>Set the flag on the state that should use it.</li>
        </ol>
        <p>Reduced motion already holds loops. A new gesture should do the same: show the reached pose, and skip the repeat.</p>
      </section>

      <section>
        <h2>Add a behavior</h2>
        <p>Add an id to <code>AgentStateId</code>, then a record in <code>agentStates</code>. Give it a cue, a tone, and a layout. Backbone states are the task. Extensions are pause and error, and they do not approve themselves.</p>
        <p>
          The source is on <a href={githubUrl}>GitHub</a>. The playground shows the result of every state without changing the map.
        </p>
      </section>
    </main>
  )
}
