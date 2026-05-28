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
  ar: {
    link: '🔗 رابط / إيميل', text: '📝 نص', whatsapp: '💬 واتساب',
    placeholder_text: 'اكتب نصك هنا... (بيانات تواصل، عنوان، وصف)',
    placeholder_phone: 'رقم الجوال مع كود الدولة (مثال: 966512345678)',
    placeholder_msg: 'رسالة ترحيب اختيارية...',
    download: '⬇️ تحميل PNG', save: '🔗 احفظ وشارك (30 يوم)',
    saving: 'جاري الحفظ...', copied: '✅ تم نسخ الرابط!',
    wa_label: 'رقم الواتساب', wa_msg_label: 'رسالة تلقائية (اختياري)',
    wa_hint: 'عند السكان على الكود سيفتح واتساب مباشرة',
  },
  en: {
    link: '🔗 Link / Email', text: '📝 Text', whatsapp: '💬 WhatsApp',
    placeholder_text: 'Type your text here...',
    placeholder_phone: 'Phone with country code (e.g. 966512345678)',
    placeholder_msg: 'Optional welcome message...',
    download: '⬇️ Download PNG', save: '🔗 Save & Share (30 days)',
    saving: 'Saving...', copied: '✅ Link copied!',
    wa_label: 'WhatsApp Number', wa_msg_label: 'Auto Message (optional)',
    wa_hint: 'Scanning opens WhatsApp directly',
  },
  zh: {
    link: '🔗 链接 / 邮箱', text: '📝 文字', whatsapp: '💬 WhatsApp',
    placeholder_text: '在此输入您的文字...',
    placeholder_phone: '含国家代码的电话号码',
    placeholder_msg: '可选欢迎消息...',
    download: '⬇️ 下载 PNG', save: '🔗 保存并分享 (30天)',
    saving: '保存中...', copied: '✅ 链接已复制!',
    wa_label: 'WhatsApp 号码', wa_msg_label: '自动消息（可选）',
    wa_hint: '扫描即可直接打开 WhatsApp',
  },
  fr: {
    link: '🔗 Lien / Email', text: '📝 Texte', whatsapp: '💬 WhatsApp',
    placeholder_text: 'Tapez votre texte ici...',
    placeholder_phone: 'Numéro avec indicatif pays',
    placeholder_msg: 'Message de bienvenue (optionnel)...',
    download: '⬇️ Télécharger PNG', save: '🔗 Sauvegarder & Partager (30 jours)',
    saving: 'Sauvegarde...', copied: '✅ Lien copié!',
    wa_label: 'Numéro WhatsApp', wa_msg_label: 'Message automatique (optionnel)',
    wa_hint: 'Le scan ouvre WhatsApp directement',
  },
  es: {
    link: '🔗 Enlace / Email', text: '📝 Texto', whatsapp: '💬 WhatsApp',
    placeholder_text: 'Escribe tu texto aquí...',
    placeholder_phone: 'Teléfono con código de país',
    placeholder_msg: 'Mensaje de bienvenida (opcional)...',
    download: '⬇️ Descargar PNG', save: '🔗 Guardar & Compartir (30 días)',
    saving: 'Guardando...', copied: '✅ ¡Enlace copiado!',
    wa_label: 'Número WhatsApp', wa_msg_label: 'Mensaje automático (opcional)',
    wa_hint: 'Al escanear abre WhatsApp directamente',
  },
}

type Locale = keyof typeof i18n
type Tab = 'link' | 'text' | 'whatsapp'

