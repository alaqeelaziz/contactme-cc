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
const SIZES = [
  { id: 'standard', label: 'قياسي', sub: '85×54 mm', W: 480, H: 272, mmW: 85.6, mmH: 54   },
  { id: 'square',   label: 'مربع',  sub: '70×70 mm', W: 320, H: 320, mmW: 70,   mmH: 70   },
  { id: 'portrait', label: 'عمودي', sub: '54×86 mm', W: 240, H: 360, mmW: 54,   mmH: 85.6 },
  { id: 'large',    label: 'كبير',  sub: 'A6',       W: 560, H: 397, mmW: 99,   mmH: 70   },
]

/* ── canvas helpers ─────────────────────────────────────────────────────── */
const PX = 3

/** Cross-browser rounded rect — does NOT use ctx.roundRect() */
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y,     x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x,     y + h, r)
  ctx.arcTo(x,     y + h, x,     y,     r)
  ctx.arcTo(x,     y,     x + w, y,     r)
  ctx.closePath()
}

function mkCanvas(W: number, H: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const cv = document.createElement('canvas')
  cv.width = W * PX; cv.height = H * PX
  const ctx = cv.getContext('2d')!
  ctx.fillStyle = '#FFFFFF'          // solid white base — never transparent
  ctx.fillRect(0, 0, cv.width, cv.height)
  ctx.scale(PX, PX)
  return [cv, ctx]
}

function applyBg(ctx: CanvasRenderingContext2D, W: number, H: number,
                  theme: Theme, p: string, s: string) {
  if (theme === 'gradient') {
    const g = ctx.createLinearGradient(0, 0, W, H)
    g.addColorStop(0, p); g.addColorStop(1, s); ctx.fillStyle = g
  } else if (theme === 'dark') {
    const g = ctx.createLinearGradient(0, 0, W, H)
    g.addColorStop(0, '#1A1A3E'); g.addColorStop(1, '#2d2d5e'); ctx.fillStyle = g
  } else {
    ctx.fillStyle = theme === 'light' ? '#FFFFFF' : '#F8FAFC'
  }
  ctx.fillRect(0, 0, W, H)
  if (theme === 'light' || theme === 'minimal') {
    ctx.strokeStyle = theme === 'light' ? '#E5E7EB' : '#E2E8F0'
    ctx.lineWidth = 1; ctx.strokeRect(0.5, 0.5, W - 1, H - 1)
  }
}

async function loadImg(src: string): Promise<HTMLImageElement | null> {
  return new Promise(res => {
    const img = new Image(); img.crossOrigin = 'anonymous'
    img.onload = () => res(img); img.onerror = () => res(null); img.src = src
  })
}

