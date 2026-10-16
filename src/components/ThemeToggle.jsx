import { useState } from 'react'
import Icon from './Icon.jsx'
import { useI18n } from '../lib/i18n.jsx'

/** Açık/koyu mod anahtarı; tercih localStorage'da saklanır. */
export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const { t } = useI18n()
  const toggle = () => {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('infosession:theme', next ? 'dark' : 'light')
    setDark(next)
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? t.themeLight : t.themeDark}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-[#DADCE0] bg-white text-[#5F6368] transition-colors hover:bg-[#F1F3F4] hover:text-[#202124] dark:border-[#5F6368] dark:bg-[#303134] dark:text-[#E8EAED] dark:hover:bg-[#3C4043]"
    >
      <Icon name={dark ? 'light_mode' : 'dark_mode'} className="text-[22px]" />
    </button>
  )
}
