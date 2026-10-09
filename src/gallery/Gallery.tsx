import { useEffect, useRef, useState } from "react"
import { agentStates } from "../avatar/states"
import type { AgentStateId } from "../avatar/types"
import { BehaviorCard } from "../scenes/BehaviorCard"
import { AgentAvatar } from "../avatar/AgentAvatar"

const PLAY_MS = 3600

export function Gallery({ embedded = false }: { embedded?: boolean }) {
  const [stateId, setStateId] = useState<AgentStateId>("idle")
  const [playing, setPlaying] = useState(false)
  const lastStep = useRef(0)
  const current = agentStates.find((state) => state.id === stateId) ?? agentStates[0]

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      const now = Date.now()
      if (now - lastStep.current < PLAY_MS - 200) return
      lastStep.current = now
      setStateId((currentId) => {
        const order = agentStates.map((state) => state.id)
        const index = order.indexOf(currentId)
        return order[(index + 1) % order.length] ?? "idle"
      })
    }, PLAY_MS)
    return () => window.clearInterval(timer)
  }, [playing])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
      const index = agentStates.findIndex((state) => state.id === stateId)
      const delta = event.key === "ArrowRight" ? 1 : -1
      const next = agentStates[(index + delta + agentStates.length) % agentStates.length]
      if (!next) return
      setPlaying(false)
      setStateId(next.id)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [stateId])

  const select = (id: AgentStateId) => {
    setPlaying(false)
    setStateId(id)
  }

  const step = (delta: number) => {
    const order = agentStates.map((state) => state.id)
    const index = order.indexOf(stateId)
    const next = order[(index + delta + order.length) % order.length]
    if (next) select(next)
  }

  return (
    <main className="library">
      <header className="library__intro">
        <p className="kicker">{embedded ? "Playground" : "Champagne / behavior map"}</p>
        <h1>{embedded ? "Every state" : "Agentic UX State Library"}</h1>
        <p className="lede">
          {embedded
            ? "The same diamond, one pose for each behavior. Pick a state or play the backbone. Product code only sets the state."
            : "One agent, sixteen behaviors, plus pause and recovery. Each state is a face pose and a small scene. The product only sets the state."}
        </p>
      </header>

      <section className="player" aria-label="Selected behavior">
        <p className="sr-only" aria-live="polite">
          {current.name}. {current.cue}
        </p>
        <BehaviorCard state={stateId} />
        <div className="player__controls">
          <button type="button" onClick={() => step(-1)} aria-label="Previous">
            <TransportIcon name="previous" />
          </button>
          <button
            type="button"
            className={playing ? "is-active" : ""}
            onClick={() => setPlaying((value) => !value)}
            aria-pressed={playing}
            aria-label={playing ? "Pause" : "Play states"}
          >
            <TransportIcon name={playing ? "pause" : "play"} />
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next">
            <TransportIcon name="next" />
          </button>
        </div>
      </section>

      <section className="library__set" aria-label="All behaviors">
        <h2>Backbone</h2>
        <div className="tile-grid">
          {agentStates
            .filter((state) => !state.extension)
            .map((state) => (
              <Tile key={state.id} id={state.id} selected={state.id === stateId} onSelect={select} />
            ))}
        </div>
        <h2>Extensions</h2>
        <div className="tile-grid">
          {agentStates
            .filter((state) => state.extension)
            .map((state) => (
              <Tile key={state.id} id={state.id} selected={state.id === stateId} onSelect={select} />
            ))}
        </div>
      </section>
    </main>
  )
}

function TransportIcon({ name }: { name: "previous" | "play" | "pause" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      {name === "previous" ? (
        <>
          <rect x="5" y="5" width="2.2" height="14" rx="0.6" />
          <path d="M19 5.2 8.2 12 19 18.8z" />
        </>
      ) : null}
      {name === "play" ? <path d="M8 5.2v13.6l11.2-6.8z" /> : null}
      {name === "pause" ? (
        <>
          <rect x="6" y="5" width="3.4" height="14" rx="0.6" />
          <rect x="14.6" y="5" width="3.4" height="14" rx="0.6" />
        </>
      ) : null}
      {name === "next" ? (
        <>
          <path d="M5 5.2 15.8 12 5 18.8z" />
          <rect x="16.8" y="5" width="2.2" height="14" rx="0.6" />
        </>
      ) : null}
    </svg>
  )
}

function Tile({
  id,
  selected,
  onSelect,
}: {
  id: AgentStateId
  selected: boolean
  onSelect: (id: AgentStateId) => void
}) {
  const spec = agentStates.find((state) => state.id === id)
  if (!spec) return null

  return (
    <button type="button" className={selected ? "tile is-selected" : "tile"} data-tone={spec.tone} aria-pressed={selected} onClick={() => onSelect(id)}>
      <AgentAvatar state={id} size={92} />
      <span className="tile__copy">
        <span className="tile__num">{spec.number}</span>
        <span className="tile__name">{spec.name}</span>
        <span className="tile__phase">{spec.phase}</span>
      </span>
    </button>
  )
}
