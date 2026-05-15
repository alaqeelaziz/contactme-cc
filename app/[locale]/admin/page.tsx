import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminClient from './AdminClient'

const ADMIN_EMAIL = 'aalaqeel03@gmail.com'

interface Props { params: { locale: string } }

export default async function AdminPage({ params }: Props) {
  const { locale } = params
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect(`/${locale}/login`)

  const [
    { data: profiles, count: totalUsers },
    { data: proUsers },
    { data: qrTexts },
    { count: totalViews },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact' }).order('created_at', { ascending: false }),
    supabase.from('profiles').select('*').eq('is_pro', true),
    supabase.from('qr_texts').select('*').order('created_at', { ascending: false }),
    supabase.from('profile_views').select('*', { count: 'exact', head: true }),
  ])

  return (
    <AdminClient
      profiles={profiles || []}
      totalUsers={totalUsers || 0}
      proUsers={proUsers?.length || 0}
      qrTexts={qrTexts || []}
      totalViews={totalViews || 0}
    />
  )
}