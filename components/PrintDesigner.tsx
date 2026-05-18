'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import toast from 'react-hot-toast'
import BusinessCardPreview from '@/components/BusinessCardPreview'

type Theme = 'dark' | 'light' | 'gradient' | 'minimal'

interface Step {
  icon: string
  title: string
  description: string
}

interface PrintDesignerProps {
  title: string
  subtitle: string
  steps: Step[]
  downloadPdfLabel: string
  downloadPngLabel: string
  printLabel: string
  noteLabel: string
  // بيانات البروفايل (اختيارية — إذا موجودة تُملأ تلقائياً)
  profileName?: string
  profileTitle?: string
  profilePhone?: string
  profileEmail?: string
}

const THEMES: { id: Theme; label: string; preview: string }[] = [
  { id: 'dark',     label: 'كلاسيك داكن', preview: 'linear-gradient(135deg, #1A1A3E, #2d2d5e)' },
  { id: 'light',    label: 'ناصع',         preview: '#FFFFFF' },
  { id: 'gradient', label: 'متدرج',        preview: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' },
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
  title,
  subtitle,
  steps,
  downloadPdfLabel,
  downloadPngLabel,
  printLabel,
  noteLabel,
  profileName,
  profileTitle,
  profilePhone,
  profileEmail,
}: PrintDesignerProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState<Theme>('dark')
  const [colors, setColors] = useState(COLOR_PRESETS[0])

  // بيانات البطاقة — من البروفايل إذا موجودة، وإلا يدوية
  const [name,     setName]     = useState(profileName  || '')
  const [jobTitle, setJobTitle] = useState(profileTitle || '')
  const [phone,    setPhone]    = useState(profilePhone || '')
  const [email,    setEmail]    = useState(profileEmail || '')

  async function captureCanvas() {
    const el = printRef.current
    if (!el) throw new Error('not found')
    return html2canvas(el, { backgroundColor: '#ffffff', scale: 3, useCORS: true })
  }

  async function handleDownloadPNG() {
    try {
      setLoading(true)
      const canvas = await captureCanvas()
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = 'contactme-business-card.png'
      a.click()
      toast.success('تم تحميل الصورة')
    } catch { toast.error('فشل التحميل') }
    finally { setLoading(false) }
  }

  async function handleDownloadPDF() {
    try {
      setLoading(true)
      const canvas = await captureCanvas()
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('landscape', 'pt', 'a4')
      const w = pdf.internal.pageSize.getWidth()
      const h = (canvas.height * w) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 20, w, h)
      pdf.save('contactme-business-card.pdf')
      toast.success('تم تحميل PDF')
    } catch { toast.error('فشل التحميل') }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-3xl p-8" style={{ background: 'linear-gradient(135deg, #4B9EFF08, #8B5CF608)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#4B9EFF' }}>{noteLabel}</p>
        <h2 className="text-2xl font-extrabold mb-2">{title}</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {steps.map((step, i) => (
            <div key={i} className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="text-2xl mb-2">{step.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main editor */}
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">

        {/* Preview */}
        <div className="rounded-3xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div ref={printRef} className="p-6 rounded-2xl bg-white">
            <BusinessCardPreview
              name={name || 'اسمك هنا'}
              jobTitle={jobTitle || 'المسمى الوظيفي'}
              phone={phone || '+966 5X XXX XXXX'}
              email={email || 'email@example.com'}
              theme={theme}
              primaryColor={colors.primary}
              secondaryColor={colors.secondary}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="rounded-3xl p-5 space-y-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

          {/* البيانات */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>البيانات</p>
            <div className="space-y-2">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="الاسم الكامل"
                className="w-full text-sm px-3 py-2 rounded-xl outline-none transition-all"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
              <input
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="المسمى الوظيفي"
                className="w-full text-sm px-3 py-2 rounded-xl outline-none transition-all"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="رقم الهاتف"
                className="w-full text-sm px-3 py-2 rounded-xl outline-none transition-all"
                dir="ltr"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                className="w-full text-sm px-3 py-2 rounded-xl outline-none transition-all"
                dir="ltr"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>

          {/* التصميم */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>التصميم</p>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                  style={{
                    background: theme === t.id ? '#4B9EFF18' : 'var(--bg)',
                    border: `1.5px solid ${theme === t.id ? '#4B9EFF' : 'var(--border)'}`,
                    color: theme === t.id ? '#4B9EFF' : 'var(--text)',
                  }}
                >
                  <div className="w-5 h-5 rounded-md flex-shrink-0 shadow-sm"
                    style={{ background: t.preview, border: '1px solid rgba(0,0,0,0.1)' }} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* الألوان */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>الألوان</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setColors(c)}
                  className="w-8 h-8 rounded-xl transition-transform hover:scale-110 active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
                    outline: colors.primary === c.primary ? `2.5px solid ${c.primary}` : '2.5px solid transparent',
                    outlineOffset: '2px',
                  }}
                />
              ))}
              {/* Custom color */}
              <div className="relative">
                <input
                  type="color"
                  value={colors.primary}
                  onChange={e => setColors({ ...colors, primary: e.target.value })}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'var(--bg)', border: '1.5px dashed var(--border)' }}>
                  +
                </div>
              </div>
            </div>
          </div>

          {/* أزرار التحميل */}
          <div className="space-y-2 pt-1">
            <button onClick={handleDownloadPDF} disabled={loading}
              className="btn-primary w-full text-sm disabled:opacity-50">
              {downloadPdfLabel}
            </button>
            <button onClick={handleDownloadPNG} disabled={loading}
              className="btn-secondary w-full text-sm disabled:opacity-50">
              {downloadPngLabel}
            </button>
            <button onClick={() => window.print()}
              className="btn-secondary w-full text-sm">
              {printLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
