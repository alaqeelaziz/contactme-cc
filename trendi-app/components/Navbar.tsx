'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ThemeToggle from './ThemeToggle'
import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import type { User } from '@supabase/supabase-js'

type Locale = 'ar' | 'en' | 'zh' | 'fr' | 'es'

const i18n: Record<Locale, { dashboard: string; login: string; signup: string; logout: string }> = {
  ar: { dashboard: 'لوحة التحكم', login: 'دخول', signup: 'ابدأ مجاناً', logout: 'خروج' },
  en: { dashboard: 'Dashboard', login: 'Login', signup: 'Get started', logout: 'Logout' },
  zh: { dashboard: '控制面板', login: '登录', signup: '免费开始', logout: '退出' },
  fr: { dashboard: 'Tableau de bord', login: 'Connexion', signup: 'Commencer', logout: 'Déconnexion' },
  es: { dashboard: 'Panel', login: 'Entrar', signup: 'Empezar gratis', logout: 'Salir' },
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const locale = (['ar','en','zh','fr','es'].find(l => pathname?.startsWith(`/${l}`)) || 'ar') as Locale
  const t = i18n[locale]
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="sticky top-0 z-50 border-b backdrop-blur-md bg-[var(--bg)]/90" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <Logo size="md" showText={true} />
        </Link>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/dashboard" className="px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--surface)]">
                {t.dashboard}
              </Link>
              <button onClick={handleSignOut} className="px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--surface)] text-[var(--text-muted)]">
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--surface)]">
                {t.login}
              </Link>
              <Link href="/login?tab=register" className="btn-primary text-sm py-2 px-5">
                {t.signup}
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-xl hover:bg-[var(--surface)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-2" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
          {user ? (
            <>
              <Link href="/dashboard" className="px-4 py-2 rounded-xl hover:bg-[var(--surface)] font-medium" onClick={() => setMenuOpen(false)}>
                {t.dashboard}
              </Link>
              <button onClick={handleSignOut} className="px-4 py-2 rounded-xl hover:bg-[var(--surface)] text-right text-[var(--text-muted)]">
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 rounded-xl hover:bg-[var(--surface)] font-medium" onClick={() => setMenuOpen(false)}>
                {t.login}
              </Link>
              <Link href="/login?tab=register" className="btn-primary text-sm text-center" onClick={() => setMenuOpen(false)}>
                {t.signup}
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}