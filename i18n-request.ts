import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  const safeLocale = ['ar', 'en', 'zh', 'fr', 'es'].includes(locale as string) ? locale as string : 'ar'
  let messages
  switch (safeLocale) {
    case 'en': messages = (await import('./messages/en.json')).default; break
    case 'zh': messages = (await import('./messages/zh.json')).default; break
    case 'fr': messages = (await import('./messages/fr.json')).default; break
    case 'es': messages = (await import('./messages/es.json')).default; break
    default:   messages = (await import('./messages/ar.json')).default
  }
  return { locale: safeLocale, messages }
})
