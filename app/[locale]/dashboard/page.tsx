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

  if (!profile) {
    const cleanUsername = (user.email?.split('@')[0] ?? 'user')
      .replace(/[^a-zA-Z0-9_]/g, '')
      .trim()
      + '_' + Math.floor(Math.random() * 9000 + 1000)

    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username: cleanUsername,
        full_name: user.email?.split('@')[0]?.trim(),
        account_type: 'personal',
      })
      .select()
      .single()

    if (!newProfile) redirect(`/${locale}/login`)

    const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://contactme.cc'}/${locale}/${newProfile.username}`

    return (
      <DashboardClient
        initialProfile={newProfile}
        initialLinks={[]}
        initialServices={[]}
        viewCount={0}
        profileUrl={profileUrl}
        userId={user.id}
      />
    )
  }

  const [{ data: links }, { data: services }, { count: viewCount }] = await Promise.all([
    supabase.from('links').select('*').eq('user_id', user.id).order('display_order'),
    supabase.from('services').select('*').eq('user_id', user.id),
    supabase.from('profile_views').select('*', { count: 'exact', head: true }).eq('profile_id', profile.id),
  ])

  const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://contactme.cc'}/${locale}/${profile.username.trim()}`

  return (
    <DashboardClient
      initialProfile={profile}
      initialLinks={links || []}
      initialServices={services || []}
      viewCount={viewCount || 0}
      profileUrl={profileUrl}
      userId={user.id}
    />
  )
}
