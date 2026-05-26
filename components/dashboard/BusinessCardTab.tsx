'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import BusinessCardPreview from '@/components/BusinessCardPreview'
import type { Profile } from '@/lib/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Props { profile: Profile; profileUrl: string }
type Theme     = 'dark' | 'light' | 'gradient' | 'minimal'
type CardShape = 'landscape' | 'square' | 'portrait'

const THEMES: { id: Theme; label: string; emoji: string }[] = [
  { id: 'dark',     label: 'داكن',  emoji: '🌙' },
  { id: 'light',    label: 'فاتح',  emoji: '☀️' },
  { id: 'gradient', label: 'متدرج', emoji: '🌈' },
  { id: 'minimal',  label: 'بسيط',  emoji: '⬜' },
]
const SHAPES: { id: CardShape; label: string; w: number; h: number }[] = [
  { id: 'landscape', label: 'أفقي',  w: 480, h: 272 },
  { id: 'square',    label: 'مربع',  w: 320, h: 320 },
  { id: 'portrait',  label: 'عمودي', w: 260, h: 400 },
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

/* ─── Inline card renderer (HTML → dom-to-image) ─────────────────────────── */

interface CardFaceProps {
  side: 'front' | 'back'
  theme: Theme
  primary: string
  secondary: string
  name: string
  jobTitle: string
  phone: string
  email: string
  avatarUrl: string | null
  profileUrl: string
  shape: CardShape
  W: number
  H: number
}

function CardFace({ side, theme, primary, secondary, name, jobTitle, phone, email, avatarUrl, profileUrl, W, H }: CardFaceProps) {
  const isDark   = theme === 'dark' || theme === 'gradient'
  const txtClr   = isDark ? '#FFFFFF' : '#111827'
  const subClr   = theme === 'dark' ? '#93C5FD' : theme === 'gradient' ? 'rgba(255,255,255,0.85)' : primary
  const metaClr  = isDark ? 'rgba(255,255,255,0.65)' : '#6B7280'
  const initial  = name ? name.charAt(0) : 'أ'

  const bg = theme === 'gradient'
    ? `linear-gradient(135deg, ${primary}, ${secondary})`
    : theme === 'dark'
    ? 'linear-gradient(135deg, #1A1A3E, #2d2d5e)'
    : theme === 'light' ? '#FFFFFF' : '#F8FAFC'

  const border = isDark ? 'none' : `1px solid ${theme === 'light' ? '#E5E7EB' : '#E2E8F0'}`

  if (side === 'back') {
    return (
      <div style={{ width: W, height: H, background: bg, border, borderRadius: 16, display: 'flex',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
                    boxSizing: 'border-box', overflow: 'hidden' }}>
        {/* QR via canvas — rendered separately */}
        <div id="qr-placeholder" style={{ width: 140, height: 140, background: '#FFF', borderRadius: 12,
                                           padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* populated by handleDownload */}
        </div>
        <p style={{ color: metaClr, fontSize: 10, margin: 0, fontFamily: 'Arial,sans-serif', direction: 'ltr' }}>
          {profileUrl}
        </p>
      </div>
    )
  }

  return (
    <div style={{ width: W, height: H, background: bg, border, borderRadius: 16,
                  padding: '20px 20px 16px', display: 'flex', flexDirection: 'column',
                  justifyContent: 'space-between', boxSizing: 'border-box', overflow: 'hidden', direction: 'rtl' }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Dot grid */}
        <div style={{ width: 42, height: 42, background: isDark ? 'rgba(255,255,255,0.12)' : `${primary}22`,
                      borderRadius: 10, padding: 5, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
          {[0,1,2,3,4,5,6,7,8].map(i => (
            <div key={i} style={{ borderRadius: 2, background: [0,1,3,4,7,8].includes(i)
              ? (theme === 'gradient' ? 'rgba(255,255,255,0.9)' : isDark ? '#FFF' : primary)
              : 'transparent' }} />
          ))}
        </div>

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexDirection: 'row-reverse' }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} crossOrigin="anonymous" />
          ) : (
            <div style={{ width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: theme === 'gradient' ? 'rgba(255,255,255,0.25)' : `linear-gradient(135deg,${primary},${secondary})`,
                          color: '#FFF', fontWeight: 'bold', fontSize: 18, fontFamily: 'Tahoma,Arial' }}>
              {initial}
            </div>
          )}
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: txtClr, fontWeight: 'bold', fontSize: 14, fontFamily: 'Tahoma,Arial', marginBottom: 3 }}>
              {name || 'اسمك هنا'}
            </div>
            <div style={{ color: subClr, fontSize: 11, fontFamily: 'Tahoma,Arial' }}>
              {jobTitle}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: txtClr, opacity: 0.15, margin: '8px 0' }} />

      {/* Contact info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, direction: 'ltr' }}>
        {phone && <div style={{ color: metaClr, fontSize: 11, fontFamily: 'Arial,sans-serif' }}>📞  {phone}</div>}
        {email && <div style={{ color: metaClr, fontSize: 11, fontFamily: 'Arial,sans-serif' }}>✉  {email}</div>}
        <div style={{ color: metaClr, fontSize: 11, fontFamily: 'Arial,sans-serif' }}>🌐  {profileUrl}</div>
      </div>
    </div>
  )
}

/* ─── Component ───────────────────────────────────────────────────────────── */

export default function BusinessCardTab({ profile, profileUrl }: Props) {
  const [theme,    setTheme]    = useState<Theme>((profile as any).card_theme     ?? 'dark')
  const [colorIdx, setColorIdx] = useState<number>((profile as any).card_color_idx ?? 0)
  const [shape,    setShape]    = useState<CardShape>('landscape')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [loading,  setLoading]  = useState<'png' | 'pdf' | null>(null)

  const frontRef = useRef<HTMLDivElement>(null)
  const backRef  = useRef<HTMLDivElement>(null)

  const colors   = COLOR_PAIRS[colorIdx]
  const shapeObj = SHAPES.find(s => s.id === shape)!
  const { w: CW, h: CH } = shapeObj

  const name    = profile.full_name ?? ''
  const job     = (profile as any).job_title ?? ''
  const phone   = (profile as any).whatsapp  ?? (profile as any).phone ?? ''
  const email   = (profile as any).email     ?? ''
  const avatar  = profile.avatar_url ?? null

  /* Capture a DOM element → dataURL using dom-to-image */
  async function captureEl(el: HTMLElement): Promise<string> {
    const domtoimage = (await import('dom-to-image')).default
    return domtoimage.toPng(el, { width: el.offsetWidth * 2, height: el.offsetHeight * 2,
                                   style: { transform: 'scale(2)', transformOrigin: 'top left' } })
  }

  /* Draw QR into back element's placeholder */
  async function injectQR(backEl: HTMLElement) {
    const placeholder = backEl.querySelector('#qr-placeholder') as HTMLElement | null
    if (!placeholder) return
    const QR = await import('qrcode')
    const dataUrl = await QR.toDataURL(profileUrl || 'https://contactme.cc', {
      width: 240, margin: 1, color: { dark: colors.primary, light: '#FFFFFF' }
    })
    const img = document.createElement('img')
    img.src = dataUrl; img.width = 120; img.height = 120
    placeholder.innerHTML = ''
    placeholder.appendChild(img)
  }

  async function handlePng() {
    setLoading('png')
    try {
      if (!frontRef.current || !backRef.current) return
      await injectQR(backRef.current)
      await new Promise(r => setTimeout(r, 200))   // let DOM settle

      const [frontUrl, backUrl] = await Promise.all([
        captureEl(frontRef.current),
        captureEl(backRef.current),
      ])

      // Combine side by side on a canvas
      const GAP  = 16 * 2
      const pw   = CW * 2
      const ph   = CH * 2
      const c    = document.createElement('canvas')
      c.width    = pw * 2 + GAP
      c.height   = ph
      const ctx  = c.getContext('2d')!

      const fi = new Image(), bi = new Image()
      await Promise.all([
        new Promise<void>(r => { fi.onload = () => r(); fi.src = frontUrl }),
        new Promise<void>(r => { bi.onload = () => r(); bi.src = backUrl  }),
      ])
      ctx.drawImage(fi, 0,        0, pw, ph)
      ctx.drawImage(bi, pw + GAP, 0, pw, ph)

      c.toBlob(blob => {
        if (!blob) return
        const a = document.createElement('a')
        a.download = 'contactme-card.png'; a.href = URL.createObjectURL(blob); a.click()
      }, 'image/png')
    } catch(e) { console.error('PNG error', e) }
    finally { setLoading(null) }
  }

  async function handlePdf() {
    setLoading('pdf')
    try {
      if (!frontRef.current || !backRef.current) return
      await injectQR(backRef.current)
      await new Promise(r => setTimeout(r, 200))   // let DOM settle

      const [frontUrl, backUrl] = await Promise.all([
        captureEl(frontRef.current),
        captureEl(backRef.current),
      ])

      // Standard business card: 85.6 × 54 mm (landscape)
      const { jsPDF } = await import('jspdf')

      // Determine PDF size per shape
      let mmW: number, mmH: number, orient: 'landscape' | 'portrait'
      if (shape === 'portrait') { mmW = 54;   mmH = 85.6; orient = 'portrait'  }
      else if (shape === 'square') { mmW = 70; mmH = 70;  orient = 'portrait'  }
      else                       { mmW = 85.6; mmH = 54;  orient = 'landscape' }

      const pdf = new jsPDF({ orientation: orient, unit: 'mm', format: [mmW, mmH] })

      // Page 1 — Front
      pdf.addImage(frontUrl, 'PNG', 0, 0, mmW, mmH)

      // Page 2 — Back
      pdf.addPage([mmW, mmH], orient)
      pdf.addImage(backUrl,  'PNG', 0, 0, mmW, mmH)

      pdf.save('contactme-card.pdf')
    } catch(e) { console.error('PDF error', e) }
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

  const cardProps = {
    theme, primary: colors.primary, secondary: colors.secondary,
    name, jobTitle: job, phone, email, avatarUrl: avatar, profileUrl,
    shape, W: CW, H: CH,
  }

  return (
    <div className="space-y-6">
      {/* Live preview (flippable) */}
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-3 font-medium">معاينة البطاقة</p>
        <BusinessCardPreview
          name={name} jobTitle={job} bio={profile.bio ?? ''} phone={phone} email={email}
          logoUrl={avatar} qrValue={profileUrl} theme={theme}
          primaryColor={colors.primary} secondaryColor={colors.secondary} flippable={true}
        />
      </div>

      {/* Hidden elements for capture — positioned off-screen */}
      <div style={{ position: 'fixed', top: -9999, left: -9999, pointerEvents: 'none', zIndex: -1 }}>
        <div ref={frontRef}>
          <CardFace side="front" {...cardProps} />
        </div>
        <div ref={backRef} style={{ marginTop: 8 }}>
          <CardFace side="back" {...cardProps} />
        </div>
      </div>

      {/* Shape */}
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">شكل البطاقة</p>
        <div className="grid grid-cols-3 gap-2">
          {SHAPES.map(s => (
            <button key={s.id} onClick={() => setShape(s.id)}
              className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-medium transition-all border ${
                shape === s.id ? 'border-[#6366F1] bg-[#6366F110] text-[#6366F1]'
                               : 'border-[var(--border)] text-[var(--text-muted)]' }`}>
              <span className="text-lg">{s.id === 'landscape' ? '▬' : s.id === 'square' ? '■' : '▮'}</span>
              {s.label}
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
                theme === t.id ? 'border-[#6366F1] bg-[#6366F110] text-[#6366F1]'
                               : 'border-[var(--border)] text-[var(--text-muted)]' }`}>
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
                colorIdx === idx ? 'border-[#6366F1] scale-105' : 'border-[var(--border)]' }`}>
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
          {loading === 'pdf' ? <Spinner /> : '📄'} تحميل PDF
        </button>
        <button onClick={handlePng} disabled={!!loading}
          className="py-3 rounded-xl text-sm font-semibold border border-[var(--border)] hover:border-[#6366F1] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading === 'png' ? <Spinner /> : '🖼'} تحميل PNG
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
