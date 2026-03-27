import ThemeSwitch from '@/components/settings/theme-switch'
import { setTheme } from '@/lib/set-theme'
import { Theme } from '@/schemas/settings-schema'
import { useState } from 'react'

function getStoredTheme(): Theme {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return 'system'
}

export default function NavThemeSwitch() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme)

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    setThemeState(newTheme)
  }

  return <ThemeSwitch theme={theme} onThemeChange={handleThemeChange} />
}
