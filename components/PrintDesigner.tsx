'use client'

import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import toast from 'react-hot-toast'

type Theme = 'dark' | 'light' | 'gradient' | 'minimal'
type SizeId = 'standard' | 'square' | 'portrait' | 'large'

interface Step { icon: string; title: string; description: string }
interface Props {
  title: string; subtitle: string; steps: Step[]
  downloadPdfLabel: string; downloadPngLabel: string; printLabel: string; noteLabel: string
  profileName?: string; profileTitle?: string; profilePhone?: string; profileEmail?: string
}

const THEMES: { id: Theme; label: string; preview: string }[] = [
  { id: 'dark',     label: 'داكن',   preview: 'linear-gradient(135deg,#1A1A3E,#2d2d5e)' },
  { id: 'light',    label: 'فاتح',   preview: '#FFFFFF' },
  { id: 'gradient', label: 'متدرج',  preview: 'linear-gradient(135deg,#4B9EFF,#8B5CF6)' },
  { id: 'minimal',  label: 'بسيط',   preview: '#F8FAFC' },
]

const COLOR_PRESETS = [
  { primary: '#4B9EFF', secondary: '#8B5CF6' },
  { primary: '#10B981', secondary: '#3B82F6' },
  { primary: '#F59E0B', secondary: '#EF4444' },
  { primary: '#EC4899', secondary: '#8B5CF6' },
  { primary: '#14B8A6', secondary: '#6366F1' },
  { primary: '#F97316', secondary: '#EAB308' },
]

const SIZES: { id: SizeId; label: string; sub: string; W: number; H: number; mmW: number; mmH: number }[] = [
  { id: 'standard', label: 'قياسي',   sub: '85×54 mm',  W: 480, H: 272, mmW: 85.6, mmH: 54   },
  { id: 'square',   label: 'مربع',    sub: '70×70 mm',  W: 340, H: 340, mmW: 70,   mmH: 70   },
  { id: 'portrait', label: 'عمودي',   sub: '54×86 mm',  W: 260, H: 416, mmW: 54,   mmH: 85.6 },
  { id: 'large',    label: 'كبير A6', sub: '105×74 mm', W: 560, H: 394, mmW: 105,  mmH: 74   },
]

