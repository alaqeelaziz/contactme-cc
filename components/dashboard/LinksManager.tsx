'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { Link } from '@/lib/types'

interface Props {
  userId: string
  isPro: boolean
  initialLinks: Link[]
}

const LINK_PRESETS = [
  { label: 'واتساب', placeholder: 'https://wa.me/966...' },
  { label: 'انستقرام', placeholder: 'https://instagram.com/...' },
  { label: 'تويتر / X', placeholder: 'https://x.com/...' },
  { label: 'لينكدإن', placeholder: 'https://linkedin.com/in/...' },
  { label: 'يوتيوب', placeholder: 'https://youtube.com/...' },
  { label: 'موقعي', placeholder: 'https://mywebsite.com' },
]

interface LinkForm {
  title: string
  url: string
  icon: string
}

const emptyForm: LinkForm = { title: '', url: '', icon: '' }

export default function LinksManager({ userId, isPro, initialLinks }: Props) {
  const [links, setLinks] = useState<Link[]>(initialLinks)
  const [form, setForm] = useState<LinkForm>(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const maxLinks = isPro ? Infinity : 3

  async function handleSave() {
    if (!form.title.trim() || !form.url.trim()) {
      toast.error('يرجى ملء الاسم والرابط')
      return
    }
    if (!form.url.startsWith('http')) {
      toast.error('يجب أن يبدأ الرابط بـ https://')
      return
    }
    setSaving(true)
    try {
      if (editId) {
        const { data, error } = await supabase
          .from('links')
          .update({ title: form.title, url: form.url, icon: form.icon || null })
          .eq('id', editId)
          .select()
          .single()
        if (error) throw error
        setLinks(links.map((l) => (l.id === editId ? data : l)))
        toast.success('تم تحديث الرابط')
      } else {
        if (links.length >= maxLinks) {
          toast.error(`الخطة المجانية تسمح بـ ${maxLinks} روابط فقط. ترقَّ إلى برو للحصول على روابط غير محدودة`)
          return
        }
        const { data, error } = await supabase
          .from('links')
          .insert({
            user_id: userId,
            title: form.title,
            url: form.url,
            icon: form.icon || null,
            display_order: links.length,
            is_active: true,
          })
          .select()
          .single()
        if (error) throw error
        setLinks([...links, data])
        toast.success('تمت إضافة الرابط')
      }
      setForm(emptyForm)
      setEditId(null)
      setAdding(false)
    } catch {
      toast.error('حدث خطأ، يرجى المحاولة')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا الرابط؟')) return
    try {
      await supabase.from('links').delete().eq('id', id)
      setLinks(links.filter((l) => l.id !== id))
      toast.success('تم حذف الرابط')
    } catch {
      toast.error('حدث خطأ أثناء الحذف')
    }
  }

  async function toggleActive(link: Link) {
    const { data, error } = await supabase
      .from('links')
      .update({ is_active: !link.is_active })
      .eq('id', link.id)
      .select()
      .single()
    if (!error && data) {
      setLinks(links.map((l) => (l.id === link.id ? data : l)))
    }
  }

  async function moveLink(index: number, dir: 'up' | 'down') {
    const newLinks = [...links]
    const swapIdx = dir === 'up' ? index - 1 : index + 1
    if (swapIdx < 0 || swapIdx >= newLinks.length) return
    ;[newLinks[index], newLinks[swapIdx]] = [newLinks[swapIdx], newLinks[index]]
    newLinks.forEach((l, i) => (l.display_order = i))
    setLinks(newLinks)
    await Promise.all(
      newLinks.map((l) => supabase.from('links').update({ display_order: l.display_order }).eq('id', l.id))
    )
  }

  function startEdit(link: Link) {
    setForm({ title: link.title, url: link.url, icon: link.icon || '' })
    setEditId(link.id)
    setAdding(true)
  }

  function cancelForm() {
    setForm(emptyForm)
    setEditId(null)
    setAdding(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">
          {links.length}{isPro ? '' : `/${maxLinks}`} روابط
        </p>
        {!adding && links.length < maxLinks && (
          <button onClick={() => setAdding(true)} className="btn-primary text-sm py-2 px-4 gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            إضافة رابط
          </button>
        )}
        {!isPro && links.length >= maxLinks && (
          <span className="text-xs text-[#8B5CF6] font-medium">
            ترقَّ إلى برو لإضافة المزيد
          </span>
        )}
      </div>

      {/* Add/Edit Form */}
      {adding && (
        <div className="p-4 rounded-xl border-2 space-y-3" style={{ borderColor: '#4B9EFF40', background: 'var(--surface)' }}>
          <p className="font-semibold text-sm">{editId ? 'تعديل الرابط' : 'رابط جديد'}</p>

          {!editId && (
            <div className="flex flex-wrap gap-2">
              {LINK_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setForm({ ...form, title: p.label, url: p.placeholder })}
                  className="px-3 py-1 rounded-lg text-xs border transition-colors hover:border-[#4B9EFF]"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1">اسم الرابط</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="مثال: انستقرام" className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">الرابط</label>
            <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://" className="input-field text-sm" dir="ltr" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">الأيقونة (إيموجي - اختياري)</label>
            <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="🔗" className="input-field text-sm w-24" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 flex-1 disabled:opacity-60">
              {saving ? 'جاري الحفظ...' : editId ? 'تحديث' : 'إضافة'}
            </button>
            <button onClick={cancelForm} className="btn-secondary text-sm py-2 flex-1">إلغاء</button>
          </div>
        </div>
      )}

      {/* Links list */}
      <div className="space-y-2">
        {links.length === 0 && (
          <p className="text-center text-[var(--text-muted)] text-sm py-8">
            لا توجد روابط بعد. أضف رابطك الأول!
          </p>
        )}
        {links.map((link, i) => (
          <div key={link.id}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${link.is_active ? '' : 'opacity-50'}`}
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <span className="text-lg w-7 text-center flex-shrink-0">{link.icon || '🔗'}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{link.title}</p>
              <p className="text-xs text-[var(--text-muted)] truncate" dir="ltr">{link.url}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => moveLink(i, 'up')} disabled={i === 0}
                className="p-1 rounded-lg hover:bg-[var(--bg)] text-[var(--text-muted)] disabled:opacity-20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button onClick={() => moveLink(i, 'down')} disabled={i === links.length - 1}
                className="p-1 rounded-lg hover:bg-[var(--bg)] text-[var(--text-muted)] disabled:opacity-20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button onClick={() => toggleActive(link)}
                className={`p-1 rounded-lg ${link.is_active ? 'text-green-500' : 'text-[var(--text-muted)]'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d={link.is_active
                      ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} />
                </svg>
              </button>
              <button onClick={() => startEdit(link)} className="p-1 rounded-lg hover:bg-[var(--bg)] text-[#4B9EFF]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button onClick={() => handleDelete(link.id)} className="p-1 rounded-lg hover:bg-[var(--bg)] text-red-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
