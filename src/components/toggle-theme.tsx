"use client"

import { useCallback, useEffect, useState } from "react"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ToggleThemeButton() {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      switch (prevTheme) {
        case "system":
          return "light"
        case "light":
          return "dark"
        default:
          return "system"
      }
    })
  }, [setTheme])

  if (!isMounted) {
    return (
      <Button size="icon" variant="ghost">
        <MonitorIcon />
      </Button>
    )
  }

  const Icon =
    theme === "system" ? MonitorIcon : theme === "light" ? SunIcon : MoonIcon

  return (
    <Button size="icon" variant="ghost" onClick={toggleTheme}>
      <Icon />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
