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
type Theme     = 'dark' | 'light' | 'gradient' | 'minimal'
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
  { primary: '#4B9EFF', secondary: '#8B5CF6', name: 'اوشن'  },
  { primary: '#6366F1', secondary: '#A855F7', name: 'برايم' },
  { primary: '#10B981', secondary: '#3B82F6', name: 'نعناع' },
  { primary: '#F59E0B', secondary: '#EF4444', name: 'غروب' },
  { primary: '#EC4899', secondary: '#8B5CF6', name: 'زهري'  },
  { primary: '#14B8A6', secondary: '#6366F1', name: 'تيل'   },
  { primary: '#F97316', secondary: '#EAB308', name: 'ذهبي'  },
  { primary: '#1E293B', secondary: '#475569', name: 'رمادي' },
]

// Card px dimensions
const DIMS = {
  landscape: { W: 480, H: 274 },
  square:    { W: 320, H: 320 },
  portrait:  { W: 260, H: 400 },
}

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath()
  c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r)
  c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath()
}

/** Always draw Latin text LTR — fixes Arabic-page direction inheritance */
function drawLTR(c: CanvasRenderingContext2D, txt: string, x: number, y: number, align: CanvasTextAlign = 'left') {
  c.save(); c.direction = 'ltr'; c.textAlign = align; c.fillText(txt, x, y); c.restore()
}

let _arabicFontFamily = ''
async function loadArabicFont(): Promise<string> {
  if (_arabicFontFamily) return _arabicFontFamily
  try {
    const face = new FontFace('CairoCard',
      'url(https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvangtZmpcWmhzfH5lWWgcQyyS4J0.woff2)')
    document.fonts.add(await face.load())
    _arabicFontFamily = 'CairoCard'
  } catch { _arabicFontFamily = 'Tahoma' }
  return _arabicFontFamily
}

const LATIN = 'Arial,sans-serif'
const fAr   = (fam: string, sz: number, b = false) => `${b?'bold ':''}${sz}px ${fam},Tahoma,Arial`
const fLa   = (sz: number, b = false)              => `${b?'bold ':''}${sz}px ${LATIN}`

/* ─── background ──────────────────────────────────────────────────────────── */

function drawBg(c: CanvasRenderingContext2D, W: number, H: number, ox: number, oy: number,
                theme: Theme, p: string, s: string) {
  c.save(); rr(c,ox,oy,W,H,16); c.clip()
  if (theme==='gradient')      { const g=c.createLinearGradient(ox,oy,ox+W,oy+H); g.addColorStop(0,p); g.addColorStop(1,s); c.fillStyle=g }
  else if (theme==='dark')     { const g=c.createLinearGradient(ox,oy,ox+W,oy+H); g.addColorStop(0,'#1A1A3E'); g.addColorStop(1,'#2d2d5e'); c.fillStyle=g }
  else if (theme==='light')    { c.fillStyle='#FFFFFF' }
  else                         { c.fillStyle='#F8FAFC' }
  c.fillRect(ox,oy,W,H)
  const isDark = theme==='dark'||theme==='gradient'
  if (!isDark) { c.strokeStyle=theme==='light'?'#E5E7EB':'#E2E8F0'; c.lineWidth=1; rr(c,ox,oy,W,H,16); c.stroke() }
  c.restore()
}

/* ─── avatar ──────────────────────────────────────────────────────────────── */

async function drawAvatar(c: CanvasRenderingContext2D, ax: number, ay: number, as_: number, r: number,
                           url: string|null, initial: string, fam: string, theme: Theme, p: string, s: string) {
  if (url) {
    c.save(); rr(c,ax,ay,as_,as_,r); c.clip()
    const img=new Image(); img.crossOrigin='anonymous'
    await new Promise<void>(res=>{img.onload=()=>res();img.onerror=()=>res();img.src=url})
    c.drawImage(img,ax,ay,as_,as_); c.restore()
  } else {
    rr(c,ax,ay,as_,as_,r)
    if (theme==='gradient') { c.fillStyle='rgba(255,255,255,0.25)' }
    else { const g=c.createLinearGradient(ax,ay,ax+as_,ay+as_); g.addColorStop(0,p); g.addColorStop(1,s); c.fillStyle=g }
    c.fill()
    c.fillStyle='#FFF'; c.font=fAr(fam,Math.round(as_*0.38),true)
    c.save(); c.direction='rtl'; c.textAlign='center'; c.textBaseline='middle'
    c.fillText(initial,ax+as_/2,ay+as_/2); c.restore()
  }
}

