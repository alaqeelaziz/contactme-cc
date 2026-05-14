'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { LOCALES, type Locale } from '@/lib/i18n'

const LANGUAGE_OPTIONS = [
  { locale: 'ar' as Locale, label: 'العربية', flag: '🇸🇦' },
  { locale: 'en' as Locale, label: 'English', flag: '🇺🇸' },
  { locale: 'zh' as Locale, label: '中文', flag: '🇨🇳' },
  { locale: 'fr' as Locale, label: 'Français', flag: '🇫🇷' },
  { locale: 'es' as Locale, label: 'Español', flag: '🇪🇸' },
]

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const pathSegments = pathname?.split('/').filter(Boolean) || []
  const currentLocale = LOCALES.includes(pathSegments[0] as Locale) ? pathSegments[0] as Locale : 'ar'
  const current = LANGUAGE_OPTIONS.find(o => o.locale === currentLocale) || LANGUAGE_OPTIONS[0]

  function handleSelect(locale: Locale) {
    document.cookie = `cm-lang=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
    const segments = [...pathSegments]
    if (LOCALES.includes(segments[0] as Locale)) segments[0] = locale
    else segments.unshift(locale)
    const search = searchParams?.toString()
    setOpen(false)
    router.push(`/${segments.join('/')}${search ? `?${search}` : ''}`)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm hover:bg-[var(--bg)]">
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <svg className="w-3 h-3 text-[var(--text-muted)]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-44 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl overflow-hidden">
          {LANGUAGE_OPTIONS.map(o => (
            <button key={o.locale} onClick={() => handleSelect(o.locale)}
              className={`flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-[var(--bg)] ${o.locale === currentLocale ? 'font-bold' : ''}`}>
              <span>{o.flag}</span>
              <span>{o.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}