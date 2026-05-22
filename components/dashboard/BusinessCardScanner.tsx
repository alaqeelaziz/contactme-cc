'use client'

import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import type { ScannedCard } from '@/lib/types'

interface Props {
  isPro: boolean
}

interface SavedContact extends ScannedCard {
  id: string
  created_at: string
}

export default function BusinessCardScanner({ isPro }: Props) {
  const supabase = createClient()
  const [image, setImage] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<ScannedCard | null>(null)
  const [contacts, setContacts] = useState<SavedContact[]>([])
  const [showContacts, setShowContacts] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadContacts() }, [])

  async function loadContacts() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (data) setContacts(data)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('يرجى اختيار صورة'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('حجم الصورة يجب أن يكون أقل من 5MB'); return }
    const reader = new FileReader()
    reader.onload = (ev) => setImage(ev.target?.result as string)
    reader.readAsDataURL(file)
    setResult(null)
  }

  async function handleScan() {
    if (!image) return
    setScanning(true)
    try {
      const res = await fetch('/api/scan-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      })
      if (!res.ok) throw new Error('فشل الطلب')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
      toast.success('تم استخراج البيانات بنجاح')
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ أثناء المسح')
    } finally {
      setScanning(false)
    }
  }

  async function handleSave() {
    if (!result) return
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('غير مصرح')
      const { error } = await supabase.from('contacts').insert({
        user_id: user.id,
        name: result.name || null,
        title: result.title || null,
        company: result.company || null,
        phone: result.phone || null,
        email: result.email || null,
        website: result.website || null,
      })
      if (error) throw error
      toast.success('تم حفظ جهة الاتصال ✓')
      loadContacts()
      setResult(null)
      reset()
    } catch (err: any) {
      toast.error(err.message || 'فشل الحفظ')
    } finally {
      setSaving(false)
    }
  }

  function copyField(value: string, label: string) {
    navigator.clipboard.writeText(value)
    toast.success(`تم نسخ ${label}`)
  }

  function reset() {
    setImage(null)
    setResult(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function exportCSV() {
    if (!contacts.length) return
    const headers = ['الاسم', 'المسمى الوظيفي', 'الشركة', 'الهاتف', 'الإيميل', 'الموقع', 'التاريخ']
    const rows = contacts.map(c => [
      c.name || '', c.title || '', c.company || '',
      c.phone || '', c.email || '', c.website || '',
      new Date(c.created_at).toLocaleDateString('ar-SA')
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contacts.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('تم تصدير القائمة')
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-[var(--text-muted)]">
        ارفع صورة بطاقة أعمال وسيقوم الذكاء الاصطناعي باستخراج بياناتها تلقائياً
      </p>

      {/* Upload */}
      {!image ? (
        <div onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors hover:border-[#6366F1]"
          style={{ borderColor: 'var(--border)' }}>
          <div className="text-5xl mb-3">📇</div>
          <p className="font-medium mb-1">اضغط لرفع صورة البطاقة</p>
          <p className="text-xs text-[var(--text-muted)]">PNG, JPG — حد أقصى 5MB</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
            <img src={image} alt="بطاقة الأعمال" className="w-full object-contain max-h-48" />
            <button onClick={reset}
              className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
              ✕
            </button>
          </div>
          <button onClick={handleScan} disabled={scanning} className="btn-primary w-full disabled:opacity-60">
            {scanning ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                جاري التحليل...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                مسح وتحليل البطاقة
              </span>
            )}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-3">
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#6366F140' }}>
            <div className="px-4 py-3 flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #6366F115, #A855F715)' }}>
              <span>✨</span>
              <p className="font-semibold text-sm">البيانات المستخرجة</p>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {[
                { key: 'name',    label: 'الاسم',          icon: '👤' },
                { key: 'title',   label: 'المسمى الوظيفي', icon: '💼' },
                { key: 'company', label: 'الشركة',          icon: '🏢' },
                { key: 'phone',   label: 'الهاتف',          icon: '📞' },
                { key: 'email',   label: 'البريد',          icon: '✉️' },
                { key: 'website', label: 'الموقع',          icon: '🌐' },
              ].map(({ key, label, icon }) => {
                const val = result[key as keyof ScannedCard]
                if (!val) return null
                return (
                  <div key={key} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span>{icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs text-[var(--text-muted)]">{label}</p>
                        <p className="font-medium text-sm truncate">{val}</p>
                      </div>
                    </div>
                    <button onClick={() => copyField(val, label)}
                      className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[#6366F1] transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6366F1, #A855F7)' }}
          >
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                جاري الحفظ...
              </>
            ) : (
              <>💾 حفظ جهة الاتصال</>
            )}
          </button>
        </div>
      )}

      {/* Contacts List + Export */}
      {contacts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setShowContacts(v => !v)}
              className="text-sm font-semibold flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text)]">
              <span>{showContacts ? '▲' : '▼'}</span>
              الكروت المحفوظة ({contacts.length})
            </button>
            <button onClick={exportCSV}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #6366F1, #A855F7)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              تصدير CSV
            </button>
          </div>

          {showContacts && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {contacts.map(c => (
                <div key={c.id} className="p-3 rounded-xl flex items-center justify-between gap-3"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{c.name || '—'}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{c.company || c.title || c.phone || ''}</p>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] flex-shrink-0">
                    {new Date(c.created_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
