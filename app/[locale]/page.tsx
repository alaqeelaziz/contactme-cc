import { getMessages, isLocale, defaultLocale } from '@/lib/i18n'
import HomePageClient from './HomePageClient'

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale
  const messages = await getMessages(locale)
  return <HomePageClient messages={messages} locale={locale} />
}