'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Profile } from '@/lib/types'

interface Props {
  profile: Profile
  onUpdate: (p: Profile) => void
}

export default function ProfileEditor({ profile, onUpdate }: Props) {
  const [data, setData] = useState({
    full_name: profile.full_name,
    bio: profile.bio || '',
    whatsapp: profile.whatsapp || '',
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!data.full_name.trim()) { toast.error('الاسم مطلوب'); return }
    setSaving(true)
    try {
      const { data: updated, error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          bio: data.bio || null,
          whatsapp: data.whatsapp || null,
        })
        .eq('id', profile.id)
        .select()
        .single()

      if (error) throw error
      onUpdate(updated)
      toast.success('تم حفظ التغييرات')
    } catch {
      toast.error('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('حجم الصورة يجب أن يكون أقل من 2MB'); return }
    if (!file.type.startsWith('image/')) { toast.error('يرجى اختيار صورة صالحة'); return }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `avatars/${profile.user_id}-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('public').getPublicUrl(path)

      const { data: updated, error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id)
        .select()
        .single()

      if (updateError) throw updateError
      onUpdate(updated)
      toast.success('تم تحديث الصورة')
    } catch {
      toast.error('فشل رفع الصورة')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name}
              width={72}
              height={72}
              className="w-18 h-18 rounded-full object-cover"
              style={{ width: 72, height: 72 }}
            />
          ) : (
            <div className="w-18 h-18 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' }}>
              {getInitials(profile.full_name)}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-[#4B9EFF] text-white flex items-center justify-center shadow-md hover:bg-[#3B8EEF] transition-colors disabled:opacity-60"
          >
            {uploading ? (
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        <div>
          <p className="font-semibold text-sm">{profile.full_name}</p>
          <p className="text-xs text-[var(--text-muted)]">contactme.cc/{profile.username}</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">PNG أو JPG — حد أقصى 2MB</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          {profile.account_type === 'personal' ? 'الاسم الكامل' : 'اسم الشركة'}
        </label>
        <input
          type="text"
          value={data.full_name}
          onChange={(e) => setData({ ...data, full_name: e.target.value })}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          {profile.account_type === 'personal' ? 'نبذة شخصية' : 'وصف الشركة'}
        </label>
        <textarea
          value={data.bio}
          onChange={(e) => setData({ ...data, bio: e.target.value })}
          className="input-field resize-none"
          rows={3}
          placeholder={profile.account_type === 'personal'
            ? 'اكتب نبذة مختصرة عن نفسك...'
            : 'اكتب وصفاً مختصراً عن شركتك وخدماتها...'}
          maxLength={200}
        />
        <p className="text-xs text-[var(--text-muted)] mt-1 text-left">{data.bio.length}/200</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">رقم واتساب</label>
        <input
          type="tel"
          value={data.whatsapp}
          onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
          className="input-field"
          placeholder="966XXXXXXXXX"
          dir="ltr"
        />
        <p className="text-xs text-[var(--text-muted)] mt-1">مثال: 966512345678</p>
      </div>

      <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            جاري الحفظ...
          </span>
        ) : 'حفظ التغييرات'}
      </button>
    </form>
  )
}
