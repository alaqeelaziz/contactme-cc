import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import PublicProfileClient from './PublicProfileClient'

interface Props {
  params: { locale: string; username: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, bio')
    .eq('username', params.username)
    .single()

  if (!profile) return { title: 'بروفايل غير موجود' }

  return {
    title: `${profile.full_name} — contactme.cc`,
    description: profile.bio || `بروفايل ${profile.full_name} على contactme.cc`,
  }
}

export default async function ProfilePage({ params }: Props) {
  const supabase = createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profile) notFound()

  const [{ data: links }, { data: services }, { count: viewCount }] = await Promise.all([
    supabase
      .from('links')
      .select('*')
      .eq('user_id', profile.user_id)
      .eq('is_active', true)
      .order('display_order'),
    supabase
      .from('services')
      .select('*')
      .eq('user_id', profile.user_id)
      .eq('is_active', true),
    supabase
      .from('profile_views')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id),
  ])

  const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://contactme.cc'}/${params.locale}/${params.username}`

  return (
    <PublicProfileClient
      profile={profile}
      links={links || []}
      services={services || []}
      profileUrl={profileUrl}
    />
  )
}
