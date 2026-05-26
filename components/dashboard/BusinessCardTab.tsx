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
type CardShape = 'landscape' | 'square' | 'portrait'

const THEMES: { id: Theme; label: string; emoji: string }[] = [
  { id: 'dark',     label: 'داكن',  emoji: '🌙' },
  { id: 'light',    label: 'فاتح',  emoji: '☀️' },
  { id: 'gradient', label: 'متدرج', emoji: '🌈' },
  { id: 'minimal',  label: 'بسيط',  emoji: '⬜' },
]

const SHAPES: { id: CardShape; label: string; icon: string }[] = [
  { id: 'landscape', label: 'أفقي',  icon: '▬' },
  { id: 'square',    label: 'مربع',  icon: '■' },
  { id: 'portrait',  label: 'عمودي', icon: '▮' },
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

// Card dimensions per shape (logical px)
const DIMS: Record<CardShape, { W: number; H: number }> = {
  landscape: { W: 480, H: 274 },
  square:    { W: 340, H: 340 },
  portrait:  { W: 274, H: 420 },
}

// PDF dimensions in mm per shape
const PDF_DIMS: Record<CardShape, { w: number; h: number; orientation: 'landscape' | 'portrait' }> = {
  landscape: { w: 85.6, h: 54,   orientation: 'landscape' },
  square:    { w: 70,   h: 70,   orientation: 'portrait'  },
  portrait:  { w: 54,   h: 85.6, orientation: 'portrait'  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y,     x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x,     y + h, r)
  ctx.arcTo(x,     y + h, x,     y,     r)
  ctx.arcTo(x,     y,     x + w, y,     r)
  ctx.closePath()
}

/** Load Cairo font directly via FontFace API — reliable in Canvas */
let _fontFamilyCache: string | null = null
async function loadArabicFont(): Promise<string> {
  if (_fontFamilyCache) return _fontFamilyCache
  const FAMILY = 'CairoCard'
  const URLS = [
    'https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvangtZmpcWmhzfH5lWWgcQyyS4J0.woff2',
    'https://fonts.gstatic.com/s/cairo/v28/SLXVc1nY6HkvangtZmpQdkhzfH5lWWgcQyyS4J0.woff2',
  ]
  for (const url of URLS) {
    try {
      const face = new FontFace(FAMILY, `url(${url})`)
      const loaded = await face.load()
      document.fonts.add(loaded)
      _fontFamilyCache = FAMILY
      return FAMILY
    } catch { /* try next */ }
  }
  // Fallback
  _fontFamilyCache = 'Arial'
  return 'Arial'
}

function af(family: string, size: number, bold = false) {
  return `${bold ? 'bold ' : ''}${size}px ${family}, Tahoma, Arial`
}

// ─── Background fill (shared) ─────────────────────────────────────────────────

function fillBackground(
  ctx: CanvasRenderingContext2D,
  W: number, H: number, offsetX: number, offsetY: number,
  theme: Theme, primary: string, secondary: string
) {
  ctx.save()
  rr(ctx, offsetX, offsetY, W, H, 16); ctx.clip()
  if (theme === 'gradient') {
    const g = ctx.createLinearGradient(offsetX, offsetY, offsetX + W, offsetY + H)
    g.addColorStop(0, primary); g.addColorStop(1, secondary)
    ctx.fillStyle = g
  } else if (theme === 'dark') {
    const g = ctx.createLinearGradient(offsetX, offsetY, offsetX + W, offsetY + H)
    g.addColorStop(0, '#1A1A3E'); g.addColorStop(1, '#2d2d5e')
    ctx.fillStyle = g
  } else {
    ctx.fillStyle = theme === 'light' ? '#FFFFFF' : '#F8FAFC'
  }
  ctx.fillRect(offsetX, offsetY, W, H)
  const isDark = theme === 'dark' || theme === 'gradient'
  if (!isDark) {
    ctx.strokeStyle = theme === 'light' ? '#E5E7EB' : '#E2E8F0'
    ctx.lineWidth = 1; rr(ctx, offsetX, offsetY, W, H, 16); ctx.stroke()
  }
  ctx.restore()
}

// ─── Draw FRONT — Landscape ───────────────────────────────────────────────────

async function drawFrontLandscape(
  ctx: CanvasRenderingContext2D,
  W: number, H: number, ox: number, oy: number,
  theme: Theme, primary: string, secondary: string, font: string,
  name: string, jobTitle: string, phone: string, email: string,
  avatarUrl: string | null, profileUrl: string, initial: string
) {
  const isDark     = theme === 'dark' || theme === 'gradient'
  const textColor  = isDark ? '#FFFFFF' : '#111827'
  const subtextClr = theme === 'dark' ? '#93C5FD' : theme === 'gradient' ? 'rgba(255,255,255,0.85)' : primary
  const metaColor  = isDark ? 'rgba(255,255,255,0.65)' : '#6B7280'
  const dotColor   = theme === 'gradient' ? 'rgba(255,255,255,0.9)' : theme === 'dark' ? '#FFFFFF' : primary

  fillBackground(ctx, W, H, ox, oy, theme, primary, secondary)

  // Avatar
  const AX = ox + W - 64, AY = oy + 20, AS = 44
  if (avatarUrl) {
    ctx.save(); rr(ctx, AX, AY, AS, AS, 10); ctx.clip()
    const img = new Image(); img.crossOrigin = 'anonymous'
    await new Promise<void>(res => { img.onload = () => res(); img.onerror = () => res(); img.src = avatarUrl })
    ctx.drawImage(img, AX, AY, AS, AS); ctx.restore()
  } else {
    rr(ctx, AX, AY, AS, AS, 10)
    if (theme === 'gradient') { ctx.fillStyle = 'rgba(255,255,255,0.25)' }
    else { const ag = ctx.createLinearGradient(AX, AY, AX+AS, AY+AS); ag.addColorStop(0, primary); ag.addColorStop(1, secondary); ctx.fillStyle = ag }
    ctx.fill()
    ctx.fillStyle = '#FFF'; ctx.font = af(font, 18, true)
    ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(initial, AX + AS/2, AY + AS/2)
  }

  // Name (Arabic — RTL)
  ctx.direction = 'rtl'; ctx.textAlign = 'right'; ctx.textBaseline = 'top'
  ctx.fillStyle = textColor; ctx.font = af(font, 14, true)
  ctx.fillText(name || 'اسمك هنا', AX - 12, AY + 4)
  ctx.fillStyle = subtextClr; ctx.font = af(font, 11)
  ctx.fillText(jobTitle || '', AX - 12, AY + 22)

  // Dot grid logo mark
  const LMX = ox + 20, LMY = AY
  rr(ctx, LMX-5, LMY-5, 42, 42, 10)
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.12)' : `${primary}22`; ctx.fill()
  for (let i = 0; i < 9; i++) {
    if (![0,1,3,4,7,8].includes(i)) continue
    rr(ctx, LMX+(i%3)*10.5, LMY+Math.floor(i/3)*10.5, 9, 9, 2)
    ctx.fillStyle = dotColor; ctx.fill()
  }

  // Divider
  const divY = oy + H/2 + 10
  ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = textColor
  ctx.fillRect(ox + 20, divY, W - 40, 1); ctx.restore()

  // Contact info (LTR — force direction)
  ctx.direction = 'ltr'; ctx.textAlign = 'left'; ctx.textBaseline = 'top'
  ctx.fillStyle = metaColor; ctx.font = af(font, 11)
  let cy = divY + 14
  if (phone) { ctx.fillText('📞  ' + phone,  ox + 20, cy); cy += 20 }
  if (email) { ctx.fillText('✉  '  + email,  ox + 20, cy); cy += 20 }
  ctx.fillText('🌐  ' + profileUrl, ox + 20, cy)
}

