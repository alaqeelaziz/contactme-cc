'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { Service } from '@/lib/types'

interface Props {
  userId: string
  initialServices: Service[]
}

interface ServiceForm {
  title: string
  description: string
}

const emptyForm: ServiceForm = { title: '', description: '' }

export default function ServicesManager({ userId, initialServices }: Props) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [form, setForm] = useState<ServiceForm>(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  async function handleSave() {
    if (!form.title.trim()) { toast.error('اسم الخدمة مطلوب'); return }
    setSaving(true)
    try {
      if (editId) {
        const { data, error } = await supabase
          .from('services')
          .update({ title: form.title, description: form.description || null })
          .eq('id', editId)
          .select()
          .single()
        if (error) throw error
        setServices(services.map((s) => (s.id === editId ? data : s)))
        toast.success('تم تحديث الخدمة')
      } else {
        const { data, error } = await supabase
          .from('services')
          .insert({ user_id: userId, title: form.title, description: form.description || null, is_active: true })
          .select()
          .single()
        if (error) throw error
        setServices([...services, data])
        toast.success('تمت إضافة الخدمة')
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
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return
    await supabase.from('services').delete().eq('id', id)
    setServices(services.filter((s) => s.id !== id))
    toast.success('تم حذف الخدمة')
  }

  async function toggleActive(service: Service) {
    const { data } = await supabase
      .from('services')
      .update({ is_active: !service.is_active })
      .eq('id', service.id)
      .select()
      .single()
    if (data) setServices(services.map((s) => (s.id === service.id ? data : s)))
  }

  function startEdit(service: Service) {
    setForm({ title: service.title, description: service.description || '' })
    setEditId(service.id)
    setAdding(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">{services.length} خدمة</p>
        {!adding && (
          <button onClick={() => setAdding(true)} className="btn-primary text-sm py-2 px-4 gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            إضافة خدمة
          </button>
        )}
      </div>

      {adding && (
        <div className="p-4 rounded-xl border-2 space-y-3"
          style={{ borderColor: '#4B9EFF40', background: 'var(--surface)' }}>
          <p className="font-semibold text-sm">{editId ? 'تعديل الخدمة' : 'خدمة جديدة'}</p>
          <div>
            <label className="block text-xs font-medium mb-1">اسم الخدمة</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="مثال: تصميم الهوية البصرية" className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">وصف الخدمة (اختياري)</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="وصف مختصر للخدمة..." className="input-field text-sm resize-none" rows={2} />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 flex-1 disabled:opacity-60">
              {saving ? 'جاري الحفظ...' : editId ? 'تحديث' : 'إضافة'}
            </button>
            <button onClick={() => { setAdding(false); setEditId(null); setForm(emptyForm) }}
              className="btn-secondary text-sm py-2 flex-1">
              إلغاء
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {services.length === 0 && (
          <p className="text-center text-[var(--text-muted)] text-sm py-8">
            لا توجد خدمات بعد. أضف خدمتك الأولى!
          </p>
        )}
        {services.map((service) => (
          <div key={service.id}
            className={`flex items-center gap-3 p-3 rounded-xl border ${!service.is_active ? 'opacity-50' : ''}`}
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' }}>
              ✦
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{service.title}</p>
              {service.description && (
                <p className="text-xs text-[var(--text-muted)] truncate">{service.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => toggleActive(service)}
                className={`p-1 rounded-lg ${service.is_active ? 'text-green-500' : 'text-[var(--text-muted)]'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d={service.is_active
                      ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} />
                </svg>
              </button>
              <button onClick={() => startEdit(service)} className="p-1 rounded-lg hover:bg-[var(--bg)] text-[#4B9EFF]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button onClick={() => handleDelete(service.id)} className="p-1 rounded-lg hover:bg-[var(--bg)] text-red-500">
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
