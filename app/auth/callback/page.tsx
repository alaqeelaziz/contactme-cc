'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = searchParams.get('locale') || 'ar'

  useEffect(() => {
    const supabase = createClient()

    // الـ browser client يتعامل مع الـ code تلقائياً من الـ URL
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace(`/${locale}/dashboard`)
      } else {
        // انتظر ثانية وحاول مرة ثانية (الـ PKCE يحتاج وقت)
        setTimeout(async () => {
          const { data } = await supabase.auth.getSession()
          if (data.session) {
            router.replace(`/${locale}/dashboard`)
          } else {
            router.replace(`/${locale}/login?error=auth_failed`)
          }
        }, 1000)
      }
    })
  }, [locale, router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #6366F1, #A855F7)' }}>
          <span className="text-white font-black text-sm">Cm</span>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <div className="w-4 h-4 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            جاري تسجيل الدخول...
          </p>
        </div>
      </div>
    </div>
  )
}
