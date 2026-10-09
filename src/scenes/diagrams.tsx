import type { ReactNode } from "react"
import type { AgentStateId } from "../avatar/types"

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
      {children}
    </svg>
  )
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

function Chip({
  hot = false,
  dim = false,
  delay = 0,
  children,
}: {
  hot?: boolean
  dim?: boolean
  delay?: number
  children: ReactNode
}) {
  const className = ["chip", hot ? "is-hot" : "", dim ? "is-dim" : ""].filter(Boolean).join(" ")
  return (
    <div className={className} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function Caption({ children }: { children: ReactNode }) {
  return <p className="caption">{children}</p>
}

export function StateDiagram({ id }: { id: AgentStateId }) {
  switch (id) {
    case "idle":
      return (
        <div className="ready-pill">
          <span className="ready-pill__dot" />
          Ready
        </div>
      )
    case "understanding":
      return (
        <div className="converge">
          <Chip delay={0}>
            <Icon>
              <path {...stroke} d="M3 3.5h8M3 7h8M3 10.5h5" />
            </Icon>
            <span>Text · summarize this</span>
          </Chip>
          <Chip hot delay={160}>
            <Icon>
              <path {...stroke} d="M2.5 7h9M7 2.5v9" />
              <circle {...stroke} cx="7" cy="7" r="4.2" />
            </Icon>
            <span>Intent · key takeaways</span>
          </Chip>
          <Chip delay={320}>
            <Icon>
              <path {...stroke} d="M4 2.5h4.5L11 5v6.5H4z" />
              <path {...stroke} d="M8 2.6V5h2.4M5.5 7.5h3.5M5.5 9.5h2.5" />
            </Icon>
            <span>Context · Q3 report</span>
          </Chip>
          <Caption>Fragments converge</Caption>
        </div>
      )
    case "planning":
      return (
        <ol className="spine">
          {["Understand", "Research", "Analyze", "Execute", "Validate"].map((step, index) => (
            <li key={step} style={{ animationDelay: `${index * 120}ms` }} className={index === 1 ? "is-hot" : ""}>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )
    case "decomposing":
      return (
        <div className="split-task">
          <Chip hot>
            <span>Main task</span>
          </Chip>
          <div className="split-task__row">
            {["Task A", "Task B", "Task C", "Task D"].map((task, index) => (
              <Chip key={task} delay={180 + index * 90}>
                <span>{task}</span>
              </Chip>
            ))}
          </div>
          <Caption>Smaller, independent units</Caption>
        </div>
      )
    case "prioritizing":
      return (
        <ol className="ranks">
          {[
            ["1", "Unblock research", true],
            ["2", "Gather evidence", false],
            ["3", "Compare options", false],
            ["4", "Prepare output", false],
          ].map(([rank, label, hot], index) => (
            <li key={String(rank)} className={hot ? "is-hot" : ""} style={{ animationDelay: `${index * 110}ms` }}>
              <b>{rank}</b>
              <span>{label}</span>
            </li>
          ))}
        </ol>
      )
    case "selecting-tools":
      return (
        <div className="tool-grid">
          {[
            ["Search", true],
            ["Database", false],
            ["API", false],
            ["Browser", false],
            ["Calculator", false],
            ["CRM", false],
          ].map(([name, hot], index) => (
            <Chip key={String(name)} hot={Boolean(hot)} delay={index * 70}>
              <span>{name}</span>
            </Chip>
          ))}
          <Caption>Search selected · 1 of 6</Caption>
        </div>
      )
    case "delegating":
      return (
        <div className="delegate">
          <div className="delegate__bus" />
          <div className="delegate__row">
            {[
              ["Research", "Find sources"],
              ["Data", "Collect records"],
              ["Analysis", "Find patterns"],
              ["Execution", "Run actions"],
            ].map(([name, job], index) => (
              <div key={name} className="mini-agent" style={{ animationDelay: `${index * 120}ms` }}>
                <span className="mini-agent__mark" />
                <strong>{name}</strong>
                <em>{job}</em>
              </div>
            ))}
          </div>
        </div>
      )
    case "waiting-dependency":
      return (
        <div className="system-card">
          <div className="system-card__title">
            <span className="system-card__glyph" />
            External system
          </div>
          <div className="meter">
            <span className="meter__fill is-loop" />
          </div>
          <p>Processing…</p>
          <Caption>Auto-resume · no user action</Caption>
        </div>
      )
    case "waiting-input":
      return (
        <div className="ask">
          <p className="ask__question">
            <span>?</span>
            Which option should I use?
          </p>
          <Chip delay={80}>
            <span className="radio" />
            Option A · quick summary
          </Chip>
          <Chip delay={180}>
            <span className="radio" />
            Option B · detailed report
          </Chip>
        </div>
      )
    case "searching":
      return (
        <div className="search-flow">
          <Chip hot>Search</Chip>
          <Chip delay={140}>Retrieve</Chip>
          <div className="sources">
            {["Web", "File", "Data"].map((source, index) => (
              <div key={source} className="source" style={{ animationDelay: `${260 + index * 140}ms` }}>
                <span />
                {source}
              </div>
            ))}
          </div>
        </div>
      )
    case "analyzing":
      return (
        <div className="analyze">
          <pre>{`24  08  62
16  12  41
38  22  76`}</pre>
          <div className="bars" aria-hidden="true">
            <i style={{ height: "28%" }} />
            <i style={{ height: "46%" }} />
            <i style={{ height: "70%" }} />
            <i style={{ height: "92%" }} />
          </div>
          <Chip hot delay={280}>
            Insight · trend is rising
          </Chip>
        </div>
      )
    case "deciding":
      return (
        <div className="choices">
          <Chip dim delay={0}>Option A</Chip>
          <Chip hot delay={140}>Option B ✓</Chip>
          <Chip dim delay={260}>Option C</Chip>
          <Caption>Best-fit path selected</Caption>
        </div>
      )
    case "needs-approval":
      return (
        <div className="gate">
          <p>Ready to execute</p>
          <span>Publish report to CRM</span>
          <div className="gate__actions">
            <span>Approve</span>
            <span>Cancel</span>
          </div>
          <Caption>Not yet approved</Caption>
        </div>
      )
    case "executing":
      return (
        <div className="steps">
          <p className="steps__label">Executing…</p>
          <Chip delay={0}>✓ Step 1</Chip>
          <Chip delay={160}>✓ Step 2</Chip>
          <Chip hot delay={320}>→ Step 3</Chip>
          <div className="meter">
            <span className="meter__fill is-execute" />
          </div>
        </div>
      )
    case "validating":
      return (
        <div className="verify">
          <div className="sample">
            <b>Expected ✓</b>
            <div className="bars">
              <i style={{ height: "40%" }} />
              <i style={{ height: "62%" }} />
              <i style={{ height: "86%" }} />
            </div>
          </div>
          <div className="sample">
            <b>Actual ✓</b>
            <div className="bars">
              <i style={{ height: "40%" }} />
              <i style={{ height: "62%" }} />
              <i style={{ height: "86%" }} />
            </div>
          </div>
          <Chip hot delay={200}>Verified ✓</Chip>
        </div>
      )
    case "completed":
      return (
        <div className="deliverable">
          <div className="deliverable__head">
            <span className="quiet-check" />
            Final report
          </div>
          <ul>
            <li>Gathered</li>
            <li>Checked</li>
            <li>Delivered</li>
          </ul>
          <div className="meter">
            <span className="meter__fill is-done" />
          </div>
        </div>
      )
    case "paused":
      return (
        <div className="checkpoint">
          <p>Safe checkpoint</p>
          <div className="meter">
            <span className="meter__fill is-held" />
          </div>
          <Chip>Resume when ready</Chip>
        </div>
      )
    case "error":
      return (
        <div className="recover">
          <p>Source unavailable</p>
          <Chip hot delay={160}>Saved work intact</Chip>
          <Caption>Nothing was published</Caption>
        </div>
      )
    default:
      return null
  }
}
