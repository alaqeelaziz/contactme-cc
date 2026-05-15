import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

interface Props {
  params: { locale: string }
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = params
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect(`/${locale}/login`)

  const [{ data: links }, { data: services }, { count: viewCount }] = await Promise.all([
    supabase.from('links').select('*').eq('user_id', user.id).order('display_order'),
    supabase.from('services').select('*').eq('user_id', user.id),
    supabase.from('profile_views').select('*', { count: 'exact', head: true }).eq('profile_id', profile.id),
  ])

  const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://contactme.cc'}/${profile.username}`

  return (
    <DashboardClient
      initialProfile={profile}
      initialLinks={links || []}
      initialServices={services || []}
      viewCount={viewCount || 0}
      profileUrl={profileUrl}
    />
  )
}