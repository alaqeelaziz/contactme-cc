'use client'

import { useState } from 'react'
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
  const [form, setForm] = useState({ name: '', jobTitle: '', phone: '', email: '', website: '' })

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

  const PX = 3
  function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath()
    ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r)
    ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath()
  }

  async function generateBothCanvas(): Promise<HTMLCanvasElement> {
    const W = 480, H = 274, GAP = 20
    const cv = document.createElement('canvas')
    cv.width = (W*2+GAP)*PX; cv.height = H*PX
    const ctx = cv.getContext('2d')!
    ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,cv.width,cv.height)
    ctx.scale(PX,PX)

    const isDark = theme==='dark'||theme==='gradient'
    const textColor  = isDark?'#FFF':'#111827'
    const subtextClr = theme==='dark'?'#93C5FD':theme==='gradient'?'rgba(255,255,255,0.85)':colors.primary
    const metaColor  = isDark?'rgba(255,255,255,0.65)':'#6B7280'
    const dotColor   = theme==='gradient'?'rgba(255,255,255,0.9)':isDark?'#FFF':colors.primary

    // ── FRONT (offset 0) ──
    ctx.save()
    if (theme==='gradient') {
      const g=ctx.createLinearGradient(0,0,W,H); g.addColorStop(0,colors.primary); g.addColorStop(1,colors.secondary); ctx.fillStyle=g
    } else if (theme==='dark') {
      const g=ctx.createLinearGradient(0,0,W,H); g.addColorStop(0,'#1A1A3E'); g.addColorStop(1,'#2d2d5e'); ctx.fillStyle=g
    } else { ctx.fillStyle=theme==='light'?'#FFFFFF':'#F8FAFC' }
    ctx.fillRect(0,0,W,H)
    if (!isDark){ ctx.strokeStyle=theme==='light'?'#E5E7EB':'#E2E8F0'; ctx.lineWidth=1; ctx.strokeRect(.5,.5,W-1,H-1) }
    ctx.restore()

    // Avatar
    const AX=20,AY=20,AS=44
    rr(ctx,AX,AY,AS,AS,10)
    if (theme==='gradient'){ctx.fillStyle='rgba(255,255,255,0.25)'}
    else{const g=ctx.createLinearGradient(AX,AY,AX+AS,AY+AS);g.addColorStop(0,colors.primary);g.addColorStop(1,colors.secondary);ctx.fillStyle=g}
    ctx.fill()
    ctx.fillStyle='#FFF'; ctx.font=`bold 18px Tahoma,Arial`
    ctx.textAlign='center'; ctx.textBaseline='middle'
    ctx.fillText(initial,AX+AS/2,AY+AS/2)

    // Name & job
    const TX=AX+AS+12
    ctx.textAlign='left'; ctx.textBaseline='top'; ctx.fillStyle=textColor
    ctx.font=`bold 14px Tahoma,Arial`
    ctx.fillText(form.name||'اسمك هنا',TX,AY+4)
    ctx.fillStyle=subtextClr; ctx.font=`12px Tahoma,Arial`
    ctx.fillText(form.jobTitle||'المسمى الوظيفي',TX,AY+23)

    // Logo mark
    const LMX=W-58,LMY=AY
    rr(ctx,LMX-5,LMY-5,42,42,10)
    ctx.fillStyle=isDark?'rgba(255,255,255,0.12)':`${colors.primary}22`; ctx.fill()
    for(let i=0;i<9;i++){
      if(![0,1,3,4,7,8].includes(i)) continue
      rr(ctx,LMX+(i%3)*10.5,LMY+Math.floor(i/3)*10.5,9,9,2)
      ctx.fillStyle=dotColor; ctx.fill()
    }

    // Divider
    const divY=Math.round(H/2)+10
    ctx.save(); ctx.globalAlpha=0.2; ctx.fillStyle=textColor; ctx.fillRect(20,divY,W-40,1); ctx.restore()

    // Contact
    let cy=divY+14
    ctx.textAlign='left'; ctx.textBaseline='top'; ctx.fillStyle=metaColor; ctx.font=`11px Arial,sans-serif`
    if(form.phone){ctx.fillText('📞  '+form.phone,20,cy);cy+=19}
    if(form.email){ctx.fillText('✉  '+form.email,20,cy);cy+=19}
    if(form.website){ctx.fillText('🌐  '+form.website,20,cy)}

    // ── BACK (offset W+GAP) ──
    const ox=W+GAP
    ctx.save()
    if (theme==='gradient') {
      const g=ctx.createLinearGradient(ox,0,ox+W,H); g.addColorStop(0,colors.primary); g.addColorStop(1,colors.secondary); ctx.fillStyle=g
    } else if (theme==='dark') {
      const g=ctx.createLinearGradient(ox,0,ox+W,H); g.addColorStop(0,'#1A1A3E'); g.addColorStop(1,'#2d2d5e'); ctx.fillStyle=g
    } else { ctx.fillStyle=theme==='light'?'#FFFFFF':'#F8FAFC' }
    ctx.fillRect(ox,0,W,H)
    if (!isDark){ ctx.strokeStyle=theme==='light'?'#E5E7EB':'#E2E8F0'; ctx.lineWidth=1; ctx.strokeRect(ox+.5,.5,W-1,H-1) }
    ctx.restore()

    // QR
    const QR=await import('qrcode')
    const qs=120,pad=12
    const qx=ox+(W-qs)/2, qy=(H-qs)/2-10
    const du=await QR.toDataURL(qrValue,{width:qs*3,margin:1,color:{dark:colors.primary,light:'#FFFFFF'}})
    rr(ctx,qx-pad,qy-pad,qs+pad*2,qs+pad*2,12); ctx.fillStyle='#FFF'; ctx.fill()
    const qi=new Image(); await new Promise<void>(r=>{qi.onload=()=>r();qi.src=du}); ctx.drawImage(qi,qx,qy,qs,qs)
    // URL char by char
    ctx.fillStyle=metaColor; ctx.font=`9px Arial,sans-serif`; ctx.textBaseline='top'
    const url=qrValue; const tw=ctx.measureText(url).width
    let cx2=(W-tw)/2+ox; const ty=qy+qs+pad+4
    for(const ch of url){ctx.fillText(ch,cx2,ty);cx2+=ctx.measureText(ch).width}

    return cv
  }

  async function handleDownloadPng() {
    const cv = await generateBothCanvas()
    cv.toBlob(blob=>{
      if(!blob) return
      const a=document.createElement('a'); a.download='business-card.png'
      a.href=URL.createObjectURL(blob); a.click()
    },'image/png')
  }

  // Front preview JSX
  const FrontContent = (
    <div className="w-full h-full rounded-2xl overflow-hidden p-5 flex flex-col justify-between"
      style={{ background:t.bg, border:t.border, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-base flex-shrink-0"
            style={{ background:theme==='gradient'?'rgba(255,255,255,0.25)':`linear-gradient(135deg,${colors.primary},${colors.secondary})` }}>
            {initial}
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight" style={{color:t.text}}>{form.name||'اسمك هنا'}</h3>
            <p className="text-xs mt-0.5 font-medium" style={{color:t.subtext}}>{form.jobTitle||'المسمى الوظيفي'}</p>
          </div>
        </div>
        <div className="rounded-xl p-2.5 flex-shrink-0" style={{background:t.iconBg}}>
          <div className="w-8 h-8 grid grid-cols-3 gap-0.5">
            {Array.from({length:9}).map((_,i)=>(
              <div key={i} className="rounded-[2px]"
                style={{background:[0,1,3,4,7,8].includes(i)?(theme==='gradient'?'rgba(255,255,255,0.9)':theme==='dark'?'#FFF':colors.primary):'transparent'}}/>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-px opacity-20" style={{background:t.text}}/>
      <div className="flex flex-col gap-1.5">
        {form.phone&&<span className="text-[11px]" style={{color:t.metaText}}>📞  {form.phone}</span>}
        {form.email&&<span className="text-[11px]" style={{color:t.metaText}}>✉  {form.email}</span>}
        {form.website&&<span className="text-[11px]" style={{color:t.metaText}}>🌐  {form.website}</span>}
      </div>
    </div>
  )

  const BackContent = (
    <div className="w-full h-full rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-3"
      style={{background:t.bg,border:t.border,boxShadow:'0 20px 60px rgba(0,0,0,0.2)'}}>
      <div className="p-3 rounded-xl bg-white shadow-lg">
        <QRCodeCanvas value={qrValue} size={100} fgColor={colors.primary} bgColor="#FFFFFF" level="H" includeMargin={false}/>
      </div>
      <p className="text-[10px] px-6 text-center break-all w-full" style={{color:t.metaText}}>{qrValue}</p>
    </div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">بياناتك</h3>
          {[
            {key:'name',     label:'الاسم الكامل',      placeholder:'محمد عبدالله'},
            {key:'jobTitle', label:'المسمى الوظيفي',    placeholder:'مدير تنفيذي'},
            {key:'phone',    label:'رقم الجوال',        placeholder:'+966 5X XXX XXXX'},
            {key:'email',    label:'البريد الإلكتروني', placeholder:'you@example.com'},
            {key:'website',  label:'الموقع / الرابط',   placeholder:'https://contactme.cc/username'},
          ].map(f=>(
            <div key={f.key}>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">{f.label}</label>
              <input type="text" placeholder={f.placeholder} value={(form as any)[f.key]}
                onChange={e=>setForm(prev=>({...prev,[f.key]:e.target.value}))}
                className="input w-full"/>
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">السمة</label>
            <div className="grid grid-cols-4 gap-2">
              {THEMES.map(th=>(
                <button key={th.id} onClick={()=>setTheme(th.id)}
                  className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-medium transition-all border ${theme===th.id?'border-[#6366F1] bg-[#6366F110] text-[#6366F1]':'border-[var(--border)] text-[var(--text-muted)]'}`}>
                  <span className="text-base">{th.emoji}</span>{th.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">الألوان</label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PAIRS.map((pair,idx)=>(
                <button key={idx} onClick={()=>setColorIdx(idx)}
                  className={`flex flex-col items-center gap-1.5 py-2 px-1 rounded-xl transition-all border ${colorIdx===idx?'border-[#6366F1] scale-105':'border-[var(--border)]'}`}>
                  <div className="w-8 h-3.5 rounded-full" style={{background:`linear-gradient(90deg,${pair.primary},${pair.secondary})`}}/>
                  <span className="text-[10px] text-[var(--text-muted)]">{pair.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Download PNG only */}
          <button onClick={handleDownloadPng}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{background:`linear-gradient(135deg,${colors.primary},${colors.secondary})`}}>
            💾 حفظ كصورة PNG
          </button>
          <p className="text-center text-[11px] text-[var(--text-muted)]">💡 مجاني تماماً — لا حساب مطلوب</p>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">المعاينة</h3>

          {/* Front & back stacked vertically */}
          <div className="space-y-3">
            <div style={{aspectRatio:'1.75/1'}}>{FrontContent}</div>
            <div style={{aspectRatio:'1.75/1'}} onClick={()=>setFlipped(f=>!f)} className="cursor-pointer">
              {BackContent}
            </div>
          </div>

          <p className="text-center text-[11px] text-[var(--text-muted)]">
            الوجه الأمامي والخلفي — في الصورة المحفوظة
          </p>
        </div>
      </div>
    </div>
  )
}

