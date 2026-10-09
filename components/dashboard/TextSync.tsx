'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

interface SyncText {
  id: string
  title: string | null
  body: string
  created_at: string
  expires_at: string | null
}

export default function TextSync({ userId }: { userId: string }) {
  const t = useTranslations('textSync')
  const locale = useLocale()
  const supabase = useMemo(() => createClient(), [])
  const [items, setItems] = useState<SyncText[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [retention, setRetention] = useState('24')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [now, setNow] = useState(Date.now())
  const generation = useRef(0)
  const lock = useRef(false)

  const refresh = useCallback(async () => {
    const request = ++generation.current
    const { data, error } = await supabase.from('synced_texts')
      .select('id,title,body,created_at,expires_at')
      .eq('user_id', userId).order('created_at', { ascending: false }).limit(500)
    if (request !== generation.current) return
    setError(Boolean(error))
    if (!error) { setItems(data || []); setUpdatedAt(new Date()) }
    setLoading(false)
  }, [supabase, userId])

  useEffect(() => {
    void refresh()
    const channel = supabase.channel(`texts:${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'synced_texts' }, () => { void refresh() })
      .subscribe()
    // Polling also recovers missed events and expiration while a tab stays open.
    const timer = window.setInterval(() => { setNow(Date.now()); void refresh() }, 5000)
    const focus = () => { void refresh() }
    window.addEventListener('focus', focus)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session || session.user.id !== userId) { ++generation.current; setItems([]); setError(true) }
      else void refresh()
    })
    return () => {
      ++generation.current
      window.clearInterval(timer)
      window.removeEventListener('focus', focus)
      subscription.unsubscribe()
      void supabase.removeChannel(channel)
    }
  }, [supabase, userId, refresh])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim() || lock.current) return
    lock.current = true; setBusy(true)
    try {
      const { error } = await supabase.rpc('save_synced_text', {
        p_title: title.trim() || null, p_body: body,
        p_retention_hours: retention === 'forever' ? null : Number(retention),
      })
      if (error) throw error
      setTitle(''); setBody('')
      toast.success(t('saved')); await refresh()
    } catch { toast.error(t('failed')) }
    finally { lock.current = false; setBusy(false) }
  }

  async function remove(id?: string) {
    if (lock.current || !window.confirm(t(id ? 'confirmDelete' : 'confirmClear'))) return
    lock.current = true; setBusy(true)
    try {
      let query = supabase.from('synced_texts').delete().eq('user_id', userId)
      if (id) query = query.eq('id', id)
      const { error } = await query
      if (error) throw error
      toast.success(t('deleted')); await refresh()
    } catch { toast.error(t('failed')) }
    finally { lock.current = false; setBusy(false) }
  }

  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); toast.success(t('copied')) }
    catch { toast.error(t('copyFailed')) }
  }

  const visible = items.filter(item => !item.expires_at || Date.parse(item.expires_at) > now)
  const date = (value: string) => new Date(value).toLocaleString(locale)
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold">{t('title')}</h2>
        <p className="text-sm text-[var(--text-muted)] mt-2">{t('description')}</p>
      </div>
      <form onSubmit={save} className="space-y-3">
        <label className="block text-sm">{t('name')}
          <input className="input-field w-full mt-1" value={title} maxLength={120}
            onChange={e => setTitle(e.target.value)} />
        </label>
        <label className="block text-sm">{t('body')}
          <textarea className="input-field w-full mt-1" rows={6} value={body} required maxLength={20000}
            dir="auto" onChange={e => setBody(e.target.value)} />
        </label>
        <label className="block text-sm">{t('retention')}
          <select className="input-field w-full mt-1" value={retention} onChange={e => setRetention(e.target.value)}>
            <option value="1">{t('hour')}</option><option value="24">{t('day')}</option>
            <option value="168">{t('week')}</option><option value="forever">{t('forever')}</option>
          </select>
        </label>
        <button className="btn-primary disabled:opacity-50" disabled={busy || !body.trim()} type="submit">
          {busy ? t('working') : t('save')}
        </button>
      </form>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p role="status" className="text-[var(--text-muted)]">
          {loading ? t('loading') : error ? t('connectionError') : updatedAt ? t('updated', { time: updatedAt.toLocaleTimeString(locale) }) : ''}
        </p>
        <div className="flex gap-3">
          <button onClick={() => { void refresh() }}>{t('refresh')}</button>
          <button disabled={busy || !visible.length} onClick={() => { void remove() }} className="text-red-500 disabled:opacity-50">{t('clear')}</button>
        </div>
      </div>
      {!loading && !error && !visible.length && <p className="text-sm text-[var(--text-muted)]">{t('empty')}</p>}
      <div className="space-y-3">
        {visible.map(item => (
          <article key={item.id} className="rounded-xl p-4 space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold break-words" dir="auto">{item.title || t('untitled')}</h3>
            <p className="whitespace-pre-wrap break-words max-h-72 overflow-y-auto text-sm" dir="auto">{item.body}</p>
            <p className="text-xs text-[var(--text-muted)]">{date(item.created_at)} · {item.expires_at ? t('expires', { time: date(item.expires_at) }) : t('forever')}</p>
            <div className="flex gap-4 text-sm">
              <button onClick={() => { void copy(item.body) }} className="text-[#6366F1]">{t('copy')}</button>
              <button disabled={busy} onClick={() => { void remove(item.id) }} className="text-red-500 disabled:opacity-50">{t('delete')}</button>
            </div>
          </article>
        ))}
      </div>
      <p className="text-xs text-[var(--text-muted)]">{t('limit')}</p>
    </div>
  )
}