// ─── Draw FRONT — Square ──────────────────────────────────────────────────────

async function drawFrontSquare(
  ctx: CanvasRenderingContext2D,
  W: number, H: number, ox: number, oy: number,
  theme: Theme, primary: string, secondary: string, font: string,
  name: string, jobTitle: string, phone: string, email: string,
  avatarUrl: string | null, profileUrl: string, initial: string
) {
  const isDark    = theme === 'dark' || theme === 'gradient'
  const textColor = isDark ? '#FFFFFF' : '#111827'
  const subColor  = theme === 'dark' ? '#93C5FD' : theme === 'gradient' ? 'rgba(255,255,255,0.8)' : primary
  const metaColor = isDark ? 'rgba(255,255,255,0.6)' : '#6B7280'

  fillBackground(ctx, W, H, ox, oy, theme, primary, secondary)

  // Center avatar at top
  const AS = 72, AX = ox + (W - AS) / 2, AY = oy + 30
  if (avatarUrl) {
    ctx.save(); rr(ctx, AX, AY, AS, AS, AS/2); ctx.clip()
    const img = new Image(); img.crossOrigin = 'anonymous'
    await new Promise<void>(res => { img.onload = () => res(); img.onerror = () => res(); img.src = avatarUrl })
    ctx.drawImage(img, AX, AY, AS, AS); ctx.restore()
    // Border ring
    ctx.save(); rr(ctx, AX-2, AY-2, AS+4, AS+4, AS/2+2)
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.4)' : primary; ctx.lineWidth = 2; ctx.stroke(); ctx.restore()
  } else {
    rr(ctx, AX, AY, AS, AS, AS/2)
    const ag = ctx.createLinearGradient(AX, AY, AX+AS, AY+AS)
    ag.addColorStop(0, primary); ag.addColorStop(1, secondary); ctx.fillStyle = ag; ctx.fill()
    ctx.fillStyle = '#FFF'; ctx.font = af(font, 28, true)
    ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(initial, AX + AS/2, AY + AS/2)
  }

  // Name centered
  ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'
  ctx.fillStyle = textColor; ctx.font = af(font, 16, true)
  ctx.fillText(name || 'اسمك هنا', ox + W/2, AY + AS + 14)
  ctx.fillStyle = subColor; ctx.font = af(font, 12)
  ctx.fillText(jobTitle || '', ox + W/2, AY + AS + 35)

  // Divider
  const divY = AY + AS + 58
  ctx.save(); ctx.globalAlpha = 0.15; ctx.fillStyle = textColor
  ctx.fillRect(ox + 30, divY, W - 60, 1); ctx.restore()

  // Contact (centered, LTR)
  ctx.direction = 'ltr'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'
  ctx.fillStyle = metaColor; ctx.font = af(font, 11)
  let cy = divY + 12
  if (phone) { ctx.fillText('📞  ' + phone,  ox + W/2, cy); cy += 20 }
  if (email) { ctx.fillText('✉  '  + email,  ox + W/2, cy); cy += 20 }
  ctx.font = af(font, 10)
  ctx.fillText('🌐  ' + profileUrl, ox + W/2, cy)
}

