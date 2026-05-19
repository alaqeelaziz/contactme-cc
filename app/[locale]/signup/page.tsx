'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'ar'
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSignup() {
    if (!email || !password || !fullName) {
      setError('يرجى تعبئة جميع الحقول')
      return
    }
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/${locale}/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/${locale}/dashboard`,
      },
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <div className="w-full max-w-md p-8 rounded-3xl text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #4B9EFF20, #8B5CF620)' }}>
            📧
          </div>
          <h2 className="text-xl font-extrabold mb-2">تحقق من بريدك الإلكتروني</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            أرسلنا رابط تأكيد إلى <strong>{email}</strong> — افتح الرابط لتفعيل حسابك.
          </p>
          <Link href={`/${locale}/login`} className="btn-primary px-6 py-2.5 text-sm">
            الذهاب لتسجيل الدخول
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' }}>
              <span className="text-white text-sm font-black">Cm</span>
            </div>
            <span className="text-xl font-black">contactme.cc</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>أنشئ بروفايلك المجاني الآن ✨</p>
        </div>

        <div className="p-8 rounded-3xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h1 className="text-xl font-extrabold mb-6 text-center">إنشاء حساب</h1>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm text-red-500 bg-red-50 border border-red-100">
              {error}
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-semibold text-sm transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-60 mb-4"
            style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? 'جاري التحويل...' : 'التسجيل بـ Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>أو بالإيميل</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Form */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="الاسم الكامل"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="input"
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input"
            />
            <input
              type="password"
              placeholder="كلمة المرور (6 أحرف على الأقل)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input"
              onKeyDown={e => e.key === 'Enter' && handleSignup()}
            />
            <button
              onClick={handleSignup}
              disabled={loading}
              className="btn-primary py-3"
            >
              {loading ? '...' : 'إنشاء حساب'}
            </button>
          </div>

          <p className="text-center text-sm mt-5" style={{ color: 'var(--text-muted)' }}>
            لديك حساب؟{' '}
            <Link href={`/${locale}/login`} className="font-semibold hover:underline" style={{ color: '#4B9EFF' }}>
              سجّل دخولك
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
