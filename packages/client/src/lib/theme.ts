export type Theme = "light" | "oled" | "midnight"

export const THEME_STORAGE_KEY = "maily.theme"

const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "oled" || value === "midnight"

const getSystemTheme = (): Theme => {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "oled" : "light"
}

export const getStoredTheme = (): Theme | null => {
  if (typeof window === "undefined") return null
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  // Backward compatibility for previous 2-theme system
  if (stored === "dark") return "oled"
  return isTheme(stored) ? stored : null
}

export const getInitialTheme = (): Theme => getStoredTheme() ?? getSystemTheme()

export const applyTheme = (theme: Theme) => {
  if (typeof document === "undefined") return
  const root = document.documentElement
  const isNightTheme = theme !== "light"

  root.classList.toggle("dark", isNightTheme)
  root.classList.remove("theme-oled", "theme-midnight")

  if (theme === "oled") root.classList.add("theme-oled")
  if (theme === "midnight") root.classList.add("theme-midnight")

  root.style.colorScheme = isNightTheme ? "dark" : "light"
}

export const persistTheme = (theme: Theme) => {
  if (typeof window === "undefined") return
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}