export default function QRGenerator({ initialValue = '', size = 220, showDownload = false }: QRGeneratorProps) {
  const pathname = usePathname()
  const locale = (['ar','en','zh','fr','es'].find(l => pathname?.startsWith(`/${l}`)) || 'ar') as Locale
  const t = i18n[locale]

  const [activeTab, setActiveTab] = useState<Tab>('link')
  const [linkValue,  setLinkValue]  = useState(initialValue)
  const [textValue,  setTextValue]  = useState('')
  const [waPhone,    setWaPhone]    = useState('')
  const [waMsg,      setWaMsg]      = useState('')
  const [qrDataUrl,  setQrDataUrl]  = useState('')
  const [saving,     setSaving]     = useState(false)
  const [savedUrl,   setSavedUrl]   = useState('')
  const [errorMsg,   setErrorMsg]   = useState('')

  // Build WhatsApp deep-link
  const waLink = waPhone.trim()
    ? `https://wa.me/${waPhone.trim().replace(/\D/g,'')}${waMsg.trim() ? `?text=${encodeURIComponent(waMsg.trim())}` : ''}`
    : DEFAULT_VALUE

  const previewValue =
    activeTab === 'link'      ? (linkValue.trim() ? (linkValue.startsWith('http') ? linkValue : `https://${linkValue}`) : DEFAULT_VALUE)
    : activeTab === 'text'    ? (textValue.trim() || DEFAULT_VALUE)
    : waLink

  useEffect(() => {
    // WhatsApp QR uses green color
    const dark = activeTab === 'whatsapp' ? '#25D366' : '#6B7EFF'
    QRCode.toDataURL(previewValue, {
      color: { dark, light: '#FFFFFF' }, margin: 1, width: size,
    }).then(setQrDataUrl).catch(() => setQrDataUrl(''))
  }, [previewValue, size, activeTab])

  function handleDownload() {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = activeTab === 'whatsapp' ? 'whatsapp-qr.png' : 'contactme-qr.png'
    a.click()
  }

  async function handleSaveText() {
    if (!textValue.trim()) return
    setSaving(true); setErrorMsg('')
    try {
      const res = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: textValue })
      })
      const data = await res.json()
      if (!res.ok) { setErrorMsg(`خطأ: ${data.error || res.status}`); return }
      if (data.url) {
        setSavedUrl(data.url); setLinkValue(data.url); setActiveTab('link')
        navigator.clipboard?.writeText(data.url)
      }
    } catch (err) {
      setErrorMsg(`خطأ في الاتصال: ${String(err)}`)
    } finally { setSaving(false) }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'link',      label: t.link },
    { id: 'text',      label: t.text },
    { id: 'whatsapp',  label: t.whatsapp },
  ]

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex gap-2 rounded-3xl border p-2" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSavedUrl(''); setErrorMsg('') }}
            className={`flex-1 rounded-2xl px-3 py-3 text-sm font-medium transition ${
              activeTab === tab.id
                ? tab.id === 'whatsapp'
                  ? 'bg-[#25D36618] text-[#25D366]'
                  : 'bg-[#EEF4FF] text-[var(--text)]'
                : 'text-[var(--text-muted)]'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Link tab */}
      {activeTab === 'link' && (
        <input type="text" value={linkValue} onChange={e => setLinkValue(e.target.value)}
          placeholder="https://contactme.cc/username" className="input-field w-full" dir="ltr" />
      )}

      {/* Text tab */}
      {activeTab === 'text' && (
        <div className="space-y-3">
          <textarea value={textValue} maxLength={500} onChange={e => setTextValue(e.target.value)}
            placeholder={t.placeholder_text}
            className="input-field w-full min-h-[120px] resize-none" />
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span/><span>{500 - textValue.length} / 500</span>
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

      {/* WhatsApp tab */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-3">
          {/* WhatsApp info banner */}
          <div className="flex items-center gap-3 p-3 rounded-2xl"
            style={{ background: '#25D36610', border: '1px solid #25D36630' }}>
            <span className="text-2xl">💬</span>
            <p className="text-xs" style={{ color: '#25D366' }}>{t.wa_hint}</p>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              {t.wa_label}
            </label>
            <input
              type="tel"
              value={waPhone}
              onChange={e => setWaPhone(e.target.value)}
              placeholder={t.placeholder_phone}
              className="input-field w-full"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              {t.wa_msg_label}
            </label>
            <textarea
              value={waMsg}
              onChange={e => setWaMsg(e.target.value)}
              placeholder={t.placeholder_msg}
              rows={3}
              maxLength={200}
              className="input-field w-full resize-none"
            />
            <div className="text-right text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {200 - waMsg.length} / 200
            </div>
          </div>

          {/* Live preview of generated link */}
          {waPhone.trim() && (
            <div className="rounded-xl p-3 text-xs break-all" dir="ltr"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: '#25D366' }}>
              {waLink}
            </div>
          )}
        </div>
      )}

      {/* QR Preview */}
      <div className="rounded-3xl p-4 border" style={{ background: '#fff', borderColor: 'var(--border)' }}>
        {qrDataUrl
          ? <img src={qrDataUrl} alt="QR" className="mx-auto max-w-full" />
          : <div className="h-52 flex items-center justify-center text-[var(--text-muted)]">QR preview</div>}
      </div>

      {/* Download */}
      {(showDownload || activeTab === 'whatsapp') && (
        <button onClick={handleDownload} disabled={!qrDataUrl}
          className="w-full py-3 rounded-2xl text-sm font-semibold disabled:opacity-40 transition"
          style={{
            background: activeTab === 'whatsapp' ? '#25D366' : 'var(--surface)',
            color: activeTab === 'whatsapp' ? '#fff' : 'var(--text)',
            border: activeTab === 'whatsapp' ? 'none' : '1px solid var(--border)',
          }}>
          {t.download}
        </button>
      )}
    </div>
  )
}
