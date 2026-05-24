'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Locale = 'ar' | 'en' | 'zh' | 'fr' | 'es'

const content: Record<Locale, {
  title: string
  titleHighlight: string
  subtitle: string
  currency: string
  mostPopular: string
  discountPlaceholder: string
  discountApply: string
  discountSuccess: string
  discountError: string
  plans: { badge: string; name: string; priceKey: 'free'|'individual'|'company'; period: string; features: string[]; notIncluded: string[]; cta: string; href: string; highlight: boolean; color: string }[]
}> = {
  ar: {
    title: 'اختر الخطة', titleHighlight: 'المناسبة لك', subtitle: 'ابدأ مجاناً وطوّر حسابك متى تشاء',
    currency: 'ريال', mostPopular: 'الأكثر طلباً', discountPlaceholder: 'كود الخصم',
    discountApply: 'تطبيق', discountSuccess: 'تم تطبيق الخصم!', discountError: 'الكود غير صحيح',
    plans: [
      { badge: '1', name: 'مجاني', priceKey: 'free', period: 'دائماً', color: 'from-gray-400 to-gray-500', features: ['بروفايل شخصي أساسي', '3 روابط', 'رمز QR أساسي', 'زر واتساب', 'إعلانات في البروفايل'], notIncluded: ['تحليلات', 'ماسح البطاقات', 'QR مخصص'], cta: 'ابدأ مجاناً', href: '/login?tab=register', highlight: false },
      { badge: '2', name: 'برو فردي', priceKey: 'individual', period: 'شهرياً', color: 'from-[#4B9EFF] to-[#8B5CF6]', features: ['روابط غير محدودة', 'بدون إعلانات', 'رمز QR مخصص الألوان', 'ماسح بطاقات الأعمال بالذكاء الاصطناعي', 'إحصائيات المشاهدات', 'زر واتساب + حجز'], notIncluded: ['حسابات الموظفين', 'كتالوج خدمات'], cta: 'ابدأ التجربة', href: '/login?tab=register&plan=pro_individual', highlight: true },
      { badge: '3', name: 'برو شركة', priceKey: 'company', period: 'شهرياً', color: 'from-[#8B5CF6] to-[#EC4899]', features: ['كل مميزات برو فردي', 'حسابات لـ 10 موظفين', 'كتالوج الخدمات', 'زر الحجز', 'إحصائيات الفريق', 'شعار الشركة'], notIncluded: [], cta: 'للشركات', href: '/login?tab=register&plan=pro_company', highlight: false },
    ],
  },
  en: {
    title: 'Choose the', titleHighlight: 'Right Plan', subtitle: 'Start free and upgrade anytime',
    currency: 'SAR', mostPopular: 'Most Popular', discountPlaceholder: 'Discount code',
    discountApply: 'Apply', discountSuccess: 'Discount applied!', discountError: 'Invalid code',
    plans: [
      { badge: '1', name: 'Free', priceKey: 'free', period: 'forever', color: 'from-gray-400 to-gray-500', features: ['Basic personal profile', '3 links', 'Basic QR code', 'WhatsApp button', 'Ads on profile'], notIncluded: ['Analytics', 'Card scanner', 'Custom QR'], cta: 'Start free', href: '/login?tab=register', highlight: false },
      { badge: '2', name: 'Pro Individual', priceKey: 'individual', period: 'monthly', color: 'from-[#4B9EFF] to-[#8B5CF6]', features: ['Unlimited links', 'No ads', 'Custom color QR code', 'AI business card scanner', 'View analytics', 'WhatsApp + booking button'], notIncluded: ['Team accounts', 'Service catalog'], cta: 'Start trial', href: '/login?tab=register&plan=pro_individual', highlight: true },
      { badge: '3', name: 'Pro Business', priceKey: 'company', period: 'monthly', color: 'from-[#8B5CF6] to-[#EC4899]', features: ['All Pro Individual features', '10 employee accounts', 'Service catalog', 'Booking button', 'Team analytics', 'Company logo'], notIncluded: [], cta: 'For businesses', href: '/login?tab=register&plan=pro_company', highlight: false },
    ],
  },
  zh: {
    title: '选择适合您的', titleHighlight: '套餐', subtitle: '免费开始，随时升级',
    currency: 'SAR', mostPopular: '最受欢迎', discountPlaceholder: '折扣码',
    discountApply: '应用', discountSuccess: '折扣已应用！', discountError: '无效代码',
    plans: [
      { badge: '1', name: '免费', priceKey: 'free', period: '永久', color: 'from-gray-400 to-gray-500', features: ['基本个人资料', '3个链接', '基本二维码', 'WhatsApp按钮', '个人资料广告'], notIncluded: ['分析', '名片扫描', '自定义二维码'], cta: '免费开始', href: '/login?tab=register', highlight: false },
      { badge: '2', name: '专业个人版', priceKey: 'individual', period: '每月', color: 'from-[#4B9EFF] to-[#8B5CF6]', features: ['无限链接', '无广告', '自定义颜色二维码', 'AI名片扫描', '查看统计', 'WhatsApp+预约按钮'], notIncluded: ['团队账户', '服务目录'], cta: '开始试用', href: '/login?tab=register&plan=pro_individual', highlight: true },
      { badge: '3', name: '专业企业版', priceKey: 'company', period: '每月', color: 'from-[#8B5CF6] to-[#EC4899]', features: ['所有专业个人版功能', '10个员工账户', '服务目录', '预约按钮', '团队统计', '公司标志'], notIncluded: [], cta: '企业版', href: '/login?tab=register&plan=pro_company', highlight: false },
    ],
  },
  fr: {
    title: 'Choisissez le', titleHighlight: 'bon forfait', subtitle: 'Commencez gratuitement et évoluez à tout moment',
    currency: 'SAR', mostPopular: 'Le plus populaire', discountPlaceholder: 'Code de réduction',
    discountApply: 'Appliquer', discountSuccess: 'Réduction appliquée !', discountError: 'Code invalide',
    plans: [
      { badge: '1', name: 'Gratuit', priceKey: 'free', period: 'toujours', color: 'from-gray-400 to-gray-500', features: ['Profil personnel de base', '3 liens', 'QR code basique', 'Bouton WhatsApp', 'Publicités sur le profil'], notIncluded: ['Analytiques', 'Scanner de cartes', 'QR personnalisé'], cta: 'Commencer gratuitement', href: '/login?tab=register', highlight: false },
      { badge: '2', name: 'Pro Individuel', priceKey: 'individual', period: 'mensuel', color: 'from-[#4B9EFF] to-[#8B5CF6]', features: ['Liens illimités', 'Sans publicités', 'QR code couleur personnalisé', 'Scanner IA', 'Analytiques des vues', 'WhatsApp + réservation'], notIncluded: ['Comptes équipe', 'Catalogue de services'], cta: "Commencer l'essai", href: '/login?tab=register&plan=pro_individual', highlight: true },
      { badge: '3', name: 'Pro Entreprise', priceKey: 'company', period: 'mensuel', color: 'from-[#8B5CF6] to-[#EC4899]', features: ['Toutes les fonctionnalités Pro', '10 comptes employés', 'Catalogue de services', 'Bouton réservation', 'Analytiques équipe', 'Logo entreprise'], notIncluded: [], cta: 'Pour les entreprises', href: '/login?tab=register&plan=pro_company', highlight: false },
    ],
  },
  es: {
    title: 'Elige el', titleHighlight: 'plan correcto', subtitle: 'Empieza gratis y mejora cuando quieras',
    currency: 'SAR', mostPopular: 'Más popular', discountPlaceholder: 'Código de descuento',
    discountApply: 'Aplicar', discountSuccess: '¡Descuento aplicado!', discountError: 'Código inválido',
    plans: [
      { badge: '1', name: 'Gratis', priceKey: 'free', period: 'siempre', color: 'from-gray-400 to-gray-500', features: ['Perfil personal básico', '3 enlaces', 'Código QR básico', 'Botón WhatsApp', 'Anuncios en perfil'], notIncluded: ['Analíticas', 'Escáner de tarjetas', 'QR personalizado'], cta: 'Empezar gratis', href: '/login?tab=register', highlight: false },
      { badge: '2', name: 'Pro Individual', priceKey: 'individual', period: 'mensual', color: 'from-[#4B9EFF] to-[#8B5CF6]', features: ['Enlaces ilimitados', 'Sin anuncios', 'QR personalizado', 'Escáner IA', 'Analíticas', 'WhatsApp + reserva'], notIncluded: ['Cuentas de equipo', 'Catálogo de servicios'], cta: 'Iniciar prueba', href: '/login?tab=register&plan=pro_individual', highlight: true },
      { badge: '3', name: 'Pro Empresa', priceKey: 'company', period: 'mensual', color: 'from-[#8B5CF6] to-[#EC4899]', features: ['Todas las funciones Pro', '10 cuentas de empleados', 'Catálogo de servicios', 'Botón reserva', 'Analíticas de equipo', 'Logo empresa'], notIncluded: [], cta: 'Para empresas', href: '/login?tab=register&plan=pro_company', highlight: false },
    ],
  },
}

