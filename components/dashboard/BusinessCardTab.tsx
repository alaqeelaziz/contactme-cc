'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import BusinessCardPreview from '@/components/BusinessCardPreview'
import type { Profile } from '@/lib/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Props { profile: Profile; profileUrl: string }
type Theme = 'dark' | 'light' | 'gradient' | 'minimal'

const THEMES: { id: Theme; label: string; emoji: string }[] = [
  { id: 'dark',     label: 'داكن',  emoji: '🌙' },
  { id: 'light',    label: 'فاتح',  emoji: '☀️' },
  { id: 'gradient', label: 'متدرج', emoji: '🌈' },
  { id: 'minimal',  label: 'بسيط',  emoji: '⬜' },
]
const COLOR_PAIRS = [
  { primary: '#4B9EFF', secondary: '#8B5CF6', name: 'اوشن'  },
  { primary: '#6366F1', secondary: '#A855F7', name: 'برايم' },
  { primary: '#10B981', secondary: '#3B82F6', name: 'نعناع' },
  { primary: '#F59E0B', secondary: '#EF4444', name: 'غروب' },
  { primary: '#EC4899', secondary: '#8B5CF6', name: 'زهري'  },
  { primary: '#14B8A6', secondary: '#6366F1', name: 'تيل'   },
  { primary: '#F97316', secondary: '#EAB308', name: 'ذهبي'  },
  { primary: '#1E293B', secondary: '#475569', name: 'رمادي' },
]

// Card sizes — px dimensions (canvas) + mm (PDF)
const SIZES = [
  { id: 'standard', label: 'قياسي',  subtitle: '85×54 mm', W: 480, H: 272, mmW: 85.6, mmH: 54   },
  { id: 'square',   label: 'مربع',   subtitle: '70×70 mm', W: 320, H: 320, mmW: 70,   mmH: 70   },
  { id: 'portrait', label: 'عمودي',  subtitle: '54×86 mm', W: 240, H: 360, mmW: 54,   mmH: 85.6 },
  { id: 'large',    label: 'كبير',   subtitle: 'A6',       W: 600, H: 425, mmW: 105,  mmH: 74   },
]

