'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function DeleteQRButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('هل تبي تحذف هذه الرسالة؟')) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('qr_texts').delete().eq('id', id)
    router.push('/')
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs px-4 py-2 rounded-lg text-red-500 border border-red-200 hover:bg-red-50 transition"
    >
      {loading ? '...' : '🗑️ حذف الرسالة'}
    </button>
  )
}