'use client'

import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import toast from 'react-hot-toast'

type Theme = 'dark' | 'light' | 'gradient' | 'minimal'

interface Step { icon: string; title: string; description: string }

interface Props {
  title: string; subtitle: string; steps: Step[]
  downloadPdfLabel: string; downloadPngLabel: string; printLabel: string; noteLabel: string
  profileName?: string; profileTitle?: string; profilePhone?: string; profileEmail?: string
}

const THEMES: { id: Theme; label: string; preview: string }[] = [
  { id: 'dark',     label: 'كلاسيك داكن', preview: 'linear-gradient(135deg,#1A1A3E,#2d2d5e)' },
  { id: 'light',    label: 'ناصع',         preview: '#FFFFFF' },
  { id: 'gradient', label: 'متدرج',        preview: 'linear-gradient(135deg,#4B9EFF,#8B5CF6)' },
  { id: 'minimal',  label: 'بسيط',         preview: '#F8FAFC' },
]

const COLOR_PRESETS = [
  { primary: '#4B9EFF', secondary: '#8B5CF6' },
  { primary: '#10B981', secondary: '#3B82F6' },
  { primary: '#F59E0B', secondary: '#EF4444' },
  { primary: '#EC4899', secondary: '#8B5CF6' },
  { primary: '#14B8A6', secondary: '#6366F1' },
  { primary: '#F97316', secondary: '#EAB308' },
]