export default function BusinessCardTab({ profile, profileUrl }: Props) {
  const [theme,    setTheme]    = useState<Theme>((profile as any).card_theme     ?? 'dark')
  const [colorIdx, setColorIdx] = useState<number>((profile as any).card_color_idx ?? 0)
  const [sizeId,   setSizeId]   = useState('standard')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [loading,  setLoading]  = useState<'png' | 'pdf' | null>(null)

  const colors  = COLOR_PAIRS[colorIdx]
  const size    = SIZES.find(s => s.id === sizeId)!
  const { W, H, mmW, mmH } = size

  const name    = profile.full_name ?? ''
  const job     = (profile as any).job_title ?? ''
  const phone   = (profile as any).whatsapp  ?? (profile as any).phone ?? ''
  const email   = (profile as any).email     ?? ''
  const avatar  = profile.avatar_url ?? null
  const initial = name ? name.charAt(0) : 'أ'
  const isDark  = theme === 'dark' || theme === 'gradient'

  // ─── Canvas drawing helpers ────────────────────────────────────────────────

  function createCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const PX = 3
    const cv  = document.createElement('canvas')
    cv.width  = w * PX
    cv.height = h * PX
    const ctx = cv.getContext('2d')!
    ctx.scale(PX, PX)
    return [cv, ctx]
  }

  function applyGradientBg(ctx: CanvasRenderingContext2D, w: number, h: number) {
    if (theme === 'gradient') {
      const g = ctx.createLinearGradient(0, 0, w, h)
      g.addColorStop(0, colors.primary); g.addColorStop(1, colors.secondary)
      ctx.fillStyle = g
    } else if (theme === 'dark') {
      const g = ctx.createLinearGradient(0, 0, w, h)
      g.addColorStop(0, '#1A1A3E'); g.addColorStop(1, '#2d2d5e')
      ctx.fillStyle = g
    } else if (theme === 'light') {
      ctx.fillStyle = '#FFFFFF'
    } else {
      ctx.fillStyle = '#F8FAFC'
    }
    ctx.fillRect(0, 0, w, h)
    // Border for light themes
    if (!isDark) {
      ctx.strokeStyle = theme === 'light' ? '#E5E7EB' : '#E2E8F0'
      ctx.lineWidth = 1
      ctx.strokeRect(0.5, 0.5, w - 1, h - 1)
    }
  }

  async function loadImg(src: string): Promise<HTMLImageElement> {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    return new Promise(res => { img.onload = () => res(img); img.onerror = () => res(img); img.src = src })
  }

  // ─── FRONT card ────────────────────────────────────────────────────────────

  async function drawFront(): Promise<HTMLCanvasElement> {
    const [cv, ctx] = createCanvas(W, H)
    const txtClr  = isDark ? '#FFFFFF' : '#111827'
    const subClr  = theme === 'dark' ? '#93C5FD' : theme === 'gradient' ? 'rgba(255,255,255,0.85)' : colors.primary
    const metaClr = isDark ? 'rgba(255,255,255,0.65)' : '#6B7280'
    const dotClr  = theme === 'gradient' ? 'rgba(255,255,255,0.9)' : isDark ? '#FFFFFF' : colors.primary

    // Background — simple fillRect, no clip
    applyGradientBg(ctx, W, H)

    // ── Avatar (top-right area) ──
    const AS = Math.round(H * 0.165)   // ~44 at H=272
    const AX = W - AS - 16
    const AY = 16
    if (avatar) {
      const img = await loadImg(avatar)
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(AX, AY, AS, AS, 10)
      ctx.clip()
      ctx.drawImage(img, AX, AY, AS, AS)
      ctx.restore()
    } else {
      const g = ctx.createLinearGradient(AX, AY, AX + AS, AY + AS)
      g.addColorStop(0, colors.primary); g.addColorStop(1, colors.secondary)
      ctx.fillStyle = theme === 'gradient' ? 'rgba(255,255,255,0.25)' : g
      ctx.beginPath(); ctx.roundRect(AX, AY, AS, AS, 10); ctx.fill()
      ctx.fillStyle = '#FFF'
      ctx.font = `bold ${Math.round(AS * 0.4)}px Tahoma,Arial`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(initial, AX + AS / 2, AY + AS / 2)
    }

    // ── Name & Job (to the left of avatar) ──
    const nameX = AX - 10
    ctx.textAlign    = 'right'
    ctx.textBaseline = 'top'
    ctx.fillStyle    = txtClr
    ctx.font         = `bold ${Math.round(H * 0.052)}px Tahoma,Arial`
    ctx.fillText(name || 'اسمك هنا', nameX, AY + 4)
    ctx.fillStyle = subClr
    ctx.font      = `${Math.round(H * 0.042)}px Tahoma,Arial`
    ctx.fillText(job, nameX, AY + Math.round(H * 0.058))

    // ── Dot-grid logo (top-left) ──
    const GX = 16, GY = AY, GS = Math.round(AS * 0.95)
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.12)' : `${colors.primary}22`
    ctx.beginPath(); ctx.roundRect(GX - 4, GY - 4, GS + 8, GS + 8, 8); ctx.fill()
    const ds = Math.round(GS / 3) - 2
    for (let i = 0; i < 9; i++) {
      if (![0,1,3,4,7,8].includes(i)) continue
      const cx = GX + (i % 3) * (ds + 2)
      const cy = GY + Math.floor(i / 3) * (ds + 2)
      ctx.fillStyle = dotClr
      ctx.beginPath(); ctx.roundRect(cx, cy, ds, ds, 2); ctx.fill()
    }

    // ── Divider ──
    const divY = Math.round(H * 0.55)
    ctx.globalAlpha = 0.18
    ctx.fillStyle   = txtClr
    ctx.fillRect(16, divY, W - 32, 1)
    ctx.globalAlpha = 1

    // ── Contact info — plain Latin text, forced LTR ──
    ctx.textAlign    = 'left'
    ctx.textBaseline = 'top'
    ctx.fillStyle    = metaClr
    const fs = Math.round(H * 0.042)
    ctx.font = `${fs}px Arial,sans-serif`
    let cy   = divY + 12
    const lh = Math.round(H * 0.075)
    if (phone) { ctx.fillText('\u{1F4DE}  ' + phone,  16, cy); cy += lh }
    if (email) { ctx.fillText('\u2709  '   + email,   16, cy); cy += lh }
    ctx.fillText('\uD83C\uDF10  ' + profileUrl, 16, cy)

    return cv
  }

  // ─── BACK card ─────────────────────────────────────────────────────────────

  async function drawBack(): Promise<HTMLCanvasElement> {
    const [cv, ctx] = createCanvas(W, H)
    const metaClr = isDark ? 'rgba(255,255,255,0.6)' : '#6B7280'

    applyGradientBg(ctx, W, H)

    // QR
    const QR      = await import('qrcode')
    const qrSize  = Math.round(Math.min(W, H) * 0.48)
    const qrX     = Math.round((W - qrSize) / 2)
    const qrY     = Math.round((H - qrSize) / 2) - 12
    const pad     = 12

    const qrUrl = await QR.toDataURL(profileUrl || 'https://contactme.cc', {
      width: qrSize * 3, margin: 1,
      color: { dark: colors.primary, light: '#FFFFFF' },
    })

    // White card behind QR
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.roundRect(qrX - pad, qrY - pad, qrSize + pad * 2, qrSize + pad * 2, 12)
    ctx.fill()

    // QR image
    const qrImg = await loadImg(qrUrl)
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

    // URL — plain Arial, left-to-right, no bidi
    ctx.fillStyle    = metaClr
    ctx.font         = `${Math.round(H * 0.038)}px Arial,sans-serif`
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'top'
    // Force LTR by prepending U+202D
    ctx.fillText('\u202D' + profileUrl, W / 2, qrY + qrSize + pad + 8)

    return cv
  }

  // ─── Export handlers ────────────────────────────────────────────────────────

  async function handlePdf() {
    setLoading('pdf')
    try {
      // Draw both sides
      const frontCv = await drawFront()
      const backCv  = await drawBack()

      const { jsPDF } = await import('jspdf')
      const isPortrait = mmH > mmW
      const orient = isPortrait ? 'portrait' as const : 'landscape' as const

      const pdf = new jsPDF({ orientation: orient, unit: 'mm', format: [mmW, mmH] })
      // Page 1 — Front
      pdf.addImage(frontCv.toDataURL('image/png'), 'PNG', 0, 0, mmW, mmH)
      // Page 2 — Back
      pdf.addPage([mmW, mmH], orient)
      pdf.addImage(backCv.toDataURL('image/png'),  'PNG', 0, 0, mmW, mmH)

      pdf.save('contactme-card.pdf')
    } catch (e) {
      console.error('PDF error:', e)
    } finally {
      setLoading(null)
    }
  }

  async function handlePng() {
    setLoading('png')
    try {
      const GAP = 20
      const [cv, ctx] = createCanvas(W * 2 + GAP, H)

      // Draw front then back side-by-side
      const frontCv = await drawFront()
      const backCv  = await drawBack()
      ctx.drawImage(frontCv, 0,       0, W, H)
      ctx.drawImage(backCv,  W + GAP, 0, W, H)

      cv.toBlob(blob => {
        if (!blob) return
        const a = document.createElement('a')
        a.download = 'contactme-card.png'
        a.href = URL.createObjectURL(blob); a.click()
      }, 'image/png')
    } catch (e) {
      console.error('PNG error:', e)
    } finally {
      setLoading(null)
    }
  }

  async function handleSave() {
    setSaving(true)
    await supabase.from('profiles')
      .update({ card_theme: theme, card_color_idx: colorIdx })
      .eq('id', profile.id)
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const Spinner = () => (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  )

  return (
    <div className="space-y-6">

      {/* Live preview */}
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-3 font-medium">معاينة البطاقة</p>
        <BusinessCardPreview
          name={name} jobTitle={job} bio={profile.bio ?? ''} phone={phone} email={email}
          logoUrl={avatar} qrValue={profileUrl} theme={theme}
          primaryColor={colors.primary} secondaryColor={colors.secondary} flippable={true}
        />
      </div>

      {/* Size selector */}
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">حجم البطاقة</p>
        <div className="grid grid-cols-2 gap-2">
          {SIZES.map(s => (
            <button key={s.id} onClick={() => setSizeId(s.id)}
              className={`flex items-center justify-between py-2.5 px-3 rounded-xl text-xs font-medium transition-all border ${
                sizeId === s.id
                  ? 'border-[#6366F1] bg-[#6366F110] text-[#6366F1]'
                  : 'border-[var(--border)] text-[var(--text-muted)]'
              }`}>
              <span>{s.label}</span>
              <span className="opacity-60 text-[10px]">{s.subtitle}</span>
            </button>
          ))}
        </div>
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
                style={{ background: `linear-gradient(90deg,${pair.primary},${pair.secondary})` }} />
              <span className="text-[10px] text-[var(--text-muted)]">{pair.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <button onClick={handleSave} disabled={saving}
        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
        style={{ background: saved ? '#10B981' : 'linear-gradient(135deg,#6366F1,#A855F7)' }}>
        {saving ? 'جاري الحفظ...' : saved ? '✓ تم الحفظ' : 'حفظ التصميم'}
      </button>

      {/* Download */}
      <div className="grid grid-cols-2 gap-2">
        <button onClick={handlePdf} disabled={!!loading}
          className="py-3 rounded-xl text-sm font-semibold border border-[var(--border)] hover:border-[#6366F1] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading === 'pdf' ? <Spinner /> : '📄'} PDF
        </button>
        <button onClick={handlePng} disabled={!!loading}
          className="py-3 rounded-xl text-sm font-semibold border border-[var(--border)] hover:border-[#6366F1] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading === 'png' ? <Spinner /> : '🖼'} PNG
        </button>
      </div>

      <a href="https://ticketme.cc" target="_blank" rel="noopener noreferrer"
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 border-2"
        style={{ borderColor: colors.primary, color: colors.primary }}>
        🎟 التذاكر — ticketme.cc
      </a>
    </div>
  )
}
