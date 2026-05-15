import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPPORTED_LOCALES = ['ar', 'en', 'zh', 'fr', 'es']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const pathSegments = request.nextUrl.pathname.split('/').filter(Boolean)
  const firstSegment = pathSegments[0]

  let currentLocale: string | null = null
  let isLocaleInPath = false

  if (SUPPORTED_LOCALES.includes(firstSegment)) {
    currentLocale = firstSegment
    isLocaleInPath = true
  } else {
    currentLocale = request.cookies.get('cm-lang')?.value || 'ar'
  }

  if (isLocaleInPath && request.cookies.get('cm-lang')?.value !== currentLocale) {
    response.cookies.set('cm-lang', currentLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Root → redirect to locale
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = `/${currentLocale}`
    return NextResponse.redirect(url)
  }

  // ✅ الإصلاح: /dashboard أو /login بدون locale → أضف الـ locale
  if (!isLocaleInPath && (pathname.startsWith('/dashboard') || pathname.startsWith('/login'))) {
    const url = request.nextUrl.clone()
    url.pathname = `/${currentLocale}${pathname}`
    return NextResponse.redirect(url)
  }

  // Not authenticated → redirect to login
  if (pathname.includes('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    const localePrefix = isLocaleInPath ? `/${currentLocale}` : ''
    url.pathname = `${localePrefix}/login`
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Authenticated + on login → redirect to dashboard
  if (pathname.includes('/login') && user) {
    const url = request.nextUrl.clone()
    const localePrefix = isLocaleInPath ? `/${currentLocale}` : ''
    url.pathname = `${localePrefix}/dashboard`
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next).*)'],
}