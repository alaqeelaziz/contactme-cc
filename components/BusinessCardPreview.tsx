'use client'

import { useState, forwardRef, useImperativeHandle } from 'react'
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
    phone = '',
    email = '',
    logoUrl = null,
    qrValue = 'https://contactme.cc',
    theme = 'dark',
    primaryColor = '#4B9EFF',
    secondaryColor = '#8B5CF6',
    flippable = true,
  }, ref) {
    const [flipped, setFlipped] = useState(false)

    const themes = {
      dark:     { bg: 'linear-gradient(135deg, #1A1A3E, #2d2d5e)', text: '#FFF', subtext: '#93C5FD', iconBg: 'rgba(255,255,255,0.12)', metaText: 'rgba(255,255,255,0.65)', border: 'none' },
      light:    { bg: '#FFFFFF', text: '#111827', subtext: primaryColor, iconBg: `${primaryColor}18`, metaText: '#6B7280', border: '1px solid #E5E7EB' },
      gradient: { bg: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, text: '#FFF', subtext: 'rgba(255,255,255,0.85)', iconBg: 'rgba(255,255,255,0.22)', metaText: 'rgba(255,255,255,0.75)', border: 'none' },
      minimal:  { bg: '#F8FAFC', text: '#0F172A', subtext: '#64748B', iconBg: `${primaryColor}18`, metaText: '#94A3B8', border: '1px solid #E2E8F0' },
    }

    const t = themes[theme]
    const initial = name ? name.charAt(0) : 'أ'

    // ─── Pure Canvas 2D card generator ───────────────────────────────────────
    async function generateCardCanvas(): Promise<HTMLCanvasElement> {
      const PX = 3
      const W = 480, H = 274
      const canvas = document.createElement('canvas')
      canvas.width = W * PX
      canvas.height = H * PX
      const ctx = canvas.getContext('2d')!
      ctx.scale(PX, PX)

      function rr(x: number, y: number, w: number, h: number, r: number) {
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.arcTo(x + w, y, x + w, y + h, r)
        ctx.arcTo(x + w, y + h, x, y + h, r)
        ctx.arcTo(x, y + h, x, y, r)
        ctx.arcTo(x, y, x + w, y, r)
        ctx.closePath()
      }

      const isDark = theme === 'dark' || theme === 'gradient'
      const textColor  = isDark ? '#FFFFFF' : '#111827'
      const subtextClr = theme === 'dark' ? '#93C5FD' : theme === 'gradient' ? 'rgba(255,255,255,0.85)' : primaryColor
      const metaColor  = theme === 'dark' ? 'rgba(255,255,255,0.65)' : theme === 'gradient' ? 'rgba(255,255,255,0.75)' : '#6B7280'
      const dotColor   = theme === 'gradient' ? 'rgba(255,255,255,0.9)' : theme === 'dark' ? '#FFFFFF' : primaryColor

      // 1. Background
      ctx.save()
      rr(0, 0, W, H, 16)
      ctx.clip()
      if (theme === 'gradient') {
        const g = ctx.createLinearGradient(0, 0, W, H)
        g.addColorStop(0, primaryColor)
        g.addColorStop(1, secondaryColor)
        ctx.fillStyle = g
      } else if (theme === 'dark') {
        const g = ctx.createLinearGradient(0, 0, W, H)
        g.addColorStop(0, '#1A1A3E')
        g.addColorStop(1, '#2d2d5e')
        ctx.fillStyle = g
      } else {
        ctx.fillStyle = theme === 'light' ? '#FFFFFF' : '#F8FAFC'
      }
      ctx.fillRect(0, 0, W, H)
      if (theme === 'light' || theme === 'minimal') {
        ctx.strokeStyle = theme === 'light' ? '#E5E7EB' : '#E2E8F0'
        ctx.lineWidth = 1
        rr(0, 0, W, H, 16)
        ctx.stroke()
      }
      ctx.restore()

      // 2. Avatar
      const AX = 20, AY = 20, AS = 44
      if (logoUrl) {
        ctx.save()
        rr(AX, AY, AS, AS, 10)
        ctx.clip()
        const img = new Image()
        img.crossOrigin = 'anonymous'
        await new Promise<void>(resolve => { img.onload = () => resolve(); img.onerror = () => resolve(); img.src = logoUrl })
        ctx.drawImage(img, AX, AY, AS, AS)
        ctx.restore()
      } else {
        rr(AX, AY, AS, AS, 10)
        if (theme === 'gradient') {
          ctx.fillStyle = 'rgba(255,255,255,0.25)'
        } else {
          const ag = ctx.createLinearGradient(AX, AY, AX + AS, AY + AS)
          ag.addColorStop(0, primaryColor)
          ag.addColorStop(1, secondaryColor)
          ctx.fillStyle = ag
        }
        ctx.fill()
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 18px Arial, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(initial, AX + AS / 2, AY + AS / 2)
      }

      // 3. Name
      const TX = AX + AS + 12
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillStyle = textColor
      ctx.font = 'bold 14px Arial, sans-serif'
      ctx.fillText(name || 'اسمك هنا', TX, AY + 4)

      // 4. Job title
      ctx.fillStyle = subtextClr
      ctx.font = '500 12px Arial, sans-serif'
      ctx.fillText(jobTitle || '', TX, AY + 23)

      // 5. Bio
      if (bio) {
        ctx.fillStyle = metaColor
        ctx.font = '10px Arial, sans-serif'
        ctx.fillText(bio.length > 45 ? bio.substring(0, 45) + '...' : bio, TX, AY + 40)
      }

      // 6. Logo mark pattern (top right)
      const LMX = W - 60, LMY = AY
      rr(LMX - 5, LMY - 5, 42, 42, 10)
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.12)' : `${primaryColor}22`
      ctx.fill()
      const dS = 9, dG = 1.5
      const activeDots = new Set([0, 1, 3, 4, 7, 8])
      for (let i = 0; i < 9; i++) {
        if (!activeDots.has(i)) continue
        const col = i % 3, row = Math.floor(i / 3)
        const dx = LMX + col * (dS + dG)
        const dy = LMY + row * (dS + dG)
        rr(dx, dy, dS, dS, 2)
        ctx.fillStyle = dotColor
        ctx.fill()
      }

      // 7. Divider
      const divY = Math.round(H / 2) + 10
      ctx.save()
      ctx.globalAlpha = 0.2
      ctx.fillStyle = textColor
      ctx.fillRect(20, divY, W - 40, 1)
      ctx.restore()

      // 8. Phone & Email
      let cy = divY + 14
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillStyle = metaColor
      ctx.font = '11px Arial, sans-serif'
      if (phone) { ctx.fillText('📞  ' + phone, 20, cy); cy += 19 }
      if (email) { ctx.fillText('✉  ' + email, 20, cy) }

      return canvas
    }

    // ─── Exposed methods ──────────────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      async downloadPng() {
        const canvas = await generateCardCanvas()
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
        const canvas = await generateCardCanvas()
        const { jsPDF } = await import('jspdf')
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] })
        pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 54)
        pdf.save('business-card.pdf')
      },

      async print() {
        const canvas = await generateCardCanvas()
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

    // ─── Card JSX ─────────────────────────────────────────────────────────────
    const FrontFace = (
      <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl p-5 flex flex-col justify-between"
        style={{ background: t.bg, border: t.border }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="logo" className="w-11 h-11 rounded-xl object-contain" style={{ background: t.iconBg }} />
            ) : (
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-base flex-shrink-0"
                style={{ background: theme === 'gradient' ? 'rgba(255,255,255,0.25)' : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                {initial}
              </div>
            )}
            <div>
              <h3 className="font-bold text-sm leading-tight" style={{ color: t.text }}>{name}</h3>
              <p className="text-xs mt-0.5 font-medium" style={{ color: t.subtext }}>{jobTitle}</p>
              {bio && <p className="text-[10px] mt-0.5 leading-tight max-w-[140px]" style={{ color: t.metaText }}>{bio}</p>}
            </div>
          </div>
          <div className="rounded-xl p-2.5 flex-shrink-0" style={{ background: t.iconBg }}>
            <div className="w-8 h-8 grid grid-cols-3 gap-0.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-[2px]"
                  style={{ background: [0,1,3,4,7,8].includes(i) ? (theme === 'gradient' ? 'rgba(255,255,255,0.9)' : theme === 'dark' ? '#FFF' : primaryColor) : 'transparent' }} />
              ))}
            </div>
          </div>
        </div>
        <div className="w-full h-px opacity-20" style={{ background: t.text }} />
        <div className="flex items-center gap-4 flex-wrap">
          {phone && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: t.metaText }}>
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-[11px]" style={{ color: t.metaText }}>{phone}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: t.metaText }}>
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-[11px]" style={{ color: t.metaText }}>{email}</span>
            </div>
          )}
        </div>
      </div>
    )

    const BackFace = (
      <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl flex flex-col items-center justify-center gap-4"
        style={{ background: t.bg, border: t.border }}>
        <div className="p-3 rounded-xl bg-white shadow">
          <QRCodeCanvas value={qrValue || 'https://contactme.cc'} size={110} fgColor={primaryColor} bgColor="#FFFFFF" level="H" includeMargin={false} />
        </div>
        <p className="text-[10px] px-6 text-center break-all w-full" style={{ color: t.metaText }}>{qrValue}</p>
      </div>
    )

    if (!flippable) return (
      <div className="relative w-full max-w-sm mx-auto select-none" style={{ aspectRatio: '1.75/1' }}>
        {FrontFace}
      </div>
    )

    return (
      <div className="relative w-full max-w-sm mx-auto select-none" style={{ perspective: '1000px' }}>
        <div
          onClick={() => setFlipped(f => !f)}
          className="w-full cursor-pointer transition-transform duration-500"
          style={{ aspectRatio: '1.75/1', transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>{FrontFace}</div>
          <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>{BackFace}</div>
        </div>
        <p className="text-center text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
          {flipped ? '← اضغط للعودة' : 'اضغط لرؤية الخلف →'}
        </p>
      </div>
    )
  }
)

export default BusinessCardPreview