'use client'

interface Props {
  viewCount: number
  isPro: boolean
  createdAt: string
}

export default function AnalyticsCard({ viewCount, isPro, createdAt }: Props) {
  const daysActive = Math.max(1, Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  ))
  const avgPerDay = (viewCount / daysActive).toFixed(1)

  if (!isPro) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">📊</div>
        <div className="text-3xl font-extrabold gradient-text mb-1">{viewCount}</div>
        <p className="text-sm text-[var(--text-muted)] mb-4">مشاهدة إجمالية</p>
        <div className="p-3 rounded-xl text-xs text-[var(--text-muted)]"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          ترقَّ إلى برو للحصول على إحصائيات تفصيلية
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StatBox label="إجمالي المشاهدات" value={viewCount.toString()} icon="👁️" />
        <StatBox label="متوسط يومي" value={avgPerDay} icon="📈" />
        <StatBox label="أيام النشاط" value={daysActive.toString()} icon="📅" />
        <StatBox label="الحالة" value="نشط" icon="✅" highlight />
      </div>

      <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <p className="text-xs text-[var(--text-muted)]">
          إحصائيات أكثر تفصيلاً (مرات النقر، المصادر، الأجهزة) قادمة قريباً
        </p>
      </div>
    </div>
  )
}

function StatBox({ label, value, icon, highlight }: {
  label: string; value: string; icon: string; highlight?: boolean
}) {
  return (
    <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-2xl font-extrabold mb-1 ${highlight ? 'text-green-500' : 'gradient-text'}`}>
        {value}
      </div>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  )
}