/* ── FRONT ──────────────────────────────────────────────────────────────── */
async function buildFront(
  W: number, H: number,
  theme: Theme, p: string, s: string,
  name: string, job: string, phone: string, email: string,
  avatar: string | null, profileUrl: string
): Promise<HTMLCanvasElement> {
  const [cv, ctx] = mkCanvas(W, H)
  const isDark  = theme === 'dark' || theme === 'gradient'
  const txtClr  = isDark ? '#FFFFFF' : '#111827'
  const subClr  = theme === 'dark' ? '#93C5FD' : theme === 'gradient' ? 'rgba(255,255,255,0.85)' : p
  const metaClr = isDark ? 'rgba(255,255,255,0.65)' : '#6B7280'
  const dotClr  = theme === 'gradient' ? 'rgba(255,255,255,0.9)' : isDark ? '#FFFFFF' : p
  const initial = name ? name.charAt(0) : 'أ'

  applyBg(ctx, W, H, theme, p, s)

  /* avatar — top right */
  const AS = Math.round(H * 0.162)
  const AX = W - AS - 14, AY = 14
  if (avatar) {
    const img = await loadImg(avatar)
    if (img) {
      ctx.save(); rr(ctx, AX, AY, AS, AS, 8); ctx.clip()
      ctx.drawImage(img, AX, AY, AS, AS); ctx.restore()
    }
  } else {
    rr(ctx, AX, AY, AS, AS, 8)
    if (theme === 'gradient') { ctx.fillStyle = 'rgba(255,255,255,0.25)' }
    else { const g = ctx.createLinearGradient(AX,AY,AX+AS,AY+AS); g.addColorStop(0,p); g.addColorStop(1,s); ctx.fillStyle=g }
    ctx.fill()
    ctx.fillStyle = '#FFF'
    ctx.font = `bold ${Math.round(AS*0.4)}px Tahoma,Arial`
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(initial, AX+AS/2, AY+AS/2)
  }

  /* name & job — right-aligned Arabic */
  ctx.textAlign = 'right'; ctx.textBaseline = 'top'
  ctx.fillStyle = txtClr
  ctx.font = `bold ${Math.round(H*0.052)}px Tahoma,Arial`
  ctx.fillText(name || 'اسمك هنا', AX - 10, AY + 2)
  ctx.fillStyle = subClr
  ctx.font = `${Math.round(H*0.042)}px Tahoma,Arial`
  ctx.fillText(job, AX - 10, AY + Math.round(H*0.062))

  /* dot grid — top left */
  const GS = Math.round(AS * 0.9), GX = 14, GY = AY
  rr(ctx, GX-4, GY-4, GS+8, GS+8, 7)
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.12)' : `${p}22`; ctx.fill()
  const ds = Math.round(GS/3) - 2
  for (let i = 0; i < 9; i++) {
    if (![0,1,3,4,7,8].includes(i)) continue
    rr(ctx, GX+(i%3)*(ds+2), GY+Math.floor(i/3)*(ds+2), ds, ds, 2)
    ctx.fillStyle = dotClr; ctx.fill()
  }

  /* divider */
  const divY = Math.round(H * 0.55)
  ctx.globalAlpha = 0.15; ctx.fillStyle = txtClr
  ctx.fillRect(14, divY, W - 28, 1); ctx.globalAlpha = 1

  /* contact — Latin font, LTR */
  ctx.textAlign = 'left'; ctx.textBaseline = 'top'
  ctx.fillStyle = metaClr
  const fs = Math.round(H * 0.042)
  ctx.font = `${fs}px Arial,sans-serif`
  let cy = divY + 10
  const lh = Math.round(H * 0.075)
  if (phone) { ctx.fillText('📞  ' + phone,  14, cy); cy += lh }
  if (email) { ctx.fillText('✉  '  + email,  14, cy); cy += lh }
  ctx.fillText('🌐  ' + profileUrl, 14, cy)

  return cv
}

/* ── BACK ───────────────────────────────────────────────────────────────── */
async function buildBack(
  W: number, H: number,
  theme: Theme, p: string, s: string,
  profileUrl: string
): Promise<HTMLCanvasElement> {
  const [cv, ctx] = mkCanvas(W, H)

  applyBg(ctx, W, H, theme, p, s)

  const QR     = await import('qrcode')
  const qrSize = Math.round(Math.min(W, H) * 0.50)
  const qrX    = Math.round((W - qrSize) / 2)
  const qrY    = Math.round((H - qrSize) / 2) - 8
  const pad    = 12

  const dataUrl = await QR.toDataURL(profileUrl || 'https://contactme.cc', {
    width: qrSize * 3, margin: 1, color: { dark: p, light: '#FFFFFF' }
  })

  /* white frame behind QR */
  rr(ctx, qrX-pad, qrY-pad, qrSize+pad*2, qrSize+pad*2, 12)
  ctx.fillStyle = '#FFFFFF'; ctx.fill()

  const qrImg = await loadImg(dataUrl)
  if (qrImg) ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

  /* URL text — drawn in Latin font only, no bidi */
  const isDark  = theme === 'dark' || theme === 'gradient'
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.55)' : '#6B7280'
  ctx.font      = `${Math.round(H*0.036)}px Arial,sans-serif`
  ctx.textAlign = 'center'; ctx.textBaseline = 'top'
  /* draw char by char in LTR order to bypass bidi */
  const url = profileUrl
  const tw  = ctx.measureText(url).width
  let cx    = (W - tw) / 2
  const ty  = qrY + qrSize + pad + 6
  for (const ch of url) {
    ctx.fillText(ch, cx, ty)
    cx += ctx.measureText(ch).width
  }

  return cv
}

