"use client"

import * as React from "react"

import { THEME_STORAGE_KEY } from "@/lib/theme"

type Theme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    return
  }
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function getServerSnapshot(): Theme {
  return "light"
}

function restoreStoredTheme() {
  try {
    if (
      window.localStorage.getItem(THEME_STORAGE_KEY) === "dark" &&
      !document.documentElement.classList.contains("dark")
    ) {
      document.documentElement.classList.add("dark")
    }
  } catch {
    return
  }
}

function subscribe(onStoreChange: () => void) {
  restoreStoredTheme()

  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  window.addEventListener("storage", onStoreChange)

  return () => {
    observer.disconnect()
    window.removeEventListener("storage", onStoreChange)
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  const setTheme = React.useCallback((next: Theme) => {
    applyTheme(next)
  }, [])

  const toggleTheme = React.useCallback(() => {
    applyTheme(getSnapshot() === "dark" ? "light" : "dark")
  }, [])

  const value = React.useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
