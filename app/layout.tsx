import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Cairo } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ThemeScript from '@/components/ThemeScript'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-primary',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'contactme.cc — تواصل بسهولة، اعمل بذكاء',
  description: 'أنشئ بروفايلك الرقمي الاحترافي في دقائق',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://contactme.cc'),
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieLocale = cookies().get('cm-lang')?.value
  const locale = ['ar', 'en', 'zh', 'fr', 'es'].includes(cookieLocale || '') ? cookieLocale! : 'ar'

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={cairo.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased min-h-screen bg-[var(--bg)] text-[var(--text)]">
        {children}
        <Toaster position="top-center" toastOptions={{ duration: 3000, style: { fontFamily: 'var(--font-primary)', borderRadius: '12px' } }} />
      </body>
    </html>
  )
}