import { AgentAvatar } from "../avatar/AgentAvatar"
import { agentStateMap } from "../avatar/states"
import type { AgentStateId } from "../avatar/types"
import { StateDiagram } from "./diagrams"

type BehaviorCardProps = {
  state: AgentStateId
}

export function BehaviorCard({ state }: BehaviorCardProps) {
  const spec = agentStateMap[state]

  return (
    <article className="behavior-card" data-tone={spec.tone}>
      <header className="behavior-card__identity">
        <span>{spec.number}</span>
        <h2>{spec.name}</h2>
        <i className="status-dot" />
      </header>
      <div className="illustration">
        {spec.layout !== "center" ? null : <p className="annotation annotation--float">{spec.annotation}</p>}
        <div className="stage-body" data-layout={spec.layout}>
          <div className="agent-slot">
            {spec.id === "executing" ? <span className="action-trail" /> : null}
            <AgentAvatar state={spec.id} size={spec.layout === "stack" ? 112 : 150} />
          </div>
          <div className="diagram" key={spec.id}>
            {spec.layout === "center" ? null : <p className="annotation">{spec.annotation}</p>}
            <StateDiagram id={spec.id} />
          </div>
        </div>
      </div>
      <footer className="behavior-card__meaning">
        <p className="cue">“{spec.cue}”</p>
        <div className="meta">
          <span className="activity">
            <i />
            {spec.activity}
          </span>
          <span className="phase">{spec.phase}</span>
        </div>
      </footer>
    </article>
  )
}
