import { Archive, House, Settings } from "lucide-react"
import type { ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"

type NavItem = {
  to: string
  label: string
  Icon: typeof House
}

const primaryNav: NavItem[] = [
  { to: "/home", label: "Homepage", Icon: House },
  { to: "/archives", label: "Archives", Icon: Archive },
]

const secondaryNav: NavItem[] = [
  { to: "/smtp-config", label: "Settings", Icon: Settings },
]

type WorkspaceShellProps = {
  children?: ReactNode
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  const { pathname } = useLocation()

  const isActive = (to: string) => pathname === to

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <header className="flex items-center justify-between gap-4 border-b px-6 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold leading-tight">Maily</p>
            <p className="truncate text-sm text-muted-foreground leading-tight">Bulk Sender</p>
          </div>
        </div>

        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
          title="John Doe"
          aria-label="John Doe"
        >
          JD
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[84px] shrink-0 flex-col items-center border-r py-6">
          <nav className="flex w-full flex-col items-center gap-3">
            {primaryNav.map(({ to, label, Icon }) => (
              <Link
                key={label}
                to={to}
                className={`inline-flex size-11 items-center justify-center rounded-xl border transition-colors ${
                  isActive(to)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
                }`}
                title={label}
                aria-label={label}
              >
                <Icon className="size-5" />
              </Link>
            ))}
          </nav>

          <nav className="mt-auto flex w-full flex-col items-center gap-3">
            {secondaryNav.map(({ to, label, Icon }) => (
              <Link
                key={label}
                to={to}
                className={`inline-flex size-11 items-center justify-center rounded-xl border transition-colors ${
                  isActive(to)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
                }`}
                title={label}
                aria-label={label}
              >
                <Icon className="size-5" />
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