/* ─── FRONT landscape ─────────────────────────────────────────────────────── */

async function drawFrontL(c: CanvasRenderingContext2D, W: number, H: number, ox: number, oy: number,
                           theme: Theme, p: string, s: string, fam: string,
                           name: string, job: string, phone: string, email: string,
                           avatar: string|null, url: string, initial: string) {
  const isDark  = theme==='dark'||theme==='gradient'
  const txtClr  = isDark?'#FFF':'#111827'
  const subClr  = theme==='dark'?'#93C5FD':theme==='gradient'?'rgba(255,255,255,0.85)':p
  const metaClr = isDark?'rgba(255,255,255,0.65)':'#6B7280'
  const dotClr  = theme==='gradient'?'rgba(255,255,255,0.9)':isDark?'#FFF':p

  drawBg(c,W,H,ox,oy,theme,p,s)

  const AX=ox+W-64, AY=oy+20, AS=44
  await drawAvatar(c,AX,AY,AS,10,avatar,initial,fam,theme,p,s)

  // Name & job — Arabic RTL
  c.save(); c.direction='rtl'; c.textAlign='right'; c.textBaseline='top'
  c.fillStyle=txtClr; c.font=fAr(fam,14,true); c.fillText(name||'اسمك هنا',AX-12,AY+4)
  c.fillStyle=subClr; c.font=fAr(fam,11);       c.fillText(job||'',AX-12,AY+22); c.restore()

  // Dot grid
  const LMX=ox+20, LMY=AY
  rr(c,LMX-5,LMY-5,42,42,10); c.fillStyle=isDark?'rgba(255,255,255,0.12)':`${p}22`; c.fill()
  for(let i=0;i<9;i++){
    if(![0,1,3,4,7,8].includes(i)) continue
    rr(c,LMX+(i%3)*10.5,LMY+Math.floor(i/3)*10.5,9,9,2); c.fillStyle=dotClr; c.fill()
  }

  // Divider
  const divY=oy+H/2+10
  c.save(); c.globalAlpha=0.2; c.fillStyle=txtClr; c.fillRect(ox+20,divY,W-40,1); c.restore()

  // Contact — Latin font, forced LTR
  c.fillStyle=metaClr; c.font=fLa(11); c.textBaseline='top'
  let cy=divY+14
  if(phone){ drawLTR(c,'📞  '+phone,ox+20,cy); cy+=20 }
  if(email){ drawLTR(c,'✉  '+email, ox+20,cy); cy+=20 }
  drawLTR(c,'🌐  '+url, ox+20,cy)
}

/* ─── FRONT square ────────────────────────────────────────────────────────── */

