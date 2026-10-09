import { githubUrl, navigate, type Page } from "./nav"

const links: { href: string; page: Page; label: string }[] = [
  { href: "/playground", page: "playground", label: "Playground" },
  { href: "/docs", page: "docs", label: "Docs" },
  { href: "/workspace", page: "workspace", label: "Workspace" },
]

export function SiteNav({ page }: { page: Page }) {
  return (
    <header className="site-nav">
      <a
        href="/"
        className="site-nav__mark"
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey) return
          event.preventDefault()
          navigate("/")
        }}
      >
        Agent Diamond
      </a>
      <nav>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            aria-current={page === link.page ? "page" : undefined}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey) return
              event.preventDefault()
              navigate(link.href)
            }}
          >
            {link.label}
          </a>
        ))}
        <a href={githubUrl} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
    </header>
  )
}
