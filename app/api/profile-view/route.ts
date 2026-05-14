import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { profile_id } = await req.json()
    if (!profile_id) {
      return NextResponse.json({ error: 'profile_id مطلوب' }, { status: 400 })
    }

    const supabase = createClient()
    await supabase.from('profile_views').insert({ profile_id })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
