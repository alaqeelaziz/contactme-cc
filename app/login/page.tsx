'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Logo from '@/components/Logo'

type Tab = 'login' | 'register'
type AccountType = 'personal' | 'company'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<Tab>((searchParams.get('tab') as Tab) || 'login')
  const [accountType, setAccountType] = useState<AccountType>('personal')
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')

  const supabase = createClient()

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'register') setTab('register')
  }, [searchParams])

  function validateUsername(val: string) {
    if (!val) return 'اسم المستخدم مطلوب'
    if (val.length < 3) return 'يجب أن يكون 3 أحرف على الأقل'
    if (val.length > 30) return 'يجب أن يكون أقل من 30 حرفاً'
    if (!/^[a-z0-9_]+$/.test(val)) return 'يُسمح فقط بالأحرف الإنجليزية الصغيرة والأرقام والشرطة السفلية'
    return ''
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      toast.error('يرجى ملء جميع الحقول')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('أهلاً بعودتك!')
      const redirect = searchParams.get('redirect') || '/dashboard'
      router.push(redirect)
      router.refresh()
    } catch (err: any) {
      const msg = err.message?.includes('Invalid login credentials')
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        : 'حدث خطأ، يرجى المحاولة مرة أخرى'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    const uErr = validateUsername(username)
    if (uErr) { setUsernameError(uErr); return }
    if (!email || !password || !fullName) {
      toast.error('يرجى ملء جميع الحقول')
      return
    }
    if (password.length < 8) {
      toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      return
    }
    setLoading(true)
    try {
      // Check username uniqueness
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()

      if (existing) {
        toast.error('اسم المستخدم هذا مأخوذ، جرّب اسماً آخر')
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, username, account_type: accountType },
        },
      })
      if (error) throw error

      if (data.user) {
        await supabase.from('profiles').insert({
          user_id: data.user.id,
          username,
          full_name: fullName,
          account_type: accountType,
          is_pro: false,
          plan: 'free',
        })
      }

      toast.success('تم إنشاء حسابك! يرجى التحقق من بريدك الإلكتروني')
      router.push('/dashboard')
    } catch (err: any) {
      const msg = err.message?.includes('already registered')
        ? 'هذا البريد الإلكتروني مسجل بالفعل'
        : 'حدث خطأ أثناء إنشاء الحساب'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
  <Logo size="lg" showText={true} />
</Link>
          <h1 className="text-2xl font-bold">
            {tab === 'login' ? 'أهلاً بعودتك' : 'أنشئ حسابك'}
          </h1>
          <p className="text-[var(--text-muted)] mt-2 text-sm">
            {tab === 'login' ? 'سعداء برؤيتك مجدداً' : 'تواصل بسهولة، اعمل بذكاء'}
          </p>
        </div>

        <div className="card">
          {/* Tabs */}
          <div className="flex rounded-xl p-1 mb-6 gap-1" style={{ background: 'var(--bg)' }}>
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  tab === t
                    ? 'text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
                style={tab === t ? { background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' } : {}}
              >
                {t === 'login' ? 'دخول' : 'تسجيل جديد'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="input-field"
                  required
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">كلمة المرور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  required
                  dir="ltr"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2 disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    جاري الدخول...
                  </span>
                ) : 'دخول'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Account type */}
              <div>
                <label className="block text-sm font-medium mb-2">نوع الحساب</label>
                <div className="flex gap-3">
                  {(['personal', 'company'] as AccountType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAccountType(type)}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all flex flex-col items-center gap-1 ${
                        accountType === type
                          ? 'border-[#4B9EFF] text-[#4B9EFF]'
                          : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[#4B9EFF50]'
                      }`}
                      style={accountType === type ? { background: '#4B9EFF10' } : {}}
                    >
                      <span className="text-xl">{type === 'personal' ? '👤' : '🏢'}</span>
                      {type === 'personal' ? 'شخصي' : 'شركة'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {accountType === 'personal' ? 'الاسم الكامل' : 'اسم الشركة'}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={accountType === 'personal' ? 'محمد أحمد' : 'شركة النجاح'}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">اسم المستخدم</label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm select-none">
                    contactme.cc/
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                      setUsername(val)
                      setUsernameError(validateUsername(val))
                    }}
                    placeholder="username"
                    className="input-field pr-28"
                    dir="ltr"
                    required
                  />
                </div>
                {usernameError && (
                  <p className="text-red-500 text-xs mt-1">{usernameError}</p>
                )}
                {username && !usernameError && (
                  <p className="text-green-500 text-xs mt-1">✓ اسم المستخدم متاح للتحقق</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="input-field"
                  required
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">كلمة المرور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 أحرف على الأقل"
                  className="input-field"
                  required
                  dir="ltr"
                  minLength={8}
                />
              </div>

              <button type="submit" disabled={loading || !!usernameError} className="btn-primary w-full py-3 mt-2 disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    جاري إنشاء الحساب...
                  </span>
                ) : 'إنشاء الحساب'}
              </button>

              <p className="text-xs text-center text-[var(--text-muted)]">
                بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-4">
          {tab === 'login' ? (
            <>ليس لديك حساب؟{' '}
              <button onClick={() => setTab('register')} className="text-[#4B9EFF] font-medium hover:underline">
                سجّل الآن
              </button>
            </>
          ) : (
            <>لديك حساب بالفعل؟{' '}
              <button onClick={() => setTab('login')} className="text-[#4B9EFF] font-medium hover:underline">
                دخول
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#4B9EFF] border-t-transparent animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
