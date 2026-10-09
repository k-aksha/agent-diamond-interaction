import { AgentAvatar } from "../avatar/AgentAvatar"
import type { AgentStateId } from "../avatar/types"
import { githubUrl, navigate } from "./nav"

const features: { title: string; body: string; state: AgentStateId }[] = [
  {
    title: "The face is the status",
    body: "Idle, thinking, working, waiting, blocked, and done are poses on one diamond. A second badge is optional.",
    state: "idle",
  },
  {
    title: "Eighteen behaviors",
    body: "Sixteen steps of a real task, plus pause and recovery. A marked state means the agent is waiting on a person.",
    state: "planning",
  },
  {
    title: "A state, not a timeline",
    body: "Product code sets state. The avatar, the screen, and the inline card all read that one value.",
    state: "understanding",
  },
  {
    title: "Answers have a shape",
    body: "A sentence stays prose. A send, a payment, a command, or a routine becomes a card in the thread.",
    state: "needs-approval",
  },
  {
    title: "Its own screen",
    body: "Work stays on Agent Diamond’s screen. You glance when you want context, and take over only when it asks.",
    state: "executing",
  },
  {
    title: "Motion that can rest",
    body: "Loops drop when the system asks for reduced motion. The pose remains, so the state is still readable.",
    state: "paused",
  },
]

export function Landing() {
  return (
    <main className="landing">
      <section className="landing__hero">
        <div>
          <p className="kicker">Open source agent presence</p>
          <h1>One diamond. Every state the agent can be in.</h1>
          <p className="landing__lede">
            Agent Diamond is a small framework for a persistent agent. You name the state. The face, the motion, and the surrounding UI change with it.
          </p>
          <div className="landing__cta">
            <a className="landing__github" href={githubUrl} target="_blank" rel="noreferrer">
              Open source on GitHub
            </a>
            <a
              href="/playground"
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey) return
                event.preventDefault()
                navigate("/playground")
              }}
            >
              Open the playground
            </a>
            <a
              href="/docs"
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey) return
                event.preventDefault()
                navigate("/docs")
              }}
            >
              Read the docs
            </a>
          </div>
        </div>
        <div className="landing__stage">
          <AgentAvatar state="idle" size={180} />
          <p>idle</p>
        </div>
      </section>

      <section className="landing__features" aria-label="Agent features">
        {features.map((feature) => (
          <article key={feature.title}>
            <AgentAvatar state={feature.state} size={96} />
            <h2>{feature.title}</h2>
            <p>{feature.body}</p>
          </article>
        ))}
      </section>

      <section className="landing__framework">
        <div>
          <p className="kicker">The framework</p>
          <h2>Change the state. The animation follows.</h2>
          <p>
            A screen does not pick keyframes. It passes a state id. Poses, blinks, walks, and hand gestures live in the state map, so every surface stays in sync.
          </p>
        </div>
        <div className="landing__sample">
          <AgentAvatar state="planning" size={120} />
          <pre>{`import { AgentAvatar } from "./avatar/AgentAvatar"

<AgentAvatar state="planning" size={64} />`}</pre>
        </div>
      </section>
    </main>
  )
}
