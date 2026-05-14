'use client'

import { useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import toast from 'react-hot-toast'

interface Props {
  profileUrl: string
  isPro: boolean
  username: string
}

const COLOR_PRESETS = [
  { fg: '#1A1A3E', bg: '#FFFFFF', label: 'كلاسيكي' },
  { fg: '#4B9EFF', bg: '#FFFFFF', label: 'أزرق' },
  { fg: '#8B5CF6', bg: '#FFFFFF', label: 'بنفسجي' },
  { fg: '#FFFFFF', bg: '#1A1A3E', label: 'داكن' },
  { fg: '#FFFFFF', bg: '#4B9EFF', label: 'أزرق داكن' },
  { fg: '#10B981', bg: '#FFFFFF', label: 'أخضر' },
]

export default function QRDownloader({ profileUrl, isPro, username }: Props) {
  const [fgColor, setFgColor] = useState('#1A1A3E')
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const canvasRef = useRef<HTMLDivElement>(null)

  function handleDownload() {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) { toast.error('حدث خطأ أثناء التحميل'); return }
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `contactme-${username}-qr.png`
    a.click()
    toast.success('تم تحميل رمز QR')
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div ref={canvasRef} className="p-4 rounded-2xl shadow-lg" style={{ background: bgColor }}>
        <QRCodeCanvas
          value={profileUrl}
          size={200}
          fgColor={fgColor}
          bgColor={bgColor}
          level="H"
          includeMargin={false}
        />
      </div>

      {/* Color Presets (Pro only) */}
      {isPro ? (
        <div className="w-full space-y-3">
          <p className="text-sm font-medium text-center">اختر نظام الألوان</p>
          <div className="grid grid-cols-3 gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => { setFgColor(preset.fg); setBgColor(preset.bg) }}
                className={`p-2 rounded-xl border-2 text-xs font-medium transition-all ${
                  fgColor === preset.fg && bgColor === preset.bg
                    ? 'border-[#4B9EFF]'
                    : 'border-[var(--border)]'
                }`}
              >
                <div className="w-full h-8 rounded-lg mb-1 flex items-center justify-center text-sm"
                  style={{ background: preset.bg, border: `2px solid ${preset.fg}30` }}>
                  <span style={{ color: preset.fg }}>QR</span>
                </div>
                {preset.label}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-[var(--text-muted)] mb-1">لون الرمز</label>
              <div className="flex items-center gap-2">
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0.5" style={{ background: 'var(--surface)' }} />
                <span className="text-xs font-mono" dir="ltr">{fgColor}</span>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-[var(--text-muted)] mb-1">لون الخلفية</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0.5" style={{ background: 'var(--surface)' }} />
                <span className="text-xs font-mono" dir="ltr">{bgColor}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xs text-[var(--text-muted)]">ترقَّ إلى برو لتخصيص ألوان رمز QR</p>
        </div>
      )}

      <button onClick={handleDownload} className="btn-primary w-full gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        تحميل رمز QR بصيغة PNG
      </button>
    </div>
  )
}