export default function PrintDesigner({ title, subtitle, steps, downloadPdfLabel, downloadPngLabel, noteLabel, profileName, profileTitle, profilePhone, profileEmail }: Props) {
  const [loading, setLoading]   = useState(false)
  const [theme, setTheme]       = useState<Theme>('dark')
  const [colors, setColors]     = useState(COLOR_PRESETS[0])
  const [sizeId, setSizeId]     = useState<SizeId>('standard')
  const [name, setName]         = useState(profileName || '')
  const [jobTitle, setJobTitle] = useState(profileTitle || '')
  const [bio, setBio]           = useState('')
  const [phone, setPhone]       = useState(profilePhone || '')
  const [email, setEmail]       = useState(profileEmail || '')
  const [qrValue, setQrValue]   = useState('')
  const [logoUrl, setLogoUrl]   = useState<string | null>(null)

  const size   = SIZES.find(s => s.id === sizeId)!
  const isDark = theme === 'dark' || theme === 'gradient'
  const qr     = qrValue || 'https://contactme.cc'

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('الحجم الأقصى 2MB'); return }
    const r = new FileReader(); r.onload = ev => setLogoUrl(ev.target?.result as string); r.readAsDataURL(file)
  }

  async function loadImg(src: string): Promise<HTMLImageElement> {
    const img = new Image(); img.crossOrigin = 'anonymous'
    return new Promise(r => { img.onload = () => r(img); img.onerror = () => r(img); img.src = src })
  }

  function drawBg(ctx: CanvasRenderingContext2D, W: number, H: number, ox = 0, oy = 0) {
    if (theme === 'gradient') {
      const g = ctx.createLinearGradient(ox,oy,ox+W,oy+H); g.addColorStop(0,colors.primary); g.addColorStop(1,colors.secondary); ctx.fillStyle=g
    } else if (theme === 'dark') {
      const g = ctx.createLinearGradient(ox,oy,ox+W,oy+H); g.addColorStop(0,'#1A1A3E'); g.addColorStop(1,'#2d2d5e'); ctx.fillStyle=g
    } else { ctx.fillStyle = theme==='light' ? '#FFFFFF' : '#F8FAFC' }
    ctx.fillRect(ox,oy,W,H)
    if (!isDark) { ctx.strokeStyle=theme==='light'?'#E5E7EB':'#E2E8F0'; ctx.lineWidth=1; ctx.strokeRect(ox+.5,oy+.5,W-1,H-1) }
  }

  // Draw multiline bio text on canvas
  function drawBioCanvas(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, maxWidth: number) {
    if (!text.trim()) return 0
    ctx.save()
    ctx.direction = 'rtl'; ctx.textAlign = 'right'; ctx.textBaseline = 'top'
    ctx.fillStyle = color; ctx.font = '10px Tahoma,Arial'
    const lines = text.split('\n')
    let totalH = 0
    lines.forEach((line, i) => {
      ctx.fillText(line.substring(0, 40), x, y + i * 13) // max 40 chars per line
      totalH = (i + 1) * 13
    })
    ctx.restore()
    return totalH
  }

  async function drawFrontStandard(ctx: CanvasRenderingContext2D, W: number, H: number, ox: number, oy: number) {
    const txtC=isDark?'#FFF':'#111827', subC=theme==='dark'?'#93C5FD':theme==='gradient'?'rgba(255,255,255,0.85)':colors.primary
    const metC=isDark?'rgba(255,255,255,0.65)':'#6B7280', dotC=theme==='gradient'?'rgba(255,255,255,0.9)':isDark?'#FFF':colors.primary
    const n=name||'اسمك هنا'
    drawBg(ctx,W,H,ox,oy)
    const AS=44, AX=ox+W-AS-16, AY=oy+16
    if(logoUrl){const img=await loadImg(logoUrl);ctx.save();ctx.beginPath();ctx.roundRect(AX,AY,AS,AS,10);ctx.clip();ctx.drawImage(img,AX,AY,AS,AS);ctx.restore()}
    else{ctx.beginPath();ctx.roundRect(AX,AY,AS,AS,10);ctx.fillStyle=theme==='gradient'?'rgba(255,255,255,0.25)':(()=>{const g=ctx.createLinearGradient(AX,AY,AX+AS,AY+AS);g.addColorStop(0,colors.primary);g.addColorStop(1,colors.secondary);return g})();ctx.fill();ctx.fillStyle='#FFF';ctx.font=`bold ${Math.round(AS*.4)}px Tahoma,Arial`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n.charAt(0),AX+AS/2,AY+AS/2)}
    ctx.save();ctx.direction='rtl';ctx.textAlign='right';ctx.textBaseline='top'
    ctx.fillStyle=txtC;ctx.font='bold 14px Tahoma,Arial';ctx.fillText(n,AX-10,AY+4)
    ctx.fillStyle=subC;ctx.font='12px Tahoma,Arial';ctx.fillText(jobTitle||'المسمى الوظيفي',AX-10,AY+22)
    // Bio below job title
    if(bio) drawBioCanvas(ctx, bio, AX-10, AY+38, isDark?'rgba(255,255,255,0.55)':'#9CA3AF', W-100)
    ctx.restore()
    const GX=ox+16,GY=oy+16,GS=38,ds=10
    ctx.beginPath();ctx.roundRect(GX-4,GY-4,GS+8,GS+8,8);ctx.fillStyle=isDark?'rgba(255,255,255,0.12)':`${colors.primary}22`;ctx.fill()
    for(let i=0;i<9;i++){if(![0,1,3,4,7,8].includes(i))continue;ctx.beginPath();ctx.roundRect(GX+(i%3)*(ds+2),GY+Math.floor(i/3)*(ds+2),ds,ds,2);ctx.fillStyle=dotC;ctx.fill()}
    const divY=oy+Math.round(H*.55);ctx.save();ctx.globalAlpha=.18;ctx.fillStyle=txtC;ctx.fillRect(ox+16,divY,W-32,1);ctx.restore()
    ctx.save();ctx.direction='ltr';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillStyle=metC;ctx.font='11px Arial,sans-serif'
    let cy=divY+12;if(phone){ctx.fillText('📞  '+phone,ox+16,cy);cy+=20}if(email){ctx.fillText('✉  '+email,ox+16,cy);cy+=20}ctx.font='10px Arial,sans-serif';ctx.fillText('🌐  '+qr,ox+16,cy);ctx.restore()
  }

  async function drawFrontSquare(ctx: CanvasRenderingContext2D, W: number, H: number, ox: number, oy: number) {
    const txtC=isDark?'#FFF':'#111827', subC=theme==='dark'?'#93C5FD':theme==='gradient'?'rgba(255,255,255,0.85)':colors.primary
    const metC=isDark?'rgba(255,255,255,0.65)':'#6B7280', n=name||'اسمك هنا'
    drawBg(ctx,W,H,ox,oy)
    const g2=ctx.createLinearGradient(ox,oy,ox+W,oy);g2.addColorStop(0,colors.primary);g2.addColorStop(1,colors.secondary);ctx.fillStyle=g2;ctx.fillRect(ox,oy,W,5)
    const AS=72,AX=ox+(W-AS)/2,AY=oy+28
    if(logoUrl){const img=await loadImg(logoUrl);ctx.save();ctx.beginPath();ctx.roundRect(AX,AY,AS,AS,AS/2);ctx.clip();ctx.drawImage(img,AX,AY,AS,AS);ctx.restore()}
    else{ctx.beginPath();ctx.roundRect(AX,AY,AS,AS,AS/2);const ag=ctx.createLinearGradient(AX,AY,AX+AS,AY+AS);ag.addColorStop(0,colors.primary);ag.addColorStop(1,colors.secondary);ctx.fillStyle=ag;ctx.fill();ctx.fillStyle='#FFF';ctx.font=`bold ${Math.round(AS*.38)}px Tahoma,Arial`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n.charAt(0),AX+AS/2,AY+AS/2)}
    ctx.save();ctx.beginPath();ctx.roundRect(AX-2,AY-2,AS+4,AS+4,AS/2+2);ctx.strokeStyle=isDark?'rgba(255,255,255,0.4)':colors.primary;ctx.lineWidth=2;ctx.stroke();ctx.restore()
    ctx.save();ctx.direction='rtl';ctx.textAlign='center';ctx.textBaseline='top'
    ctx.fillStyle=txtC;ctx.font='bold 15px Tahoma,Arial';ctx.fillText(n,ox+W/2,AY+AS+14)
    ctx.fillStyle=subC;ctx.font='12px Tahoma,Arial';ctx.fillText(jobTitle||'المسمى الوظيفي',ox+W/2,AY+AS+32)
    if(bio){ctx.fillStyle=isDark?'rgba(255,255,255,0.5)':'#9CA3AF';ctx.font='10px Tahoma,Arial';ctx.fillText(bio.split('\n')[0].substring(0,35),ox+W/2,AY+AS+48)}
    ctx.restore()
    const divY=AY+AS+(bio?68:55);ctx.save();ctx.globalAlpha=.15;ctx.fillStyle=txtC;ctx.fillRect(ox+30,divY,W-60,1);ctx.restore()
    ctx.save();ctx.direction='ltr';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillStyle=metC;ctx.font='11px Arial,sans-serif';let cy=divY+10;const lx=ox+30;if(phone){ctx.fillText('📞  '+phone,lx,cy);cy+=18}if(email){ctx.fillText('✉  '+email,lx,cy);cy+=18}ctx.font='10px Arial,sans-serif';ctx.fillText('🌐  '+qr,lx,cy);ctx.restore()
  }

  async function drawFrontPortrait(ctx: CanvasRenderingContext2D, W: number, H: number, ox: number, oy: number) {
    const txtC=isDark?'#FFF':'#111827', subC=theme==='dark'?'#93C5FD':theme==='gradient'?'rgba(255,255,255,0.85)':colors.primary
    const metC=isDark?'rgba(255,255,255,0.65)':'#6B7280', n=name||'اسمك هنا'
    drawBg(ctx,W,H,ox,oy)
    ctx.save();const hg=ctx.createLinearGradient(ox,oy,ox+W,oy+H*.4);hg.addColorStop(0,isDark?'rgba(255,255,255,0.07)':`${colors.primary}18`);hg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=hg;ctx.fillRect(ox,oy,W,H*.4);ctx.restore()
    const gl=ctx.createLinearGradient(ox,oy,ox+W,oy);gl.addColorStop(0,colors.primary);gl.addColorStop(1,colors.secondary);ctx.fillStyle=gl;ctx.fillRect(ox,oy,W,4)
    const AS=60,AX=ox+(W-AS)/2,AY=oy+22
    if(logoUrl){const img=await loadImg(logoUrl);ctx.save();ctx.beginPath();ctx.roundRect(AX,AY,AS,AS,AS/2);ctx.clip();ctx.drawImage(img,AX,AY,AS,AS);ctx.restore()}
    else{ctx.beginPath();ctx.roundRect(AX,AY,AS,AS,AS/2);const ag=ctx.createLinearGradient(AX,AY,AX+AS,AY+AS);ag.addColorStop(0,colors.primary);ag.addColorStop(1,colors.secondary);ctx.fillStyle=ag;ctx.fill();ctx.fillStyle='#FFF';ctx.font=`bold ${Math.round(AS*.38)}px Tahoma,Arial`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n.charAt(0),AX+AS/2,AY+AS/2)}
    ctx.save();ctx.beginPath();ctx.roundRect(AX-2,AY-2,AS+4,AS+4,AS/2+2);ctx.strokeStyle=isDark?'rgba(255,255,255,0.4)':colors.primary;ctx.lineWidth=2.5;ctx.stroke();ctx.restore()
    ctx.save();ctx.direction='rtl';ctx.textAlign='center';ctx.textBaseline='top'
    ctx.fillStyle=txtC;ctx.font='bold 14px Tahoma,Arial';ctx.fillText(n,ox+W/2,AY+AS+14)
    ctx.fillStyle=subC;ctx.font='11px Tahoma,Arial';ctx.fillText(jobTitle||'المسمى الوظيفي',ox+W/2,AY+AS+30)
    if(bio){ctx.fillStyle=isDark?'rgba(255,255,255,0.5)':'#9CA3AF';ctx.font='10px Tahoma,Arial';bio.split('\n').slice(0,2).forEach((l,i)=>ctx.fillText(l.substring(0,28),ox+W/2,AY+AS+46+i*13))}
    ctx.restore()
    const lineY=AY+AS+(bio?46+bio.split('\n').slice(0,2).length*13:52);
    ctx.save();ctx.globalAlpha=.2;ctx.fillStyle=txtC;ctx.fillRect(ox+16,lineY,W-32,1);ctx.restore()
    ctx.save();ctx.globalAlpha=.6;ctx.beginPath();ctx.roundRect(ox+W/2-3,lineY-3,6,6,3);ctx.fillStyle=isDark?'#FFF':colors.primary;ctx.fill();ctx.restore()
    ctx.save();ctx.direction='ltr';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillStyle=metC;ctx.font='12px Arial,sans-serif';let cy=lineY+12;const lx=ox+20;if(phone){ctx.fillText('📞  '+phone,lx,cy);cy+=22}if(email){ctx.fillText('✉  '+email,lx,cy);cy+=22}ctx.font='10px Arial,sans-serif';ctx.fillText('🌐  '+qr,lx,cy);ctx.restore()
  }

  async function drawFrontLarge(ctx: CanvasRenderingContext2D, W: number, H: number, ox: number, oy: number) {
    const txtC=isDark?'#FFF':'#111827', subC=theme==='dark'?'#93C5FD':theme==='gradient'?'rgba(255,255,255,0.85)':colors.primary
    const metC=isDark?'rgba(255,255,255,0.65)':'#6B7280', n=name||'اسمك هنا'
    drawBg(ctx,W,H,ox,oy)
    ctx.save();const vg=ctx.createLinearGradient(ox,oy,ox,oy+H);vg.addColorStop(0,colors.primary);vg.addColorStop(1,colors.secondary);ctx.fillStyle=vg;ctx.fillRect(ox,oy,80,H);ctx.restore()
    const AS=52,AX=ox+14,AY=oy+(H-AS)/2
    if(logoUrl){const img=await loadImg(logoUrl);ctx.save();ctx.beginPath();ctx.roundRect(AX,AY,AS,AS,AS/2);ctx.clip();ctx.drawImage(img,AX,AY,AS,AS);ctx.restore()}
    else{ctx.beginPath();ctx.roundRect(AX,AY,AS,AS,AS/2);ctx.fillStyle='rgba(255,255,255,0.25)';ctx.fill();ctx.fillStyle='#FFF';ctx.font=`bold ${Math.round(AS*.4)}px Tahoma,Arial`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n.charAt(0),AX+AS/2,AY+AS/2)}
    const DX=ox+18,DY=oy+H-48;for(let i=0;i<6;i++){if([2,5].includes(i))continue;ctx.beginPath();ctx.roundRect(DX+(i%3)*13,DY+Math.floor(i/3)*13,9,9,2);ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fill()}
    const RX=ox+96
    ctx.save();ctx.direction='rtl';ctx.textAlign='right';ctx.textBaseline='top'
    ctx.fillStyle=txtC;ctx.font='bold 18px Tahoma,Arial';ctx.fillText(n,ox+W-16,oy+22)
    ctx.fillStyle=subC;ctx.font='13px Tahoma,Arial';ctx.fillText(jobTitle||'المسمى الوظيفي',ox+W-16,oy+46)
    if(bio){ctx.fillStyle=isDark?'rgba(255,255,255,0.5)':'#9CA3AF';ctx.font='11px Tahoma,Arial';bio.split('\n').slice(0,2).forEach((l,i)=>ctx.fillText(l.substring(0,38),ox+W-16,oy+66+i*14))}
    ctx.restore()
    const divY=oy+Math.round(H*.42);ctx.save();ctx.globalAlpha=.15;ctx.fillStyle=txtC;ctx.fillRect(RX,divY,W-RX-ox-16,1);ctx.restore()
    ctx.save();ctx.direction='ltr';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillStyle=metC;ctx.font='12px Arial,sans-serif';let cy=divY+16;if(phone){ctx.fillText('📞  '+phone,RX,cy);cy+=26}if(email){ctx.fillText('✉  '+email,RX,cy);cy+=26}ctx.font='11px Arial,sans-serif';ctx.fillText('🌐  '+qr,RX,cy);ctx.restore()
  }

  async function drawFront(ctx: CanvasRenderingContext2D, W: number, H: number, ox: number, oy: number) {
    if(sizeId==='square')   return drawFrontSquare(ctx,W,H,ox,oy)
    if(sizeId==='portrait') return drawFrontPortrait(ctx,W,H,ox,oy)
    if(sizeId==='large')    return drawFrontLarge(ctx,W,H,ox,oy)
    return drawFrontStandard(ctx,W,H,ox,oy)
  }

  async function drawBack(ctx: CanvasRenderingContext2D, W: number, H: number, ox: number, oy: number) {
    const metC=isDark?'rgba(255,255,255,0.6)':'#6B7280'
    drawBg(ctx,W,H,ox,oy)
    const QR=await import('qrcode');const qs=Math.round(Math.min(W,H)*.48);const qx=ox+Math.round((W-qs)/2),qy=oy+Math.round((H-qs)/2)-10;const pad=12
    const du=await QR.toDataURL(qr,{width:qs*3,margin:1,color:{dark:colors.primary,light:'#FFFFFF'}})
    ctx.beginPath();ctx.roundRect(qx-pad,qy-pad,qs+pad*2,qs+pad*2,12);ctx.fillStyle='#FFF';ctx.fill()
    const qi=await loadImg(du);ctx.drawImage(qi,qx,qy,qs,qs)
    ctx.save();ctx.direction='ltr';ctx.textAlign='center';ctx.textBaseline='top';ctx.fillStyle=metC;ctx.font='9px Arial,sans-serif';ctx.fillText(qr,ox+W/2,qy+qs+pad+6);ctx.restore()
  }

  async function buildCanvas(): Promise<[HTMLCanvasElement, number, number]> {
    const PX=3,{W,H,mmW,mmH}=size,GAP=16
    const cv=document.createElement('canvas');cv.width=(W*2+GAP)*PX;cv.height=H*PX
    const ctx=cv.getContext('2d')!;ctx.fillStyle='#fff';ctx.fillRect(0,0,cv.width,cv.height);ctx.scale(PX,PX)
    await drawFront(ctx,W,H,0,0);await drawBack(ctx,W,H,W+GAP,0)
    return [cv,mmW*2+4,mmH]
  }

  async function handlePDF() {
    setLoading(true)
    try {
      const [cv,pdfW,pdfH]=await buildCanvas();const {jsPDF}=await import('jspdf')
      const pdf=new jsPDF({orientation:'landscape',unit:'mm',format:[pdfW,pdfH]})
      pdf.addImage(cv.toDataURL('image/png'),'PNG',0,0,pdfW,pdfH);pdf.save('contactme-card.pdf');toast.success('تم التحميل')
    } catch { toast.error('فشل التحميل') } finally { setLoading(false) }
  }

  async function handlePNG() {
    setLoading(true)
    try {
      const [cv]=await buildCanvas()
      cv.toBlob(blob=>{if(!blob)return;const a=document.createElement('a');a.download='contactme-card.png';a.href=URL.createObjectURL(blob);a.click();toast.success('تم التحميل')},'image/png')
    } catch { toast.error('فشل التحميل') } finally { setLoading(false) }
  }

  const bg=theme==='gradient'?`linear-gradient(135deg,${colors.primary},${colors.secondary})`:theme==='dark'?'linear-gradient(135deg,#1A1A3E,#2d2d5e)':theme==='light'?'#FFFFFF':'#F8FAFC'
  const border=isDark?'none':`1px solid ${theme==='light'?'#E5E7EB':'#E2E8F0'}`
  const txtC=isDark?'#FFF':'#111827', subC=theme==='dark'?'#93C5FD':theme==='gradient'?'rgba(255,255,255,0.85)':colors.primary
  const metC=isDark?'rgba(255,255,255,0.65)':'#6B7280', ini=(name||'أ').charAt(0)

  const AvatarEl = ({ sz, rounded }: { sz: string; rounded: string }) => (
    logoUrl
      ? <img src={logoUrl} alt="" className={`${sz} ${rounded} object-cover flex-shrink-0`} style={{outline:`2px solid ${colors.primary}`,outlineOffset:'2px'}}/>
      : <div className={`${sz} ${rounded} flex items-center justify-center text-white font-bold flex-shrink-0`}
          style={{background:theme==='gradient'?'rgba(255,255,255,0.25)':`linear-gradient(135deg,${colors.primary},${colors.secondary})`}}>{ini}</div>
  )

  const PreviewStandard = (
    <div className="w-full h-full rounded-2xl p-4 flex flex-col justify-between overflow-hidden" style={{background:bg,border,direction:'rtl'}}>
      <div className="flex items-start justify-between">
        <div className="rounded-xl p-2 flex-shrink-0" style={{background:isDark?'rgba(255,255,255,0.12)':`${colors.primary}22`}}>
          <div className="w-7 h-7 grid grid-cols-3 gap-0.5">{Array.from({length:9}).map((_,i)=><div key={i} className="rounded-[2px]" style={{background:[0,1,3,4,7,8].includes(i)?(theme==='gradient'?'rgba(255,255,255,0.9)':isDark?'#FFF':colors.primary):'transparent'}}/>)}</div>
        </div>
        <div className="flex items-start gap-2">
          <div className="text-right">
            <div className="font-bold text-sm" style={{color:txtC}}>{name||'اسمك هنا'}</div>
            <div className="text-xs mt-0.5" style={{color:subC}}>{jobTitle||'المسمى الوظيفي'}</div>
            {bio&&<div className="text-[9px] mt-0.5 max-w-[120px] leading-tight" style={{color:metC}}>{bio.split('\n').map((l,i)=><span key={i}>{l}<br/></span>)}</div>}
          </div>
          <AvatarEl sz="w-10 h-10" rounded="rounded-xl"/>
        </div>
      </div>
      <div style={{height:1,background:txtC,opacity:.15}}/>
      <div className="flex flex-col gap-1" dir="ltr">
        {phone&&<span className="text-[10px]" style={{color:metC}}>📞  {phone}</span>}
        {email&&<span className="text-[10px]" style={{color:metC}}>✉  {email}</span>}
        <span className="text-[10px]" style={{color:metC}}>🌐  {qr}</span>
      </div>
    </div>
  )

  const PreviewSquare = (
    <div className="w-full h-full rounded-2xl flex flex-col items-center overflow-hidden pt-1" style={{background:bg,border}}>
      <div className="w-full h-1.5" style={{background:`linear-gradient(90deg,${colors.primary},${colors.secondary})`}}/>
      <div className="flex flex-col items-center mt-3 gap-0.5">
        <AvatarEl sz="w-12 h-12" rounded="rounded-full"/>
        <div className="font-bold text-sm mt-1" style={{color:txtC}}>{name||'اسمك هنا'}</div>
        <div className="text-xs" style={{color:subC}}>{jobTitle||'المسمى الوظيفي'}</div>
        {bio&&<div className="text-[9px] text-center px-3 leading-tight" style={{color:metC}}>{bio.split('\n')[0]}</div>}
      </div>
      <div className="w-4/5 h-px my-2" style={{background:txtC,opacity:.15}}/>
      <div className="flex flex-col items-start gap-1 px-4 w-full" dir="ltr">
        {phone&&<span className="text-[9px]" style={{color:metC}}>📞  {phone}</span>}
        {email&&<span className="text-[9px]" style={{color:metC}}>✉  {email}</span>}
        <span className="text-[9px]" style={{color:metC}}>🌐  {qr}</span>
      </div>
    </div>
  )

  const PreviewPortrait = (
    <div className="w-full h-full rounded-2xl flex flex-col items-center overflow-hidden" style={{background:bg,border}}>
      <div className="w-full h-1" style={{background:`linear-gradient(90deg,${colors.primary},${colors.secondary})`}}/>
      <div className="flex flex-col items-center mt-4 gap-0.5">
        <AvatarEl sz="w-11 h-11" rounded="rounded-full"/>
        <div className="font-bold text-xs mt-1" style={{color:txtC}}>{name||'اسمك هنا'}</div>
        <div className="text-[10px]" style={{color:subC}}>{jobTitle||'المسمى الوظيفي'}</div>
        {bio&&<div className="text-[9px] text-center px-3 leading-tight" style={{color:metC}}>{bio.split('\n').map((l,i)=><span key={i}>{l}<br/></span>)}</div>}
      </div>
      <div className="w-4/5 h-px my-2" style={{background:txtC,opacity:.15}}/>
      <div className="flex flex-col items-start gap-1 px-3 w-full" dir="ltr">
        {phone&&<span className="text-[9px]" style={{color:metC}}>📞  {phone}</span>}
        {email&&<span className="text-[9px]" style={{color:metC}}>✉  {email}</span>}
        <span className="text-[9px]" style={{color:metC}}>🌐  {qr}</span>
      </div>
    </div>
  )

  const PreviewLarge = (
    <div className="w-full h-full rounded-2xl flex overflow-hidden" style={{background:bg,border}}>
      <div className="w-16 flex flex-col items-center justify-center flex-shrink-0" style={{background:`linear-gradient(180deg,${colors.primary},${colors.secondary})`}}>
        <AvatarEl sz="w-10 h-10" rounded="rounded-full"/>
      </div>
      <div className="flex flex-col justify-between p-3 flex-1" dir="rtl">
        <div>
          <div className="font-bold text-sm" style={{color:txtC}}>{name||'اسمك هنا'}</div>
          <div className="text-xs mt-0.5" style={{color:subC}}>{jobTitle||'المسمى الوظيفي'}</div>
          {bio&&<div className="text-[9px] mt-0.5 leading-tight" style={{color:metC}}>{bio.split('\n').map((l,i)=><span key={i}>{l}<br/></span>)}</div>}
        </div>
        <div className="h-px" style={{background:txtC,opacity:.15}}/>
        <div className="flex flex-col gap-1" dir="ltr">
          {phone&&<span className="text-[10px]" style={{color:metC}}>📞  {phone}</span>}
          {email&&<span className="text-[10px]" style={{color:metC}}>✉  {email}</span>}
          <span className="text-[10px]" style={{color:metC}}>🌐  {qr}</span>
        </div>
      </div>
    </div>
  )

  const BackPreview = (
    <div className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-2 overflow-hidden" style={{background:bg,border}}>
      <div className="p-2.5 rounded-xl bg-white shadow"><QRCodeCanvas value={qr} size={70} fgColor={colors.primary} bgColor="#FFFFFF" level="H"/></div>
      <p className="text-[8px] px-3 text-center break-all" dir="ltr" style={{color:isDark?'rgba(255,255,255,0.6)':'#6B7280'}}>{qr}</p>
    </div>
  )

  const previews = { standard:PreviewStandard, square:PreviewSquare, portrait:PreviewPortrait, large:PreviewLarge }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl p-8" style={{background:'linear-gradient(135deg,#4B9EFF08,#8B5CF608)',border:'1px solid var(--border)'}}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{color:'#4B9EFF'}}>{noteLabel}</p>
        <h2 className="text-2xl font-extrabold mb-2">{title}</h2>
        <p className="text-sm" style={{color:'var(--text-muted)'}}>{subtitle}</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {steps.map((s,i)=>(
            <div key={i} className="rounded-2xl p-4" style={{background:'var(--surface)',border:'1px solid var(--border)'}}>
              <div className="text-2xl mb-2">{s.icon}</div><h3 className="font-semibold text-sm mb-1">{s.title}</h3>
              <p className="text-xs" style={{color:'var(--text-muted)'}}>{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Preview */}
        <div className="rounded-3xl p-6 space-y-4" style={{background:'var(--surface)',border:'1px solid var(--border)'}}>
          <div>
            <p className="text-xs font-bold mb-2" style={{color:'var(--text-muted)'}}>الحجم</p>
            <div className="grid grid-cols-2 gap-2">
              {SIZES.map(s=>(
                <button key={s.id} onClick={()=>setSizeId(s.id)}
                  className="flex items-center justify-between py-2 px-3 rounded-xl text-xs font-medium transition-all"
                  style={{background:sizeId===s.id?'#4B9EFF18':'var(--bg)',border:`1.5px solid ${sizeId===s.id?'#4B9EFF':'var(--border)'}`,color:sizeId===s.id?'#4B9EFF':'var(--text)'}}>
                  <span>{s.label}</span><span className="opacity-60 text-[10px]">{s.sub}</span>
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs font-bold" style={{color:'var(--text-muted)'}}>الوجه الأمامي</p>
          <div style={{aspectRatio:`${size.W}/${size.H}`}}>{previews[sizeId]}</div>
          <p className="text-xs font-bold" style={{color:'var(--text-muted)'}}>الوجه الخلفي (QR)</p>
          <div style={{aspectRatio:`${size.W}/${size.H}`}}>{BackPreview}</div>
          <p className="text-center text-xs" style={{color:'var(--text-muted)'}}>✅ الوجهان جنباً لجنب في الملف المحمّل</p>
        </div>

        {/* Controls */}
        <div className="rounded-3xl p-5 space-y-5" style={{background:'var(--surface)',border:'1px solid var(--border)'}}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'var(--text-muted)'}}>البيانات</p>
            <div className="space-y-2">
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="الاسم الكامل" dir="rtl"
                className="w-full text-sm px-3 py-2 rounded-xl outline-none"
                style={{background:'var(--bg)',border:'1px solid var(--border)',color:'var(--text)'}}/>
              <input value={jobTitle} onChange={e=>setJobTitle(e.target.value)} placeholder="المسمى الوظيفي" dir="rtl"
                className="w-full text-sm px-3 py-2 rounded-xl outline-none"
                style={{background:'var(--bg)',border:'1px solid var(--border)',color:'var(--text)'}}/>
              <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="نبذة قصيرة... (Enter لسطر جديد)" dir="rtl" rows={3}
                className="w-full text-sm px-3 py-2 rounded-xl outline-none resize-none"
                style={{background:'var(--bg)',border:'1px solid var(--border)',color:'var(--text)'}}/>
              <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="رقم الهاتف" dir="ltr"
                className="w-full text-sm px-3 py-2 rounded-xl outline-none"
                style={{background:'var(--bg)',border:'1px solid var(--border)',color:'var(--text)'}}/>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="البريد الإلكتروني" dir="ltr"
                className="w-full text-sm px-3 py-2 rounded-xl outline-none"
                style={{background:'var(--bg)',border:'1px solid var(--border)',color:'var(--text)'}}/>
              <input value={qrValue} onChange={e=>setQrValue(e.target.value)} placeholder="رابط QR (موقعك أو إيميلك)" dir="ltr"
                className="w-full text-sm px-3 py-2 rounded-xl outline-none"
                style={{background:'var(--bg)',border:'1px solid var(--border)',color:'var(--text)'}}/>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'var(--text-muted)'}}>الشعار (اختياري)</p>
            <label className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer" style={{background:'var(--bg)',border:'1.5px dashed var(--border)'}}>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden"/>
              {logoUrl?(<><img src={logoUrl} alt="logo" className="w-8 h-8 rounded-lg object-contain"/><span className="text-xs font-medium" style={{color:'#4B9EFF'}}>تغيير</span></>):(<><div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{background:`${colors.primary}18`}}>🖼️</div><span className="text-xs" style={{color:'var(--text-muted)'}}>ارفع شعارك (PNG, JPG — 2MB)</span></>)}
            </label>
            {logoUrl&&<button onClick={()=>setLogoUrl(null)} className="text-xs mt-1 px-2" style={{color:'#EF4444'}}>حذف</button>}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'var(--text-muted)'}}>التصميم</p>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map(th=>(
                <button key={th.id} onClick={()=>setTheme(th.id)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                  style={{background:theme===th.id?'#4B9EFF18':'var(--bg)',border:`1.5px solid ${theme===th.id?'#4B9EFF':'var(--border)'}`,color:theme===th.id?'#4B9EFF':'var(--text)'}}>
                  <div className="w-5 h-5 rounded-md flex-shrink-0" style={{background:th.preview,border:'1px solid rgba(0,0,0,0.1)'}}/>{th.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'var(--text-muted)'}}>الألوان</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((c,i)=>(
                <button key={i} onClick={()=>setColors(c)} className="w-8 h-8 rounded-xl transition-transform hover:scale-110"
                  style={{background:`linear-gradient(135deg,${c.primary},${c.secondary})`,outline:colors.primary===c.primary?`2.5px solid ${c.primary}`:'2.5px solid transparent',outlineOffset:'2px'}}/>
              ))}
              <div className="relative">
                <input type="color" value={colors.primary} onChange={e=>setColors({...colors,primary:e.target.value})} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"/>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'var(--bg)',border:'1.5px dashed var(--border)'}}>+</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <button onClick={handlePDF} disabled={loading} className="btn-primary w-full text-sm disabled:opacity-50 flex items-center justify-center gap-2">{loading?'⏳':'📄'} {downloadPdfLabel}</button>
            <button onClick={handlePNG} disabled={loading} className="btn-secondary w-full text-sm disabled:opacity-50 flex items-center justify-center gap-2">{loading?'⏳':'🖼'} {downloadPngLabel}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
