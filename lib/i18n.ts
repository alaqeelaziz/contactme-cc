export const LOCALES = ['ar', 'en', 'zh', 'fr', 'es'] as const
export type Locale = (typeof LOCALES)[number]
export const defaultLocale: Locale = 'ar'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && LOCALES.includes(value as Locale)
}

export async function getMessages(locale: Locale) {
  return (await import(`../messages/${locale}.json`)).default
}
