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
type Theme = 'dark' | 'light' | 'gradient' | 'minimal'

const THEMES: { id: Theme; label: string; emoji: string }[] = [
  { id: 'dark',     label: 'داكن',  emoji: '🌙' },
  { id: 'light',    label: 'فاتح',  emoji: '☀️' },
  { id: 'gradient', label: 'متدرج', emoji: '🌈' },
  { id: 'minimal',  label: 'بسيط',  emoji: '⬜' },
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
const SIZES = [
  { id: 'standard', label: 'قياسي', sub: '85×54 mm', W: 480, H: 272 },
  { id: 'square',   label: 'مربع',  sub: '70×70 mm', W: 340, H: 340 },
  { id: 'portrait', label: 'عمودي', sub: '54×86 mm', W: 272, H: 420 },
  { id: 'large',    label: 'كبير',  sub: 'A6',       W: 560, H: 400 },
]

const PX = 3

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x+r, y); ctx.arcTo(x+w,y, x+w,y+h, r); ctx.arcTo(x+w,y+h, x,y+h, r)
  ctx.arcTo(x,y+h, x,y, r); ctx.arcTo(x,y, x+w,y, r); ctx.closePath()
}

export default function BusinessCardTab({ profile, profileUrl }: Props) {
  const [theme,    setTheme]    = useState<Theme>((profile as any).card_theme     ?? 'dark')
  const [colorIdx, setColorIdx] = useState<number>((profile as any).card_color_idx ?? 0)
  const [sizeId,   setSizeId]   = useState('standard')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [loading,  setLoading]  = useState(false)

  const colors = COLOR_PAIRS[colorIdx]
  const size   = SIZES.find(s => s.id === sizeId)!
  const { W, H } = size

  const name   = profile.full_name ?? ''
  const job    = (profile as any).job_title ?? ''
  const phone  = (profile as any).whatsapp  ?? (profile as any).phone ?? ''
  const email  = (profile as any).email     ?? ''
  const avatar = profile.avatar_url ?? null
  const isDark = theme === 'dark' || theme === 'gradient'

  /* ── draw helpers ── */
  function newCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const cv = document.createElement('canvas')
    cv.width = w * PX; cv.height = h * PX
    const ctx = cv.getContext('2d')!
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cv.width, cv.height)
    ctx.scale(PX, PX)
    return [cv, ctx]
  }

  function bg(ctx: CanvasRenderingContext2D, w: number, h: number) {
    if (theme === 'gradient') {
      const g = ctx.createLinearGradient(0,0,w,h); g.addColorStop(0,colors.primary); g.addColorStop(1,colors.secondary); ctx.fillStyle=g
    } else if (theme === 'dark') {
      const g = ctx.createLinearGradient(0,0,w,h); g.addColorStop(0,'#1A1A3E'); g.addColorStop(1,'#2d2d5e'); ctx.fillStyle=g
    } else { ctx.fillStyle = theme==='light'?'#FFFFFF':'#F8FAFC' }
    ctx.fillRect(0,0,w,h)
    if (!isDark) { ctx.strokeStyle=theme==='light'?'#E5E7EB':'#E2E8F0'; ctx.lineWidth=1; ctx.strokeRect(.5,.5,w-1,h-1) }
  }

  async function loadImg(src: string): Promise<HTMLImageElement|null> {
    return new Promise(res => {
      const i=new Image(); i.crossOrigin='anonymous'
      i.onload=()=>res(i); i.onerror=()=>res(null); i.src=src
    })
  }

  /* ── FRONT canvas ── */
  async function drawFront(): Promise<HTMLCanvasElement> {
    const [cv,ctx] = newCanvas(W,H)
    const tc = isDark?'#FFF':'#111827'
    const sc = theme==='dark'?'#93C5FD':theme==='gradient'?'rgba(255,255,255,.85)':colors.primary
    const mc = isDark?'rgba(255,255,255,.65)':'#6B7280'
    const dc = theme==='gradient'?'rgba(255,255,255,.9)':isDark?'#FFF':colors.primary
    const init = name?name.charAt(0):'أ'

    bg(ctx,W,H)

    // Avatar top-right
    const as=Math.round(H*.16), ax=W-as-14, ay=14
    if (avatar) {
      const img=await loadImg(avatar)
      if(img){ctx.save();rr(ctx,ax,ay,as,as,8);ctx.clip();ctx.drawImage(img,ax,ay,as,as);ctx.restore()}
    } else {
      rr(ctx,ax,ay,as,as,8)
      const g=ctx.createLinearGradient(ax,ay,ax+as,ay+as)
      g.addColorStop(0,colors.primary);g.addColorStop(1,colors.secondary)
      ctx.fillStyle=theme==='gradient'?'rgba(255,255,255,.25)':g; ctx.fill()
      ctx.fillStyle='#FFF'; ctx.font=`bold ${Math.round(as*.4)}px Tahoma,Arial`
      ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.fillText(init, ax+as/2, ay+as/2)
    }

    // Name & job
    ctx.textAlign='right'; ctx.textBaseline='top'; ctx.fillStyle=tc
    ctx.font=`bold ${Math.round(H*.052)}px Tahoma,Arial`
    ctx.fillText(name||'اسمك هنا', ax-10, ay+2)
    ctx.fillStyle=sc; ctx.font=`${Math.round(H*.042)}px Tahoma,Arial`
    ctx.fillText(job, ax-10, ay+Math.round(H*.062))

    // Dot grid top-left
    const gs=Math.round(as*.9),gx=14,gy=ay
    rr(ctx,gx-4,gy-4,gs+8,gs+8,7)
    ctx.fillStyle=isDark?'rgba(255,255,255,.12)':`${colors.primary}22`; ctx.fill()
    const ds=Math.round(gs/3)-2
    for(let i=0;i<9;i++){
      if(![0,1,3,4,7,8].includes(i)) continue
      rr(ctx,gx+(i%3)*(ds+2),gy+Math.floor(i/3)*(ds+2),ds,ds,2)
      ctx.fillStyle=dc; ctx.fill()
    }

    // Divider
    const dy=Math.round(H*.55)
    ctx.globalAlpha=.15; ctx.fillStyle=tc; ctx.fillRect(14,dy,W-28,1); ctx.globalAlpha=1

    // Contact info
    ctx.textAlign='left'; ctx.textBaseline='top'; ctx.fillStyle=mc
    ctx.font=`${Math.round(H*.042)}px Arial,sans-serif`
    let cy=dy+10; const lh=Math.round(H*.075)
    if(phone){ctx.fillText('📞  '+phone,14,cy);cy+=lh}
    if(email){ctx.fillText('✉  '+email,14,cy);cy+=lh}
    ctx.fillText('🌐  '+profileUrl,14,cy)

    return cv
  }

  /* ── BACK canvas ── */
  async function drawBack(): Promise<HTMLCanvasElement> {
    const [cv,ctx] = newCanvas(W,H)
    const mc = isDark?'rgba(255,255,255,.55)':'#6B7280'
    bg(ctx,W,H)

    const QR=await import('qrcode')
    const qs=Math.round(Math.min(W,H)*.50), qx=Math.round((W-qs)/2), qy=Math.round((H-qs)/2)-8, pad=12
    const du=await QR.toDataURL(profileUrl||'https://contactme.cc',{width:qs*3,margin:1,color:{dark:colors.primary,light:'#FFFFFF'}})
    rr(ctx,qx-pad,qy-pad,qs+pad*2,qs+pad*2,12); ctx.fillStyle='#FFF'; ctx.fill()
    const qi=await loadImg(du); if(qi) ctx.drawImage(qi,qx,qy,qs,qs)

    // URL char-by-char LTR
    ctx.fillStyle=mc; ctx.font=`${Math.round(H*.036)}px Arial,sans-serif`
    ctx.textAlign='left'; ctx.textBaseline='top'
    const ty=qy+qs+pad+6
    let cx=(W-ctx.measureText(profileUrl).width)/2
    for(const ch of profileUrl){ctx.fillText(ch,cx,ty);cx+=ctx.measureText(ch).width}

    return cv
  }

  /* ── Save as image ── */
  async function handleSaveImage() {
    setLoading(true)
    try {
      const GAP=16
      const [cv,ctx] = newCanvas(W*2+GAP, H)
      const fc=await drawFront(), bc=await drawBack()
      // draw both canvases as images
      const fi=await loadImg(fc.toDataURL('image/png'))
      const bi=await loadImg(bc.toDataURL('image/png'))
      if(fi) ctx.drawImage(fi,0,0,W,H)
      if(bi) ctx.drawImage(bi,W+GAP,0,W,H)
      cv.toBlob(blob=>{
        if(!blob)return
        const a=document.createElement('a')
        a.download='contactme-card.png'; a.href=URL.createObjectURL(blob); a.click()
      },'image/png')
    } catch(e){console.error(e)}
    finally{setLoading(false)}
  }

  async function handleSave() {
    setSaving(true)
    await supabase.from('profiles').update({card_theme:theme,card_color_idx:colorIdx}).eq('id',profile.id)
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false),2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-3 font-medium">معاينة البطاقة</p>
        <BusinessCardPreview
          name={name} jobTitle={job} bio={profile.bio??''} phone={phone} email={email}
          logoUrl={avatar} qrValue={profileUrl} theme={theme}
          primaryColor={colors.primary} secondaryColor={colors.secondary} flippable={true}
        />
      </div>

      <div>
        <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">حجم البطاقة</p>
        <div className="grid grid-cols-2 gap-2">
          {SIZES.map(s=>(
            <button key={s.id} onClick={()=>setSizeId(s.id)}
              className={`flex items-center justify-between py-2.5 px-3 rounded-xl text-xs font-medium transition-all border ${sizeId===s.id?'border-[#6366F1] bg-[#6366F110] text-[#6366F1]':'border-[var(--border)] text-[var(--text-muted)]'}`}>
              <span>{s.label}</span><span className="opacity-60 text-[10px]">{s.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">السمة</p>
        <div className="grid grid-cols-4 gap-2">
          {THEMES.map(t=>(
            <button key={t.id} onClick={()=>setTheme(t.id)}
              className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-medium transition-all border ${theme===t.id?'border-[#6366F1] bg-[#6366F110] text-[#6366F1]':'border-[var(--border)] text-[var(--text-muted)]'}`}>
              <span className="text-base">{t.emoji}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">الألوان</p>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_PAIRS.map((pair,idx)=>(
            <button key={idx} onClick={()=>setColorIdx(idx)}
              className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl transition-all border ${colorIdx===idx?'border-[#6366F1] scale-105':'border-[var(--border)]'}`}>
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

      <button onClick={handleSaveImage} disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-semibold border border-[var(--border)] hover:border-[#6366F1] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        style={{background:loading?undefined:'linear-gradient(135deg,#6366F1,#A855F7)',color:'white',border:'none'}}>
        {loading
          ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          : '💾'} حفظ كصورة
      </button>

      <a href="https://ticketme.cc" target="_blank" rel="noopener noreferrer"
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 border-2"
        style={{borderColor:colors.primary,color:colors.primary}}>
        🎟 التذاكر — ticketme.cc
      </a>
    </div>
  )
}