export default function PrintDesigner({
  title, subtitle, steps, downloadPdfLabel, downloadPngLabel, noteLabel,
  profileName, profileTitle, profilePhone, profileEmail,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [theme, setTheme]     = useState<Theme>('dark')
  const [colors, setColors]   = useState(COLOR_PRESETS[0])
  const [name, setName]       = useState(profileName || '')
  const [jobTitle, setJobTitle] = useState(profileTitle || '')
  const [bio, setBio]         = useState('')
  const [phone, setPhone]     = useState(profilePhone || '')
  const [email, setEmail]     = useState(profileEmail || '')
  const [qrValue, setQrValue] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [flipped, setFlipped] = useState(false)

  const isDark = theme === 'dark' || theme === 'gradient'
  const qr     = qrValue || 'https://contactme.cc'

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('الحجم الأقصى 2MB'); return }
    const reader = new FileReader()
    reader.onload = ev => setLogoUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  // ── Pure Canvas renderer ─────────────────────────────────────────────────

  async function loadImg(src: string): Promise<HTMLImageElement> {
    const img = new Image(); img.crossOrigin = 'anonymous'
    return new Promise(r => { img.onload = () => r(img); img.onerror = () => r(img); img.src = src })
  }

  function drawBg(ctx: CanvasRenderingContext2D, W: number, H: number, ox: number) {
    if (theme === 'gradient') {
      const g = ctx.createLinearGradient(ox, 0, ox + W, H)
      g.addColorStop(0, colors.primary); g.addColorStop(1, colors.secondary); ctx.fillStyle = g
    } else if (theme === 'dark') {
      const g = ctx.createLinearGradient(ox, 0, ox + W, H)
      g.addColorStop(0, '#1A1A3E'); g.addColorStop(1, '#2d2d5e'); ctx.fillStyle = g
    } else {
      ctx.fillStyle = theme === 'light' ? '#FFFFFF' : '#F8FAFC'
    }
    ctx.fillRect(ox, 0, W, H)
    if (!isDark) {
      ctx.strokeStyle = theme === 'light' ? '#E5E7EB' : '#E2E8F0'
      ctx.lineWidth = 1; ctx.strokeRect(ox + .5, .5, W - 1, H - 1)
    }
  }

  async function drawFront(ctx: CanvasRenderingContext2D, W: number, H: number, ox: number) {
    const txtClr  = isDark ? '#FFF' : '#111827'
    const subClr  = theme === 'dark' ? '#93C5FD' : theme === 'gradient' ? 'rgba(255,255,255,0.85)' : colors.primary
    const metaClr = isDark ? 'rgba(255,255,255,0.65)' : '#6B7280'
    const dotClr  = theme === 'gradient' ? 'rgba(255,255,255,0.9)' : isDark ? '#FFF' : colors.primary
    const n       = name || 'اسمك هنا'
    const initial = n.charAt(0)

    drawBg(ctx, W, H, ox)

    // Avatar top-right (RTL — avatar يكون على اليمين)
    const AS = 44, AX = ox + W - AS - 16, AY = 16
    if (logoUrl) {
      const img = await loadImg(logoUrl)
      ctx.save(); ctx.beginPath(); ctx.roundRect(AX, AY, AS, AS, 10); ctx.clip()
      ctx.drawImage(img, AX, AY, AS, AS); ctx.restore()
    } else {
      ctx.beginPath(); ctx.roundRect(AX, AY, AS, AS, 10)
      if (theme === 'gradient') { ctx.fillStyle = 'rgba(255,255,255,0.25)' }
      else {
        const g = ctx.createLinearGradient(AX, AY, AX + AS, AY + AS)
        g.addColorStop(0, colors.primary); g.addColorStop(1, colors.secondary); ctx.fillStyle = g
      }
      ctx.fill()
      ctx.fillStyle = '#FFF'
      ctx.font = `bold ${Math.round(AS * .4)}px Tahoma, Arial`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(initial, AX + AS / 2, AY + AS / 2)
    }

    // Name + job — RTL (نص عربي من اليمين)
    ctx.save()
    ctx.direction = 'rtl'; ctx.textAlign = 'right'; ctx.textBaseline = 'top'
    ctx.fillStyle = txtClr
    ctx.font = `bold 14px Tahoma, Arial`
    ctx.fillText(n, AX - 10, AY + 4)
    ctx.fillStyle = subClr
    ctx.font = '12px Tahoma, Arial'
    ctx.fillText(jobTitle || 'المسمى الوظيفي', AX - 10, AY + 22)
    ctx.restore()

    // Dot grid — top-left
    const GX = ox + 16, GY = AY, GS = Math.round(AS * .95)
    ctx.beginPath(); ctx.roundRect(GX - 4, GY - 4, GS + 8, GS + 8, 8)
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.12)' : `${colors.primary}22`; ctx.fill()
    const ds = Math.round(GS / 3) - 2
    for (let i = 0; i < 9; i++) {
      if (![0,1,3,4,7,8].includes(i)) continue
      ctx.beginPath(); ctx.roundRect(GX + (i % 3) * (ds + 2), GY + Math.floor(i / 3) * (ds + 2), ds, ds, 2)
      ctx.fillStyle = dotClr; ctx.fill()
    }

    // Divider
    const divY = Math.round(H * .55)
    ctx.save(); ctx.globalAlpha = .18; ctx.fillStyle = txtClr
    ctx.fillRect(ox + 16, divY, W - 32, 1); ctx.restore()

    // Contact info — LTR (أرقام وروابط من اليسار)
    ctx.save()
    ctx.direction = 'ltr'; ctx.textAlign = 'left'; ctx.textBaseline = 'top'
    ctx.fillStyle = metaClr; ctx.font = '11px Arial, sans-serif'
    let cy = divY + 12; const lh = 20
    if (phone) { ctx.fillText('📞  ' + phone, ox + 16, cy); cy += lh }
    if (email) { ctx.fillText('✉  '  + email, ox + 16, cy); cy += lh }
    ctx.font = '10px Arial, sans-serif'
    ctx.fillText('🌐  ' + qr, ox + 16, cy)
    ctx.restore()
  }

  async function drawBack(ctx: CanvasRenderingContext2D, W: number, H: number, ox: number) {
    const metaClr = isDark ? 'rgba(255,255,255,0.6)' : '#6B7280'
    drawBg(ctx, W, H, ox)

    const QR = await import('qrcode')
    const qrSize = Math.round(Math.min(W, H) * .48)
    const qrX    = ox + Math.round((W - qrSize) / 2)
    const qrY    = Math.round((H - qrSize) / 2) - 10
    const pad    = 12

    const dataUrl = await QR.toDataURL(qr, {
      width: qrSize * 3, margin: 1, color: { dark: colors.primary, light: '#FFFFFF' }
    })

    ctx.beginPath(); ctx.roundRect(qrX - pad, qrY - pad, qrSize + pad * 2, qrSize + pad * 2, 12)
    ctx.fillStyle = '#FFF'; ctx.fill()

    const qrImg = await loadImg(dataUrl)
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

    // URL — force LTR
    ctx.save()
    ctx.direction = 'ltr'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'
    ctx.fillStyle = metaClr; ctx.font = '9px Arial, sans-serif'
    ctx.fillText(qr, ox + W / 2, qrY + qrSize + pad + 6)
    ctx.restore()
  }

  async function buildCanvas(): Promise<HTMLCanvasElement> {
    const PX = 3, W = 480, H = 274, GAP = 20
    const cv = document.createElement('canvas')
    cv.width = (W * 2 + GAP) * PX; cv.height = H * PX
    const ctx = cv.getContext('2d')!
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height)
    ctx.scale(PX, PX)
    await drawFront(ctx, W, H, 0)
    await drawBack(ctx, W, H, W + GAP)
    return cv
  }

  async function handlePDF() {
    setLoading(true)
    try {
      const cv = await buildCanvas()
      const { jsPDF } = await import('jspdf')
      // Both sides side-by-side: 171.2 × 54 mm
      const mmW = 175.2, mmH = 54
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [mmW, mmH] })
      pdf.addImage(cv.toDataURL('image/png'), 'PNG', 0, 0, mmW, mmH)
      pdf.save('contactme-card.pdf'); toast.success('تم التحميل')
    } catch { toast.error('فشل التحميل') } finally { setLoading(false) }
  }

  async function handlePNG() {
    setLoading(true)
    try {
      const cv = await buildCanvas()
      cv.toBlob(blob => {
        if (!blob) return
        const a = document.createElement('a')
        a.download = 'contactme-card.png'; a.href = URL.createObjectURL(blob); a.click()
        toast.success('تم التحميل')
      }, 'image/png')
    } catch { toast.error('فشل التحميل') } finally { setLoading(false) }
  }

  // ── Preview JSX ────────────────────────────────────────────────────────────

  const bgStyle = theme === 'gradient'
    ? `linear-gradient(135deg,${colors.primary},${colors.secondary})`
    : theme === 'dark' ? 'linear-gradient(135deg,#1A1A3E,#2d2d5e)'
    : theme === 'light' ? '#FFFFFF' : '#F8FAFC'

  const txtClr  = isDark ? '#FFF' : '#111827'
  const subClr  = theme === 'dark' ? '#93C5FD' : theme === 'gradient' ? 'rgba(255,255,255,0.85)' : colors.primary
  const metaClr = isDark ? 'rgba(255,255,255,0.65)' : '#6B7280'
  const border  = isDark ? 'none' : `1px solid ${theme === 'light' ? '#E5E7EB' : '#E2E8F0'}`
  const initial = (name || 'أ').charAt(0)

  const FrontFace = (
    <div className="w-full h-full rounded-2xl p-4 flex flex-col justify-between overflow-hidden"
      style={{ background: bgStyle, border, direction: 'rtl' }}>
      <div className="flex items-start justify-between">
        {/* Dot grid — يسار في RTL */}
        <div className="rounded-xl p-2 flex-shrink-0"
          style={{ background: isDark ? 'rgba(255,255,255,0.12)' : `${colors.primary}22` }}>
          <div className="w-7 h-7 grid grid-cols-3 gap-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-[2px]"
                style={{ background: [0,1,3,4,7,8].includes(i)
                  ? (theme === 'gradient' ? 'rgba(255,255,255,0.9)' : isDark ? '#FFF' : colors.primary)
                  : 'transparent' }} />
            ))}
          </div>
        </div>
        {/* Avatar + name — يمين في RTL */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="font-bold text-sm" style={{ color: txtClr }}>{name || 'اسمك هنا'}</div>
            <div className="text-xs mt-0.5" style={{ color: subClr }}>{jobTitle || 'المسمى الوظيفي'}</div>
          </div>
          {logoUrl ? (
            <img src={logoUrl} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{ background: theme === 'gradient' ? 'rgba(255,255,255,0.25)' : `linear-gradient(135deg,${colors.primary},${colors.secondary})` }}>
              {initial}
            </div>
          )}
        </div>
      </div>
      <div style={{ height: 1, background: txtClr, opacity: .15 }} />
      {/* Contact — LTR لأن الأرقام والروابط */}
      <div className="flex flex-col gap-1" dir="ltr">
        {phone && <span className="text-[10px]" style={{ color: metaClr }}>📞  {phone}</span>}
        {email && <span className="text-[10px]" style={{ color: metaClr }}>✉  {email}</span>}
        <span className="text-[10px]" style={{ color: metaClr }}>🌐  {qr}</span>
      </div>
    </div>
  )

  const BackFace = (
    <div className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-3 overflow-hidden"
      style={{ background: bgStyle, border }}>
      <div className="p-3 rounded-xl bg-white shadow-lg">
        <QRCodeCanvas value={qr} size={90} fgColor={colors.primary} bgColor="#FFFFFF" level="H" />
      </div>
      <p className="text-[9px] px-4 text-center break-all" dir="ltr" style={{ color: metaClr }}>{qr}</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl p-8" style={{ background: 'linear-gradient(135deg,#4B9EFF08,#8B5CF608)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#4B9EFF' }}>{noteLabel}</p>
        <h2 className="text-2xl font-extrabold mb-2">{title}</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {steps.map((s, i) => (
            <div key={i} className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Preview */}
        <div className="rounded-3xl p-6 space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>معاينة الوجه الأمامي</p>
          <div style={{ aspectRatio: '1.75/1' }}>{FrontFace}</div>
          <p className="text-xs font-bold mt-2" style={{ color: 'var(--text-muted)' }}>معاينة الوجه الخلفي (QR)</p>
          <div style={{ aspectRatio: '1.75/1' }}>{BackFace}</div>
          <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            ✅ كلا الوجهين في ملف واحد عند التحميل
          </p>
        </div>

        {/* Controls */}
        <div className="rounded-3xl p-5 space-y-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>البيانات</p>
            <div className="space-y-2">
              {[
                { val: name,     set: setName,     ph: 'الاسم الكامل',        dir: 'rtl' },
                { val: jobTitle, set: setJobTitle,  ph: 'المسمى الوظيفي',      dir: 'rtl' },
                { val: phone,    set: setPhone,     ph: 'رقم الهاتف',          dir: 'ltr' },
                { val: email,    set: setEmail,     ph: 'البريد الإلكتروني',   dir: 'ltr' },
                { val: qrValue,  set: setQrValue,   ph: 'رابط QR (موقعك أو إيميلك)', dir: 'ltr' },
              ].map((f, i) => (
                <input key={i} value={f.val} onChange={e => f.set(e.target.value)}
                  placeholder={f.ph} dir={f.dir as any}
                  className="w-full text-sm px-3 py-2 rounded-xl outline-none"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              ))}
            </div>
          </div>

          {/* Logo */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>الشعار (اختياري)</p>
            <label className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
              style={{ background: 'var(--bg)', border: '1.5px dashed var(--border)' }}>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              {logoUrl ? (
                <><img src={logoUrl} alt="logo" className="w-8 h-8 rounded-lg object-contain" />
                  <span className="text-xs font-medium" style={{ color: '#4B9EFF' }}>تغيير الشعار</span></>
              ) : (
                <><div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                  style={{ background: `${colors.primary}18` }}>🖼️</div>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>ارفع شعارك (PNG, JPG — حد 2MB)</span></>
              )}
            </label>
            {logoUrl && (
              <button onClick={() => setLogoUrl(null)} className="text-xs mt-1 px-2" style={{ color: '#EF4444' }}>حذف الشعار</button>
            )}
          </div>

          {/* Theme */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>التصميم</p>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map(th => (
                <button key={th.id} onClick={() => setTheme(th.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                  style={{ background: theme === th.id ? '#4B9EFF18' : 'var(--bg)', border: `1.5px solid ${theme === th.id ? '#4B9EFF' : 'var(--border)'}`, color: theme === th.id ? '#4B9EFF' : 'var(--text)' }}>
                  <div className="w-5 h-5 rounded-md flex-shrink-0" style={{ background: th.preview, border: '1px solid rgba(0,0,0,0.1)' }} />
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>الألوان</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((c, i) => (
                <button key={i} onClick={() => setColors(c)}
                  className="w-8 h-8 rounded-xl transition-transform hover:scale-110"
                  style={{ background: `linear-gradient(135deg,${c.primary},${c.secondary})`, outline: colors.primary === c.primary ? `2.5px solid ${c.primary}` : '2.5px solid transparent', outlineOffset: '2px' }} />
              ))}
              <div className="relative">
                <input type="color" value={colors.primary} onChange={e => setColors({ ...colors, primary: e.target.value })}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--bg)', border: '1.5px dashed var(--border)' }}>+</div>
              </div>
            </div>
          </div>

          {/* Download buttons — NO print */}
          <div className="space-y-2 pt-1">
            <button onClick={handlePDF} disabled={loading}
              className="btn-primary w-full text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? '⏳' : '📄'} {downloadPdfLabel}
            </button>
            <button onClick={handlePNG} disabled={loading}
              className="btn-secondary w-full text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? '⏳' : '🖼'} {downloadPngLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
