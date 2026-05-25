'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import BusinessCardPreview from '@/components/BusinessCardPreview'
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

const COLOR_PAIRS = [
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
  const [theme, setTheme]       = useState<Theme>((profile as any).card_theme ?? 'dark')
  const [colorIdx, setColorIdx] = useState<number>((profile as any).card_color_idx ?? 0)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [loading, setLoading]   = useState<'png' | 'pdf' | null>(null)

  const colors = COLOR_PAIRS[colorIdx]

  // ─── Draw single card face on provided ctx at offset X ───────────────────
  async function drawFront(
    ctx: CanvasRenderingContext2D,
    W: number, H: number,
    offsetX: number
  ) {
    function rr(x: number, y: number, w: number, h: number, r: number) {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.arcTo(x + w, y, x + w, y + h, r)
      ctx.arcTo(x + w, y + h, x, y + h, r)
      ctx.arcTo(x, y + h, x, y, r)
      ctx.arcTo(x, y, x + w, y, r)
      ctx.closePath()
    }

    const isDark     = theme === 'dark' || theme === 'gradient'
    const textColor  = isDark ? '#FFFFFF' : '#111827'
    const subtextClr = theme === 'dark' ? '#93C5FD' : theme === 'gradient' ? 'rgba(255,255,255,0.85)' : colors.primary
    const metaColor  = isDark ? 'rgba(255,255,255,0.65)' : '#6B7280'
    const dotColor   = theme === 'gradient' ? 'rgba(255,255,255,0.9)' : theme === 'dark' ? '#FFFFFF' : colors.primary
    const name       = profile.full_name ?? ''
    const jobTitle   = (profile as any).job_title ?? ''
    const phone      = (profile as any).whatsapp ?? (profile as any).phone ?? ''
    const email      = (profile as any).email ?? ''
    const initial    = name ? name.charAt(0) : 'أ'

    // Background
    ctx.save()
    rr(offsetX, 0, W, H, 16)
    ctx.clip()
    if (theme === 'gradient') {
      const g = ctx.createLinearGradient(offsetX, 0, offsetX + W, H)
      g.addColorStop(0, colors.primary); g.addColorStop(1, colors.secondary)
      ctx.fillStyle = g
    } else if (theme === 'dark') {
      const g = ctx.createLinearGradient(offsetX, 0, offsetX + W, H)
      g.addColorStop(0, '#1A1A3E'); g.addColorStop(1, '#2d2d5e')
      ctx.fillStyle = g
    } else {
      ctx.fillStyle = theme === 'light' ? '#FFFFFF' : '#F8FAFC'
    }
    ctx.fillRect(offsetX, 0, W, H)
    if (!isDark) {
      ctx.strokeStyle = theme === 'light' ? '#E5E7EB' : '#E2E8F0'
      ctx.lineWidth = 1; rr(offsetX, 0, W, H, 16); ctx.stroke()
    }
    ctx.restore()

    // Avatar (top-right)
    const AX = offsetX + W - 64, AY = 20, AS = 44
    const logoUrl = profile.avatar_url ?? null
    if (logoUrl) {
      ctx.save()
      rr(AX, AY, AS, AS, 10); ctx.clip()
      const img = new Image(); img.crossOrigin = 'anonymous'
      await new Promise<void>(res => { img.onload = () => res(); img.onerror = () => res(); img.src = logoUrl })
      ctx.drawImage(img, AX, AY, AS, AS)
      ctx.restore()
    } else {
      rr(AX, AY, AS, AS, 10)
      if (theme === 'gradient') {
        ctx.fillStyle = 'rgba(255,255,255,0.25)'
      } else {
        const ag = ctx.createLinearGradient(AX, AY, AX + AS, AY + AS)
        ag.addColorStop(0, colors.primary); ag.addColorStop(1, colors.secondary)
        ctx.fillStyle = ag
      }
      ctx.fill()
      ctx.fillStyle = '#FFF'
      ctx.font = 'bold 18px Arial'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(initial, AX + AS / 2, AY + AS / 2)
    }

    // Name + Job
    ctx.textAlign = 'right'; ctx.textBaseline = 'top'
    ctx.fillStyle = textColor
    ctx.font = 'bold 14px Arial'
    ctx.fillText(name || 'اسمك هنا', AX - 12, AY + 4)
    ctx.fillStyle = subtextClr
    ctx.font = '12px Arial'
    ctx.fillText(jobTitle || '', AX - 12, AY + 23)

    // Logo mark (top-left)
    const LMX = offsetX + 20, LMY = AY
    rr(LMX - 5, LMY - 5, 42, 42, 10)
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.12)' : `${colors.primary}22`
    ctx.fill()
    for (let i = 0; i < 9; i++) {
      if (![0,1,3,4,7,8].includes(i)) continue
      rr(LMX + (i % 3) * 10.5, LMY + Math.floor(i / 3) * 10.5, 9, 9, 2)
      ctx.fillStyle = dotColor; ctx.fill()
    }

    // Divider
    const divY = H / 2 + 10
    ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = textColor
    ctx.fillRect(offsetX + 20, divY, W - 40, 1); ctx.restore()

    // Contact info
    ctx.textAlign = 'left'; ctx.textBaseline = 'top'
    ctx.fillStyle = metaColor; ctx.font = '11px Arial'
    let cy = divY + 14
    if (phone)  { ctx.fillText('📞  ' + phone,  offsetX + 20, cy); cy += 20 }
    if (email)  { ctx.fillText('✉  '  + email,  offsetX + 20, cy); cy += 20 }
    ctx.fillText('🌐  ' + profileUrl, offsetX + 20, cy)
  }

  async function drawBack(
    ctx: CanvasRenderingContext2D,
    W: number, H: number,
    offsetX: number
  ) {
    function rr(x: number, y: number, w: number, h: number, r: number) {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.arcTo(x + w, y, x + w, y + h, r)
      ctx.arcTo(x + w, y + h, x, y + h, r)
      ctx.arcTo(x, y + h, x, y, r)
      ctx.arcTo(x, y, x + w, y, r)
      ctx.closePath()
    }

    const isDark = theme === 'dark' || theme === 'gradient'
    const metaColor = isDark ? 'rgba(255,255,255,0.65)' : '#6B7280'

    // Background
    ctx.save()
    rr(offsetX, 0, W, H, 16); ctx.clip()
    if (theme === 'gradient') {
      const g = ctx.createLinearGradient(offsetX, 0, offsetX + W, H)
      g.addColorStop(0, colors.primary); g.addColorStop(1, colors.secondary)
      ctx.fillStyle = g
    } else if (theme === 'dark') {
      const g = ctx.createLinearGradient(offsetX, 0, offsetX + W, H)
      g.addColorStop(0, '#1A1A3E'); g.addColorStop(1, '#2d2d5e')
      ctx.fillStyle = g
    } else {
      ctx.fillStyle = theme === 'light' ? '#FFFFFF' : '#F8FAFC'
    }
    ctx.fillRect(offsetX, 0, W, H)
    ctx.restore()

    // QR code using qrcode library
    try {
      const QRCode = (await import('qrcode')).default
      const qrCanvas = document.createElement('canvas')
      await QRCode.toCanvas(qrCanvas, profileUrl || 'https://contactme.cc', {
        width: 120,
        margin: 1,
        color: { dark: colors.primary, light: '#FFFFFF' },
      })
      // White background box
      const qrSize = 120, padding = 12
      const qrX = offsetX + (W - qrSize - padding * 2) / 2
      const qrY = (H - qrSize - padding * 2) / 2 - 10
      ctx.fillStyle = '#FFFFFF'
      const bp = padding
      rr(qrX - bp, qrY - bp, qrSize + bp * 2, qrSize + bp * 2, 12)
      ctx.fill()
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize)

      // URL text
      ctx.textAlign = 'center'; ctx.textBaseline = 'top'
      ctx.fillStyle = metaColor; ctx.font = '10px Arial'
      ctx.fillText(profileUrl, offsetX + W / 2, qrY + qrSize + padding * 2 + 8)
    } catch (e) {
      console.error('QR generation failed', e)
    }
  }

  // ─── Generate combined canvas (front + back side by side) ────────────────
  async function generateCanvas(): Promise<HTMLCanvasElement> {
    const PX = 3
    const CW = 480, CH = 274, GAP = 20
    const totalW = CW * 2 + GAP

    const canvas = document.createElement('canvas')
    canvas.width  = totalW * PX
    canvas.height = CH * PX
    const ctx = canvas.getContext('2d')!
    ctx.scale(PX, PX)

    await drawFront(ctx, CW, CH, 0)
    await drawBack(ctx, CW, CH, CW + GAP)

    return canvas
  }

  async function handlePng() {
    setLoading('png')
    try {
      const canvas = await generateCanvas()
      canvas.toBlob(blob => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.download = 'business-card.png'
        a.href = url; a.click()
        URL.revokeObjectURL(url)
      }, 'image/png')
    } finally { setLoading(null) }
  }

  async function handlePdf() {
    setLoading('pdf')
    try {
      const canvas = await generateCanvas()
      const { jsPDF } = await import('jspdf')
      // A6 landscape ≈ 148 x 105 mm — تناسب وجهي البطاقة جنباً لجنب
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [180, 54] })
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 180, 54)
      pdf.save('business-card.pdf')
    } finally { setLoading(null) }
  }

  async function handleSave() {
    setSaving(true)
    await supabase.from('profiles')
      .update({ card_theme: theme, card_color_idx: colorIdx })
      .eq('id', profile.id)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">

      {/* Preview */}
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-3 font-medium">معاينة البطاقة</p>
        <BusinessCardPreview
          name={profile.full_name ?? ''}
          jobTitle={(profile as any).job_title ?? ''}
          bio={profile.bio ?? ''}
          phone={(profile as any).whatsapp ?? (profile as any).phone ?? ''}
          email={(profile as any).email ?? ''}
          logoUrl={profile.avatar_url ?? null}
          qrValue={profileUrl}
          theme={theme}
          primaryColor={colors.primary}
          secondaryColor={colors.secondary}
          flippable={true}
        />
      </div>

      {/* Theme */}
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">السمة</p>
        <div className="grid grid-cols-4 gap-2">
          {THEMES.map(t => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-medium transition-all border ${
                theme === t.id
                  ? 'border-[#6366F1] bg-[#6366F110] text-[#6366F1]'
                  : 'border-[var(--border)] text-[var(--text-muted)]'
              }`}>
              <span className="text-base">{t.emoji}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">الألوان</p>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_PAIRS.map((pair, idx) => (
            <button key={idx} onClick={() => setColorIdx(idx)}
              className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl transition-all border ${
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

      {/* Download buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button onClick={handlePdf} disabled={!!loading}
          className="py-3 rounded-xl text-sm font-semibold border border-[var(--border)] hover:border-[#6366F1] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading === 'pdf'
            ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            : '📄'} تحميل PDF
        </button>
        <button onClick={handlePng} disabled={!!loading}
          className="py-3 rounded-xl text-sm font-semibold border border-[var(--border)] hover:border-[#6366F1] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading === 'png'
            ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            : '🖼'} تحميل PNG
      </button>
      </div>

      {/* Tickets button */}
      
        href="https://ticketme.cc"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 border-2"
        style={{ borderColor: colors.primary, color: colors.primary }}
      >
        🎟 التذاكر — ticketme.cc
      </a>

      <p className="text-center text-[10px] text-[var(--text-muted)]">
        الوجه الأمامي والخلفي في ملف واحد
      </p>
    </div>
  )
}