// ─── Draw FRONT — Portrait ────────────────────────────────────────────────────

async function drawFrontPortrait(
  ctx: CanvasRenderingContext2D,
  W: number, H: number, ox: number, oy: number,
  theme: Theme, primary: string, secondary: string, font: string,
  name: string, jobTitle: string, phone: string, email: string,
  avatarUrl: string | null, profileUrl: string, initial: string
) {
  const isDark    = theme === 'dark' || theme === 'gradient'
  const textColor = isDark ? '#FFFFFF' : '#111827'
  const subColor  = theme === 'dark' ? '#93C5FD' : theme === 'gradient' ? 'rgba(255,255,255,0.8)' : primary
  const metaColor = isDark ? 'rgba(255,255,255,0.6)' : '#6B7280'

  fillBackground(ctx, W, H, ox, oy, theme, primary, secondary)

  // Gradient header strip
  ctx.save()
  const headerH = H * 0.38
  rr(ctx, ox, oy, W, H, 16); ctx.clip()
  const hg = ctx.createLinearGradient(ox, oy, ox + W, oy + headerH)
  if (isDark) { hg.addColorStop(0, 'rgba(255,255,255,0.08)'); hg.addColorStop(1, 'rgba(255,255,255,0)') }
  else        { hg.addColorStop(0, `${primary}18`);           hg.addColorStop(1, 'rgba(255,255,255,0)') }
  ctx.fillStyle = hg; ctx.fillRect(ox, oy, W, headerH)
  ctx.restore()

  // Avatar centered
  const AS = 64, AX = ox + (W - AS) / 2, AY = oy + 28
  if (avatarUrl) {
    ctx.save(); rr(ctx, AX, AY, AS, AS, AS/2); ctx.clip()
    const img = new Image(); img.crossOrigin = 'anonymous'
    await new Promise<void>(res => { img.onload = () => res(); img.onerror = () => res(); img.src = avatarUrl })
    ctx.drawImage(img, AX, AY, AS, AS); ctx.restore()
    ctx.save(); rr(ctx, AX-2, AY-2, AS+4, AS+4, AS/2+2)
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.4)' : primary; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore()
  } else {
    rr(ctx, AX, AY, AS, AS, AS/2)
    const ag = ctx.createLinearGradient(AX, AY, AX+AS, AY+AS)
    ag.addColorStop(0, primary); ag.addColorStop(1, secondary); ctx.fillStyle = ag; ctx.fill()
    ctx.fillStyle = '#FFF'; ctx.font = af(font, 26, true)
    ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(initial, AX + AS/2, AY + AS/2)
  }

  // Name & title centered
  ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'
  ctx.fillStyle = textColor; ctx.font = af(font, 15, true)
  ctx.fillText(name || 'اسمك هنا', ox + W/2, AY + AS + 14)
  ctx.fillStyle = subColor; ctx.font = af(font, 12)
  ctx.fillText(jobTitle || '', ox + W/2, AY + AS + 34)

  // Decorative line with dot
  const lineY = AY + AS + 60
  ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = textColor
  ctx.fillRect(ox + 20, lineY, W - 40, 1)
  ctx.restore()
  ctx.save(); ctx.globalAlpha = 0.6
  rr(ctx, ox + W/2 - 3, lineY - 3, 6, 6, 3)
  ctx.fillStyle = isDark ? '#FFFFFF' : primary; ctx.fill(); ctx.restore()

  // Contact info
  ctx.direction = 'ltr'; ctx.textAlign = 'left'; ctx.textBaseline = 'top'
  ctx.fillStyle = metaColor; ctx.font = af(font, 12)
  let cy = lineY + 16
  const lx = ox + 24
  if (phone) { ctx.fillText('📞  ' + phone,  lx, cy); cy += 24 }
  if (email) { ctx.fillText('✉  '  + email,  lx, cy); cy += 24 }
  ctx.font = af(font, 11)
  ctx.fillText('🌐  ' + profileUrl, lx, cy)
}

