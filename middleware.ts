import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPPORTED_LOCALES = ['ar', 'en', 'zh', 'fr', 'es']
const RESERVED_PATHS = ['api', 'dashboard', 'login', 'admin']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const pathSegments = request.nextUrl.pathname.split('/').filter(Boolean)
  const firstSegment = pathSegments[0]

  // Determine locale from path or cookie
  let currentLocale: string | null = null
  let isLocaleInPath = false

  if (SUPPORTED_LOCALES.includes(firstSegment)) {
    currentLocale = firstSegment
    isLocaleInPath = true
  } else {
    currentLocale = request.cookies.get('cm-lang')?.value || 'ar'
  }

  // Set locale cookie if not already set or if user navigates with new locale
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

  // Root path - redirect to locale
  if (pathname === '/') {
    const redirectLocale = SUPPORTED_LOCALES.includes(currentLocale) ? currentLocale : 'ar'
    const url = request.nextUrl.clone()
    url.pathname = `/${redirectLocale}`
    return NextResponse.redirect(url)
  }

  // If user is not authenticated and trying to access dashboard - redirect to login
  if (pathname.includes('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    const localePrefix = isLocaleInPath ? `/${currentLocale}` : ''
    url.pathname = `${localePrefix}/login`
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // If user is authenticated and trying to access login - redirect to dashboard
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
