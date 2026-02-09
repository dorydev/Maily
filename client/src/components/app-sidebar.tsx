import { Archive, House, Settings, LogOut } from "lucide-react"
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
  { to : "/login", label : "Log Out", Icon : LogOut},
  { to: "/smtp-config", label: "Settings", Icon: Settings },
]

export function AppSidebar(){
  
  const { pathname } = useLocation()
  const isActive = (to: string) => pathname === to


  return (
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
  )
}
