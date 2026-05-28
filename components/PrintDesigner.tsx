'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import toast from 'react-hot-toast'
import BusinessCardPreview from '@/components/BusinessCardPreview'

type Theme = 'dark' | 'light' | 'gradient' | 'minimal'

interface Step { icon: string; title: string; description: string }

interface PrintDesignerProps {
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

export default function PrintDesigner({ title, subtitle, steps, downloadPdfLabel, downloadPngLabel, printLabel, noteLabel, profileName, profileTitle, profilePhone, profileEmail }: PrintDesignerProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState<Theme>('dark')
  const [colors, setColors] = useState(COLOR_PRESETS[0])
  const [name, setName] = useState(profileName || '')
  const [jobTitle, setJobTitle] = useState(profileTitle || '')
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState(profilePhone || '')
  const [email, setEmail] = useState(profileEmail || '')
  const [qrValue, setQrValue] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('الحجم الأقصى 2MB'); return }
    const reader = new FileReader()
    reader.onload = ev => setLogoUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function captureCanvas() {
    const el = printRef.current
    if (!el) throw new Error('not found')
    return html2canvas(el, { backgroundColor: '#ffffff', scale: 3, useCORS: true })
  }

  async function handleDownloadPNG() {
    try { setLoading(true); const c = await captureCanvas(); const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = 'contactme-card.png'; a.click(); toast.success('تم التحميل') }
    catch { toast.error('فشل التحميل') } finally { setLoading(false) }
  }

  async function handleDownloadPDF() {
    try {
      setLoading(true)
      const c = await captureCanvas()
      const pdf = new jsPDF('landscape', 'pt', 'a4')
      const w = pdf.internal.pageSize.getWidth()
      pdf.addImage(c.toDataURL('image/png'), 'PNG', 0, 20, w, (c.height * w) / c.width)
      pdf.save('contactme-card.pdf'); toast.success('تم التحميل')
    } catch { toast.error('فشل التحميل') } finally { setLoading(false) }
  }

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
        <div className="rounded-3xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div ref={printRef} className="p-6 rounded-2xl bg-white">
            <BusinessCardPreview
              name={name || 'اسمك هنا'} jobTitle={jobTitle || 'المسمى الوظيفي'} bio={bio}
              phone={phone || '+966 5X XXX XXXX'} email={email || 'email@example.com'}
              logoUrl={logoUrl} qrValue={qrValue || 'https://contactme.cc'}
              theme={theme} primaryColor={colors.primary} secondaryColor={colors.secondary}
              flippable={true}
            />
          </div>
          <p className="text-center text-xs mt-3" style={{ color: 'var(--text-muted)' }}>اضغط على البطاقة لرؤية الخلف مع QR</p>
        </div>

        {/* Controls */}
        <div className="rounded-3xl p-5 space-y-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

          {/* البيانات */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>البيانات</p>
            <div className="space-y-2">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="الاسم الكامل"
                className="w-full text-sm px-3 py-2 rounded-xl outline-none"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="المسمى الوظيفي"
                className="w-full text-sm px-3 py-2 rounded-xl outline-none"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="نبذة قصيرة..." rows={2}
                className="w-full text-sm px-3 py-2 rounded-xl outline-none resize-none"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="رقم الهاتف"
                className="w-full text-sm px-3 py-2 rounded-xl outline-none" dir="ltr"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="البريد الإلكتروني"
                className="w-full text-sm px-3 py-2 rounded-xl outline-none" dir="ltr"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              <input value={qrValue} onChange={e => setQrValue(e.target.value)} placeholder="رابط QR (موقعك أو إيميلك)"
                className="w-full text-sm px-3 py-2 rounded-xl outline-none" dir="ltr"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </div>
          </div>

          {/* الشعار */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>الشعار (اختياري)</p>
            <label className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
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

          {/* التصميم */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>التصميم</p>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map(th => (
                <button key={th.id} onClick={() => setTheme(th.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                  style={{ background: theme === th.id ? '#4B9EFF18' : 'var(--bg)', border: `1.5px solid ${theme === th.id ? '#4B9EFF' : 'var(--border)'}`, color: theme === th.id ? '#4B9EFF' : 'var(--text)' }}>
                  <div className="w-5 h-5 rounded-md flex-shrink-0 shadow-sm"
                    style={{ background: th.preview, border: '1px solid rgba(0,0,0,0.1)' }} />
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          {/* الألوان */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>الألوان</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((c, i) => (
                <button key={i} onClick={() => setColors(c)}
                  className="w-8 h-8 rounded-xl transition-transform hover:scale-110 active:scale-95"
                  style={{ background: `linear-gradient(135deg,${c.primary},${c.secondary})`, outline: colors.primary === c.primary ? `2.5px solid ${c.primary}` : '2.5px solid transparent', outlineOffset: '2px' }} />
              ))}
              <div className="relative">
                <input type="color" value={colors.primary} onChange={e => setColors({ ...colors, primary: e.target.value })}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'var(--bg)', border: '1.5px dashed var(--border)' }}>+</div>
              </div>
            </div>
          </div>

          {/* أزرار التحميل */}
          <div className="space-y-2 pt-1">
            <button onClick={handleDownloadPDF} disabled={loading} className="btn-primary w-full text-sm disabled:opacity-50">{downloadPdfLabel}</button>
            <button onClick={handleDownloadPNG} disabled={loading} className="btn-secondary w-full text-sm disabled:opacity-50">{downloadPngLabel}</button>
             
          </div>
        </div>
      </div>
    </div>
  )
}
