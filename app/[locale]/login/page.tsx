'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string || 'ar'
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(`/${locale}/dashboard`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md p-8 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h1 className="text-2xl font-bold mb-6 text-center">{t('login')}</h1>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm text-red-500 bg-red-50 dark:bg-red-950">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder={t('email')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder={t('password')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary py-3"
          >
            {loading ? '...' : t('login')}
          </button>
        </div>

        <p className="text-center text-sm mt-6 text-[var(--text-muted)]">
          {t('noAccount')}{' '}
          <Link href={`/${locale}/signup`} className="text-[#4B9EFF] hover:underline">
            {t('signup')}
          </Link>
        </p>
      </div>
    </div>
  )
}