// ─── Draw BACK (works for all shapes) ────────────────────────────────────────

async function drawBack(
  ctx: CanvasRenderingContext2D,
  W: number, H: number, ox: number, oy: number,
  theme: Theme, primary: string, secondary: string, font: string,
  profileUrl: string
) {
  const isDark    = theme === 'dark' || theme === 'gradient'
  const metaColor = isDark ? 'rgba(255,255,255,0.6)' : '#6B7280'

  fillBackground(ctx, W, H, ox, oy, theme, primary, secondary)

  try {
    const QRCodeLib = await import('qrcode')
    // QR size proportional to card
    const qrSize = Math.min(W, H) * 0.52
    const padding = 14
    const qrX = ox + (W - qrSize) / 2
    const qrY = oy + (H - qrSize) / 2 - 10

    const qrDataUrl = await QRCodeLib.toDataURL(profileUrl || 'https://contactme.cc', {
      width: Math.round(qrSize * 3),
      margin: 1,
      color: { dark: primary, light: '#FFFFFF' },
    })

    // White card behind QR
    rr(ctx, qrX - padding, qrY - padding, qrSize + padding*2, qrSize + padding*2, 14)
    ctx.fillStyle = '#FFFFFF'; ctx.fill()

    const qrImg = new Image()
    await new Promise<void>(res => { qrImg.onload = () => res(); qrImg.src = qrDataUrl })
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

    // URL label — force LTR
    ctx.direction = 'ltr'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'
    ctx.fillStyle = metaColor; ctx.font = af(font, 10)
    ctx.fillText(profileUrl, ox + W/2, qrY + qrSize + padding + 8)
  } catch (e) {
    console.error('QR error', e)
  }
}

// ─── Canvas factory ───────────────────────────────────────────────────────────

