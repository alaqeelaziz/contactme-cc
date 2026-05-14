import { getRequestConfig } from 'next-intl/server'
import { getMessages, isLocale, defaultLocale } from './i18n'

export default getRequestConfig(async ({ locale }) => {
  const validLocale = isLocale(locale) ? locale : defaultLocale
  return {
    locale: validLocale,
    messages: await getMessages(validLocale)
  }
})