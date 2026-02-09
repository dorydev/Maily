import { useEffect, useRef, useState } from "react"
import { ChevronRight, Moon, Palette, Sun, Sunrise } from "lucide-react"

import { Button } from "../components/ui/button"
import { applyTheme, getInitialTheme, persistTheme, type Theme } from "../lib/theme"

const OPTIONS: Array<{ value: Theme; label: string; Icon: typeof Sun }> = [
  { value: "light", label: "Blanc", Icon: Sun },
  { value: "oled", label: "Noir", Icon: Moon },
  { value: "midnight", label: "Minuit", Icon: Sunrise },
]

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())
  const [isOpen, setIsOpen] = useState(true)
  const hideTimerRef = useRef<number | null>(null)

  const clearHideTimer = () => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }

  const scheduleAutoHide = () => {
    clearHideTimer()
    hideTimerRef.current = window.setTimeout(() => {
      setIsOpen(false)
    }, 3000)
  }

  useEffect(() => {
    applyTheme(theme)
    persistTheme(theme)
  }, [theme])

  useEffect(() => {
    if (!isOpen) {
      clearHideTimer()
      return
    }

    clearHideTimer()
    hideTimerRef.current = window.setTimeout(() => {
      setIsOpen(false)
    }, 3000)
    return clearHideTimer
  }, [isOpen])

  const handlePanelInteraction = () => {
    if (!isOpen) return
    scheduleAutoHide()
  }

  const handleTogglePanel = () => {
    if (isOpen) {
      setIsOpen(false)
      clearHideTimer()
      return
    }

    setIsOpen(true)
  }

  return (
    <div className="fixed bottom-3 right-2 z-50 md:bottom-4 md:right-4">
      <div
        className={`absolute right-10 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full border border-border/80 bg-card/90 p-1 shadow-lg backdrop-blur transition-all duration-300 ${
          isOpen ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-8 opacity-0"
        }`}
        onMouseEnter={handlePanelInteraction}
        onMouseMove={handlePanelInteraction}
        onFocus={handlePanelInteraction}
        onClick={handlePanelInteraction}
        onKeyDown={handlePanelInteraction}
      >
        {OPTIONS.map(({ value, label, Icon }) => {
          const isActive = theme === value
          return (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={isActive ? "secondary" : "ghost"}
              className="h-8 rounded-full px-3 text-xs"
              onClick={() => {
                setTheme(value)
                scheduleAutoHide()
              }}
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

      <button
        type="button"
        onClick={handleTogglePanel}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-card/90 text-muted-foreground shadow-md backdrop-blur transition-colors hover:bg-muted hover:text-foreground"
        aria-label={isOpen ? "Replier le panneau des themes" : "Afficher le panneau des themes"}
        title={isOpen ? "Replier" : "Themes"}
      >
        {isOpen ? <ChevronRight className="h-4 w-4" /> : <Palette className="h-4 w-4" />}
      </button>
    </div>
  )
}
