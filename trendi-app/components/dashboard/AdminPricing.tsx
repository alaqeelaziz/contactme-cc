'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Prices {
  free: number
  individual: number
  company: number
}

interface DiscountCodes {
  [code: string]: number
}

export default function AdminPricing() {
  const supabase = createClient()
  const [prices, setPrices] = useState<Prices>({ free: 0, individual: 15, company: 49 })
  const [codes, setCodes] = useState<DiscountCodes>({ LAUNCH50: 50, WELCOME20: 20 })
  const [newCode, setNewCode] = useState('')
  const [newDiscount, setNewDiscount] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['prices', 'discount_codes'])

      if (data) {
        data.forEach(row => {
          if (row.key === 'prices') setPrices(row.value)
          if (row.key === 'discount_codes') setCodes(row.value)
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    await supabase.from('settings').upsert([
      { key: 'prices', value: prices, updated_at: new Date().toISOString() },
      { key: 'discount_codes', value: codes, updated_at: new Date().toISOString() },
    ])
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function addCode() {
    const c = newCode.trim().toUpperCase()
    const d = parseInt(newDiscount)
    if (!c || isNaN(d) || d < 1 || d > 100) return
    setCodes(prev => ({ ...prev, [c]: d }))
    setNewCode('')
    setNewDiscount('')
  }

  function removeCode(code: string) {
    setCodes(prev => {
      const next = { ...prev }
      delete next[code]
      return next
    })
  }

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8">

      {/* الأسعار */}
      <div>
        <h3 className="text-base font-bold mb-4">💰 الأسعار (ريال / شهر)</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: 'free',       label: 'مجاني' },
            { key: 'individual', label: 'برو فردي' },
            { key: 'company',    label: 'برو شركة' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs text-[var(--text-muted)] mb-1">{label}</label>
              <input
                type="number"
                min={0}
                value={(prices as any)[key]}
                onChange={e => setPrices(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                className="input w-full text-center font-bold text-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* أكواد الخصم */}
      <div>
        <h3 className="text-base font-bold mb-4">🏷️ أكواد الخصم</h3>

        {/* الأكواد الموجودة */}
        <div className="space-y-2 mb-4">
          {Object.entries(codes).length === 0 && (
            <p className="text-sm text-[var(--text-muted)]">لا توجد أكواد</p>
          )}
          {Object.entries(codes).map(([code, discount]) => (
            <div key={code} className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-[#6366F1]">{code}</span>
                <span className="text-sm text-[var(--text-muted)]">خصم {discount}%</span>
              </div>
              <button
                onClick={() => removeCode(code)}
                className="text-red-400 hover:text-red-500 text-xs font-medium"
              >
                حذف
              </button>
            </div>
          ))}
        </div>

        {/* إضافة كود جديد */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="كود الخصم"
            value={newCode}
            onChange={e => setNewCode(e.target.value.toUpperCase())}
            className="input flex-1 font-mono uppercase"
          />
          <input
            type="number"
            placeholder="النسبة %"
            min={1}
            max={100}
            value={newDiscount}
            onChange={e => setNewDiscount(e.target.value)}
            className="input w-24 text-center"
          />
          <button
            onClick={addCode}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #6366F1, #A855F7)' }}
          >
            إضافة
          </button>
        </div>
      </div>

      {/* حفظ */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
        style={{ background: saved ? '#10B981' : 'linear-gradient(135deg, #6366F1, #A855F7)' }}
      >
        {saving ? 'جاري الحفظ...' : saved ? '✓ تم الحفظ — التغييرات ستظهر فوراً' : 'حفظ التغييرات'}
      </button>
    </div>
  )
}