async function drawFrontS(c: CanvasRenderingContext2D, W: number, H: number, ox: number, oy: number,
                           theme: Theme, p: string, s: string, fam: string,
                           name: string, job: string, phone: string, email: string,
                           avatar: string|null, url: string, initial: string) {
  const isDark  = theme==='dark'||theme==='gradient'
  const txtClr  = isDark?'#FFF':'#111827'
  const subClr  = theme==='dark'?'#93C5FD':theme==='gradient'?'rgba(255,255,255,0.8)':p
  const metaClr = isDark?'rgba(255,255,255,0.6)':'#6B7280'

  drawBg(c,W,H,ox,oy,theme,p,s)

  const AS=70, AX=ox+(W-AS)/2, AY=oy+24
  await drawAvatar(c,AX,AY,AS,AS/2,avatar,initial,fam,theme,p,s)
  c.save(); rr(c,AX-2,AY-2,AS+4,AS+4,AS/2+2)
  c.strokeStyle=isDark?'rgba(255,255,255,0.4)':p; c.lineWidth=2; c.stroke(); c.restore()

  // Decorative dots top-left
  for(let i=0;i<4;i++){
    rr(c,ox+14+i*10,oy+14,6,6,3)
    c.fillStyle=isDark?'rgba(255,255,255,0.2)':`${p}44`; c.fill()
  }

  c.save(); c.direction='rtl'; c.textAlign='center'; c.textBaseline='top'
  c.fillStyle=txtClr; c.font=fAr(fam,15,true); c.fillText(name||'اسمك هنا',ox+W/2,AY+AS+12)
  c.fillStyle=subClr; c.font=fAr(fam,11);       c.fillText(job||'',ox+W/2,AY+AS+30); c.restore()

  const divY=AY+AS+52
  c.save(); c.globalAlpha=0.15; c.fillStyle=txtClr; c.fillRect(ox+28,divY,W-56,1); c.restore()

  c.fillStyle=metaClr; c.font=fLa(10); c.textBaseline='top'
  let cy=divY+10; const lx=ox+20
  if(phone){ drawLTR(c,'📞  '+phone,lx,cy); cy+=18 }
  if(email){ drawLTR(c,'✉  '+email, lx,cy); cy+=18 }
  drawLTR(c,'🌐  '+url,lx,cy)
}

/* ─── FRONT portrait ──────────────────────────────────────────────────────── */

async function drawFrontP(c: CanvasRenderingContext2D, W: number, H: number, ox: number, oy: number,
                           theme: Theme, p: string, s: string, fam: string,
                           name: string, job: string, phone: string, email: string,
                           avatar: string|null, url: string, initial: string) {
  const isDark  = theme==='dark'||theme==='gradient'
  const txtClr  = isDark?'#FFF':'#111827'
  const subClr  = theme==='dark'?'#93C5FD':theme==='gradient'?'rgba(255,255,255,0.8)':p
  const metaClr = isDark?'rgba(255,255,255,0.6)':'#6B7280'

  drawBg(c,W,H,ox,oy,theme,p,s)

  // Header gradient strip
  c.save(); rr(c,ox,oy,W,H,16); c.clip()
  const hg=c.createLinearGradient(ox,oy,ox+W,oy+H*0.45)
  hg.addColorStop(0,isDark?'rgba(255,255,255,0.08)':`${p}18`)
  hg.addColorStop(1,'rgba(0,0,0,0)')
  c.fillStyle=hg; c.fillRect(ox,oy,W,H*0.45); c.restore()

  // Accent line top
  c.save(); rr(c,ox,oy,W,5,0)
  const ag=c.createLinearGradient(ox,oy,ox+W,oy)
  ag.addColorStop(0,p); ag.addColorStop(1,s)
  c.fillStyle=ag; c.fill(); c.restore()

  const AS=60, AX=ox+(W-AS)/2, AY=oy+22
  await drawAvatar(c,AX,AY,AS,AS/2,avatar,initial,fam,theme,p,s)
  c.save(); rr(c,AX-2,AY-2,AS+4,AS+4,AS/2+2)
  c.strokeStyle=isDark?'rgba(255,255,255,0.4)':p; c.lineWidth=2.5; c.stroke(); c.restore()

  c.save(); c.direction='rtl'; c.textAlign='center'; c.textBaseline='top'
  c.fillStyle=txtClr; c.font=fAr(fam,14,true); c.fillText(name||'اسمك هنا',ox+W/2,AY+AS+12)
  c.fillStyle=subClr; c.font=fAr(fam,11);       c.fillText(job||'',ox+W/2,AY+AS+29); c.restore()

  const lineY=AY+AS+50
  c.save(); c.globalAlpha=0.2; c.fillStyle=txtClr; c.fillRect(ox+16,lineY,W-32,1); c.restore()

  c.fillStyle=metaClr; c.font=fLa(11); c.textBaseline='top'
  let cy=lineY+12; const lx=ox+18
  if(phone){ drawLTR(c,'📞  '+phone,lx,cy); cy+=22 }
  if(email){ drawLTR(c,'✉  '+email, lx,cy); cy+=22 }
  c.font=fLa(10); drawLTR(c,'🌐  '+url,lx,cy)
}

/* ─── BACK (all shapes) ───────────────────────────────────────────────────── */

