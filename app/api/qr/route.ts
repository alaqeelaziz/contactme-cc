import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { content } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: 'المحتوى مطلوب' }, { status: 400 })
    }

    const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiZHl5anJ1anVoa2hwZGVrb3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMTc0MDYsImV4cCI6MjA5Mzc5MzQwNn0.KQ9ilob4dm9tfRvPpjDBLh3EvQBkX9oOPhqf4zW0BH8'
)

    const id = Math.random().toString(36).slice(2, 12)
    const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    const { error } = await supabase.from('qr_texts').insert({
      id,
      content: content.trim(),
      owner_id: null,
      expires_at,
    })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://contactme.cc'
    const url = `${baseUrl}/qr/${id}`
    return NextResponse.json({ id, url })

  } catch (err) {
    console.error('QR API error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}