function makeCanvas(W: number, H: number, PX: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas')
  c.width = W * PX; c.height = H * PX
  const ctx = c.getContext('2d')!
  ctx.scale(PX, PX)
  return [c, ctx]
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BusinessCardTab({ profile, profileUrl }: Props) {
  const [theme,    setTheme]    = useState<Theme>((profile as any).card_theme     ?? 'dark')
  const [colorIdx, setColorIdx] = useState<number>((profile as any).card_color_idx ?? 0)
  const [shape,    setShape]    = useState<CardShape>('landscape')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [loading,  setLoading]  = useState<'png' | 'pdf' | null>(null)

  const colors = COLOR_PAIRS[colorIdx]

  // Shared profile fields
  const name      = profile.full_name ?? ''
  const jobTitle  = (profile as any).job_title ?? ''
  const phone     = (profile as any).whatsapp  ?? (profile as any).phone ?? ''
  const email     = (profile as any).email     ?? ''
  const avatarUrl = profile.avatar_url ?? null
  const initial   = name ? name.charAt(0) : 'أ'

  async function buildFrontCanvas(): Promise<HTMLCanvasElement> {
    const font = await loadArabicFont()
    const { W, H } = DIMS[shape]
    const [c, ctx] = makeCanvas(W, H, 3)
    const args = [ctx, W, H, 0, 0, theme, colors.primary, colors.secondary, font,
                  name, jobTitle, phone, email, avatarUrl, profileUrl, initial] as const
    if (shape === 'landscape') await drawFrontLandscape(...args)
    else if (shape === 'square')   await drawFrontSquare(...args)
    else                           await drawFrontPortrait(...args)
    return c
  }

  async function buildBackCanvas(): Promise<HTMLCanvasElement> {
    const font = await loadArabicFont()
    const { W, H } = DIMS[shape]
    const [c, ctx] = makeCanvas(W, H, 3)
    await drawBack(ctx, W, H, 0, 0, theme, colors.primary, colors.secondary, font, profileUrl)
    return c
  }

  async function handlePng() {
    setLoading('png')
    try {
      await loadArabicFont()
      const { W, H } = DIMS[shape]
      const GAP = 20
      const font = await loadArabicFont()
      const [c, ctx] = makeCanvas(W * 2 + GAP, H, 3)
      const args = [ctx, W, H, 0, 0, theme, colors.primary, colors.secondary, font,
                    name, jobTitle, phone, email, avatarUrl, profileUrl, initial] as const
      if (shape === 'landscape') await drawFrontLandscape(...args)
      else if (shape === 'square')   await drawFrontSquare(...args)
      else                           await drawFrontPortrait(...args)
      await drawBack(ctx, W, H, W + GAP, 0, theme, colors.primary, colors.secondary, font, profileUrl)
      c.toBlob(blob => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a   = document.createElement('a'); a.download = 'contactme-card.png'; a.href = url; a.click()
        URL.revokeObjectURL(url)
      }, 'image/png')
    } finally { setLoading(null) }
  }

  async function handlePdf() {
    setLoading('pdf')
    try {
      const [frontC, backC] = await Promise.all([buildFrontCanvas(), buildBackCanvas()])
      const { jsPDF } = await import('jspdf')
      const { w, h, orientation } = PDF_DIMS[shape]
      const pdf = new jsPDF({ orientation, unit: 'mm', format: [w, h] })
      pdf.addImage(frontC.toDataURL('image/png'), 'PNG', 0, 0, w, h)
      pdf.addPage([w, h], orientation)
      pdf.addImage(backC.toDataURL('image/png'),  'PNG', 0, 0, w, h)
      pdf.save('contactme-card.pdf')
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

      {/* Shape selector */}
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">شكل البطاقة</p>
        <div className="grid grid-cols-3 gap-2">
          {SHAPES.map(s => (
            <button key={s.id} onClick={() => setShape(s.id)}
              className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-medium transition-all border ${
                shape === s.id
                  ? 'border-[#6366F1] bg-[#6366F110] text-[#6366F1]'
                  : 'border-[var(--border)] text-[var(--text-muted)]'
              }`}>
              <span className="text-base">{s.icon}</span>{s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme selector */}
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

      {/* Color selector */}
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

      <a href="https://ticketme.cc" target="_blank" rel="noopener noreferrer"
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 border-2"
        style={{ borderColor: colors.primary, color: colors.primary }}>
        🎟 التذاكر — ticketme.cc
      </a>
    </div>
  )
}
