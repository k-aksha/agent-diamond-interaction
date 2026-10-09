import { useEffect, useMemo, useState } from "react"
import { AgentAvatar } from "../avatar/AgentAvatar"
import { agentStateMap, agentStates, backboneIds } from "../avatar/states"
import type { AgentStateId } from "../avatar/types"
import { StateDiagram } from "../scenes/diagrams"
import { StateCards } from "./cards"
import { routines, threads } from "./content"

type WorkspaceProps = {
  onOpenLibrary: () => void
}

export function Workspace({ onOpenLibrary }: WorkspaceProps) {
  const [stateId, setStateId] = useState<AgentStateId>("idle")
  const [query, setQuery] = useState("")
  const [draft, setDraft] = useState("")
  const spec = agentStateMap[stateId]
  const thread = threads[stateId]

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return agentStates.filter((state) => {
      if (!q) return true
      return `${state.name} ${state.phase} ${state.cue}`.toLowerCase().includes(q)
    })
  }, [query])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
      const target = event.target as HTMLElement | null
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return
      const order = agentStates.map((state) => state.id)
      const index = order.indexOf(stateId)
      const next = event.key === "ArrowRight" ? index + 1 : index - 1
      const id = order[(next + order.length) % order.length]
      setStateId(id)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [stateId])

  const screenLabel = spec.tone === "rose" ? "Needs you" : spec.tone === "green" ? "Delivered" : spec.id === "idle" ? "Ready" : "Active"

  return (
    <div className="workspace">
      <aside className="roster">
        <header className="roster__brand">
          <p className="kicker">Agent Diamond</p>
          <strong>Persistent agent</strong>
        </header>

        <label className="roster__search">
          <span className="sr-only">Search states</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            type="search"
          />
        </label>

        <div className="roster__agent">
          <Presence state={stateId} size={52} />
          <div>
            <strong>Agent Diamond</strong>
            <p>{spec.name}</p>
          </div>
        </div>

        <ul className="roster__list">
          {visible.map((state) => (
            <li key={state.id}>
              <button
                type="button"
                className={state.id === stateId ? "roster__row is-selected" : "roster__row"}
                data-tone={state.tone}
                onClick={() => setStateId(state.id)}
              >
                <i />
                <span>
                  <b>{state.name}</b>
                  <small>{state.phase}</small>
                </span>
                <time>{threads[state.id].when}</time>
              </button>
            </li>
          ))}
        </ul>

        <button type="button" className="roster__library" onClick={onOpenLibrary}>
          Playground
        </button>
      </aside>

      <main className="thread">
        <header className="thread__bar">
          <Presence state={stateId} size={64} />
          <div>
            <p className="kicker">{spec.number} · {spec.activity}</p>
            <h1>{spec.name}</h1>
          </div>
          <span className="thread__phase" data-tone={spec.tone}>{spec.phase}</span>
        </header>

        <div className="thread__log">
          {thread.user ? (
            <article className="bubble bubble--user">
              <p>{thread.user}</p>
            </article>
          ) : null}
          <article className="bubble bubble--bot">
            <AgentAvatar state={stateId} size={28} />
            <p>“{thread.bot}”</p>
          </article>
          <StateCards id={stateId} />
          {!backboneIds.includes(stateId) ? <p className="thread__note">Extension. No automatic approval.</p> : null}
        </div>

        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault()
            setDraft("")
          }}
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Message Agent Diamond"
            aria-label="Message Agent Diamond"
          />
          <button type="submit">Send</button>
        </form>
      </main>

      <aside className="desk">
        <section className="screen">
          <header>
            <h2>Agent Diamond’s screen</h2>
            <span data-tone={spec.tone}>{screenLabel}</span>
          </header>
          <div className="screen__stage">
            <AgentAvatar state={stateId} size={112} />
            <p className="annotation">{spec.annotation}</p>
            <StateDiagram id={stateId} />
          </div>
        </section>

        <section className="routines">
          <h2>Routines</h2>
          <ul>
            {routines.map((routine) => (
              <li key={routine.name} className={routine.paused ? "is-paused" : ""}>
                <b>{routine.name}</b>
                <small>{routine.when}</small>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  )
}

function Presence({ state, size }: { state: AgentStateId; size: number }) {
  const spec = agentStateMap[state]
  return (
    <span className="presence">
      <AgentAvatar state={state} size={size} />
      <span className="presence__tip" role="tooltip">
        {spec.cue}
      </span>
    </span>
  )
}

