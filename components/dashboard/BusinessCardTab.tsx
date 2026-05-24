'use client'

import { useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import BusinessCardPreview, { type BusinessCardPreviewHandle } from '@/components/dashboard/BusinessCardPreview'
import type { Profile } from '@/lib/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Props {
  profile: Profile
  profileUrl: string
}

type Theme = 'dark' | 'light' | 'gradient' | 'minimal'

const THEMES: { id: Theme; label: string; emoji: string }[] = [
  { id: 'dark',     label: 'داكن',  emoji: '🌙' },
  { id: 'light',    label: 'فاتح',  emoji: '☀️' },
  { id: 'gradient', label: 'متدرج', emoji: '🌈' },
  { id: 'minimal',  label: 'بسيط',  emoji: '⬜' },
]

const COLOR_PAIRS: { primary: string; secondary: string; name: string }[] = [
  { primary: '#4B9EFF', secondary: '#8B5CF6', name: 'اوشن' },
  { primary: '#6366F1', secondary: '#A855F7', name: 'برايم' },
  { primary: '#10B981', secondary: '#3B82F6', name: 'نعناع' },
  { primary: '#F59E0B', secondary: '#EF4444', name: 'غروب' },
  { primary: '#EC4899', secondary: '#8B5CF6', name: 'زهري' },
  { primary: '#14B8A6', secondary: '#6366F1', name: 'تيل' },
  { primary: '#F97316', secondary: '#EAB308', name: 'ذهبي' },
  { primary: '#1E293B', secondary: '#475569', name: 'رمادي' },
]

export default function BusinessCardTab({ profile, profileUrl }: Props) {
  const [theme, setTheme]     = useState<Theme>((profile as any).card_theme ?? 'dark')
  const [colorIdx, setColorIdx] = useState<number>((profile as any).card_color_idx ?? 0)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [loading, setLoading] = useState<'png' | 'pdf' | 'print' | null>(null)
  const cardRef = useRef<BusinessCardPreviewHandle>(null)

  const colors = COLOR_PAIRS[colorIdx]

  async function handleSave() {
    setSaving(true)
    await supabase.from('profiles').update({ card_theme: theme, card_color_idx: colorIdx }).eq('id', profile.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handlePng() {
    setLoading('png')
    await cardRef.current?.downloadPng()
    setLoading(null)
  }

  async function handlePdf() {
    setLoading('pdf')
    await cardRef.current?.downloadPdf()
    setLoading(null)
  }

  function handlePrint() {
    setLoading('print')
    cardRef.current?.print()
    setLoading(null)
  }

  return (
    <div className="space-y-6">

      {/* Preview */}
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-3 font-medium">معاينة البطاقة</p>
        <BusinessCardPreview
          ref={cardRef}
          name={profile.full_name ?? ''}
          jobTitle={(profile as any).job_title ?? ''}
          bio={profile.bio ?? ''}
          phone={(profile as any).phone ?? (profile as any).whatsapp ?? ''}
          email={(profile as any).email ?? ''}
          logoUrl={profile.avatar_url ?? null}
          qrValue={profileUrl}
          theme={theme}
          primaryColor={colors.primary}
          secondaryColor={colors.secondary}
          flippable={true}
        />
      </div>

      {/* Theme selector */}
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">السمة</p>
        <div className="grid grid-cols-4 gap-2">
          {THEMES.map((t) => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-medium transition-all border ${
                theme === t.id ? 'border-[#6366F1] bg-[#6366F110] text-[#6366F1]' : 'border-[var(--border)] text-[var(--text-muted)]'
              }`}>
              <span className="text-base">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color selector */}
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">الألوان</p>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_PAIRS.map((pair, idx) => (
            <button key={idx} onClick={() => setColorIdx(idx)}
              className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-medium transition-all border ${
                colorIdx === idx ? 'border-[#6366F1] scale-105' : 'border-[var(--border)]'
              }`}>
              <div className="w-8 h-4 rounded-full"
                style={{ background: `linear-gradient(90deg, ${pair.primary}, ${pair.secondary})` }} />
              <span className="text-[10px] text-[var(--text-muted)]">{pair.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <button onClick={handleSave} disabled={saving}
        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
        style={{ background: saved ? '#10B981' : 'linear-gradient(135deg, #6366F1, #A855F7)' }}>
        {saving ? 'جاري الحفظ...' : saved ? '✓ تم الحفظ' : 'حفظ التصميم'}
      </button>

      {/* Download / Print */}
      <div className="grid grid-cols-3 gap-2">
        <button onClick={handlePdf} disabled={loading === 'pdf'}
          className="py-2.5 rounded-xl text-xs font-semibold border border-[var(--border)] hover:border-[#6366F1] transition-all disabled:opacity-60 flex items-center justify-center gap-1">
          {loading === 'pdf' ? '...' : '📄 PDF'}
        </button>
        <button onClick={handlePng} disabled={loading === 'png'}
          className="py-2.5 rounded-xl text-xs font-semibold border border-[var(--border)] hover:border-[#6366F1] transition-all disabled:opacity-60 flex items-center justify-center gap-1">
          {loading === 'png' ? '...' : '🖼 PNG'}
        </button>
        <button onClick={handlePrint} disabled={loading === 'print'}
          className="py-2.5 rounded-xl text-xs font-semibold border border-[var(--border)] hover:border-[#6366F1] transition-all disabled:opacity-60 flex items-center justify-center gap-1">
          {loading === 'print' ? '...' : '🖨 طباعة'}
        </button>
      </div>

    </div>
  )
}