async function drawBack(c: CanvasRenderingContext2D, W: number, H: number, ox: number, oy: number,
                         theme: Theme, p: string, s: string, url: string) {
  const isDark  = theme==='dark'||theme==='gradient'
  const metaClr = isDark?'rgba(255,255,255,0.6)':'#6B7280'

  drawBg(c,W,H,ox,oy,theme,p,s)

  const QR      = await import('qrcode')
  const qrSize  = Math.round(Math.min(W,H)*0.50)
  const pad     = 14
  const qrX     = ox+(W-qrSize)/2
  const qrY     = oy+(H-qrSize)/2 - 10

  const dataUrl = await QR.toDataURL(url||'https://contactme.cc',{
    width:qrSize*3, margin:1, color:{dark:p,light:'#FFFFFF'}
  })

  rr(c,qrX-pad,qrY-pad,qrSize+pad*2,qrSize+pad*2,14)
  c.fillStyle='#FFFFFF'; c.fill()

  const img=new Image()
  await new Promise<void>(res=>{img.onload=()=>res();img.src=dataUrl})
  c.drawImage(img,qrX,qrY,qrSize,qrSize)

  // URL — explicit Latin font + LTR
  c.fillStyle=metaClr; c.font=fLa(9)
  c.textBaseline='top'
  drawLTR(c, url, ox+W/2, qrY+qrSize+pad+8, 'center')
}

/* ─── Canvas builder ──────────────────────────────────────────────────────── */

function mkCanvas(W: number, H: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const PX=3, cv=document.createElement('canvas')
  cv.width=W*PX; cv.height=H*PX
  const ctx=cv.getContext('2d')!
  // Solid white base — ensures jsPDF never gets a transparent/empty page
  ctx.fillStyle='#FFFFFF'; ctx.fillRect(0,0,cv.width,cv.height)
  ctx.scale(PX,PX)
  return [cv,ctx]
}

/* ─── Component ───────────────────────────────────────────────────────────── */

