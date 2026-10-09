export const githubUrl = "https://github.com/k-aksha/dimond"

export type Page = "home" | "playground" | "docs" | "workspace"

export function pageFromPath(path: string): Page {
  if (path.startsWith("/playground")) return "playground"
  if (path.startsWith("/docs")) return "docs"
  if (path.startsWith("/workspace")) return "workspace"
  return "home"
}

export function navigate(path: string) {
  window.history.pushState({}, "", path)
  window.dispatchEvent(new PopStateEvent("popstate"))
}