/* ── Component ──────────────────────────────────────────────────────────── */
export default function BusinessCardTab({ profile, profileUrl }: Props) {
  const [theme,    setTheme]    = useState<Theme>((profile as any).card_theme     ?? 'dark')
  const [colorIdx, setColorIdx] = useState<number>((profile as any).card_color_idx ?? 0)
  const [sizeId,   setSizeId]   = useState('standard')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [loading,  setLoading]  = useState<'png' | 'pdf' | null>(null)

  const colors = COLOR_PAIRS[colorIdx]
  const size   = SIZES.find(s => s.id === sizeId)!
  const { W, H, mmW, mmH } = size

  const name  = profile.full_name ?? ''
  const job   = (profile as any).job_title ?? ''
  const phone = (profile as any).whatsapp  ?? (profile as any).phone ?? ''
  const email = (profile as any).email     ?? ''
  const avatar = profile.avatar_url ?? null
  const isDark = theme === 'dark' || theme === 'gradient'

  const frontArgs = [W, H, theme, colors.primary, colors.secondary,
                     name, job, phone, email, avatar, profileUrl] as const
  const backArgs  = [W, H, theme, colors.primary, colors.secondary, profileUrl] as const

  /* PDF — SINGLE PAGE with front|back side by side. No addPage(). */
  async function handlePdf() {
    setLoading('pdf')
    try {
      const GAP = 10
      const frontCv = await buildFront(...frontArgs)
      const backCv  = await buildBack(...backArgs)

      /* merge into one wide canvas */
      const [merged, mctx] = mkCanvas(W * 2 + GAP, H)
      mctx.drawImage(frontCv, 0,       0, W, H)
      mctx.drawImage(backCv,  W + GAP, 0, W, H)

      /* PDF sized so aspect ratio matches the merged canvas */
      const pdfH = mmH
      const pdfW = Math.round(pdfH * (W * 2 + GAP) / H * 10) / 10

      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [pdfW, pdfH] })
      pdf.addImage(merged.toDataURL('image/png'), 'PNG', 0, 0, pdfW, pdfH)
      pdf.save('contactme-card.pdf')
    } catch (e) {
      console.error('PDF error:', e)
    } finally { setLoading(null) }
  }

  async function handlePng() {
    setLoading('png')
    try {
      const GAP = 20
      const [cv, ctx] = mkCanvas(W * 2 + GAP, H)
      const frontCv = await buildFront(...frontArgs)
      const backCv  = await buildBack(...backArgs)
      ctx.drawImage(frontCv, 0,       0, W, H)
      ctx.drawImage(backCv,  W + GAP, 0, W, H)
      cv.toBlob(blob => {
        if (!blob) return
        const a = document.createElement('a')
        a.download = 'contactme-card.png'
        a.href = URL.createObjectURL(blob); a.click()
      }, 'image/png')
    } catch (e) { console.error('PNG error:', e) }
    finally { setLoading(null) }
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
      {/* Preview */}
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-3 font-medium">معاينة البطاقة</p>
        <BusinessCardPreview
          name={name} jobTitle={job} bio={profile.bio ?? ''} phone={phone} email={email}
          logoUrl={avatar} qrValue={profileUrl} theme={theme}
          primaryColor={colors.primary} secondaryColor={colors.secondary} flippable={true}
        />
      </div>

      {/* Size */}
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">حجم البطاقة (يؤثر على الملف المصدّر)</p>
        <div className="grid grid-cols-2 gap-2">
          {SIZES.map(s => (
            <button key={s.id} onClick={() => setSizeId(s.id)}
              className={`flex items-center justify-between py-2.5 px-3 rounded-xl text-xs font-medium transition-all border ${
                sizeId === s.id ? 'border-[#6366F1] bg-[#6366F110] text-[#6366F1]' : 'border-[var(--border)] text-[var(--text-muted)]'
              }`}>
              <span>{s.label}</span>
              <span className="opacity-60 text-[10px]">{s.sub}</span>
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
                theme === t.id ? 'border-[#6366F1] bg-[#6366F110] text-[#6366F1]' : 'border-[var(--border)] text-[var(--text-muted)]'
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

      {/* Downloads */}
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

      <p className="text-center text-[10px] text-[var(--text-muted)]">
        الوجه الأمامي والخلفي في ملف واحد
      </p>

      <a href="https://ticketme.cc" target="_blank" rel="noopener noreferrer"
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 border-2"
        style={{ borderColor: colors.primary, color: colors.primary }}>
        🎟 التذاكر — ticketme.cc
      </a>
    </div>
  )
}