interface Props { locale?: string }

export default function PricingSection({ locale = 'ar' }: Props) {
  const supabase = createClient()
  const c = content[(locale as Locale) in content ? locale as Locale : 'ar']
  const [prices, setPrices] = useState({ free: 0, individual: 15, company: 49 })
  const [discountCodes, setDiscountCodes] = useState<Record<string, number>>({})
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['prices', 'discount_codes'])
      if (data) {
        data.forEach(row => {
          if (row.key === 'prices') setPrices(row.value)
          if (row.key === 'discount_codes') setDiscountCodes(row.value)
        })
      }
    }
    load()
  }, [])

  function applyCode() {
    const upper = code.trim().toUpperCase()
    if (discountCodes[upper]) {
      setDiscount(discountCodes[upper])
      setStatus('success')
    } else {
      setDiscount(0)
      setStatus('error')
    }
  }

  function getPrice(priceKey: 'free' | 'individual' | 'company') {
    const price = prices[priceKey]
    if (price === 0 || discount === 0) return price
    return Math.round(price * (1 - discount / 100))
  }

  return (
    <section className="py-20 px-4" id="pricing">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {c.title} <span className="gradient-text">{c.titleHighlight}</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg mb-8">{c.subtitle}</p>
          <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
            <input type="text" value={code}
              onChange={e => { setCode(e.target.value); setStatus('idle') }}
              placeholder={c.discountPlaceholder}
              className="input text-center flex-1"
              onKeyDown={e => e.key === 'Enter' && applyCode()} />
            <button onClick={applyCode} className="btn-secondary px-4 py-2 text-sm whitespace-nowrap">
              {c.discountApply}
            </button>
          </div>
          {status === 'success' && <p className="text-green-500 text-sm mt-2">✅ {c.discountSuccess} ({discount}% خصم)</p>}
          {status === 'error' && <p className="text-red-400 text-sm mt-2">❌ {c.discountError}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {c.plans.map((plan) => {
            const finalPrice = getPrice(plan.priceKey)
            const originalPrice = prices[plan.priceKey]
            const hasDiscount = discount > 0 && originalPrice > 0
            return (
              <div key={plan.name}
                className={`relative rounded-2xl border overflow-hidden transition-transform hover:-translate-y-1 ${plan.highlight ? 'border-[#4B9EFF] shadow-xl shadow-blue-500/20' : 'border-[var(--border)]'}`}
                style={{ background: 'var(--surface)' }}>
                {plan.highlight && <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' }} />}
                {plan.highlight && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' }}>
                      {c.mostPopular}
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-gradient-to-br ${plan.color} text-white font-bold text-lg`}>
                    {plan.badge}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-6 flex-wrap">
                    {hasDiscount && <span className="text-2xl font-bold text-[var(--text-muted)] line-through opacity-50">{originalPrice}</span>}
                    <span className="text-4xl font-extrabold gradient-text">{finalPrice}</span>
                    <span className="text-[var(--text-muted)]">{c.currency} / {plan.period}</span>
                    {hasDiscount && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600 font-bold">-{discount}%</span>}
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                    {plan.notIncluded.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[var(--text-muted)] line-through">
                        <svg className="w-4 h-4 flex-shrink-0 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href} className={plan.highlight ? 'btn-primary w-full text-center' : 'btn-secondary w-full text-center'}>
                    {plan.cta}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
