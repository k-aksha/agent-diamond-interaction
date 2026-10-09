const keywords = new Set([
  "import",
  "from",
  "export",
  "function",
  "return",
  "const",
  "let",
  "type",
  "interface",
  "true",
  "false",
  "as",
])

type Kind = "keyword" | "string" | "number" | "comment" | "type" | "name" | "punct"

const tokenPattern =
  /\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b[A-Za-z_][A-Za-z0-9_]*\b|\b\d+(?:\.\d+)?\b|[{}()[\]<>=.,:/]/g

function kindFor(text: string): Kind {
  if (text.startsWith("//")) return "comment"
  if (text.startsWith('"') || text.startsWith("'") || text.startsWith("`")) return "string"
  if (keywords.has(text)) return "keyword"
  if (/^\d/.test(text)) return "number"
  if (/^[A-Z]/.test(text)) return "type"
  if (/^[A-Za-z_]/.test(text)) return "name"
  return "punct"
}

function highlight(source: string) {
  const parts: { kind: Kind; text: string }[] = []
  let last = 0
  for (const match of source.matchAll(tokenPattern)) {
    const index = match.index ?? 0
    if (index > last) parts.push({ kind: "punct", text: source.slice(last, index) })
    const text = match[0]
    parts.push({ kind: kindFor(text), text })
    last = index + text.length
  }
  if (last < source.length) parts.push({ kind: "punct", text: source.slice(last) })
  return parts
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="code-view">
      {highlight(code).map((token, index) => (
        <span key={index} className={`tok tok--${token.kind}`}>
          {token.text}
        </span>
      ))}
    </pre>
  )
}
