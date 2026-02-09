import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Button } from "./ui/button"

export function Topbar() {
  return (
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
          </div>
        </div>

          <Popover>
          <PopoverTrigger asChild>
            <Button
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
            title="user-profile"
            aria-label="user-profile"
            >
              JD
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-2">
            <div className="flex items-center gap-3 p-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                JD
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-tight">John Doe</p>
                <p className="truncate text-xs text-muted-foreground">john.doe@example.com</p>
              </div>
            </div>

            <div className="my-2 h-px bg-border" />

            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                className="h-9 w-full justify-start px-2"
              >
                Manage accounts
              </Button>
              <Button
                variant="ghost"
                className="h-9 w-full justify-start px-2"
              >
                User Profile Settings
              </Button>
            </div>

            <div className="my-2 h-px bg-border" />

            <Button
              variant="ghost"
              className="h-9 w-full justify-start px-2 text-muted-foreground"
            >
              Add account
            </Button>
          </PopoverContent>
        </Popover>

      </header>
  )
}
