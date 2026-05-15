'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  id: string
  user_id: string
  full_name: string
  username: string
  email?: string
  plan: string
  is_pro: boolean
  account_type: string
  created_at: string
}

interface QRText {
  id: string
  content: string
  owner_id: string | null
  created_at: string
  expires_at: string | null
  views: number
}

interface Props {
  profiles: Profile[]
  totalUsers: number
  proUsers: number
  qrTexts: QRText[]
  totalViews: number
}

type Tab = 'stats' | 'users' | 'qr'

export default function AdminClient({ profiles, totalUsers, proUsers, qrTexts, totalViews }: Props) {
  const [tab, setTab] = useState<Tab>('stats')
  const [userList, setUserList] = useState(profiles)
  const [qrList, setQrList] = useState(qrTexts)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  async function changePlan(userId: string, plan: string) {
    const isPro = plan !== 'free'
    await supabase.from('profiles').update({ plan, is_pro: isPro }).eq('user_id', userId)
    setUserList(prev => prev.map(p => p.user_id === userId ? { ...p, plan, is_pro: isPro } : p))
  }

  async function deleteQR(id: string) {
    if (!confirm('تأكيد حذف هذا النص؟')) return
    await supabase.from('qr_texts').delete().eq('id', id)
    setQrList(prev => prev.filter(q => q.id !== id))
  }

  const filtered = userList.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.username?.toLowerCase().includes(search.toLowerCase())
  )

  const tabs = [
    { id: 'stats' as Tab, label: '📊 الإحصائيات' },
    { id: 'users' as Tab, label: '👥 المستخدمون' },
    { id: 'qr' as Tab, label: '📄 رسائل QR' },
  ]

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--bg)' }} dir="rtl">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">🛡️ لوحة الأدمن</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">contactme.cc</p>
          </div>
          <a href="/" className="btn-secondary text-sm px-4 py-2">← الموقع</a>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: 'var(--surface)' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'text-white' : 'text-[var(--text-muted)]'}`}
              style={tab === t.id ? { background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' } : {}}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        {tab === 'stats' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'إجمالي المستخدمين', value: totalUsers, icon: '👥' },
              { label: 'مشتركو Pro', value: proUsers, icon: '⭐' },
              { label: 'رسائل QR', value: qrTexts.length, icon: '📄' },
              { label: 'إجمالي المشاهدات', value: totalViews, icon: '👁️' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-6 text-center"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-3xl font-extrabold gradient-text">{s.value.toLocaleString('ar-SA')}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div>
            <input
              type="text"
              placeholder="ابحث باسم أو يوزرنيم..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input mb-4 w-full max-w-sm"
            />
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm">
                <thead style={{ background: 'var(--surface)' }}>
                  <tr>
                    <th className="text-right p-4 font-semibold">المستخدم</th>
                    <th className="text-right p-4 font-semibold">يوزرنيم</th>
                    <th className="text-right p-4 font-semibold">الخطة</th>
                    <th className="text-right p-4 font-semibold">تاريخ التسجيل</th>
                    <th className="text-right p-4 font-semibold">تعديل</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr key={p.id} style={{ background: i % 2 === 0 ? 'var(--bg)' : 'var(--surface)' }}>
                      <td className="p-4 font-medium">{p.full_name || '—'}</td>
                      <td className="p-4 text-[var(--text-muted)]">@{p.username}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.is_pro ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                          {p.plan}
                        </span>
                      </td>
                      <td className="p-4 text-[var(--text-muted)]">
                        {new Date(p.created_at).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="p-4">
                        <select
                          value={p.plan}
                          onChange={e => changePlan(p.user_id, e.target.value)}
                          className="text-xs border rounded-lg px-2 py-1"
                          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
                        >
                          <option value="free">مجاني</option>
                          <option value="pro_individual">برو فردي</option>
                          <option value="pro_company">برو شركة</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className="text-center py-8 text-[var(--text-muted)]">ما فيه نتائج</p>
              )}
            </div>
          </div>
        )}

        {/* QR Texts */}
        {tab === 'qr' && (
          <div className="space-y-3">
            {qrList.map(q => (
              <div key={q.id} className="rounded-2xl p-4 flex items-start gap-4"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{q.content}</p>
                  <div className="flex gap-4 mt-1 text-xs text-[var(--text-muted)]">
                    <span>👁️ {q.views || 0} مشاهدة</span>
                    <span>{new Date(q.created_at).toLocaleDateString('ar-SA')}</span>
                    {q.expires_at && <span>ينتهي: {new Date(q.expires_at).toLocaleDateString('ar-SA')}</span>}
                    {!q.owner_id && <span className="text-orange-400">بدون مالك</span>}
                  </div>
                </div>
                <button onClick={() => deleteQR(q.id)}
                  className="text-xs px-3 py-1.5 rounded-lg text-red-500 border border-red-200 hover:bg-red-50 flex-shrink-0">
                  🗑️ حذف
                </button>
              </div>
            ))}
            {qrList.length === 0 && (
              <p className="text-center py-8 text-[var(--text-muted)]">ما فيه رسائل</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}