export default function BusinessCardTab({ profile, profileUrl }: Props) {
  const [theme,    setTheme]    = useState<Theme>((profile as any).card_theme     ?? 'dark')
  const [colorIdx, setColorIdx] = useState<number>((profile as any).card_color_idx ?? 0)
  const [shape,    setShape]    = useState<CardShape>('landscape')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [loading,  setLoading]  = useState<'png'|'pdf'|null>(null)

  const colors  = COLOR_PAIRS[colorIdx]
  const name    = profile.full_name ?? ''
  const job     = (profile as any).job_title ?? ''
  const phone   = (profile as any).whatsapp  ?? (profile as any).phone ?? ''
  const email   = (profile as any).email     ?? ''
  const avatar  = profile.avatar_url ?? null
  const initial = name ? name.charAt(0) : 'أ'

  async function renderFront(ctx: CanvasRenderingContext2D, W: number, H: number, ox=0, oy=0) {
    const fam = await loadArabicFont()
    const args = [ctx,W,H,ox,oy,theme,colors.primary,colors.secondary,fam,
                  name,job,phone,email,avatar,profileUrl,initial] as const
    if      (shape==='landscape') await drawFrontL(...args)
    else if (shape==='square')    await drawFrontS(...args)
    else                          await drawFrontP(...args)
  }

  // PDF — single page, both sides side by side (most compatible with jsPDF)
  async function handlePdf() {
    setLoading('pdf')
    try {
      const {W,H} = DIMS[shape]
      const GAP   = 16
      const TW    = W*2+GAP

      // Front canvas
      const [fc, fctx] = mkCanvas(W,H)
      await renderFront(fctx,W,H)

      // Back canvas
      const [bc, bctx] = mkCanvas(W,H)
      await drawBack(bctx,W,H,0,0,theme,colors.primary,colors.secondary,profileUrl)

      // Merge into one wide canvas
      const [mc, mctx] = mkCanvas(TW,H)
      mctx.drawImage(fc, 0, 0, W, H)
      mctx.drawImage(bc, (W+GAP), 0, W, H)

      // PDF sized to show both cards — width = 2× card
      const mmH = 54
      const mmW = Math.round(mmH * TW / H * 10) / 10   // keep aspect ratio
      const {jsPDF} = await import('jspdf')
      const pdf = new jsPDF({orientation:'landscape', unit:'mm', format:[mmW, mmH]})
      pdf.addImage(mc.toDataURL('image/png'),'PNG', 0, 0, mmW, mmH)
      pdf.save('contactme-card.pdf')
    } finally { setLoading(null) }
  }

  async function handlePng() {
    setLoading('png')
    try {
      const {W,H} = DIMS[shape]; const GAP=16
      const [c,ctx] = mkCanvas(W*2+GAP,H)
      await renderFront(ctx,W,H,0,0)
      await drawBack(ctx,W,H,W+GAP,0,theme,colors.primary,colors.secondary,profileUrl)
      c.toBlob(blob=>{
        if(!blob) return
        const a=document.createElement('a'); a.download='contactme-card.png'
        a.href=URL.createObjectURL(blob); a.click()
      },'image/png')
    } finally { setLoading(null) }
  }

  async function handleSave() {
    setSaving(true)
    await supabase.from('profiles').update({card_theme:theme,card_color_idx:colorIdx}).eq('id',profile.id)
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false),2000)
  }

  const Spinner = () => (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  )

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-3 font-medium">معاينة البطاقة</p>
        <BusinessCardPreview
          name={profile.full_name??''} jobTitle={(profile as any).job_title??''}
          bio={profile.bio??''} phone={(profile as any).whatsapp??(profile as any).phone??''}
          email={(profile as any).email??''} logoUrl={profile.avatar_url??null}
          qrValue={profileUrl} theme={theme}
          primaryColor={colors.primary} secondaryColor={colors.secondary} flippable={true}
        />
      </div>

      {/* Shape */}
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">شكل البطاقة</p>
        <div className="grid grid-cols-3 gap-2">
          {SHAPES.map(s=>(
            <button key={s.id} onClick={()=>setShape(s.id)}
              className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-medium transition-all border ${
                shape===s.id?'border-[#6366F1] bg-[#6366F110] text-[#6366F1]':'border-[var(--border)] text-[var(--text-muted)]'}`}>
              <span className="text-base">{s.icon}</span>{s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">السمة</p>
        <div className="grid grid-cols-4 gap-2">
          {THEMES.map(t=>(
            <button key={t.id} onClick={()=>setTheme(t.id)}
              className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-medium transition-all border ${
                theme===t.id?'border-[#6366F1] bg-[#6366F110] text-[#6366F1]':'border-[var(--border)] text-[var(--text-muted)]'}`}>
              <span className="text-base">{t.emoji}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">الألوان</p>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_PAIRS.map((pair,idx)=>(
            <button key={idx} onClick={()=>setColorIdx(idx)}
              className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl transition-all border ${
                colorIdx===idx?'border-[#6366F1] scale-105':'border-[var(--border)]'}`}>
              <div className="w-8 h-4 rounded-full" style={{background:`linear-gradient(90deg,${pair.primary},${pair.secondary})`}}/>
              <span className="text-[10px] text-[var(--text-muted)]">{pair.name}</span>
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
        style={{background:saved?'#10B981':'linear-gradient(135deg,#6366F1,#A855F7)'}}>
        {saving?'جاري الحفظ...':saved?'✓ تم الحفظ':'حفظ التصميم'}
      </button>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={handlePdf} disabled={!!loading}
          className="py-3 rounded-xl text-sm font-semibold border border-[var(--border)] hover:border-[#6366F1] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading==='pdf'?<Spinner/>:'📄'} تحميل PDF
        </button>
        <button onClick={handlePng} disabled={!!loading}
          className="py-3 rounded-xl text-sm font-semibold border border-[var(--border)] hover:border-[#6366F1] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading==='png'?<Spinner/>:'🖼'} تحميل PNG
        </button>
      </div>

      <a href="https://ticketme.cc" target="_blank" rel="noopener noreferrer"
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 border-2"
        style={{borderColor:colors.primary,color:colors.primary}}>
        🎟 التذاكر — ticketme.cc
      </a>
    </div>
  )
}
