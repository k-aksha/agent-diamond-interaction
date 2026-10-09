import { useEffect, useState } from "react"
import { Gallery } from "./gallery/Gallery"
import { Docs } from "./site/Docs"
import { Landing } from "./site/Landing"
import { navigate, pageFromPath, type Page } from "./site/nav"
import { SiteNav } from "./site/SiteNav"
import { Workspace } from "./workspace/Workspace"

export function App() {
  const [page, setPage] = useState<Page>(() => pageFromPath(window.location.pathname))

  useEffect(() => {
    const sync = () => setPage(pageFromPath(window.location.pathname))
    window.addEventListener("popstate", sync)
    return () => window.removeEventListener("popstate", sync)
  }, [])

  return (
    <div className={page === "home" ? "site site--home" : "site"}>
      <SiteNav page={page} />
      {page === "home" ? <Landing /> : null}
      {page === "playground" ? <Gallery embedded /> : null}
      {page === "docs" ? <Docs /> : null}
      {page === "workspace" ? <Workspace onOpenLibrary={() => navigate("/playground")} /> : null}
    </div>
  )
}
