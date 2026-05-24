import type { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'

const SUPPORTED_LOCALES = ['ar', 'en', 'zh', 'fr', 'es']

interface Props {
  children: ReactNode
  params: { locale: string }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params

  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  let messages
  try {
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch {
    messages = (await import('../../messages/ar.json')).default
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}