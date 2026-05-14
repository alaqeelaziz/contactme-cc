import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function QRTextPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('qr_texts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data) return notFound()

  await supabase.from('qr_texts')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', params.id)

  const isOwned = !!data.owner_id
  const expiresDate = data.expires_at
    ? new Date(data.expires_at).toLocaleDateString('ar-SA')
    : null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-[var(--bg)]">
      <div className="w-full max-w-lg">
        <div className="rounded-3xl border p-8 text-center"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="text-5xl mb-6">📄</div>
          <div className="text-lg leading-relaxed whitespace-pre-wrap text-[var(--text)]">
            {data.content}
          </div>
          {expiresDate && (
            <p className="text-xs text-[var(--text-muted)] mt-6">
              ينتهي في: {expiresDate}
            </p>
          )}
        </div>

        {!isOwned && (
          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition">
              <span>تم الإنشاء بواسطة</span>
              <span className="font-bold gradient-text">contactme.cc</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}