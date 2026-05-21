'use client'

import { useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

type Theme = 'dark' | 'light' | 'gradient' | 'minimal'

const THEMES: { id: Theme; label: string; emoji: string }[] = [
  { id: 'dark',     label: 'داكن',  emoji: '🌙' },
  { id: 'light',    label: 'فاتح',  emoji: '☀️' },
  { id: 'gradient', label: 'متدرج', emoji: '🌈' },
  { id: 'minimal',  label: 'بسيط',  emoji: '⬜' },
]

const COLOR_PAIRS = [
  { primary: '#6366F1', secondary: '#A855F7', name: 'برايم' },
  { primary: '#4B9EFF', secondary: '#8B5CF6', name: 'اوشن' },
  { primary: '#10B981', secondary: '#3B82F6', name: 'نعناع' },
  { primary: '#F59E0B', secondary: '#EF4444', name: 'غروب' },
  { primary: '#EC4899', secondary: '#8B5CF6', name: 'زهري' },
  { primary: '#14B8A6', secondary: '#6366F1', name: 'تيل' },
  { primary: '#F97316', secondary: '#EAB308', name: 'ذهبي' },
  { primary: '#1E293B', secondary: '#475569', name: 'رمادي' },
]

export default function BusinessCardDesigner() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [colorIdx, setColorIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [form, setForm] = useState({
    name: '',
    jobTitle: '',
    phone: '',
    email: '',
    website: '',
  })
  const cardRef = useRef<HTMLDivElement>(null)

  const colors = COLOR_PAIRS[colorIdx]

  const themes = {
    dark:     { bg: 'linear-gradient(135deg, #1A1A3E, #2d2d5e)', text: '#FFF', subtext: '#93C5FD', iconBg: 'rgba(255,255,255,0.12)', metaText: 'rgba(255,255,255,0.65)', border: 'none' },
    light:    { bg: '#FFFFFF', text: '#111827', subtext: colors.primary, iconBg: `${colors.primary}18`, metaText: '#6B7280', border: '1px solid #E5E7EB' },
    gradient: { bg: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, text: '#FFF', subtext: 'rgba(255,255,255,0.85)', iconBg: 'rgba(255,255,255,0.22)', metaText: 'rgba(255,255,255,0.75)', border: 'none' },
    minimal:  { bg: '#F8FAFC', text: '#0F172A', subtext: '#64748B', iconBg: `${colors.primary}18`, metaText: '#94A3B8', border: '1px solid #E2E8F0' },
  }

  const t = themes[theme]
  const initial = form.name ? form.name.charAt(0).toUpperCase() : 'أ'
  const qrValue = form.website || form.email || 'https://contactme.cc'

  async function handleDownload() {
    const { default: domtoimage } = await import('dom-to-image')
    const node = cardRef.current
    if (!node) return
    // تأكد الوجه الأمامي ظاهر
    setFlipped(false)
    setTimeout(async () => {
      try {
        const dataUrl = await domtoimage.toPng(node as HTMLElement)
        const a = document.createElement('a')
        a.download = 'business-card.png'
        a.href = dataUrl
        a.click()
      } catch (e) {
        console.error(e)
      }
    }, 300)
  }

  const Front = (
    <div className="w-full h-full rounded-2xl overflow-hidden p-5 flex flex-col justify-between"
      style={{ background: t.bg, border: t.border, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-base flex-shrink-0"
            style={{ background: theme === 'gradient' ? 'rgba(255,255,255,0.25)' : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            {initial}
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight" style={{ color: t.text }}>
              {form.name || 'اسمك هنا'}
            </h3>
            <p className="text-xs mt-0.5 font-medium" style={{ color: t.subtext }}>
              {form.jobTitle || 'المسمى الوظيفي'}
            </p>
          </div>
        </div>
        <div className="rounded-xl p-2.5 flex-shrink-0" style={{ background: t.iconBg }}>
          <div className="w-8 h-8 grid grid-cols-3 gap-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-[2px]"
                style={{ background: [0,1,3,4,7,8].includes(i) ? (theme === 'gradient' ? 'rgba(255,255,255,0.9)' : theme === 'dark' ? '#FFF' : colors.primary) : 'transparent' }} />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full h-px opacity-20" style={{ background: t.text }} />

      <div className="flex flex-col gap-1.5">
        {form.phone && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: t.metaText }}>
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="text-[11px]" style={{ color: t.metaText }}>{form.phone}</span>
          </div>
        )}
        {form.email && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: t.metaText }}>
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span className="text-[11px]" style={{ color: t.metaText }}>{form.email}</span>
          </div>
        )}
        {form.website && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: t.metaText }}>
              <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16A8 8 0 0010 2zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
            </svg>
            <span className="text-[11px]" style={{ color: t.metaText }}>{form.website}</span>
          </div>
        )}
      </div>
    </div>
  )

  const Back = (
    <div className="w-full h-full rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-3"
      style={{ background: t.bg, border: t.border, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
      <div className="p-3 rounded-xl bg-white shadow-lg">
        <QRCodeCanvas value={qrValue} size={100} fgColor={colors.primary} bgColor="#FFFFFF" level="H" includeMargin={false} />
      </div>
      <p className="text-[10px] px-6 text-center truncate w-full" style={{ color: t.metaText }}>{qrValue}</p>
    </div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Left — Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">بياناتك</h3>

          {[
            { key: 'name',     label: 'الاسم الكامل',    placeholder: 'محمد عبدالله' },
            { key: 'jobTitle', label: 'المسمى الوظيفي',  placeholder: 'مدير تنفيذي' },
            { key: 'phone',    label: 'رقم الجوال',      placeholder: '+966 5X XXX XXXX' },
            { key: 'email',    label: 'البريد الإلكتروني', placeholder: 'you@example.com' },
            { key: 'website',  label: 'الموقع / الرابط',  placeholder: 'https://contactme.cc/username' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">{f.label}</label>
              <input
                type="text"
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="input w-full"
              />
            </div>
          ))}

          {/* Theme */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">السمة</label>
            <div className="grid grid-cols-4 gap-2">
              {THEMES.map(th => (
                <button key={th.id} onClick={() => setTheme(th.id)}
                  className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-medium transition-all border ${
                    theme === th.id ? 'border-[#6366F1] bg-[#6366F110] text-[#6366F1]' : 'border-[var(--border)] text-[var(--text-muted)]'
                  }`}>
                  <span className="text-base">{th.emoji}</span>
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">الألوان</label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PAIRS.map((pair, idx) => (
                <button key={idx} onClick={() => setColorIdx(idx)}
                  className={`flex flex-col items-center gap-1.5 py-2 px-1 rounded-xl transition-all border ${
                    colorIdx === idx ? 'border-[#6366F1] scale-105' : 'border-[var(--border)]'
                  }`}>
                  <div className="w-8 h-3.5 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${pair.primary}, ${pair.secondary})` }} />
                  <span className="text-[10px] text-[var(--text-muted)]">{pair.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">المعاينة</h3>

          {/* Card */}
          <div style={{ perspective: '1000px' }}>
            <div ref={cardRef}
              onClick={() => setFlipped(f => !f)}
              className="w-full cursor-pointer transition-transform duration-500"
              style={{ aspectRatio: '1.75/1', transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
              <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>{Front}</div>
              <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>{Back}</div>
            </div>
          </div>

          <p className="text-center text-[11px] text-[var(--text-muted)]">
            {flipped ? '← اضغط للوجه الأمامي' : 'اضغط لرؤية الخلف مع QR →'}
          </p>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            تحميل البطاقة PNG
          </button>

          <p className="text-center text-[11px] text-[var(--text-muted)]">
            💡 مجاني تماماً — لا حساب مطلوب
          </p>
        </div>
      </div>
    </div>
  )
}
