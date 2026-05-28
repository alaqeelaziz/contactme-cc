'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type AdminTab = 'stats' | 'users' | 'settings'

interface UserRow {
  id: string
  username: string
  full_name: string | null
  email: string | null
  created_at: string
  account_type: string | null
}

interface Stats {
  totalUsers: number
  activeToday: number
  topCountries: { country: string; count: number }[]
}

const DEFAULT_FEATURES = [
  { id: 'scanner',   label: 'ماسح البطاقات',  enabled: true },
  { id: 'card',      label: 'بطاقة الأعمال',   enabled: true },
  { id: 'qr',        label: 'رمز QR',           enabled: true },
  { id: 'analytics', label: 'الإحصائيات',       enabled: true },
  { id: 'services',  label: 'الخدمات (شركات)', enabled: true },
]

export default function AdminPanel() {
  const [tab,      setTab]      = useState<AdminTab>('stats')
  const [stats,    setStats]    = useState<Stats | null>(null)
  const [users,    setUsers]    = useState<UserRow[]>([])
  const [features, setFeatures] = useState(DEFAULT_FEATURES)
  const [search,   setSearch]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [msg,      setMsg]      = useState('')

  useEffect(() => { loadStats(); loadUsers() }, [])

  async function loadStats() {
    setLoading(true)
    try {
      const { count: totalUsers } = await supabase
        .from('profiles').select('*', { count: 'exact', head: true })

      const yesterday = new Date(Date.now() - 86400000).toISOString()
      const { count: activeToday } = await supabase
        .from('profiles').select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday)

      let topCountries: { country: string; count: number }[] = []
      const { data: viewData } = await supabase
        .from('profile_views')
        .select('country')
        .not('country', 'is', null)
        .limit(500)

      if (viewData && viewData.length > 0) {
        const counts: Record<string, number> = {}
        for (const row of viewData) {
          const c = row.country || 'غير محدد'
          counts[c] = (counts[c] || 0) + 1
        }
        topCountries = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([country, count]) => ({ country, count }))
      }

      setStats({ totalUsers: totalUsers ?? 0, activeToday: activeToday ?? 0, topCountries })
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function loadUsers() {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, full_name, email, created_at, account_type')
      .order('created_at', { ascending: false })
      .limit(100)
    if (data) setUsers(data)
  }

  async function deleteUser(id: string, username: string) {
    if (!confirm(`حذف المستخدم @${username}؟`)) return
    setDeleting(id)
    await supabase.from('profiles').delete().eq('id', id)
    setUsers(prev => prev.filter(u => u.id !== id))
    setMsg(`تم حذف @${username}`)
    setTimeout(() => setMsg(''), 3000)
    setDeleting(null)
  }

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const Stat = ({ icon, label, value, color }: {
    icon: string; label: string; value: string | number; color: string
  }) => (
    <div className="card flex items-center gap-4 p-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: `${color}15` }}>{icon}</div>
      <div>
        <p className="text-2xl font-extrabold">{value}</p>
        <p className="text-xs text-[var(--text-muted)]">{label}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">🛡️ لوحة الإدارة</h2>
        <button onClick={() => { loadStats(); loadUsers() }}
          className="text-xs text-[#6366F1] hover:underline">تحديث</button>
      </div>

      {msg && (
        <div className="p-3 rounded-xl text-sm text-green-700 bg-green-50 border border-green-200">{msg}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface)' }}>
        {([
          { id: 'stats',    label: '📊 إحصائيات' },
          { id: 'users',    label: '👥 المستخدمون' },
          { id: 'settings', label: '🔧 الإعدادات' },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'text-white shadow-sm' : 'text-[var(--text-muted)]'
            }`}
            style={tab === t.id ? { background: 'linear-gradient(135deg,#6366F1,#A855F7)' } : {}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      {tab === 'stats' && (
        <div className="space-y-4">
          {loading && <p className="text-sm text-[var(--text-muted)] text-center">جاري التحميل...</p>}
          {stats && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Stat icon="👤" label="إجمالي المستخدمين" value={stats.totalUsers} color="#6366F1" />
                <Stat icon="🆕" label="مسجلون اليوم"      value={stats.activeToday} color="#10B981" />
              </div>
              <div className="card p-4 space-y-3">
                <p className="font-semibold text-sm">🌍 الدول الأكثر استخداماً</p>
                {stats.topCountries.length > 0 ? stats.topCountries.map(({ country, count }) => {
                  const max = stats.topCountries[0]?.count || 1
                  return (
                    <div key={country}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{country}</span>
                        <span className="text-[var(--text-muted)]">{count} زيارة</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${(count / max) * 100}%`, background: 'linear-gradient(90deg,#6366F1,#A855F7)' }} />
                      </div>
                    </div>
                  )
                }) : (
                  <p className="text-xs text-[var(--text-muted)]">لا توجد بيانات دول متاحة</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input type="text" placeholder="بحث بالاسم أو البريد..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="input flex-1 text-sm" />
            <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">{filtered.length} مستخدم</span>
          </div>
          <div className="space-y-2">
            {filtered.map(u => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)]">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {u.full_name || u.username}
                    {u.account_type === 'company' && (
                      <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">شركة</span>
                    )}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] truncate">@{u.username} · {u.email}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    {new Date(u.created_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <button onClick={() => deleteUser(u.id, u.username)}
                  disabled={deleting === u.id}
                  className="flex-shrink-0 mr-2 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-40">
                  {deleting === u.id ? '...' : 'حذف'}
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-[var(--text-muted)] py-8">لا توجد نتائج</p>
            )}
          </div>
        </div>
      )}

      {/* Settings */}
      {tab === 'settings' && (
        <div className="space-y-3">
          <p className="text-xs text-[var(--text-muted)]">تحكم بالخصائص المتاحة لجميع المستخدمين</p>
          {features.map((f, idx) => (
            <div key={f.id} className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)]">
              <span className="text-sm font-medium">{f.label}</span>
              <button
                onClick={() => {
                  setFeatures(prev => prev.map((p, i) => i === idx ? { ...p, enabled: !p.enabled } : p))
                  setMsg(`تم ${features[idx].enabled ? 'تعطيل' : 'تفعيل'} ${f.label}`)
                  setTimeout(() => setMsg(''), 2000)
                }}
                className={`relative w-12 h-6 rounded-full transition-colors ${f.enabled ? 'bg-[#6366F1]' : 'bg-[var(--border)]'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${f.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
          <p className="text-[10px] text-[var(--text-muted)] mt-2">
            ملاحظة: هذه الإعدادات تجميلية حالياً — لتطبيقها تحتاج جدول feature_flags في Supabase
          </p>
        </div>
      )}
    </div>
  )
}
