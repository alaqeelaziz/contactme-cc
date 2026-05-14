'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { usePathname } from 'next/navigation'

interface QRGeneratorProps {
  initialValue?: string
  size?: number
  showDownload?: boolean
}

const DEFAULT_VALUE = 'https://contactme.cc'

const i18n = {
  ar: { link: '🔗 رابط / إيميل', text: '📝 نص', placeholder_text: 'اكتب نصك هنا... (بيانات تواصل، عنوان، وصف)', download: '⬇️ تحميل PNG', save: '🔗 احفظ وشارك (30 يوم)', saving: 'جاري الحفظ...', copied: '✅ تم نسخ الرابط!' },
  en: { link: '🔗 Link / Email', text: '📝 Text', placeholder_text: 'Type your text here...', download: '⬇️ Download PNG', save: '🔗 Save & Share (30 days)', saving: 'Saving...', copied: '✅ Link copied!' },
  zh: { link: '🔗 链接 / 邮箱', text: '📝 文字', placeholder_text: '在此输入您的文字...', download: '⬇️ 下载 PNG', save: '🔗 保存并分享 (30天)', saving: '保存中...', copied: '✅ 链接已复制!' },
  fr: { link: '🔗 Lien / Email', text: '📝 Texte', placeholder_text: 'Tapez votre texte ici...', download: '⬇️ Télécharger PNG', save: '🔗 Sauvegarder & Partager (30 jours)', saving: 'Sauvegarde...', copied: '✅ Lien copié!' },
  es: { link: '🔗 Enlace / Email', text: '📝 Texto', placeholder_text: 'Escribe tu texto aquí...', download: '⬇️ Descargar PNG', save: '🔗 Guardar & Compartir (30 días)', saving: 'Guardando...', copied: '✅ ¡Enlace copiado!' },
}

type Locale = keyof typeof i18n

export default function QRGenerator({ initialValue = '', size = 220, showDownload = false }: QRGeneratorProps) {
  const pathname = usePathname()
  const locale = (['ar', 'en', 'zh', 'fr', 'es'].find(l => pathname?.startsWith(`/${l}`)) || 'ar') as Locale
  const t = i18n[locale]

  const [activeTab, setActiveTab] = useState<'link' | 'text'>('link')
  const [linkValue, setLinkValue] = useState(initialValue)
  const [textValue, setTextValue] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedUrl, setSavedUrl] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const previewValue = activeTab === 'link'
    ? (linkValue.trim() ? (linkValue.startsWith('http') ? linkValue : `https://${linkValue}`) : DEFAULT_VALUE)
    : (textValue.trim() || DEFAULT_VALUE)

  useEffect(() => {
    QRCode.toDataURL(previewValue, {
      color: { dark: '#6B7EFF', light: '#FFFFFF' },
      margin: 1, width: size,
    }).then(setQrDataUrl).catch(() => setQrDataUrl(''))
  }, [previewValue, size])

  function handleDownload() {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = 'contactme-qr.png'
    a.click()
  }

  async function handleSaveText() {
    if (!textValue.trim()) return
    setSaving(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: textValue })
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(`خطأ: ${data.error || res.status}`)
        return
      }
      if (data.url) {
        setSavedUrl(data.url)
        setLinkValue(data.url)
        setActiveTab('link')
        navigator.clipboard?.writeText(data.url)
      }
    } catch (err) {
      setErrorMsg(`خطأ في الاتصال: ${String(err)}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2 rounded-3xl border p-2" style={{ borderColor: 'var(--border)' }}>
        {(['link', 'text'] as const).map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setSavedUrl(''); setErrorMsg('') }}
            className={`flex-1 rounded-2xl px-4 py-3 text-sm font-medium transition ${activeTab === tab ? 'bg-[#EEF4FF] text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>
            {tab === 'link' ? t.link : t.text}
          </button>
        ))}
      </div>

      {activeTab === 'link' ? (
        <input type="text" value={linkValue} onChange={e => setLinkValue(e.target.value)}
          placeholder="https://contactme.cc/username" className="input-field w-full" dir="ltr" />
      ) : (
        <div className="space-y-3">
          <textarea value={textValue} maxLength={500} onChange={e => setTextValue(e.target.value)}
            placeholder={t.placeholder_text}
            className="input-field w-full min-h-[120px] resize-none" />
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span></span>
            <span>{500 - textValue.length} / 500</span>
          </div>
          <button onClick={handleSaveText} disabled={saving || !textValue.trim()}
            className="btn-primary w-full disabled:opacity-50">
            {saving ? t.saving : t.save}
          </button>
          {errorMsg && (
            <div className="rounded-xl p-3 text-sm text-center text-red-500"
              style={{ background: 'var(--surface)', border: '1px solid #ff444440' }}>
              {errorMsg}
            </div>
          )}
          {savedUrl && (
            <div className="rounded-xl p-3 text-sm text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <p className="text-green-500 font-medium mb-1">{t.copied}</p>
              <a href={savedUrl} target="_blank" className="text-[#6B7EFF] break-all text-xs">{savedUrl}</a>
            </div>
          )}
        </div>
      )}

      <div className="rounded-3xl p-4 border" style={{ background: '#fff', borderColor: 'var(--border)' }}>
        {qrDataUrl
          ? <img src={qrDataUrl} alt="QR" className="mx-auto max-w-full" />
          : <div className="h-52 flex items-center justify-center text-[var(--text-muted)]">QR preview</div>}
      </div>

      {showDownload && (
        <button onClick={handleDownload} disabled={!qrDataUrl} className="btn-secondary w-full">
          {t.download}
        </button>
      )}
    </div>
  )
}