'use client'

import { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

interface BusinessCardPreviewProps {
  name?: string
  jobTitle?: string
  bio?: string
  phone?: string
  email?: string
  logoUrl?: string | null
  qrValue?: string
  theme?: 'dark' | 'light' | 'gradient' | 'minimal'
  primaryColor?: string
  secondaryColor?: string
  flippable?: boolean
}

export interface BusinessCardPreviewHandle {
  downloadPng: () => Promise<void>
  downloadPdf: () => Promise<void>
  print: () => Promise<void>
}

const BusinessCardPreview = forwardRef<BusinessCardPreviewHandle, BusinessCardPreviewProps>(
  function BusinessCardPreview({
    name = 'اسمك هنا',
    jobTitle = 'المسمى الوظيفي',
    bio = '',
    phone = '+966 5X XXX XXXX',
    email = 'email@example.com',
    logoUrl = null,
    qrValue = 'https://contactme.cc',
    theme = 'dark',
    primaryColor = '#4B9EFF',
    secondaryColor = '#8B5CF6',
    flippable = true,
  }, ref) {
    const [flipped, setFlipped] = useState(false)
    const captureRef = useRef<HTMLDivElement>(null)

    const themes = {
      dark:     { bg: 'linear-gradient(135deg, #1A1A3E, #2d2d5e)', text: '#FFF', subtext: '#93C5FD', iconBg: 'rgba(255,255,255,0.12)', metaText: 'rgba(255,255,255,0.65)', border: 'none' },
      light:    { bg: '#FFFFFF', text: '#111827', subtext: primaryColor, iconBg: `${primaryColor}18`, metaText: '#6B7280', border: '1px solid #E5E7EB' },
      gradient: { bg: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, text: '#FFF', subtext: 'rgba(255,255,255,0.85)', iconBg: 'rgba(255,255,255,0.22)', metaText: 'rgba(255,255,255,0.75)', border: 'none' },
      minimal:  { bg: '#F8FAFC', text: '#0F172A', subtext: '#64748B', iconBg: `${primaryColor}18`, metaText: '#94A3B8', border: '1px solid #E2E8F0' },
    }

    const t = themes[theme]
    const initial = name ? name.charAt(0) : 'أ'

    // ─── Front face content (shared between visible + capture) ───────────────
    const frontContent = (
      <div style={{ width: '100%', height: '100%', background: t.bg, border: t.border, borderRadius: '16px', overflow: 'hidden', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {logoUrl ? (
              <img src={logoUrl} alt="logo" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'contain', background: t.iconBg }} />
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 900, fontSize: 16, flexShrink: 0, background: theme === 'gradient' ? 'rgba(255,255,255,0.25)' : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                {initial}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: t.text, lineHeight: 1.3 }}>{name}</div>
              <div style={{ fontSize: 12, color: t.subtext, marginTop: 2, fontWeight: 500 }}>{jobTitle}</div>
              {bio && <div style={{ fontSize: 10, color: t.metaText, marginTop: 2, lineHeight: 1.4, maxWidth: 140 }}>{bio}</div>}
            </div>
          </div>
          {/* Logo mark */}
          <div style={{ borderRadius: 12, padding: 10, background: t.iconBg, flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{ borderRadius: 2, background: [0,1,3,4,7,8].includes(i) ? (theme === 'gradient' ? 'rgba(255,255,255,0.9)' : theme === 'dark' ? '#FFF' : primaryColor) : 'transparent' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, opacity: 0.2, background: t.text }} />

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="12" height="12" fill={t.metaText} viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span style={{ fontSize: 11, color: t.metaText }}>{phone}</span>
            </div>
          )}
          {email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="12" height="12" fill={t.metaText} viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span style={{ fontSize: 11, color: t.metaText }}>{email}</span>
            </div>
          )}
        </div>
      </div>
    )

    const backContent = (
      <div style={{ width: '100%', height: '100%', background: t.bg, border: t.border, borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ padding: 12, borderRadius: 12, background: '#FFF', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
          <QRCodeCanvas value={qrValue || 'https://contactme.cc'} size={110} fgColor={primaryColor} bgColor="#FFFFFF" level="H" includeMargin={false} />
        </div>
        <div style={{ fontSize: 11, color: t.metaText, textAlign: 'center', padding: '0 24px', wordBreak: 'break-all' }}>{qrValue}</div>
      </div>
    )

    // ─── Capture helper ───────────────────────────────────────────────────────
    async function captureCard(): Promise<HTMLCanvasElement> {
      const node = captureRef.current
      if (!node) throw new Error('captureRef missing')
      // انتظر frame
      await new Promise(r => setTimeout(r, 100))
      const html2canvas = (await import('html2canvas')).default
      return html2canvas(node, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 480,
        height: 274,
        windowWidth: 1440,
        windowHeight: 900,
      })
    }

    useImperativeHandle(ref, () => ({
      async downloadPng() {
        const canvas = await captureCard()
        canvas.toBlob(blob => {
          if (!blob) return
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.download = 'business-card.png'
          a.href = url
          a.click()
          URL.revokeObjectURL(url)
        }, 'image/png')
      },

      async downloadPdf() {
        const canvas = await captureCard()
        const { jsPDF } = await import('jspdf')
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] })
        pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 54)
        pdf.save('business-card.pdf')
      },

      async print() {
        const canvas = await captureCard()
        const imgData = canvas.toDataURL('image/png')
        const win = window.open('', '_blank', 'width=900,height=600')
        if (!win) return
        win.document.write(`<!DOCTYPE html><html><head><style>
          *{margin:0;padding:0;box-sizing:border-box;}
          body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#fff;}
          @page{size:85.6mm 54mm landscape;margin:0;}
          @media print{body{width:85.6mm;height:54mm;overflow:hidden;}}
          img{width:85.6mm;height:54mm;display:block;}
        </style></head><body>
          <img src="${imgData}"/>
          <script>window.onload=()=>{window.print();window.close();}<\/script>
        </body></html>`)
        win.document.close()
      },
    }))

    return (
      <>
        {/* ── Invisible capture card — always in DOM, always in viewport ── */}
        {/* z-index: -1 يخليه خلف كل شي لكن html2canvas يقدر يصوره */}
        <div
          ref={captureRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 480,
            height: 274,
            zIndex: -1,
            pointerEvents: 'none',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          {frontContent}
        </div>

        {/* ── Visible flipping card ── */}
        <div className="relative w-full max-w-sm mx-auto select-none" style={{ perspective: '1000px' }}>
          {!flippable ? (
            <div style={{ aspectRatio: '1.75/1' }}>{frontContent}</div>
          ) : (
            <>
              <div
                onClick={() => setFlipped(f => !f)}
                className="w-full cursor-pointer transition-transform duration-500"
                style={{
                  aspectRatio: '1.75/1',
                  transformStyle: 'preserve-3d',
                  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>{frontContent}</div>
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>{backContent}</div>
              </div>
              <p className="text-center text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
                {flipped ? '← اضغط للعودة' : 'اضغط لرؤية الخلف →'}
              </p>
            </>
          )}
        </div>
      </>
    )
  }
)

export default BusinessCardPreview