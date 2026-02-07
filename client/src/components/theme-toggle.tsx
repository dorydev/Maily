import { useEffect, useState } from "react"
import { Moon, Sun, Sunrise } from "lucide-react"

import { Button } from "@/components/ui/button"
import { applyTheme, getInitialTheme, persistTheme, type Theme } from "@/lib/theme"

const OPTIONS: Array<{ value: Theme; label: string; Icon: typeof Sun }> = [
  { value: "light", label: "Blanc", Icon: Sun },
  { value: "oled", label: "Noir", Icon: Moon },
  { value: "midnight", label: "Minuit", Icon: Sunrise },
]

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())

  useEffect(() => {
    applyTheme(theme)
    persistTheme(theme)
  }, [theme])

  return (
    <div className="fixed left-1/2 top-3 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border/80 bg-card/90 p-1 shadow-lg backdrop-blur md:left-auto md:right-4 md:top-4 md:translate-x-0">
      {OPTIONS.map(({ value, label, Icon }) => {
        const isActive = theme === value
        return (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={isActive ? "secondary" : "ghost"}
            className="h-8 rounded-full px-3 text-xs"
            onClick={() => setTheme(value)}
            aria-pressed={isActive}
            aria-label={`Activer le theme ${label}`}
            title={label}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </Button>
        )
      })}
    </div>
  )
}
